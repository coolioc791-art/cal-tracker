
import React, { useState } from 'react';

interface Props {
  onLogin: (username: string, password?: string) => void;
}

const Auth: React.FC<Props> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim() && password.trim()) {
      onLogin(username.trim().toLowerCase(), password);
    } else {
      alert("Please enter both a username and password.");
    }
  };

  return (
    <div className="p-8 pt-24 flex flex-col min-h-screen bg-gradient-to-br from-teal-600 to-indigo-900 text-center relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-[-10%] left-[-10%] w-64 h-64 bg-white/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-[-5%] right-[-5%] w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl" />

      <div className="relative z-10">
        <div className="mb-12">
          <div className="w-24 h-24 bg-white rounded-[2rem] mx-auto mb-8 flex items-center justify-center shadow-2xl shadow-black/20 transform rotate-3 hover:rotate-0 transition-transform duration-500">
            <svg className="w-12 h-12 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          <h1 className="text-4xl font-black text-white tracking-tight drop-shadow-sm">Wellness</h1>
          <h2 className="text-xl font-medium text-white/80 mt-1 tracking-wide">Your Journey Starts Here</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="text-left">
            <label className="block text-[10px] font-black text-white/60 uppercase tracking-[0.2em] mb-2 ml-1">Username</label>
            <div className="relative">
              <input
                type="text"
                required
                value={username}
                onChange={e => setUsername(e.target.value)}
                className="w-full p-5 bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl focus:border-white/50 focus:ring-0 focus:outline-none text-lg transition text-white placeholder-white/40 shadow-inner"
                placeholder="e.g. alex_growth"
              />
            </div>
          </div>
          
          <div className="text-left">
            <label className="block text-[10px] font-black text-white/60 uppercase tracking-[0.2em] mb-2 ml-1">Password</label>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full p-5 bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl focus:border-white/50 focus:ring-0 focus:outline-none text-lg transition text-white placeholder-white/40 shadow-inner"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-white text-teal-700 font-black py-5 rounded-2xl shadow-xl shadow-black/10 hover:bg-teal-50 active:scale-[0.98] transition-all text-xl mt-6 uppercase tracking-widest"
          >
            Sign In
          </button>
        </form>
        
        <p className="mt-10 text-xs text-white/50 leading-relaxed px-6 font-medium">
          Secure and private. Your data never leaves this device. 
          <br />
          <span className="opacity-40 italic">New accounts are created automatically.</span>
        </p>
      </div>
    </div>
  );
};

export default Auth;
