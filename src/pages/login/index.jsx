import React, { useState } from 'react';
import { userLogin } from '../../functions/auth';
import { parseJwt } from '../../utils/jwt';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const signIn = async () => {
    try {
      localStorage.clear();
      setIsLoading(true);
      setErrorMessage('');
      const payload = {
        userName: email,
        password: password,
      };
      const authRes = await userLogin(payload);

      if (authRes.status === 422 || authRes.status === 401) {
        setErrorMessage(authRes.data?.error || authRes.data?.exception?.message);
        setIsLoading(false);
        return;
      }

      const accessToken = authRes.data.accessToken;
      localStorage.setItem('token', accessToken);
      const plaindata = parseJwt(accessToken);
      console.log('plaindata',plaindata)
      localStorage.setItem('tenantId', plaindata.tenantId);
      localStorage.setItem('userId', plaindata.userId);
      localStorage.setItem('stores', JSON.stringify(plaindata.stores));
      localStorage.setItem('user', JSON.stringify(plaindata));

      navigate('/home');
    } catch (error) {
      setErrorMessage('An error occurred. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center">
      <div className="w-full max-w-lg bg-white shadow-lg rounded-lg p-8">
        <h2 className="text-4xl font-bold text-center text-gray-800">
          Welcome to VibePOS
        </h2>
        <p className="text-center text-gray-600 mt-2">
          Sign in to your account
        </p>

        <div className="mt-8">
          <div className="mb-6">
            <label
              htmlFor="email"
              className="block text-md font-medium text-gray-700"
            >
              Email
            </label>
            <input
              type="text"
              id="email"
              className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition duration-200"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
            />
          </div>
          <div className="mb-6">
            <label
              htmlFor="password"
              className="block text-md font-medium text-gray-700"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition duration-200"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
            />
          </div>

          {errorMessage && (
            <div className="mb-4 text-red-500 text-center text-sm">
              {errorMessage}
            </div>
          )}
   
            <button
              onClick={signIn}
              className={`w-full py-3 px-6 text-white font-medium rounded-full shadow-lg bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-offset-2 transition duration-200 ${
                isLoading ? 'opacity-70 cursor-not-allowed' : ''
              }`}
              disabled={isLoading}
            >
              {isLoading ? 'Signing In...' : 'Login'}
            </button>
          </div>
     

        <div className="mt-6 text-center text-gray-600">
          <p>
            Need help?{' '}
            <a
              href="#"
              className="text-sky-600 hover:underline focus:underline"
            >
              Contact Support
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
