package com.org.lms.student.service;

import com.org.lms.student.dto.GoogleMeetResponse;
import com.org.lms.student.dto.StudentRegisterRequest;
import com.org.lms.student.dto.StudentResponse;
import com.org.lms.student.dto.UserLookupResponse;
import com.org.lms.student.entity.Student;
import com.org.lms.student.repository.StudentRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class StudentService {

    private final StudentRepository studentRepository;
    private final PasswordEncoder passwordEncoder;

    public StudentService(StudentRepository studentRepository, PasswordEncoder passwordEncoder) {
        this.studentRepository = studentRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public StudentResponse registerStudent(StudentRegisterRequest request) {
        if (studentRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("Email already registered");
        }

        Student student = new Student();
        student.setFirstName(request.getFirstName());
        student.setLastName(request.getLastName());
        student.setEmail(request.getEmail());
        student.setPhoneNumber(request.getPhoneNumber());
        student.setQualification(request.getQualification());
        student.setPassword(passwordEncoder.encode(request.getPassword()));
        student.setStatus(Student.Status.ACTIVE);

        Student saved = studentRepository.save(student);

        return mapToStudentResponse(saved);
    }

    public List<StudentResponse> getAllStudents() {
        return studentRepository.findAll().stream()
                .map(this::mapToStudentResponse)
                .collect(Collectors.toList());
    }

    public StudentResponse getStudentById(Long id) {
        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Student not found with ID: " + id));
        return mapToStudentResponse(student);
    }

    public StudentResponse getStudentByEmail(String email) {
        Student student = studentRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Student not found with email: " + email));
        return mapToStudentResponse(student);
    }

    public StudentResponse updateStudent(Long id, StudentRegisterRequest request) {
        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Student not found with ID: " + id));

        student.setFirstName(request.getFirstName());
        student.setLastName(request.getLastName());
        if (request.getPhoneNumber() != null) {
            student.setPhoneNumber(request.getPhoneNumber());
        }
        if (request.getQualification() != null) {
            student.setQualification(request.getQualification());
        }
        if (request.getPassword() != null && !request.getPassword().isBlank()) {
            student.setPassword(passwordEncoder.encode(request.getPassword()));
        }

        Student updated = studentRepository.save(student);
        return mapToStudentResponse(updated);
    }

    public void deleteStudent(Long id) {
        if (!studentRepository.existsById(id)) {
            throw new RuntimeException("Student not found with ID: " + id);
        }
        studentRepository.deleteById(id);
    }

    /**
     * Generate / resolve Google Meet live classroom URL and details.
     */
    public GoogleMeetResponse getGoogleMeetLink(String roomCode, String topic) {
        String code = (roomCode != null && !roomCode.isBlank()) ? roomCode : "abc-defg-hij";
        String meetUrl = code.startsWith("http") ? code : "https://meet.google.com/" + code;
        String sessionTopic = (topic != null && !topic.isBlank()) ? topic : "Live Virtual Classroom";

        return new GoogleMeetResponse(code, meetUrl, sessionTopic, "Google Meet");
    }

    /**
     * Used only by the internal controller, which auth-service calls during login.
     * Never exposed through the API Gateway.
     */
    public Optional<UserLookupResponse> findByEmailForAuth(String email) {
        return studentRepository.findByEmail(email)
                .map(s -> new UserLookupResponse(s.getEmail(), s.getPassword(), s.getRole().toString()));
    }

    private StudentResponse mapToStudentResponse(Student student) {
        return new StudentResponse(
                student.getStudentId(),
                student.getFirstName(),
                student.getLastName(),
                student.getEmail(),
                student.getQualification(),
                student.getStatus() != null ? student.getStatus().toString() : "ACTIVE"
        );
    }
}
