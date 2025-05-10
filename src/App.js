import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Cookies from 'js-cookie';

// Import components
import NavBar from './components/NavBar';

// Import pages
import Home from './components/pages/Home';
import Login from './components/pages/Login';
import Signup from './components/pages/Signup';
import UserProfile from './components/pages/UserProfile';
import MenuItem from './components/pages/MenuItem';
import Search from './components/pages/Search';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = Cookies.get('loggedIn') === 'true';
  const location = useLocation();
  
  // If not authenticated, redirect to login with the attempted location stored
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  return children;
};

// Public Routes - these routes are accessible without authentication
const publicRoutes = ['/', '/login', '/signup'];

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

// Separate component for the app content to use useLocation inside Router
function AppContent() {
  const location = useLocation();
  const isAuthenticated = Cookies.get('loggedIn') === 'true';
  const currentPath = location.pathname;
  
  // Check if current path is public or not
  const isPublicRoute = publicRoutes.includes(currentPath) || 
                        currentPath === '/' || 
                        currentPath.startsWith('/login') || 
                        currentPath.startsWith('/signup');
  
  // For non-public routes, if user is not authenticated, render NavBar only for public routes
  const showNavBar = isAuthenticated || isPublicRoute;
  
  return (
    <div className="flex flex-col min-h-screen">
      {showNavBar && <NavBar />}
      <main className="flex-grow">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          
          {/* Protected Routes */}
          <Route 
            path="/profile" 
            element={
              <ProtectedRoute>
                <UserProfile />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/search" 
            element={
              <ProtectedRoute>
                <Search />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/menu-item/:id" 
            element={
              <ProtectedRoute>
                <MenuItem />
              </ProtectedRoute>
            } 
          />
          
          {/* Catch all - redirect to home if logged in, login if not authenticated */}
          <Route 
            path="*" 
            element={
              isAuthenticated 
                ? <Navigate to="/" replace /> 
                : <Navigate to="/login" replace />
            } 
          />
        </Routes>
      </main>
    </div>
  );
}

export default App;