package com.org.lms.assignment;

import com.org.lms.course.Course;
import com.org.lms.course.CourseRepository;
import com.org.lms.exception.ResourceNotFoundException;
import com.org.lms.user.entity.Student;
import com.org.lms.user.repository.StudentRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class AssignmentService {

    private final AssignmentRepository assignmentRepository;
    private final SubmissionRepository submissionRepository;
    private final CourseRepository courseRepository;
    private final StudentRepository studentRepository;

    public AssignmentService(
            AssignmentRepository assignmentRepository,
            SubmissionRepository submissionRepository,
            CourseRepository courseRepository,
            StudentRepository studentRepository) {
        this.assignmentRepository = assignmentRepository;
        this.submissionRepository = submissionRepository;
        this.courseRepository = courseRepository;
        this.studentRepository = studentRepository;
    }

    // --- ASSIGNMENT CRUD ---

    @Transactional(readOnly = true)
    public List<Assignment> getAllAssignments() {
        return assignmentRepository.findAll();
    }

    @Transactional(readOnly = true)
    public Assignment getAssignmentById(Long id) {
        return assignmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Assignment not found with ID: " + id));
    }

    @Transactional
    public Assignment createAssignment(Assignment assignment, Long courseId) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new ResourceNotFoundException("Course not found with ID: " + courseId));
        assignment.setCourse(course);
        return assignmentRepository.save(assignment);
    }

    @Transactional
    public Assignment updateAssignment(Long id, Assignment updated, Long courseId) {
        Assignment assignment = getAssignmentById(id);
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new ResourceNotFoundException("Course not found with ID: " + courseId));
        
        assignment.setTitle(updated.getTitle());
        assignment.setDescription(updated.getDescription());
        assignment.setDueDate(updated.getDueDate());
        assignment.setMaxScore(updated.getMaxScore());
        assignment.setFilePath(updated.getFilePath());
        assignment.setCourse(course);
        return assignmentRepository.save(assignment);
    }

    @Transactional
    public void deleteAssignment(Long id) {
        if (!assignmentRepository.existsById(id)) {
            throw new ResourceNotFoundException("Assignment not found with ID: " + id);
        }
        assignmentRepository.deleteById(id);
    }

    // --- SUBMISSIONS ---

    @Transactional
    public Submission submitAssignment(Long assignmentId, Long studentId, String filePath) {
        Assignment assignment = getAssignmentById(assignmentId);
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with ID: " + studentId));

        if (LocalDateTime.now().isAfter(assignment.getDueDate())) {
            throw new IllegalStateException("Cannot submit assignment: due date has passed");
        }

        Optional<Submission> existing = submissionRepository.findByAssignmentIdAndStudentId(assignmentId, studentId);
        
        Submission submission;
        if (existing.isPresent()) {
            submission = existing.get();
            submission.setFilePath(filePath);
            submission.setSubmissionDate(LocalDateTime.now());
            submission.setStatus("SUBMITTED");
        } else {
            submission = new Submission();
            submission.setAssignment(assignment);
            submission.setStudent(student);
            submission.setFilePath(filePath);
            submission.setSubmissionDate(LocalDateTime.now());
            submission.setStatus("SUBMITTED");
        }

        return submissionRepository.save(submission);
    }

    @Transactional(readOnly = true)
    public List<Submission> getAllSubmissions() {
        return submissionRepository.findAll();
    }

    @Transactional(readOnly = true)
    public Submission getSubmissionById(Long id) {
        return submissionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Submission not found with ID: " + id));
    }

    @Transactional(readOnly = true)
    public List<Submission> getSubmissionsByAssignment(Long assignmentId) {
        if (!assignmentRepository.existsById(assignmentId)) {
            throw new ResourceNotFoundException("Assignment not found with ID: " + assignmentId);
        }
        return submissionRepository.findByAssignmentId(assignmentId);
    }

    // --- GRADING ---

    @Transactional
    public Submission gradeSubmission(Long submissionId, Integer score, String feedback) {
        Submission submission = getSubmissionById(submissionId);
        
        if (score < 0 || score > submission.getAssignment().getMaxScore()) {
            throw new IllegalArgumentException("Score must be between 0 and maximum assignment score (" + submission.getAssignment().getMaxScore() + ")");
        }

        submission.setScore(score);
        submission.setFeedback(feedback);
        submission.setStatus("GRADED");
        return submissionRepository.save(submission);
    }

    @Transactional(readOnly = true)
    public List<Submission> getGradesForStudent(Long studentId) {
        if (!studentRepository.existsById(studentId)) {
            throw new ResourceNotFoundException("Student not found with ID: " + studentId);
        }
        return submissionRepository.findByStudentId(studentId);
    }
}
