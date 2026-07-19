import { useState } from 'react';
import { Video, Clock, User, Play } from 'lucide-react';
import toast from 'react-hot-toast';
import Loader from '@/components/common/Loader';
import Badge from '@/components/common/Badge';
import ZoomMeeting from '@/components/student/ZoomMeeting';
import { useFetch } from '@/hooks/useFetch';
import { getStudentSessions, getZoomSignature } from '@/api/zoomApi';
import { mockStudent } from '@/data/mockData';
import { formatDateTime, getRelativeTime } from '@/utils/formatDate';
import type { LiveSession } from '@/types';

export default function LiveClassPage() {
  const { data: sessions, loading, error } = useFetch(
    () => getStudentSessions(mockStudent.id),
    [mockStudent.id]
  );
  const [activeMeeting, setActiveMeeting] = useState<{
    session: LiveSession;
    signature: string;
    password?: string;
  } | null>(null);
  const [joining, setJoining] = useState<number | null>(null);

  const handleJoin = async (session: LiveSession) => {
    if (session.status === 'ended') {
      toast.error('This session has already ended.');
      return;
    }

    setJoining(session.id);
    try {
      const { signature, password } = await getZoomSignature(session.meetingNumber);
      setActiveMeeting({ session, signature, password });
      toast.success(`Joining "${session.title}"...`);
    } catch {
      toast.error('Failed to get meeting credentials. Please try again.');
    } finally {
      setJoining(null);
    }
  };

  const handleLeave = () => {
    setActiveMeeting(null);
    toast.success('You left the meeting.');
  };

  if (loading) return <Loader message="Loading live sessions..." />;
  if (error) {
    return (
      <div className="card text-center py-12">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  const liveSessions = (sessions ?? []).filter((s) => s.status === 'live');
  const upcomingSessions = (sessions ?? []).filter((s) => s.status === 'upcoming');
  const pastSessions = (sessions ?? []).filter((s) => s.status === 'ended');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-slate-100">Live Class</h1>
        <p className="text-gray-500 dark:text-slate-400 mt-1">
          Join virtual classroom sessions powered by Zoom.
        </p>
      </div>

      {activeMeeting ? (
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-slate-100">{activeMeeting.session.title}</h2>
              <p className="text-sm text-gray-500 dark:text-slate-400">{activeMeeting.session.courseName}</p>
            </div>
            <Badge status="live" />
          </div>
          <ZoomMeeting
            meetingNumber={activeMeeting.session.meetingNumber}
            signature={activeMeeting.signature}
            userName={mockStudent.name}
            password={activeMeeting.password}
            onLeave={handleLeave}
          />
        </div>
      ) : (
        <>
          {liveSessions.length > 0 && (
            <section>
              <h2 className="text-lg font-semibold mb-3 flex items-center gap-2 text-gray-900 dark:text-slate-100">
                <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                Live Now
              </h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {liveSessions.map((session) => (
                  <SessionCard
                    key={session.id}
                    session={session}
                    onJoin={handleJoin}
                    joining={joining === session.id}
                    highlight
                  />
                ))}
              </div>
            </section>
          )}

          <section>
            <h2 className="text-lg font-semibold mb-3 text-gray-900 dark:text-slate-100">Upcoming Sessions</h2>
            {upcomingSessions.length === 0 ? (
              <div className="card text-center py-8">
                <p className="text-gray-500 dark:text-slate-400">No upcoming sessions scheduled.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {upcomingSessions.map((session) => (
                  <SessionCard
                    key={session.id}
                    session={session}
                    onJoin={handleJoin}
                    joining={joining === session.id}
                  />
                ))}
              </div>
            )}
          </section>

          {pastSessions.length > 0 && (
            <section>
              <h2 className="text-lg font-semibold mb-3 text-gray-400 dark:text-slate-500">Past Sessions</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 opacity-60">
                {pastSessions.map((session) => (
                  <SessionCard key={session.id} session={session} onJoin={handleJoin} disabled />
                ))}
              </div>
            </section>
          )}
        </>
      )}
    </div>
  );
}

interface SessionCardProps {
  session: LiveSession;
  onJoin: (session: LiveSession) => void;
  joining?: boolean;
  highlight?: boolean;
  disabled?: boolean;
}

function SessionCard({ session, onJoin, joining, highlight, disabled }: SessionCardProps) {
  return (
    <div
      className={`card ${!disabled ? 'card-interactive' : ''} ${highlight ? 'ring-1 ring-red-200 border-red-200 dark:ring-red-500/30 dark:border-red-500/30' : ''} ${disabled ? 'pointer-events-none' : ''}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className={`p-2.5 rounded-xl ${highlight ? 'bg-red-100 dark:bg-red-500/20' : 'bg-primary-100 dark:bg-primary-500/20'}`}>
            <Video className={`w-5 h-5 ${highlight ? 'text-red-600 dark:text-red-400' : 'text-primary-600 dark:text-primary-400'}`} />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-slate-100">{session.title}</h3>
            <p className="text-sm text-gray-500 dark:text-slate-400 mt-0.5">{session.courseName}</p>
          </div>
        </div>
        <Badge status={session.status} />
      </div>

      <div className="mt-4 space-y-2 text-sm text-gray-500 dark:text-slate-400">
        <div className="flex items-center gap-2">
          <User className="w-4 h-4" />
          <span>{session.trainerName}</span>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4" />
          <span>
            {formatDateTime(session.startTime)} — {formatDateTime(session.endTime)}
          </span>
        </div>
        {session.status === 'upcoming' && (
          <p className="text-xs font-medium text-primary-600 dark:text-primary-400">{getRelativeTime(session.startTime)}</p>
        )}
      </div>

      {!disabled && (
        <button
          type="button"
          onClick={() => onJoin(session)}
          disabled={joining}
          className={`mt-4 w-full ${highlight ? 'btn-zoom' : 'btn-primary'}`}
        >
          <Play className="w-4 h-4" />
          {joining ? 'Connecting...' : session.status === 'live' ? 'Join Live Class' : 'Join Session'}
        </button>
      )}
    </div>
  );
}
