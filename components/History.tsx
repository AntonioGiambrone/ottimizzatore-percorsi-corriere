import React from 'react';
import { SavedRoute } from './RouteOptimizer';
import HistoryIcon from './icons/HistoryIcon';
import MapIcon from './icons/MapIcon';
import TrashIcon from './icons/TrashIcon';

interface HistoryProps {
    routes: SavedRoute[];
    onLoadRoute: (route: Omit<SavedRoute, 'id' | 'date'>) => void;
    onDeleteRoute: (id: string) => void;
}

const History: React.FC<HistoryProps> = ({ routes, onLoadRoute, onDeleteRoute }) => {
    return (
        <div className="bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-xl shadow-lg">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-x-2">
                <HistoryIcon />
                Storico Percorsi
            </h2>
            {routes.length === 0 ? (
                <p className="text-slate-500 dark:text-slate-400 text-center py-8">Nessun percorso salvato.</p>
            ) : (
                <div className="space-y-4 max-h-[calc(100vh-200px)] overflow-y-auto pr-2">
                    {routes.map((route) => (
                        <div key={route.id} className="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg border border-slate-200 dark:border-slate-700">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">{route.date}</p>
                                    <p className="font-semibold text-slate-800 dark:text-slate-200 mt-1">
                                        Da: <span className="font-normal">{route.start}</span>
                                    </p>
                                    <p className="font-semibold text-slate-800 dark:text-slate-200">
                                        A: <span className="font-normal">{route.end}</span>
                                    </p>
                                    <p className="text-sm text-slate-600 dark:text-slate-300 mt-2">
                                        {route.stops.length} tappe
                                    </p>
                                </div>
                                <div className="flex flex-col sm:flex-row gap-2">
                                    <button
                                        onClick={() => onLoadRoute(route)}
                                        className="p-2 text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 rounded-full hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors duration-200"
                                        aria-label="Carica percorso su Maps"
                                        title="Carica percorso su Maps"
                                    >
                                        <MapIcon />
                                    </button>
                                     <button
                                        onClick={() => onDeleteRoute(route.id)}
                                        className="p-2 text-slate-500 hover:text-red-600 dark:hover:text-red-400 rounded-full hover:bg-red-100 dark:hover:bg-red-900/50 transition-colors duration-200"
                                        aria-label="Elimina percorso"
                                        title="Elimina percorso"
                                     >
                                        <TrashIcon />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default History;
