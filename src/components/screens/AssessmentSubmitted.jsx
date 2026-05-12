import React from 'react';
import { motion } from 'framer-motion';
import { useNav } from '../../navigation';
import { useAnalysis } from '../../context/AnalysisContext';

const AssessmentSubmitted = () => {
  const { toHome, toResults } = useNav();
  const { analysisData } = useAnalysis();

  return (
    // No standalone header here — App.jsx already renders the global Header + Sidebar
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex-1 overflow-y-auto px-4 sm:px-margin py-8 sm:py-12 bg-surface-bright"
    >
      <div className="max-w-2xl w-full mx-auto flex flex-col items-center text-center space-y-6 sm:space-y-8">

        {/* Success Icon */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
          className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-tertiary-fixed flex items-center justify-center border border-outline-variant shadow-lg"
        >
          <span className="material-symbols-outlined text-[36px] sm:text-[48px] text-tertiary" style={{ fontVariationSettings: "'FILL' 1" }}>
            check_circle
          </span>
        </motion.div>

        {/* Heading + Score */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-3 px-2"
        >
          <h1 className="font-display-lg text-2xl sm:text-display-lg font-bold text-on-surface">Assessment submitted</h1>
          <p className="font-body-base text-sm sm:text-body-base text-on-surface-variant max-w-sm mx-auto">
            The evaluation for <span className="font-bold text-on-surface">{analysisData.fellowName || "the Fellow"}</span> has been finalized with a composite score of{' '}
            <span className="font-data-mono text-data-mono px-2 py-0.5 bg-surface-container-high rounded border border-outline-variant whitespace-nowrap">
              {(analysisData.finalScore ?? 0) * 10}/100
            </span>.
          </p>
          <p className="font-label-caps text-label-caps text-outline uppercase tracking-widest text-[10px]">
            Timestamp: {new Date().toLocaleString()}
          </p>
        </motion.div>

        {/* Archive Note Card */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="bg-surface-container-low border border-outline-variant p-4 sm:p-gutter rounded-lg w-full inner-shadow-recessed shadow-sm"
        >
          <div className="flex gap-3 items-start text-left">
            <span className="material-symbols-outlined text-on-surface-variant mt-1 shrink-0">
              inventory_2
            </span>
            <p className="font-body-base text-sm text-on-surface-variant leading-relaxed">
              This assessment has been securely archived to the <span className="italic text-primary">Institutional Archive</span> and is now available for longitudinal tracking and historical reporting.
            </p>
          </div>
        </motion.div>

        {/* Executive Summary Snippet */}
        {analysisData.finalAssessment && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="w-full bg-surface border border-outline-variant rounded-lg p-4 sm:p-5 text-left relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-1 h-full bg-primary" />
            <p className="font-label-caps text-[10px] text-outline mb-2 ml-1">EXECUTIVE SUMMARY</p>
            <p className="font-transcript-text text-sm italic text-on-surface line-clamp-3 ml-1">
              "{analysisData.finalAssessment}"
            </p>
          </motion.div>
        )}

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="flex flex-col sm:flex-row gap-3 sm:gap-gutter w-full justify-center"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="button"
            className="inline-flex items-center justify-center h-12 px-6 sm:px-8 bg-primary text-on-primary font-bold rounded shadow-md hover:opacity-90 transition-all w-full sm:w-auto text-sm"
            onClick={() => toResults()}
          >
            View submitted assessment
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="button"
            className="inline-flex items-center justify-center h-12 px-6 sm:px-8 border border-outline-variant text-secondary font-bold rounded bg-white hover:bg-surface-container-low transition-all shadow-sm w-full sm:w-auto text-sm"
            onClick={() => toHome()}
          >
            Analyze another transcript
          </motion.button>
        </motion.div>

      </div>
    </motion.main>
  );
};

export default AssessmentSubmitted;
