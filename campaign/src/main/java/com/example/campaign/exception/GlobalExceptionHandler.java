package com.example.campaign.exception;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Map;

@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(CampaignNotFoundException.class)
    public ResponseEntity<Map<String, Object>> handleNotFound(CampaignNotFoundException ex) {
        var body = Map.<String, Object>of(
                "timestamp", LocalDateTime.now(),
                "status", 404,
                "error", "Not Found",
                "message", ex.getMessage()
        );
        return ResponseEntity.status(404).body(body);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, Object>> handleOther(Exception ex) {
        var body = Map.<String, Object>of(
                "timestamp", LocalDateTime.now(),
                "status", 500,
                "error", "Internal Server Error",
                "message", ex.getMessage()
        );
        return ResponseEntity.status(500).body(body);
    }
}
