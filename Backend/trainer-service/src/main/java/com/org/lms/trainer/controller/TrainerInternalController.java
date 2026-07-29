package com.org.lms.trainer.controller;

import com.org.lms.trainer.dto.UserLookupResponse;
import com.org.lms.trainer.service.TrainerService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Internal, service-to-service only endpoint - not routed through the API Gateway.
 * Called directly by auth-service during login.
 */
@RestController
@RequestMapping("/internal/trainers")
public class TrainerInternalController {

    private final TrainerService trainerService;

    public TrainerInternalController(TrainerService trainerService) {
        this.trainerService = trainerService;
    }

    @GetMapping("/by-email/{email}")
    public ResponseEntity<UserLookupResponse> findByEmail(@PathVariable String email) {
        return trainerService.findByEmailForAuth(email)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
