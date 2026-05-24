import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { store, persistor } from './store'
import LoadingSpinner from './components/LoadingSpinner'
import { AppThemeProvider } from './context/ThemeContext'

const container = document.getElementById('root');
createRoot(container).render(
    <Provider store={store}>
        <PersistGate loading={<LoadingSpinner />} persistor={persistor}>
            <AppThemeProvider>
                <App />
            </AppThemeProvider>
        </PersistGate>
    </Provider>
);
