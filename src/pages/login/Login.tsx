import React, { useState } from "react";
import { useNavigate } from "react-router-dom";  // Import useNavigate
import "./Login.scss";

const Login = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const navigate = useNavigate();  // Initialize useNavigate

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    // Add your login logic here (e.g., authenticate the user)
    console.log("Logged in with:", email, password);

    // If login is successful, navigate to the home page
    navigate("/");  // Navigate to the home page after login
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
          <button type="submit">Log In</button>
        </form>

      </div>
    </div>
  );
};

export default Login;
