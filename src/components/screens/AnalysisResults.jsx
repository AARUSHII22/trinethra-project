import React from 'react';
import { motion } from 'framer-motion';
import { useNav } from '../../navigation';
import { useAnalysis } from '../../context/AnalysisContext';
import { generateAnalysisPDF } from '../../utils/pdfGenerator';

// Safely coerce any AI-returned value to a string for rendering
const str = (v) => (typeof v === 'string' ? v : v == null ? '' : JSON.stringify(v));

// --- Reusable Subcomponents ---

const NavLink = ({ href, icon, title, active }) => (
  <motion.a 
    whileHover={{ x: 4 }}
    className={`flex items-center gap-3 font-label-caps text-label-caps group pr-4 cursor-pointer ${
      active ? 'text-secondary font-bold border-r-2 border-secondary' : 'text-on-surface-variant hover:bg-surface-container-high transition-colors'
    }`} 
    href={href}
  >
    <span className="material-symbols-outlined text-[20px]">{icon}</span>
    {title}
  </motion.a>
);

const EvidenceCard = ({ type, time, quote, tags = [], colorBorder, colorBg }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    whileHover={{ scale: 1.01, boxShadow: "0 4px 20px rgba(0,0,0,0.05)" }}
    className={`source-highlight bg-white border border-outline-variant border-l-4 ${colorBorder} p-6 rounded shadow-sm transition-all cursor-default`}
  >
    <div className="flex justify-between items-start mb-4">
      <span className={`font-label-caps text-label-caps px-3 py-1 text-on-surface rounded-full ${colorBg}`}>{type}</span>
      <span className="font-data-mono text-[11px] text-outline">{time}</span>
    </div>
    <blockquote className="font-transcript-text text-transcript-text italic text-on-surface mb-4 leading-relaxed">
      "{str(quote)}"
    </blockquote>
    <div className="flex gap-2 flex-wrap">
      {Array.isArray(tags) && tags.map(tag => (
        <span key={str(tag)} className="bg-surface-container text-on-surface-variant text-[10px] font-label-caps px-2 py-1 rounded">
          {str(tag)}
        </span>
      ))}
    </div>
  </motion.div>
);

const STATUS_DOT = {
  'Strong link':      'bg-tertiary',
  'Moderate link':    'bg-primary',
  'Weak / indirect':  'bg-outline',
  'Not evidenced':    'bg-error',
};

const KPIRow = ({ label, value, status, delay }) => {
  const dotColor = STATUS_DOT[status] ?? 'bg-outline';
  const textColor =
    status === 'Not evidenced' ? 'text-error' :
    status === 'Strong link'   ? 'text-tertiary' :
    status === 'Moderate link' ? 'text-primary' : 'text-outline';

  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay, duration: 0.3 }}
      className="flex items-start gap-3 py-3 border-b border-outline-variant last:border-0"
    >
      <span className={`mt-1.5 w-2 h-2 rounded-full flex-shrink-0 ${dotColor}`} />
      <div className="flex-1 min-w-0">
        <p className="font-label-caps text-[10px] text-outline uppercase tracking-wide mb-0.5">{str(label)}</p>
        <p className="text-sm text-on-surface leading-snug">{str(value) || '—'}</p>
      </div>
      <span className={`flex-shrink-0 text-[10px] font-medium mt-0.5 ${textColor}`}>{str(status)}</span>
    </motion.div>
  );
};

const GapCard = ({ icon, title, desc, meta, bgClass, borderClass, iconClass }) => (
  <motion.div 
    whileHover={{ x: 4 }}
    className={`flex gap-4 p-4 rounded items-start ${bgClass} ${borderClass} shadow-sm transition-all`}
  >
    <span className={`material-symbols-outlined mt-1 ${iconClass}`}>{icon}</span>
    <div>
      {meta && (
        <p className="text-[10px] font-data-mono text-outline uppercase tracking-wide mb-1">{meta}</p>
      )}
      <p className="font-bold text-on-surface text-body-base">{str(title)}</p>
      <p className="text-on-surface-variant text-sm">{str(desc)}</p>
    </div>
  </motion.div>
);

const SpeakerBlock = ({ name, time, isInterviewer, children }) => (
  <motion.div 
    initial={{ opacity: 0 }}
    whileInView={{ opacity: 1 }}
    viewport={{ once: true }}
    className="speaker-block"
  >
    <span className={`font-data-mono text-[11px] uppercase mb-1 block ${isInterviewer ? 'text-primary' : 'text-outline'}`}>
      {name} [{time}]
    </span>
    <p className="font-transcript-text text-[15px] leading-relaxed text-on-surface">
      {children}
    </p>
  </motion.div>
);

// --- Main Component ---

