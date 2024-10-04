import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import JobBoard from './components/JobBoard';
import AllJobsPage from './components/AllJobsPage.js';
import AllJobsFromCategoryPage from './components/AllJobsFromCategoryPage.js';

const App = () => {
  return (
    <Router>
      <div>
        <Routes>
          {/* Default Route */}
          <Route path="/" element={<JobBoard />} />
          <Route path="/category/:category" element={<AllJobsFromCategoryPage />} />
          <Route path="/jobs/:keyword" element={<AllJobsPage />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;