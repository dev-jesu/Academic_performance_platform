import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AnimatePresence, motion } from 'framer-motion';
import Layout from './components/Layout';
const Dashboard = lazy(() => import('./components/Dashboard'));
const Login = lazy(() => import('./components/Auth/Login'));
const StudentList = lazy(() => import('./components/StudentList'));

// Loading component
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-[60vh]">
    <div className="w-10 h-10 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin"></div>
  </div>
);
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
    <Suspense fallback={<PageLoader />}>
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
    </Suspense>
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
