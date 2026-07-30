import { useEffect, useMemo, useState } from 'react';
import {
  ClipboardList,
  Trash2,
  Send,
  Timer,
  Users,
  CheckCircle2,
  X,
  BarChart3,
  ListChecks,
  ToggleLeft,
  Vote,
  MessageSquareText,
} from 'lucide-react';
import toast from 'react-hot-toast';
import Badge from '@/components/common/Badge';
import { mockAssessments } from '@/data/mockData';
import type { Assessment, AssessmentType } from '@/types';

const typeMeta: Record<AssessmentType, { label: string; icon: typeof ListChecks; hasOptions: boolean; hasCorrect: boolean }> = {
  mcq: { label: 'Multiple Choice', icon: ListChecks, hasOptions: true, hasCorrect: true },
  truefalse: { label: 'True / False', icon: ToggleLeft, hasOptions: true, hasCorrect: true },
  poll: { label: 'Live Poll', icon: Vote, hasOptions: true, hasCorrect: false },
  short: { label: 'Short Answer', icon: MessageSquareText, hasOptions: false, hasCorrect: false },
};

const statusOrder: Record<Assessment['status'], number> = { live: 0, draft: 1, closed: 2 };

export default function AssessmentsPage() {
  const [assessments, setAssessments] = useState<Assessment[]>(mockAssessments);
  const [now, setNow] = useState(Date.now());

  // Real-time loop: stream in mock responses and auto-close expired assessments.
  useEffect(() => {
    const timer = setInterval(() => {
      const ts = Date.now();
      setNow(ts);
      setAssessments((prev) =>
        prev.map((a) => {
          if (a.status !== 'live' || !a.issuedAt) return a;
          const endTs = new Date(a.issuedAt).getTime() + a.durationMinutes * 60_000;
          const expired = ts >= endTs;
          let { responses, optionVotes } = a;
          if (!expired && responses < a.totalStudents && Math.random() > 0.4) {
            responses += 1;
            if (a.options.length > 0) {
              const idx = pickOption(a);
              optionVotes = optionVotes.map((v, i) => (i === idx ? v + 1 : v));
            }
          }
          return { ...a, responses, optionVotes, status: expired ? 'closed' : a.status };
        })
      );
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const liveCount = assessments.filter((a) => a.status === 'live').length;

  const sorted = useMemo(
    () =>
      [...assessments].sort(
        (a, b) => statusOrder[a.status] - statusOrder[b.status] || b.id - a.id
      ),
    [assessments]
  );

  const issueDraft = (id: number) => {
    setAssessments((prev) =>
      prev.map((a) =>
        a.id === id ? { ...a, status: 'live', issuedAt: new Date().toISOString(), responses: 0, optionVotes: a.optionVotes.map(() => 0) } : a
      )
    );
    toast.success('Assessment is now live!');
  };

  const closeAssessment = (id: number) => {
    setAssessments((prev) => prev.map((a) => (a.id === id ? { ...a, status: 'closed' } : a)));
    toast('Assessment closed.', { icon: '🔒' });
  };

  const deleteAssessment = (id: number) => {
    setAssessments((prev) => prev.filter((a) => a.id !== id));
    toast('Assessment removed.', { icon: '🗑️' });
  };

  const remainingSeconds = (a: Assessment) => {
    if (a.status !== 'live' || !a.issuedAt) return 0;
    const endTs = new Date(a.issuedAt).getTime() + a.durationMinutes * 60_000;
    return Math.max(0, Math.round((endTs - now) / 1000));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-slate-100">Assessments</h1>
          <p className="text-gray-500 dark:text-slate-400 mt-1">
            Issue quick assessments to your class in real time and watch responses stream in.
          </p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-50 border border-red-200 text-sm font-semibold text-red-700 dark:bg-red-500/10 dark:border-red-500/30 dark:text-red-300">
          <span className={`w-2 h-2 rounded-full ${liveCount ? 'bg-red-500 animate-pulse' : 'bg-gray-300 dark:bg-slate-600'}`} />
          {liveCount} live now
        </div>
      </div>

      <div className="space-y-4">
        {sorted.length === 0 ? (
          <div className="card text-center py-16">
            <ClipboardList className="w-10 h-10 text-gray-300 mx-auto mb-3 dark:text-slate-600" />
            <p className="text-gray-500 dark:text-slate-400">No assessments have been issued yet.</p>
          </div>
        ) : (
          sorted.map((assessment) => (
            <AssessmentCard
              key={assessment.id}
              assessment={assessment}
              remainingSeconds={remainingSeconds(assessment)}
              onIssue={() => issueDraft(assessment.id)}
              onClose={() => closeAssessment(assessment.id)}
              onDelete={() => deleteAssessment(assessment.id)}
            />
          ))
        )}
      </div>
    </div>
  );
}

function pickOption(a: Assessment): number {
  if (a.options.length === 0) return 0;
  if (a.type === 'poll' || a.correctOption === null) {
    return Math.floor(Math.random() * a.options.length);
  }
  // Bias correct answers a bit for realism.
  if (Math.random() < 0.6) return a.correctOption;
  return Math.floor(Math.random() * a.options.length);
}

function formatCountdown(totalSeconds: number): string {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

interface AssessmentCardProps {
  assessment: Assessment;
  remainingSeconds: number;
  onIssue: () => void;
  onClose: () => void;
  onDelete: () => void;
}

function AssessmentCard({ assessment, remainingSeconds, onIssue, onClose, onDelete }: AssessmentCardProps) {
  const meta = typeMeta[assessment.type];
  const TIcon = meta.icon;
  const participation =
    assessment.totalStudents > 0
      ? Math.round((assessment.responses / assessment.totalStudents) * 100)
      : 0;

  return (
    <div className={`card ${assessment.status === 'live' ? 'ring-1 ring-red-200 dark:ring-red-500/30' : ''}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="p-2.5 rounded-xl bg-primary-100 shrink-0 dark:bg-primary-500/20">
            <TIcon className="w-5 h-5 text-primary-600 dark:text-primary-400" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <Badge status={assessment.status === 'live' ? 'live' : assessment.status === 'draft' ? 'pending' : 'ended'} label={assessment.status === 'live' ? 'Live' : assessment.status === 'draft' ? 'Draft' : 'Closed'} />
              <span className="text-xs font-medium text-gray-400 dark:text-slate-500">{meta.label}</span>
            </div>
            <h3 className="text-base font-semibold text-gray-900 dark:text-slate-100 mt-1.5">{assessment.question}</h3>
            <p className="text-xs text-primary-600 dark:text-primary-400 font-medium mt-0.5">{assessment.courseName}</p>
          </div>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          {assessment.status === 'live' && (
            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-red-50 text-red-700 text-sm font-semibold tabular-nums dark:bg-red-500/10 dark:text-red-300">
              <Timer className="w-4 h-4" />
              {formatCountdown(remainingSeconds)}
            </span>
          )}
          <button
            type="button"
            onClick={onDelete}
            className="p-2 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer dark:text-slate-500 dark:hover:text-red-400 dark:hover:bg-red-500/10"
            aria-label="Delete assessment"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Options / results */}
      {assessment.options.length > 0 ? (
        <div className="mt-4 space-y-2">
          {assessment.options.map((option, index) => {
            const votes = assessment.optionVotes[index] ?? 0;
            const pct = assessment.responses > 0 ? Math.round((votes / assessment.responses) * 100) : 0;
            const isCorrect = assessment.correctOption === index;
            return (
              <div key={index} className="relative overflow-hidden rounded-xl border border-gray-100 bg-gray-50 dark:border-slate-800 dark:bg-slate-800/60">
                <div
                  className={`absolute inset-y-0 left-0 ${isCorrect ? 'bg-emerald-100 dark:bg-emerald-500/25' : 'bg-primary-100 dark:bg-primary-500/25'} transition-all duration-500`}
                  style={{ width: `${pct}%` }}
                />
                <div className="relative flex items-center justify-between gap-2 px-3 py-2">
                  <span className="flex items-center gap-2 text-sm text-gray-800 dark:text-slate-200">
                    {isCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />}
                    {option}
                  </span>
                  <span className="text-xs font-semibold text-gray-500 dark:text-slate-400 tabular-nums">
                    {pct}% · {votes}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="mt-4 flex items-center gap-2 text-sm text-gray-500 dark:text-slate-400 bg-gray-50 border border-gray-100 rounded-xl px-3 py-2 dark:text-slate-400 dark:bg-slate-800/60 dark:border-slate-800">
          <MessageSquareText className="w-4 h-4" />
          Short answer · {assessment.responses} response{assessment.responses === 1 ? '' : 's'} collected
        </div>
      )}

      {/* Footer: participation + actions */}
      <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between text-xs text-gray-500 dark:text-slate-400 mb-1">
            <span className="flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5" />
              {assessment.responses}/{assessment.totalStudents} responded
            </span>
            <span className="font-medium">{assessment.marks} marks</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-1.5 dark:bg-slate-700">
            <div
              className="bg-gradient-to-r from-primary-500 to-indigo-600 h-1.5 rounded-full transition-all duration-500"
              style={{ width: `${participation}%` }}
            />
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {assessment.status === 'draft' && (
            <button type="button" onClick={onIssue} className="btn-primary py-2 px-4">
              <Send className="w-4 h-4" />
              Issue
            </button>
          )}
          {assessment.status === 'live' && (
            <button type="button" onClick={onClose} className="btn-danger">
              <X className="w-4 h-4" />
              Close
            </button>
          )}
          {assessment.status === 'closed' && (
            <span className="flex items-center gap-1.5 text-sm font-medium text-gray-500 dark:text-slate-400">
              <BarChart3 className="w-4 h-4" />
              {participation}% participation
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
