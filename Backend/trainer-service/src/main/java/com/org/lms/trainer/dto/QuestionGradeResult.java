package com.org.lms.trainer.dto;

public class QuestionGradeResult {

    private Long questionId;
    private String questionText;
    private String studentAnswer;
    private String correctAnswer;
    private boolean correct;
    private int marksAwarded;
    private int maxMarks;

    public QuestionGradeResult(Long questionId, String questionText, String studentAnswer,
                                String correctAnswer, boolean correct, int marksAwarded, int maxMarks) {
        this.questionId = questionId;
        this.questionText = questionText;
        this.studentAnswer = studentAnswer;
        this.correctAnswer = correctAnswer;
        this.correct = correct;
        this.marksAwarded = marksAwarded;
        this.maxMarks = maxMarks;
    }

    public Long getQuestionId() { return questionId; }
    public String getQuestionText() { return questionText; }
    public String getStudentAnswer() { return studentAnswer; }
    public String getCorrectAnswer() { return correctAnswer; }
    public boolean isCorrect() { return correct; }
    public int getMarksAwarded() { return marksAwarded; }
    public int getMaxMarks() { return maxMarks; }
}