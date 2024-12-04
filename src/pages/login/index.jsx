import React, { useEffect, useState } from 'react';
import './login.css';
import { userLogin } from '../../functions/auth';
import FormElementMessage from '../../components/messges/FormElementMessage';
import { parseJwt } from '../../utils/jwt';
import { useNavigate } from 'react-router-dom';

const Login = () => {

  const navigate=useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState('');

  const signIn=async()=>{
    try{
      localStorage.clear();
    setIsLoading(true);
    setErrorMessage('');
    const payload = { 
      userName: email,
       password: password 
    };
   const authRes=await userLogin(payload);

   if(authRes.status===422){
    setErrorMessage(authRes.data.error);
    setIsLoading(false);
    return;
   }

   if(authRes.status===401){
    setErrorMessage(authRes.data.exception.message);
    setIsLoading(false);
    return;
   }

   setIsLoading(false);
   console.log('authRes',authRes);
   const accessToken=authRes.data.accessToken;

   localStorage.setItem('token',accessToken);
   console.log('accessToken',accessToken)
   const plaindata=parseJwt(accessToken);
   console.log('plaindata',plaindata);
   localStorage.setItem('tenantId',plaindata.tenantId);
   localStorage.setItem('userId',plaindata.userId);
   localStorage.setItem('stores', JSON.stringify(plaindata.stores));

   navigate('/home')
if(authRes.data.exception){

  setErrorMessage(authRes.data.exception.message);
  return;
}
}
catch(error){
  setErrorMessage(error);
  setIsLoading(false);
}

  }
  return (
    <div className="login-container">
      <div className="login-screen">
        <div className="login-header">
          <h2>Welcome to Legendbyte POS</h2>
          <p>Sign in to your Account</p>
        </div>

        <div className="login-form">
          <div className="input-fields">
            <div className="input-field">
             
            <label for="email" className="input-label">Email</label>
              {/* <div className="relative mt-4 rounded-md shadow-sm">   */}
          {/* <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <span className="text-gray-500 sm:text-lg">@</span>
          </div> */}
          <input
            type="text"
            name="email"
            id="email"
            className="input-text"
            //placeholder="Username"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        {/* </div> */}
                {/* <InputText className="input-text" type="email" value={email} onChange={(e) => setEmail(e.target.value)} style={{ width: '100%' }} /> */}
          
            </div>

            <div className="input-field">
              <div for="password" className="input-label">Password</div>
             
              <input
        className="input-text"
        type="password"
        name="password"
        id="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
          />

              {/* <div>
                <InputText
                  className="input-text"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{ width: "100%" }}
                />
              </div> */}
            </div>
          </div>

          <div className="button-container">
            <button onClick={signIn} text rounded>
              <div className="login-button">
                {isLoading ? (
                  <i className="pi pi-spin pi-spinner" />
                ) : (
                  <i className="pi pi-calculator" />
                )}
                <div>Login</div>
              </div>
            </button>
          </div>
          {errorMessage && (
            <FormElementMessage
              className="mt-2 w-full"
              severity="error"
              text={`${errorMessage}`}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
