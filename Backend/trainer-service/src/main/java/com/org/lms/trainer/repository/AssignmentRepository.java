package com.org.lms.trainer.repository;

import com.org.lms.trainer.entity.Assignment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface AssignmentRepository extends JpaRepository<Assignment, Long> {
    
    List<Assignment> findByTrainerId(Long trainerId);
    
    List<Assignment> findByTrainerIdAndCourseId(Long trainerId, Long courseId);
    
    List<Assignment> findByTrainerIdAndBatchId(Long trainerId, Long batchId);
    
    List<Assignment> findByCourseId(Long courseId);
    
    List<Assignment> findByBatchId(Long batchId);
    
    @Query("SELECT a FROM Assignment a WHERE a.trainerId = :trainerId AND a.status = :status")
    List<Assignment> findByTrainerIdAndStatus(@Param("trainerId") Long trainerId, @Param("status") Assignment.Status status);
    
    Optional<Assignment> findByAssignmentIdAndTrainerId(Long assignmentId, Long trainerId);
}
