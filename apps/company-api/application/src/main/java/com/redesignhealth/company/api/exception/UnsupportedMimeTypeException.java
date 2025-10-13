package com.redesignhealth.company.api.exception;

import com.redesignhealth.company.api.exception.status.InternalServerErrorException;
import org.springframework.util.MimeType;

public class UnsupportedMimeTypeException extends InternalServerErrorException {
  public UnsupportedMimeTypeException(MimeType mimeType) {
    super(String.format("Unsupported mime type %s", mimeType));
  }
}
