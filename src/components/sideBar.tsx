import React from 'react';
import { Session } from '../types/Session';

interface SideBarProps {
    sessions: Session[];
    view: 'start' | 'history';
    setView: (view: 'start' | 'history') => void;
    setScreen: React.Dispatch<React.SetStateAction<"start" | "focus" | "summary" | "history" | "reflection">>;
}

export default function SideBar({ sessions, view, setView, setScreen }: SideBarProps) {
    const today = new Date().toISOString().split('T')[0];

    const sessionsToday = sessions.filter(session => {
        const sessionDate = new Date(session.startTime).toISOString().split('T')[0];
        return sessionDate === today;
    });

    return (
        <div className="flex justify-between w-full bottom-0 text-xs text-zinc-500 px-2">
            <div className="flex items-center space-x-2">
                <button
                    onClick={() => { setView('start'); setScreen('start') }}
                    className={`font-medium ${view === 'start' ? 'text-zinc-200' : 'text-zinc-500'}`}
                >
                    Timer
                </button>
                <span className="text-zinc-600">•</span>
                <button
                    onClick={() => { setView('history'); setScreen('history') }}
                    className={`font-medium ${view === 'history' ? 'text-zinc-200' : 'text-zinc-500'}`}
                >
                    History
                </button>
            </div>
            <span className="text-zinc-500">
Focused today: <span className="text-zinc-300">{sessionsToday.reduce((acc, session) => acc + Math.round((new Date(session.endTime).getTime() - new Date(session.startTime).getTime()) / 60000), 0)} min</span>      </span>
        </div>
    );
}
