import React from 'react';
import { SessionUserContextProvider } from './components/contexts/sessionUserContext';
import { OngletAlerteProvider } from './components/contexts/ToastContext';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import MenuHeader from './layouts/MenuHeader';
import Footer from './layouts/Footer';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from 'react-router-dom';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <SessionUserContextProvider>
        <OngletAlerteProvider>
          <MenuHeader />
            <main>
              <App />
            </main>
          <Footer />
        </OngletAlerteProvider>
      </SessionUserContextProvider>
    </BrowserRouter>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
