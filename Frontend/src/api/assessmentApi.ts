import axiosInstance from './axiosInstance';

export type QuestionType = 'MULTIPLE_CHOICE' | 'SHORT_ANSWER' | 'FILL_IN_THE_BLANK' | 'ESSAY';
export type AttemptStatus = 'AUTO_GRADED' | 'PENDING_REVIEW' | 'GRADED';

export interface AssessmentQuestion {
  questionId: number;
  questionText: string;
  questionType: QuestionType;
  marks: number;
  wordLimit?: number;
  options: string[];
}

export interface Assessment {
  assessmentId: number;
  title: string;
  description: string;
  startDateTime: string;
  endDateTime: string;
  durationInMinutes: number;
  totalMarks: number;
  passMarks: number;
  status: string;
  courseTitle: string;
  questions: AssessmentQuestion[];
}

export interface AssessmentAnswerResult {
  answerId: number;
  questionId: number;
  questionText: string;
  questionType: QuestionType;
  response: string;
  maximumMarks: number;
  awardedMarks: number | null;
  autoGraded: boolean;
  trainerFeedback: string | null;
}

export interface AssessmentAttempt {
  attemptId: number;
  assessmentId: number;
  assessmentTitle: string;
  studentEmail: string;
  status: AttemptStatus;
  autoScore: number;
  finalScore: number | null;
  totalMarks: number;
  submittedAt: string;
  gradedAt: string | null;
  answers: AssessmentAnswerResult[];
}

export const getAssessments = async () =>
  (await axiosInstance.get<Assessment[]>('/assessments')).data;

export const getMyAttempts = async () =>
  (await axiosInstance.get<AssessmentAttempt[]>('/assessment-attempts/mine')).data;

export const submitAssessment = async (assessmentId: number, responses: Record<number, string>) =>
  (await axiosInstance.post<AssessmentAttempt>(`/assessments/${assessmentId}/attempts`, {
    answers: Object.entries(responses).map(([questionId, response]) => ({
      questionId: Number(questionId),
      response,
    })),
  })).data;

export const getPendingAssessmentReviews = async () =>
  (await axiosInstance.get<AssessmentAttempt[]>('/assessment-attempts/pending-review')).data;

export const gradeAssessmentAnswer = async (answerId: number, awardedMarks: number, feedback: string) =>
  (await axiosInstance.put<AssessmentAttempt>(`/assessment-answers/${answerId}/grade`, {
    awardedMarks,
    feedback,
  })).data;
