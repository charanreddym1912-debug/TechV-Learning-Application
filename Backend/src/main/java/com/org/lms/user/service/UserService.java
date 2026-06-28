package com.org.lms.user.service;

import com.org.lms.common.UserRole;
import com.org.lms.common.UserStatus;
import com.org.lms.exception.ResourceNotFoundException;
import com.org.lms.user.dto.*;
import com.org.lms.user.entity.Student;
import com.org.lms.user.entity.Trainer;
import com.org.lms.user.repository.StudentRepository;
import com.org.lms.user.repository.TrainerRepository;
import com.org.lms.user.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final StudentRepository studentRepository;
    private final TrainerRepository trainerRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(
            UserRepository userRepository,
            StudentRepository studentRepository,
            TrainerRepository trainerRepository,
            PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.studentRepository = studentRepository;
        this.trainerRepository = trainerRepository;
        this.passwordEncoder = passwordEncoder;
    }

    // --- STUDENT MANAGEMENT ---

    @Transactional
    public StudentResponse registerStudent(StudentRegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email is already in use");
        }
        if (studentRepository.existsByEmployeeId(request.getEmployeeId())) {
            throw new IllegalArgumentException("Employee ID is already in use");
        }

        Student student = new Student();
        student.setEmail(request.getEmail());
        student.setPassword(passwordEncoder.encode(request.getPassword()));
        student.setRole(UserRole.STUDENT);
        student.setStatus(UserStatus.ACTIVE);
        
        student.setEmployeeId(request.getEmployeeId());
        student.setFirstName(request.getFirstName());
        student.setLastName(request.getLastName());
        student.setPhoneNumber(request.getPhoneNumber());
        student.setQualification(request.getQualification());
        student.setEnrollmentDate(request.getEnrollmentDate());

        Student saved = studentRepository.save(student);
        return mapToStudentResponse(saved);
    }

    @Transactional(readOnly = true)
    public List<StudentResponse> getAllStudents() {
        return studentRepository.findAll().stream()
                .map(this::mapToStudentResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public StudentResponse getStudentById(Long id) {
        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with ID: " + id));
        return mapToStudentResponse(student);
    }

    @Transactional
    public StudentResponse updateStudent(Long id, StudentRegisterRequest request) {
        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with ID: " + id));

        if (!student.getEmail().equals(request.getEmail()) && userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email is already in use");
        }
        if (!student.getEmployeeId().equals(request.getEmployeeId()) && studentRepository.existsByEmployeeId(request.getEmployeeId())) {
            throw new IllegalArgumentException("Employee ID is already in use");
        }

        student.setEmail(request.getEmail());
        if (request.getPassword() != null && !request.getPassword().isBlank()) {
            student.setPassword(passwordEncoder.encode(request.getPassword()));
        }
        student.setEmployeeId(request.getEmployeeId());
        student.setFirstName(request.getFirstName());
        student.setLastName(request.getLastName());
        student.setPhoneNumber(request.getPhoneNumber());
        student.setQualification(request.getQualification());
        student.setEnrollmentDate(request.getEnrollmentDate());

        Student updated = studentRepository.save(student);
        return mapToStudentResponse(updated);
    }

    @Transactional
    public void deleteStudent(Long id) {
        if (!studentRepository.existsById(id)) {
            throw new ResourceNotFoundException("Student not found with ID: " + id);
        }
        studentRepository.deleteById(id);
    }

    // --- TRAINER MANAGEMENT ---

    @Transactional
    public TrainerResponse registerTrainer(TrainerRegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email is already in use");
        }
        if (trainerRepository.existsByEmployeeId(request.getEmployeeId())) {
            throw new IllegalArgumentException("Employee ID is already in use");
        }

        Trainer trainer = new Trainer();
        trainer.setEmail(request.getEmail());
        trainer.setPassword(passwordEncoder.encode(request.getPassword()));
        trainer.setRole(UserRole.TRAINER);
        trainer.setStatus(UserStatus.ACTIVE);

        trainer.setEmployeeId(request.getEmployeeId());
        trainer.setFirstName(request.getFirstName());
        trainer.setLastName(request.getLastName());
        trainer.setPhoneNumber(request.getPhoneNumber());
        trainer.setSpecialization(request.getSpecialization());
        trainer.setExperienceYears(request.getExperienceYears());
        trainer.setDesignation(request.getDesignation());
        trainer.setJoiningDate(request.getJoiningDate());

        Trainer saved = trainerRepository.save(trainer);
        return mapToTrainerResponse(saved);
    }

    @Transactional(readOnly = true)
    public List<TrainerResponse> getAllTrainers() {
        return trainerRepository.findAll().stream()
                .map(this::mapToTrainerResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public TrainerResponse getTrainerById(Long id) {
        Trainer trainer = trainerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Trainer not found with ID: " + id));
        return mapToTrainerResponse(trainer);
    }

    @Transactional
    public TrainerResponse updateTrainer(Long id, TrainerRegisterRequest request) {
        Trainer trainer = trainerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Trainer not found with ID: " + id));

        if (!trainer.getEmail().equals(request.getEmail()) && userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email is already in use");
        }
        if (!trainer.getEmployeeId().equals(request.getEmployeeId()) && trainerRepository.existsByEmployeeId(request.getEmployeeId())) {
            throw new IllegalArgumentException("Employee ID is already in use");
        }

        trainer.setEmail(request.getEmail());
        if (request.getPassword() != null && !request.getPassword().isBlank()) {
            trainer.setPassword(passwordEncoder.encode(request.getPassword()));
        }
        trainer.setEmployeeId(request.getEmployeeId());
        trainer.setFirstName(request.getFirstName());
        trainer.setLastName(request.getLastName());
        trainer.setPhoneNumber(request.getPhoneNumber());
        trainer.setSpecialization(request.getSpecialization());
        trainer.setExperienceYears(request.getExperienceYears());
        trainer.setDesignation(request.getDesignation());
        trainer.setJoiningDate(request.getJoiningDate());

        Trainer updated = trainerRepository.save(trainer);
        return mapToTrainerResponse(updated);
    }

    @Transactional
    public void deleteTrainer(Long id) {
        if (!trainerRepository.existsById(id)) {
            throw new ResourceNotFoundException("Trainer not found with ID: " + id);
        }
        trainerRepository.deleteById(id);
    }

    // --- MAPPING HELPERS ---

    private StudentResponse mapToStudentResponse(Student student) {
        return StudentResponse.builder()
                .id(student.getId())
                .email(student.getEmail())
                .employeeId(student.getEmployeeId())
                .firstName(student.getFirstName())
                .lastName(student.getLastName())
                .phoneNumber(student.getPhoneNumber())
                .qualification(student.getQualification())
                .status(student.getStatus())
                .enrollmentDate(student.getEnrollmentDate())
                .createdAt(student.getCreatedAt())
                .updatedAt(student.getUpdatedAt())
                .build();
    }

    private TrainerResponse mapToTrainerResponse(Trainer trainer) {
        return TrainerResponse.builder()
                .id(trainer.getId())
                .email(trainer.getEmail())
                .employeeId(trainer.getEmployeeId())
                .firstName(trainer.getFirstName())
                .lastName(trainer.getLastName())
                .phoneNumber(trainer.getPhoneNumber())
                .specialization(trainer.getSpecialization())
                .experienceYears(trainer.getExperienceYears())
                .designation(trainer.getDesignation())
                .status(trainer.getStatus())
                .joiningDate(trainer.getJoiningDate())
                .createdAt(trainer.getCreatedAt())
                .updatedAt(trainer.getUpdatedAt())
                .build();
    }
}
