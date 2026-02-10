
import React, { useState } from 'react';

interface Props {
  currentWeight: number;
  onSave: (weight: number) => void;
  onCancel: () => void;
}

const WeightLog: React.FC<Props> = ({ currentWeight, onSave, onCancel }) => {
  const [weight, setWeight] = useState<string>(currentWeight.toString());

  const handleSave = () => {
    const wNum = parseFloat(weight);
    if (isNaN(wNum) || wNum <= 0) return;
    onSave(wNum);
  };

  return (
    <div className="p-6 pt-10 flex flex-col h-full space-y-8 bg-white">
      <div>
        <h2 className="text-2xl font-bold text-gray-800">Log Your Weight</h2>
        <p className="text-gray-500">Keep your progress updated.</p>
      </div>

      <div className="space-y-6">
        <div className="text-center p-8 bg-indigo-50 rounded-3xl border border-indigo-100">
           <p className="text-indigo-600 text-sm font-bold uppercase tracking-widest mb-2">Previous</p>
           <p className="text-4xl font-black text-indigo-700">{currentWeight} <span className="text-xl">lbs</span></p>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">New Weight (lbs)</label>
          <input
            type="number"
            step="0.1"
            inputMode="decimal"
            value={weight}
            onChange={e => setWeight(e.target.value)}
            className="w-full p-6 border-2 border-gray-100 rounded-3xl focus:border-indigo-500 focus:outline-none text-4xl font-black text-center text-indigo-600 transition"
            placeholder="0.0"
          />
        </div>
      </div>

      <div className="mt-auto space-y-3 pt-6">
        <button
          onClick={handleSave}
          disabled={!weight}
          className="w-full bg-indigo-600 text-white font-bold py-4 rounded-2xl shadow-lg shadow-indigo-100 disabled:opacity-50 text-lg"
        >
          Update Weight
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

export default WeightLog;
