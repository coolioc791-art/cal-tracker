
import React, { useState, useEffect } from 'react';
import { UserProfile } from '../types';
import { getHealthyWeightRange } from '../constants';

interface Props {
  onComplete: (profile: UserProfile) => void;
  initialProfile: UserProfile;
}

const Onboarding: React.FC<Props> = ({ onComplete, initialProfile }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<UserProfile>({
    ...initialProfile,
    onboarded: true
  });

  const isTeen = formData.age >= 12 && formData.age <= 17;
  const totalInches = (formData.heightFeet * 12) + formData.heightInches;
  const healthyRange = totalInches > 0 && formData.age >= 12 
    ? getHealthyWeightRange(formData.heightFeet, formData.heightInches, formData.age) 
    : null;

  // Simple Mifflin-St Jeor approximation for maintenance (assuming sedentary/moderate for safety)
  // Men: (10 × weight in kg) + (6.25 × height in cm) - (5 × age in years) + 5
  // Women: (10 × weight in kg) + (6.25 × height in cm) - (5 × age in years) - 161
  // For teens, we use a simpler average to avoid over-complicating: 
  // Roughly (Weight * 11) + (Height_in_inches * 5)
  const maintenanceEst = Math.round((formData.currentWeightLbs * 12) + (totalInches * 5));
  
  const calorieSurplus = formData.calorieGoal - maintenanceEst;
  const lbsPerWeek = Math.max(0, (calorieSurplus * 7) / 3500);
  const weightToGain = Math.max(0, formData.targetWeightLbs - formData.currentWeightLbs);
  const weeksToGoal = lbsPerWeek > 0 ? Math.ceil(weightToGain / lbsPerWeek) : Infinity;

  const nextStep = () => setStep(s => s + 1);
  const prevStep = () => setStep(s => s - 1);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.age < 12) {
      alert("This app is for users aged 12 and older.");
      return;
    }
    onComplete(formData);
  };

  useEffect(() => {
    // Set a reasonable default if empty
    if (step === 4 && (!formData.calorieGoal || formData.calorieGoal === 0)) {
       setFormData(prev => ({ ...prev, calorieGoal: maintenanceEst + 300 }));
    }
  }, [step]);

  return (
    <div className="p-6 pt-12 flex flex-col h-full bg-white">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-teal-600">Welcome!</h1>
        <p className="text-gray-500 mt-2">Let's set up your wellness profile.</p>
        <div className="flex gap-2 mt-4">
          {[1, 2, 3, 4].map(i => (
            <div 
              key={i} 
              className={`h-2 flex-1 rounded-full ${step >= i ? 'bg-teal-500' : 'bg-gray-200'}`}
            />
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="flex-1 flex flex-col">
        {step === 1 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right duration-300">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">How old are you?</label>
              <input
                type="number"
                required
                min="12"
                value={formData.age || ''}
                onChange={e => setFormData({ ...formData, age: parseInt(e.target.value) || 0 })}
                className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-teal-500 focus:outline-none text-lg text-black"
                placeholder="e.g. 15"
              />
              {isTeen && (
                <div className="mt-4 p-4 bg-blue-50 border-l-4 border-blue-400 rounded-r-lg">
                  <p className="text-sm text-blue-700 leading-relaxed">
                    <strong>Growth Tip:</strong> Since you're still growing, focus on eating a variety of foods. Your body needs healthy fuel for brain development and physical growth!
                  </p>
                </div>
              )}
            </div>
            <button
              type="button"
              onClick={nextStep}
              disabled={formData.age < 12}
              className="mt-auto w-full bg-teal-600 text-white font-bold py-4 rounded-xl hover:bg-teal-700 transition disabled:opacity-50"
            >
              Continue
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right duration-300">
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700 mb-1">Height</label>
              <div className="flex gap-4">
                <div className="flex-1 relative">
                  <input
                    type="number"
                    required
                    min="0"
                    max="8"
                    value={formData.heightFeet || ''}
                    onChange={e => setFormData({ ...formData, heightFeet: parseInt(e.target.value) || 0 })}
                    className="w-full p-4 pr-10 border-2 border-gray-200 rounded-xl focus:border-teal-500 focus:outline-none text-lg text-black"
                    placeholder="Feet"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium">ft</span>
                </div>
                <div className="flex-1 relative">
                  <input
                    type="number"
                    required
                    min="0"
                    max="11"
                    value={formData.heightInches || ''}
                    onChange={e => setFormData({ ...formData, heightInches: parseInt(e.target.value) || 0 })}
                    className="w-full p-4 pr-10 border-2 border-gray-200 rounded-xl focus:border-teal-500 focus:outline-none text-lg text-black"
                    placeholder="Inches"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium">in</span>
                </div>
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Current Weight (lbs)</label>
              <input
                type="number"
                required
                step="0.1"
                value={formData.currentWeightLbs || ''}
                onChange={e => setFormData({ ...formData, currentWeightLbs: parseFloat(e.target.value) || 0 })}
                className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-teal-500 focus:outline-none text-lg text-black"
                placeholder="e.g. 135.5"
              />
            </div>
            <div className="flex gap-4">
              <button
                type="button"
                onClick={prevStep}
                className="flex-1 bg-gray-100 text-gray-700 font-bold py-4 rounded-xl hover:bg-gray-200 transition"
              >
                Back
              </button>
              <button
                type="button"
                onClick={nextStep}
                disabled={!(formData.heightFeet > 0 || formData.heightInches > 0) || !formData.currentWeightLbs}
                className="flex-[2] bg-teal-600 text-white font-bold py-4 rounded-xl hover:bg-teal-700 transition disabled:opacity-50"
              >
                Continue
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right duration-300">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Target Weight (lbs)</label>
              <input
                type="number"
                required
                step="0.1"
                value={formData.targetWeightLbs || ''}
                onChange={e => setFormData({ ...formData, targetWeightLbs: parseFloat(e.target.value) || 0 })}
                className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-teal-500 focus:outline-none text-lg text-black"
                placeholder="e.g. 140"
              />
              {healthyRange && (
                <div className="mt-4 p-4 bg-teal-50 rounded-xl border border-teal-100">
                  <p className="text-sm font-medium text-teal-800">Healthy Weight Guidance</p>
                  <p className="text-xs text-teal-600 mt-1">
                    Based on your height and age, a standard healthy range is roughly 
                    <span className="font-bold"> {healthyRange.min}lbs - {healthyRange.max}lbs</span>.
                  </p>
                </div>
              )}
            </div>
            <div className="flex gap-4 mt-auto">
              <button
                type="button"
                onClick={prevStep}
                className="flex-1 bg-gray-100 text-gray-700 font-bold py-4 rounded-xl hover:bg-gray-200 transition"
              >
                Back
              </button>
              <button
                type="button"
                onClick={nextStep}
                disabled={!formData.targetWeightLbs}
                className="flex-[2] bg-teal-600 text-white font-bold py-4 rounded-xl hover:bg-teal-700 transition"
              >
                Continue
              </button>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right duration-300">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Daily Calorie Goal</label>
              <div className="flex gap-2 items-center">
                <input
                  type="number"
                  required
                  min="1000"
                  max="5000"
                  value={formData.calorieGoal || ''}
                  onChange={e => setFormData({ ...formData, calorieGoal: parseInt(e.target.value) || 0 })}
                  className="flex-1 p-4 border-2 border-gray-200 rounded-xl focus:border-teal-500 focus:outline-none text-lg text-black"
                  placeholder="e.g. 2200"
                />
                <div className="px-3 py-1 bg-gray-50 rounded-lg border border-gray-100">
                  <p className="text-[10px] font-bold text-gray-400 uppercase">Est. Base</p>
                  <p className="text-xs font-black text-gray-600">{maintenanceEst}</p>
                </div>
              </div>

              {/* Prediction Section */}
              <div className="mt-6 p-5 bg-indigo-50 rounded-2xl border border-indigo-100 space-y-4">
                <h4 className="font-black text-indigo-800 text-xs uppercase tracking-widest">Weight Gain Forecast</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-[10px] font-bold text-indigo-400 uppercase">Weekly Gain</p>
                    <p className="text-lg font-black text-indigo-700">+{lbsPerWeek.toFixed(1)} <span className="text-sm font-medium">lbs</span></p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-indigo-400 uppercase">Pace</p>
                    <p className="text-lg font-black text-indigo-700">
                      {lbsPerWeek < 0.5 ? 'Very Slow' : lbsPerWeek < 1.5 ? 'Moderate' : 'Fast'}
                    </p>
                  </div>
                </div>
                <div className="pt-2 border-t border-indigo-100">
                  <p className="text-[10px] font-bold text-indigo-400 uppercase">Timeline to {formData.targetWeightLbs}lbs</p>
                  <p className="text-2xl font-black text-indigo-600 mt-1">
                    {weeksToGoal === Infinity ? 'Need Surplus' : `~${weeksToGoal} weeks`}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex gap-4 mt-auto">
              <button
                type="button"
                onClick={prevStep}
                className="flex-1 bg-gray-100 text-gray-700 font-bold py-4 rounded-xl hover:bg-gray-200 transition"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={!formData.calorieGoal}
                className="flex-[2] bg-teal-600 text-white font-bold py-4 rounded-xl hover:bg-teal-700 shadow-lg shadow-teal-200 transition disabled:opacity-50"
              >
                Finish Setup
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default Onboarding;
