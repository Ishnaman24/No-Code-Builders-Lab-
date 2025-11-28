import React from 'react';
import { MemoryRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './contexts/AppContext';
import { Layout } from './components/Layout';
import { LandingPage } from './pages/LandingPage';
import { HomePage } from './pages/HomePage';
import { RecommendationsPage } from './pages/RecommendationsPage';
import { MovieDetailPage } from './pages/MovieDetailPage';
import { WatchlistPage } from './pages/WatchlistPage';
import { PreferencesPage } from './pages/PreferencesPage';

// Protected Route Wrapper
interface ProtectedRouteProps {
  children?: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isLoggedIn } = useApp();
  
  if (!isLoggedIn) {
    return <Navigate to="/" replace />;
  }
  
  return <>{children}</>;
};

const AppContent = () => {
  const { isLoggedIn } = useApp();

  return (
    <Router>
      <Layout>
        <Routes>
          <Route 
            path="/" 
            element={isLoggedIn ? <Navigate to="/explore" replace /> : <LandingPage />} 
          />
          
          {/* Main App Pages */}
          <Route 
            path="/explore" 
            element={
              <ProtectedRoute>
                <HomePage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/watchlist" 
            element={
              <ProtectedRoute>
                <WatchlistPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/preferences" 
            element={
              <ProtectedRoute>
                <PreferencesPage />
              </ProtectedRoute>
            } 
          />
          
          {/* Sub-pages */}
          <Route 
            path="/recommendations" 
            element={
              <ProtectedRoute>
                <RecommendationsPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/movie/:id" 
            element={
              <ProtectedRoute>
                <MovieDetailPage />
              </ProtectedRoute>
            } 
          />

          {/* Fallback redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}