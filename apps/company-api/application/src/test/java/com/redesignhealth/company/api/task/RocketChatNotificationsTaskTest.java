package com.redesignhealth.company.api.task;

import static com.redesignhealth.company.api.entity.request.RoleAuthority.ROLE_OP_CO_USER;
import static com.redesignhealth.company.api.scaffolding.Fixtures.testIpMarketplaceCompany;
import static com.redesignhealth.company.api.scaffolding.Fixtures.testPerson;
import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.doCallRealMethod;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.redesignhealth.company.api.client.email.EmailSender;
import com.redesignhealth.company.api.client.rocketchat.RocketChatClientImpl;
import com.redesignhealth.company.api.client.rocketchat.dto.AuthInfo;
import com.redesignhealth.company.api.client.rocketchat.dto.UnreadResponse;
import com.redesignhealth.company.api.dto.BuyerAndSellerChattingDto;
import com.redesignhealth.company.api.dto.command.ipMarketplace.IpMarketplaceNewMessageChatCommand;
import com.redesignhealth.company.api.dto.enums.CompanyMemberStatus;
import com.redesignhealth.company.api.entity.CompanyMember;
import com.redesignhealth.company.api.entity.Person;
import com.redesignhealth.company.api.entity.RocketChatCheckMonitoring;
import com.redesignhealth.company.api.entity.TaskHistory;
import com.redesignhealth.company.api.entity.ref.PersonRef;
import com.redesignhealth.company.api.entity.ref.TaskRef;
import com.redesignhealth.company.api.repository.IpMarketplaceTrackRepository;
import com.redesignhealth.company.api.repository.RocketChatCheckMonitoringRepository;
import com.redesignhealth.company.api.repository.TaskRepository;
import java.net.URI;
import java.time.Instant;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.function.Consumer;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
public class RocketChatNotificationsTaskTest {
  @Mock TaskRepository taskRepository;
  @Mock EmailSender emailSender;
  @Mock RocketChatClientImpl rocketChatClient;
  @Mock RocketChatCheckMonitoringRepository rocketChatCheckMonitoringRepository;
  @Mock IpMarketplaceTrackRepository ipMarketplaceTrackRepository;
  TaskHistory taskHistory =
      TaskHistory.from(TaskRef.of(RocketChatNotificationsTask.class.getName()));

  private RocketChatCheckMonitoring rocketChatMonitoringBuyer;
  private RocketChatCheckMonitoring rocketChatMonitoringSeller;
  private Instant newLastCheck;
  private Instant lastCheck;
  private Person buyerPerson;
  private Person sellerPerson;
  private String chatRoomId;
  private AuthInfo authInfo;
  private String sellerEmail;
  private String buyerEmail;
  private Map<String, String> chatMembers;

  @BeforeEach
  void init() {
    sellerEmail = "seller@seller.com";
    buyerEmail = "buyer@buyer.com";
    sellerPerson = testPerson(ROLE_OP_CO_USER, sellerEmail);
    buyerPerson = testPerson(ROLE_OP_CO_USER, buyerEmail);
    var company = testIpMarketplaceCompany(sellerPerson);
    var companyMember = new CompanyMember(company, sellerPerson, CompanyMemberStatus.ACTIVE);
    sellerPerson.setMemberOf(Set.of(companyMember));
    var buyerCompany = testIpMarketplaceCompany(buyerPerson);
    var buyerCompanyMember =
        new CompanyMember(buyerCompany, buyerPerson, CompanyMemberStatus.ACTIVE);
    buyerPerson.setMemberOf(Set.of(buyerCompanyMember));
    authInfo = new AuthInfo("userId", "authToken");
    chatRoomId = "roomId";
    var buyerAndSellerChatting =
        new BuyerAndSellerChattingDto(buyerPerson, sellerPerson, chatRoomId, "ipMarketPlaceName");
    lastCheck = Instant.now();
    rocketChatMonitoringSeller = new RocketChatCheckMonitoring();
    rocketChatMonitoringSeller.setRoomId(chatRoomId);
    rocketChatMonitoringSeller.setUser(sellerPerson);
    rocketChatMonitoringSeller.setLastCheck(lastCheck);

    rocketChatMonitoringBuyer = new RocketChatCheckMonitoring();
    rocketChatMonitoringBuyer.setRoomId(chatRoomId);
    rocketChatMonitoringBuyer.setUser(buyerPerson);
    rocketChatMonitoringBuyer.setLastCheck(lastCheck);

    when(taskRepository.findByName(taskHistory.getName())).thenReturn(Optional.of(taskHistory));
    when(rocketChatClient.login(any(PersonRef.class), any(String.class)))
        .thenReturn(Optional.of(authInfo));
    when(rocketChatClient.logout(eq(authInfo))).thenReturn(Optional.of(true));
    when(ipMarketplaceTrackRepository.getBuyerAndSellerChatting())
        .thenReturn(List.of(buyerAndSellerChatting));
    chatMembers =
        Map.of(sellerEmail.replace('@', '.'), "userId", buyerEmail.replace('@', '.'), "userId2");
    newLastCheck = Instant.now();
    doCallRealMethod()
        .when(rocketChatClient)
        .withLogin(any(PersonRef.class), any(String.class), any(Consumer.class));
  }

