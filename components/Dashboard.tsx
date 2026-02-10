
import React from 'react';
import { AppState, View } from '../types';
import { calculateBMI } from '../constants';

interface Props {
  state: AppState;
  onNavigate: (view: View) => void;
  onLogout: () => void;
}

const Dashboard: React.FC<Props> = ({ state, onNavigate, onLogout }) => {
  const { profile, foodLogs, activityLogs, weightHistory } = state;
  const bmi = calculateBMI(profile.currentWeightLbs, profile.heightFeet, profile.heightInches);

  // Maintenance and Prediction Logic
  const totalInches = (profile.heightFeet * 12) + profile.heightInches;
  const maintenanceEst = Math.round((profile.currentWeightLbs * 12) + (totalInches * 5));
  const calorieGoal = profile.calorieGoal || 2000;
  const surplus = calorieGoal - maintenanceEst;
  const lbsPerWeek = Math.max(0, (surplus * 7) / 3500);
  const weightToGain = Math.max(0, profile.targetWeightLbs - profile.currentWeightLbs);
  const weeksToGoal = lbsPerWeek > 0 ? Math.ceil(weightToGain / lbsPerWeek) : null;

  // Calculate overall progress percentage
  const initialWeight = weightHistory.length > 0 ? weightHistory[weightHistory.length - 1].weight : profile.currentWeightLbs;
  const totalWeightGoal = Math.max(0.1, profile.targetWeightLbs - initialWeight);
  const currentGained = Math.max(0, profile.currentWeightLbs - initialWeight);
  const progressToGoal = Math.min(100, Math.max(0, (currentGained / totalWeightGoal) * 100));

  const todayStart = new Date().setHours(0, 0, 0, 0);
  const todayFood = foodLogs.filter(log => log.timestamp >= todayStart);
  
  const totalConsumed = todayFood.reduce((acc, curr) => acc + curr.calories, 0);
  const progressPercent = Math.min((totalConsumed / calorieGoal) * 100, 100);
  const remaining = calorieGoal - totalConsumed;

  const suggestedMeals = [
    { name: 'Fruit Smoothie', cals: '210 kcal', type: 'Light & Easy' },
    { name: 'Greek Yogurt', cals: '150 kcal', type: 'Small Bite' },
    { name: 'Apple & PB', cals: '190 kcal', type: 'Light Snack' },
    { name: 'Hummus & Cuc', cals: '120 kcal', type: 'Refreshing' }
  ];

  return (
    <div className="p-6 pt-10 space-y-6">
      <header className="flex justify-between items-start">
        <div>
          <h2 className="text-gray-500 text-sm font-medium">Hello, {profile.username}!</h2>
          <h1 className="text-2xl font-black text-gray-800 tracking-tight">Daily Status</h1>
        </div>
        <button 
          onClick={onLogout}
          className="p-2 bg-white rounded-xl shadow-sm border border-gray-100 text-gray-400 hover:text-red-500 transition"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
        </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Energy Goal Tracking */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 relative overflow-hidden group">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest">Energy Fuel</p>
              <p className="text-4xl font-black text-teal-600 mt-1">{totalConsumed}</p>
              <p className="text-xs text-gray-400 mt-1">kcal consumed today</p>
            </div>
            <div className="text-right">
              <div className="flex items-center justify-end gap-1 mb-1">
                <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest">Daily Goal</p>
                <button 
                  onClick={() => onNavigate(View.ONBOARDING)}
                  className="p-1 hover:bg-gray-100 rounded-md text-gray-300 hover:text-teal-600 transition"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                </button>
              </div>
              <p className="text-2xl font-bold text-gray-800">{calorieGoal}</p>
            </div>
          </div>
          <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
            <div 
              className={`h-full transition-all duration-700 ease-out ${totalConsumed > calorieGoal ? 'bg-red-500' : 'bg-teal-500'}`}
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <div className="mt-4 flex items-center justify-between">
             <span className="text-[10px] font-bold text-teal-700 bg-teal-50 px-2 py-1 rounded-md uppercase">BMI: {bmi.toFixed(1)}</span>
             <span className={`text-[10px] font-black uppercase ${remaining < 0 ? 'text-red-500' : 'text-gray-400'}`}>
               {remaining < 0 ? 'Exceeded limit' : remaining + ' kcal left'}
             </span>
          </div>
        </div>

        {/* Projection Card with Mini-Visual Chart */}
        <div className="bg-gradient-to-br from-indigo-600 to-indigo-900 p-6 rounded-3xl shadow-lg shadow-indigo-100 text-white relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                   <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg>
                </div>
                <h3 className="font-black text-[10px] uppercase tracking-widest text-indigo-100">Journey Forecast</h3>
              </div>
              <div className="text-right">
                 <p className="text-[10px] font-bold text-indigo-300 uppercase tracking-tighter">Timeline</p>
                 <p className="text-xl font-black leading-none">{weeksToGoal ? `~${weeksToGoal} wks` : '---'}</p>
              </div>
            </div>

            {/* Mini Projection Chart */}
            <div className="relative h-20 mb-6 bg-white/5 rounded-2xl p-4 flex flex-col justify-end">
               {/* Progress Line */}
               <div className="absolute top-1/2 left-4 right-4 h-0.5 bg-white/10 -translate-y-1/2" />
               <div className="absolute top-1/2 left-4 h-0.5 bg-indigo-400 -translate-y-1/2 shadow-[0_0_10px_rgba(129,140,248,0.5)] transition-all duration-1000 ease-out" style={{ width: `calc(${progressToGoal}% - 1rem)` }} />
               
               {/* Today Marker */}
               <div className="absolute top-1/2 -translate-y-1/2 transition-all duration-1000 ease-out" style={{ left: `calc(${progressToGoal}% + 0.5rem)` }}>
                  <div className="w-3 h-3 bg-white rounded-full border-4 border-indigo-500 shadow-lg" />
                  <p className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[9px] font-black uppercase whitespace-nowrap opacity-60">Today</p>
               </div>

               {/* Target Marker */}
               <div className="absolute top-1/2 right-4 -translate-y-1/2">
                  <div className="w-2 h-2 bg-indigo-300 rounded-full" />
                  <p className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[9px] font-black uppercase whitespace-nowrap opacity-60">Target</p>
               </div>

               {/* Projected Slope (Dotted Line) */}
               <svg className="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="none">
                 <line 
                   x1={`${Math.max(10, progressToGoal)}%`} 
                   y1="50%" 
                   x2="95%" 
                   y2="20%" 
                   stroke="white" 
                   strokeWidth="1.5" 
                   strokeDasharray="4 4" 
                   className="opacity-30"
                 />
               </svg>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mt-8">
              <div className="bg-white/5 p-3 rounded-xl border border-white/5">
                <p className="text-[9px] font-bold text-indigo-300 uppercase tracking-wider">Weekly Gain</p>
                <p className="text-lg font-black">+{lbsPerWeek.toFixed(1)} <span className="text-xs font-medium opacity-50">lbs</span></p>
              </div>
              <div className="bg-white/5 p-3 rounded-xl border border-white/5">
                <p className="text-[9px] font-bold text-indigo-300 uppercase tracking-wider">Projected At</p>
                <p className="text-lg font-black">{profile.calorieGoal} <span className="text-xs font-medium opacity-50">kcal</span></p>
              </div>
            </div>
            
            <div className="mt-4 pt-4 border-t border-white/10 flex justify-between items-center">
              <p className="text-[10px] font-medium text-indigo-200/50 leading-tight">
                Calculated surplus of {surplus} kcal/day
              </p>
              <button 
                onClick={() => onNavigate(View.AI_CHAT)}
                className="text-[10px] font-black bg-white/10 hover:bg-white/20 py-2 px-3 rounded-full transition uppercase tracking-tighter"
              >
                Ask Coach
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Light Ideas */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-gray-800 text-sm">Light & Nutritious Ideas</h3>
            <button 
              onClick={() => onNavigate(View.AI_CHAT)}
              className="text-[10px] font-black text-teal-600 uppercase tracking-wider"
            >
              Ask AI
            </button>
          </div>
          <div className="flex overflow-x-auto pb-2 gap-3 no-scrollbar">
            {suggestedMeals.map((meal, i) => (
              <div key={i} className="flex-shrink-0 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm w-36 hover:border-teal-200 transition">
                <span className="text-[9px] font-black uppercase text-teal-500 bg-teal-50 px-2 py-0.5 rounded-full">{meal.type}</span>
                <p className="font-bold text-gray-800 text-sm mt-2">{meal.name}</p>
                <p className="text-[10px] text-gray-400 font-medium mt-1">{meal.cals}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Primary Actions */}
        <div className="space-y-3">
          <h3 className="font-bold text-gray-800 text-sm">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-3">
            <button 
              onClick={() => onNavigate(View.LOG_FOOD)}
              className="bg-orange-500 text-white font-bold p-5 rounded-2xl shadow-lg shadow-orange-100 flex flex-col items-center gap-2 hover:bg-orange-600 active:scale-95 transition"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
              <span className="text-sm">Log Fuel</span>
            </button>
            <button 
              onClick={() => onNavigate(View.AI_CHAT)}
              className="bg-teal-600 text-white font-bold p-5 rounded-2xl shadow-lg shadow-teal-100 flex flex-col items-center gap-2 hover:bg-teal-700 active:scale-95 transition"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path></svg>
              <span className="text-sm">AI Coach</span>
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        <button 
          onClick={() => onNavigate(View.LOG_WEIGHT)}
          className="w-full bg-white border border-gray-100 text-indigo-600 font-black p-4 rounded-2xl shadow-sm flex items-center justify-center gap-2 hover:bg-gray-50 active:scale-[0.98] transition"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2z"></path></svg>
          Log Current Weight
        </button>

        {/* Move Goal */}
        <div onClick={() => onNavigate(View.LOG_ACTIVITY)} className="bg-white p-4 rounded-2xl border border-gray-100 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-teal-50 rounded-xl text-teal-600">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
            </div>
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Move</p>
              <p className="text-sm font-bold text-gray-800">Log Activity</p>
            </div>
          </div>
          <div className="text-right">
             <p className="text-lg font-black text-gray-700">60m</p>
             <p className="text-[9px] font-bold text-gray-400 uppercase">Rec. Daily</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
