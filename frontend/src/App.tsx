import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import { Settings } from './presentation/pages/Settings';

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
            <Route path="/dashboard" element={<DashboardPlaceholder />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

/**
 * Placeholder component for the dashboard
 * TODO: Replace with actual dashboard implementation
 */
const DashboardPlaceholder: React.FC = () => {
  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight mb-4">Dashboard</h1>
          <p className="text-xl text-muted-foreground mb-8">
            Welcome to your LiveKit Dashboard
          </p>
          <div className="bg-card rounded-lg border shadow-sm p-8 max-w-2xl mx-auto">
            <div className="text-center">
              <svg className="h-16 w-16 mx-auto text-muted-foreground mb-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="9" y1="9" x2="15" y2="15"></line>
                <line x1="15" y1="9" x2="9" y2="15"></line>
              </svg>
              <h2 className="text-2xl font-semibold mb-2">Dashboard Coming Soon</h2>
              <p className="text-muted-foreground mb-6">
                Configure your LiveKit server settings first, then you'll be able to monitor your rooms and participants in real-time.
              </p>
              <Link
                to="/settings"
                className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                Go to Settings
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;