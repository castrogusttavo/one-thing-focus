import React from "react";
import SummaryScreen from "./Summary";
import ReflectionScreen from "./Reflection";
import History from "./History";
import { Session } from "../types/Session";
import HeatMap from "../components/heatMap";
import { sumSessionsDurationByDay } from "../utils/sumSessions";

interface HomePageProps {
    task: string;
    setTask: (task: string) => void;
    notes: string;
    setNotes: (notes: string) => void;
    sessions: Session[];
    setSessions: React.Dispatch<React.SetStateAction<Session[]>>;
    screen: "start" | "focus" | "summary" | "history" | "reflection";
    setScreen: React.Dispatch<React.SetStateAction<"start" | "focus" | "summary" | "history" | "reflection">>;
    view: "start" | "history";
    setView: React.Dispatch<React.SetStateAction<"start" | "history">>;
}

const MILESTONE_INTERVAL = 1800; // 30 min em segundos
const LINE_HEIGHT_PX = 65;

export default function Pages({ task, setTask, notes, setNotes, sessions, setSessions, view, setView, setScreen, screen }: HomePageProps) {
    const [hasStarted, setHasStarted] = React.useState(false);
    const [isFinished, setIsFinished] = React.useState(false);
    const [isPaused, setIsPaused] = React.useState(false);
    const [elapsedTime, setElapsedTime] = React.useState(0);
    const [startTime, setStartTime] = React.useState(0);
    const inputRef = React.useRef(null);

    const minutesWorked = Math.floor(elapsedTime / 60);
    const sessionsTime = sumSessionsDurationByDay(sessions);

    React.useEffect(() => {
        (inputRef.current as HTMLInputElement | null)?.focus();
    }, []);

    React.useEffect(() => {
        if (!hasStarted || isPaused || isFinished) return;

        const timer = setInterval(() => {
            const now = Date.now();
            const diff = Math.floor((now - startTime) / 1000);
            setElapsedTime(diff);
        }, 1000);

        return () => clearInterval(timer);
    }, [hasStarted, isPaused, isFinished, startTime]);

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60).toString().padStart(2, "0");
        const s = (seconds % 60).toString().padStart(2, "0");
        return `${m}:${s}`;
    };

    const startSession = () => {
        setElapsedTime(0);
        setStartTime(Date.now());
        setScreen("focus");
        setHasStarted(true);
    };

    const resetSession = () => {
        setTask("");
        setHasStarted(false);
        setIsFinished(false);
        setElapsedTime(0);
        setNotes("");
        setScreen("start");
        setView?.("start");
    };

    const cancelSession = () => {
        setIsFinished(false);
        setElapsedTime(0);
        setNotes("");
        setScreen("focus");
        setHasStarted(true);
        setIsPaused(false);
        setStartTime(Date.now());
    }

    const finishSession = () => {
        const endTime = Date.now();

        const newSession: Session = {
            task,
            notes,
            startTime,
            endTime,
            duration: endTime - startTime,
        };

        setSessions((prev) => [newSession, ...prev]);
        setTask("");
        setNotes("");
        setScreen("summary");
    };

    const renderProgress = () => {
        const milestoneCount = Math.max(4, Math.ceil(elapsedTime / MILESTONE_INTERVAL) + 1); // sempre mostra no mínimo 4
        const elements = [];

        for (let i = 0; i < milestoneCount; i++) {
            const milestoneTime = i * MILESTONE_INTERVAL;
            const isFilled = elapsedTime >= milestoneTime;

            // Círculo
            elements.push(
                <div
                    key={`circle-${i}`}
                    className={`w-3 h-3 rounded-full transition-all duration-500 ${
                        isFilled ? 'bg-white' : 'bg-[#161616]'
                    }`}
                />
            );

            // Linha abaixo do círculo (inclusive após o último)
            const progressInSegment = Math.min(
                Math.max((elapsedTime - milestoneTime) / MILESTONE_INTERVAL, 0),
                1
            );

            const lineHeight = LINE_HEIGHT_PX * progressInSegment;

            elements.push(
                <div key={`line-${i}`} className="relative h-[65px] w-px">
                    {/* Fundo neutro */}
                    <div className="absolute top-0 left-0 w-px h-full border-l-2 border-[#161616]" />
                    {/* Preenchimento branco do topo para baixo */}
                    <div
                        className="absolute top-0 left-0 w-px border-l-2 border-white transition-all duration-500"
                        style={{ height: `${lineHeight}px` }}
                    />
                </div>
            );
        }

        return elements;
    };

    if (screen === "start") {
        return (
            <div className="flex flex-1 flex-col items-center justify-center text-center gap-1">
                <h1 className="font-medium text-3xl mb-1 font-normal mb-5 text-center text-zinc-200">
                    What are you working on?
                </h1>
                <span className="text-[#5A5A5A] text-sm text-center mb-6 max-w-sm font-medium">
                    Pick one important, challenging task that will move you forward.
                    Avoid shallow work or multitasking.
                </span>
                <div className='flex items-center w-[425px] h-[50px] border-2 border-[#464646] rounded-md bg-[#101010] overflow-hidden pr-1 outline-4 outline-[#262626] focus-within:outline transition-all'>
                    <input autoFocus className='flex-1 bg-transparent px-3 py-2 text-sm text-zinc-300 placeholder:text-zinc-500 focus:outline-none' placeholder="I will focus on..." name={'task'} value={task} onChange={(e) => setTask(e.target.value)} ref={inputRef} />
                    <button className='px-4 bg-[#141414] border border-[#1B1B1B] text-sm text-zinc-200 transition-all h-[75%] rounded flex items-center justify-center gap-2' onClick={() => {
                        if (task.trim()) {
                            startSession();
                        }
                    }}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" color="#ffffff">
                            <path d="M18 5.5L19 4.5M5 4.5L6 5.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                            <circle cx="12" cy="13" r="9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"></circle>
                            <path d="M12 9.5V13.5L14 15.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                            <path d="M12 3.5V2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                            <path d="M10 2H14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                        </svg>
                        Start
                    </button>
                </div>

                <HeatMap sessions={sessionsTime} />
            </div>
        );
    }

    if (screen === "focus" || screen === "reflection") {
        return (
            <>
                <div className="flex flex-1 flex-col md:flex-row items-center justify-center text-center max-w-full">
                    <div className='flex flex-col items-center justify-center max-w-[220px] w-[220px] '>
                        <h2 className="text-base text-zinc-400">{task}</h2>
                        <h1 className="text-7xl font-light text-zinc-200 tracking-wider">{formatTime(elapsedTime)}</h1>
                        <button className="w-full bg-white text-black px-6 py-2 rounded-md text-base font-medium hover:bg-zinc.200 trnasition mt-10" onClick={() => { setIsFinished(true); setScreen("reflection"); }}>Finish and save</button>
                        <div className="mt-4 flex items-center gap-3 text-sm text-[#5A5A5A]">
                            <button className="hover:text-[#737373] hover:underline transition" onClick={() => setIsPaused((prev) => !prev)}>
                                {isPaused ? "Resume" : "Pause"}
                            </button>
                            <span className="text-zinc-600">•</span>
                            <button className="hover:text-[#737373] hover:underline transition" onClick={resetSession}>Abandon</button>
                        </div>
                        <hr className='w-[250px] border-[#161616] mt-8' />
                        <p className='mt-4 text-zinc-500 text-sm font-medium'>Ctrl + W to close the window</p>
                    </div>
                    <hr className='h-[250px] border-2 border-[#161616] mx-[125px]' />
                    <div className='flex flex-col items-center justify-center max-w-max'>
                        <span className='text-zinc-300 text-sm font-medium mr-28'>Focus zones</span>
                        <div className='text-white mt-6 flex flex-row'>
                            <div className='flex flex-col items-center gap-[80px] mr-4 max-h-[300px]'>
                                <span className='max-h-3 text-xs text-black'>00 min</span>
                                <span className='max-h-3 text-xs'>30 min</span>
                                <span className='max-h-3 text-xs'>60 min</span>
                                <span className='max-h-3 text-xs'>90 min</span>
                            </div>
                            <div className='flex flex-col items-center gap-2'>
                                {renderProgress()}
                            </div>
                            <div className='flex flex-col items-start ml-4 text-start max-h-[364px] w-[275px]'>
                                {[...Array(4)].map((_, i) => {
                                    const marginTop = [6, 8, 10, 12][i];
                                    const titles = [
                                        "Transition zone",
                                        "Focus zone",
                                        "Deep work zone",
                                        "Fatigue zone"
                                    ];
                                    const descriptions = [
                                        "Just getting started - your focus might bounce around a bit.",
                                        "You're settings in. It's easier to ignore distractions now.",
                                        "You're locked in and working at your best.",
                                        "You're getting tired, and it's harder to stay focused."
                                    ];
                                    return (
                                        <div className={`mt-${marginTop}`} key={i}>
                                            <h2 className='text-zinc-300 text-sm font-medium'>{titles[i]}</h2>
                                            <p className='text-sm text-[#5A5A5A] max-w-xs'>{descriptions[i]}</p>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
                {screen === "reflection" && (
                    <ReflectionScreen
                        task={task}
                        minutes={minutesWorked}
                        notes={notes}
                        setNotes={setNotes}
                        onFinish={finishSession}
                        onCancel={cancelSession}
                    />
                )}
            </>
        );
    }

    if (screen === "summary") {
        const today = new Date().toISOString().split("T")[0];

        const baseMinutes = sessions.reduce((acc, session) => {
            const sessionDate = new Date(session.startTime).toISOString().split("T")[0];
            if (sessionDate === today && session.startTime !== startTime) {
                return acc + Math.round(session.duration / 1000 / 60);
            }
            return acc;
        }, 0);

        return (
            <SummaryScreen
                sessionsTime={{ [today]: baseMinutes }}
                addedMinutes={minutesWorked} // minutos da sessão atual
                onComplete={() => {
                    resetSession();
                    setScreen("history");
                    setView?.("history");
                }}
            />
        );
    }

    if (screen === "history" || view === "history") {
        return <History sessions={sessions} />;
    }

    return <p>Loading...</p>;
}
