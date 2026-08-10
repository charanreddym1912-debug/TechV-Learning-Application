package com.org.lms.trainer.service;

import com.org.lms.trainer.dto.*;
import com.org.lms.trainer.entity.Assessment;
import com.org.lms.trainer.entity.Question;
import com.org.lms.trainer.repository.AssessmentRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class AssessmentService {

    private final AssessmentRepository assessmentRepository;

    public AssessmentService(AssessmentRepository assessmentRepository) {
        this.assessmentRepository = assessmentRepository;
    }

    public AssessmentResponse createAssessment(AssessmentRequest request, String trainerEmail) {
        Assessment assessment = new Assessment();
        assessment.setTitle(request.getTitle());
        assessment.setCourse(request.getCourse());
        assessment.setBatch(request.getBatch());
        assessment.setDueDate(request.getDueDate());
        assessment.setDurationMinutes(request.getDurationMinutes());
        assessment.setInstructions(request.getInstructions());
        assessment.setStatus(Assessment.Status.valueOf(request.getStatus()));
        assessment.setCreatedByEmail(trainerEmail);

        List<Question> questions = request.getQuestions().stream()
                .map(qr -> toQuestion(qr, assessment))
                .collect(Collectors.toList());
        assessment.setQuestions(questions);

        Assessment saved = assessmentRepository.save(assessment);
        return toResponse(saved);
    }

    public List<AssessmentResponse> getMyAssessments(String trainerEmail) {
        return assessmentRepository.findByCreatedByEmail(trainerEmail).stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public void deleteAssessment(Long assessmentId, String trainerEmail) {
        Assessment assessment = assessmentRepository.findById(assessmentId)
                .orElseThrow(() -> new RuntimeException("Assessment not found with id: " + assessmentId));

        if (!assessment.getCreatedByEmail().equals(trainerEmail)) {
            throw new RuntimeException("You can only delete assessments you created");
        }

        assessmentRepository.delete(assessment);
    }

    public GradeResponse gradeSubmission(Long assessmentId, GradeRequest request) {
        Assessment assessment = assessmentRepository.findById(assessmentId)
                .orElseThrow(() -> new RuntimeException("Assessment not found with id: " + assessmentId));

        Map<Long, Question> questionsById = assessment.getQuestions().stream()
                .collect(Collectors.toMap(Question::getQuestionId, q -> q));

        List<QuestionGradeResult> results = new ArrayList<>();
        int totalAwarded = 0;
        int totalMax = 0;

        for (AnswerSubmission submission : request.getAnswers()) {
            Question question = questionsById.get(submission.getQuestionId());
            if (question == null) {
                continue; 
            }

            boolean isCorrect = question.getCorrectAnswer() != null
                    && question.getCorrectAnswer().trim().equalsIgnoreCase(
                            submission.getStudentAnswer() == null ? "" : submission.getStudentAnswer().trim());

            int marksAwarded = isCorrect ? question.getMarks() : 0;

            results.add(new QuestionGradeResult(
                    question.getQuestionId(),
                    question.getQuestionText(),
                    submission.getStudentAnswer(),
                    question.getCorrectAnswer(),
                    isCorrect,
                    marksAwarded,
                    question.getMarks()
            ));

            totalAwarded += marksAwarded;
            totalMax += question.getMarks();
        }

        return new GradeResponse(assessmentId, totalAwarded, totalMax, results);
    }

    private Question toQuestion(QuestionRequest qr, Assessment assessment) {
        Question question = new Question();
        question.setAssessment(assessment);
        question.setQuestionText(qr.getQuestionText());
        question.setQuestionType(Question.QuestionType.valueOf(qr.getQuestionType()));
        question.setMarks(qr.getMarks());
        question.setCorrectAnswer(qr.getCorrectAnswer());
        question.setOptions(qr.getOptions());
        return question;
    }

    private AssessmentResponse toResponse(Assessment assessment) {
        int totalMarks = assessment.getQuestions().stream()
                .mapToInt(Question::getMarks)
                .sum();

        return new AssessmentResponse(
                assessment.getAssessmentId(),
                assessment.getTitle(),
                assessment.getCourse(),
                assessment.getBatch(),
                assessment.getDueDate(),
                assessment.getDurationMinutes(),
                assessment.getQuestions().size(),
                totalMarks,
                assessment.getStatus().toString()
        );
    }
}