package com.org.lms.student.controller;

import com.org.lms.student.dto.GoogleMeetResponse;
import com.org.lms.student.dto.StudentRegisterRequest;
import com.org.lms.student.dto.StudentResponse;
import com.org.lms.student.service.StudentService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/students")
public class StudentController {

    private final StudentService studentService;

    public StudentController(StudentService studentService) {
        this.studentService = studentService;
    }

    @PostMapping("/registerstudent")
    public ResponseEntity<StudentResponse> registerStudent(@Valid @RequestBody StudentRegisterRequest request) {
        StudentResponse response = studentService.registerStudent(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PostMapping
    @PreAuthorize("hasRole('COORDINATOR')")
    public ResponseEntity<StudentResponse> createStudent(@Valid @RequestBody StudentRegisterRequest request) {
        StudentResponse response = studentService.registerStudent(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    @PreAuthorize("hasRole('COORDINATOR')")
    public ResponseEntity<List<StudentResponse>> getAllStudents() {
        List<StudentResponse> response = studentService.getAllStudents();
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{studentId}")
    @PreAuthorize("hasRole('COORDINATOR')")
    public ResponseEntity<StudentResponse> getStudentById(@PathVariable Long studentId) {
        StudentResponse response = studentService.getStudentById(studentId);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/email/{email}")
    @PreAuthorize("hasRole('COORDINATOR') or authentication.name.equals(#email)")
    public ResponseEntity<StudentResponse> getStudentByEmail(@PathVariable String email) {
        StudentResponse response = studentService.getStudentByEmail(email);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{studentId}")
    @PreAuthorize("hasRole('COORDINATOR')")
    public ResponseEntity<StudentResponse> updateStudent(
            @PathVariable Long studentId,
            @Valid @RequestBody StudentRegisterRequest request) {
        StudentResponse response = studentService.updateStudent(studentId, request);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{studentId}")
    @PreAuthorize("hasRole('COORDINATOR')")
    public ResponseEntity<Void> deleteStudent(@PathVariable Long studentId) {
        studentService.deleteStudent(studentId);
        return ResponseEntity.noContent().build();
    }

    // --- GOOGLE MEET INTEGRATION ENDPOINTS ---

    @GetMapping("/meet/link")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<GoogleMeetResponse> getGoogleMeetLink(
            @RequestParam(required = false, defaultValue = "abc-defg-hij") String roomCode,
            @RequestParam(required = false, defaultValue = "Live Virtual Class") String topic) {
        GoogleMeetResponse response = studentService.getGoogleMeetLink(roomCode, topic);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/meet/link")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<GoogleMeetResponse> createGoogleMeetLink(@RequestBody Map<String, String> payload) {
        String roomCode = payload.getOrDefault("roomCode", payload.get("meetingCode"));
        String topic = payload.getOrDefault("topic", "Live Virtual Class");
        GoogleMeetResponse response = studentService.getGoogleMeetLink(roomCode, topic);
        return ResponseEntity.ok(response);
    }
}
