package com.redesignhealth.company.api.entity.id;

import java.security.SecureRandom;
import java.util.Random;

/**
 * Generate IDs similar to YouTube video IDs, TinyURL IDs
 *
 * <p>If you ever need to expose a lookup key through our API without having a natural ID (e.g. an
 * email) you'll want to leverage this class.
 */
public class ApiIdGenerator {

  /** Base62 available characters: numbers, lowercase letters, and uppercase letters */
  private static final String BASE_62_CHARS =
      "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

  /**
   * IDs length reduces the chance of collisions see: <a
   * href="https://preshing.com/20110504/hash-collision-probabilities/">Hash Collision
   * Probabilities</a>
   */
  private static final int ID_LENGTH = 8;

  private static final Random random = new SecureRandom();

  public static String generate() {
    return generate(ID_LENGTH);
  }

  public static String generate(int length) {
    StringBuilder key = new StringBuilder(length);
    for (int i = 0; i < length; i++) {
      key.append(BASE_62_CHARS.charAt(random.nextInt(BASE_62_CHARS.length())));
    }
    return key.toString();
  }
}
