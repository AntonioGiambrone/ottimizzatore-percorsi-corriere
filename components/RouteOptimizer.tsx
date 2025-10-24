import React, { useState, useEffect } from 'react';
import { getOptimizedRoute } from '../services/geminiService';
import PlusIcon from './icons/PlusIcon';
import TrashIcon from './icons/TrashIcon';
import UploadIcon from './icons/UploadIcon';
import SaveIcon from './icons/SaveIcon';
import Spinner from './Spinner';
import History from './History';
import SafetyDisclaimer from './SafetyDisclaimer';

export interface SavedRoute {
    id: string;
    start: string;
    end: string;
    stops: string[];
    preference: 'fastest' | 'shortest';
    date: string;
}

const RouteOptimizer: React.FC = () => {
    const [startPoint, setStartPoint] = useState<string>('');
    const [endPoint, setEndPoint] = useState<string>('');
    const [stops, setStops] = useState<string[]>(['']);
    const [routePreference, setRoutePreference] = useState<'fastest' | 'shortest'>('fastest');
    const [exclusions, setExclusions] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [lastOptimizedRoute, setLastOptimizedRoute] = useState<Omit<SavedRoute, 'id' | 'date'> | null>(null);
    const [savedRoutes, setSavedRoutes] = useState<SavedRoute[]>([]);
    const [showDisclaimer, setShowDisclaimer] = useState<boolean>(false);

    useEffect(() => {
        try {
            const storedRoutes = localStorage.getItem('courier-route-history');
            if (storedRoutes) {
                setSavedRoutes(JSON.parse(storedRoutes));
            }
            const disclaimerAccepted = localStorage.getItem('courier-disclaimer-accepted');
            if (!disclaimerAccepted) {
                setShowDisclaimer(true);
            }
        } catch (error) {
            console.error("Failed to load data from localStorage", error);
            setError("Impossibile caricare i dati locali.");
        }
    }, []);

    const handleAcceptDisclaimer = () => {
        localStorage.setItem('courier-disclaimer-accepted', 'true');
        setShowDisclaimer(false);
    };
    
    const openRouteInMaps = (route: Omit<SavedRoute, 'id' | 'date'>) => {
        const waypoints = route.stops.join('|');
        const avoidParam = route.preference === 'shortest' ? '&avoid=highways' : '';
        const mapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(route.start)}&destination=${encodeURIComponent(route.end)}&waypoints=${encodeURIComponent(waypoints)}${avoidParam}`;
        window.open(mapsUrl, '_blank');
    };

    const handleAddStop = () => {
        setStops([...stops, '']);
    };

    const handleRemoveStop = (index: number) => {
        const newStops = stops.filter((_, i) => i !== index);
        setStops(newStops);
    };

    const handleStopChange = (index: number, value: string) => {
        const newStops = [...stops];
        newStops[index] = value;
        setStops(newStops);
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            const text = e.target?.result as string;
            const addresses = text.split('\n').map(addr => addr.trim()).filter(addr => addr.length > 0);
            if(addresses.length > 0) {
                setStops(addresses);
                setError(null);
            } else {
                setError("Il file CSV è vuoto o non contiene indirizzi validi su righe separate.");
            }
        };
        reader.readAsText(file);
    };
    
    const handleSaveRoute = () => {
        if (!lastOptimizedRoute) return;
        
        const newRoute: SavedRoute = {
            id: new Date().toISOString(),
            ...lastOptimizedRoute,
            date: new Date().toLocaleString('it-IT'),
        };
        
        const updatedRoutes = [newRoute, ...savedRoutes];
        setSavedRoutes(updatedRoutes);
        localStorage.setItem('courier-route-history', JSON.stringify(updatedRoutes));
        setLastOptimizedRoute(null); // Disable save button after saving
    };
    
    const handleDeleteRoute = (id: string) => {
        const updatedRoutes = savedRoutes.filter(route => route.id !== id);
        setSavedRoutes(updatedRoutes);
        localStorage.setItem('courier-route-history', JSON.stringify(updatedRoutes));
    };


    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setLastOptimizedRoute(null);
        const filteredStops = stops.filter(stop => stop.trim() !== '');

        if (!startPoint.trim() || !endPoint.trim() || filteredStops.length === 0) {
            setError('Per favore, compila il punto di partenza, di arrivo e almeno una tappa.');
            return;
        }
        
        setError(null);
        setIsLoading(true);

        try {
            const optimizedStops = await getOptimizedRoute(startPoint, endPoint, filteredStops, routePreference, exclusions);
            const routeData = { start: startPoint, end: endPoint, stops: optimizedStops, preference: routePreference };
            setLastOptimizedRoute(routeData);
            openRouteInMaps(routeData);
        } catch (err) {
            console.error(err);
            const errorMessage = err instanceof Error ? err.message : 'Si è verificato un errore sconosciuto.';
            setError(`Impossibile ottimizzare il percorso. Il server ha risposto con un errore. Dettaglio: ${errorMessage}`);
        } finally {
            setIsLoading(false);
        }
    };
    
    const isFormValid = startPoint.trim() && endPoint.trim() && stops.some(s => s.trim());

    return (
        <>
            {showDisclaimer && <SafetyDisclaimer onAccept={handleAcceptDisclaimer} />}
            <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-xl shadow-lg">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="start" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Punto di Partenza</label>
                                <input type="text" id="start" value={startPoint} onChange={e => setStartPoint(e.target.value)} placeholder="Es: Via Roma 1, Milano" className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                            </div>
                            <div>
                                <label htmlFor="end" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Punto di Arrivo</label>
                                <input type="text" id="end" value={endPoint} onChange={e => setEndPoint(e.target.value)} placeholder="Es: Piazza Duomo 1, Milano" className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                            </div>
                        </div>

                        <div>
                            <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">Tappe Intermedie</h3>
                            <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
                                {stops.map((stop, index) => (
                                    <div key={index} className="flex items-center space-x-2">
                                        <span className="text-sm font-semibold text-slate-500 dark:text-slate-400 w-8 text-center">{index + 1}.</span>
                                        <input type="text" value={stop} onChange={e => handleStopChange(index, e.target.value)} placeholder={`Indirizzo tappa ${index + 1}`} className="flex-grow px-3 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                                        <button type="button" onClick={() => handleRemoveStop(index)} className="p-2 text-slate-500 hover:text-red-600 dark:hover:text-red-400 rounded-full hover:bg-red-100 dark:hover:bg-red-900/50 transition-colors duration-200">
                                            <TrashIcon />
                                        </button>
                                    </div>
                                ))}
                            </div>
                             <button type="button" onClick={handleAddStop} className="mt-4 flex items-center space-x-2 px-4 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/50 rounded-md hover:bg-blue-200 dark:hover:bg-blue-900 transition-colors duration-200">
                                <PlusIcon />
                                <span>Aggiungi Tappa</span>
                            </button>
                        </div>

                        <div className="relative"><div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-300 dark:border-slate-600"></div></div><div className="relative flex justify-center text-sm"><span className="px-2 bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400">oppure</span></div></div>

                        <div>
                            <label htmlFor="file-upload" className="relative cursor-pointer bg-white dark:bg-slate-700 rounded-md font-medium text-blue-600 dark:text-blue-400 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500 w-full flex justify-center items-center px-4 py-6 border-2 border-slate-300 dark:border-slate-600 border-dashed rounded-md">
                                <div className="text-center">
                                    <UploadIcon />
                                    <span className="mt-2 block text-sm">Carica tappe da file CSV</span>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">Un indirizzo per riga</p>
                                </div>
                                <input id="file-upload" name="file-upload" type="file" accept=".csv, .txt" className="sr-only" onChange={handleFileChange} />
                            </label>
                        </div>

                        <div>
                            <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-3">Opzioni Avanzate</h3>
                            <div className="space-y-4">
                                <fieldset>
                                    <legend className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Preferenza percorso</legend>
                                    <div className="flex items-center gap-x-6">
                                        <div className="flex items-center"><input id="fastest" name="route-preference" type="radio" value="fastest" checked={routePreference === 'fastest'} onChange={() => setRoutePreference('fastest')} className="h-4 w-4 border-slate-300 text-blue-600 focus:ring-blue-500" /><label htmlFor="fastest" className="ml-2 block text-sm text-slate-900 dark:text-slate-200">Più veloce (default)</label></div>
                                        <div className="flex items-center"><input id="shortest" name="route-preference" type="radio" value="shortest" checked={routePreference === 'shortest'} onChange={() => setRoutePreference('shortest')} className="h-4 w-4 border-slate-300 text-blue-600 focus:ring-blue-500" /><label htmlFor="shortest" className="ml-2 block text-sm text-slate-900 dark:text-slate-200">Più breve / panoramico</label></div>
                                    </div>
                                </fieldset>
                                <div>
                                    <label htmlFor="exclusions" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Aree/strade da escludere</label>
                                    <input type="text" id="exclusions" value={exclusions} onChange={e => setExclusions(e.target.value)} placeholder="Es: centro storico, strade a pedaggio" className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                                </div>
                            </div>
                        </div>
                        
                        {error && <p className="text-sm text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/50 p-3 rounded-md">{error}</p>}

                        <div className="pt-4 space-y-4">
                            <button type="submit" disabled={!isFormValid || isLoading} className="w-full flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-slate-400 dark:disabled:bg-slate-600 disabled:cursor-not-allowed transition-colors duration-200">
                                {isLoading ? <Spinner /> : 'Genera Percorso Ottimizzato'}
                            </button>
                            {lastOptimizedRoute && (
                                 <button type="button" onClick={handleSaveRoute} className="w-full flex justify-center items-center gap-x-2 px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-200">
                                    <SaveIcon />
                                    Salva Percorso
                                </button>
                            )}
                        </div>
                    </form>
                </div>

                <History
                    routes={savedRoutes}
                    onLoadRoute={openRouteInMaps}
                    onDeleteRoute={handleDeleteRoute}
                />
            </div>
        </>
    );
};

export default RouteOptimizer;
