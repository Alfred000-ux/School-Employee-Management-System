import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
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
import EmployeeService from '../services/EmployeeService';

const validationSchema = Yup.object({
  firstName: Yup.string()
    .min(2, 'First name must be at least 2 characters')
    .required('First name is required'),
  lastName: Yup.string()
    .min(2, 'Last name must be at least 2 characters')
    .required('Last name is required'),
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  phone: Yup.string()
    .matches(/^\+234\d{10}$/, 'Phone number must be in format +234XXXXXXXXXX')
    .required('Phone number is required'),
  department: Yup.string().required('Department is required'),
  position: Yup.string().required('Position is required'),
  salary: Yup.number()
    .min(0, 'Salary must be positive')
    .required('Salary is required'),
  hireDate: Yup.date().required('Hire date is required'),
  status: Yup.string().required('Status is required'),
});

const EmployeeForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const isEdit = !!id;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [initialValues, setInitialValues] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    department: '',
    position: '',
    salary: '',
    hireDate: '',
    status: 'active',
  });

  useEffect(() => {
    if (isEdit) {
      const employee = location.state?.employee;
      if (employee) {
        setInitialValues({
          firstName: employee.firstName || '',
          lastName: employee.lastName || '',
          email: employee.email || '',
          phone: employee.phone || '',
          department: employee.department || '',
          position: employee.position || '',
          salary: employee.salary || '',
          hireDate: employee.hireDate || '',
          status: employee.status || 'active',
        });
      } else {
        // Fetch employee data if not passed via state
        fetchEmployee();
      }
    }
  }, [id, isEdit, location.state]);

  const fetchEmployee = async () => {
    try {
      const employee = await EmployeeService.getEmployeeById(id);
      setInitialValues({
        firstName: employee.firstName || '',
        lastName: employee.lastName || '',
        email: employee.email || '',
        phone: employee.phone || '',
        department: employee.department || '',
        position: employee.position || '',
        salary: employee.salary || '',
        hireDate: employee.hireDate || '',
        status: employee.status || 'active',
      });
    } catch (error) {
      console.error('Error fetching employee:', error);
      setError('Failed to load employee data');
    }
  };

  const handleSubmit = async (values) => {
    setLoading(true);
    setError('');

    try {
      if (isEdit) {
        await EmployeeService.updateEmployee(id, values);
      } else {
        await EmployeeService.createEmployee(values);
      }
      navigate('/employees');
    } catch (error) {
      console.error('Error saving employee:', error);
      setError('Failed to save employee. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const departments = ['Mathematics', 'English', 'Science', 'History', 'Arts', 'Physical Education', 'Music', 'Computer Science'];
  const positions = ['Teacher', 'Principal', 'Vice Principal', 'Counselor', 'Librarian', 'Administrative Assistant', 'IT Support', 'Security Guard'];

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom align="center">
            {isEdit ? 'Edit Employee' : 'Add New Employee'}
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
            enableReinitialize
          >
            {({ errors, touched, values, handleChange, handleBlur }) => (
              <Form>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <Field
                      as={TextField}
                      fullWidth
                      id="firstName"
                      name="firstName"
                      label="First Name"
                      value={values.firstName}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.firstName && !!errors.firstName}
                      helperText={touched.firstName && errors.firstName}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Field
                      as={TextField}
                      fullWidth
                      id="lastName"
                      name="lastName"
                      label="Last Name"
                      value={values.lastName}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.lastName && !!errors.lastName}
                      helperText={touched.lastName && errors.lastName}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Field
                      as={TextField}
                      fullWidth
                      id="email"
                      name="email"
                      label="Email"
                      type="email"
                      value={values.email}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.email && !!errors.email}
                      helperText={touched.email && errors.email}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Field
                      as={TextField}
                      fullWidth
                      id="phone"
                      name="phone"
                      label="Phone Number"
                      value={values.phone}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.phone && !!errors.phone}
                      helperText={touched.phone && errors.phone}
                      placeholder="+234XXXXXXXXXX"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth error={touched.department && !!errors.department}>
                      <InputLabel id="department-label">Department</InputLabel>
                      <Field
                        as={Select}
                        labelId="department-label"
                        id="department"
                        name="department"
                        value={values.department}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        label="Department"
                      >
                        {departments.map((dept) => (
                          <MenuItem key={dept} value={dept}>
                            {dept}
                          </MenuItem>
                        ))}
                      </Field>
                      {touched.department && errors.department && (
                        <Typography variant="caption" color="error" sx={{ mt: 1, ml: 2 }}>
                          {errors.department}
                        </Typography>
                      )}
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth error={touched.position && !!errors.position}>
                      <InputLabel id="position-label">Position</InputLabel>
                      <Field
                        as={Select}
                        labelId="position-label"
                        id="position"
                        name="position"
                        value={values.position}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        label="Position"
                      >
                        {positions.map((pos) => (
                          <MenuItem key={pos} value={pos}>
                            {pos}
                          </MenuItem>
                        ))}
                      </Field>
                      {touched.position && errors.position && (
                        <Typography variant="caption" color="error" sx={{ mt: 1, ml: 2 }}>
                          {errors.position}
                        </Typography>
                      )}
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Field
                      as={TextField}
                      fullWidth
                      id="salary"
                      name="salary"
                      label="Salary (₦)"
                      type="number"
                      value={values.salary}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.salary && !!errors.salary}
                      helperText={touched.salary && errors.salary}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Field
                      as={TextField}
                      fullWidth
                      id="hireDate"
                      name="hireDate"
                      label="Hire Date"
                      type="date"
                      value={values.hireDate}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.hireDate && !!errors.hireDate}
                      helperText={touched.hireDate && errors.hireDate}
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <FormControl fullWidth error={touched.status && !!errors.status}>
                      <InputLabel id="status-label">Status</InputLabel>
                      <Field
                        as={Select}
                        labelId="status-label"
                        id="status"
                        name="status"
                        value={values.status}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        label="Status"
                      >
                        <MenuItem value="active">Active</MenuItem>
                        <MenuItem value="inactive">Inactive</MenuItem>
                      </Field>
                      {touched.status && errors.status && (
                        <Typography variant="caption" color="error" sx={{ mt: 1, ml: 2 }}>
                          {errors.status}
                        </Typography>
                      )}
                    </FormControl>
                  </Grid>
                </Grid>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
                  <Button
                    variant="outlined"
                    onClick={() => navigate('/employees')}
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
                    {loading ? (isEdit ? 'Updating...' : 'Creating...') : (isEdit ? 'Update Employee' : 'Create Employee')}
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

export default EmployeeForm;
