import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ToasterProvider } from './components/ui/Toaster';
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <ToasterProvider>
        <App />
      </ToasterProvider>
    </BrowserRouter>
  </StrictMode>
);
