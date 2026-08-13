package com.org.lms.trainer.service;

import com.org.lms.trainer.dto.AssignmentRequest;
import com.org.lms.trainer.dto.AssignmentResponse;
import com.org.lms.trainer.dto.FileResponse;
import com.org.lms.trainer.entity.Assignment;
import com.org.lms.trainer.entity.AssignmentFile;
import com.org.lms.trainer.repository.AssignmentFileRepository;
import com.org.lms.trainer.repository.AssignmentRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AssignmentService {

    private final AssignmentRepository assignmentRepository;
    private final AssignmentFileRepository assignmentFileRepository;
    private final FileUploadService fileUploadService;

    public AssignmentService(AssignmentRepository assignmentRepository,
                           AssignmentFileRepository assignmentFileRepository,
                           FileUploadService fileUploadService) {
        this.assignmentRepository = assignmentRepository;
        this.assignmentFileRepository = assignmentFileRepository;
        this.fileUploadService = fileUploadService;
    }

    /**
     * Creates a new assignment
     */
    public AssignmentResponse createAssignment(Long trainerId, AssignmentRequest request) {
        Assignment assignment = new Assignment();
        assignment.setTitle(request.getTitle());
        assignment.setDescription(request.getDescription());
        assignment.setTrainerId(trainerId);
        assignment.setCourseId(request.getCourseId());
        assignment.setBatchId(request.getBatchId());
        assignment.setDueDate(request.getDueDate());
        assignment.setStatus(Assignment.Status.valueOf(request.getStatus()));

        Assignment saved = assignmentRepository.save(assignment);
        return mapToResponse(saved);
    }

    /**
     * Uploads a file to an assignment
     */
    public FileResponse uploadFileToAssignment(Long trainerId, Long assignmentId, 
                                               MultipartFile file, String uploaderEmail) throws IOException {
        // Verify assignment exists and belongs to trainer
        Assignment assignment = assignmentRepository.findByAssignmentIdAndTrainerId(assignmentId, trainerId)
                .orElseThrow(() -> new RuntimeException("Assignment not found or unauthorized"));

        // Validate and upload file
        FileUploadService.FileUploadResult uploadResult = fileUploadService.uploadFile(file, assignmentId);

        if (!uploadResult.isSuccess()) {
            throw new IOException("File upload failed: " + uploadResult.getMessage());
        }

        // Create AssignmentFile entity
        AssignmentFile assignmentFile = new AssignmentFile(
                assignment,
                uploadResult.getFileName(),
                uploadResult.getFileType(),
                uploadResult.getFileSize(),
                uploadResult.getFilePath(),
                uploadResult.getDocumentType(),
                uploaderEmail
        );

        AssignmentFile saved = assignmentFileRepository.save(assignmentFile);
        return mapFileToResponse(saved);
    }

    /**
     * Uploads multiple files to an assignment
     */
    public List<FileResponse> uploadFilesToAssignment(Long trainerId, Long assignmentId,
                                                      MultipartFile[] files, String uploaderEmail) throws IOException {
        return java.util.Arrays.stream(files)
                .map(file -> {
                    try {
                        return uploadFileToAssignment(trainerId, assignmentId, file, uploaderEmail);
                    } catch (IOException e) {
                        throw new RuntimeException("Failed to upload file: " + e.getMessage());
                    }
                })
                .collect(Collectors.toList());
    }

    /**
     * Deletes a file from an assignment
     */
    public void deleteFile(Long trainerId, Long assignmentId, Long fileId) {
        Assignment assignment = assignmentRepository.findByAssignmentIdAndTrainerId(assignmentId, trainerId)
                .orElseThrow(() -> new RuntimeException("Assignment not found or unauthorized"));

        AssignmentFile file = assignmentFileRepository.findByFileIdAndAssignmentId(fileId, assignmentId)
                .orElseThrow(() -> new RuntimeException("File not found"));

        // Delete from file system
        fileUploadService.deleteFile(file.getFilePath());

        // Delete from database
        assignmentFileRepository.delete(file);
    }

    /**
     * Gets assignment details with all files
     */
    public AssignmentResponse getAssignment(Long trainerId, Long assignmentId) {
        Assignment assignment = assignmentRepository.findByAssignmentIdAndTrainerId(assignmentId, trainerId)
                .orElseThrow(() -> new RuntimeException("Assignment not found or unauthorized"));

        return mapToResponse(assignment);
    }

    /**
     * Gets all assignments for a trainer
     */
    public List<AssignmentResponse> getTrainerAssignments(Long trainerId) {
        List<Assignment> assignments = assignmentRepository.findByTrainerId(trainerId);
        return assignments.stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    /**
     * Gets all assignments for a course
     */
    public List<AssignmentResponse> getCourseAssignments(Long courseId) {
        List<Assignment> assignments = assignmentRepository.findByCourseId(courseId);
        return assignments.stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    /**
     * Gets all assignments for a batch
     */
    public List<AssignmentResponse> getBatchAssignments(Long batchId) {
        List<Assignment> assignments = assignmentRepository.findByBatchId(batchId);
        return assignments.stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    /**
     * Updates an assignment
     */
    public AssignmentResponse updateAssignment(Long trainerId, Long assignmentId, AssignmentRequest request) {
        Assignment assignment = assignmentRepository.findByAssignmentIdAndTrainerId(assignmentId, trainerId)
                .orElseThrow(() -> new RuntimeException("Assignment not found or unauthorized"));

        assignment.setTitle(request.getTitle());
        assignment.setDescription(request.getDescription());
        assignment.setDueDate(request.getDueDate());
        assignment.setStatus(Assignment.Status.valueOf(request.getStatus()));

        Assignment updated = assignmentRepository.save(assignment);
        return mapToResponse(updated);
    }

    /**
     * Publishes an assignment
     */
    public AssignmentResponse publishAssignment(Long trainerId, Long assignmentId) {
        Assignment assignment = assignmentRepository.findByAssignmentIdAndTrainerId(assignmentId, trainerId)
                .orElseThrow(() -> new RuntimeException("Assignment not found or unauthorized"));

        if (assignment.getFiles().isEmpty()) {
            throw new RuntimeException("Cannot publish assignment without files");
        }

        assignment.setStatus(Assignment.Status.PUBLISHED);
        Assignment updated = assignmentRepository.save(assignment);
        return mapToResponse(updated);
    }

    /**
     * Deletes an assignment and all associated files
     */
    public void deleteAssignment(Long trainerId, Long assignmentId) {
        Assignment assignment = assignmentRepository.findByAssignmentIdAndTrainerId(assignmentId, trainerId)
                .orElseThrow(() -> new RuntimeException("Assignment not found or unauthorized"));

        // Delete all files from file system
        for (AssignmentFile file : assignment.getFiles()) {
            fileUploadService.deleteFile(file.getFilePath());
        }

        // Delete assignment and cascade delete files from database
        assignmentRepository.delete(assignment);
    }

    /**
     * Maps Assignment entity to AssignmentResponse
     */
    private AssignmentResponse mapToResponse(Assignment assignment) {
        List<FileResponse> fileResponses = assignment.getFiles().stream()
                .map(this::mapFileToResponse)
                .collect(Collectors.toList());

        return new AssignmentResponse(
                assignment.getAssignmentId(),
                assignment.getTitle(),
                assignment.getDescription(),
                assignment.getCourseId(),
                assignment.getBatchId(),
                assignment.getStatus().toString(),
                assignment.getDueDate(),
                assignment.getCreatedAt(),
                assignment.getUpdatedAt(),
                fileResponses
        );
    }

    /**
     * Maps AssignmentFile entity to FileResponse
     */
    private FileResponse mapFileToResponse(AssignmentFile file) {
        return new FileResponse(
                file.getFileId(),
                file.getFileName(),
                file.getFileType(),
                file.getFileSize(),
                file.getDocumentType(),
                file.getUploadedAt(),
                file.getUploadedBy()
        );
    }
}
