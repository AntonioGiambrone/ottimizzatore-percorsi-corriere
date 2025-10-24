import React from 'react';

interface SafetyDisclaimerProps {
    onAccept: () => void;
}

const SafetyDisclaimer: React.FC<SafetyDisclaimerProps> = ({ onAccept }) => {
    return (
        <div className="fixed inset-0 bg-slate-900 bg-opacity-75 flex items-center justify-center z-50 p-4" aria-modal="true" role="dialog">
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl max-w-md w-full p-6 sm:p-8 transform transition-all">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">Attenzione: Versione di Test (Beta)</h2>
                <div className="mt-4 space-y-3 text-sm text-slate-600 dark:text-slate-300">
                    <p>
                        Benvenuto nell'Ottimizzatore Percorsi Corriere! Questa applicazione è attualmente in fase di test.
                    </p>
                    <p>
                        I percorsi generati dall'intelligenza artificiale sono da considerarsi <strong className="font-semibold">suggerimenti</strong>. Potrebbero non essere sempre i più accurati o efficienti in condizioni di traffico reale.
                    </p>
                    <p>
                        <strong className="font-semibold text-amber-600 dark:text-amber-400">Verifica sempre il percorso suggerito</strong> con un'applicazione di navigazione affidabile (come Google Maps, Waze, etc.) prima di metterti in viaggio.
                    </p>
                </div>
                <div className="mt-6">
                    <button
                        onClick={onAccept}
                        className="w-full flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                    >
                        Capisco e accetto
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SafetyDisclaimer;
