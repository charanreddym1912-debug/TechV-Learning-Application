package com.org.lms.user.repository;

import com.org.lms.user.entity.Trainer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface TrainerRepository extends JpaRepository<Trainer, Long> {
    Optional<Trainer> findByEmail(String email);
    Optional<Trainer> findByEmployeeId(String employeeId);
    boolean existsByEmployeeId(String employeeId);
}
