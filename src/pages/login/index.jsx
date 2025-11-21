import React, { useState, useEffect } from 'react';
import { userLogin } from '../../functions/auth';
import { parseJwt } from '../../utils/jwt';
import { useNavigate } from 'react-router-dom';
import { setUserAssignedStores } from '../../functions/store';
import { loadSystemInfoToLocalStorage } from '../../functions/systemSettings';
import Database from '@tauri-apps/plugin-sql';
import logo_long from '../../assets/pos_logo_long.png';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [saveCredentials, setSaveCredentials] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const isTauriApp = 'isTauri' in window && !!window.isTauri;

  useEffect(() => {
    const loadCredentials = async () => {
      try {
        const db = await Database.load('sqlite:credentials.db');

        await db.execute(`
          CREATE TABLE IF NOT EXISTS credentials (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            email TEXT NOT NULL,
            password TEXT NOT NULL
          )
        `);

        const result = await db.select('SELECT email, password FROM credentials ORDER BY id DESC LIMIT 1');
        if (result.length > 0) {
          setEmail(result[0].email);
          setPassword(result[0].password);
          setSaveCredentials(true);
        }
        await db.close();
      } catch (error) {
        console.error('Failed to load credentials:', error);
      }
    };

    if (isTauriApp) {
      loadCredentials();
    }
  }, []);

  const signIn = async () => {
    try {
      localStorage.clear();
      setIsLoading(true);
      setErrorMessage('');

      const payload = { userName: email, password };

      const authRes = await userLogin(payload);

      if (authRes.status === 422 || authRes.status === 401) {
        setErrorMessage(authRes.data?.error || authRes.data?.exception?.message);
        setIsLoading(false);
        return;
      }

      const accessToken = authRes.data.accessToken;
      localStorage.setItem('token', accessToken);
      const plaindata = parseJwt(accessToken);

      localStorage.setItem('tenantId', plaindata.tenantId);
      localStorage.setItem('userId', plaindata.userId);
      localStorage.setItem('stores', JSON.stringify(plaindata.stores));
      localStorage.setItem('user', JSON.stringify(plaindata));

      await setUserAssignedStores(plaindata.userId);

      if (isTauriApp) {
        try {
          const db = await Database.load('sqlite:credentials.db');
          await db.execute('DELETE FROM credentials');

          if (saveCredentials) {
            await db.execute(
              'INSERT INTO credentials (email, password) VALUES ($1, $2)',
              [email, password]
            );
          }
          await db.close();
        } catch (error) {
          console.error('Failed to save credentials:', error);
        }
      }

      await loadSystemInfoToLocalStorage();
      navigate('/home');
    } catch (error) {
      setErrorMessage('An error occurred. Please try again.');
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent page reload
    if (!isLoading) {
      await signIn();
    }
  };

  return (
    <div className="min-h-screen bg-[#edf2fa] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl p-8 border-gray-200 border-2">

        <div className="flex justify-center flex-col items-center mb-8">
          <h2 className="text-3xl font-extrabold text-gray-700 mb-5">Welcome to</h2>
          <img src={logo_long} className='h-12' />
        </div>

        <p className="mt-2 text-center text-xl text-gray-700 font-bold mb-4">Sign in</p>

        {/* FORM STARTS HERE */}
        <form onSubmit={handleSubmit} className="space-y-6">

          <div>
            <label htmlFor="email" className="block font-medium text-gray-700">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              className="mt-1 w-full px-4 py-3 bg-gray-50 border rounded-lg"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              id="password"
              className="mt-1 w-full px-4 py-3 bg-gray-50 border rounded-lg"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="saveCredentials"
              className="h-4 w-4 text-sky-600 border-gray-300 rounded"
              checked={saveCredentials}
              onChange={(e) => setSaveCredentials(e.target.checked)}
            />
            <label htmlFor="saveCredentials" className="ml-2 text-gray-900">
              Save Credentials
            </label>
          </div>

          {errorMessage && (
            <div className="text-red-600 text-sm text-center bg-red-50 p-3 rounded-lg">
              {errorMessage}
            </div>
          )}

               <button
           // onClick={signIn}
           type="submit"
            className={`w-full py-3 px-6 font-semibold text-white bg-sky-600 rounded-lg shadow-md hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 transition duration-200 ${
              isLoading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <svg
                  className="animate-spin h-5 w-5 mr-2 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8h8a8 8 0 01-8 8 8 8 0 01-8-8z"
                  ></path>
                </svg>
                Signing In...
              </span>
            ) : (
              'Sign In'
            )}
          </button>
        </form>
        {/* FORM ENDS */}

        <div className="mt-6 text-center space-y-3">
          <a href="#" className="text-sky-600 font-bold hover:text-sky-800">
            Forgot my password
          </a>
        </div>

      </div>
    </div>
  );
};

export default Login;
