import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Login from './Login';
import Register from './Register';

const AuthPortal = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="min-h-screen bg-surface-container-low flex items-center justify-center p-margin relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-secondary rounded-full blur-[120px]" />
      </div>

      <AnimatePresence mode="wait">
        {isLogin ? (
          <Login key="login" onToggle={() => setIsLogin(false)} />
        ) : (
          <Register key="register" onToggle={() => setIsLogin(true)} />
        )}
      </AnimatePresence>
    </div>
  );
};

export default AuthPortal;