  @Test
  public void
      Test_When_There_Are_People_Chatting_And_Monitoring_Status_For_A_Room_Was_Checked_Before_And_There_Are_New_Unread_Messages_There() {
    when(rocketChatClient.getUnreadsFromRoom(
            eq(authInfo), eq(chatRoomId), eq(chatMembers.get(sellerEmail.replace('@', '.')))))
        .thenReturn(Optional.of(new UnreadResponse(2, newLastCheck)));
    when(rocketChatClient.getUnreadsFromRoom(
            eq(authInfo), eq(chatRoomId), eq(chatMembers.get(buyerEmail.replace('@', '.')))))
        .thenReturn(Optional.of(new UnreadResponse(1, newLastCheck)));
    when(rocketChatCheckMonitoringRepository.findByUserAndRoomId(eq(buyerPerson), eq(chatRoomId)))
        .thenReturn(Optional.of(rocketChatMonitoringBuyer));
    when(rocketChatCheckMonitoringRepository.findByUserAndRoomId(eq(sellerPerson), eq(chatRoomId)))
        .thenReturn(Optional.of(rocketChatMonitoringSeller));
    when(rocketChatClient.getMembersFromRoom(eq(authInfo), eq(chatRoomId)))
        .thenReturn(Optional.of(chatMembers));
    var task =
        new RocketChatNotificationsTask(
            taskRepository,
            emailSender,
            rocketChatClient,
            rocketChatCheckMonitoringRepository,
            ipMarketplaceTrackRepository,
            "notificationUser",
            "notificationPassword",
            URI.create("portalHostName"));
    task.run();
    assertThat(taskHistory.hasRun()).isTrue();
    verify(emailSender, times(2))
        .sendNewMessageNotificationChat(any(IpMarketplaceNewMessageChatCommand.class));
    verify(rocketChatCheckMonitoringRepository, times(2))
        .save(any(RocketChatCheckMonitoring.class));
    assertThat(rocketChatMonitoringBuyer.getLastCheck()).isEqualTo(newLastCheck);
    assertThat(rocketChatMonitoringSeller.getLastCheck()).isEqualTo(newLastCheck);
  }

  @Test
  public void
      Test_When_There_Are_People_Chatting_And_Monitoring_Status_For_A_Room_Never_Was_Checked_Before_And_There_Are_New_Unread_Messages_There() {
    when(rocketChatClient.getUnreadsFromRoom(
            eq(authInfo), eq(chatRoomId), eq(chatMembers.get(sellerEmail.replace('@', '.')))))
        .thenReturn(Optional.of(new UnreadResponse(2, newLastCheck)));
    when(rocketChatClient.getUnreadsFromRoom(
            eq(authInfo), eq(chatRoomId), eq(chatMembers.get(buyerEmail.replace('@', '.')))))
        .thenReturn(Optional.of(new UnreadResponse(1, newLastCheck)));
    when(rocketChatCheckMonitoringRepository.findByUserAndRoomId(eq(buyerPerson), eq(chatRoomId)))
        .thenReturn(Optional.empty());
    when(rocketChatCheckMonitoringRepository.findByUserAndRoomId(eq(sellerPerson), eq(chatRoomId)))
        .thenReturn(Optional.empty());
    when(rocketChatClient.getMembersFromRoom(eq(authInfo), eq(chatRoomId)))
        .thenReturn(Optional.of(chatMembers));
    var task =
        new RocketChatNotificationsTask(
            taskRepository,
            emailSender,
            rocketChatClient,
            rocketChatCheckMonitoringRepository,
            ipMarketplaceTrackRepository,
            "notificationUser",
            "notificationPassword",
            URI.create("portalHostName"));
    task.run();
    assertThat(taskHistory.hasRun()).isTrue();
    verify(emailSender, times(2))
        .sendNewMessageNotificationChat(any(IpMarketplaceNewMessageChatCommand.class));
    verify(rocketChatCheckMonitoringRepository, times(2))
        .save(any(RocketChatCheckMonitoring.class));
  }

