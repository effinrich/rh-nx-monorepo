package com.redesignhealth.company.api.client.rocketchat;

import com.redesignhealth.company.api.client.rocketchat.dto.AuthInfo;
import com.redesignhealth.company.api.client.rocketchat.dto.UnreadResponse;
import com.redesignhealth.company.api.entity.ref.PersonRef;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.function.Consumer;

public interface RocketChatClient {
  Optional<AuthInfo> login(PersonRef user, String password);

  Optional<String> createRoom(AuthInfo authInfo, List<PersonRef> userInvited, String roomName);

  Optional<Boolean> logout(AuthInfo authInfo);

  Optional<UnreadResponse> getUnreadsFromRoom(AuthInfo authInfo, String chatRoomId, String userId);

  Optional<Map<String, String>> getMembersFromRoom(AuthInfo authInfo, String chatRoomId);

  Optional<AuthInfo> createAuthUserToken(AuthInfo callingUser, PersonRef username);

  void withLogin(PersonRef user, String password, Consumer<AuthInfo> consumer);
}
