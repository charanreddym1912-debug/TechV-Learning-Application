package com.org.lms.coordinator.service;

import com.org.lms.coordinator.dto.*;
import com.org.lms.coordinator.entity.*;
import com.org.lms.coordinator.enums.AssessmentAttemptStatus;
import com.org.lms.coordinator.enums.QuestionType;
import com.org.lms.coordinator.repository.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AssessmentGradingServiceTest {
    @Mock AssessmentRepository assessmentRepository;
    @Mock AssessmentAttemptRepository attemptRepository;
    @Mock AssessmentAnswerRepository answerRepository;
    @Mock CourseEnrollmentRepository enrollmentRepository;

    private AssessmentGradingService service;

    @BeforeEach
    void setUp() {
        service = new AssessmentGradingService(assessmentRepository, attemptRepository,
                answerRepository, enrollmentRepository);
    }

    @Test
    void mcqOnlySubmissionIsAutomaticallyGraded() {
        Assessment assessment = assessment(List.of(
                question(1L, QuestionType.MULTIPLE_CHOICE, 5, "Paris"),
                question(2L, QuestionType.MULTIPLE_CHOICE, 5, "Java")));
        prepareSubmission(assessment);
        when(attemptRepository.save(any())).thenAnswer(invocation -> invocation.getArgument(0));

        AssessmentAttemptResponse result = service.submit(10L, "student@example.com",
                new AssessmentSubmissionRequest(List.of(
                        new AssessmentAnswerSubmissionRequest(1L, "paris"),
                        new AssessmentAnswerSubmissionRequest(2L, "Python"))));

        assertEquals(AssessmentAttemptStatus.AUTO_GRADED, result.status());
        assertEquals(5, result.autoScore());
        assertEquals(5, result.finalScore());
        assertTrue(result.answers().stream().allMatch(AssessmentAnswerResult::autoGraded));
    }

    @Test
    void mixedSubmissionWaitsForTrainerToGradeEssay() {
        Assessment assessment = assessment(List.of(
                question(1L, QuestionType.MULTIPLE_CHOICE, 4, "Spring"),
                question(2L, QuestionType.ESSAY, 6, null)));
        prepareSubmission(assessment);
        when(attemptRepository.save(any())).thenAnswer(invocation -> {
            AssessmentAttempt attempt = invocation.getArgument(0);
            lastSavedAttempt = attempt;
            attempt.setAttemptId(20L);
            attempt.getAnswers().get(0).setAnswerId(31L);
            attempt.getAnswers().get(1).setAnswerId(32L);
            return attempt;
        });

        AssessmentAttemptResponse submitted = service.submit(10L, "student@example.com",
                new AssessmentSubmissionRequest(List.of(
                        new AssessmentAnswerSubmissionRequest(1L, "Spring"),
                        new AssessmentAnswerSubmissionRequest(2L, "A detailed essay response"))));

        assertEquals(AssessmentAttemptStatus.PENDING_REVIEW, submitted.status());
        assertEquals(4, submitted.autoScore());
        assertNull(submitted.finalScore());
        assertNull(submitted.answers().get(1).awardedMarks());

        AssessmentAttempt attempt = capturedAttempt();
        AssessmentAnswer essayAnswer = attempt.getAnswers().get(1);
        when(answerRepository.findById(32L)).thenReturn(Optional.of(essayAnswer));

        AssessmentAttemptResponse graded = service.gradeAnswer(32L,
                new AssessmentAnswerGradeRequest(5, "Clear explanation"));

        assertEquals(AssessmentAttemptStatus.GRADED, graded.status());
        assertEquals(9, graded.finalScore());
        assertEquals("Clear explanation", graded.answers().get(1).trainerFeedback());
        verify(answerRepository).save(essayAnswer);
    }

    @Test
    void trainerCannotAwardMoreThanQuestionMarks() {
        Assessment assessment = assessment(List.of(question(2L, QuestionType.ESSAY, 6, null)));
        AssessmentAttempt attempt = new AssessmentAttempt();
        attempt.setAssessment(assessment);
        attempt.setStudentEmail("student@example.com");
        AssessmentAnswer answer = new AssessmentAnswer();
        answer.setAnswerId(32L);
        answer.setAttempt(attempt);
        answer.setQuestion(assessment.getQuestions().get(0));
        answer.setResponseText("Essay");
        attempt.getAnswers().add(answer);
        when(answerRepository.findById(32L)).thenReturn(Optional.of(answer));

        IllegalArgumentException error = assertThrows(IllegalArgumentException.class,
                () -> service.gradeAnswer(32L, new AssessmentAnswerGradeRequest(7, null)));

        assertTrue(error.getMessage().contains("cannot exceed 6"));
        verify(answerRepository, never()).save(any());
    }

    private AssessmentAttempt lastSavedAttempt;

    private void prepareSubmission(Assessment assessment) {
        when(assessmentRepository.findById(10L)).thenReturn(Optional.of(assessment));
        when(enrollmentRepository.findByCourseIdAndStudentEmail(3L, "student@example.com"))
                .thenReturn(Optional.of(new CourseEnrollment()));
        when(attemptRepository.findByAssessmentAssessmentIdAndStudentEmail(10L, "student@example.com"))
                .thenReturn(Optional.empty());
        lenient().when(attemptRepository.save(any())).thenAnswer(invocation -> {
            lastSavedAttempt = invocation.getArgument(0);
            return lastSavedAttempt;
        });
    }

    private AssessmentAttempt capturedAttempt() {
        return lastSavedAttempt;
    }

    private static Assessment assessment(List<AssessmentQuestion> questions) {
        Course course = new Course();
        course.setCourseId(3L);
        Assessment assessment = new Assessment();
        assessment.setAssessmentId(10L);
        assessment.setTitle("Assessment");
        assessment.setCourse(course);
        assessment.setTotalMarks(questions.stream().mapToInt(AssessmentQuestion::getMarks).sum());
        assessment.setStartDateTime(LocalDateTime.now().minusMinutes(5));
        assessment.setEndDateTime(LocalDateTime.now().plusMinutes(30));
        questions.forEach(question -> question.setAssessment(assessment));
        assessment.setQuestions(questions);
        return assessment;
    }

    private static AssessmentQuestion question(Long id, QuestionType type, int marks, String correct) {
        AssessmentQuestion question = new AssessmentQuestion();
        question.setQuestionId(id);
        question.setQuestionText("Question " + id);
        question.setQuestionType(type);
        question.setMarks(marks);
        question.setCorrectAnswer(correct);
        return question;
    }
}
