package com.org.lms.coordinator.controller;

import com.org.lms.coordinator.dto.CoordinatorResponse;
import com.org.lms.coordinator.dto.CoordinatorSignupRequest;
import com.org.lms.coordinator.service.CoordinatorService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;

@RestController
@RequestMapping("/api/v1/coordinators")
public class CoordinatorController {

    private final CoordinatorService coordinatorService;

    public CoordinatorController(CoordinatorService coordinatorService) {
        this.coordinatorService = coordinatorService;
    }

    @PostMapping("/registercoordinator")
    public ResponseEntity<CoordinatorResponse> registerCoordinator(@Valid @RequestBody CoordinatorSignupRequest request) {
        CoordinatorResponse response = coordinatorService.registerCoordinator(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
    
    @GetMapping("/test-access")
    @PreAuthorize("hasRole('COORDINATOR')")
    public ResponseEntity<String> testCoordinatorAccess() {
        return ResponseEntity.ok("Welcome Coordinator! You have access.");
    }
}
