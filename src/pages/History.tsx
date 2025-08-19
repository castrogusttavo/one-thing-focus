import React from "react";
import { Session } from '../types/Session';

function formatDate(timestamp: number): string {
    const date = new Date(timestamp);
    return date.toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
    });
}

function formatTime(timestamp: number): string {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function formatDuration(milliseconds: number): string {
    const minutes = Math.ceil(milliseconds / 1000 / 60);
    return `${minutes} min`;
}

function getLocalDateKey(timestamp: number): string {
    const date = new Date(timestamp);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
}

export default function History({ sessions }: { sessions: Session[] }) {
    const sessionsByDate: Record<string, Session[]> = sessions.reduce((acc, session) => {
        const dateKey = getLocalDateKey(session.startTime);
        if (!acc[dateKey]) {
            acc[dateKey] = [];
        }
        acc[dateKey].push(session);
        return acc;
    }, {} as Record<string, Session[]>);

    const sortedDates = Object.keys(sessionsByDate).sort((a, b) => {
        return new Date(b).getTime() - new Date(a).getTime();
    });

    if (sessions.length === 0) {
        return (
            <div className="flex flex-1 flex-col items-center justify-center text-center">
                <h2 className="text-xl text-zinc-400">No sessions yet.</h2>
                <p className="text-zinc-500">Complete a focus session to see your history here.</p>
            </div>
        );
    }

    return (
        <div className="p-6 pt-24 text-white flex flex-col flex-1 items-center overflow-y-auto w-full gap-[5rem]">
            {sortedDates.map(dateKey => (
                <div key={dateKey} className="w-full max-w-[400px] mb-6">
                    <h2 className="text-white text-3xl font-base mb-10 tracking-wide">
                        {formatDate(sessionsByDate[dateKey][0].startTime)}
                    </h2>
                    <div className="space-y-10">
                        {sessionsByDate[dateKey].map((s, idx) => (
                            <div key={idx}>
                                <h3 className="text-white text-lg font-base leading-tight mb-1">{s.task}</h3>
                                <p className="text-zinc-500 text-sm mb-2">
                                    {formatTime(s.startTime)} • {formatDuration(s.duration)}
                                </p>
                                {s.notes && (
                                    <>
                                        <hr className='w-[100px] border-zinc-900' />
                                        <p className="text-zinc-400 text-sm leading-snug mt-2 whitespace-pre-wrap">{s.notes}</p>
                                    </>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}
