/**
 * Test PDF Generator
 * Use this to test PDF generation with mock data
 */

import { generateAnalysisPDF } from './pdfGenerator';

export const testPDFGeneration = () => {
  const mockAnalysisData = {
    fellowName: 'John Doe',
    transcript: 'This is a sample interview transcript. The candidate discussed their leadership experience and technical skills.',
    finalScore: 8,
    finalAssessment: 'Strong candidate with excellent leadership qualities and technical expertise.',
    analysisResult: {
      rubricScore: 8,
      scoreLabel: 'Performance',
      justification: 'The candidate demonstrated strong leadership skills, proactive problem-solving, and excellent communication throughout the interview.',
      evidence: [
        {
          type: 'Positive',
          time: '02:15',
          quote: 'I led a team of 5 developers and we delivered the project ahead of schedule.',
          tags: ['Leadership', 'Ownership', 'Delivery']
        },
        {
          type: 'Positive',
          time: '05:30',
          quote: 'When we encountered a technical blocker, I researched solutions and proposed three alternatives to the team.',
          tags: ['Problem Solving', 'Initiative', 'Technical']
        },
        {
          type: 'Neutral',
          time: '08:45',
          quote: 'I usually prefer to work independently but can collaborate when needed.',
          tags: ['Collaboration', 'Independence']
        },
        {
          type: 'Negative',
          time: '12:20',
          quote: 'I haven\'t had much experience with agile methodologies.',
          tags: ['Agile', 'Experience Gap']
        },
        {
          type: 'Positive',
          time: '15:10',
          quote: 'I actively mentor junior developers and help them grow their skills.',
          tags: ['Mentorship', 'Leadership', 'Team Development']
        }
      ],
      kpiMapping: [
        {
          label: 'Ownership',
          value: '85%',
          status: 'Target Met',
          color: 'text-primary'
        },
        {
          label: 'Reliability',
          value: '90%',
          status: 'Exceeds Target',
          color: 'text-tertiary'
        },
        {
          label: 'Initiative',
          value: '80%',
          status: 'Target Met',
          color: 'text-primary'
        },
        {
          label: 'Collaboration',
          value: '70%',
          status: 'Below Target',
          color: 'text-error'
        }
      ],
      gaps: [
        {
          icon: 'warning',
          title: 'Limited Agile Experience',
          desc: 'Candidate has minimal exposure to agile methodologies and scrum practices.',
          type: 'Critical'
        },
        {
          icon: 'info',
          title: 'Collaboration Preference',
          desc: 'Shows preference for independent work over team collaboration.',
          type: 'Normal'
        },
        {
          icon: 'lightbulb',
          title: 'Growth Opportunity',
          desc: 'Could benefit from more cross-functional project experience.',
          type: 'Normal'
        }
      ],
      followUpQuestions: [
        'Can you describe a situation where you had to adapt your leadership style to different team members?',
        'How do you handle conflicts within your team?',
        'What steps would you take to improve your agile methodology knowledge?',
        'Tell me about a time when collaboration was essential to project success.'
      ]
    }
  };

  try {
    console.log('[TEST] Generating test PDF with mock data...');
    generateAnalysisPDF(mockAnalysisData);
    console.log('[TEST] Test PDF generated successfully!');
    return true;
  } catch (error) {
    console.error('[TEST] Test PDF generation failed:', error);
    return false;
  }
};

// Make it available in browser console
if (typeof window !== 'undefined') {
  window.testPDFGeneration = testPDFGeneration;
}
