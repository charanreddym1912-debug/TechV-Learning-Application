package com.org.lms.user.repository;

import com.org.lms.user.entity.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface StudentRepository extends JpaRepository<Student, Long> {
    Optional<Student> findByEmail(String email);
    Optional<Student> findByEmployeeId(String employeeId);
    boolean existsByEmployeeId(String employeeId);
}
