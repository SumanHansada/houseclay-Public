import { ThemeProvider } from "@emotion/react";
import {
  Container,
  CssBaseline,
  Box,
  Typography,
  TextField,
  FormControlLabel,
  Checkbox,
  Button,
  Stack,
  createTheme,
  Alert,
} from "@mui/material";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import assets from "../../assets/assets";
import { login } from "../../redux/features/authSlice";
import { useAppDispatch, useAppSelector } from "../../redux/store";

const defaultTheme = createTheme();

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector((state) => state.auth);

  const handleLogin = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    const result = await dispatch(login({ username: email, password }));
    if (login.fulfilled.match(result)) {
      navigate("/");
    }
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Typography
            variant="h6"
            sx={{
              mr: 2,
              display: { xs: "none", md: "flex" },
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".3rem",
              color: "inherit",
              textDecoration: "none",
            }}
          >
            ZEBRA
          </Typography>
          <Box
            component="img"
            sx={{
              height: 50,
            }}
            alt="HouseClay-Zebra"
            src={assets.images.sign_in}
          />
          <Box component="form" onSubmit={handleLogin} noValidate sx={{ mt: 1 }}>
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
            />
            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
              sx={{
                display: "flex",
                justifyContent: "flex-start",
                alignItems: "center",
              }}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={loading}
            >
              {loading ? "Signing in..." : "Sign In"}
            </Button>
            <Stack direction="row" spacing={2} justifyContent="space-between" sx={{ mt: 2 }}>
              <Link to="/forgot-password">Forgot password?</Link>
              <Link to="/signup">{"Don't have an account? Sign Up"}</Link>
            </Stack>
          </Box>
        </Box>
        <Box sx={{ mt: 8, mb: 4, textAlign: "center" }}>
          © {new Date().getFullYear()} Zebra. All rights reserved.
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default Login;
