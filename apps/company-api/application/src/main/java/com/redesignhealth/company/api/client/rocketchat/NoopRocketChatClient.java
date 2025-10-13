package com.redesignhealth.company.api.client.rocketchat;

import com.redesignhealth.company.api.client.rocketchat.dto.AuthInfo;
import com.redesignhealth.company.api.client.rocketchat.dto.UnreadResponse;
import com.redesignhealth.company.api.entity.ref.PersonRef;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.function.Consumer;
import lombok.extern.slf4j.Slf4j;

@Slf4j
public class NoopRocketChatClient implements RocketChatClient {
  @Override
  public Optional<AuthInfo> login(PersonRef user, String password) {
    log.info("Mock call to login");
    return Optional.empty();
  }

  @Override
  public Optional<String> createRoom(
      AuthInfo authInfo, List<PersonRef> userInvited, String roomName) {
    log.info("Mock call to createRoom");
    return Optional.empty();
  }

  @Override
  public Optional<Boolean> logout(AuthInfo authInfo) {
    log.info("Mock call to logout");
    return Optional.empty();
  }

  @Override
  public Optional<UnreadResponse> getUnreadsFromRoom(
      AuthInfo authInfo, String chatRoomId, String userId) {
    log.info("Mock call to getUnreadsFromRoom");
    return Optional.empty();
  }

  @Override
  public Optional<Map<String, String>> getMembersFromRoom(AuthInfo authInfo, String chatRoomId) {
    log.info("Mock call to getMembersFromRoom");
    return Optional.empty();
  }

  @Override
  public Optional<AuthInfo> createAuthUserToken(AuthInfo callingUser, PersonRef username) {
    log.info("Mock call to createAuthUserToken");
    return Optional.empty();
  }

  @Override
  public void withLogin(PersonRef user, String password, Consumer<AuthInfo> consumer) {
    log.info("Mock call to withLogin");
  }
}
