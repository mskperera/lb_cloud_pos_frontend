import React, { useState } from 'react';
import { userLogin } from '../../functions/auth';
import { parseJwt } from '../../utils/jwt';
import { useNavigate } from 'react-router-dom';
import { setUserAssignedStores } from '../../functions/store';
import { loadSystemInfoToLocalStorage } from '../../functions/systemSettings';

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
    localStorage.setItem('tenantId', plaindata.tenantId);
    localStorage.setItem('userId', plaindata.userId);
    localStorage.setItem('stores', JSON.stringify(plaindata.stores));
    localStorage.setItem('user', JSON.stringify(plaindata));
    await setUserAssignedStores(plaindata.userId);

    await loadSystemInfoToLocalStorage();

    // 👉 Try fullscreen
    const el = document.documentElement; // whole page
    const req =
      el.requestFullscreen ||
      el.webkitRequestFullscreen ||
      el.mozRequestFullScreen ||
      el.msRequestFullscreen;
    if (req) {
      await req.call(el);
    }

    navigate('/home');
  } catch (error) {
    setErrorMessage('An error occurred. Please try again.');
    setIsLoading(false);
  }
};


  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-100 via-sky-50 to-sky-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 transform transition-all duration-300 hover:shadow-2xl">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-sky-900 tracking-tight">
            Welcome to Legend POS
          </h2>
          <p className="mt-2 text-lg text-sky-700 font-bold">
            Sign in
          </p>
        </div>

        <div className="space-y-6">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email Address
            </label>
            <input
              type="email"
              id="email"
              className="mt-1 w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition duration-200"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              className="mt-1 w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition duration-200"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          {errorMessage && (
            <div className="text-red-600 text-sm text-center bg-red-50 p-3 rounded-lg">
              {errorMessage}
            </div>
          )}

          <button
            onClick={signIn}
            className={`w-full py-3 px-6 text-sm font-semibold text-white bg-sky-600 rounded-lg shadow-md hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 transition duration-200 ${
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

        <div className="mt-6 text-center space-y-3">
          <p className="text-sm text-gray-500">
            Forgot your password?{' '}
            <a
              href="#"
              className="text-sky-600 hover:text-sky-800 font-medium transition duration-200"
            >
              Reset it here
            </a>
          </p>
          <p className="text-sm text-gray-500">
            Need assistance?{' '}
            <a
              href="#"
              className="text-sky-600 hover:text-sky-800 font-medium transition duration-200"
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

// import React, { useState } from 'react';
// import { userLogin } from '../../functions/auth';
// import { parseJwt } from '../../utils/jwt';
// import { useNavigate } from 'react-router-dom';
// import { setUserAssignedStores } from '../../functions/store';
// import { loadSystemInfoToLocalStorage } from '../../functions/systemSettings';

// const Login = () => {
//   const navigate = useNavigate();
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [errorMessage, setErrorMessage] = useState('');
//   const [isLoading, setIsLoading] = useState(false);

//   const signIn = async () => {
//     try {
//       localStorage.clear();
//       setIsLoading(true);
//       setErrorMessage('');
//       const payload = {
//         userName: email,
//         password: password,
//       };
//       const authRes = await userLogin(payload);

//       if (authRes.status === 422 || authRes.status === 401) {
//         setErrorMessage(authRes.data?.error || authRes.data?.exception?.message);
//         setIsLoading(false);
//         return;
//       }


//       const accessToken = authRes.data.accessToken;
//       localStorage.setItem('token', accessToken);
//       const plaindata = parseJwt(accessToken);
//       console.log('plaindata',plaindata)
//       localStorage.setItem('tenantId', plaindata.tenantId);
//       localStorage.setItem('userId', plaindata.userId);
//       localStorage.setItem('stores', JSON.stringify(plaindata.stores));
//       localStorage.setItem('user', JSON.stringify(plaindata));
//       await setUserAssignedStores(plaindata.userId);

//       await loadSystemInfoToLocalStorage();
//       navigate('/home');
//     } catch (error) {
//       setErrorMessage('An error occurred. Please try again.');
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-slate-100 flex items-center justify-center">
//       <div className="w-full max-w-lg bg-white shadow-lg rounded-lg p-8">
//         <h2 className="text-4xl font-bold text-center text-gray-800">
//           Welcome to Legend POS
//         </h2>
//         <p className="text-center text-gray-600 mt-2">
//           Sign in to your account
//         </p>

//         <div className="mt-8">
//           <div className="mb-6">
//             <label
//               htmlFor="email"
//               className="block text-md font-medium text-gray-700"
//             >
//               Email
//             </label>
//             <input
//               type="text"
//               id="email"
//               className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition duration-200"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               placeholder="Enter your email"
//             />
//           </div>
//           <div className="mb-6">
//             <label
//               htmlFor="password"
//               className="block text-md font-medium text-gray-700"
//             >
//               Password
//             </label>
//             <input
//               type="password"
//               id="password"
//               className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition duration-200"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               placeholder="Enter your password"
//             />
//           </div>

//           {errorMessage && (
//             <div className="mb-4 text-red-500 text-center text-sm">
//               {errorMessage}
//             </div>
//           )}
   
//             <button
//               onClick={signIn}
//               className={`w-full py-3 px-6 text-white font-medium rounded-full shadow-lg bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-offset-2 transition duration-200 ${
//                 isLoading ? 'opacity-70 cursor-not-allowed' : ''
//               }`}
//               disabled={isLoading}
//             >
//               {isLoading ? 'Signing In...' : 'Login'}
//             </button>
//           </div>
     

//         <div className="mt-6 text-center text-gray-600">
//           <p>
//             Need help?{' '}
//             <a
//               href="#"
//               className="text-sky-600 hover:underline focus:underline"
//             >
//               Contact Support
//             </a>
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Login;
