import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Login from './components/Login';
import Register from './components/Register';
import ProtectedRoute from './components/ProtectedRoute';
import Profile from './components/Profile';
import Dashboard from './components/Dashboard';
import Home from './components/Home';

// Navigation component that only shows when not on home page
const Navigation = () => {
  const location = useLocation();
  const { user } = useAuth();

  // Don't show navigation on home page
  if (location.pathname === '/') {
    return null;
  }

  return (
    <nav className="bg-gray-800 p-4 text-white flex gap-4">
      <Link to="/dashboard" className="hover:underline">Dashboard</Link>
      <Link to="/profile" className="hover:underline">Profile</Link>
      {!user && (
        <>
          <Link to="/login" className="hover:underline">Login</Link>
          <Link to="/register" className="hover:underline">Register</Link>
        </>
      )}
    </nav>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <Navigation />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
