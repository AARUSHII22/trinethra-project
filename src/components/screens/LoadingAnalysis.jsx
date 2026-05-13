import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useNav } from '../../navigation';
import { useAnalysis } from '../../context/AnalysisContext';
import { analyzeTranscript } from '../../services/analysisService';

const LoadingAnalysis = () => {
  const { toResults } = useNav();
  const { analysisData, updateAnalysis } = useAnalysis();

  const [elapsed, setElapsed] = useState(0);

  const transcriptRef = useRef(analysisData.transcript);
  const fellowNameRef = useRef(analysisData.fellowName);
  /** Ignores stale completions (e.g. React Strict Mode double-mount). */
  const runIdRef = useRef(0);

  const ollamaDisplayLabel = `Ollama · ${import.meta.env.VITE_OLLAMA_MODEL || 'llama3.2'}`;

  useEffect(() => {
    const t = setInterval(() => setElapsed((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const runId = ++runIdRef.current;

    const run = async () => {
      const transcript = transcriptRef.current;
      const displayName = (fellowNameRef.current || '').trim() || 'Fellow';

      if (!transcript?.trim()) {
        updateAnalysis({ error: 'No transcript found. Please go back and paste a transcript.', isLoading: false });
        return;
      }

      try {
        updateAnalysis({ isLoading: true, error: null });

        const aiResponse = await analyzeTranscript(transcript);

        if (runId !== runIdRef.current) return;

        const result = {
          ...aiResponse,
          score: aiResponse.rubricScore,
          label: aiResponse.scoreLabel,
          kpis: aiResponse.kpiMapping,
        };

        updateAnalysis({
          analysisResult: result,
          finalScore: result.score,
          finalAssessment: result.justification,
          isLoading: false,
          fellowName: displayName,
        });

        setTimeout(() => {
          if (runId === runIdRef.current) toResults();
        }, 400);
      } catch (err) {
        if (runId !== runIdRef.current) return;
        updateAnalysis({
          error: err.message || 'Analysis failed. Please try again.',
          isLoading: false,
        });
      }
    };

    run();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

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
            type="button"
            onClick={() => {
              updateAnalysis({ error: null });
              window.history.back();
            }}
            className="px-6 py-2 border border-outline text-on-surface-variant font-label-caps rounded hover:bg-surface-container transition-all"
          >
            Go Back
          </button>
          <button
            type="button"
            onClick={() => {
              updateAnalysis({ error: null });
              window.location.reload();
            }}
            className="px-8 py-2 bg-primary text-on-primary font-label-caps rounded shadow-sm hover:opacity-90"
          >
            Retry Analysis
          </button>
        </div>
      </motion.div>
    );
  }

  const minutes = Math.floor(elapsed / 60);
  const seconds = elapsed % 60;
  const elapsedStr =
    minutes > 0 ? `${minutes}m ${seconds.toString().padStart(2, '0')}s` : `${seconds}s`;

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-1 flex-col items-center justify-center bg-surface-bright relative overflow-hidden"
    >
      <motion.div
        animate={{ opacity: [0.08, 0.16, 0.08], scale: [1, 1.04, 1] }}
        transition={{ duration: 6, repeat: Infinity }}
        className="absolute w-[600px] h-[600px] bg-primary/5 rounded-full blur-[100px] -z-10 pointer-events-none"
      />

      <div className="max-w-lg w-full flex flex-col items-center gap-10 px-margin">
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
          <div className="text-center">
            <h2 className="font-headline-md text-headline-md text-on-surface mb-1 tracking-tight">
              Running analysis
            </h2>
            <p className="font-label-caps text-on-surface-variant tracking-widest text-[10px]">
              TRINETHRA · OLLAMA ·{' '}
              {analysisData.fellowName ? analysisData.fellowName.toUpperCase() : 'SESSION'}
            </p>
          </div>

          <div className="p-4 bg-surface border border-outline-variant rounded shadow-sm space-y-3">
            <p className="font-body-base text-sm text-on-surface-variant leading-relaxed">
              Waiting for your <strong className="text-on-surface">local Ollama</strong> model to finish. Large prompts (full rubric + transcript) often take{' '}
              <strong className="text-on-surface">2–10+ minutes</strong> on CPU — the bar below is <em>activity</em>, not completion percent.
            </p>
            <div className="w-full h-1.5 bg-surface-container-high rounded-full overflow-hidden relative">
              <motion.div
                className="absolute inset-y-0 w-1/3 bg-primary rounded-full"
                animate={{ left: ['-33%', '100%'] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              />
            </div>
          </div>

          <div className="flex justify-between items-center font-data-mono text-[10px] text-outline px-1">
            <span>⏱ {elapsedStr}</span>
            <span>LLM: {ollamaDisplayLabel}</span>
          </div>
        </div>

        <p className="text-[9px] font-label-caps text-outline text-center uppercase tracking-tighter opacity-50">
          {analysisData.fellowName
            ? `${analysisData.fellowName.replace(/\s+/g, '_')}_Transcript.log`
            : 'Transcript'}
        </p>
      </div>
    </motion.main>
  );
};

export default LoadingAnalysis;
