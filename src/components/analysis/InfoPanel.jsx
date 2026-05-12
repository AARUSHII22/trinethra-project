import React from 'react';
import { useAnalysis } from '../../context/AnalysisContext';

const InfoPanel = () => {
  const { updateAnalysis } = useAnalysis();

  const samples = {
    'Positive_Sample.txt': {
      name: "Julianna Rivera",
      text: "Interviewer: How do you approach team conflict?\nJulianna: I believe in radical transparency. In my last role, we had a major disagreement about the deployment timeline. I pulled the team into a room, laid out the data, and we worked until we had a consensus. It's about shared ownership of the outcome."
    },
    'Mixed_Dynamic.txt': {
      name: "Marcus Chen",
      text: "Interviewer: Tell me about a time you failed.\nMarcus: We missed the Q3 target. It was my responsibility. I had the vision, but I didn't verify the resource allocation at the factory level. I've since implemented a double-check protocol for all operational shifts."
    },
    'Negative_Conflict.txt': {
      name: "Elena Rossi",
      text: "Interviewer: What is your management style?\nElena: I expect people to do their jobs. If I have to explain a task twice, it's a performance issue. We don't have time for hand-holding in a high-growth environment."
    }
  };

  return (
    <>
      <section className="bg-surface-container-low border border-outline-variant p-8 space-y-6">
        <h3 className="font-headline-md text-headline-md text-primary">
          What this tool does
        </h3>
        <ol className="space-y-6">
          <li className="flex gap-4">
            <span className="flex-shrink-0 w-8 h-8 rounded-full border border-primary text-primary flex items-center justify-center font-bold text-sm">
              1
            </span>
            <p className="text-on-surface-variant font-body-base">
              Identifies systemic friction points within operational hierarchies by analyzing natural language patterns.
            </p>
          </li>
          <li className="flex gap-4">
            <span className="flex-shrink-0 w-8 h-8 rounded-full border border-primary text-primary flex items-center justify-center font-bold text-sm">
              2
            </span>
            <p className="text-on-surface-variant font-body-base">
              Categorizes interpersonal dynamics into institutional growth markers or risk factors.
            </p>
          </li>
          <li className="flex gap-4">
            <span className="flex-shrink-0 w-8 h-8 rounded-full border border-primary text-primary flex items-center justify-center font-bold text-sm">
              3
            </span>
            <p className="text-on-surface-variant font-body-base">
              Generates structured executive summaries suitable for legal or academic archiving.
            </p>
          </li>
        </ol>
      </section>

      <section className="space-y-4">
        <h4 className="font-label-caps text-label-caps text-outline uppercase">
          Quick-load sample transcripts
        </h4>
        <div className="flex flex-wrap gap-2">
          {Object.keys(samples).map((sample) => (
            <button 
              key={sample}
              type="button"
              onClick={() => {
                console.log(`InfoPanel: Loading sample ${sample}`);
                updateAnalysis({ 
                  transcript: samples[sample].text,
                  fellowName: samples[sample].name
                });
              }}
              className="px-4 py-2 bg-surface-container-high border border-outline-variant text-on-surface-variant font-data-mono rounded-full hover:bg-primary hover:text-white transition-colors text-xs"
            >
              {sample}
            </button>
          ))}
        </div>
      </section>
    </>
  );
};

export default InfoPanel;
