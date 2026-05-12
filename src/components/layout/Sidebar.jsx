import React from 'react';
import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import Icon from '../shared/Icon';
import { useNav, ROUTES } from '../../navigation';
import { useAnalysis } from '../../context/AnalysisContext';

const Sidebar = () => {
  const { toHome, toResults } = useNav();
  const location = useLocation();
  const { analysisData } = useAnalysis();

  const isActive = (path) => location.pathname === path;
  const hasAnalysis = !!analysisData.analysisResult;

  const NavItem = ({ icon, label, path, onClick, forceActive }) => {
    const active = forceActive || isActive(path);
    return (
      <motion.a 
        whileHover={{ x: 4 }}
        whileTap={{ scale: 0.98 }}
        onClick={onClick}
        className={`flex items-center gap-3 px-4 py-3 transition-all rounded-l cursor-pointer ${
          active 
            ? 'text-secondary font-bold border-r-2 border-secondary bg-surface-container-high' 
            : 'text-on-surface-variant hover:bg-surface-container-high'
        }`}
      >
        <Icon name={icon} />
        <span className="font-label-caps text-label-caps">{label}</span>
      </motion.a>
    );
  };

  return (
    <motion.aside 
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="hidden md:flex flex-col h-full py-margin gap-gutter border-r border-outline-variant w-64 bg-surface-container-low min-h-[calc(100vh-4rem)]"
    >
      <div className="px-6 space-y-1">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 bg-primary rounded flex items-center justify-center">
              <Icon name="account_balance" className="text-white text-sm" />
            </div>
            <h2 className="font-headline-md text-headline-md text-primary">Library</h2>
          </div>
          <p className="font-label-caps text-label-caps text-on-surface-variant">Institutional Archive</p>
        </div>
        
        <motion.button 
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="button"
          onClick={() => { console.log("Sidebar: New Analysis clicked"); toHome(); }}
          className="w-full flex items-center gap-3 px-4 py-3 bg-primary text-on-primary rounded-lg mb-6 shadow-sm hover:opacity-90 transition-opacity"
        >
          <Icon name="add" />
          <span className="font-label-caps text-label-caps">New Analysis</span>
        </motion.button>

        <nav className="space-y-1">
          <NavItem 
            icon="dashboard" 
            label="Dashboard" 
            path={ROUTES.home} 
            onClick={() => { console.log("Sidebar: Home clicked"); toHome(); }} 
          />
          <NavItem 
            icon="description" 
            label="Transcripts" 
            onClick={() => console.log("Sidebar: Transcripts clicked - Placeholder")} 
          />
          <NavItem 
            icon="analytics" 
            label="Analysis" 
            path={ROUTES.results} 
            onClick={() => { 
              console.log("Sidebar: Analysis clicked");
              if (hasAnalysis) toResults();
              else { console.log("Sidebar: No analysis data, staying home"); toHome(); }
            }} 
          />
          <NavItem 
            icon="inventory_2" 
            label="Archive" 
            onClick={() => console.log("Sidebar: Archive clicked - Placeholder")} 
          />
        </nav>
      </div>

      <div className="mt-auto px-6 space-y-1">
        <NavItem 
          icon="settings" 
          label="Settings" 
          onClick={() => console.log("Sidebar: Settings clicked")} 
        />
        <NavItem 
          icon="help" 
          label="Help" 
          onClick={() => console.log("Sidebar: Help clicked")} 
        />
      </div>
    </motion.aside>
  );
};

export default Sidebar;
