import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css'
import App from './App.jsx'
import { CarrinhoProvider } from './context/carrinhoProvider.jsx';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/authProvider.jsx';
import { FavoritosProvider } from './context/favoritosProvider.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
      <AuthProvider>
        <CarrinhoProvider>
          <FavoritosProvider>
            <BrowserRouter>
              <App />
            </BrowserRouter>
          </FavoritosProvider>
        </CarrinhoProvider>
      </AuthProvider>
  </React.StrictMode>
);
