package com.redesignhealth.company.api.exception.status;

import com.redesignhealth.company.api.exception.handler.GlobalExceptionHandler;
import org.springframework.http.HttpStatus;

/**
 * All {@link Exception}s that bubble up should be wrapped in a {@link BaseHttpException} These
 * exceptions will be handled by {@link GlobalExceptionHandler}.
 */
public abstract class BaseHttpException extends RuntimeException {

  /** Status to be used in API Response */
  private final HttpStatus httpStatus;

  public BaseHttpException(HttpStatus status, String message) {
    super(message);
    httpStatus = status;
  }

  public BaseHttpException(HttpStatus status, Exception e) {
    super(e);
    httpStatus = status;
  }

  public HttpStatus getHttpStatus() {
    return httpStatus;
  }
}