const AnalysisResults = () => {
  const { toEdit } = useNav();
  const { analysisData } = useAnalysis();
  
  const handleExportPDF = () => {
    try {
      console.log('[AnalysisResults] Exporting PDF with data:', analysisData);
      
      // Validate data before attempting PDF generation
      if (!analysisData || !analysisData.analysisResult) {
        alert('No analysis data available to export. Please complete an analysis first.');
        return;
      }
      
      generateAnalysisPDF(analysisData);
      
      // Show success message
      console.log('[AnalysisResults] PDF exported successfully');
    } catch (error) {
      console.error('[AnalysisResults] PDF generation failed:', error);
      alert(`Failed to generate PDF: ${error.message}\n\nPlease check the browser console for details.`);
    }
  };
  
  if (!analysisData.analysisResult && !analysisData.isLoading) {
    return (
      <motion.main 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-1 flex-col items-center justify-center bg-surface-bright"
      >
        <div className="max-w-md text-center p-8 bg-surface-container-low border border-outline-variant rounded-lg shadow-sm">
          <span className="material-symbols-outlined text-[48px] text-outline mb-4">search_off</span>
          <h2 className="font-headline-md text-2xl text-on-surface mb-2">No Analysis Data</h2>
          <p className="text-on-surface-variant font-body-base mb-6">
            There is no analysis data to display. Please return to the analysis form and submit a transcript.
          </p>
          <button 
            onClick={() => window.location.href = '/'} 
            className="bg-primary text-on-primary px-6 py-2 rounded font-label-caps text-sm hover:opacity-90 transition-all"
          >
            Go to Analysis Form
          </button>
        </div>
      </motion.main>
    );
  }

  const result = analysisData.analysisResult || {};

  return (
    <motion.main 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-1 overflow-hidden max-w-container-max mx-auto w-full"
    >
      {/* Left Column: Fixed Analysis Overview (25%) */}
      <aside className="w-72 flex-shrink-0 bg-surface-container-low border-r border-outline-variant flex flex-col p-6 overflow-y-auto">
        <motion.div 
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-8"
        >
          <p className="font-label-caps text-label-caps text-on-surface-variant mb-2">STATUS</p>
          <h1 className="font-headline-md text-headline-md text-primary">Draft analysis ready</h1>
          <p className="text-on-surface-variant text-xs mt-2 leading-relaxed border-l-2 border-secondary pl-3">
            This is AI-assisted output for intern review — not a final verdict. Use Edit &amp; Finalize to adjust score and evidence.
          </p>
        </motion.div>

        <motion.div 
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-primary px-6 py-4 rounded mb-6 flex items-center justify-between shadow-md"
        >
          <span className="font-label-caps text-label-caps text-on-primary">FELLOW SCORE</span>
          <span className="font-data-mono text-2xl font-bold text-on-primary">
            {analysisData.finalScore ?? result?.score ?? 0} / 10
          </span>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mb-8"
        >
          <h2 className="font-headline-md text-headline-md text-on-surface mb-2">{str(result?.label) || "Assessment"}</h2>
          <p className="text-on-surface-variant text-body-base leading-relaxed">
            {str(analysisData.finalAssessment ?? result?.justification) || "No justification provided."}
          </p>
        </motion.div>

        <nav className="space-y-4 flex-1">
          <NavLink href="#behavioral" icon="analytics" title="BEHAVIORAL EVIDENCE" active />
          <NavLink href="#kpi" icon="speed" title="KPI CONNECTIONS" />
          <NavLink href="#gap" icon="warning" title="GAP ANALYSIS" />
          <NavLink href="#questions" icon="help_center" title="FOLLOW-UP" />
        </nav>

        <div className="mt-auto pt-6 flex flex-col gap-2 border-t border-outline-variant">
          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            type="button"
            onClick={() => toEdit()}
            className="w-full py-2.5 bg-primary text-on-primary font-label-caps text-[11px] tracking-widest rounded hover:opacity-90 transition-all shadow-sm"
          >
            Edit &amp; Finalize
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            type="button"
            onClick={handleExportPDF}
            className="w-full py-2.5 bg-surface-container border border-outline-variant text-on-surface-variant font-label-caps text-[11px] tracking-widest rounded hover:bg-surface-container-high transition-all"
          >
            Export PDF
          </motion.button>
        </div>
      </aside>

      {/* Center Column: Analysis Sections (50%) */}
      <section className="flex-1 min-w-0 overflow-y-auto bg-surface-bright px-8 py-10 scroll-smooth no-scrollbar">
        
        {/* A: Behavioral Evidence */}
        <div className="mb-16" id="behavioral">
          <header className="mb-8 border-b border-outline-variant pb-4">
            <h3 className="font-headline-md text-headline-md text-on-surface">Behavioral evidence</h3>
          </header>
          <div className="space-y-6">
            {result?.evidence && result.evidence.length > 0 ? (
              result.evidence.map((item, index) => (
                <EvidenceCard 
                  key={index}
                  type={item.type}
                  time={item.time}
                  quote={item.quote}
                  tags={item.tags}
                  colorBorder={item.type === 'Positive' ? 'border-l-tertiary' : item.type === 'Negative' ? 'border-l-error' : 'border-l-primary'}
                  colorBg={item.type === 'Positive' ? 'bg-[#D1E8CF]' : item.type === 'Negative' ? 'bg-[#FADBD8]' : 'bg-[#FAD2B1]'}
                />
              ))
            ) : (
              <div className="p-8 border border-dashed border-outline-variant rounded-lg text-center bg-surface-container-low">
                <span className="material-symbols-outlined text-outline mb-2">find_in_page</span>
                <p className="text-on-surface-variant font-body-base italic">No behavioral evidence identified in this transcript.</p>
              </div>
            )}
          </div>
        </div>

        {/* B: KPI Connections */}
        <div className="mb-16" id="kpi">
          <header className="mb-8 border-b border-outline-variant pb-4">
            <h3 className="font-headline-md text-headline-md text-on-surface">KPI connections</h3>
          </header>
          {result?.kpis && result.kpis.length > 0 ? (
            <div className="bg-white border border-outline-variant rounded shadow-sm divide-y-0 px-4">
              {result.kpis.map((kpi, index) => (
                <KPIRow
                  key={index}
                  label={kpi.label}
                  value={kpi.value}
                  status={kpi.status}
                  delay={0.05 * index}
                />
              ))}
            </div>
          ) : (
            <div className="p-8 border border-dashed border-outline-variant rounded-lg text-center bg-surface-container-low">
              <p className="text-on-surface-variant font-body-base italic">No KPI correlations mapped.</p>
            </div>
          )}
        </div>

        {/* C: Gap Analysis */}
        <div className="mb-16" id="gap">
          <header className="mb-8 border-b border-outline-variant pb-4">
            <h3 className="font-headline-md text-headline-md text-on-surface">Gap Analysis</h3>
          </header>
          <div className="space-y-4">
            {result?.gaps && result.gaps.length > 0 ? (
              result.gaps.map((gap, index) => (
                <GapCard 
                  key={index}
                  icon={gap.icon || 'help'}
                  title={gap.title}
                  desc={gap.desc}
                  meta={gap.dimensionId}
                  bgClass={gap.type === 'Critical' ? 'bg-error-container/30' : 'bg-surface-container'}
                  borderClass={gap.type === 'Critical' ? 'border-error-container' : 'border-outline-variant'}
                  iconClass={gap.type === 'Critical' ? 'text-error' : 'text-primary'}
                />
              ))
            ) : (
              <div className="p-8 border border-dashed border-outline-variant rounded-lg text-center bg-surface-container-low">
                <p className="text-on-surface-variant font-body-base italic">No critical gaps identified.</p>
              </div>
            )}
          </div>
        </div>

        {/* D: Follow-up Questions */}
        <div className="mb-8" id="questions">
          <header className="mb-8 border-b border-outline-variant pb-4">
            <h3 className="font-headline-md text-headline-md text-on-surface">Follow-up Questions</h3>
          </header>
          {result?.followUpQuestions && result.followUpQuestions.length > 0 ? (
            <ul className="space-y-4 list-decimal pl-5">
              {result.followUpQuestions.map((q, index) => (
                <motion.li
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  key={index}
                  className="text-on-surface-variant pl-2 leading-relaxed"
                >
                  {typeof q === 'string' ? q : (q?.question || q?.title || q?.desc || JSON.stringify(q))}
                </motion.li>
              ))}
            </ul>
          ) : (
            <p className="text-on-surface-variant font-body-base italic">No follow-up questions generated.</p>
          )}
        </div>
      </section>

      {/* Right Column: Source Transcript (25%) */}
      <aside className="w-72 flex-shrink-0 bg-surface border-l border-outline-variant flex flex-col overflow-hidden">
        <header className="p-6 border-b border-outline-variant bg-surface-container-low">
          <p className="font-label-caps text-label-caps text-on-surface-variant mb-1">SOURCE MATERIAL</p>
          <h3 className="font-headline-md text-sm font-bold truncate">
            {analysisData.fellowName ? `${analysisData.fellowName.replace(/\s+/g, '_')}_Transcript.log` : "Interview_Transcript.log"}
          </h3>
        </header>
        <div className="transcript-viewport flex-1 overflow-y-auto p-6 space-y-6 bg-surface-bright no-scrollbar">
          {analysisData.transcript ? (
            <SpeakerBlock name={analysisData.fellowName || "Fellow"} time="Full Session">
              <span className="whitespace-pre-wrap">{analysisData.transcript}</span>
            </SpeakerBlock>
          ) : (
            <div className="h-full flex flex-col items-center justify-center opacity-40 text-center p-4">
              <span className="material-symbols-outlined text-[48px] mb-2">description</span>
              <p className="text-sm italic">No transcript data available for this session.</p>
            </div>
          )}
        </div>
      </aside>
    </motion.main>
  );
};

export default AnalysisResults;
