import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import Login from './components/Auth/Login';
import StudentList from './components/StudentList';
import useStore from './store/useStore';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return <Layout>{children}</Layout>;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/students"
          element={
            <ProtectedRoute>
              <StudentList />
            </ProtectedRoute>
          }
        />
        <Route path="/courses" element={<ProtectedRoute><div className="p-8">Courses List Component (Developing...)</div></ProtectedRoute>} />
        <Route path="/mentorship" element={<ProtectedRoute><div className="p-8">Mentorship Tracking Component (Developing...)</div></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute><div className="p-8">Settings Component (Developing...)</div></ProtectedRoute>} />
      </Routes>
    </Router>
  );
}

export default App;
