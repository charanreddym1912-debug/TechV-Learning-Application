package com.org.lms.coordinator.controller;

import com.org.lms.coordinator.dto.UserLookupResponse;
import com.org.lms.coordinator.service.CoordinatorService;
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
@RequestMapping("/internal/coordinators")
public class CoordinatorInternalController {

    private final CoordinatorService coordinatorService;

    public CoordinatorInternalController(CoordinatorService coordinatorService) {
        this.coordinatorService = coordinatorService;
    }

    @GetMapping("/by-email/{email}")
    public ResponseEntity<UserLookupResponse> findByEmail(@PathVariable String email) {
        return coordinatorService.findByEmailForAuth(email)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
