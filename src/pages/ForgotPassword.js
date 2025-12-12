import React, { useState } from "react";
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
} from "@mui/material";
import { Link } from "react-router-dom";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!email) {
      setError("Please enter your email address");
      return;
    }

    setLoading(true);

    // Fake API simulation — he will replace with real API
    setTimeout(() => {
      setMessage("A password reset link has been sent to your email.");
      setLoading(false);
    }, 1200);
  };

  return (
    <Container component="main" maxWidth="sm">
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Paper elevation={4} sx={{ p: 5, width: "100%", borderRadius: 3 }}>
          <Typography variant="h4" align="center" gutterBottom>
            Forgot Password
          </Typography>

          <Typography variant="subtitle1" align="center" sx={{ mb: 3 }}>
            Enter your email to receive a reset link
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          {message && (
            <Alert severity="success" sx={{ mb: 2 }}>
              {message}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              fullWidth
              margin="normal"
              label="Email Address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <Button
              fullWidth
              variant="contained"
              type="submit"
              disabled={loading}
              sx={{ mt: 3, py: 1.2 }}
            >
              {loading ? "Sending..." : "Send Reset Link"}
            </Button>

            <Typography align="center" sx={{ mt: 2 }}>
              Remember your password?{" "}
              <Link to="/login" style={{ textDecoration: "none" }}>
                Sign In
              </Link>
            </Typography>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default ForgotPassword;