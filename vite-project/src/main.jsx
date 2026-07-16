import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import {BrowserRouter} from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './redux/store.js';
import ErrorBoundary from './componentes/ErrorBoundary.jsx';
import './Design-system.css';
// Presentación por plantilla (grilla/tarjetas/imagen por tema). Va
// DESPUÉS de Design-system para poder pisar la presentación base.
import './temas.css';
// Mejoras globales de mobile — van al final para tener la última palabra
// en los ajustes puntuales de celular.
import './mobile.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
  <Provider store={store}>
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
  </Provider>
  </BrowserRouter>
)