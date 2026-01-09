import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppLayout } from './presentation/components/layout/AppLayout';
import { Settings } from './presentation/pages/Settings';
import { Dashboard } from './presentation/pages/Dashboard';
import { Sessions } from './presentation/pages/Sessions';

/**
 * Main application component with routing and AppLayout
 */
const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AppLayout><Dashboard /></AppLayout>} />
        <Route path="/sessions" element={<AppLayout><Sessions /></AppLayout>} />
        <Route path="/settings" element={<AppLayout><Settings /></AppLayout>} />
      </Routes>
    </Router>
  );
};

export default App;