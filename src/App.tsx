import React, { useEffect } from 'react';
import './App.css';
import SideBar from "./components/sideBar";
import Pages from "./pages/Pages";
import { Session } from "./types/Session";
import { loadSessions, saveSessions } from "./utils/storage";

function App() {
    const [sessions, setSessions] = React.useState<Session[]>([]);
    const [notes, setNotes] = React.useState("");
    const [task, setTask] = React.useState('');
    const [screen, setScreen] = React.useState<"start" | "focus" | "summary" | "history" | "reflection">("start");
    const [view, setView] = React.useState<'start' | 'history'>('start');

    useEffect(() => {
        const loadedSessions = loadSessions();
        setSessions(loadedSessions);
    }, []);

    useEffect(() => {
        if (sessions.length > 0) {
            saveSessions(sessions);
        }
    }, [sessions]);

    return (
        <div className="min-h-screen bg-[#080808] flex flex-col px-8 py-8 max-h-screen">
            <Pages
                task={task}
                setTask={setTask}
                notes={notes}
                setNotes={setNotes}
                sessions={sessions}
                setSessions={setSessions}
                screen={screen}
                setScreen={setScreen}
                view={view}
                setView={setView}
            />
            <div className="w-full flex justify-end">
                <SideBar sessions={sessions} view={view} setView={setView} setScreen={setScreen} />
            </div>
        </div>
    );
}

export default App;