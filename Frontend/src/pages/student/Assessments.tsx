import React, { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { CheckCircle, ClipboardCheck, Clock } from 'lucide-react';
import {
  type Assessment,
  type AssessmentAttempt,
  getAssessments,
  getMyAttempts,
  submitAssessment,
} from '../../api/assessmentApi';

const messageFrom = (error: unknown) => {
  const candidate = error as { response?: { data?: { message?: string } }; message?: string };
  return candidate.response?.data?.message || candidate.message || 'The request failed.';
};

const StudentAssessments: React.FC = () => {
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [attempts, setAttempts] = useState<AssessmentAttempt[]>([]);
  const [selected, setSelected] = useState<Assessment | null>(null);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const [assessmentData, attemptData] = await Promise.all([getAssessments(), getMyAttempts()]);
      setAssessments(assessmentData);
      setAttempts(attemptData);
    } catch (error) {
      toast.error(messageFrom(error));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { void load(); }, []);

  const attemptedIds = useMemo(() => new Set(attempts.map((item) => item.assessmentId)), [attempts]);

  const submit = async () => {
    if (!selected) return;
    if (selected.questions.some((question) => !answers[question.questionId]?.trim())) {
      toast.error('Please answer every question before submitting.');
      return;
    }
    setSubmitting(true);
    try {
      const result = await submitAssessment(selected.assessmentId, answers);
      setAttempts((current) => [result, ...current]);
      setSelected(null);
      setAnswers({});
      toast.success(result.status === 'AUTO_GRADED'
        ? `Submitted. Your score is ${result.finalScore}/${result.totalMarks}.`
        : 'Submitted. Essay answers are waiting for trainer review.');
    } catch (error) {
      toast.error(messageFrom(error));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Assessments</h1>
        <p className="mt-1 text-gray-500">Complete assessments and view your grading status.</p>
      </div>

      {loading ? <p className="text-gray-500">Loading assessments...</p> : (
        <div className="grid gap-5 md:grid-cols-2">
          {assessments.map((assessment) => {
            const attempt = attempts.find((item) => item.assessmentId === assessment.assessmentId);
            return (
              <div key={assessment.assessmentId} className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-800">{assessment.title}</h2>
                    <p className="mt-1 text-sm text-gray-500">{assessment.courseTitle}</p>
                  </div>
                  <ClipboardCheck className="text-primary-600" />
                </div>
                <p className="mt-4 text-sm text-gray-600">{assessment.description}</p>
                <div className="mt-4 flex gap-4 text-sm text-gray-500">
                  <span>{assessment.totalMarks} marks</span>
                  <span className="flex items-center gap-1"><Clock size={15} />{assessment.durationInMinutes} minutes</span>
                </div>
                {attempt ? (
                  <div className="mt-5 rounded-xl bg-emerald-50 p-4 text-sm text-emerald-800">
                    <div className="flex items-center gap-2 font-semibold"><CheckCircle size={17} />Submitted</div>
                    <p className="mt-1">{attempt.status === 'PENDING_REVIEW'
                      ? `Auto score: ${attempt.autoScore}/${attempt.totalMarks}. Trainer review pending.`
                      : `Final score: ${attempt.finalScore}/${attempt.totalMarks}`}</p>
                  </div>
                ) : (
                  <button type="button" onClick={() => { setSelected(assessment); setAnswers({}); }}
                    className="mt-5 rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-700">
                    Start Assessment
                  </button>
                )}
              </div>
            );
          })}
          {!assessments.length && <p className="text-gray-500">No assessments are available.</p>}
        </div>
      )}

      {selected && !attemptedIds.has(selected.assessmentId) && (
        <div className="rounded-2xl border border-primary-100 bg-white p-6 shadow-lg">
          <h2 className="text-xl font-bold text-gray-800">{selected.title}</h2>
          <div className="mt-6 space-y-6">
            {selected.questions.map((question, index) => (
              <div key={question.questionId} className="rounded-xl border border-gray-200 p-5">
                <p className="font-semibold text-gray-800">{index + 1}. {question.questionText} <span className="text-sm text-gray-500">({question.marks} marks)</span></p>
                {question.questionType === 'MULTIPLE_CHOICE' ? (
                  <div className="mt-4 space-y-2">
                    {question.options.map((option) => (
                      <label key={option} className="flex cursor-pointer gap-3 rounded-lg border p-3">
                        <input type="radio" name={`question-${question.questionId}`} value={option}
                          checked={answers[question.questionId] === option}
                          onChange={(event) => setAnswers((current) => ({ ...current, [question.questionId]: event.target.value }))} />
                        {option}
                      </label>
                    ))}
                  </div>
                ) : (
                  <textarea className="mt-4 w-full rounded-lg border border-gray-300 p-3" rows={question.questionType === 'ESSAY' ? 8 : 4}
                    maxLength={question.wordLimit ? question.wordLimit * 8 : undefined}
                    value={answers[question.questionId] || ''}
                    onChange={(event) => setAnswers((current) => ({ ...current, [question.questionId]: event.target.value }))}
                    placeholder={question.questionType === 'ESSAY' ? 'Write your essay answer...' : 'Enter your answer...'} />
                )}
              </div>
            ))}
          </div>
          <div className="mt-6 flex gap-3">
            <button type="button" onClick={() => setSelected(null)} className="rounded-lg border px-4 py-2 font-semibold text-gray-700">Cancel</button>
            <button type="button" disabled={submitting} onClick={() => void submit()}
              className="rounded-lg bg-primary-600 px-4 py-2 font-semibold text-white disabled:opacity-60">
              {submitting ? 'Submitting...' : 'Submit Assessment'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentAssessments;
