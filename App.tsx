
import React, { useState, useEffect } from 'react';
import { View, AppState, UserProfile } from './types';
import { STORAGE_KEY } from './constants';
import Onboarding from './components/Onboarding';
import Dashboard from './components/Dashboard';
import FoodLog from './components/FoodLog';
import ActivityLog from './components/ActivityLog';
import Progress from './components/Progress';
import Help from './components/Help';
import Navigation from './components/Navigation';
import WeightLog from './components/WeightLog';
import Auth from './components/Auth';
import AIChat from './components/AIChat';

const initialProfile: UserProfile = {
  username: '',
  password: '',
  age: 0,
  heightFeet: 0,
  heightInches: 0,
  currentWeightLbs: 0,
  targetWeightLbs: 0,
  calorieGoal: 2000,
  onboarded: false
};

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<string | null>(() => {
    return localStorage.getItem('ACTIVE_USER_SESSION');
  });

  const [viewMode, setViewMode] = useState<'mobile' | 'laptop'>('mobile');

  const [state, setState] = useState<AppState>(() => {
    const user = localStorage.getItem('ACTIVE_USER_SESSION');
    if (user) {
      const saved = localStorage.getItem(`${STORAGE_KEY}_${user}`);
      if (saved) return JSON.parse(saved);
    }
    return {
      profile: initialProfile,
      foodLogs: [],
      activityLogs: [],
      weightHistory: [],
      chatHistory: []
    };
  });

  const [currentView, setCurrentView] = useState<View>(View.AUTH);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(`${STORAGE_KEY}_${currentUser}`, JSON.stringify(state));
      localStorage.setItem('ACTIVE_USER_SESSION', currentUser);
      if (!state.profile.onboarded && currentView === View.AUTH) {
        setCurrentView(View.ONBOARDING);
      } else if (state.profile.onboarded && currentView === View.AUTH) {
        setCurrentView(View.DASHBOARD);
      }
    }
  }, [state, currentUser]);

  const handleLogin = (username: string, password?: string) => {
    const savedData = localStorage.getItem(`${STORAGE_KEY}_${username}`);
    if (savedData) {
      const parsedData: AppState = JSON.parse(savedData);
      if (parsedData.profile.password && parsedData.profile.password !== password) {
        alert("Incorrect password for this username. Please try again.");
        return;
      }
      setState(parsedData);
    } else {
      setState({
        profile: { ...initialProfile, username, password },
        foodLogs: [],
        activityLogs: [],
        weightHistory: [],
        chatHistory: []
      });
    }
    setCurrentUser(username);
  };

  const updateProfile = (profile: UserProfile) => {
    setState(prev => ({
      ...prev,
      profile,
      weightHistory: prev.weightHistory.length === 0 
        ? [{ timestamp: Date.now(), weight: profile.currentWeightLbs }]
        : prev.weightHistory
    }));
    setCurrentView(View.DASHBOARD);
  };

  const addFoodLog = (entry: any) => {
    setState(prev => ({ ...prev, foodLogs: [entry, ...prev.foodLogs] }));
    setCurrentView(View.DASHBOARD);
  };

  const addActivityLog = (entry: any) => {
    setState(prev => ({ ...prev, activityLogs: [entry, ...prev.activityLogs] }));
    setCurrentView(View.DASHBOARD);
  };

  const addWeightLog = (weight: number) => {
    setState(prev => ({
      ...prev,
      profile: { ...prev.profile, currentWeightLbs: weight },
      weightHistory: [{ timestamp: Date.now(), weight }, ...prev.weightHistory]
    }));
    setCurrentView(View.DASHBOARD);
  };

  const updateChatHistory = (history: any[]) => {
    setState(prev => ({ ...prev, chatHistory: history }));
  };

  const handleLogout = () => {
    localStorage.removeItem('ACTIVE_USER_SESSION');
    setCurrentUser(null);
    setCurrentView(View.AUTH);
  };

  const renderView = () => {
    if (!currentUser) return <Auth onLogin={handleLogin} />;
    
    switch (currentView) {
      case View.ONBOARDING:
        return <Onboarding onComplete={updateProfile} initialProfile={state.profile} />;
      case View.DASHBOARD:
        return <Dashboard state={state} onNavigate={setCurrentView} onLogout={handleLogout} />;
      case View.LOG_FOOD:
        return <FoodLog onSave={addFoodLog} onCancel={() => setCurrentView(View.DASHBOARD)} />;
      case View.LOG_ACTIVITY:
        return <ActivityLog onSave={addActivityLog} onCancel={() => setCurrentView(View.DASHBOARD)} />;
      case View.LOG_WEIGHT:
        return <WeightLog currentWeight={state.profile.currentWeightLbs} onSave={addWeightLog} onCancel={() => setCurrentView(View.DASHBOARD)} />;
      case View.PROGRESS:
        return <Progress state={state} profile={state.profile} />;
      case View.HELP:
        return <Help />;
      case View.AI_CHAT:
        return <AIChat profile={state.profile} history={state.chatHistory} onUpdateHistory={updateChatHistory} />;
      default:
        return <Dashboard state={state} onNavigate={setCurrentView} onLogout={handleLogout} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-0 md:py-8 flex flex-col items-center justify-center transition-colors duration-500">
      {/* View Toggle Switcher (Floating) */}
      <div className="fixed top-4 right-4 z-[100] flex bg-white rounded-full p-1 shadow-lg border border-gray-200">
        <button 
          onClick={() => setViewMode('mobile')}
          className={`p-2 rounded-full transition-all ${viewMode === 'mobile' ? 'bg-teal-600 text-white shadow-md' : 'text-gray-400 hover:bg-gray-50'}`}
          title="Phone View"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"></path></svg>
        </button>
        <button 
          onClick={() => setViewMode('laptop')}
          className={`p-2 rounded-full transition-all ${viewMode === 'laptop' ? 'bg-teal-600 text-white shadow-md' : 'text-gray-400 hover:bg-gray-50'}`}
          title="Laptop View"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
        </button>
      </div>

      <div className={`min-h-[100dvh] md:min-h-0 md:h-[844px] bg-gray-50 flex flex-col ${viewMode === 'mobile' ? 'w-full max-w-md' : 'w-full max-w-4xl'} mx-auto relative md:rounded-[3rem] shadow-2xl transition-all duration-500 overflow-hidden ring-8 ring-gray-900/5`}>
        <main className="flex-1 pb-20 overflow-y-auto no-scrollbar">
          {renderView()}
        </main>
        
        {currentUser && state.profile.onboarded && currentView !== View.ONBOARDING && currentView !== View.AUTH && (
          <Navigation currentView={currentView} onNavigate={setCurrentView} viewMode={viewMode} />
        )}
      </div>
    </div>
  );
};

export default App;
