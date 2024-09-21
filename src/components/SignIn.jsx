import React, { useState } from 'react'
import axios from 'axios';


const SignIn = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        const response = await axios.post('http://127.0.0.1:8000/api/auth/login/', {
            username,
            password,
        });
        localStorage.setItem('authToken', response.data.key); // Store the token
        setMessage('Logged in successfully!');
    } catch (error) {
        setMessage('Login failed. Please try again.');
    }
};

return (
    <div>
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
            <label>
                Username:
                <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
            </label>
            <br />
            <label>
                Password:
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </label>
            <br />
            <button type="submit">Login</button>
        </form>
        {message && <p>{message}</p>}
    </div>
);
};

export default SignIn