import React from 'react';
import Icon from '../shared/Icon';
import { useNav } from '../../navigation';

const Header = () => {
  const { toHome } = useNav();

  return (
    <header className="bg-surface border-b border-outline-variant z-50">
      <div className="flex justify-between items-center w-full h-16 px-margin max-w-container-max mx-auto">
        <div className="flex items-center gap-gutter">
          <span className="font-display-lg text-display-lg font-bold text-primary cursor-pointer" onClick={toHome}>
            Trinethra
          </span>
          <nav className="hidden md:flex gap-6 items-center h-full">
            <button
              type="button"
              className="text-primary font-bold font-body-base text-body-base hover:bg-surface-container transition-colors px-3 py-2 rounded cursor-pointer"
              onClick={toHome}
            >
              Supervisor feedback analyzer
            </button>
          </nav>
        </div>
        <div className="flex items-center gap-2 text-on-surface-variant font-label-caps text-[10px] max-w-xs text-right">
          <Icon name="psychology" className="text-primary text-lg flex-shrink-0" />
          <span>Draft AI output — review before finalizing</span>
        </div>
      </div>
    </header>
  );
};

export default Header;
