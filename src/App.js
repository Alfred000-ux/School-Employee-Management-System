import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import { AuthProvider, useAuth } from "./contexts/AuthContext";

import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import EmployeeList from "./components/EmployeeList";
import EmployeeForm from "./components/EmployeeForm";
import LeaveRequestList from "./components/LeaveRequestList";
import LeaveRequestForm from "./components/LeaveRequestForm";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import Layout from "./components/Layout";

import "./App.css";

// Protected Route
const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { isAuthenticated, isAdmin } = useAuth();

  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && !isAdmin()) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

// App Router Component
const AppRouter = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route
          path="/register"
          element={isAuthenticated() ? <Navigate to="/dashboard" replace /> : <Register />}
        />

        {/* Protected routes with Layout */}
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route
            path="dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          {/* Admin routes */}
          <Route
            path="employees"
            element={
              <ProtectedRoute adminOnly>
                <EmployeeList />
              </ProtectedRoute>
            }
          />

          <Route
            path="employees/new"
            element={
              <ProtectedRoute adminOnly>
                <EmployeeForm />
              </ProtectedRoute>
            }
          />

          <Route
            path="employees/:id/edit"
            element={
              <ProtectedRoute adminOnly>
                <EmployeeForm />
              </ProtectedRoute>
            }
          />

          {/* Leave Request routes */}
          <Route
            path="leave-requests"
            element={
              <ProtectedRoute>
                <LeaveRequestList />
              </ProtectedRoute>
            }
          />

          <Route
            path="leave-requests/new"
            element={
              <ProtectedRoute>
                <LeaveRequestForm />
              </ProtectedRoute>
            }
          />
        </Route>
      </Routes>
    </Router>
  );
};

// FINAL APP WRAPPER
export default function App() {
  return (
    <AuthProvider>
      <AppRouter />
    </AuthProvider>
  );
}
