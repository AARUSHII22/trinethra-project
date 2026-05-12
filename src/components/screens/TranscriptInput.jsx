import React from 'react';
import AnalysisForm from '../analysis/AnalysisForm';
import InfoPanel from '../analysis/InfoPanel';
import AICallout from '../analysis/AICallout';

const TranscriptInput = () => {
  return (
    <main className="flex-1 overflow-hidden flex flex-col bg-surface-bright">
      <div className="flex-1 overflow-y-auto px-margin py-8 no-scrollbar">
        <div className="max-w-container-max mx-auto h-full">
          <div className="grid grid-cols-1 md:grid-cols-10 gap-10 items-start">
            {/* Left Column: Input (60%) */}
            <AnalysisForm />

            {/* Right Column: Context (40%) */}
            <aside className="md:col-span-4 space-y-gutter sticky top-0">
              <InfoPanel />
              <AICallout />
            </aside>
          </div>
        </div>
      </div>
    </main>
  );
};

export default TranscriptInput;
