
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { UserProfile, ChatMessage } from '../types';

interface Props {
  profile: UserProfile;
  history: ChatMessage[];
  onUpdateHistory: (history: ChatMessage[]) => void;
}

const AIChat: React.FC<Props> = ({ profile, history, onUpdateHistory }) => {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history, loading]);

  const sendMessage = async (overrideInput?: string) => {
    const textToSend = overrideInput || input;
    if (!textToSend.trim() || loading) return;

    const userMessage: ChatMessage = { role: 'user', text: textToSend };
    const newHistory = [...history, userMessage];
    onUpdateHistory(newHistory);
    setInput('');
    setLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: newHistory.map(m => ({
          role: m.role,
          parts: [{ text: m.text }]
        })),
        config: {
          systemInstruction: `Role: Ultra-concise Wellness Coach for ${profile.username} (${profile.age} years old).
          
Goal: Support healthy growth and weight gain through direct, bulleted advice.

STRICT STYLE RULES:
- NO conversational filler (e.g., "I'm happy to help", "Great question").
- Use bullet points for ALL suggestions.
- Max 3-4 bullets per response.
- Get straight to the point.

WEIGHT GAIN PREDICTION LOGIC:
- Maintenance Estimate: (~${profile.currentWeightLbs} * 12) + (${(profile.heightFeet * 12) + profile.heightInches} * 5) = ~${Math.round((profile.currentWeightLbs * 12) + (((profile.heightFeet * 12) + profile.heightInches) * 5))} kcal.
- Current Surplus: ${profile.calorieGoal} - Maintenance.
- Prediction: 500 kcal daily surplus = ~1 lb gain per week.
- Total Goal: ${Math.max(0, profile.targetWeightLbs - profile.currentWeightLbs)} lbs to gain.

LIGHT MEAL EXAMPLES (FOR LOW APPETITE):
- Smoothies: Banana, nut butter, whole milk/oat milk, and a handful of spinach.
- Small Savory: Avocado toast with hemp seeds or a turkey/cheese roll-up.
- Chilled: Greek yogurt with honey and walnuts or cottage cheese with pineapple.
- Quick Bites: Energy balls (oats/dates/cocoa) or a handful of trail mix.
- Liquid Fuel: Bone broth or chocolate protein milk.

Always remind them that "fueling your brain and growth" is the priority.`,
          temperature: 0.6,
        },
      });

      const modelText = response.text || "I'm having trouble thinking. Try again?";
      onUpdateHistory([...newHistory, { role: 'model', text: modelText }]);
    } catch (error) {
      console.error("Chat error:", error);
      onUpdateHistory([...newHistory, { role: 'model', text: "Connection error. Let's try that again." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-50">
      <header className="p-4 bg-white border-b border-gray-100 flex items-center justify-between sticky top-0 z-10">
        <div>
          <h2 className="text-xl font-black text-teal-600">Coach Chat</h2>
          <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">Memory Active • {profile.username}</p>
        </div>
        <div className="w-10 h-10 bg-teal-50 rounded-2xl flex items-center justify-center">
          <svg className="w-6 h-6 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
        </div>
      </header>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar">
        {history.length === 0 && (
          <div className="text-center py-12 px-6">
            <div className="w-20 h-20 bg-white rounded-3xl mx-auto mb-6 flex items-center justify-center shadow-sm border border-gray-100">
               <svg className="w-10 h-10 text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path></svg>
            </div>
            <h3 className="text-lg font-bold text-gray-800">Hi {profile.username}!</h3>
            <p className="text-gray-400 text-sm mt-2 leading-relaxed">
              Ask me for quick, bulleted advice on your journey.
            </p>
            
            <div className="mt-8 space-y-2">
               <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest mb-2">Quick Commands:</p>
               <button 
                 onClick={() => sendMessage("How long will it take to reach my goal?")}
                 className="w-full text-xs font-bold text-indigo-700 border border-indigo-100 bg-white p-4 rounded-2xl hover:bg-indigo-50 transition text-left flex items-center justify-between group shadow-sm"
               >
                 "How long will it take?"
                 <svg className="w-4 h-4 opacity-0 group-hover:opacity-100 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
               </button>
               <button 
                 onClick={() => sendMessage("Give me 3 light meal ideas to help me hit my goal.")}
                 className="w-full text-xs font-bold text-teal-700 border border-teal-100 bg-white p-4 rounded-2xl hover:bg-teal-50 transition text-left flex items-center justify-between group shadow-sm"
               >
                 "3 Light meal ideas"
                 <svg className="w-4 h-4 opacity-0 group-hover:opacity-100 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
               </button>
            </div>
          </div>
        )}
        
        {history.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] p-4 rounded-3xl text-sm leading-relaxed whitespace-pre-wrap ${
              msg.role === 'user' 
                ? 'bg-teal-100 text-gray-900 rounded-br-none shadow-sm border border-teal-200' 
                : 'bg-white text-black rounded-bl-none border border-gray-100 shadow-sm font-medium'
            }`}>
              {msg.text}
            </div>
          </div>
        ))}
        
        {loading && (
          <div className="flex justify-start">
            <div className="bg-white px-5 py-4 rounded-3xl rounded-bl-none border border-gray-100 shadow-sm flex gap-1.5 items-center">
              <div className="w-1.5 h-1.5 bg-teal-400 rounded-full animate-bounce" />
              <div className="w-1.5 h-1.5 bg-teal-400 rounded-full animate-bounce [animation-delay:0.2s]" />
              <div className="w-1.5 h-1.5 bg-teal-400 rounded-full animate-bounce [animation-delay:0.4s]" />
            </div>
          </div>
        )}
      </div>

      <div className="p-4 bg-white border-t border-gray-100 pb-24">
        <div className="flex gap-2 bg-gray-50 p-1.5 rounded-2xl border border-gray-100">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyPress={e => e.key === 'Enter' && sendMessage()}
            placeholder="Ask your coach..."
            className="flex-1 p-3 bg-transparent border-none rounded-xl focus:outline-none text-sm text-black font-medium placeholder:text-gray-400"
          />
          <button 
            onClick={() => sendMessage()}
            disabled={!input.trim() || loading}
            className="p-3 bg-teal-600 text-white rounded-xl shadow-md disabled:opacity-50 transition active:scale-95 flex items-center justify-center"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIChat;
