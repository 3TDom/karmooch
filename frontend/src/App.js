import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Box, CircularProgress } from '@mui/material';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Dashboard from './components/dashboard/Dashboard';
import EnhancedDashboard from './components/dashboard/EnhancedDashboard';
import PortfolioList from './components/portfolio/PortfolioList';
import PortfolioDetail from './components/portfolio/PortfolioDetail';
import PortfolioManagement from './components/portfolio/PortfolioManagement';
import InvestmentManagement from './components/investment/InvestmentManagement';
import UserProfile from './components/profile/UserProfile';
import Layout from './components/layout/Layout';

function AppRoutes() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!isAuthenticated) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<EnhancedDashboard />} />
        <Route path="/portfolios" element={<PortfolioManagement />} />
        <Route path="/portfolios/:id" element={<PortfolioDetail />} />
        <Route path="/portfolios/:portfolioId/investments" element={<InvestmentManagement />} />
        <Route path="/profile" element={<UserProfile />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}

export default App;
