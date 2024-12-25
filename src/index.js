import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { Provider } from 'react-redux'
import {store} from './state/store.js';
// import 'primeflex/primeflex.css'; // Import PrimeFlex CSS
// import "primereact/resources/themes/md-light-indigo/theme.css";
// import 'primereact/resources/primereact.min.css';         // Core CSS
import 'primeicons/primeicons.css';                      // Icons CSS    

import { PrimeReactProvider } from 'primereact/api';

 

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <PrimeReactProvider value={{ ripple: true }}>
  <React.StrictMode>
    <Provider store={store}>
    <App />
    </Provider>
  </React.StrictMode>
  </PrimeReactProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();