import React, { useState } from 'react'
import axios from 'axios'
const SignUp = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
      e.preventDefault();
      try {
          const response = await axios.post('http://127.0.0.1:8000/api/signup/', {
              username,
              password,
              confirmPassword,
              email,
          });
          setMessage('User registered successfully!');
      } catch (error) {
          setMessage('Error registering user: ' + error.response.data.error);
      }
  };

  return (
      <div>
          <h2>Sign Up</h2>
          <form onSubmit={handleSubmit}>
              <label>
                  Username:
                  <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
              </label>
              <br />
              <label>
                  Email:
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </label>
              <br />
              <label>
                  Password:
                  <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
              </label>
              <br />
              <label>
                  Confirm Password:
                  <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
              </label>
              <br />
              <button type="submit">Sign Up</button>
          </form>
          {message && <p>{message}</p>}
      </div>
  );
};

export default SignUp