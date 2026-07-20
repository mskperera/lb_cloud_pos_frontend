import React from 'react';
import { FaEnvelope } from 'react-icons/fa';

const EmailFeature = ({ isSelected, onSelect, email, setEmail, emailError, setEmailError, placeholder = 'Enter email address' }) => (
  <div className="space-y-3">
    <button
      type="button"
      onClick={onSelect}
      className={`group flex w-full items-center gap-3 rounded-xl border px-3 py-3 text-left shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md ${
        isSelected
          ? 'bg-gradient-to-r from-violet-500 to-red-600 text-white border-transparent'
          : 'bg-white border-violet-200 text-slate-700 hover:bg-slate-50'
      }`}
    >
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-red-600 text-white shadow-sm">
        <FaEnvelope className="h-5 w-5" />
      </div>
      <div className="flex-1">
        <div className={`text-sm font-semibold ${isSelected ? 'text-white' : 'text-slate-800'}`}>
          Email
        </div>
        <div className={`text-xs ${isSelected ? 'text-white/80' : 'text-slate-500'}`}>
          Send the document to the customer email
        </div>
      </div>
      <div className={`h-3.5 w-3.5 rounded-full border-2 ${isSelected ? 'border-white bg-white' : 'border-slate-300 bg-transparent'}`} />
    </button>

    {isSelected && (
      <div className="flex flex-col gap-2">
        <label htmlFor="email" className="text-sm font-semibold text-slate-700">
          Email Address
        </label>
        <input
          id="email"
          type="email"
          className={`w-full rounded-lg border px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:ring-2 focus:ring-sky-500 ${emailError ? 'border-red-400' : 'border-slate-300'}`}
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setEmailError('');
          }}
          placeholder={placeholder}
          autoComplete="email"
        />
        {emailError && <p className="text-sm text-red-600">{emailError}</p>}
      </div>
    )}
  </div>
);

export default EmailFeature;
