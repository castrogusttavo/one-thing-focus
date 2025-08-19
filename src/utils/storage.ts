import { Session } from '../types/Session';

const SESSIONS_STORAGE_KEY = 'one-thing-focus-sessions';

/**
 * Salva a lista de sessões no localStorage do navegador.
 * @param sessions A lista completa de sessões a serem salvas.
 */
export const saveSessions = (sessions: Session[]): void => {
    try {
        localStorage.setItem(SESSIONS_STORAGE_KEY, JSON.stringify(sessions));
    } catch (error) {
        console.error('Failed to save sessions to localStorage:', error);
    }
};

export const loadSessions = (): Session[] => {
    try {
        const storedSessions = localStorage.getItem(SESSIONS_STORAGE_KEY);
        if (storedSessions) {
            return JSON.parse(storedSessions) as Session[];
        }
        return [];
    } catch (error) {
        console.warn('Could not load sessions from localStorage, starting fresh:', error);
        return [];
    }
};