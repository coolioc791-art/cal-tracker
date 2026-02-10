
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, AreaChart, Area } from 'recharts';
import { AppState, UserProfile } from '../types';
import { getHealthyWeightRange } from '../constants';

interface Props {
  state: AppState;
  profile: UserProfile;
}

const Progress: React.FC<Props> = ({ state, profile }) => {
  const { weightHistory, foodLogs } = state;
  const healthyRange = getHealthyWeightRange(profile.heightFeet, profile.heightInches, profile.age);

  // Weight Data
  const weightData = weightHistory.map(h => ({
    date: new Date(h.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
    weight: h.weight,
  })).reverse().slice(-7);

  // Calorie Data (Daily sum)
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - i);
    d.setHours(0,0,0,0);
    return d.getTime();
  }).reverse();

  const calorieData = last7Days.map(ts => {
    const dailyTotal = foodLogs
      .filter(log => {
        const logDate = new Date(log.timestamp).setHours(0,0,0,0);
        return logDate === ts;
      })
      .reduce((sum, log) => sum + log.calories, 0);
    
    return {
      date: new Date(ts).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
      calories: dailyTotal
    };
  });

  return (
    <div className="p-6 pt-10 space-y-10 pb-10">
      <div>
        <h2 className="text-2xl font-bold text-gray-800">Progress Trends</h2>
        <p className="text-gray-500">Seeing how your habits shape your goals.</p>
      </div>

      {/* Calorie Trend Chart */}
      <section className="space-y-4">
        <h3 className="font-bold text-gray-700 flex items-center gap-2">
           <div className="w-2 h-2 bg-orange-500 rounded-full" />
           Daily Calories (Last 7 Days)
        </h3>
        <div className="bg-white p-4 rounded-3xl border border-gray-100 shadow-sm h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={calorieData}>
              <defs>
                <linearGradient id="colorCal" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f97316" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
              <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#9ca3af' }} />
              <YAxis hide={true} domain={[0, 'dataMax + 500']} />
              <Tooltip 
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }} 
                labelStyle={{ fontWeight: 'bold' }}
                formatter={(value) => [`${value} kcal`, 'Consumed']}
              />
              <ReferenceLine y={profile.calorieGoal} stroke="#94a3b8" strokeDasharray="3 3" />
              <Area type="monotone" dataKey="calories" stroke="#f97316" fillOpacity={1} fill="url(#colorCal)" strokeWidth={3} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* Weight Trend Chart */}
      <section className="space-y-4">
        <h3 className="font-bold text-gray-700 flex items-center gap-2">
           <div className="w-2 h-2 bg-teal-500 rounded-full" />
           Weight Trend (lbs)
        </h3>
        <div className="bg-white p-4 rounded-3xl border border-gray-100 shadow-sm h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={weightData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
              <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#9ca3af' }} />
              <YAxis hide={true} domain={['dataMin - 10', 'dataMax + 10']} />
              <Tooltip 
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }} 
                labelStyle={{ fontWeight: 'bold' }}
                formatter={(value) => [`${value} lbs`, 'Weight']}
              />
              <ReferenceLine y={profile.targetWeightLbs} stroke="#f97316" strokeDasharray="5 5" />
              <Line 
                type="monotone" 
                dataKey="weight" 
                stroke="#0d9488" 
                strokeWidth={3} 
                dot={{ fill: '#0d9488', r: 4 }} 
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </section>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-orange-50 p-6 rounded-3xl border border-orange-100">
          <h4 className="font-bold text-orange-800 text-xs uppercase tracking-wide">Goal</h4>
          <p className="text-xl font-bold text-orange-600 mt-1">{profile.calorieGoal} kcal</p>
        </div>
        <div className="bg-teal-50 p-6 rounded-3xl border border-teal-100">
          <h4 className="font-bold text-teal-800 text-xs uppercase tracking-wide">Target</h4>
          <p className="text-xl font-bold text-teal-600 mt-1">{profile.targetWeightLbs} lbs</p>
        </div>
      </div>
    </div>
  );
};

export default Progress;
