package com.org.lms.coordinator.service;

import com.org.lms.coordinator.dto.*;
import com.org.lms.coordinator.entity.*;
import com.org.lms.coordinator.enums.AssessmentAttemptStatus;
import com.org.lms.coordinator.enums.QuestionType;
import com.org.lms.coordinator.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;

@Service
public class AssessmentGradingService {
    private final AssessmentRepository assessmentRepository;
    private final AssessmentAttemptRepository attemptRepository;
    private final AssessmentAnswerRepository answerRepository;
    private final CourseEnrollmentRepository enrollmentRepository;

    public AssessmentGradingService(AssessmentRepository assessmentRepository,
                                    AssessmentAttemptRepository attemptRepository,
                                    AssessmentAnswerRepository answerRepository,
                                    CourseEnrollmentRepository enrollmentRepository) {
        this.assessmentRepository = assessmentRepository;
        this.attemptRepository = attemptRepository;
        this.answerRepository = answerRepository;
        this.enrollmentRepository = enrollmentRepository;
    }

    @Transactional
    public AssessmentAttemptResponse submit(Long assessmentId, String studentEmail,
                                            AssessmentSubmissionRequest request) {
        Assessment assessment = assessmentRepository.findById(assessmentId)
                .orElseThrow(() -> new IllegalArgumentException("Assessment not found: " + assessmentId));
        if (enrollmentRepository.findByCourseIdAndStudentEmail(
                assessment.getCourse().getCourseId(), studentEmail).isEmpty()) {
            throw new IllegalArgumentException("Student is not enrolled in this assessment's course");
        }
        LocalDateTime now = LocalDateTime.now();
        if (now.isBefore(assessment.getStartDateTime()) || now.isAfter(assessment.getEndDateTime())) {
            throw new IllegalArgumentException("Assessment is not currently open for submission");
        }
        if (attemptRepository.findByAssessmentAssessmentIdAndStudentEmail(assessmentId, studentEmail).isPresent()) {
            throw new IllegalArgumentException("Student has already submitted this assessment");
        }

        Map<Long, AssessmentQuestion> questions = new LinkedHashMap<>();
        assessment.getQuestions().forEach(question -> questions.put(question.getQuestionId(), question));
        if (request.answers().size() != questions.size()) {
            throw new IllegalArgumentException("Every assessment question must be answered exactly once");
        }
        Set<Long> submittedQuestionIds = new HashSet<>();
        AssessmentAttempt attempt = new AssessmentAttempt();
        attempt.setAssessment(assessment);
        attempt.setStudentEmail(studentEmail);
        attempt.setSubmittedAt(now);
        int autoScore = 0;
        boolean requiresReview = false;

        for (AssessmentAnswerSubmissionRequest submitted : request.answers()) {
            AssessmentQuestion question = questions.get(submitted.questionId());
            if (question == null || !submittedQuestionIds.add(submitted.questionId())) {
                throw new IllegalArgumentException("Invalid or duplicate question: " + submitted.questionId());
            }
            AssessmentAnswer answer = new AssessmentAnswer();
            answer.setAttempt(attempt);
            answer.setQuestion(question);
            answer.setResponseText(submitted.response().trim());
            if (question.getQuestionType() == QuestionType.MULTIPLE_CHOICE) {
                int marks = normalizedEquals(submitted.response(), question.getCorrectAnswer())
                        ? question.getMarks() : 0;
                answer.setAwardedMarks(marks);
                answer.setAutoGraded(true);
                autoScore += marks;
            } else {
                answer.setAwardedMarks(null);
                answer.setAutoGraded(false);
                requiresReview = true;
            }
            attempt.getAnswers().add(answer);
        }

        attempt.setAutoScore(autoScore);
        attempt.setStatus(requiresReview
                ? AssessmentAttemptStatus.PENDING_REVIEW
                : AssessmentAttemptStatus.AUTO_GRADED);
        if (!requiresReview) {
            attempt.setFinalScore(autoScore);
            attempt.setGradedAt(now);
        }
        return toResponse(attemptRepository.save(attempt));
    }

    @Transactional(readOnly = true)
    public List<AssessmentAttemptResponse> pendingReview() {
        return attemptRepository.findByStatusOrderBySubmittedAtAsc(AssessmentAttemptStatus.PENDING_REVIEW)
                .stream().map(this::toResponse).toList();
    }

    @Transactional(readOnly = true)
    public List<AssessmentAttemptResponse> attemptsForStudent(String studentEmail) {
        return attemptRepository.findByStudentEmailOrderBySubmittedAtDesc(studentEmail)
                .stream().map(this::toResponse).toList();
    }

    @Transactional
    public AssessmentAttemptResponse gradeAnswer(Long answerId, AssessmentAnswerGradeRequest request) {
        AssessmentAnswer answer = answerRepository.findById(answerId)
                .orElseThrow(() -> new IllegalArgumentException("Assessment answer not found: " + answerId));
        if (answer.isAutoGraded()) {
            throw new IllegalArgumentException("Automatically graded answers cannot be manually overwritten");
        }
        if (request.awardedMarks() > answer.getQuestion().getMarks()) {
            throw new IllegalArgumentException("Awarded marks cannot exceed " + answer.getQuestion().getMarks());
        }
        answer.setAwardedMarks(request.awardedMarks());
        answer.setTrainerFeedback(request.feedback());
        answerRepository.save(answer);

        AssessmentAttempt attempt = answer.getAttempt();
        boolean reviewComplete = attempt.getAnswers().stream()
                .allMatch(item -> item.getAwardedMarks() != null);
        if (reviewComplete) {
            int total = attempt.getAnswers().stream().mapToInt(AssessmentAnswer::getAwardedMarks).sum();
            attempt.setFinalScore(total);
            attempt.setStatus(AssessmentAttemptStatus.GRADED);
            attempt.setGradedAt(LocalDateTime.now());
            attemptRepository.save(attempt);
        }
        return toResponse(attempt);
    }

    private boolean normalizedEquals(String submitted, String correct) {
        return correct != null && submitted != null && submitted.trim().equalsIgnoreCase(correct.trim());
    }

    private AssessmentAttemptResponse toResponse(AssessmentAttempt attempt) {
        List<AssessmentAnswerResult> answers = attempt.getAnswers().stream().map(answer ->
                new AssessmentAnswerResult(answer.getAnswerId(), answer.getQuestion().getQuestionId(),
                        answer.getQuestion().getQuestionText(), answer.getQuestion().getQuestionType(),
                        answer.getResponseText(), answer.getQuestion().getMarks(), answer.getAwardedMarks(),
                        answer.isAutoGraded(), answer.getTrainerFeedback())).toList();
        return new AssessmentAttemptResponse(attempt.getAttemptId(), attempt.getAssessment().getAssessmentId(),
                attempt.getAssessment().getTitle(), attempt.getStudentEmail(), attempt.getStatus(),
                attempt.getAutoScore(), attempt.getFinalScore(), attempt.getAssessment().getTotalMarks(),
                attempt.getSubmittedAt(), attempt.getGradedAt(), answers);
    }
}
