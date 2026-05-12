import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Icon from '../shared/Icon';

const Register = ({ onToggle }) => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [status, setStatus] = useState({ type: '', msg: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ type: '', msg: '' });
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Registration failed');
      setStatus({ type: 'success', msg: 'Registration successful! Please login.' });
      setTimeout(onToggle, 2000);
    } catch (err) {
      setStatus({ type: 'error', msg: err.message });
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-md w-full bg-white p-10 rounded-xl shadow-2xl border border-outline-variant"
    >
      <div className="flex flex-col items-center mb-8">
        <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mb-4">
          <Icon name="person_add" className="text-white text-2xl" />
        </div>
        <h2 className="font-display-lg text-3xl font-bold text-on-surface">Create Account</h2>
        <p className="text-on-surface-variant font-body-base">Join the Trinethra Intelligence Network</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="font-label-caps text-xs text-outline mb-1 block">FULL NAME</label>
          <input 
            type="text" 
            required 
            className="w-full bg-surface-container-low border border-outline p-3 rounded-lg focus:border-secondary focus:outline-none transition-all"
            placeholder="John Doe"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
          />
        </div>
        <div>
          <label className="font-label-caps text-xs text-outline mb-1 block">EMAIL ADDRESS</label>
          <input 
            type="email" 
            required 
            className="w-full bg-surface-container-low border border-outline p-3 rounded-lg focus:border-secondary focus:outline-none transition-all"
            placeholder="name@organization.com"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
          />
        </div>
        <div>
          <label className="font-label-caps text-xs text-outline mb-1 block">SECURE PASSWORD</label>
          <input 
            type="password" 
            required 
            className="w-full bg-surface-container-low border border-outline p-3 rounded-lg focus:border-secondary focus:outline-none transition-all"
            placeholder="Min 8 characters"
            value={formData.password}
            onChange={(e) => setFormData({...formData, password: e.target.value})}
          />
        </div>

        {status.msg && (
          <div className={`text-xs font-bold p-3 rounded flex items-center gap-2 ${status.type === 'success' ? 'bg-tertiary-container text-tertiary' : 'bg-error-container text-error'}`}>
            <Icon name={status.type === 'success' ? 'check_circle' : 'error'} className="text-sm" />
            {status.msg}
          </div>
        )}

        <motion.button 
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          className="w-full bg-secondary text-on-secondary py-4 rounded-lg font-bold shadow-lg hover:opacity-90 transition-all"
        >
          Initialize Account
        </motion.button>
      </form>

      <div className="mt-8 text-center">
        <button onClick={onToggle} className="text-secondary font-label-caps text-xs hover:underline">
          Already have an account? Sign in
        </button>
      </div>
    </motion.div>
  );
};

export default Register;
