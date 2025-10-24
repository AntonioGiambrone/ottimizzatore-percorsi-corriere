/**
 * ATTENZIONE: Questo file è stato modificato per la sicurezza.
 * La logica di chiamata diretta all'API Gemini è stata rimossa dal client.
 * In un'applicazione reale, questo file farebbe una chiamata `fetch` a un
 * endpoint del proprio backend (es. /api/optimize-route).
 * Quel backend conserverebbe in modo sicuro la chiave API e farebbe la chiamata
 * a Gemini, per poi restituire il risultato al client.
 */
const getOptimizedRoute = async (start: string, end: string, stops: string[], preference: 'fastest' | 'shortest', exclusions: string): Promise<string[]> => {
    // L'endpoint punta al nostro server Node.js in esecuzione in locale
    const API_ENDPOINT = 'http://localhost:3001/api/optimize-route';

    try {
        const response = await fetch(API_ENDPOINT, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                start,
                end,
                stops,
                preference,
                exclusions,
            }),
        });

        if (!response.ok) {
            // Se la risposta del server non è OK, estraiamo il messaggio di errore se presente
            const errorData = await response.json().catch(() => ({})); // Prova a leggere il JSON, altrimenti usa un oggetto vuoto
            const errorMessage = errorData.error || `Errore del server: ${response.status} ${response.statusText}`;
            throw new Error(errorMessage);
        }
        
        // Il backend dovrebbe restituire un JSON con la chiave "optimizedStops"
        const data = await response.json();
        
        if (!data.optimizedStops || !Array.isArray(data.optimizedStops)) {
             throw new Error("La risposta dal server non ha un formato valido.");
        }

        return data.optimizedStops;

    } catch (error) {
        console.error("Errore durante la chiamata al backend:", error);
        // Rilanciamo l'errore per farlo gestire dal componente che ha chiamato questa funzione
        if (error instanceof Error) {
            throw new Error(`Impossibile comunicare con il servizio di ottimizzazione. Dettaglio: ${error.message}`);
        }
        throw new Error("Impossibile comunicare con il servizio di ottimizzazione a causa di un errore sconosciuto.");
    }
};

export { getOptimizedRoute };