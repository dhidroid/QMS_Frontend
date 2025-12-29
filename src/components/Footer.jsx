import React from 'react';
import footerLogo from '../assets/logo.svg';

const Footer = ({ className }) => {
  return (
    <footer className={`w-full py-4 px-6 flex items-center justify-center gap-2 mt-auto ${className || ''}`}>
      <span className="text-xs text-muted-foreground font-medium text-slate-400">Developed by</span>
      <div className="flex items-center gap-1.5 opacity-80 hover:opacity-100 transition-opacity">
        <img 
          src={footerLogo} 
          alt="Natobotics" 
          className="h-5 w-auto object-contain" // Small logo
        />
        <span className="text-xs font-bold text-slate-600 tracking-wide uppercase">Natobotics</span>
      </div>
    </footer>
  );
};

export default Footer;
