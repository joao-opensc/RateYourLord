import React from 'react';
import { createRoot } from 'react-dom/client';
import PropertyList from './components/PropertyList';
import 'bootstrap/dist/css/bootstrap.min.css';

// Get the root element
const rootElement = document.getElementById('root');

// Check if the element exists
if (!rootElement) {
  throw new Error('Failed to find the root element');
}

// Create root and render
const root = createRoot(rootElement);

root.render(
  <React.StrictMode>
    <PropertyList />
  </React.StrictMode>
); 