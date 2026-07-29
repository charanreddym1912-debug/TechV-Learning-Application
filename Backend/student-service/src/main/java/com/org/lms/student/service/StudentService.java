package com.org.lms.student.service;

import com.org.lms.student.dto.StudentRegisterRequest;
import com.org.lms.student.dto.StudentResponse;
import com.org.lms.student.dto.UserLookupResponse;
import com.org.lms.student.entity.Student;
import com.org.lms.student.repository.StudentRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

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

        return new StudentResponse(saved.getStudentId(), saved.getFirstName(), saved.getLastName(),
                saved.getEmail(), saved.getQualification(), saved.getStatus().toString());
    }

    /**
     * Used only by the internal controller, which auth-service calls during login.
     * Never exposed through the API Gateway.
     */
    public Optional<UserLookupResponse> findByEmailForAuth(String email) {
        return studentRepository.findByEmail(email)
                .map(s -> new UserLookupResponse(s.getEmail(), s.getPassword(), s.getRole().toString()));
    }
}
