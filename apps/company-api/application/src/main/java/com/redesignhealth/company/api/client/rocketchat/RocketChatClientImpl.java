package com.redesignhealth.company.api.client.rocketchat;

import com.redesignhealth.company.api.client.rocketchat.dto.AuthInfo;
import com.redesignhealth.company.api.client.rocketchat.dto.CreateRoomResponse;
import com.redesignhealth.company.api.client.rocketchat.dto.GroupCountersResponse;
import com.redesignhealth.company.api.client.rocketchat.dto.GroupMembersResponse;
import com.redesignhealth.company.api.client.rocketchat.dto.LoginResponse;
import com.redesignhealth.company.api.client.rocketchat.dto.LogoutResponse;
import com.redesignhealth.company.api.client.rocketchat.dto.UnreadResponse;
import com.redesignhealth.company.api.client.rocketchat.dto.UserCreateTokenResponse;
import com.redesignhealth.company.api.entity.ref.PersonRef;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.function.Consumer;
import org.springframework.web.reactive.function.client.WebClient;

public class RocketChatClientImpl implements RocketChatClient {
  private final WebClient client;

  public RocketChatClientImpl(String baseUrl) {
    client = WebClient.builder().baseUrl(baseUrl).build();
  }

  @Override
  public Optional<AuthInfo> login(PersonRef user, String password) {
    Map<String, String> body = new HashMap<>();
    body.put("user", user.value());
    body.put("password", password);
    return client
        .post()
        .uri("/api/v1/login")
        .bodyValue(body)
        .retrieve()
        .bodyToMono(LoginResponse.class)
        .blockOptional()
        .map(
            loginResponse ->
                new AuthInfo(
                    loginResponse.getData().getUserId(), loginResponse.getData().getAuthToken()));
  }

  @Override
  public Optional<String> createRoom(
      AuthInfo authInfo, List<PersonRef> userInvited, String roomName) {
    Map<String, Object> body = new HashMap<>();
    body.put("members", userInvited.stream().map(PersonRef::value).toList());
    body.put("name", roomName);
    return client
        .post()
        .uri("/api/v1/groups.create")
        .header("X-Auth-Token", authInfo.getAuthToken())
        .header("X-User-Id", authInfo.getUserId())
        .bodyValue(body)
        .retrieve()
        .bodyToMono(CreateRoomResponse.class)
        .blockOptional()
        .map(createRoomResponse -> createRoomResponse.getGroup().get("_id").toString());
  }

  @Override
  public Optional<Boolean> logout(AuthInfo authInfo) {
    return client
        .post()
        .uri("/api/v1/logout")
        .header("X-Auth-Token", authInfo.getAuthToken())
        .header("X-User-Id", authInfo.getUserId())
        .retrieve()
        .bodyToMono(LogoutResponse.class)
        .blockOptional()
        .map(logoutResponse -> logoutResponse.getStatus().equals("success"));
  }

  @Override
  public Optional<UnreadResponse> getUnreadsFromRoom(
      AuthInfo authInfo, String chatRoomId, String userId) {
    return client
        .get()
        .uri(
            uriBuilder ->
                uriBuilder
                    .path("/api/v1/groups.counters")
                    .queryParam("roomId", "{chatRoomId}")
                    .queryParam("userId", "{userId}")
                    .build(chatRoomId, userId))
        .header("X-Auth-Token", authInfo.getAuthToken())
        .header("X-User-Id", authInfo.getUserId())
        .retrieve()
        .bodyToMono(GroupCountersResponse.class)
        .blockOptional()
        .map(
            groupCountersResponse ->
                new UnreadResponse(
                    groupCountersResponse.getUnreads(), groupCountersResponse.getUnreadsFrom()));
  }

  @Override
  public Optional<Map<String, String>> getMembersFromRoom(AuthInfo authInfo, String chatRoomId) {
    return client
        .get()
        .uri(
            uriBuilder ->
                uriBuilder
                    .path("/api/v1/groups.members")
                    .queryParam("roomId", "{chatRoomId}")
                    .build(chatRoomId))
        .header("X-Auth-Token", authInfo.getAuthToken())
        .header("X-User-Id", authInfo.getUserId())
        .retrieve()
        .bodyToMono(GroupMembersResponse.class)
        .blockOptional()
        .map(
            groupMembersResponse -> {
              var results = new HashMap<String, String>();
              groupMembersResponse
                  .getMembers()
                  .forEach(member -> results.put(member.get("username"), member.get("_id")));
              return results;
            });
  }

  @Override
  public Optional<AuthInfo> createAuthUserToken(AuthInfo callingUser, PersonRef username) {
    Map<String, String> body = new HashMap<>();
    body.put("username", username.getEmail());
    return client
        .post()
        .uri("/api/v1/users.createToken")
        .header("X-Auth-Token", callingUser.getAuthToken())
        .header("X-User-Id", callingUser.getUserId())
        .bodyValue(body)
        .retrieve()
        .bodyToMono(UserCreateTokenResponse.class)
        .blockOptional()
        .map(
            userCreateTokenResponse ->
                new AuthInfo(
                    userCreateTokenResponse.getData().get("userId"),
                    userCreateTokenResponse.getData().get("authToken")));
  }

  @Override
  public void withLogin(PersonRef user, String password, Consumer<AuthInfo> consumer) {
    login(user, password)
        .ifPresent(
            authInfo -> {
              consumer.accept(authInfo);
              logout(authInfo);
            });
  }
}
