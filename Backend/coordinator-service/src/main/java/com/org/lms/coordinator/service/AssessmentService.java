package com.org.lms.coordinator.service;

import com.org.lms.coordinator.dto.AssessmentQuestionRequest;
import com.org.lms.coordinator.dto.AssessmentQuestionResponse;
import com.org.lms.coordinator.dto.AssessmentRequest;
import com.org.lms.coordinator.dto.AssessmentResponse;
import com.org.lms.coordinator.entity.Assessment;
import com.org.lms.coordinator.entity.AssessmentQuestion;
import com.org.lms.coordinator.entity.Course;
import com.org.lms.coordinator.enums.QuestionType;
import com.org.lms.coordinator.repository.AssessmentRepository;
import com.org.lms.coordinator.repository.CourseRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;

@Service
@Transactional
public class AssessmentService {

    private final AssessmentRepository assessmentRepository;
    private final CourseRepository courseRepository;

    public AssessmentService(
            AssessmentRepository assessmentRepository,
            CourseRepository courseRepository
    ) {
        this.assessmentRepository = assessmentRepository;
        this.courseRepository = courseRepository;
    }

    public AssessmentResponse createAssessment(
            Long courseId,
            AssessmentRequest request
    ) {

        validateAssessmentRequest(request);

        Course course = courseRepository.findById(courseId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Course not found with id: " + courseId
                        )
                );

        validateAssessmentDatesWithCourse(course, request);

        if (assessmentRepository
                .existsByTitleIgnoreCaseAndCourseCourseId(
                        request.getTitle(),
                        courseId
                )) {

            throw new RuntimeException(
                    "Assessment already exists with title: "
                            + request.getTitle()
            );
        }

        Assessment assessment = new Assessment();
        assessment.setTitle(request.getTitle());
        assessment.setDescription(request.getDescription());
        assessment.setStartDateTime(request.getStartDateTime());
        assessment.setEndDateTime(request.getEndDateTime());
        assessment.setDurationInMinutes(request.getDurationInMinutes());
        assessment.setTotalMarks(request.getTotalMarks());
        assessment.setPassMarks(request.getPassMarks());
        assessment.setCourse(course);

        List<AssessmentQuestion> questions =
                mapQuestionsToEntities(
                        request.getQuestions(),
                        assessment
                );

        assessment.setQuestions(questions);

        Assessment savedAssessment =
                assessmentRepository.save(assessment);

