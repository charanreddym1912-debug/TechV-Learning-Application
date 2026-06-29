package com.org.lms.session;

import com.org.lms.common.ApiResponse;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/classes")
public class SessionController {

    private final SessionService sessionService;

    public SessionController(SessionService sessionService) {
        this.sessionService = sessionService;
    }

    @PostMapping
    @PreAuthorize("hasRole('COORDINATOR')")
    public ResponseEntity<ApiResponse<Session>> scheduleClass(
            @RequestParam Long batchId,
            @RequestParam Long trainerId,
            @Valid @RequestBody Session session) {
        Session response = sessionService.createSession(session, batchId, trainerId);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Class session scheduled successfully", response));
    }

    @GetMapping
    @PreAuthorize("hasRole('COORDINATOR')")
    public ResponseEntity<ApiResponse<List<Session>>> getAllSessions() {
        List<Session> response = sessionService.getAllSessions();
        return ResponseEntity.ok(ApiResponse.success("All sessions retrieved successfully", response));
    }

    @GetMapping("/{classId}")
    public ResponseEntity<ApiResponse<Session>> getSessionById(@PathVariable Long classId) {
        Session response = sessionService.getSessionById(classId);
        return ResponseEntity.ok(ApiResponse.success("Session retrieved successfully", response));
    }

    @PutMapping("/{classId}")
    @PreAuthorize("hasRole('COORDINATOR')")
    public ResponseEntity<ApiResponse<Session>> updateSession(
            @PathVariable Long classId,
            @RequestParam Long batchId,
            @RequestParam Long trainerId,
            @Valid @RequestBody Session updatedSession) {
        Session response = sessionService.updateSession(classId, updatedSession, batchId, trainerId);
        return ResponseEntity.ok(ApiResponse.success("Session updated successfully", response));
    }

    @DeleteMapping("/{classId}")
    @PreAuthorize("hasRole('COORDINATOR')")
    public ResponseEntity<ApiResponse<Void>> deleteSession(@PathVariable Long classId) {
        sessionService.deleteSession(classId);
        return ResponseEntity.ok(ApiResponse.success("Session deleted successfully"));
    }

    @GetMapping("/trainer/{trainerId}")
    @PreAuthorize("hasRole('COORDINATOR') or (hasRole('TRAINER') and principal.id == #trainerId)")
    public ResponseEntity<ApiResponse<List<Session>>> getSessionsForTrainer(@PathVariable Long trainerId) {
        List<Session> response = sessionService.getSessionsForTrainer(trainerId);
        return ResponseEntity.ok(ApiResponse.success("Trainer sessions retrieved successfully", response));
    }

    @GetMapping("/student/{studentId}")
    @PreAuthorize("hasRole('COORDINATOR') or (hasRole('STUDENT') and principal.id == #studentId)")
    public ResponseEntity<ApiResponse<List<Session>>> getSessionsForStudent(@PathVariable Long studentId) {
        List<Session> response = sessionService.getSessionsForStudent(studentId);
        return ResponseEntity.ok(ApiResponse.success("Student sessions retrieved successfully", response));
    }
}
