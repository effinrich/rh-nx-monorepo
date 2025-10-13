package com.redesignhealth.company.api.config;

import com.redesignhealth.company.api.client.rocketchat.NoopRocketChatClient;
import com.redesignhealth.company.api.client.rocketchat.RocketChatClient;
import com.redesignhealth.company.api.client.rocketchat.RocketChatClientImpl;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RocketChatClientConfig {
  @Bean
  public RocketChatClient rocketChatClientImpl(
      @Value("${rocket-chat-service.base-url:}") String baseUrl) {
    if (!baseUrl.isEmpty()) return new RocketChatClientImpl(baseUrl);
    else return new NoopRocketChatClient();
  }
}