        return mapToResponse(savedAssessment);
    }

    public List<AssessmentResponse> getAllAssessments() {

        return assessmentRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    public AssessmentResponse getAssessmentById(
            Long assessmentId
    ) {

        Assessment assessment =
                findAssessmentById(assessmentId);

        return mapToResponse(assessment);
    }

    public List<AssessmentResponse> getAssessmentsByCourse(
            Long courseId
    ) {

        if (!courseRepository.existsById(courseId)) {
            throw new RuntimeException(
                    "Course not found with id: " + courseId
            );
        }

        return assessmentRepository
                .findByCourseCourseId(courseId)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    public AssessmentResponse updateAssessment(
            Long courseId,
            Long assessmentId,
            AssessmentRequest request
    ) {

        validateAssessmentRequest(request);

        Course course = courseRepository.findById(courseId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Course not found with id: " + courseId
                        )
                );

        Assessment assessment =
                findAssessmentById(assessmentId);

        if (!assessment.getCourse()
                .getCourseId()
                .equals(courseId)) {

            throw new IllegalArgumentException(
                    "Assessment does not belong to the specified course"
            );
        }

        validateAssessmentDatesWithCourse(course, request);

        boolean titleChanged =
                !assessment.getTitle()
                        .equalsIgnoreCase(request.getTitle());

        boolean duplicateExists =
                assessmentRepository
                        .existsByTitleIgnoreCaseAndCourseCourseId(
                                request.getTitle(),
                                courseId
                        );

        if (titleChanged && duplicateExists) {
            throw new RuntimeException(
                    "Assessment already exists with title: "
                            + request.getTitle()
            );
        }

        assessment.setTitle(request.getTitle());
        assessment.setDescription(request.getDescription());
        assessment.setStartDateTime(request.getStartDateTime());
        assessment.setEndDateTime(request.getEndDateTime());
        assessment.setDurationInMinutes(
                request.getDurationInMinutes()
        );
        assessment.setTotalMarks(request.getTotalMarks());
        assessment.setPassMarks(request.getPassMarks());
        assessment.setCourse(course);

        assessment.getQuestions().clear();

        assessment.getQuestions().addAll(
                mapQuestionsToEntities(
                        request.getQuestions(),
                        assessment
                )
        );

        Assessment updatedAssessment =
                assessmentRepository.save(assessment);

        return mapToResponse(updatedAssessment);
    }

    public void deleteAssessment(Long assessmentId) {

        Assessment assessment =
                findAssessmentById(assessmentId);

        assessmentRepository.delete(assessment);
    }

    private Assessment findAssessmentById(
            Long assessmentId
    ) {

        return assessmentRepository.findById(assessmentId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Assessment not found with id: "
                                        + assessmentId
                        )
                );
    }

    private void validateAssessmentRequest(
            AssessmentRequest request
    ) {

        if (request == null) {
            throw new IllegalArgumentException(
                    "Assessment request cannot be null"
            );
        }

        if (request.getStartDateTime() == null
                || request.getEndDateTime() == null) {

            throw new IllegalArgumentException(
                    "Assessment date and time are required"
            );
        }

        if (!request.getStartDateTime()
                .isBefore(request.getEndDateTime())) {

            throw new IllegalArgumentException(
                    "Assessment start date and time must be before end date and time"
            );
        }

        if (request.getDurationInMinutes() == null
                || request.getDurationInMinutes() <= 0) {

            throw new IllegalArgumentException(
                    "Duration must be at least 1 minute"
            );
        }

        if (request.getTotalMarks() == null
                || request.getTotalMarks() <= 0) {

            throw new IllegalArgumentException(
                    "Total marks must be greater than 0"
            );
        }

        if (request.getPassMarks() == null
                || request.getPassMarks() < 0
                || request.getPassMarks()
                > request.getTotalMarks()) {

            throw new IllegalArgumentException(
                    "Pass marks must be between 0 and total marks"
            );
        }

        long availableMinutes =
                ChronoUnit.MINUTES.between(
                        request.getStartDateTime(),
                        request.getEndDateTime()
                );

        if (request.getDurationInMinutes()
                > availableMinutes) {

            throw new IllegalArgumentException(
                    "Assessment duration cannot be greater than the available assessment time"
            );
        }

        if (request.getQuestions() == null
                || request.getQuestions().isEmpty()) {

            throw new IllegalArgumentException(
                    "Assessment must contain at least one question"
            );
        }

        int questionMarksTotal =
                request.getQuestions()
                        .stream()
                        .mapToInt(
                                AssessmentQuestionRequest::getMarks
                        )
                        .sum();

        if (questionMarksTotal
                != request.getTotalMarks()) {

            throw new IllegalArgumentException(
                    "Sum of question marks must be equal to total marks"
            );
        }

        for (AssessmentQuestionRequest question :
                request.getQuestions()) {

            validateQuestion(question);
        }
    }

    private void validateAssessmentDatesWithCourse(
            Course course,
            AssessmentRequest request
    ) {

        if (course.getStartDate() != null
                && request.getStartDateTime()
                .toLocalDate()
                .isBefore(course.getStartDate())) {

            throw new IllegalArgumentException(
                    "Assessment start date cannot be before course start date"
            );
        }

        if (course.getEndDate() != null
                && request.getEndDateTime()
                .toLocalDate()
                .isAfter(course.getEndDate())) {

            throw new IllegalArgumentException(
                    "Assessment end date cannot be after course end date"
            );
        }
    }

    private void validateQuestion(
            AssessmentQuestionRequest question
    ) {

        if (question == null) {
            throw new IllegalArgumentException(
                    "Assessment question cannot be null"
            );
        }

        if (question.getQuestionType()
                == QuestionType.MULTIPLE_CHOICE) {

            if (question.getOptions() == null
                    || question.getOptions().size() < 2) {

                throw new IllegalArgumentException(
                        "Multiple-choice question must contain at least two options"
                );
            }

            if (question.getCorrectAnswer() == null
                    || question.getCorrectAnswer().isBlank()) {

                throw new IllegalArgumentException(
                        "Correct answer is required for a multiple-choice question"
                );
            }

            if (!question.getOptions()
                    .contains(question.getCorrectAnswer())) {

                throw new IllegalArgumentException(
                        "Correct answer must be one of the provided options"
                );
            }
        }

        if (question.getQuestionType()
                == QuestionType.FILL_IN_THE_BLANK) {

            if (question.getCorrectAnswer() == null
                    || question.getCorrectAnswer().isBlank()) {

                throw new IllegalArgumentException(
                        "Correct answer is required for a fill-in-the-blank question"
                );
            }
        }

        if (question.getQuestionType() == QuestionType.SHORT_ANSWER
                || question.getQuestionType() == QuestionType.ESSAY) {

            if (question.getWordLimit() == null
                    || question.getWordLimit() <= 0) {

                throw new IllegalArgumentException(
                    "Word limit must be greater than 0 for a short-answer or essay question"
                );
            }
        }
    }

    private List<AssessmentQuestion> mapQuestionsToEntities(
            List<AssessmentQuestionRequest> questionRequests,
            Assessment assessment
    ) {

        List<AssessmentQuestion> questions =
                new ArrayList<>();

        for (AssessmentQuestionRequest request :
                questionRequests) {

            AssessmentQuestion question =
                    new AssessmentQuestion();

            question.setQuestionText(
                    request.getQuestionText()
            );
            question.setQuestionType(
                    request.getQuestionType()
            );
            question.setMarks(
                    request.getMarks()
            );
            question.setWordLimit(
                    request.getWordLimit()
            );
            question.setCorrectAnswer(
                    request.getCorrectAnswer()
            );

            if (request.getOptions() != null) {
                question.setOptions(
                        new ArrayList<>(request.getOptions())
                );
            }

            question.setAssessment(assessment);
            questions.add(question);
        }

        return questions;
    }

    private AssessmentResponse mapToResponse(
            Assessment assessment
    ) {

        AssessmentResponse response =
                new AssessmentResponse();

        response.setAssessmentId(
                assessment.getAssessmentId()
        );
        response.setTitle(
                assessment.getTitle()
        );
        response.setDescription(
                assessment.getDescription()
        );
        response.setStartDateTime(
                assessment.getStartDateTime()
        );
        response.setEndDateTime(
                assessment.getEndDateTime()
        );
        response.setDurationInMinutes(
                assessment.getDurationInMinutes()
        );
        response.setTotalMarks(
                assessment.getTotalMarks()
        );
        response.setPassMarks(
                assessment.getPassMarks()
        );

        response.setStatus(
                calculateStatus(
                        assessment.getStartDateTime(),
                        assessment.getEndDateTime()
                )
        );

        if (assessment.getCourse() != null) {
            response.setCourseId(
                    assessment.getCourse().getCourseId()
            );
            response.setCourseTitle(
                    assessment.getCourse().getTitle()
            );
        }

        List<AssessmentQuestionResponse> questionResponses =
                assessment.getQuestions()
                        .stream()
                        .map(this::mapQuestionToResponse)
                        .toList();

        response.setQuestions(questionResponses);

        return response;
    }

    private AssessmentQuestionResponse mapQuestionToResponse(
            AssessmentQuestion question
    ) {

        AssessmentQuestionResponse response =
                new AssessmentQuestionResponse();

        response.setQuestionId(
                question.getQuestionId()
        );
        response.setQuestionText(
                question.getQuestionText()
        );
        response.setQuestionType(
                question.getQuestionType()
        );
        response.setMarks(
                question.getMarks()
        );
        response.setWordLimit(
                question.getWordLimit()
        );
        response.setCorrectAnswer(
                question.getCorrectAnswer()
        );

        if (question.getOptions() != null) {
            response.setOptions(
                    new ArrayList<>(question.getOptions())
            );
        }

        return response;
    }

    private String calculateStatus(
            LocalDateTime startDateTime,
            LocalDateTime endDateTime
    ) {

        LocalDateTime currentDateTime =
                LocalDateTime.now();

        if (currentDateTime.isBefore(startDateTime)) {
            return "SCHEDULED";
        }

        if (currentDateTime.isAfter(endDateTime)) {
            return "COMPLETED";
        }

        return "ACTIVE";
    }
}
