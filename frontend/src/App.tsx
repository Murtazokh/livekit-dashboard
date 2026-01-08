import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import { Settings } from './presentation/pages/Settings';
import { Dashboard } from './presentation/pages/Dashboard';

/**
 * Main application component with routing
 */
const App: React.FC = () => {
  return (
    <Router>
      <div className="min-h-screen bg-background">
        {/* Navigation Header */}
        <header className="border-b bg-card">
          <div className="container mx-auto px-4">
            <div className="flex h-16 items-center justify-between">
              <div className="flex items-center space-x-4">
                <Link to="/" className="flex items-center space-x-2">
                  <svg className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                  <span className="text-xl font-bold">LiveKit Dashboard</span>
                </Link>
              </div>

              <nav className="flex items-center space-x-6">
                <Link
                  to="/"
                  className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  Dashboard
                </Link>
                <Link
                  to="/settings"
                  className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  Settings
                </Link>
              </nav>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main>
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};



export default App;