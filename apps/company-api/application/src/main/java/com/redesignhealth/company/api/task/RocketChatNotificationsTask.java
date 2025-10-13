package com.redesignhealth.company.api.task;

import static com.redesignhealth.company.api.util.EntityUtil.getCompanyFromFirstCompanyMember;

import com.redesignhealth.company.api.client.email.EmailSender;
import com.redesignhealth.company.api.client.rocketchat.RocketChatClient;
import com.redesignhealth.company.api.client.rocketchat.dto.AuthInfo;
import com.redesignhealth.company.api.dto.BuyerAndSellerChattingDto;
import com.redesignhealth.company.api.dto.command.ipMarketplace.IpMarketplaceNewMessageChatCommand;
import com.redesignhealth.company.api.entity.Person;
import com.redesignhealth.company.api.entity.RocketChatCheckMonitoring;
import com.redesignhealth.company.api.entity.ref.PersonRef;
import com.redesignhealth.company.api.repository.IpMarketplaceTrackRepository;
import com.redesignhealth.company.api.repository.RocketChatCheckMonitoringRepository;
import com.redesignhealth.company.api.repository.TaskRepository;
import java.net.URI;
import java.time.Instant;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.TimeUnit;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
@Slf4j
public class RocketChatNotificationsTask extends TaskDefinition {
  private final EmailSender emailSender;
  private final RocketChatClient rocketChatClient;
  private final RocketChatCheckMonitoringRepository rocketChatCheckMonitoringRepository;
  private final IpMarketplaceTrackRepository ipMarketplaceTrackRepository;
  private final String rocketChatUserNotification;
  private final String rocketChatPasswordNotification;
  private final URI portalHostname;
  public Optional<AuthInfo> authInfo;

  public RocketChatNotificationsTask(
      TaskRepository taskRepository,
      EmailSender emailSender,
      RocketChatClient rocketChatClient,
      RocketChatCheckMonitoringRepository rocketChatCheckMonitoringRepository,
      IpMarketplaceTrackRepository ipMarketplaceTrackRepository,
      @Value("${rocket-chat-service.notifications.username}") String rocketChatUserNotification,
      @Value("${rocket-chat-service.notifications.password}") String rocketChatPasswordNotification,
      @Value("${notification.portal.hostname}") URI portalHostname) {
    super(taskRepository);
    this.emailSender = emailSender;
    this.rocketChatClient = rocketChatClient;
    this.rocketChatCheckMonitoringRepository = rocketChatCheckMonitoringRepository;
    this.ipMarketplaceTrackRepository = ipMarketplaceTrackRepository;
    this.rocketChatUserNotification = rocketChatUserNotification;
    this.rocketChatPasswordNotification = rocketChatPasswordNotification;
    this.portalHostname = portalHostname;
  }

  @Scheduled(
      fixedRateString = "${rocket-chat-service.notifications.schedule}",
      timeUnit = TimeUnit.MINUTES)
  public void run() {
    runTask(true);
  }

  @Override
  public void runTaskInternal() {
    this.rocketChatClient.withLogin(
        PersonRef.of(this.rocketChatUserNotification),
        this.rocketChatPasswordNotification,
        (authInfo) -> {
          var buyerAndSellerChattingList = ipMarketplaceTrackRepository.getBuyerAndSellerChatting();
          for (BuyerAndSellerChattingDto buyerAndSellerChatting : buyerAndSellerChattingList) {
            var roomId = buyerAndSellerChatting.roomId();
            // userName -> userId
            var chatMembers =
                this.rocketChatClient.getMembersFromRoom(authInfo, roomId).orElse(Map.of());
            if (!chatMembers.isEmpty()) {
              var ipMarketPlaceName = buyerAndSellerChatting.ipMarketplaceName();
              var replierCompanyNameForTheBuyer =
                  getCompanyFromFirstCompanyMember(buyerAndSellerChatting.seller()).getName();
              sendNotifications(
                  buyerAndSellerChatting.buyer(),
                  roomId,
                  ipMarketPlaceName,
                  replierCompanyNameForTheBuyer,
                  authInfo,
                  chatMembers);
              var replierCompanyNameForTheSeller =
                  getCompanyFromFirstCompanyMember(buyerAndSellerChatting.buyer()).getName();
              sendNotifications(
                  buyerAndSellerChatting.seller(),
                  roomId,
                  ipMarketPlaceName,
                  replierCompanyNameForTheSeller,
                  authInfo,
                  chatMembers);
            }
          }
        });
  }

  private void sendNotifications(
      Person user,
      String roomId,
      String ipMarketplaceName,
      String replierCompanyName,
      AuthInfo authInfo,
      Map<String, String> chatMembers) {
    var email = user.getEmail();
    var rocketChatCheckMonitoring =
        this.rocketChatCheckMonitoringRepository.findByUserAndRoomId(user, roomId);
    // replace("@", ".") => we will define the username in RC as the email without @ because
    // username attribute
    // doesn't support that character in its value.
    var unreadResponse =
        this.rocketChatClient.getUnreadsFromRoom(
            authInfo, roomId, chatMembers.get(email.getEmail().replace("@", ".")));
    rocketChatCheckMonitoring.ifPresentOrElse(
        monitoring ->
            unreadResponse.ifPresent(
                unread -> {
                  if (unread.getUnreadsFrom().compareTo(monitoring.getLastCheck()) > 0
                      && unread.getUnreads() > 0) {
                    sendEmailNotification(
                        user.getGivenName(),
                        ipMarketplaceName,
                        replierCompanyName,
                        unread.getUnreads(),
                        email.getEmail());
                    persistRocketChatMonitoring(monitoring, unread.getUnreadsFrom());
                  }
                }),
        () ->
            unreadResponse.ifPresent(
                unread -> {
                  if (unread.getUnreads() > 0)
                    sendEmailNotification(
                        user.getGivenName(),
                        ipMarketplaceName,
                        replierCompanyName,
                        unread.getUnreads(),
                        email.getEmail());
                  var monitoring = new RocketChatCheckMonitoring();
                  monitoring.setUser(user);
                  monitoring.setRoomId(roomId);
                  persistRocketChatMonitoring(monitoring, unread.getUnreadsFrom());
                }));
  }

  private void persistRocketChatMonitoring(
      RocketChatCheckMonitoring monitoring, Instant lastCheck) {
    monitoring.setLastCheck(lastCheck);
    rocketChatCheckMonitoringRepository.save(monitoring);
  }

  private void sendEmailNotification(
      String firstName,
      String ipMarketplaceName,
      String replierCompanyName,
      int unreads,
      String email) {
    var ipMarketplaceNewMessageChatCommand =
        IpMarketplaceNewMessageChatCommand.of(
            firstName, ipMarketplaceName, replierCompanyName, unreads, email, portalHostname);
    emailSender.sendNewMessageNotificationChat(ipMarketplaceNewMessageChatCommand);
  }
}
