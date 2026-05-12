import React, { createContext, useContext, useState } from 'react';

// 1. Create the Context
const AnalysisContext = createContext();

// 2. Create the Provider Component
export const AnalysisProvider = ({ children }) => {
  const [analysisData, setAnalysisData] = useState({
    // User/Transcript Data
    transcript: '',
    fellowName: '',
    supervisorRole: '',
    
    // AI Analysis Response
    analysisResult: null,
    finalScore: 0,
    finalAssessment: '',
    
    // State Tracking
    isLoading: false,
    error: null
  });

  // Helper function to update state partially
  const updateAnalysis = (newData) => {
    setAnalysisData(prev => ({ ...prev, ...newData }));
  };

  return (
    <AnalysisContext.Provider value={{ analysisData, updateAnalysis }}>
      {children}
    </AnalysisContext.Provider>
  );
};

// 3. Create the custom hook for easy access
export const useAnalysis = () => {
  const context = useContext(AnalysisContext);
  if (!context) {
    throw new Error('useAnalysis must be used within an AnalysisProvider');
  }
  return context;
};
