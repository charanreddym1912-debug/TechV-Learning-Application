package com.org.lms.coordinator.service;

import com.org.lms.coordinator.dto.AssignmentRequest;
import com.org.lms.coordinator.dto.AssignmentResponse;
import com.org.lms.coordinator.entity.Assignment;
import com.org.lms.coordinator.entity.Course;
import com.org.lms.coordinator.repository.AssignmentRepository;
import com.org.lms.coordinator.repository.CourseRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AssignmentService {

    private final AssignmentRepository assignmentRepository;
    private final CourseRepository courseRepository;

    public AssignmentService(AssignmentRepository assignmentRepository, CourseRepository courseRepository) {
        this.assignmentRepository = assignmentRepository;
        this.courseRepository = courseRepository;
    }

    public AssignmentResponse createAssignment(Long courseId, AssignmentRequest request) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found with id: " + courseId));

        if (assignmentRepository.existsByCourseCourseIdAndTitleIgnoreCase(courseId, request.getTitle())) {
            throw new RuntimeException("Assignment already exists with title: " + request.getTitle());
        }

        validateAssignmentDates(course, request);

        Assignment assignment = new Assignment();
        assignment.setTitle(request.getTitle());
        assignment.setDescription(request.getDescription());
        assignment.setAssignedDate(request.getAssignedDate());
        assignment.setDueDate(request.getDueDate());
        assignment.setTotalMarks(request.getTotalMarks());
        assignment.setAttachmentFileName(request.getAttachmentFileName());
        assignment.setAttachmentContentType(request.getAttachmentContentType());
        assignment.setAttachmentFileSize(request.getAttachmentFileSize());
        assignment.setAttachmentStoragePath(request.getAttachmentStoragePath());
        assignment.setMaximumSubmissionFileSize(request.getMaximumSubmissionFileSize());
        assignment.setCourse(course);

        Assignment saved = assignmentRepository.save(assignment);
        return mapToResponse(saved);
    }

    public List<AssignmentResponse> getAssignments() {
        return assignmentRepository.findAll().stream()
                .map(this::mapToResponse)
                .toList();
    }

    public List<AssignmentResponse> getAssignmentsByCourse(Long courseId) {
        if (!courseRepository.existsById(courseId)) {
            throw new RuntimeException("Course not found with id: " + courseId);
        }

        return assignmentRepository.findByCourseCourseId(courseId).stream()
                .map(this::mapToResponse)
                .toList();
    }

    public AssignmentResponse getAssignmentById(Long assignmentId) {
        Assignment assignment = assignmentRepository.findById(assignmentId)
                .orElseThrow(() -> new RuntimeException("Assignment not found with id: " + assignmentId));
        return mapToResponse(assignment);
    }

    public AssignmentResponse updateAssignment(Long courseId, Long assignmentId, AssignmentRequest request) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found with id: " + courseId));

        Assignment assignment = assignmentRepository.findById(assignmentId)
                .orElseThrow(() -> new RuntimeException("Assignment not found with id: " + assignmentId));

        if (!assignment.getCourse().getCourseId().equals(courseId)) {
            throw new RuntimeException("Assignment does not belong to the specified course");
        }

        validateAssignmentDates(course, request);

        boolean titleChanged = !assignment.getTitle().equalsIgnoreCase(request.getTitle());
        boolean duplicateExists = assignmentRepository.existsByCourseCourseIdAndTitleIgnoreCase(courseId, request.getTitle());

        if (titleChanged && duplicateExists) {
            throw new RuntimeException("Assignment already exists with title: " + request.getTitle());
        }

        assignment.setTitle(request.getTitle());
        assignment.setDescription(request.getDescription());
        assignment.setAssignedDate(request.getAssignedDate());
        assignment.setDueDate(request.getDueDate());
        assignment.setTotalMarks(request.getTotalMarks());
        assignment.setAttachmentFileName(request.getAttachmentFileName());
        assignment.setAttachmentContentType(request.getAttachmentContentType());
        assignment.setAttachmentFileSize(request.getAttachmentFileSize());
        assignment.setAttachmentStoragePath(request.getAttachmentStoragePath());
        assignment.setMaximumSubmissionFileSize(request.getMaximumSubmissionFileSize());

        Assignment updated = assignmentRepository.save(assignment);
        return mapToResponse(updated);
    }

    public void deleteAssignment(Long assignmentId) {
        Assignment assignment = assignmentRepository.findById(assignmentId)
                .orElseThrow(() -> new RuntimeException("Assignment not found with id: " + assignmentId));
        assignmentRepository.delete(assignment);
    }

    private void validateAssignmentDates(Course course, AssignmentRequest request) {
        if (request.getAssignedDate() != null && request.getDueDate() != null && request.getAssignedDate().isAfter(request.getDueDate())) {
            throw new RuntimeException("Assigned date cannot be after due date");
        }

        if (request.getTotalMarks() != null && request.getTotalMarks() <= 0) {
            throw new RuntimeException("Total marks must be greater than zero");
        }

        if (request.getMaximumSubmissionFileSize() != null && request.getMaximumSubmissionFileSize() <= 0) {
            throw new RuntimeException("Maximum submission file size must be greater than zero");
        }

        if (course.getStartDate() != null && request.getAssignedDate() != null && request.getAssignedDate().isBefore(course.getStartDate())) {
            throw new RuntimeException("Assigned date cannot be before course start date");
        }

        if (course.getEndDate() != null && request.getDueDate() != null && request.getDueDate().isAfter(course.getEndDate())) {
            throw new RuntimeException("Due date cannot be after course end date");
        }
    }

    private AssignmentResponse mapToResponse(Assignment assignment) {
        AssignmentResponse response = new AssignmentResponse();
        response.setAssignmentId(assignment.getAssignmentId());
        response.setTitle(assignment.getTitle());
        response.setDescription(assignment.getDescription());
        response.setAssignedDate(assignment.getAssignedDate());
        response.setDueDate(assignment.getDueDate());
        response.setTotalMarks(assignment.getTotalMarks());
        response.setAttachmentFileName(assignment.getAttachmentFileName());
        response.setAttachmentContentType(assignment.getAttachmentContentType());
        response.setAttachmentFileSize(assignment.getAttachmentFileSize());
        response.setAttachmentStoragePath(assignment.getAttachmentStoragePath());
        response.setMaximumSubmissionFileSize(assignment.getMaximumSubmissionFileSize());

        if (assignment.getCourse() != null) {
            response.setCourseId(assignment.getCourse().getCourseId());
            response.setCourseTitle(assignment.getCourse().getTitle());
        }

        return response;
    }
}
