import React from 'react';
import ReactDOM from 'react-dom';
import PropertyList from './components/PropertyList';
import 'bootstrap/dist/css/bootstrap.min.css';

ReactDOM.render(
  <React.StrictMode>
    <PropertyList />
  </React.StrictMode>,
  document.getElementById('root') as HTMLElement // Type assertion for TypeScript
); 