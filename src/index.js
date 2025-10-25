import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import "primereact/resources/themes/lara-light-indigo/theme.css";
import {BrowserRouter as Router} from "react-router-dom";
import i18next from "i18next";
import LanguageDetector from 'i18next-browser-languagedetector';
import common_ca from './translations/common_ca.json';
import common_es from './translations/common_es.json';
import common_de from './translations/common_de.json';
import common_en from './translations/common_en.json';
import {I18nextProvider} from "react-i18next";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'primeicons/primeicons.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

i18next
    .use(LanguageDetector)
    .init({
        lng: 'ca',
        interpolation: {escapeValue: false},  // React already does escaping
        resources: {
            ca: {
                common: common_ca
            }
        }
    });

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 60 * 24, // 24h
      cacheTime: 1000 * 60 * 60 * 24, // mantener cache 24h
      refetchOnWindowFocus: false, // no recargar al volver al tab
    },
  },
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <Router>
        <QueryClientProvider client={queryClient}>
        <I18nextProvider i18n={i18next}>
            <App/>
        </I18nextProvider>
        </QueryClientProvider>
    </Router>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
