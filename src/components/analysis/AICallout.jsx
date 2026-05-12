import React from 'react';
import { motion } from 'framer-motion';
import Icon from '../shared/Icon';

const AICallout = () => {
  return (
    <div className="space-y-6">
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="bg-primary-fixed text-on-primary-fixed-variant p-6 rounded-lg border border-primary-container flex gap-4 shadow-sm relative overflow-hidden group"
      >
        {/* Subtle background pulse */}
        <motion.div 
          animate={{ opacity: [0.05, 0.1, 0.05] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-0 bg-white pointer-events-none"
        />
        
        <Icon 
          name="auto_awesome" 
          className="text-primary relative z-10" 
          style={{ fontVariationSettings: "'FILL' 1" }} 
        />
        <div className="space-y-2 relative z-10">
          <p className="font-bold text-xs font-label-caps tracking-wider text-primary">AI SUGGESTIONS</p>
          <p className="text-sm opacity-90 leading-relaxed font-body-base">
            Our neural models are optimized for detecting subtle power dynamics. Ensure the transcript preserves verbatim pauses and interruptions for the most accurate analysis.
          </p>
        </div>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="w-full aspect-video rounded overflow-hidden relative border border-outline-variant group cursor-crosshair shadow-sm"
      >
        <img 
          className="w-full h-full object-cover grayscale opacity-40 group-hover:opacity-60 transition-opacity duration-1000" 
          alt="Institutional Archive"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuDE2Z3jN_515LFpLKa3_NDaaEO87kEwq4zK61ACSr9o942duqK5jY79adxjJOkkOGNrai_vFRHWQwz61HYvBMQK_zb_fvlxRNYNnT4zR5HLNVYR2tksOaFVcSbhZoXAisbLN5lIaL2Ph2oYzzLU7jiLWEPj2oOgMafmiPs4JKo4rF3acX0ywl74d-seyC-bVcjOzbnlhNxH49IzAVdpX_Z_RGdvCHD6PumKrJMJAULdJz3RV0OjXM5enSb9f6IVYl6yMP-gYODyOzA"
        />
        <div className="absolute inset-0 bg-primary/10 flex items-center justify-center">
          <motion.span 
            whileHover={{ scale: 1.05, letterSpacing: "0.25em" }}
            className="font-label-caps text-[10px] text-primary tracking-widest bg-surface/80 px-4 py-2 border border-primary/20 backdrop-blur-sm transition-all"
          >
            INSTITUTIONAL TRUST
          </motion.span>
        </div>
      </motion.div>
    </div>
  );
};

export default AICallout;
