import { useState } from "react";
import { useLogin } from "./useLogin";
import CircularProgress from "@mui/material/CircularProgress";
import "./login.scss";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { mutate, isLoading, error } = useLogin();

  const errorMessage = (error: any | null) => {
    return error?.message || "An error occurred during login.";
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    mutate({ email, password });
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="logo-section">
          <img src="/hewLogo.jpeg" alt="Hew Foundation" />
          <h1>Hew Foundation</h1>
        </div>
        
        <form onSubmit={handleLogin}>
          <h2>Welcome Back</h2>
          <p className="subtitle">Please enter your details to sign in</p>
          
          <div className="input-group">
            <label>Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="input-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>

          {error && <p className="error-message">{errorMessage(error)}</p>}

          <div className="options">
            <label className="remember">
              <input type="checkbox" />
              <span>Remember me</span>
            </label>
            <a href="#" className="forgot">Forgot Password?</a>
          </div>

          <button 
            type="submit" 
            className="login-button"
            disabled={isLoading}
          >
            {isLoading ? (
              <CircularProgress size={20} style={{ color: "#fff" }} />
            ) : (
              "Sign In"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
