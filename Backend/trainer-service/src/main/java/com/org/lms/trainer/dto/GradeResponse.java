package com.org.lms.trainer.dto;

import java.util.List;

public class GradeResponse {

    private Long assessmentId;
    private int totalMarksAwarded;
    private int totalMaxMarks;
    private List<QuestionGradeResult> questionResults;

    public GradeResponse(Long assessmentId, int totalMarksAwarded, int totalMaxMarks,
                          List<QuestionGradeResult> questionResults) {
        this.assessmentId = assessmentId;
        this.totalMarksAwarded = totalMarksAwarded;
        this.totalMaxMarks = totalMaxMarks;
        this.questionResults = questionResults;
    }

    public Long getAssessmentId() { return assessmentId; }
    public int getTotalMarksAwarded() { return totalMarksAwarded; }
    public int getTotalMaxMarks() { return totalMaxMarks; }
    public List<QuestionGradeResult> getQuestionResults() { return questionResults; }
}