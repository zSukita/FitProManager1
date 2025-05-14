import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';
import { AuthProvider } from './contexts/AuthContext';
import { Toaster } from 'react-hot-toast';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#fff',
              color: '#333',
            },
            success: {
              style: {
                border: '1px solid #22c55e',
              },
            },
            error: {
              style: {
                border: '1px solid #ef4444',
              },
            },
          }}
        />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);
