
import React, { useState } from 'react';
import { ChevronRight } from 'lucide-react';
 import logo_long from '../../assets/pos_logo_long.png';
 import pos_logo_long_inv from '../../assets/pos_logo_long_inv.png';
  import { userLogin } from '../../functions/auth';


import { parseJwt } from '../../utils/jwt';
import { Link, useNavigate } from 'react-router-dom';
import { setUserAssignedStores } from '../../functions/store';
import {  getSystemInfoFromLocalStorageOpti } from '../../functions/systemSettings';
import Database from '@tauri-apps/plugin-sql';


const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [saveCredentials, setSaveCredentials] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

   const isTauriApp = 'isTauri' in window && !!window.isTauri;
 const navigate = useNavigate();
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

   

        const systeminfo=await getSystemInfoFromLocalStorageOpti();

               console.log('systeminfo llll',systeminfo);
       if(systeminfo){
        navigate('/home');
       }
       else{
       navigate('/systemDataInitialization');
       }


      
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

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex flex-col">
      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-4 lg:p-8">
        <div className="w-full  bg-white rounded-3xl overflow-hidden">
          <div className="grid lg:grid-cols-2 ">
                {/* Right Side - Login Form */}
            <div className="p-8 lg:p-12 flex flex-col justify-center bg-white">
              <div className="max-w-md mx-auto w-full">
             
        <div className='flex justify-center mb-4'>
               <img src={logo_long} className='h-12' />
                </div>

                <div className="mb-8 text-center">

                 
                  <h3 className="text-3xl font-bold text-gray-800 mb-2">Welcome Back</h3>
                  <p className="text-gray-600 text-xl">Sign in to access your POS</p>
                </div>

                <div className="space-y-5">
                  <div>
                    <label htmlFor="email" className="block font-semibold text-gray-700 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all outline-none"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="you@example.com"
                    />
                  </div>

                  <div>
                    <label htmlFor="password" className="block font-semibold text-gray-700 mb-2">
                      Password
                    </label>
                    <input
                      type="password"
                      id="password"
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all outline-none"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="••••••••"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="saveCredentials"
                        className="h-4 w-4 text-sky-600 border-gray-300 rounded focus:ring-sky-500"
                        checked={saveCredentials}
                        onChange={(e) => setSaveCredentials(e.target.checked)}
                      />
                      <label htmlFor="saveCredentials" className="ml-2 text-md text-gray-700">
                        Remember me
                      </label>
                    </div>
                <Link
  to="/forgot-password"
  className="text-sky-600 font-semibold hover:text-sky-700 transition-colors"
>
  Forgot password?
</Link>
                  </div>

                  {errorMessage && (
                    <div className="text-red-600 text-sm bg-red-50 p-3 rounded-lg border border-red-200">
                      {errorMessage}
                    </div>
                  )}

                  <button
                    onClick={handleSubmit}
                    className={`w-full py-3 px-6 font-bold text-white bg-sky-600 rounded-lg shadow-lg hover:bg-sky-700 focus:outline-none focus:ring-4 focus:ring-sky-500 focus:ring-opacity-50 transition-all duration-200 ${
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
                </div>

                  <div className="mt-8 pt-6 border-t border-gray-200">
                  <p className="text-center text-xl text-gray-600 mb-4">
                    Don't have an account?{' '}
                    <a href="/signup" className="text-sky-600 font-semibold hover:text-sky-700">
                      Sign up
                    </a>
                  </p>
                  


<div className="flex flex-wrap justify-center gap-3 text-md text-gray-500">
  <Link 
    to="/privacy" 
    className="hover:text-sky-600 transition-colors"
  >
    Privacy Policy
  </Link>
  
  <span>•</span>
  
  <Link 
    to="/terms" 
    className="hover:text-sky-600 transition-colors"
  >
    Terms of Service
  </Link>
  
  <span>•</span>
  
  <Link 
    to="/refund" 
    className="hover:text-sky-600 transition-colors"
  >
    Refund Policy
  </Link>
</div>
                  
                  <p className="text-center text-gray-400 mt-4">
                    © 2026 Legend POS by Legendbyte
                  </p>
                </div>
              </div>

              

       

            </div>
            {/* Left Side - Marketing Content */}
            <div className="bg-gradient-to-br from-sky-600 to-sky-700 p-8 lg:p-12 text-white flex flex-col justify-center relative overflow-hidden">
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full -translate-x-1/2 -translate-y-1/2"></div>
                <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full translate-x-1/2 translate-y-1/2"></div>
              </div>

              <div className="relative z-10">
                {/* Logo/Brand */}
                <div className="mb-8">
                  <div className="flex items-center space-x-3 mb-4">
                    {/* <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl">
                      <Store className="w-8 h-8" />
                    </div>
                    
                    <h1 className="text-4xl font-bold">Legend POS</h1> */}
                    
    
                        <div className="flex justify-center flex-col items-center mb-8">
        
       
                  </div>
                       <img src={pos_logo_long_inv} className='h-12' />
                  <div className="h-1 w-20 bg-white/50 rounded-full"></div>
                </div>
                </div>

                {/* Main Headline */}
                <div className="mb-8">
                  <h2 className="text-4xl lg:text-5xl font-extrabold leading-tight mb-4">
                    Your Cloud POS,<br />
                  </h2>
                  <p className="text-2xl text-blue-100 font-medium">
                    Simple, Fast, Reliable
                  </p>
                </div>

                {/* Description */}
                <p className="text-lg text-blue-50 mb-8 leading-relaxed">
                  Run your store with a modern cloud-based POS system using your existing laptop, PC, or tablet. No expensive hardware required.
                </p>

               {/* Two highlighted features with icons */}
      {/* <div className="flex flex-col sm:flex-row gap-5 lg:gap-8 justify-center lg:justify-start mb-10">
        <div className="flex items-center gap-3 text-blue-50">
          <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl flex-shrink-0">
            <Cloud className="w-6 h-6" />
          </div>
          <span className="text-base lg:text-lg font-medium">Access Anywhere, Anytime</span>
        </div>

        <div className="flex items-center gap-3 text-blue-50">
          <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl flex-shrink-0">
            <Laptop className="w-6 h-6" />
          </div>
          <span className="text-base lg:text-lg font-medium">Use Your Existing Hardware</span>
        </div>
      </div> */}

<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
  <p className="text-lg font-semibold ">
    Try Legend Cloud POS free, no credit card required
  </p>

  <Link
    to="/signup"
    className="inline-flex w-fit items-center gap-1.5 bg-white text-sky-700 px-4 py-4 rounded-md font-semibold text-sm hover:bg-blue-50 transition-colors group"
  >
    <span>Sign up for free</span>
    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
  </Link>
</div>


              </div>
            </div>

        
          </div>
        </div>


      </div>


    </div>
  );
};

export default Login;














