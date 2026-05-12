import React from 'react';
import Icon from '../shared/Icon';
import { useNav } from '../../navigation';
import { useAuth } from '../../context/AuthContext';

const Header = () => {
  const { toHome } = useNav();
  const { user, logout } = useAuth();

  return (
    <header className="bg-surface border-b border-outline-variant z-50">
      <div className="flex justify-between items-center w-full h-16 px-margin max-w-container-max mx-auto">
        <div className="flex items-center gap-gutter">
          <span className="font-display-lg text-display-lg font-bold text-primary cursor-pointer" onClick={toHome}>
            Trinethra
          </span>
          <nav className="hidden md:flex gap-6 items-center h-full">
            <a 
              className="text-primary font-bold font-body-base text-body-base hover:bg-surface-container transition-colors px-3 py-2 rounded cursor-pointer" 
              onClick={toHome}
            >
              Supervisor Analysis
            </a>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 mr-2">
            <span className="hidden sm:block font-label-caps text-xs text-outline">{user?.name}</span>
            <div className="w-8 h-8 rounded-full bg-surface-container-high flex items-center justify-center text-primary">
              <Icon name="person" className="text-sm" />
            </div>
          </div>
          <button 
            type="button"
            onClick={logout}
            title="Secure Logout"
            className="text-on-surface-variant hover:text-error hover:bg-error-container transition-all p-2 rounded flex items-center justify-center"
          >
            <Icon name="logout" className="text-sm" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
