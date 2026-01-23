import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const LegalLayout = ({ title, children }) => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
      {/* Header Bar */}
      {/* <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center space-x-2 text-sky-600 hover:text-sky-700 font-semibold transition-colors group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span>Back</span>
          </button>
        </div>
      </div> */}

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white shadow-xl rounded-2xl overflow-hidden border border-gray-100">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-sky-600 to-sky-700 px-8 md:px-12 py-10">
            <h1 className="text-4xl md:text-5xl font-extrabold text-white">
              {title}
            </h1>
          </div>

          {/* Content Section */}
          <div className="px-8 md:px-12 py-10">
            <div className="prose prose-lg prose-sky max-w-none text-gray-600 space-y-6 leading-relaxed">
              {children}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-gray-500 text-sm">
          © 2026 Legendbyte. All rights reserved.
        </div>
      </div>
    </div>
  );
};

export default LegalLayout;