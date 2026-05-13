import React, { useEffect, useState } from 'react';
import { useAnalysis } from '../../context/AnalysisContext';

const InfoPanel = () => {
  const { updateAnalysis } = useAnalysis();
  const [samples, setSamples] = useState([]);
  const [loadError, setLoadError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    fetch('/api/sample-transcripts')
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then((data) => {
        if (!cancelled) setSamples(Array.isArray(data) ? data : []);
      })
      .catch((e) => {
        if (!cancelled) setLoadError(e.message || 'Failed to load samples');
      });
    return () => { cancelled = true; };
  }, []);

  const loadSample = (entry) => {
    const name = entry?.metadata?.fellowName || 'Fellow';
    updateAnalysis({
      transcript: entry.transcript || '',
      fellowName: name,
      supervisorRole: entry?.metadata?.supervisorRole || '',
    });
  };

  return (
    <>
      <section className="bg-surface-container-low border border-outline-variant p-8 space-y-6">
        <h3 className="font-headline-md text-headline-md text-primary">
          What this tool does
        </h3>
        <ol className="space-y-6 list-decimal pl-5 text-on-surface-variant font-body-base">
          <li>
            Sends the pasted supervisor transcript to your <strong className="text-on-surface">local Ollama</strong> model (runs on your machine).
          </li>
          <li>
            Produces a <strong className="text-on-surface">draft</strong>: evidence quotes, suggested 1–10 rubric score, KPI mapping (8 KPIs from assignment context), gaps where the call did not cover rubric dimensions, and follow-up questions.
          </li>
          <li>
            You <strong className="text-on-surface">review, edit, and finalize</strong> — the model suggests; the intern decides.
          </li>
        </ol>
      </section>

      <section className="space-y-4">
        <h4 className="font-label-caps text-label-caps text-outline uppercase">
          Sample supervisor transcripts
        </h4>
        <p className="text-xs text-on-surface-variant">
          Loaded from <code className="bg-surface-container px-1 rounded">sample-transcripts.json</code> at the repo root (assignment data).
        </p>
        {loadError && (
          <p className="text-error text-sm">{loadError}</p>
        )}
        <div className="flex flex-col gap-2">
          {samples.map((entry) => (
            <button
              key={entry.id}
              type="button"
              onClick={() => loadSample(entry)}
              className="text-left px-4 py-3 bg-surface-container-high border border-outline-variant text-on-surface-variant font-body-base rounded hover:bg-primary hover:text-white transition-colors text-sm"
            >
              <span className="font-label-caps text-[10px] text-outline block">{entry.tone}</span>
              <span className="font-medium text-on-surface">{entry.title}</span>
              {entry.metadata?.clientContext && (
                <span className="block text-xs mt-1 opacity-80">{entry.metadata.clientContext}</span>
              )}
            </button>
          ))}
        </div>
      </section>
    </>
  );
};

export default InfoPanel;
