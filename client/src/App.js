import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css';

import HomePage from './components/HomePage';
import AuthorDashboard from './components/AuthorDashboard';
import ReaderDashboard from './components/ReaderDashboard';
import MarketplacePage from './components/MarketplacePage';

/**
 * Main application component handling routing.
 * Defines all top-level pages and their routes.
 *
 * @returns {JSX.Element} The App component.
 */
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/author" element={<AuthorDashboard />} />
        <Route path="/marketplace" element={<MarketplacePage />} />
        <Route path="/reader" element={<ReaderDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;


