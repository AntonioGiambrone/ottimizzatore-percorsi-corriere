
import React from 'react';

const TruckIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10 17h4V5H2v12h3" />
        <path d="M22 17H14v-5h8v5z" />
        <circle cx="7" cy="17" r="2" />
        <circle cx="17" cy="17" r="2" />
    </svg>
);


const Header: React.FC = () => {
  return (
    <header className="bg-white dark:bg-slate-800 shadow-md">
      <div className="container mx-auto px-4 py-4 flex items-center justify-center space-x-3">
        <TruckIcon />
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          Ottimizzatore Percorsi Corriere
        </h1>
      </div>
    </header>
  );
};

export default Header;
