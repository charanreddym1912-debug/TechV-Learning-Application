package com.org.lms.trainer.repository;

import com.org.lms.trainer.entity.AssignmentFile;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface AssignmentFileRepository extends JpaRepository<AssignmentFile, Long> {
    
    List<AssignmentFile> findByAssignmentId(Long assignmentId);
    
    Optional<AssignmentFile> findByFileIdAndAssignmentId(Long fileId, Long assignmentId);
    
    void deleteByAssignmentId(Long assignmentId);
}
