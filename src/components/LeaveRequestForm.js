import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
} from '@mui/material';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import LeaveService from '../services/LeaveService';
import { useAuth } from '../contexts/AuthContext';

const validationSchema = Yup.object({
  leaveType: Yup.string().required('Leave type is required'),
  startDate: Yup.date()
    .required('Start date is required')
    .min(new Date(), 'Start date cannot be in the past'),
  endDate: Yup.date()
    .required('End date is required')
    .min(Yup.ref('startDate'), 'End date must be after start date'),
  reason: Yup.string()
    .min(10, 'Reason must be at least 10 characters')
    .required('Reason is required'),
});

const LeaveRequestForm = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const initialValues = {
    leaveType: '',
    startDate: '',
    endDate: '',
    reason: '',
  };

  const handleSubmit = async (values) => {
    setLoading(true);
    setError('');

    try {
      const leaveData = {
        ...values,
        employeeId: user.id,
        status: 'pending',
        appliedAt: new Date().toISOString(),
      };

      await LeaveService.createLeaveRequest(leaveData);
      navigate('/leave-requests');
    } catch (error) {
      console.error('Error submitting leave request:', error);
      setError('Failed to submit leave request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const leaveTypes = [
    'Annual Leave',
    'Sick Leave',
    'Maternity Leave',
    'Paternity Leave',
    'Emergency Leave',
    'Study Leave',
    'Compassionate Leave',
  ];

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom align="center">
            Submit Leave Request
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ errors, touched, values, handleChange, handleBlur }) => (
              <Form>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <FormControl fullWidth error={touched.leaveType && !!errors.leaveType}>
                      <InputLabel id="leave-type-label">Leave Type</InputLabel>
                      <Field
                        as={Select}
                        labelId="leave-type-label"
                        id="leaveType"
                        name="leaveType"
                        value={values.leaveType}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        label="Leave Type"
                      >
                        {leaveTypes.map((type) => (
                          <MenuItem key={type} value={type}>
                            {type}
                          </MenuItem>
                        ))}
                      </Field>
                      {touched.leaveType && errors.leaveType && (
                        <Typography variant="caption" color="error" sx={{ mt: 1, ml: 2 }}>
                          {errors.leaveType}
                        </Typography>
                      )}
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Field
                      as={TextField}
                      fullWidth
                      id="startDate"
                      name="startDate"
                      label="Start Date"
                      type="date"
                      value={values.startDate}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.startDate && !!errors.startDate}
                      helperText={touched.startDate && errors.startDate}
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Field
                      as={TextField}
                      fullWidth
                      id="endDate"
                      name="endDate"
                      label="End Date"
                      type="date"
                      value={values.endDate}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.endDate && !!errors.endDate}
                      helperText={touched.endDate && errors.endDate}
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Field
                      as={TextField}
                      fullWidth
                      id="reason"
                      name="reason"
                      label="Reason for Leave"
                      multiline
                      rows={4}
                      value={values.reason}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.reason && !!errors.reason}
                      helperText={touched.reason && errors.reason}
                      placeholder="Please provide a detailed reason for your leave request..."
                    />
                  </Grid>
                </Grid>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
                  <Button
                    variant="outlined"
                    onClick={() => navigate('/leave-requests')}
                    disabled={loading}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={loading}
                    sx={{ backgroundColor: '#1976d2' }}
                  >
                    {loading ? 'Submitting...' : 'Submit Leave Request'}
                  </Button>
                </Box>
              </Form>
            )}
          </Formik>
        </Paper>
      </Box>
    </Container>
  );
};

export default LeaveRequestForm;
