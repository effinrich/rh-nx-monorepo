package com.redesignhealth.company.api.template.data;

import static java.util.Map.entry;

import java.util.Map;

public class FormAnswer {

  public static String Q1 =
      "Will the service be collecting any personal information about your employees, your contractors, Redesign Health Employees, customers, partners, patients or anyone else who would be part of the system? Select one response.";
  public static String Q2 =
      "Will the service be collecting any medical information (Protected Health Information) about patients or system users? Select one response.";
  public static String Q3_A =
      "Will the service be collecting any financial information about your company, Redesign Health, your partners, your patients, your employees or any other users? Select one response.";
  public static String Q3_B =
      "Will your service be collecting any Credit Card data in any way, shape or form? Select one response.";
  public static String Q3_C =
      "How will the financial information be stored? Select all that apply.";
  public static String Q4 =
      "Will the service be collecting any additional Proprietary information about your company, Redesign Health, your partners, your patients, your employees or any other users? Select one response.";
  public static String Q5_A =
      "Is the information that is collected stored in your system? Select one response.";
  public static String Q5_B =
      "If the information is stored, where will it be stored? Please provide detail if known.";
  public static String Q6_A =
      "Will the information collected be transmitted outside of your system? Select one response.";
  public static String Q6_B =
      "If the information is transmitted outside your system, how is it done? Please provide detail if known.";
  public static String Q7 =
      "After data is used, is it destroyed or masked when it is no longer needed? Select all that apply.";

  public static Map<String, String> questions =
      Map.ofEntries(
          entry("q1-a", Q1),
          entry("q2-a", Q2),
          entry("q3-a", Q3_A),
          entry("q3-b", Q3_B),
          entry("q3-c", Q3_C),
          entry("q4-a", Q4),
          entry("q5-a", Q5_A),
          entry("q5-b", Q5_B),
          entry("q6-a", Q6_A),
          entry("q6-b", Q6_B),
          entry("q7-a", Q7));

  private String question;
  private String answer;
  private String comment;

  public FormAnswer(String questionKey) {
    this.question = questions.getOrDefault(questionKey, questionKey);
  }

  public String getQuestion() {
    return question;
  }

  public String getAnswer() {
    return answer;
  }

  public String getComment() {
    return comment;
  }

  public void setAnswer(String answer) {
    this.answer = answer;
  }

  public void setComment(String comment) {
    this.comment = comment;
  }

  public static Builder builder(String questionKey) {
    return new Builder(questionKey);
  }

  public static class Builder {
    private String questionKey;
    private String answer;
    private String comment;

    public Builder(String questionKey) {
      this.questionKey = questionKey;
    }

    public FormAnswer build() {
      var formAnswer = new FormAnswer(questionKey);
      formAnswer.answer = answer;
      formAnswer.comment = comment;
      return formAnswer;
    }

    public Builder answer(String answer) {
      this.answer = answer;
      return this;
    }

    public Builder comment(String comment) {
      this.comment = comment;
      return this;
    }
  }
}
