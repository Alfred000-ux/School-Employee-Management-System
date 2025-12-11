import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  Divider,
  Chip,
} from '@mui/material';
import {
  People as PeopleIcon,
  EventNote as EventNoteIcon,
  CheckCircle as CheckCircleIcon,
  Pending as PendingIcon,
  TrendingUp as TrendingUpIcon,
} from '@mui/icons-material';
import EmployeeService from '../services/EmployeeService';
import LeaveService from '../services/LeaveService';
import { useAuth } from '../contexts/AuthContext';

const Dashboard = () => {
  const { user, isAdmin } = useAuth();
  const [stats, setStats] = useState({
    totalEmployees: 0,
    activeEmployees: 0,
    totalLeaveRequests: 0,
    pendingLeaveRequests: 0,
    approvedLeaveRequests: 0,
  });
  const [recentLeaveRequests, setRecentLeaveRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [employees, leaveRequests] = await Promise.all([
        EmployeeService.getAllEmployees(),
        LeaveService.getAllLeaveRequests(),
      ]);

      const totalEmployees = employees.length;
      const activeEmployees = employees.filter(emp => emp.status === 'active').length;
      const totalLeaveRequests = leaveRequests.length;
      const pendingLeaveRequests = leaveRequests.filter(req => req.status === 'pending').length;
      const approvedLeaveRequests = leaveRequests.filter(req => req.status === 'approved').length;

      setStats({
        totalEmployees,
        activeEmployees,
        totalLeaveRequests,
        pendingLeaveRequests,
        approvedLeaveRequests,
      });

      // Get recent leave requests (last 5)
      const recentRequests = leaveRequests
        .sort((a, b) => new Date(b.appliedAt) - new Date(a.appliedAt))
        .slice(0, 5);
      setRecentLeaveRequests(recentRequests);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      // Use sample data if API fails
      setStats({
        totalEmployees: 20,
        activeEmployees: 18,
        totalLeaveRequests: 15,
        pendingLeaveRequests: 5,
        approvedLeaveRequests: 8,
      });
      setRecentLeaveRequests([
        {
          id: 1,
          employeeName: 'Adebayo Johnson',
          leaveType: 'Annual Leave',
          status: 'pending',
          appliedAt: '2024-01-15',
        },
        {
          id: 2,
          employeeName: 'Chinwe Okoro',
          leaveType: 'Sick Leave',
          status: 'approved',
          appliedAt: '2024-01-14',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, icon, color }) => (
    <Card sx={{ height: '100%', backgroundColor: color }}>
      <CardContent>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box>
            <Typography color="textSecondary" gutterBottom>
              {title}
            </Typography>
            <Typography variant="h4" component="div">
              {value}
            </Typography>
          </Box>
          <Box sx={{ color: 'white', fontSize: 48 }}>
            {icon}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ mt: 4, mb: 4 }}>
          <Typography variant="h4" align="center">
            Loading Dashboard...
          </Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Welcome to School Employee Management System
        </Typography>
        <Typography variant="h6" color="textSecondary" gutterBottom>
          Hello, {user?.name || 'User'}! Here's an overview of your system.
        </Typography>

        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Total Employees"
              value={stats.totalEmployees}
              icon={<PeopleIcon />}
              color="#1976d2"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Active Employees"
              value={stats.activeEmployees}
              icon={<CheckCircleIcon />}
              color="#388e3c"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Total Leave Requests"
              value={stats.totalLeaveRequests}
              icon={<EventNoteIcon />}
              color="#f57c00"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Pending Approvals"
              value={stats.pendingLeaveRequests}
              icon={<PendingIcon />}
              color="#d32f2f"
            />
          </Grid>
        </Grid>

        {isAdmin() && (
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Paper elevation={3} sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Recent Leave Requests
                </Typography>
                <List>
                  {recentLeaveRequests.map((request, index) => (
                    <React.Fragment key={request.id}>
                      <ListItem>
                        <ListItemText
                          primary={`${request.employeeName} - ${request.leaveType}`}
                          secondary={`Applied on ${new Date(request.appliedAt).toLocaleDateString()}`}
                        />
                        <Chip
                          label={request.status}
                          color={
                            request.status === 'approved'
                              ? 'success'
                              : request.status === 'rejected'
                              ? 'error'
                              : 'warning'
                          }
                          size="small"
                        />
                      </ListItem>
                      {index < recentLeaveRequests.length - 1 && <Divider />}
                    </React.Fragment>
                  ))}
                </List>
                {recentLeaveRequests.length === 0 && (
                  <Typography color="textSecondary" align="center">
                    No leave requests found
                  </Typography>
                )}
              </Paper>
            </Grid>
            <Grid item xs={12} md={6}>
              <Paper elevation={3} sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Quick Actions
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Typography variant="body2" color="textSecondary">
                    • Manage employee records
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    • Review leave requests
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    • Generate reports
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    • Update system settings
                  </Typography>
                </Box>
              </Paper>
            </Grid>
          </Grid>
        )}

        {!isAdmin() && (
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Employee Quick Actions
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Typography variant="body2" color="textSecondary">
                • View your profile information
              </Typography>
              <Typography variant="body2" color="textSecondary">
                • Submit leave requests
              </Typography>
              <Typography variant="body2" color="textSecondary">
                • Check leave request status
              </Typography>
              <Typography variant="body2" color="textSecondary">
                • Update personal details
              </Typography>
            </Box>
          </Paper>
        )}
      </Box>
    </Container>
  );
};

export default Dashboard;
