import React, { useState } from "react";
import { useLogin } from "./useLogin";
import CircularProgress from "@mui/material/CircularProgress";
import "./Login.scss";

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
        <h2>Login</h2>
        
        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {error && <p className="error-message">{errorMessage(error)}</p>}
          <button type="submit" disabled={isLoading}>
            {isLoading ? (
              <CircularProgress size={20} style={{ color: "#fff" }} />
            ) : (
              "Log In"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
