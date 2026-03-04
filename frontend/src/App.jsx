import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AnimatePresence, motion } from 'framer-motion';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import Login from './components/Auth/Login';
import StudentList from './components/StudentList';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return <Layout>{children}</Layout>;
};

const AnimatedRoutes = () => {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/login" element={<Login />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Dashboard />
              </motion.div>
            </ProtectedRoute>
          }
        />
        <Route
          path="/students"
          element={
            <ProtectedRoute>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <StudentList />
              </motion.div>
            </ProtectedRoute>
          }
        />
        <Route path="/courses" element={<ProtectedRoute><div className="p-8">Courses List Component (Developing...)</div></ProtectedRoute>} />
        <Route path="/mentorship" element={<ProtectedRoute><div className="p-8">Mentorship Tracking Component (Developing...)</div></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute><div className="p-8">Settings Component (Developing...)</div></ProtectedRoute>} />
      </Routes>
    </AnimatePresence>
  );
};

function App() {
  return (
    <Router>
      <Toaster position="top-right" reverseOrder={false} />
      <AnimatedRoutes />
    </Router>
  );
}

export default App;
