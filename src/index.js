import { jsx as _jsx } from "react/jsx-runtime";
import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from './app/store';
import App from './App';
const container = document.getElementById('root');
if (!container) {
    throw new Error('Root element #root not found');
}
const root = createRoot(container);
root.render(_jsx(React.StrictMode, { children: _jsx(Provider, { store: store, children: _jsx(App, {}) }) }));
