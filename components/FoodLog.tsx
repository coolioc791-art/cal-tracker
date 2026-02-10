
import React, { useState, useRef } from 'react';
import { FoodLogEntry } from '../types';
import { GoogleGenAI, Type } from "@google/genai";

interface Props {
  onSave: (entry: FoodLogEntry) => void;
  onCancel: () => void;
}

const FoodLog: React.FC<Props> = ({ onSave, onCancel }) => {
  const [mealName, setMealName] = useState('');
  const [mealDetails, setMealDetails] = useState('');
  const [calories, setCalories] = useState<string>('');
  const [explanation, setExplanation] = useState<string>('');
  const [isEstimating, setIsEstimating] = useState(false);
  const [showRefinePrompt, setShowRefinePrompt] = useState(false);
  const detailsRef = useRef<HTMLTextAreaElement>(null);

  const handleSave = () => {
    const calNum = parseInt(calories);
    if (!mealName || isNaN(calNum) || calNum <= 0) return;
    onSave({
      id: Date.now().toString(),
      timestamp: Date.now(),
      mealName: mealDetails ? `${mealName} (${mealDetails})` : mealName,
      calories: calNum
    });
  };

  const quickAdd = (val: number) => {
    setCalories(prev => {
      const current = parseInt(prev) || 0;
      return (current + val).toString();
    });
    setShowRefinePrompt(false);
  };

  const estimateCaloriesWithAI = async () => {
    if (!mealName) {
      alert("Please enter a meal name first.");
      return;
    }

    setIsEstimating(true);
    setExplanation('');
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Estimate calories for: "${mealName}". 
                   Details (portion/cooking): "${mealDetails || 'Standard portion'}". 
                   Provide a single integer estimate and a 1-sentence explanation.`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              calories: {
                type: Type.INTEGER,
                description: "Estimated calories as an integer."
              },
              explanation: {
                type: Type.STRING,
                description: "Very brief explanation of the estimate based on details."
              }
            },
            required: ["calories", "explanation"]
          }
        },
      });

      const result = JSON.parse(response.text || '{}');
      if (result.calories) {
        setCalories(result.calories.toString());
        setExplanation(result.explanation);
        setShowRefinePrompt(true);
      }
    } catch (error) {
      console.error("AI Estimation failed", error);
      alert("Could not estimate calories. Please enter them manually.");
    } finally {
      setIsEstimating(false);
    }
  };

  const startRefine = () => {
    setShowRefinePrompt(false);
    detailsRef.current?.focus();
  };

  return (
    <div className="p-6 pt-10 flex flex-col h-full space-y-6 bg-white overflow-y-auto no-scrollbar pb-24">
      <div>
        <h2 className="text-2xl font-black text-gray-800 tracking-tight">Log Fuel</h2>
        <p className="text-gray-500 text-sm">Every meal counts toward your growth journey.</p>
      </div>

      <div className="space-y-5">
        <div className="space-y-2">
          <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Meal Name</label>
          <input
            type="text"
            value={mealName}
            onChange={e => setMealName(e.target.value)}
            className="w-full p-4 border-2 border-gray-100 rounded-2xl focus:border-orange-500 focus:outline-none text-lg font-medium transition placeholder:text-gray-300"
            placeholder="e.g. Chicken Alfredo"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Details (Portion & Cooking)</label>
          <textarea
            ref={detailsRef}
            value={mealDetails}
            onChange={e => setMealDetails(e.target.value)}
            className="w-full p-4 border-2 border-gray-100 rounded-2xl focus:border-orange-500 focus:outline-none text-sm font-medium transition min-h-[80px] placeholder:text-gray-300"
            placeholder="e.g. Large bowl, extra cheese, creamy sauce..."
          />
        </div>

        <div className="relative pt-4">
          <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 mb-2">Energy Estimate (kcal)</label>
          <div className="flex gap-2">
            <input
              type="number"
              inputMode="numeric"
              value={calories}
              onChange={e => {
                setCalories(e.target.value);
                setShowRefinePrompt(false);
              }}
              className="flex-1 p-6 border-2 border-gray-100 rounded-3xl focus:border-orange-500 focus:outline-none text-4xl font-black text-center text-orange-600 transition"
              placeholder="0"
            />
            <button
              onClick={estimateCaloriesWithAI}
              disabled={isEstimating || !mealName}
              className="w-16 bg-indigo-600 text-white rounded-3xl shadow-lg shadow-indigo-100 flex items-center justify-center hover:bg-indigo-700 active:scale-95 transition disabled:opacity-50"
              title="Estimate with AI"
            >
              {isEstimating ? (
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
              )}
            </button>
          </div>

          {explanation && (
            <div className="mt-3 p-3 bg-indigo-50 rounded-xl border border-indigo-100 animate-in fade-in slide-in-from-top-2 duration-300">
               <p className="text-[10px] font-medium text-indigo-700 leading-relaxed italic">" {explanation} "</p>
            </div>
          )}

          {showRefinePrompt && (
            <div className="mt-4 p-4 bg-orange-50 rounded-2xl border border-orange-100 flex flex-col items-center text-center animate-in zoom-in-95 duration-200">
              <p className="text-xs font-bold text-orange-800 mb-2">Does this look accurate?</p>
              <button 
                onClick={startRefine}
                className="text-[10px] font-black bg-white text-orange-600 px-4 py-2 rounded-full border border-orange-200 shadow-sm uppercase tracking-tighter hover:bg-orange-100 transition"
              >
                Refine Details & Re-Estimate
              </button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-4 gap-2">
          {[50, 100, 200, 500].map(val => (
            <button 
              key={val}
              onClick={() => quickAdd(val)}
              className="bg-gray-50 text-gray-500 font-bold py-3 rounded-xl border border-gray-100 hover:bg-orange-50 hover:text-orange-600 hover:border-orange-100 transition text-sm"
            >
              +{val}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-auto space-y-3 pt-6 pb-4">
        <button
          onClick={handleSave}
          disabled={!mealName || !calories || isEstimating}
          className="w-full bg-orange-500 text-white font-black py-5 rounded-2xl shadow-xl shadow-orange-100 disabled:opacity-50 text-lg uppercase tracking-widest active:scale-[0.98] transition-all"
        >
          Save Meal
        </button>
        <button
          onClick={onCancel}
          className="w-full bg-white text-gray-400 font-bold py-4 rounded-2xl text-sm uppercase tracking-widest hover:text-gray-600 transition"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default FoodLog;
