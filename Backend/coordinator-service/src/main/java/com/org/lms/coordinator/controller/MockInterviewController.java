package com.org.lms.coordinator.controller;

import com.org.lms.coordinator.dto.MockInterviewRequest;
import com.org.lms.coordinator.dto.MockInterviewResponse;
import com.org.lms.coordinator.service.MockInterviewService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1")
public class MockInterviewController {

    private final MockInterviewService mockInterviewService;

    public MockInterviewController(MockInterviewService mockInterviewService) {
        this.mockInterviewService = mockInterviewService;
    }

    @PostMapping("/courses/{courseId}/mock-interviews")
    @PreAuthorize("hasRole('COORDINATOR')")
    public ResponseEntity<MockInterviewResponse> createMockInterview(@PathVariable Long courseId,
                                                                     @Valid @RequestBody MockInterviewRequest request) {
        return new ResponseEntity<>(mockInterviewService.createMockInterview(courseId, request), HttpStatus.CREATED);
    }

    @GetMapping("/mock-interviews")
    @PreAuthorize("hasRole('COORDINATOR')")
    public ResponseEntity<List<MockInterviewResponse>> getAllMockInterviews() {
        return ResponseEntity.ok(mockInterviewService.getAllMockInterviews());
    }

    @GetMapping("/mock-interviews/{mockInterviewId}")
    @PreAuthorize("hasRole('COORDINATOR')")
    public ResponseEntity<MockInterviewResponse> getMockInterviewById(@PathVariable Long mockInterviewId) {
        return ResponseEntity.ok(mockInterviewService.getMockInterviewById(mockInterviewId));
    }

    @GetMapping("/courses/{courseId}/mock-interviews")
    @PreAuthorize("hasRole('COORDINATOR')")
    public ResponseEntity<List<MockInterviewResponse>> getMockInterviewsByCourse(@PathVariable Long courseId) {
        return ResponseEntity.ok(mockInterviewService.getMockInterviewsByCourse(courseId));
    }

    @PutMapping("/courses/{courseId}/mock-interviews/{mockInterviewId}")
    @PreAuthorize("hasRole('COORDINATOR')")
    public ResponseEntity<MockInterviewResponse> updateMockInterview(@PathVariable Long courseId,
                                                                     @PathVariable Long mockInterviewId,
                                                                     @Valid @RequestBody MockInterviewRequest request) {
        return ResponseEntity.ok(mockInterviewService.updateMockInterview(courseId, mockInterviewId, request));
    }

    @DeleteMapping("/mock-interviews/{mockInterviewId}")
    @PreAuthorize("hasRole('COORDINATOR')")
    public ResponseEntity<Void> deleteMockInterview(@PathVariable Long mockInterviewId) {
        mockInterviewService.deleteMockInterview(mockInterviewId);
        return ResponseEntity.noContent().build();
    }
}
