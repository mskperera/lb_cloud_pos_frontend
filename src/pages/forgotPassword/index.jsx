// src/pages/ForgotPassword.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import pos_logo_long_inv from '../../assets/pos_logo_long_inv.png';
import { resetForgotPassword, resetForgotPasswordVerify } from '../../functions/auth';


const ForgotPassword = () => {
  const [step, setStep] = useState(1); // 1: email, 2: code + new pass, 3: success
  const [email, setEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [status, setStatus] = useState({ type: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Timer (5 min = 300 sec)
  const [timeLeft, setTimeLeft] = useState(0);
  const isTimerActive = step === 2 && timeLeft > 0;

  const navigate = useNavigate();

  // Countdown logic
  useEffect(() => {
    if (!isTimerActive) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev <= 1 ? 0 : prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [isTimerActive]);

  const formatTime = (sec) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const MessageBox = () =>
    status.message ? (
      <div
        className={`p-4 rounded-lg border text-sm ${
          status.type === 'success'
            ? 'bg-green-50 border-green-200 text-green-800'
            : 'bg-red-50 border-red-200 text-red-800'
        }`}
      >
        {status.message}
      </div>
    ) : null;

  // Step 1: Request reset code
  const handleRequestCode = async () => {
    if (!email.trim()) {
      setStatus({ type: 'error', message: 'Please enter your email address.' });
      return;
    }

    setIsSubmitting(true);
    setStatus({ type: '', message: '' });

    try {
      const res = await resetForgotPasswordVerify({ userName: email.trim() });

      if (res?.data?.exception || res?.data?.error) {
        setStatus({
          type: 'error',
          message: res.data?.exception?.message || res.data?.error || 'Unable to send code.',
        });
        return;
      }

      setStatus({ type: 'success', message: res.data?.message || 'Verification code sent to your email.' });
      setTimeLeft(300);
      setStep(2);
    } catch (err) {
      setStatus({ type: 'error', message: 'Something went wrong. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Step 2: Verify code & reset password
  const handleResetPassword = async () => {
    if (!verificationCode.trim()) {
      setStatus({ type: 'error', message: 'Please enter the verification code.' });
      return;
    }
    if (timeLeft === 0) {
      setStatus({ type: 'error', message: 'Code has expired. Please request a new one.' });
      return;
    }
    if (!newPassword || !confirmPassword) {
      setStatus({ type: 'error', message: 'Please fill in both password fields.' });
      return;
    }
    if (newPassword !== confirmPassword) {
      setStatus({ type: 'error', message: 'Passwords do not match.' });
      return;
    }

    setIsSubmitting(true);
    setStatus({ type: '', message: '' });

    try {
      const payload = {
        userName: email.trim(),
        password: newPassword,
        verificationCode: verificationCode.trim(),
      };

      const res = await resetForgotPassword(payload);

      if (res?.data?.exception || res?.data?.error) {
        setStatus({
          type: 'error',
          message:
            res.data?.exception?.message ||
            res.data?.error ||
            'Password reset failed. Code may be invalid or expired.',
        });
        return;
      }

      setStatus({ type: 'success', message: 'Password reset successfully! You can now sign in.' });
      setStep(3);
    } catch (err) {
      setStatus({ type: 'error', message: 'An unexpected error occurred.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-gray-800 text-center">Reset Your Password</h2>
            <p className="text-gray-600 text-center">
              Enter your email and we'll send you a verification code.
            </p>

            <div>
              <label className="block font-semibold text-gray-700 mb-2">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                autoFocus
                className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 outline-none"
              />
            </div>

            <MessageBox />

            <button
              onClick={handleRequestCode}
              disabled={isSubmitting}
              className={`w-full py-3.5 font-bold text-white bg-sky-600 rounded-lg hover:bg-sky-700 transition-all ${
                isSubmitting ? 'opacity-60 cursor-not-allowed' : ''
              }`}
            >
              {isSubmitting ? 'Sending code...' : 'Send Verification Code'}
            </button>

            <p className="text-center text-gray-600">
              <Link to="/signin" className="text-sky-600 hover:underline">
                Back to Sign In
              </Link>
            </p>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-gray-800 text-center">Enter Verification Code</h2>
            <p className="text-gray-600 text-center">
              We sent a code to <strong>{email}</strong>
            </p>

            <div className="text-center text-lg font-mono font-bold text-sky-600">
              Time remaining: <span className={timeLeft < 60 ? 'text-red-600' : ''}>{formatTime(timeLeft)}</span>
            </div>

            <div>
              <label className="block font-semibold text-gray-700 mb-2">Verification Code</label>
              <input
                type="text"
                value={verificationCode}
                onChange={(e) =>    setVerificationCode(
      e.target.value.replace(/[^a-zA-Z0-9]/g, '').slice(0, 6)
    )}
                placeholder="Enter 6-digit code"
                maxLength={6}
                className="w-full px-4 py-3 text-center text-xl font-mono tracking-widest border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 outline-none"
                autoFocus
              />
            </div>

            <div>
              <label className="block font-semibold text-gray-700 mb-2">New Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-gray-700 mb-2">Confirm New Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 outline-none"
              />
            </div>

            <MessageBox />

            <button
              onClick={handleResetPassword}
              disabled={isSubmitting || timeLeft === 0}
              className={`w-full py-3.5 font-bold text-white bg-sky-600 rounded-lg hover:bg-sky-700 transition-all ${
                isSubmitting || timeLeft === 0 ? 'opacity-60 cursor-not-allowed' : ''
              }`}
            >
              {isSubmitting ? 'Resetting...' : 'Reset Password'}
            </button>

            <div className="text-center text-sm text-gray-500">
              Didn't get the code?{' '}
              <button
                onClick={handleRequestCode}
                disabled={isSubmitting}
                className="text-sky-600 hover:underline"
              >
                Resend
              </button>
            </div>

            <p className="text-center">
              <Link to="/login" className="text-sky-600 hover:underline">
                Back to Sign In
              </Link>
            </p>
          </div>
        );

      case 3:
        return (
          <div className="text-center space-y-8 py-12">
            <div className="mx-auto w-20 h-20 rounded-full bg-green-100 flex items-center justify-center">
              <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>

            <h2 className="text-3xl font-bold text-gray-800">Password Reset Successful!</h2>
            <p className="text-lg text-gray-600">
              Your password has been updated. You can now sign in with your new credentials.
            </p>

            <MessageBox />

            <button
              onClick={() => navigate('/signin')}
              className="w-full max-w-xs mx-auto py-3.5 font-bold text-white bg-sky-600 rounded-lg hover:bg-sky-700 transition-all"
            >
              Go to Sign In
            </button>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex flex-col">
      <div className="flex-1 flex items-center justify-center p-4 lg:p-8">
        <div className="w-full max-w-5xl bg-white rounded-3xl shadow-xl overflow-hidden">
          <div className="grid lg:grid-cols-2 min-h-[580px]">
            {/* Form Side */}
            <div className="p-8 lg:p-12 flex flex-col justify-center">
              <div className="max-w-md mx-auto w-full">
                <div className="mb-10 text-center">
                  {/* <img src={pos_logo_long_inv} alt="Legend POS" className="h-12 mx-auto mb-6" /> */}
                  {renderStep()}
                </div>
              </div>
            </div>

            {/* Marketing Side – same as Login */}
            <div className="hidden lg:flex bg-gradient-to-br from-sky-600 to-sky-700 p-12 text-white flex-col justify-center relative overflow-hidden">
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full -translate-x-1/2 -translate-y-1/2" />
                <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full translate-x-1/2 translate-y-1/2" />
              </div>


              <div className="relative z-10">
                <div className="mb-10">
                  <img src={pos_logo_long_inv} className="h-12" alt="Legend POS" />
                </div>
                <h2 className="text-4xl lg:text-5xl font-extrabold mb-6">
                  Your Cloud POS,<br />Simple, Fast, Reliable
                </h2>
                <p className="text-lg text-blue-100 mb-8">
                  Run your store with a modern cloud-based POS system using your existing hardware.
                </p>
                <p className="text-xl font-semibold">Need help?</p>
                <p className="text-blue-100">Contact support via email or chat.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;