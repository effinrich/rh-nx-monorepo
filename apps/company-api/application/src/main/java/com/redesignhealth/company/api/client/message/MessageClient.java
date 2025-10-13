package com.redesignhealth.company.api.client.message;

import java.util.List;

public interface MessageClient<T> {

  List<Message<T>> receiveMessages();

  void deleteMessage(Message<T> message);
}
