/**
 * Mock AI Analysis Service for Trinethra
 * Simulates a large language model processing a transcript and returning
 * structured organizational synthesis data.
 */

export const runMockAnalysis = (transcript) => {
  return new Promise((resolve) => {
    // Simulate processing time (2 seconds)
    setTimeout(() => {
      resolve({
        score: 7,
        label: "Problem Identifier",
        justification: "The candidate demonstrates strong diagnostic capabilities, particularly in identifying systemic bottlenecks within the supply chain workflow. While technical proficiency is high, behavioral indicators suggest a tendency toward 'safe' decision-making, occasionally prioritizing protocol over urgent tactical initiative. They show excellent reliability but could benefit from developing more autonomous risk-assessment frameworks.",
        
        evidence: [
          {
            type: "Neutral",
            time: "00:12:45",
            quote: "I usually wait for the supervisor to sign off before I commit any code to the production branch. It's safer that way. We've had issues in the past where unverified merges caused downtime.",
            tags: ['Process Adherence', 'Risk Mitigation']
          },
          {
            type: "Positive",
            time: "00:45:10",
            quote: "The last time the server went down, I stayed on the bridge until 2 AM to ensure the failover sequence was manually verified. It was exhaustive but necessary for data integrity.",
            tags: ['Ownership', 'Reliability']
          },
          {
            type: "Neutral",
            time: "01:05:22",
            quote: "I tend to document every single change in the Jira ticket before moving to the next task. It slows me down slightly but keeps the audit trail clean.",
            tags: ['Documentation', 'Quality Control']
          },
          {
            type: "Positive",
            time: "01:15:05",
            quote: "When I noticed the lag in the Q3 reporting tool, I built a small Python script to automate the data cleaning step. It saved the team about 4 hours a week.",
            tags: ['Efficiency', 'Tool Development']
          },
          {
            type: "Negative",
            time: "01:28:40",
            quote: "I'm not sure if it's my place to suggest changes to the vendor onboarding process. I just follow the steps the manager gave me when I started.",
            tags: ['Initiative Gap', 'Role Clarity']
          }
        ],

        kpis: [
          { label: "THROUGHPUT", value: "88%", status: "Above Threshold", color: "text-primary" },
          { label: "QUALITY", value: "92%", status: "High Accuracy", color: "text-primary" },
          { label: "TEAM SYNC", value: "64%", status: "Below Target", color: "text-secondary" }
        ],

        gaps: [
          { 
            icon: "trending_down", 
            title: "Leadership Hesitation", 
            desc: "Reluctance to make decisions without explicit validation even for low-risk tasks.",
            type: "Critical"
          },
          { 
            icon: "priority_high", 
            title: "Inter-departmental Siloing", 
            desc: "Lacks mentions of cross-functional team collaboration during critical testing phases.",
            type: "Warning"
          },
          { 
            icon: "sync_problem", 
            title: "Automation Trust", 
            desc: "Shows a preference for manual verification over automated failover sequences, potentially impacting scalability.",
            type: "Observation"
          }
        ],

        followUpQuestions: [
          "How do you define the boundary between 'following protocol' and 'taking initiative'?",
          "Can you describe a situation where you challenged a supervisor's proposed sign-off?",
          "What motivates your preference for manual verification over automated systems?",
          "How would you handle a high-stakes failure if no supervisor was available for immediate sign-off?"
        ]
      });
    }, 2000); // 2 second delay
  });
};