  @Test
  public void
      Test_When_There_Are_People_Chatting_And_Monitoring_Status_For_A_Room_Was_Checked_Before_And_There_Are_Not_New_Unread_Messages_There() {
    when(rocketChatCheckMonitoringRepository.findByUserAndRoomId(eq(buyerPerson), eq(chatRoomId)))
        .thenReturn(Optional.of(rocketChatMonitoringBuyer));
    when(rocketChatCheckMonitoringRepository.findByUserAndRoomId(eq(sellerPerson), eq(chatRoomId)))
        .thenReturn(Optional.of(rocketChatMonitoringSeller));
    when(rocketChatClient.getUnreadsFromRoom(
            eq(authInfo), eq(chatRoomId), eq(chatMembers.get(sellerEmail.replace('@', '.')))))
        .thenReturn(Optional.of(new UnreadResponse(2, lastCheck)));
    when(rocketChatClient.getUnreadsFromRoom(
            eq(authInfo), eq(chatRoomId), eq(chatMembers.get(buyerEmail.replace('@', '.')))))
        .thenReturn(Optional.of(new UnreadResponse(1, lastCheck)));
    when(rocketChatClient.getMembersFromRoom(eq(authInfo), eq(chatRoomId)))
        .thenReturn(Optional.of(chatMembers));
    var task =
        new RocketChatNotificationsTask(
            taskRepository,
            emailSender,
            rocketChatClient,
            rocketChatCheckMonitoringRepository,
            ipMarketplaceTrackRepository,
            "notificationUser",
            "notificationPassword",
            URI.create("portalHostName"));
    task.run();
    assertThat(taskHistory.hasRun()).isTrue();
    verify(emailSender, never())
        .sendNewMessageNotificationChat(any(IpMarketplaceNewMessageChatCommand.class));
    verify(rocketChatCheckMonitoringRepository, never()).save(any(RocketChatCheckMonitoring.class));
  }

  @Test
  public void
      Test_When_There_Are_People_Chatting_And_Monitoring_Status_For_A_Room_Was_Never_Checked_Before_And_There_Are_Not_New_Unread_Messages_There() {
    when(rocketChatCheckMonitoringRepository.findByUserAndRoomId(eq(buyerPerson), eq(chatRoomId)))
        .thenReturn(Optional.empty());
    when(rocketChatCheckMonitoringRepository.findByUserAndRoomId(eq(sellerPerson), eq(chatRoomId)))
        .thenReturn(Optional.empty());
    when(rocketChatClient.getUnreadsFromRoom(
            eq(authInfo), eq(chatRoomId), eq(chatMembers.get(sellerEmail.replace('@', '.')))))
        .thenReturn(Optional.empty());
    when(rocketChatClient.getUnreadsFromRoom(
            eq(authInfo), eq(chatRoomId), eq(chatMembers.get(buyerEmail.replace('@', '.')))))
        .thenReturn(Optional.empty());
    when(rocketChatClient.getMembersFromRoom(eq(authInfo), eq(chatRoomId)))
        .thenReturn(Optional.of(chatMembers));
    var task =
        new RocketChatNotificationsTask(
            taskRepository,
            emailSender,
            rocketChatClient,
            rocketChatCheckMonitoringRepository,
            ipMarketplaceTrackRepository,
            "notificationUser",
            "notificationPassword",
            URI.create("portalHostName"));
    task.run();
    assertThat(taskHistory.hasRun()).isTrue();
    verify(emailSender, never())
        .sendNewMessageNotificationChat(any(IpMarketplaceNewMessageChatCommand.class));
    verify(rocketChatCheckMonitoringRepository, never()).save(any(RocketChatCheckMonitoring.class));
  }

  @Test
  public void Test_When_There_Are_Not_People_Chatting() {
    when(ipMarketplaceTrackRepository.getBuyerAndSellerChatting()).thenReturn(List.of());
    var task =
        new RocketChatNotificationsTask(
            taskRepository,
            emailSender,
            rocketChatClient,
            rocketChatCheckMonitoringRepository,
            ipMarketplaceTrackRepository,
            "notificationUser",
            "notificationPassword",
            URI.create("portalHostName"));
    task.run();
    assertThat(taskHistory.hasRun()).isTrue();
    verify(emailSender, never())
        .sendNewMessageNotificationChat(any(IpMarketplaceNewMessageChatCommand.class));
    verify(rocketChatCheckMonitoringRepository, never()).save(any(RocketChatCheckMonitoring.class));
  }
}
