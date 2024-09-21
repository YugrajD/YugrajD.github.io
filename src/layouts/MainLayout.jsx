import React, { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import axios from 'axios';

const MainLayout = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
        axios.get('http://127.0.0.1:8000/api/auth/user/', {
            headers: {
                Authorization: `Token ${token}`
            }
        })
        .then(response => {
            setUser(response.data);
            setLoading(false);
        })
        .catch(error => {
            console.error('Error fetching user data:', error);
            localStorage.removeItem('authToken'); // Remove invalid token
            setLoading(false);
        });
    } else {
        setLoading(false);
    }
}, []);

if (loading) {
    return <div>Loading...</div>;
}


  return (
    <>
    <div>
            {user ? (
                <div>
                    <p>Welcome, {user.username}!</p>
                    <button onClick={() => {
                        localStorage.removeItem('authToken');
                        setUser(null);
                    }}>Logout</button>
                </div>
            ) : (
                <div>
                    <p>Please log in.</p>
                </div>
            )}
      </div>
      <Navbar />
      <Outlet />
    </>
  );
};

export default MainLayout;
