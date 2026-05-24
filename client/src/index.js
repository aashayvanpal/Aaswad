import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { store, persistor } from './store'
import LoadingSpinner from './components/LoadingSpinner'
import { ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import theme from './theme'

const container = document.getElementById('root');
createRoot(container).render(
    <Provider store={store}>
        <PersistGate loading={<LoadingSpinner />} persistor={persistor}>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <App />
            </ThemeProvider>
        </PersistGate>
    </Provider>
);
