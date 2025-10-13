package com.redesignhealth.company.api.client.search.utils;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertEquals;

import com.redesignhealth.company.api.client.search.entity.CeoDirectoryDoc;
import com.redesignhealth.company.api.client.search.entity.SearchResult;
import com.redesignhealth.company.api.property.EntityConverter;
import java.util.List;
import java.util.Map;
import org.junit.jupiter.api.Test;

class SanitizerTests {

  @Test
  public void testSanitizeHighlightedText_returns_result_if_no_highlighted_text() {
    Map<String, List<String>> highlightedText = null;
    var input = SearchResult.of(CeoDirectoryDoc.builder().build(), highlightedText, "12345");

    var result = Sanitizer.sanitizeHighlightedText(input, new EntityConverter(Map.of()));
    assertThat(result).isEqualTo(input);
  }

  @Test
  public void testSanitizeHighlightedText_returns_search_field_name_if_dne() {
    var highlightedText = Map.of("field_1", List.of("highlighted text"));
    var fieldNameConverter = new EntityConverter(Map.of("field2", "field_2"));
    var input = SearchResult.of(CeoDirectoryDoc.builder().build(), highlightedText, "12345");

    var result = Sanitizer.sanitizeHighlightedText(input, fieldNameConverter);
    assertThat(result.getHighlightedText().get("field_1")).hasSize(1);
  }

  @Test
  public void testSanitizeHighlightedText_renames_search_field_to_api_field_name() {
    var highlightedText = Map.of("field_1", List.of("highlighted text"));
    var fieldNameConverter = new EntityConverter(Map.of("field1", "field_1"));
    var input = SearchResult.of(CeoDirectoryDoc.builder().build(), highlightedText, "12345");

    var result = Sanitizer.sanitizeHighlightedText(input, fieldNameConverter);
    assertThat(result.getHighlightedText().get("field_1")).isNull();
    assertThat(result.getHighlightedText().get("field1")).hasSize(1);
  }

  @Test
  public void testSanitizeNameAsAlphaNumeric() {
    processInputsForSanitizeNameAsAlphaNumeric(
        "Alice's Adventures in Wonderland", "AlicesAdventuresinWonderland");
    processInputsForSanitizeNameAsAlphaNumeric(
        "! \" # $ % & ' ( ) * + , - . / 0 1 2 3 4 5 6 7 8 9 : ; < = > ? @ A B C D E F G H I J K L M N O P Q R S T U V W X Y Z [ \\ ] ^ _ ` a b c d e f g h i j k l m n o p q r s t u v w x y z { | } ~",
        "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz");
    processInputsForSanitizeNameAsAlphaNumeric(
        " ¡ ¢ £ ¤ ¥ ¦ § ¨ © ª « ¬ \u00AD ® ¯ ° ± ² ³ ´ µ ¶ · ¸ ¹ º » ¼ ½ ¾ ¿ À Á Â Ã Ä Å Æ Ç È É Ê Ë Ì Í Î Ï Ð Ñ Ò Ó Ô Õ Ö × Ø Ù Ú Û Ü Ý Þ ß à á â ã ä å æ ç è é ê ë ì í î ï ð ñ ò ó ô õ ö ÷ ø ù ú û ü ý þ ÿ",
        "");
    processInputsForSanitizeNameAsAlphaNumeric(
        "Ā ā Ă ă Ą ą Ć ć Ĉ ĉ Ċ ċ Č č Ď ď Đ đ Ē ē Ĕ ĕ Ė ė Ę ę Ě ě Ĝ ĝ Ğ ğ Ġ ġ Ģ ģ Ĥ ĥ Ħ ħ Ĩ ĩ Ī ī Ĭ ĭ Į į İ ı Ĳ ĳ Ĵ ĵ Ķ ķ ĸ Ĺ ĺ Ļ ļ Ľ ľ Ŀ ŀ Ł ł Ń ń Ņ ņ Ň ň ŉ Ŋ ŋ Ō ō Ŏ ŏ Ő ő Œ œ Ŕ ŕ Ŗ ŗ Ř ř Ś ś Ŝ ŝ Ş ş Š š Ţ ţ Ť ť Ŧ ŧ Ũ ũ Ū ū Ŭ ŭ Ů ů Ű ű Ų ų Ŵ ŵ Ŷ ŷ Ÿ Ź ź Ż ż Ž ž ſ",
        "");
    processInputsForSanitizeNameAsAlphaNumeric(
        "ʰ ʱ ʲ ʳ ʴ ʵ ʶ ʷ ʸ ʹ ʺ ʻ ʼ ʽ ʾ ʿ ˀ ˁ ˂ ˃ ˄ ˅ ˆ ˇ ˈ ˉ ˊ ˋ ˌ ˍ ˎ ˏ ː ˑ ˒ ˓ ˔ ˕ ˖ ˗ ˘ ˙ ˚ ˛ ˜ ˝ ˞ ˠ ˡ ˢ ˣ ˤ ˥ ˦ ˧ ˨ ˩",
        "");
  }

  private void processInputsForSanitizeNameAsAlphaNumeric(String test, String result) {
    assertEquals(Sanitizer.sanitizeNameAsAlphaNumeric(test), result);
  }
}
