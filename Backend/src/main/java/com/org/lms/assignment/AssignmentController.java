package com.org.lms.assignment;

import com.org.lms.common.ApiResponse;
import com.org.lms.auth.CustomUserDetails;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1")
public class AssignmentController {

    private final AssignmentService assignmentService;

    public AssignmentController(AssignmentService assignmentService) {
        this.assignmentService = assignmentService;
    }

    // --- ASSIGNMENT ENDPOINTS ---

    @PostMapping("/assignments")
    @PreAuthorize("hasRole('TRAINER')")
    public ResponseEntity<ApiResponse<Assignment>> createAssignment(
            @RequestParam Long courseId,
            @Valid @RequestBody Assignment assignment) {
        Assignment response = assignmentService.createAssignment(assignment, courseId);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Assignment created successfully", response));
    }

    @GetMapping("/assignments")
    public ResponseEntity<ApiResponse<List<Assignment>>> getAllAssignments() {
        List<Assignment> response = assignmentService.getAllAssignments();
        return ResponseEntity.ok(ApiResponse.success("Assignments retrieved successfully", response));
    }

    @GetMapping("/assignments/{assignmentId}")
    public ResponseEntity<ApiResponse<Assignment>> getAssignmentById(@PathVariable Long assignmentId) {
        Assignment response = assignmentService.getAssignmentById(assignmentId);
        return ResponseEntity.ok(ApiResponse.success("Assignment retrieved successfully", response));
    }

    @PutMapping("/assignments/{assignmentId}")
    @PreAuthorize("hasRole('TRAINER')")
    public ResponseEntity<ApiResponse<Assignment>> updateAssignment(
            @PathVariable Long assignmentId,
            @RequestParam Long courseId,
            @Valid @RequestBody Assignment assignment) {
        Assignment response = assignmentService.updateAssignment(assignmentId, assignment, courseId);
        return ResponseEntity.ok(ApiResponse.success("Assignment updated successfully", response));
    }

    @DeleteMapping("/assignments/{assignmentId}")
    @PreAuthorize("hasRole('TRAINER')")
    public ResponseEntity<ApiResponse<Void>> deleteAssignment(@PathVariable Long assignmentId) {
        assignmentService.deleteAssignment(assignmentId);
        return ResponseEntity.ok(ApiResponse.success("Assignment deleted successfully"));
    }

    // --- SUBMISSION ENDPOINTS ---

    @PostMapping("/submissions")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<ApiResponse<Submission>> submitAssignment(
            @RequestParam Long assignmentId,
            @RequestParam Long studentId,
            @RequestBody Map<String, String> payload) {
        String filePath = payload.get("filePath");
        if (filePath == null || filePath.isBlank()) {
            return ResponseEntity.badRequest().body(ApiResponse.error("filePath is required"));
        }
        Submission response = assignmentService.submitAssignment(assignmentId, studentId, filePath);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Assignment work submitted successfully", response));
    }

    @GetMapping("/submissions")
    @PreAuthorize("hasAnyRole('TRAINER', 'COORDINATOR')")
    public ResponseEntity<ApiResponse<List<Submission>>> getAllSubmissions() {
        List<Submission> response = assignmentService.getAllSubmissions();
        return ResponseEntity.ok(ApiResponse.success("All submissions retrieved successfully", response));
    }

    @GetMapping("/submissions/{submissionId}")
    public ResponseEntity<ApiResponse<Submission>> getSubmissionById(
            @PathVariable Long submissionId,
            org.springframework.security.core.Authentication authentication) {
        Submission response = assignmentService.getSubmissionById(submissionId);
        
        if (authentication != null && authentication.getPrincipal() instanceof CustomUserDetails) {
            CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
            boolean isStaff = userDetails.getAuthorities().stream()
                    .anyMatch(auth -> auth.getAuthority().equals("ROLE_TRAINER") || auth.getAuthority().equals("ROLE_COORDINATOR"));
            if (!isStaff && !response.getStudent().getId().equals(userDetails.getId())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(ApiResponse.error("You do not have permission to view this submission"));
            }
        }
        
        return ResponseEntity.ok(ApiResponse.success("Submission retrieved successfully", response));
    }

    @GetMapping("/submissions/assignment/{assignmentId}")
    @PreAuthorize("hasRole('TRAINER')")
    public ResponseEntity<ApiResponse<List<Submission>>> getSubmissionsByAssignment(@PathVariable Long assignmentId) {
        List<Submission> response = assignmentService.getSubmissionsByAssignment(assignmentId);
        return ResponseEntity.ok(ApiResponse.success("Submissions for assignment retrieved successfully", response));
    }

    // --- GRADING ENDPOINTS ---

    @PostMapping("/grades")
    @PreAuthorize("hasRole('TRAINER')")
    public ResponseEntity<ApiResponse<Submission>> gradeSubmission(@RequestBody Map<String, Object> payload) {
        Number submissionIdNum = (Number) payload.get("submissionId");
        Number scoreNum = (Number) payload.get("score");
        String feedback = (String) payload.get("feedback");

        if (submissionIdNum == null || scoreNum == null) {
            return ResponseEntity.badRequest().body(ApiResponse.error("submissionId and score are required"));
        }

        Submission response = assignmentService.gradeSubmission(
                submissionIdNum.longValue(),
                scoreNum.intValue(),
                feedback
        );
        return ResponseEntity.ok(ApiResponse.success("Submission graded successfully", response));
    }

    @GetMapping("/grades/student/{studentId}")
    @PreAuthorize("hasRole('COORDINATOR') or (hasRole('STUDENT') and principal.id == #studentId)")
    public ResponseEntity<ApiResponse<List<Submission>>> getGradesForStudent(@PathVariable Long studentId) {
        List<Submission> response = assignmentService.getGradesForStudent(studentId);
        return ResponseEntity.ok(ApiResponse.success("Grades for student retrieved successfully", response));
    }

    @GetMapping("/grades/assignment/{assignmentId}")
    @PreAuthorize("hasRole('TRAINER')")
    public ResponseEntity<ApiResponse<List<Submission>>> getGradesForAssignment(@PathVariable Long assignmentId) {
        List<Submission> response = assignmentService.getSubmissionsByAssignment(assignmentId);
        return ResponseEntity.ok(ApiResponse.success("Grades for assignment retrieved successfully", response));
    }

    @PutMapping("/grades/{gradeId}")
    @PreAuthorize("hasRole('TRAINER')")
    public ResponseEntity<ApiResponse<Submission>> updateGrade(
            @PathVariable Long gradeId,
            @RequestBody Map<String, Object> payload) {
        Number scoreNum = (Number) payload.get("score");
        String feedback = (String) payload.get("feedback");

        if (scoreNum == null) {
            return ResponseEntity.badRequest().body(ApiResponse.error("score is required"));
        }

        Submission response = assignmentService.gradeSubmission(
                gradeId,
                scoreNum.intValue(),
                feedback
        );
        return ResponseEntity.ok(ApiResponse.success("Grade updated successfully", response));
    }
}
