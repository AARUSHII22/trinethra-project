import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import Icon from '../shared/Icon';

const Login = ({ onToggle }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Login failed');
      login(data.user);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-md w-full bg-white p-10 rounded-xl shadow-2xl border border-outline-variant"
    >
      <div className="flex flex-col items-center mb-8">
        <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mb-4">
          <Icon name="lock" className="text-white text-2xl" />
        </div>
        <h2 className="font-display-lg text-3xl font-bold text-on-surface">Welcome Back</h2>
        <p className="text-on-surface-variant font-body-base">Access the Trinethra Secure Portal</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="font-label-caps text-xs text-outline mb-2 block">EMAIL ADDRESS</label>
          <input 
            type="email" 
            required 
            className="w-full bg-surface-container-low border border-outline p-4 rounded-lg focus:border-primary focus:outline-none transition-all"
            placeholder="name@organization.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <label className="font-label-caps text-xs text-outline mb-2 block">PASSWORD</label>
          <input 
            type="password" 
            required 
            className="w-full bg-surface-container-low border border-outline p-4 rounded-lg focus:border-primary focus:outline-none transition-all"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {error && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-error text-xs font-bold bg-error-container p-3 rounded flex items-center gap-2">
            <Icon name="error" className="text-sm" />
            {error}
          </motion.div>
        )}

        <motion.button 
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          className="w-full bg-primary text-on-primary py-4 rounded-lg font-bold shadow-lg hover:opacity-90 transition-all"
        >
          Authenticate Identity
        </motion.button>
      </form>

      <div className="mt-8 text-center">
        <button onClick={onToggle} className="text-primary font-label-caps text-xs hover:underline">
          Don't have an account? Request access
        </button>
      </div>
    </motion.div>
  );
};

export default Login;
