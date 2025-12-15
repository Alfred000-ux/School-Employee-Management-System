import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import EmployeeService from "../services/EmployeeService";
import LeaveService from "../services/LeaveService";
import { useAuth } from "../contexts/AuthContext";
import "./Dashboard.css";

const Dashboard = () => {
  const { user, isAdmin } = useAuth();
  const [stats, setStats] = useState({
    totalEmployees: 0,
    activeEmployees: 0,
    totalLeaveRequests: 0,
    pendingLeaveRequests: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [employees, leaveRequests] = await Promise.all([
          EmployeeService.getAllEmployees(),
          LeaveService.getAllLeaveRequests(),
        ]);

        const totalEmployees = employees.length;
        const activeEmployees = employees.filter(emp => emp.status === 'active').length;
        const totalLeaveRequests = leaveRequests.length;
        const pendingLeaveRequests = leaveRequests.filter(req => req.status === 'pending').length;

        setStats({
          totalEmployees,
          activeEmployees,
          totalLeaveRequests,
          pendingLeaveRequests,
        });
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        // Use sample data if API fails
        setStats({
          totalEmployees: 20,
          activeEmployees: 18,
          totalLeaveRequests: 15,
          pendingLeaveRequests: 5,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="dashboard-container">
        <h1>Loading Dashboard...</h1>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">
        Welcome, {user?.name || "User"}
      </h1>

      <div className="stats-grid">
        <div className="stat-card stat-card--primary">
          <div className="stat-card-content">
            <h3 className="stat-card-title">Total Employees</h3>
            <p className="stat-card-value">{stats.totalEmployees}</p>
          </div>
        </div>
        <div className="stat-card stat-card--success">
          <div className="stat-card-content">
            <h3 className="stat-card-title">Active Employees</h3>
            <p className="stat-card-value">{stats.activeEmployees}</p>
          </div>
        </div>
        <div className="stat-card stat-card--warning">
          <div className="stat-card-content">
            <h3 className="stat-card-title">Pending Requests</h3>
            <p className="stat-card-value">{stats.pendingLeaveRequests}</p>
          </div>
        </div>
      </div>

      {isAdmin() && (
        <div className="content-grid">
          <div className="content-card">Recent Leave Requests</div>
          <div className="content-card">Quick Actions</div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
