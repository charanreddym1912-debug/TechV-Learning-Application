import { useEffect, useRef, useState } from 'react';
import { Video, Mic, MicOff, VideoOff, PhoneOff, Users, AlertCircle } from 'lucide-react';

interface ZoomMeetingProps {
  meetingNumber: string;
  signature: string;
  userName: string;
  password?: string;
  onLeave?: () => void;
}

/**
 * Zoom Embedded Web SDK wrapper.
 * When VITE_ZOOM_SDK_KEY is configured and the SDK is installed,
 * this component will embed the real Zoom meeting UI.
 * Currently renders a functional demo UI for development.
 */
export default function ZoomMeeting({
  meetingNumber,
  signature,
  userName,
  password,
  onLeave,
}: ZoomMeetingProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const sdkKey = import.meta.env.VITE_ZOOM_SDK_KEY;
  const isDemoMode = !sdkKey || sdkKey === 'your_zoom_sdk_key_here';

  useEffect(() => {
    if (isDemoMode || !containerRef.current) return;

    // Zoom SDK integration point — uncomment when @zoom/meetingsdk is installed:
    // import ZoomMtgEmbedded from '@zoom/meetingsdk/embedded';
    // const client = ZoomMtgEmbedded.createClient();
    // client.init({ zoomAppRoot: containerRef.current, ... });
    // client.join({ signature, meetingNumber, password, userName });
  }, [isDemoMode, meetingNumber, signature, userName, password]);

  if (isDemoMode) {
    return (
      <div className="flex flex-col h-full text-white">
        <div className="mb-4 bg-slate-900/90 backdrop-blur-md rounded-2xl border border-slate-800 p-4 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-slate-300">
            <Video className="w-4 h-4 text-zoom" />
            <span>Zoom Meeting ID</span>
          </div>
          <span className="font-mono text-primary-300">{meetingNumber}</span>
        </div>

        <div className="flex-1 bg-slate-900 rounded-2xl border border-slate-800 relative overflow-hidden min-h-[400px]">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-950 flex items-center justify-center">
            <div className="text-center">
              <div className="w-20 h-20 rounded-full bg-zoom/20 flex items-center justify-center mx-auto mb-4">
                <Video className="w-10 h-10 text-zoom" />
              </div>
              <p className="text-lg font-semibold">Demo Virtual Classroom</p>
              <p className="text-sm text-slate-400 mt-1">Meeting #{meetingNumber}</p>
              <p className="text-xs text-slate-500 mt-3 max-w-md">
                Configure <code className="text-primary-300">VITE_ZOOM_SDK_KEY</code> and install
                {' '}<code className="text-primary-300">@zoom/meetingsdk</code> for live Zoom embed.
              </p>
            </div>
          </div>

          <div className="absolute top-4 left-4 flex items-center gap-2 bg-red-500/20 border border-red-500/30 px-3 py-1 rounded-full">
            <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            <span className="text-xs text-red-300 font-medium">LIVE — Demo Mode</span>
          </div>

          <div className="absolute top-4 right-4 flex items-center gap-2 bg-slate-800/80 backdrop-blur-md px-3 py-1 rounded-lg">
            <Users className="w-4 h-4 text-slate-400" />
            <span className="text-xs text-slate-300">12 participants</span>
          </div>

          <div className="absolute bottom-4 left-4 right-4 grid grid-cols-3 gap-3">
            {['Dr. Sarah Chen', 'Alex Johnson', 'Student 3'].map((name) => (
              <div
                key={name}
                className="bg-slate-800/90 rounded-xl p-3 border border-slate-700 aspect-video flex items-end"
              >
                <span className="text-xs text-slate-300">{name}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-center gap-4 mt-4 py-3">
          <button
            type="button"
            onClick={() => setIsMuted(!isMuted)}
            className={`p-3 rounded-full ${isMuted ? 'bg-red-600' : 'bg-slate-700 hover:bg-slate-600'} transition-colors cursor-pointer`}
            aria-label={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>
          <button
            type="button"
            onClick={() => setIsVideoOff(!isVideoOff)}
            className={`p-3 rounded-full ${isVideoOff ? 'bg-red-600' : 'bg-slate-700 hover:bg-slate-600'} transition-colors cursor-pointer`}
            aria-label={isVideoOff ? 'Turn on camera' : 'Turn off camera'}
          >
            {isVideoOff ? <VideoOff className="w-5 h-5" /> : <Video className="w-5 h-5" />}
          </button>
          <button
            type="button"
            onClick={onLeave}
            className="p-3 rounded-full bg-red-600 hover:bg-red-700 transition-colors cursor-pointer"
            aria-label="Leave meeting"
          >
            <PhoneOff className="w-5 h-5" />
          </button>
        </div>

        <div className="flex items-center gap-2 mt-2 text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>Signature received: {signature.slice(0, 20)}… — Ready for SDK integration</span>
        </div>
      </div>
    );
  }

  return <div ref={containerRef} className="w-full h-full min-h-[500px]" />;
}
