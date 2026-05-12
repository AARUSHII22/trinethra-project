import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Icon from '../shared/Icon';
import { useNav } from '../../navigation';
import { useAnalysis } from '../../context/AnalysisContext';

const AnalysisForm = () => {
  const { toLoading } = useNav();
  const { analysisData, updateAnalysis } = useAnalysis();
  const [errors, setErrors] = useState({});

  // Auto-clear errors when data is populated via global state (e.g. sample buttons)
  React.useEffect(() => {
    if (analysisData.fellowName && errors.fellowName) {
      setErrors(prev => ({ ...prev, fellowName: null }));
    }
    if (analysisData.transcript && errors.transcript) {
      setErrors(prev => ({ ...prev, transcript: null }));
    }
  }, [analysisData.fellowName, analysisData.transcript]);

  const handleRunAnalysis = () => {
    console.log("AnalysisForm: handleRunAnalysis triggered");
    const newErrors = {};
    
    if (!analysisData.transcript || !analysisData.transcript.trim()) {
      newErrors.transcript = "Transcript data is required to begin analysis.";
    }
    
    if (!analysisData.fellowName || !analysisData.fellowName.trim()) {
      newErrors.fellowName = "Fellow name is required.";
    }

    if (Object.keys(newErrors).length > 0) {
      console.log("AnalysisForm: Validation failed", newErrors);
      setErrors(newErrors);
      return;
    }

    console.log("AnalysisForm: Validation passed, moving to loading");
    setErrors({});
    toLoading();
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="md:col-span-6 space-y-8"
    >
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <span className="font-label-caps text-label-caps text-primary bg-primary-fixed px-2 py-1 rounded">
          Trinethra
        </span>
        <h1 className="font-display-lg text-display-lg text-on-surface mt-2">
          Supervisor Analysis
        </h1>
        <p className="text-on-surface-variant mt-2 font-body-base">
          Upload or paste the interview transcript to begin organizational synthesis.
        </p>
      </motion.div>

      {/* Identity Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter">
        <div className="space-y-2">
          <label className="font-label-caps text-label-caps text-outline block">
            Fellow name
          </label>
          <input 
            className={`w-full bg-white border ${errors.fellowName ? 'border-primary' : 'border-outline-variant'} p-3 font-body-base rounded inner-shadow focus:border-secondary focus:outline-none transition-colors duration-300`} 
            placeholder="e.g. Sarah Jenkins" 
            type="text"
            value={analysisData.fellowName || ''}
            onChange={(e) => {
              updateAnalysis({ fellowName: e.target.value });
              if (errors.fellowName) setErrors(prev => ({ ...prev, fellowName: null }));
            }}
          />
          {errors.fellowName && (
            <motion.p initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="text-primary text-[10px] font-label-caps mt-1 flex items-center gap-1">
              <Icon name="error" className="text-xs" />
              {errors.fellowName}
            </motion.p>
          )}
        </div>
        <div className="space-y-2">
          <label className="font-label-caps text-label-caps text-outline block">
            Supervisor role
          </label>
          <div className="relative">
            <select 
              className="w-full bg-white border border-outline-variant p-3 font-body-base rounded inner-shadow focus:border-secondary focus:outline-none appearance-none cursor-pointer"
              value={analysisData.supervisorRole || ''}
              onChange={(e) => updateAnalysis({ supervisorRole: e.target.value })}
            >
              <option value="">Select role...</option>
              <option value="Factory Owner">Factory Owner</option>
              <option value="COO">COO</option>
              <option value="Project Manager">Project Manager</option>
              <option value="Human Resources">Human Resources</option>
            </select>
            <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-on-surface-variant">
              <Icon name="arrow_drop_down" />
            </div>
          </div>
        </div>
      </div>

      <div className="relative">
        <label className="font-label-caps text-label-caps text-outline block mb-2">
          TRANSCRIPT DATA
        </label>
        <textarea 
          className={`w-full h-48 bg-white border ${errors.transcript ? 'border-primary' : 'border-outline-variant'} p-6 font-transcript-text text-transcript-text text-on-surface focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary inner-shadow leading-relaxed resize-y shadow-sm rounded-lg transition-all duration-300`} 
          placeholder="Enter the transcript text here..."
          value={analysisData.transcript || ''}
          onChange={(e) => {
            updateAnalysis({ transcript: e.target.value });
            if (errors.transcript) setErrors(prev => ({ ...prev, transcript: null }));
          }}
        />
        {errors.transcript && (
          <motion.p initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="text-primary text-[10px] font-label-caps mt-1 flex items-center gap-1">
            <Icon name="error" className="text-xs" />
            {errors.transcript}
          </motion.p>
        )}
      </div>

      <motion.button 
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        type="button"
        onClick={handleRunAnalysis}
        className="bg-primary text-on-primary px-8 py-4 font-label-caps text-label-caps rounded flex items-center gap-2 hover:opacity-90 transition-all shadow-md w-full md:w-auto justify-center"
      >
        Run Analysis 
        <Icon name="arrow_forward" />
      </motion.button>
    </motion.div>
  );
};

export default AnalysisForm;
