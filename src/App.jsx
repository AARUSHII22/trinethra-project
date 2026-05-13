import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Header from './components/layout/Header';
import Sidebar from './components/layout/Sidebar';
import Footer from './components/layout/Footer';
import TranscriptInput from './components/screens/TranscriptInput';
import LoadingAnalysis from './components/screens/LoadingAnalysis';
import AnalysisResults from './components/screens/AnalysisResults';
import EditFinalize from './components/screens/EditFinalize';
import AssessmentSubmitted from './components/screens/AssessmentSubmitted';

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <div className="flex flex-col min-h-screen bg-surface">
      <Header />
      <div className="flex flex-1 max-w-container-max mx-auto w-full overflow-hidden">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden relative">
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
              <Route path="/" element={<TranscriptInput />} />
              <Route path="/loading" element={<LoadingAnalysis />} />
              <Route path="/results" element={<AnalysisResults />} />
              <Route path="/edit" element={<EditFinalize />} />
              <Route path="/submitted" element={<AssessmentSubmitted />} />
              <Route path="*" element={<TranscriptInput />} />
            </Routes>
          </AnimatePresence>
        </div>
      </div>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <Router>
      <AnimatedRoutes />
    </Router>
  );
}

export default App;
