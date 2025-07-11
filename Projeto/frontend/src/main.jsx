import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css'
import App from './App.jsx'
import { CarrinhoProvider } from './context/carrinhoProvider.jsx';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/authProvider.jsx';
import { createBrowserRouter } from 'react-router-dom';
import { FavoritesProvider } from './context/favoritesContext.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
<React.StrictMode>
      <AuthProvider>
        <CarrinhoProvider>
          <FavoritesProvider>
            <BrowserRouter>
              <App />
            </BrowserRouter>
          </FavoritesProvider>
        </CarrinhoProvider>
      </AuthProvider>
  </React.StrictMode>
)