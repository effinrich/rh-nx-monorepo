package com.redesignhealth.company.api.client.message;

import java.util.List;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class NoopMessageClient<T> implements MessageClient<T> {
  private static final Logger logger = LoggerFactory.getLogger(NoopMessageClient.class);

  @Override
  public List<Message<T>> receiveMessages() {
    logger.info("Mocking call to receive messages");
    return List.of();
  }

  @Override
  public void deleteMessage(Message<T> message) {
    logger.info("Mocking call to delete messages");
  }
}
