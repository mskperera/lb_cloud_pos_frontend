import React, { useEffect, useState } from 'react';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import './login.css';
import { userLogin } from '../../functions/auth';
import FormElementMessage from '../../components/messges/FormElementMessage';
import { parseJwt } from '../../utils/jwt';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  useEffect(() => {
    // dispatch(setTitle(null))
  }, []);

  const navigate=useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState('');

  const signIn=async()=>{
    try{
    setIsLoading(true);
    setErrorMessage('');
    const payload = { 
      userName: email,
       password: password 
    };
   const authRes=await userLogin(payload);
   console.log(authRes);
   setIsLoading(false);

   const accessToken=authRes.data.accessToken;
   localStorage.setItem('token',accessToken);

   const plaindata=parseJwt(accessToken);
   console.log('plaindata',plaindata);
   localStorage.setItem('tenantId',plaindata.tenantId);
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
              <div className="input-label">Email</div>
              <div >
                <InputText className="input-text" type="email" value={email} onChange={(e) => setEmail(e.target.value)} style={{ width: '100%' }} />
              </div>
            </div>

            <div className="input-field">
              <div className="input-label">Password</div>
              <div >
                <InputText className="input-text" type="password" value={password} onChange={(e) => setPassword(e.target.value)} style={{ width: '100%' }} />
              </div>
            </div>
          </div>

          <div className="button-container">
            <Button onClick={signIn} text rounded>
              <div className="login-button">
              {isLoading ? (
                <i className="pi pi-spin pi-spinner" />
              ) : (
                <i className="pi pi-calculator" />
              )}
                <div>Login</div>
              </div>
            </Button>
          </div>
         {errorMessage && <FormElementMessage
         
              className="mt-2 w-full"
              severity="error"
              text={`${errorMessage}`}
            />}
        </div>

      </div>
    </div>
  );
};

export default Login;
