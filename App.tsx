
import React from 'react';
import Header from './components/Header';
import RouteOptimizer from './components/RouteOptimizer';

const App: React.FC = () => {
  return (
    <div className="min-h-screen font-sans text-slate-800 dark:text-slate-200">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <RouteOptimizer />
      </main>
      <footer className="text-center py-4 text-xs text-slate-500">
        <p>Creato con React, Tailwind CSS e Gemini API</p>
      </footer>
    </div>
  );
};

export default App;
