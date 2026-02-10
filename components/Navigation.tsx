
import React from 'react';
import { View } from '../types';

interface Props {
  currentView: View;
  onNavigate: (view: View) => void;
  viewMode?: 'mobile' | 'laptop';
}

const Navigation: React.FC<Props> = ({ currentView, onNavigate, viewMode = 'mobile' }) => {
  const navItems = [
    { view: View.DASHBOARD, label: 'Home', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
    { view: View.AI_CHAT, label: 'Coach', icon: 'M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z' },
    { view: View.PROGRESS, label: 'Stats', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
    { view: View.HELP, label: 'Help', icon: 'M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
  ];

  return (
    <nav className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-full ${viewMode === 'mobile' ? 'max-w-md' : 'max-w-4xl'} bg-white/95 backdrop-blur-md border-t border-gray-100 px-6 py-3 flex justify-between items-center z-50 transition-all duration-500`}>
      {navItems.map(item => (
        <button
          key={item.view}
          onClick={() => onNavigate(item.view)}
          className={`flex flex-col items-center gap-1 transition-all ${
            currentView === item.view ? 'text-teal-600 scale-110' : 'text-gray-400 scale-100'
          }`}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={item.icon}></path>
          </svg>
          <span className="text-[9px] font-black uppercase tracking-widest">{item.label}</span>
        </button>
      ))}
    </nav>
  );
};

export default Navigation;
