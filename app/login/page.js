'use client';

import { useState } from 'react';

export default function LoginPage() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error || 'Incorrect password');
        setLoading(false);
        return;
      }
      const params = new URLSearchParams(window.location.search);
      window.location.href = params.get('next') || '/';
    } catch (err) {
      setError('Something went wrong. Try again.');
      setLoading(false);
    }
  }

  return (
    <div style={styles.page}>
      <form onSubmit={handleSubmit} style={styles.card}>
        <h1 style={styles.title}>Game Plan</h1>
        <p style={styles.subtitle}>Enter the password to continue.</p>
        <input
          type="password"
          autoFocus
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          style={styles.input}
        />
        {error && <div style={styles.error}>{error}</div>}
        <button type="submit" disabled={loading} style={styles.button}>
          {loading ? 'Checking…' : 'Enter'}
        </button>
      </form>
    </div>
  );
}

const styles = {
  page: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#000000',
    fontFamily: 'Helvetica Neue, Arial, sans-serif',
  },
  card: {
    width: 320,
    background: '#F3F3F3',
    borderRadius: 12,
    padding: 32,
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
  },
  title: { margin: 0, fontSize: 24, fontWeight: 700, color: '#000000' },
  subtitle: { margin: 0, fontSize: 14, color: '#27294C' },
  input: {
    padding: '10px 12px',
    fontSize: 15,
    borderRadius: 8,
    border: '1px solid #8086F2',
    outline: 'none',
  },
  error: { color: '#FF1400', fontSize: 13 },
  button: {
    padding: '10px 12px',
    fontSize: 15,
    fontWeight: 600,
    borderRadius: 8,
    border: 'none',
    background: '#3540F2',
    color: '#fff',
    cursor: 'pointer',
  },
};
