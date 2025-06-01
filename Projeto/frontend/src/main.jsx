import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'

import { CarrinhoProvider } from './context/carrinhoProvider.jsx';
import { AuthProvider } from './context/authContext.jsx'


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <CarrinhoProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </CarrinhoProvider>
    </AuthProvider>
  </React.StrictMode>
)
