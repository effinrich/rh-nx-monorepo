package com.redesignhealth.company.api.client.message;

/** Interface for managing messages from external services */
public class Message<T> {
  /** Content of payload from message */
  private T content;

  /** Identifier used by messaging service. May be different from content's id. */
  private String id;

  public static <T> Message<T> of(T content, String id) {
    var m = new Message<T>();
    m.content = content;
    m.id = id;
    return m;
  }

  public T getContent() {
    return content;
  }

  public String getId() {
    return id;
  }
}
