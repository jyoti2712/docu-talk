import React, { useState } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_BASE_URL;

function Auth({ setToken }) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const url = isLogin ? `${API_URL}/auth/login` : `${API_URL}/auth/register`;
    try {
      const res = await axios.post(url, { email, password });
      if (isLogin) {
        localStorage.setItem('token', res.data.token);
        setToken(res.data.token);
      } else {
        alert('Registration successful! Please log in.');
        setIsLogin(true);
      }
    } catch (err) {
      setError(err.response?.data?.error || 'An error occurred.');
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.formContainer}>
        <h2>{isLogin ? 'Login' : 'Register'}</h2>
        <form onSubmit={handleSubmit}>
          <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required style={styles.input} />
          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required style={styles.input} />
          <button type="submit" style={styles.button}>{isLogin ? 'Login' : 'Register'}</button>
        </form>
        {error && <p style={styles.error}>{error}</p>}
        <button onClick={() => setIsLogin(!isLogin)} style={styles.toggleButton}>
          {isLogin ? 'Need an account? Register' : 'Have an account? Login'}
        </button>
      </div>
    </div>
  );
}

// Basic inline styles for simplicity
const styles = {
    container: { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#f0f2f5' },
    formContainer: { padding: '2rem', background: 'white', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', width: '300px' },
    input: { width: '100%', padding: '0.5rem', marginBottom: '1rem', border: '1px solid #ccc', borderRadius: '4px' },
    button: { width: '100%', padding: '0.75rem', border: 'none', background: '#007bff', color: 'white', borderRadius: '4px', cursor: 'pointer' },
    error: { color: 'red', textAlign: 'center' },
    toggleButton: { background: 'none', border: 'none', color: '#007bff', cursor: 'pointer', marginTop: '1rem', width: '100%' }
};

export default Auth;