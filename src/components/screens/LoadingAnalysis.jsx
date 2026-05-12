import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Icon from '../shared/Icon';
import { useNav } from '../../navigation';
import { useAnalysis } from '../../context/AnalysisContext';
import { analyzeTranscript } from '../../services/analysisService';

const LoadingAnalysis = () => {
  const { toResults } = useNav();
  const { analysisData, updateAnalysis } = useAnalysis();
  const [currentStep, setCurrentStep] = useState(0);

  // Capture transcript ONCE at mount time using a ref.
  // This prevents stale-closure bugs where the async call sees an empty string.
  const transcriptRef = React.useRef(analysisData.transcript);

  const steps = [
    "Initializing neural processing models...",
    "Synthesizing behavioral patterns from transcript...",
    "Correlating evidence with DT Leadership KPIs...",
    "Identifying systemic organizational gaps...",
    "Finalizing diagnostic synthesis report..."
  ];

  useEffect(() => {
    let stepInterval;
    const startAnalysis = async () => {
      const transcript = transcriptRef.current;

      // Guard: if transcript is somehow empty, show a clear error
      if (!transcript || !transcript.trim()) {
        updateAnalysis({ 
          error: "No transcript found. Please go back and paste your transcript before running analysis.",
          isLoading: false
        });
        return;
      }

      try {
        console.log("LoadingAnalysis: Starting synthesis with transcript length:", transcript.length);
        updateAnalysis({ isLoading: true, error: null });
        
        stepInterval = setInterval(() => {
          setCurrentStep(prev => (prev < steps.length - 1 ? prev + 1 : prev));
        }, 800);

        const aiResponse = await analyzeTranscript(transcript);
        
        // Normalize the AI response to match the existing UI expectations
        const result = {
          ...aiResponse,
          score: aiResponse.rubricScore,
          label: aiResponse.scoreLabel,
          kpis: aiResponse.kpiMapping
        };

        updateAnalysis({ 
          analysisResult: result,
          finalScore: result.score,
          finalAssessment: result.justification,
          isLoading: false
        });

        setTimeout(() => {
          console.log("LoadingAnalysis: Synthesis complete, navigating to results");
          toResults();
        }, 1500);

      } catch (err) {
        console.error("Analysis Failed:", err);
        updateAnalysis({ 
          error: err.message || "The organizational synthesis model encountered an internal exception. Please verify transcript integrity.",
          isLoading: false
        });
      } finally {
        clearInterval(stepInterval);
      }
    };

    startAnalysis();
    return () => clearInterval(stepInterval);
  }, []);

  if (analysisData.error) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex-1 flex flex-col items-center justify-center bg-surface p-12 text-center"
      >
        <Icon name="error" className="text-error text-6xl mb-4" />
        <h2 className="font-headline-md text-on-surface mb-2">Synthesis Failed</h2>
        <p className="text-on-surface-variant max-w-md mx-auto mb-8">{analysisData.error}</p>
        <button onClick={() => { updateAnalysis({ error: null }); window.location.reload(); }} className="px-8 py-2 bg-primary text-white font-label-caps rounded">Retry Analysis</button>
      </motion.div>
    );
  }

  return (
    <motion.main 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex-1 flex flex-col items-center justify-center bg-surface-bright relative overflow-hidden"
    >
      {/* Dynamic Background Pulse */}
      <motion.div 
        animate={{ opacity: [0.1, 0.2, 0.1], scale: [1, 1.05, 1] }}
        transition={{ duration: 5, repeat: Infinity }}
        className="absolute w-[600px] h-[600px] bg-primary/5 rounded-full blur-[100px] -z-10"
      />

      <div className="max-w-md w-full flex flex-col items-center gap-12 px-margin">
        {/* Animated Loading Icon */}
        <div className="relative">
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            className="w-24 h-24 rounded-full border-2 border-primary/20 border-t-primary"
          />
          <motion.div 
            animate={{ scale: [1, 1.1, 1], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <span className="material-symbols-outlined text-primary text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>
              psychology
            </span>
          </motion.div>
        </div>

        <div className="w-full space-y-8">
          <div className="text-center">
            <h2 className="font-headline-md text-headline-md text-on-surface mb-2 tracking-tight">Synthesizing Results</h2>
            <p className="font-label-caps text-on-surface-variant tracking-widest text-xs">TRINETHRA AI ENGINE V4.2</p>
          </div>

          {/* Stepper Display */}
          <div className="space-y-4">
            <AnimatePresence mode="wait">
              <motion.div 
                key={currentStep}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex items-center gap-4 p-4 bg-surface border border-outline-variant rounded shadow-sm"
              >
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                <p className="font-body-base text-sm text-on-surface-variant flex-1 italic">
                  {steps[currentStep]}
                </p>
                <span className="font-data-mono text-[10px] text-outline">{Math.min(100, Math.round(((currentStep + 1) / steps.length) * 100))}%</span>
              </motion.div>
            </AnimatePresence>

            {/* Progress Track */}
            <div className="w-full h-1 bg-surface-container-high rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: "0%" }}
                animate={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
                className="h-full bg-primary transition-all duration-500 ease-out"
              />
            </div>
          </div>
        </div>

        <p className="text-[10px] font-label-caps text-outline text-center uppercase tracking-tighter opacity-60">
          Source: {analysisData.fellowName ? `${analysisData.fellowName}_Transcript.log` : "Active_Buffer_Input"}
        </p>
      </div>
    </motion.main>
  );
};

export default LoadingAnalysis;
