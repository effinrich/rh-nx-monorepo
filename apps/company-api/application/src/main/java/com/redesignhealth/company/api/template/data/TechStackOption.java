package com.redesignhealth.company.api.template.data;

public class TechStackOption {

  private String type;
  private String name;
  private boolean optIn;
  private String comment;

  public String getType() {
    return type;
  }

  public String getName() {
    return name;
  }

  public boolean isOptIn() {
    return optIn;
  }

  public String getComment() {
    return comment;
  }

  @Override
  public String toString() {
    return "TechStackOption{"
        + "type='"
        + type
        + '\''
        + ", name='"
        + name
        + '\''
        + ", optIn="
        + optIn
        + ", comment='"
        + comment
        + '\''
        + '}';
  }

  public static Builder builder() {
    return new Builder();
  }

  public static class Builder {

    private String type;

    private String name;
    private boolean optIn;
    private String comment;

    public TechStackOption build() {
      var option = new TechStackOption();
      option.type = type;
      option.name = name;
      option.optIn = optIn;
      option.comment = comment;
      return option;
    }

    public Builder type(String type) {
      this.type = type;
      return this;
    }

    public Builder name(String name) {
      this.name = name;
      return this;
    }

    public Builder optIn(boolean optIn) {
      this.optIn = optIn;
      return this;
    }

    public Builder comment(String comment) {
      this.comment = comment;
      return this;
    }
  }
}
