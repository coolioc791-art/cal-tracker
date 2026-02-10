
import React, { useState } from 'react';
import { ActivityLogEntry } from '../types';

interface Props {
  onSave: (entry: ActivityLogEntry) => void;
  onCancel: () => void;
}

const ActivityLog: React.FC<Props> = ({ onSave, onCancel }) => {
  const [activityType, setActivityType] = useState('');
  const [duration, setDuration] = useState<number>(30);

  const activities = ['Walking', 'Running', 'Soccer', 'Basketball', 'Dance', 'Swimming', 'Cycling', 'Gym'];

  const handleSave = () => {
    if (!activityType || duration <= 0) return;
    onSave({
      id: Date.now().toString(),
      timestamp: Date.now(),
      activityType,
      durationMinutes: duration
    });
  };

  return (
    <div className="p-6 pt-10 flex flex-col h-full space-y-8 bg-white">
      <div>
        <h2 className="text-2xl font-bold text-gray-800">Log Movement</h2>
        <p className="text-gray-500">How did you move your body today?</p>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-4">What did you do?</label>
          <div className="grid grid-cols-2 gap-2">
            {activities.map(act => (
              <button
                key={act}
                onClick={() => setActivityType(act)}
                className={`p-3 rounded-xl border-2 font-medium transition ${
                  activityType === act ? 'border-teal-600 bg-teal-50 text-teal-700' : 'border-gray-50 bg-gray-50 text-gray-500'
                }`}
              >
                {act}
              </button>
            ))}
          </div>
          <input
            type="text"
            value={activityType}
            onChange={e => setActivityType(e.target.value)}
            className="w-full mt-3 p-4 border-2 border-gray-100 rounded-2xl focus:border-teal-500 focus:outline-none"
            placeholder="Or type something else..."
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Duration (minutes)</label>
          <div className="flex items-center gap-4">
            <input
              type="range"
              min="5"
              max="120"
              step="5"
              value={duration}
              onChange={e => setDuration(parseInt(e.target.value))}
              className="flex-1 accent-teal-600"
            />
            <span className="text-xl font-bold text-teal-700 w-16 text-center">{duration}m</span>
          </div>
        </div>
      </div>

      <div className="mt-auto space-y-3 pt-6">
        <button
          onClick={handleSave}
          disabled={!activityType}
          className="w-full bg-teal-600 text-white font-bold py-4 rounded-2xl shadow-lg shadow-teal-100 disabled:opacity-50 text-lg"
        >
          Save Activity
        </button>
        <button
          onClick={onCancel}
          className="w-full bg-gray-50 text-gray-500 font-bold py-4 rounded-2xl text-lg"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default ActivityLog;
