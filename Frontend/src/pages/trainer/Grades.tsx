import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { ChevronDown, ChevronUp, Save } from 'lucide-react';
import {
  type AssessmentAttempt,
  getPendingAssessmentReviews,
  gradeAssessmentAnswer,
} from '../../api/assessmentApi';

const messageFrom = (error: unknown) => {
  const candidate = error as { response?: { data?: { message?: string } }; message?: string };
  return candidate.response?.data?.message || candidate.message || 'The request failed.';
};

const Grades: React.FC = () => {
  const [attempts, setAttempts] = useState<AssessmentAttempt[]>([]);
  const [expanded, setExpanded] = useState<number | null>(null);
  const [marks, setMarks] = useState<Record<number, number>>({});
  const [feedback, setFeedback] = useState<Record<number, string>>({});
  const [saving, setSaving] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      setAttempts(await getPendingAssessmentReviews());
    } catch (error) {
      toast.error(messageFrom(error));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { void load(); }, []);

  const grade = async (attempt: AssessmentAttempt, answerId: number, maximumMarks: number) => {
    const value = marks[answerId];
    if (value === undefined || value < 0 || value > maximumMarks) {
      toast.error(`Marks must be between 0 and ${maximumMarks}.`);
      return;
    }
    setSaving(answerId);
    try {
      const updated = await gradeAssessmentAnswer(answerId, value, feedback[answerId] || '');
      setAttempts((current) => updated.status === 'GRADED'
        ? current.filter((item) => item.attemptId !== attempt.attemptId)
        : current.map((item) => item.attemptId === attempt.attemptId ? updated : item));
      toast.success(updated.status === 'GRADED' ? `Grading complete: ${updated.finalScore}/${updated.totalMarks}` : 'Answer grade saved.');
    } catch (error) {
      toast.error(messageFrom(error));
    } finally {
      setSaving(null);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Assessment Grading</h1>
        <p className="mt-1 text-gray-500">MCQs are graded automatically. Review and grade written answers below.</p>
      </div>

      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="border-b p-6"><h2 className="text-lg font-semibold">Pending Trainer Review</h2></div>
        {loading ? <p className="p-6 text-gray-500">Loading submissions...</p> : attempts.length === 0 ? (
          <p className="p-6 text-gray-500">No assessment answers are waiting for review.</p>
        ) : (
          <div className="divide-y">
            {attempts.map((attempt) => (
              <div key={attempt.attemptId}>
                <button type="button" onClick={() => setExpanded(expanded === attempt.attemptId ? null : attempt.attemptId)}
                  className="flex w-full items-center justify-between gap-4 p-6 text-left hover:bg-gray-50">
                  <div>
                    <p className="font-semibold text-gray-800">{attempt.assessmentTitle}</p>
                    <p className="mt-1 text-sm text-gray-500">{attempt.studentEmail} · Auto score {attempt.autoScore}/{attempt.totalMarks}</p>
                  </div>
                  {expanded === attempt.attemptId ? <ChevronUp /> : <ChevronDown />}
                </button>

                {expanded === attempt.attemptId && (
                  <div className="space-y-5 bg-slate-50 p-6">
                    {attempt.answers.map((answer) => (
                      <div key={answer.answerId} className="rounded-xl border bg-white p-5">
                        <div className="flex flex-wrap justify-between gap-3">
                          <p className="font-semibold text-gray-800">{answer.questionText}</p>
                          <span className="text-sm text-gray-500">Maximum: {answer.maximumMarks}</span>
                        </div>
                        <div className="mt-4 rounded-lg bg-gray-50 p-4 text-gray-700 whitespace-pre-wrap">{answer.response}</div>
                        {answer.autoGraded ? (
                          <p className="mt-4 font-semibold text-emerald-700">Automatically graded: {answer.awardedMarks}/{answer.maximumMarks}</p>
                        ) : answer.awardedMarks !== null ? (
                          <p className="mt-4 font-semibold text-primary-700">Trainer graded: {answer.awardedMarks}/{answer.maximumMarks}</p>
                        ) : (
                          <div className="mt-4 grid gap-4 md:grid-cols-[180px_1fr_auto] md:items-end">
                            <label className="text-sm font-semibold text-gray-700">Marks
                              <input type="number" min={0} max={answer.maximumMarks}
                                className="mt-2 w-full rounded-lg border border-gray-300 p-2"
                                value={marks[answer.answerId] ?? ''}
                                onChange={(event) => setMarks((current) => ({ ...current, [answer.answerId]: Number(event.target.value) }))} />
                            </label>
                            <label className="text-sm font-semibold text-gray-700">Feedback
                              <input className="mt-2 w-full rounded-lg border border-gray-300 p-2"
                                value={feedback[answer.answerId] || ''}
                                onChange={(event) => setFeedback((current) => ({ ...current, [answer.answerId]: event.target.value }))}
                                placeholder="Optional trainer feedback" />
                            </label>
                            <button type="button" disabled={saving === answer.answerId}
                              onClick={() => void grade(attempt, answer.answerId, answer.maximumMarks)}
                              className="flex items-center justify-center gap-2 rounded-lg bg-primary-600 px-4 py-2 font-semibold text-white disabled:opacity-60">
                              <Save size={16} />{saving === answer.answerId ? 'Saving...' : 'Save Grade'}
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Grades;
