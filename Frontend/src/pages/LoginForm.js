import React, { useState } from 'react';
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

function LoginForm() {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post(
        process.env.REACT_APP_BACKEND_URL + "/login",
        { email, password }
      );
      localStorage.setItem("token", response["data"]["data"]["token"])
      localStorage.setItem("user_id", response["data"]["data"]["user_id"])
      navigate("/");
    } catch (error) {
      alert(error.message)
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="text"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Log In</button>
      </form>
      <a href='/register'>Register</a>
    </div>
  );
}

export default LoginForm;