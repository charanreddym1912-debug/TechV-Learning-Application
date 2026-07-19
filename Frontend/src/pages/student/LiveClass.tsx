import React, { useState, useEffect } from 'react';
import { Video, Calendar, Clock, ExternalLink, Copy, Sparkles } from 'lucide-react';
import axiosInstance from '../../api/axiosInstance';
import type { ClassSession } from '../../types';
import toast from 'react-hot-toast';

const LiveClassPage: React.FC = () => {
  const [sessions, setSessions] = useState<ClassSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSession, setSelectedSession] = useState<ClassSession | null>(null);

  useEffect(() => {
    const fetchSessions = async () => {
      setLoading(true);
      try {
        const res = await axiosInstance.get<ClassSession[]>('/classes');
        if (res.data && res.data.length > 0) {
          setSessions(res.data);
          setSelectedSession(res.data[0]);
          localStorage.setItem('mock_lms_classes', JSON.stringify(res.data));
        } else {
          const saved = localStorage.getItem('mock_lms_classes');
          if (saved) {
            const parsed = JSON.parse(saved);
            setSessions(parsed);
            setSelectedSession(parsed[0]);
          }
        }
      } catch (e) {
        const saved = localStorage.getItem('mock_lms_classes');
        if (saved) {
          const parsed = JSON.parse(saved);
          setSessions(parsed);
          setSelectedSession(parsed[0]);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchSessions();
  }, []);

  const copyCredentials = (session: ClassSession) => {
    const text = `Zoom Meeting ID: ${session.zoomMeetingId || 'N/A'} | Passcode: ${session.zoomPasscode || 'N/A'} | Join Link: ${session.zoomJoinUrl || session.meetingLink || ''}`;
    navigator.clipboard.writeText(text);
    toast.success('Zoom credentials copied to clipboard!');
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#0E71EB] via-blue-700 to-indigo-900 p-6 rounded-2xl text-white shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-blue-100 text-xs font-bold mb-2 border border-white/15">
            <Sparkles size={14} className="text-yellow-300" />
            <span>Zoom Video Communications Integrated</span>
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight">Live Virtual Classroom</h1>
          <p className="text-blue-100 text-sm mt-1">
            Join high-definition interactive lectures, lab discussions, and real-time faculty Q&A sessions via Zoom.
          </p>
        </div>
        {selectedSession && (selectedSession.zoomJoinUrl || selectedSession.meetingLink) && (
          <a
            href={selectedSession.zoomJoinUrl || selectedSession.meetingLink}
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-3 bg-white text-[#0E71EB] hover:bg-blue-50 font-extrabold rounded-xl text-sm transition shadow-md flex items-center gap-2 shrink-0 transform hover:-translate-y-0.5"
          >
            <Video size={18} className="text-[#0E71EB]" />
            Launch Active Zoom Class
            <ExternalLink size={14} />
          </a>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active Session Preview & Embed Box */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 overflow-hidden">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-[#0E71EB]">
                  <Video size={18} />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-base">
                    {selectedSession ? selectedSession.title : 'No Class Selected'}
                  </h3>
                  <p className="text-xs text-gray-500">
                    {selectedSession ? `Date: ${selectedSession.sessionDate} (${selectedSession.startTime} - ${selectedSession.endTime})` : 'Select an upcoming class from the schedule'}
                  </p>
                </div>
              </div>
              {selectedSession && selectedSession.zoomMeetingId && (
                <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-blue-50 text-[#0E71EB] border border-blue-200">
                  ID: {selectedSession.zoomMeetingId}
                </span>
              )}
            </div>

            {/* Zoom SDK / Player Embed Area */}
            <div className="w-full aspect-video bg-slate-900 rounded-xl border border-slate-800 flex flex-col items-center justify-center p-6 text-center relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-purple-600/10 pointer-events-none"></div>
              <Video size={56} className="text-blue-400/80 mb-4 animate-pulse stroke-1" />
              <h4 className="text-lg font-bold text-white mb-2">Ready to Join Zoom Classroom</h4>
              <p className="text-slate-300 text-xs max-w-md mb-6 leading-relaxed">
                Your virtual classroom is powered by Zoom Web SDK. Click below to open the interactive video session in your client or browser.
              </p>
              
              <div className="flex flex-wrap items-center justify-center gap-3">
                {selectedSession && (selectedSession.zoomJoinUrl || selectedSession.meetingLink) ? (
                  <a
                    href={selectedSession.zoomJoinUrl || selectedSession.meetingLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-6 py-3 bg-[#0E71EB] hover:bg-[#0051C3] text-white rounded-xl text-sm font-bold shadow-lg transition flex items-center gap-2"
                  >
                    <Video size={16} />
                    Enter Zoom Classroom Now
                    <ExternalLink size={14} />
                  </a>
                ) : (
                  <span className="px-4 py-2 bg-slate-800 text-slate-400 rounded-lg text-xs font-medium">
                    Meeting URL Not Available
                  </span>
                )}
                
                {selectedSession && selectedSession.zoomMeetingId && (
                  <button
                    onClick={() => copyCredentials(selectedSession)}
                    className="px-4 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold transition flex items-center gap-1.5 border border-slate-700"
                  >
                    <Copy size={14} />
                    Copy Meeting ID & Passcode
                  </button>
                )}
              </div>
            </div>

            {/* Credentials Banner */}
            {selectedSession && (selectedSession.zoomMeetingId || selectedSession.zoomPasscode) && (
              <div className="mt-4 p-4 bg-blue-50/60 rounded-xl border border-blue-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="space-y-1 text-xs">
                  <span className="font-bold text-[#0E71EB] uppercase tracking-wider block">Meeting Access Credentials</span>
                  <div className="flex flex-wrap items-center gap-4 text-gray-700 font-medium">
                    <span>Meeting ID: <strong className="font-mono text-gray-900 bg-white px-2 py-0.5 rounded border border-gray-200">{selectedSession.zoomMeetingId || 'N/A'}</strong></span>
                    <span>Passcode: <strong className="font-mono text-gray-900 bg-white px-2 py-0.5 rounded border border-gray-200">{selectedSession.zoomPasscode || 'N/A'}</strong></span>
                  </div>
                </div>
                <button
                  onClick={() => copyCredentials(selectedSession)}
                  className="px-3 py-1.5 bg-white hover:bg-blue-50 text-[#0E71EB] border border-blue-200 rounded-lg text-xs font-bold transition shadow-2xs flex items-center gap-1.5 shrink-0"
                >
                  <Copy size={14} /> Copy Info
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Schedule & Sessions List */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col">
          <h3 className="font-bold text-gray-900 text-base pb-3 border-b border-gray-100 mb-4 flex items-center justify-between">
            <span>Upcoming Classes</span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-blue-100 text-[#0E71EB]">
              {sessions.length} Available
            </span>
          </h3>

          {loading ? (
            <div className="py-12 text-center text-gray-400 flex flex-col items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0E71EB] mb-3"></div>
              <p className="text-xs">Loading classroom schedule...</p>
            </div>
          ) : sessions.length === 0 ? (
            <div className="py-12 text-center text-gray-400">
              <Calendar size={36} className="mx-auto text-gray-300 mb-2 stroke-1" />
              <p className="text-sm font-medium text-gray-600">No live classes scheduled yet</p>
            </div>
          ) : (
            <div className="space-y-3 flex-1 overflow-y-auto max-h-[500px] pr-1">
              {sessions.map((session) => {
                const isSelected = selectedSession?.classId === session.classId;
                return (
                  <div
                    key={session.classId}
                    onClick={() => setSelectedSession(session)}
                    className={`p-3.5 rounded-xl border transition cursor-pointer flex flex-col gap-2 ${
                      isSelected
                        ? 'border-[#0E71EB] bg-blue-50/50 shadow-sm'
                        : 'border-gray-100 hover:border-gray-200 hover:bg-gray-50/50'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <h4 className={`font-bold text-sm line-clamp-1 ${isSelected ? 'text-[#0E71EB]' : 'text-gray-900'}`}>
                        {session.title}
                      </h4>
                      {session.zoomMeetingId && (
                        <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-blue-100 text-[#0E71EB] shrink-0">
                          Zoom
                        </span>
                      )}
                    </div>
                    
                    <div className="flex items-center justify-between text-xs text-gray-500 font-medium">
                      <span className="flex items-center gap-1">
                        <Calendar size={12} className="text-gray-400" />
                        {session.sessionDate}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock size={12} className="text-gray-400" />
                        {session.startTime} - {session.endTime}
                      </span>
                    </div>

                    {session.description && (
                      <p className="text-xs text-gray-500 line-clamp-1 mt-0.5">
                        {session.description}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LiveClassPage;
