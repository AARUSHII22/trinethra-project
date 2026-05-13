import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Icon from '../shared/Icon';
import { useNav } from '../../navigation';
import { useAnalysis } from '../../context/AnalysisContext';

const EditFinalize = () => {
  const { toSubmitted, toResults } = useNav();
  const { analysisData, updateAnalysis } = useAnalysis();
  const [showAddForm, setShowAddForm] = useState(false);
  const [newEvidence, setNewEvidence] = useState({ type: 'Neutral', quote: '', time: '00:00', tags: [] });

  const evidence = analysisData.analysisResult?.evidence || [];

  const handleScoreChange = (e) => {
    updateAnalysis({ finalScore: parseInt(e.target.value) });
  };

  const handleRemoveEvidence = (index) => {
    const updated = [...evidence];
    updated.splice(index, 1);
    updateAnalysis({
      analysisResult: { ...(analysisData.analysisResult || {}), evidence: updated }
    });
  };

  const toggleSentiment = (index) => {
    const updated = [...evidence];
    const types = ['Positive', 'Neutral', 'Negative'];
    const currentIdx = types.indexOf(updated[index].type);
    updated[index].type = types[(currentIdx + 1) % types.length];
    updateAnalysis({
      analysisResult: { ...(analysisData.analysisResult || {}), evidence: updated }
    });
  };

  const handleAddEvidence = () => {
    if (!newEvidence.quote.trim()) return;
    const updated = [...evidence, { ...newEvidence, tags: ['Manual Entry'] }];
    updateAnalysis({
      analysisResult: { ...(analysisData.analysisResult || {}), evidence: updated }
    });
    setNewEvidence({ type: 'Neutral', quote: '', time: '00:00', tags: [] });
    setShowAddForm(false);
  };

  return (
    <motion.main 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-1 flex-col overflow-hidden bg-surface-bright"
    >
      <div className="flex-1 overflow-y-auto no-scrollbar">
        <div className="max-w-4xl mx-auto py-12 px-margin space-y-12 pb-32">
          
          <header className="space-y-2">
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2 text-primary font-label-caps text-xs"
            >
              <Icon name="edit_note" className="text-sm" />
              FINALIZE ASSESSMENT
            </motion.div>
            <h1 className="font-headline-md text-3xl text-on-surface">Review & Adjust</h1>
            <p className="text-on-surface-variant font-body-base max-w-2xl leading-relaxed">
              The AI produced a <strong className="text-on-surface">draft</strong>. Adjust the score and evidence to match your judgment before you treat this as final documentation.
            </p>
          </header>

          {/* 1. Score Adjustment */}
          <section className="bg-white border border-outline-variant p-8 rounded-lg shadow-sm space-y-6">
            <div className="flex justify-between items-end">
              <div>
                <h3 className="font-label-caps text-label-caps text-outline mb-1">FINAL NUMERIC SCORE</h3>
                <p className="text-display-lg text-primary leading-none">{analysisData.finalScore ?? 0}</p>
              </div>
              <div className="text-right">
                <span className="font-label-caps text-[10px] text-outline">CURRENT LABEL</span>
                <p className="font-bold text-on-surface">{analysisData.analysisResult?.label || "Calculating"}</p>
              </div>
            </div>
            <div className="space-y-4">
              <input 
                type="range" 
                min="0" 
                max="10" 
                step="1"
                value={analysisData.finalScore ?? 0}
                onChange={handleScoreChange}
                className="w-full h-2 bg-surface-container-high rounded-lg appearance-none cursor-pointer accent-primary"
              />
              <div className="flex justify-between font-data-mono text-[10px] text-outline px-1">
                <span>0.0 (CRITICAL)</span>
                <span>5.0 (NEUTRAL)</span>
                <span>10.0 (EXCEPTIONAL)</span>
              </div>
            </div>
          </section>

          {/* 2. Justification Edit */}
          <section className="space-y-4">
            <h3 className="font-label-caps text-label-caps text-outline">EXECUTIVE JUSTIFICATION</h3>
            <textarea 
              className="w-full bg-white border border-outline-variant p-6 rounded-lg font-body-base text-on-surface focus:outline-none focus:border-secondary h-40 inner-shadow transition-all"
              value={analysisData.finalAssessment ?? ""}
              onChange={(e) => updateAnalysis({ finalAssessment: e.target.value })}
            />
          </section>

          {/* 3. Evidence Refinement */}
          <section className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="font-label-caps text-label-caps text-outline">BEHAVIORAL EVIDENCE REFINEMENT</h3>
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowAddForm(true)}
                className="flex items-center gap-2 text-primary font-label-caps text-xs hover:underline"
              >
                <Icon name="add_circle" className="text-sm" />
                Add manual observation
              </motion.button>
            </div>

            <div className="space-y-4">
              <AnimatePresence mode="popLayout">
                {evidence.length > 0 ? (
                  evidence.map((item, index) => (
                    <motion.div 
                      layout
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      key={index}
                      className="flex gap-4 group"
                    >
                      <div className="flex-1 bg-white border border-outline-variant p-5 rounded flex gap-4 items-start shadow-sm hover:shadow-md transition-shadow">
                        <button 
                          onClick={() => toggleSentiment(index)}
                          className={`mt-1 flex-shrink-0 w-8 h-8 rounded flex items-center justify-center transition-colors ${
                            item.type === 'Positive' ? 'bg-[#D1E8CF] text-[#2E7D32]' : 
                            item.type === 'Negative' ? 'bg-[#FADBD8] text-[#C62828]' : 
                            'bg-[#FAD2B1] text-[#E65100]'
                          }`}
                          title="Click to toggle sentiment"
                        >
                          <Icon name={item.type === 'Positive' ? 'sentiment_very_satisfied' : item.type === 'Negative' ? 'sentiment_very_dissatisfied' : 'sentiment_neutral'} className="text-lg" />
                        </button>
                        <div className="flex-1">
                          <div className="flex justify-between items-start mb-2">
                            <span className="font-data-mono text-[10px] text-outline uppercase">{item.type} DYNAMIC @ {item.time}</span>
                            <motion.button 
                              whileHover={{ scale: 1.2, color: "#C62828" }}
                              onClick={() => handleRemoveEvidence(index)}
                              className="text-outline hover:text-error opacity-0 group-hover:opacity-100 transition-all"
                            >
                              <Icon name="delete" className="text-sm" />
                            </motion.button>
                          </div>
                          <p className="font-transcript-text text-sm italic text-on-surface">"{item.quote}"</p>
                        </div>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="p-8 border border-dashed border-outline-variant rounded-lg text-center bg-surface-container-low"
                  >
                    <p className="text-on-surface-variant font-body-base italic mb-4">No behavioral evidence points currently listed.</p>
                    <button 
                      onClick={() => setShowAddForm(true)}
                      className="text-primary font-label-caps text-xs hover:underline"
                    >
                      Add manual observation now
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>

              {showAddForm && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-6 bg-surface-container-low border-2 border-dashed border-primary/30 rounded-lg space-y-4"
                >
                  <div className="flex gap-4">
                    <select 
                      className="bg-white border border-outline p-2 rounded text-xs font-label-caps"
                      value={newEvidence.type}
                      onChange={(e) => setNewEvidence({...newEvidence, type: e.target.value})}
                    >
                      <option>Positive</option>
                      <option>Neutral</option>
                      <option>Negative</option>
                    </select>
                    <input 
                      type="text" 
                      placeholder="Timestamp (e.g. 12:45)" 
                      className="bg-white border border-outline p-2 rounded text-xs font-data-mono flex-1"
                      value={newEvidence.time}
                      onChange={(e) => setNewEvidence({...newEvidence, time: e.target.value})}
                    />
                  </div>
                  <textarea 
                    placeholder="Enter manual observation or direct quote..."
                    className="w-full bg-white border border-outline p-4 rounded text-sm font-body-base h-24"
                    value={newEvidence.quote}
                    onChange={(e) => setNewEvidence({...newEvidence, quote: e.target.value})}
                  />
                  <div className="flex justify-end gap-3">
                    <button 
                      onClick={() => setShowAddForm(false)} 
                      className="text-on-surface-variant font-label-caps text-xs"
                    >
                      Cancel
                    </button>
                    <button 
                      onClick={handleAddEvidence} 
                      className="bg-primary text-on-primary px-4 py-1 rounded font-label-caps text-xs shadow-sm hover:opacity-90"
                    >
                      Add Item
                    </button>
                  </div>
                </motion.div>
              )}
            </div>
          </section>
        </div>
      </div>

      {/* Sticky Footer Actions */}
      <motion.footer 
        initial={{ y: 80 }}
        animate={{ y: 0 }}
        className="bg-surface-container-highest border-t border-outline-variant p-6 shadow-lg z-10"
      >
        <div className="max-w-container-max mx-auto flex justify-between items-center">
          <motion.button 
            whileHover={{ x: -4 }}
            onClick={() => toResults()} 
            className="flex items-center gap-2 text-on-surface-variant font-label-caps text-label-caps"
          >
            <Icon name="arrow_back" className="text-sm" />
            Discard adjustments
          </motion.button>
          
          <div className="flex gap-4">
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-6 py-2 border border-outline text-on-surface-variant rounded font-label-caps text-label-caps hover:bg-surface-container transition-all"
            >
              Save Draft
            </motion.button>
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => { console.log("EditFinalize: Final submission"); toSubmitted(); }}
              className="px-8 py-2 bg-primary text-on-primary rounded font-label-caps text-label-caps shadow-md flex items-center gap-2"
            >
              Submit Assessment
              <Icon name="check_circle" className="text-sm" />
            </motion.button>
          </div>
        </div>
      </motion.footer>
    </motion.main>
  );
};

export default EditFinalize;
