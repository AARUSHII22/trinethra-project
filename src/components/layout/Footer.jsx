import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-surface-container-highest border-t border-outline">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-2 px-margin py-3 sm:py-unit w-full max-w-container-max mx-auto">
        <div className="font-label-caps text-label-caps text-on-surface text-center sm:text-left">
          © 2024 Trinethra AI. All rights reserved.
        </div>
        <div className="flex flex-wrap justify-center sm:justify-end gap-x-margin gap-y-1">
          <a className="font-label-caps text-label-caps text-on-surface-variant hover:text-primary transition-opacity opacity-80 hover:opacity-100" href="#">
            Edit &amp; Finalize
          </a>
          <a className="font-label-caps text-label-caps text-on-surface-variant hover:text-primary transition-opacity opacity-80 hover:opacity-100" href="#">
            Privacy Policy
          </a>
          <a className="font-label-caps text-label-caps text-on-surface-variant hover:text-primary transition-opacity opacity-80 hover:opacity-100" href="#">
            Terms of Service
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
