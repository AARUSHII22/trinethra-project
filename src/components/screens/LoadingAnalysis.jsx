import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNav } from '../../navigation';
import { useAnalysis } from '../../context/AnalysisContext';
import { analyzeTranscriptStream, analyzeTranscript } from '../../services/analysisService';

const STEPS = [
  'Initializing neural processing models...',
  'Synthesizing behavioral patterns from transcript...',
  'Mapping evidence to the eight business KPIs from context…',
  'Identifying rubric dimensions and KPIs not evidenced in the call...',
  'Finalizing diagnostic synthesis report...',
];

const LoadingAnalysis = () => {
  const { toResults } = useNav();
  const { analysisData, updateAnalysis } = useAnalysis();

  const [step, setStep]             = useState(0);
  const [streamText, setStreamText] = useState('');
  const [elapsed, setElapsed]       = useState(0);
  const [tokenCount, setTokenCount] = useState(0);

  // Capture transcript + optional labels at mount — avoids stale-closure issues
  const transcriptRef = useRef(analysisData.transcript);
  const fellowNameRef = useRef(analysisData.fellowName);
  const cancelledRef  = useRef(false);

  // Elapsed timer
  useEffect(() => {
    const t = setInterval(() => setElapsed(s => s + 1), 1000);
    return () => clearInterval(t);
  }, []);

  // Advance step indicator while streaming
  useEffect(() => {
    if (step >= STEPS.length - 1) return;
    const t = setTimeout(() => setStep(s => s + 1), 4000);
    return () => clearTimeout(t);
  }, [step]);

  useEffect(() => {
    const run = async () => {
      const transcript = transcriptRef.current;
      const displayName = (fellowNameRef.current || '').trim() || 'Fellow';

      if (!transcript?.trim()) {
        updateAnalysis({ error: 'No transcript found. Please go back and paste a transcript.', isLoading: false });
        return;
      }

      try {
        updateAnalysis({ isLoading: true, error: null });

        let aiResponse;

        // Try streaming first, fall back to blocking on failure
        try {
          aiResponse = await analyzeTranscriptStream(transcript, (chunk) => {
            if (cancelledRef.current) return;
            setStreamText(prev => prev + chunk);
            setTokenCount(prev => prev + 1);
          });
        } catch (streamErr) {
          console.warn('[LOADING] Streaming failed, falling back to blocking call:', streamErr.message);
          if (cancelledRef.current) return;
          // Reset stream text for fallback
          setStreamText('');
          aiResponse = await analyzeTranscript(transcript);
        }

        if (cancelledRef.current) return;

        const result = {
          ...aiResponse,
          score: aiResponse.rubricScore,
          label: aiResponse.scoreLabel,
          kpis:  aiResponse.kpiMapping,
        };

        updateAnalysis({
          analysisResult:  result,
          finalScore:      result.score,
          finalAssessment: result.justification,
          isLoading:       false,
          fellowName:      displayName,
        });

        setStep(STEPS.length - 1);
        setTimeout(() => {
          if (!cancelledRef.current) toResults();
        }, 900);

      } catch (err) {
        if (!cancelledRef.current) {
          updateAnalysis({ error: err.message || 'Analysis failed. Please try again.', isLoading: false });
        }
      }
    };

    run();
    return () => { cancelledRef.current = true; };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Error state ────────────────────────────────────────────────────────────
  if (analysisData.error) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex-1 flex flex-col items-center justify-center bg-surface p-12 text-center"
      >
        <span className="material-symbols-outlined text-error text-6xl mb-4">error</span>
        <h2 className="font-headline-md text-headline-md text-on-surface mb-2">Synthesis Failed</h2>
        <p className="text-on-surface-variant max-w-md mx-auto mb-8 font-body-base leading-relaxed">
          {analysisData.error}
        </p>
        <div className="flex gap-3">
          <button
            onClick={() => { updateAnalysis({ error: null }); window.history.back(); }}
            className="px-6 py-2 border border-outline text-on-surface-variant font-label-caps rounded hover:bg-surface-container transition-all"
          >
            Go Back
          </button>
          <button
            onClick={() => { updateAnalysis({ error: null }); window.location.reload(); }}
            className="px-8 py-2 bg-primary text-on-primary font-label-caps rounded shadow-sm hover:opacity-90"
          >
            Retry Analysis
          </button>
        </div>
      </motion.div>
    );
  }

  const progressPct = Math.round(((step + 1) / STEPS.length) * 100);
  const minutes = Math.floor(elapsed / 60);
  const seconds = elapsed % 60;
  const elapsedStr = minutes > 0
    ? `${minutes}m ${seconds.toString().padStart(2, '0')}s`
    : `${seconds}s`;

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex-1 flex flex-col items-center justify-center bg-surface-bright relative overflow-hidden"
    >
      {/* Background glow */}
      <motion.div
        animate={{ opacity: [0.08, 0.16, 0.08], scale: [1, 1.04, 1] }}
        transition={{ duration: 6, repeat: Infinity }}
        className="absolute w-[600px] h-[600px] bg-primary/5 rounded-full blur-[100px] -z-10 pointer-events-none"
      />

      <div className="max-w-lg w-full flex flex-col items-center gap-10 px-margin">

        {/* Spinner + brain icon */}
        <div className="relative">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
            className="w-24 h-24 rounded-full border-2 border-primary/20 border-t-primary"
          />
          <motion.div
            animate={{ scale: [1, 1.08, 1], opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <span
              className="material-symbols-outlined text-primary text-4xl"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              psychology
            </span>
          </motion.div>
        </div>

        <div className="w-full space-y-6">
          {/* Title + meta */}
          <div className="text-center">
            <h2 className="font-headline-md text-headline-md text-on-surface mb-1 tracking-tight">
              Synthesizing Results
            </h2>
            <p className="font-label-caps text-on-surface-variant tracking-widest text-[10px]">
              TRINETHRA AI ENGINE · {analysisData.fellowName ? `${analysisData.fellowName.toUpperCase()}` : 'ACTIVE SESSION'}
            </p>
          </div>

          {/* Current step */}
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="flex items-center gap-4 p-4 bg-surface border border-outline-variant rounded shadow-sm"
            >
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse flex-shrink-0" />
              <p className="font-body-base text-sm text-on-surface-variant flex-1 italic">
                {STEPS[step]}
              </p>
              <span className="font-data-mono text-[10px] text-outline">{progressPct}%</span>
            </motion.div>
          </AnimatePresence>

          {/* Progress bar */}
          <div className="w-full h-1 bg-surface-container-high rounded-full overflow-hidden">
            <motion.div
              animate={{ width: `${progressPct}%` }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className="h-full bg-primary"
            />
          </div>

          {/* Stats row */}
          <div className="flex justify-between items-center font-data-mono text-[10px] text-outline px-1">
            <span>⏱ {elapsedStr}</span>
            {tokenCount > 0 && <span>{tokenCount} tokens received</span>}
            <span>Model: {import.meta.env.VITE_OLLAMA_MODEL || 'llama3.2'}</span>
          </div>

          {/* Live stream preview (collapsed by default, expands when text arrives) */}
          {streamText && (
            <motion.details
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="group"
            >
              <summary className="font-label-caps text-[10px] text-outline cursor-pointer select-none hover:text-on-surface-variant transition-colors">
                AI RAW OUTPUT ▶
              </summary>
              <div className="mt-2 max-h-28 overflow-y-auto bg-surface-container-highest border border-outline-variant rounded p-3 no-scrollbar">
                <pre className="font-data-mono text-[9px] text-on-surface-variant whitespace-pre-wrap break-all leading-relaxed">
                  {streamText}
                  <motion.span
                    animate={{ opacity: [1, 0, 1] }}
                    transition={{ duration: 0.8, repeat: Infinity }}
                    className="inline-block w-1.5 h-3 bg-primary ml-0.5 align-middle"
                  />
                </pre>
              </div>
            </motion.details>
          )}
        </div>

        <p className="text-[9px] font-label-caps text-outline text-center uppercase tracking-tighter opacity-50">
          {analysisData.fellowName
            ? `${analysisData.fellowName.replace(/\s+/g, '_')}_Transcript.log`
            : 'Active_Buffer_Input'}
        </p>
      </div>
    </motion.main>
  );
};

export default LoadingAnalysis;
