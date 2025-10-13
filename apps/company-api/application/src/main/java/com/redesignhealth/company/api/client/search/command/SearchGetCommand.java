package com.redesignhealth.company.api.client.search.command;

import java.util.Objects;
import org.springframework.util.Assert;

/** Get an individual document from a search server */
public class SearchGetCommand {
  private final SearchIndex index;
  private final String documentId;

  private SearchGetCommand(Builder builder) {
    Assert.notNull(builder.index, "Index must be provided.");
    this.index = builder.index;
    this.documentId = builder.documentId;
  }

  public static Builder builder() {
    return new Builder();
  }

  public SearchIndex getIndex() {
    return index;
  }

  public String getDocumentId() {
    return documentId;
  }

  public static class Builder {
    private SearchIndex index;
    private String documentId;

    public SearchGetCommand build() {
      return new SearchGetCommand(this);
    }

    public Builder index(SearchIndex index) {
      this.index = index;
      return this;
    }

    public Builder documentId(String documentId) {
      this.documentId = documentId;
      return this;
    }
  }

  @Override
  public boolean equals(Object o) {
    if (this == o) return true;
    if (o == null || getClass() != o.getClass()) return false;
    SearchGetCommand that = (SearchGetCommand) o;
    return index == that.index && Objects.equals(documentId, that.documentId);
  }

  @Override
  public int hashCode() {
    return Objects.hash(index, documentId);
  }

  @Override
  public String toString() {
    return "SearchGetCommand{" + "index=" + index + ", documentId='" + documentId + '\'' + '}';
  }
}
