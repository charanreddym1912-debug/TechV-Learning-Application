

package com.org.lms.coordinator.exception;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.LocalDateTime;
import java.util.LinkedHashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    /*
     * Handles DTO validation errors:
     * @NotBlank, @NotNull, @Positive, @Size, etc.
     */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, Object>> handleValidationException(
            MethodArgumentNotValidException exception,
            HttpServletRequest request
    ) {

        Map<String, String> validationErrors = new LinkedHashMap<>();

        for (FieldError fieldError :
                exception.getBindingResult().getFieldErrors()) {

            validationErrors.put(
                    fieldError.getField(),
                    fieldError.getDefaultMessage()
            );
        }

        Map<String, Object> response = createErrorResponse(
                HttpStatus.BAD_REQUEST,
                "Request validation failed",
                request
        );

        response.put("validationErrors", validationErrors);

        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(response);
    }

    /*
     * Handles invalid JSON and unsupported enum values.
     */
    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<Map<String, Object>> handleInvalidRequestBody(
            HttpMessageNotReadableException exception,
            HttpServletRequest request
    ) {

        String message = "Invalid request body";

        if (exception.getMostSpecificCause() != null) {
            message = exception.getMostSpecificCause().getMessage();
        }

        Map<String, Object> response = createErrorResponse(
                HttpStatus.BAD_REQUEST,
                message,
                request
        );

        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(response);
    }

    /*
     * Handles business validation errors and invalid arguments.
     */
    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<Map<String, Object>> handleIllegalArgumentException(
            IllegalArgumentException exception,
            HttpServletRequest request
    ) {

        Map<String, Object> response = createErrorResponse(
                HttpStatus.BAD_REQUEST,
                exception.getMessage(),
                request
        );

        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(response);
    }

    /*
     * Handles RuntimeException from service classes.
     *
     * Based on the message, it returns either 404 or 400.
     */
    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<Map<String, Object>> handleRuntimeException(
            RuntimeException exception,
            HttpServletRequest request
    ) {

        HttpStatus status;

        String message = exception.getMessage() != null
                ? exception.getMessage()
                : "Request processing failed";

        String lowerCaseMessage = message.toLowerCase();

        if (lowerCaseMessage.contains("not found")) {
            status = HttpStatus.NOT_FOUND;
        } else if (lowerCaseMessage.contains("already exists")
                || lowerCaseMessage.contains("duplicate")) {
            status = HttpStatus.CONFLICT;
        } else {
            status = HttpStatus.BAD_REQUEST;
        }

        Map<String, Object> response = createErrorResponse(
                status,
                message,
                request
        );

        return ResponseEntity
                .status(status)
                .body(response);
    }

    /*
     * Handles authenticated users without the required role.
     */
    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<Map<String, Object>> handleAccessDeniedException(
            AccessDeniedException exception,
            HttpServletRequest request
    ) {

        Map<String, Object> response = createErrorResponse(
                HttpStatus.FORBIDDEN,
                "You do not have permission to perform this operation",
                request
        );

        return ResponseEntity
                .status(HttpStatus.FORBIDDEN)
                .body(response);
    }

    /*
     * Handles unexpected errors.
     */
    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, Object>> handleGeneralException(
            Exception exception,
            HttpServletRequest request
    ) {

        exception.printStackTrace();

        Map<String, Object> response = createErrorResponse(
                HttpStatus.INTERNAL_SERVER_ERROR,
                exception.toString(),
                request
        );

        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(response);
    }

    private Map<String, Object> createErrorResponse(
            HttpStatus status,
            String message,
            HttpServletRequest request
    ) {

        Map<String, Object> response = new LinkedHashMap<>();

        response.put("timestamp", LocalDateTime.now());
        response.put("status", status.value());
        response.put("error", status.getReasonPhrase());
        response.put("message", message);
        response.put("path", request.getRequestURI());

        return response;
    }
}
