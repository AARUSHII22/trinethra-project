import React from 'react';
import { motion } from 'framer-motion';
import Icon from '../shared/Icon';

const AICallout = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="bg-primary-fixed text-on-primary-fixed-variant p-6 rounded-lg border border-primary-container flex gap-4 shadow-sm relative overflow-hidden"
    >
      <Icon
        name="auto_awesome"
        className="text-primary relative z-10 flex-shrink-0"
        style={{ fontVariationSettings: "'FILL' 1" }}
      />
      <div className="space-y-2 relative z-10">
        <p className="font-bold text-xs font-label-caps tracking-wider text-primary">Draft from local Ollama</p>
        <p className="text-sm opacity-90 leading-relaxed font-body-base">
          Scores, KPI links, and gaps are <strong>suggestions</strong>. Cross-check every quote against the transcript before you finalize — avoid automation bias.
        </p>
      </div>
    </motion.div>
  );
};

export default AICallout;
