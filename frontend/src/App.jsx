import React from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Layout from './components/Layout';
import PageTransition from './components/PageTransition';
import GlowBorder from './components/GlowBorder';
import ProtectedRoute from './components/ProtectedRoute';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Home from './pages/Home';
import Transfer from './pages/Transfer';
import Deposits from './pages/Deposits';
import ServiceRequests from './pages/ServiceRequests';
import Beneficiaries from './pages/Beneficiaries';
import BillPayments from './pages/BillPayments';
import Loans from './pages/Loans';
import Cards from './pages/Cards';
import AdminDashboard from './pages/AdminDashboard';
import Investments from './pages/Investments';
import Analytics from './pages/Analytics';
import Settings from './pages/Settings';

// Placeholder for other pages
const Placeholder = ({ title }) => (
  <div className="flex items-center justify-center h-full text-white text-2xl font-bold opacity-50">
    {title} Page Coming Soon
  </div>
);

// Component to handle animations for protected routes
const AnimatedProtectedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/dashboard" element={<PageTransition><Dashboard /></PageTransition>} />
        <Route path="/transfer" element={<PageTransition><Transfer /></PageTransition>} />
        <Route path="/deposits" element={<PageTransition><Deposits /></PageTransition>} />
        <Route path="/services" element={<PageTransition><ServiceRequests /></PageTransition>} />
        <Route path="/beneficiaries" element={<PageTransition><Beneficiaries /></PageTransition>} />
        <Route path="/bills" element={<PageTransition><BillPayments /></PageTransition>} />
        <Route path="/loans" element={<PageTransition><Loans /></PageTransition>} />
        <Route path="/cards" element={<PageTransition><Cards /></PageTransition>} />
        <Route path="/investments" element={<PageTransition><Investments /></PageTransition>} />
        <Route path="/analytics" element={<PageTransition><Analytics /></PageTransition>} />
        <Route path="/admin" element={<PageTransition><AdminDashboard /></PageTransition>} />
        <Route path="/profile" element={<PageTransition><Placeholder title="Profile" /></PageTransition>} />
        <Route path="/settings" element={<PageTransition><Settings /></PageTransition>} />
        {/* Catch all for protected routes to redirect to dashboard */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </AnimatePresence>
  );
};

// Component to handle animations for public routes
const AnimatedPublicRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<PageTransition><Login /></PageTransition>} />
        <Route path="/signup" element={<PageTransition><Signup /></PageTransition>} />
      </Routes>
    </AnimatePresence>
  );
};

function App() {
  return (
    <ThemeProvider>
      <Router>
        <GlowBorder />
        <Routes>
          {/* Public Routes - Rendered directly to avoid layout */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<PageTransition><Login /></PageTransition>} />
          <Route path="/signup" element={<PageTransition><Signup /></PageTransition>} />

          {/* Protected Routes - Wrapped in Layout, then AnimatePresence inside */}
          <Route path="/*" element={
            <ProtectedRoute>
              <Layout>
                <AnimatedProtectedRoutes />
              </Layout>
            </ProtectedRoute>
          } />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
