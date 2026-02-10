
import React from 'react';
import { HEALTH_RESOURCES } from '../constants';

const Help: React.FC = () => {
  return (
    <div className="p-6 pt-10 space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-800">Help & Resources</h2>
        <p className="text-gray-500">Reputable health information for your journey.</p>
      </div>

      <div className="space-y-4">
        {HEALTH_RESOURCES.map((resource, idx) => (
          <a
            key={idx}
            href={resource.url}
            target="_blank"
            rel="noopener noreferrer"
            className="block p-5 bg-white rounded-2xl border border-gray-100 shadow-sm hover:border-teal-500 transition group"
          >
            <div className="flex justify-between items-start">
              <h3 className="font-bold text-gray-800 group-hover:text-teal-600 transition">{resource.title}</h3>
              <svg className="w-5 h-5 text-gray-300 group-hover:text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
            </div>
            <p className="text-sm text-gray-500 mt-1">{resource.description}</p>
          </a>
        ))}
      </div>

      <div className="bg-teal-600 p-6 rounded-3xl text-white">
        <h4 className="font-bold text-lg mb-2">Feeling overwhelmed?</h4>
        <p className="text-teal-50 opacity-90 text-sm leading-relaxed mb-4">
          Wellness is about feeling good in your body. If you ever feel stressed about food or weight, please talk to a trusted adult, school counselor, or doctor.
        </p>
        <button className="w-full bg-white text-teal-600 font-bold py-3 rounded-xl">
          Learn More About Self-Care
        </button>
      </div>

      <footer className="text-center py-4">
        <p className="text-xs text-gray-400">Wellness Journey App v1.0 • Privacy First</p>
      </footer>
    </div>
  );
};

export default Help;
