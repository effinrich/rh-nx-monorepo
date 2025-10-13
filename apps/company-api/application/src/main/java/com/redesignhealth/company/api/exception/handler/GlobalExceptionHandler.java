package com.redesignhealth.company.api.exception.handler;

import com.redesignhealth.company.api.exception.dto.ApiError;
import com.redesignhealth.company.api.exception.dto.ApiFieldError;
import com.redesignhealth.company.api.exception.dto.FieldErrorDetails;
import com.redesignhealth.company.api.exception.status.*;
import jakarta.servlet.RequestDispatcher;
import java.time.Instant;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.orm.jpa.JpaSystemException;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.context.request.RequestAttributes;
import org.springframework.web.context.request.WebRequest;

/**
 * All {@link Exception}s should be handled by this handler
 *
 * <p>Note: methods must be annotated with @ResponseStatus to picked up by OpenAPI Generator.
 */
@ControllerAdvice
public class GlobalExceptionHandler {
  private static final Logger logger = LoggerFactory.getLogger(GlobalExceptionHandler.class);

  /**
   * CockroachDB returns this String as part of the error message from a conflicted transaction,
   * when it could not be re-ordered guaranteeing SERIALIZABLE isolation. All transactions are
   * treated as SERIALIZABLE.
   */
  private static final String RETRY_SERIALIZABLE = "RETRY_SERIALIZABLE";

  private static final String RETRY_SERIALIZABLE_MESSAGE =
      String.format("CRDB: Client retry required (%s)", RETRY_SERIALIZABLE);

  @ExceptionHandler(BadRequestException.class)
  @ResponseStatus(HttpStatus.BAD_REQUEST)
  public ResponseEntity<ApiError> handleBadRequest(BadRequestException ex, WebRequest webRequest) {
    return buildError(webRequest, ex.getMessage(), ex.getHttpStatus());
  }

  @ExceptionHandler(NotFoundException.class)
  @ResponseStatus(HttpStatus.NOT_FOUND)
  public ResponseEntity<ApiError> handleNotFound(NotFoundException ex, WebRequest webRequest) {
    return buildError(webRequest, ex.getMessage(), ex.getHttpStatus());
  }

  @ExceptionHandler(ConflictException.class)
  @ResponseStatus(HttpStatus.CONFLICT)
  public ResponseEntity<ApiError> handleConflict(ConflictException ex, WebRequest webRequest) {
    return buildError(webRequest, ex.getMessage(), ex.getHttpStatus());
  }

  @ExceptionHandler(HttpMessageNotReadableException.class)
  @ResponseStatus(HttpStatus.UNPROCESSABLE_ENTITY)
  public ResponseEntity<ApiError> handleUnprocessableEntity(
      HttpMessageNotReadableException ex, WebRequest webRequest) {
    return buildError(webRequest, ex.getMessage(), HttpStatus.UNPROCESSABLE_ENTITY);
  }

  @ExceptionHandler({AccessDeniedException.class, ForbiddenException.class})
  @ResponseStatus(HttpStatus.FORBIDDEN)
  public ResponseEntity<ApiError> handleForbidden(Exception ex, WebRequest webRequest) {
    return buildError(webRequest, ex.getMessage(), HttpStatus.FORBIDDEN);
  }

  @ExceptionHandler(UnprocessableEntityException.class)
  @ResponseStatus(HttpStatus.UNPROCESSABLE_ENTITY)
  public ResponseEntity<ApiFieldError> handleUnprocessableEntity(
      UnprocessableEntityException ex, WebRequest webRequest) {
    return buildError(webRequest, ex.getMessage(), ex.getHttpStatus(), ex.getFieldErrorDetails());
  }

  @ExceptionHandler(MethodArgumentNotValidException.class)
  @ResponseStatus(HttpStatus.UNPROCESSABLE_ENTITY)
  public ResponseEntity<ApiFieldError> handleUnprocessableEntity(
      MethodArgumentNotValidException ex, WebRequest webRequest) {
    BindingResult bindingResult = ex.getBindingResult();

    var fieldErrors =
        bindingResult.getAllErrors().stream()
            .map(
                (e) -> {
                  if (e instanceof FieldError fieldError) {
                    return new FieldErrorDetails(fieldError);
                  }
                  logger.error("Unable to process bindingResult: {}", e.toString());
                  return FieldErrorDetails.builder().build();
                })
            .toArray(FieldErrorDetails[]::new);

    return buildError(
        webRequest, "Invalid field values", HttpStatus.UNPROCESSABLE_ENTITY, fieldErrors);
  }

  @ExceptionHandler({JpaSystemException.class})
  public ResponseEntity<ApiError> handleJpaSystemException(
      JpaSystemException ex, WebRequest webRequest) {
    if (ex.getCause() == null
        || ex.getCause().getMessage() == null
        || !ex.getCause().getMessage().contains(RETRY_SERIALIZABLE)) {
      return handleFallbackErrors(ex, webRequest);
    }
    return buildError(webRequest, RETRY_SERIALIZABLE_MESSAGE, HttpStatus.TOO_MANY_REQUESTS);
  }

  @ExceptionHandler({InternalServerErrorException.class, Exception.class})
  @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
  public ResponseEntity<ApiError> handleFallbackErrors(Exception ex, WebRequest webRequest) {
    logger.error("Server Error", ex);
    // NPEs don't contain a message
    var message = ex.getMessage() != null ? ex.getMessage() : ex.toString();
    return buildError(webRequest, message, HttpStatus.INTERNAL_SERVER_ERROR);
  }

  private ResponseEntity<ApiError> buildError(
      WebRequest request, String message, HttpStatus status) {
    var errorResponse =
        ApiError.builder()
            .timestamp(Instant.now().toString())
            .status(status.value())
            .error(status.getReasonPhrase())
            .message(message)
            .path(getPath(request))
            .build();

    return new ResponseEntity<>(errorResponse, status);
  }

  private ResponseEntity<ApiFieldError> buildError(
      WebRequest request, String message, HttpStatus status, FieldErrorDetails... errors) {
    var errorResponse =
        ApiFieldError.builder()
            .timestamp(Instant.now().toString())
            .status(status.value())
            .error(status.toString())
            .message(message)
            .errors(errors)
            .path(getPath(request))
            .build();

    return new ResponseEntity<>(errorResponse, status);
  }

  private String getPath(RequestAttributes requestAttributes) {
    return (String)
        requestAttributes.getAttribute(
            RequestDispatcher.ERROR_REQUEST_URI, RequestAttributes.SCOPE_REQUEST);
  }
}
