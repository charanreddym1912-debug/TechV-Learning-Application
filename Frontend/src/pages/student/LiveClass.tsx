import React from 'react';
import { Video } from 'lucide-react';

const LiveClassPage: React.FC = () => {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Live Class</h1>
        <p className="text-gray-500 mt-1">Join your live virtual classroom sessions</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-8 text-center">
        <Video size={48} className="text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-600 mb-2">Zoom Virtual Classroom</h3>
        <p className="text-sm text-gray-400 mb-4">
          The Zoom meeting will be embedded here when a live session is active.
        </p>

        {/* Zoom SDK container — will be activated when Zoom SDK is integrated */}
        <div id="zoom-meeting-container" className="w-full aspect-video bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center">
          <p className="text-gray-400 text-sm">Zoom SDK embed area</p>
        </div>
      </div>
    </div>
  );
};

export default LiveClassPage;
