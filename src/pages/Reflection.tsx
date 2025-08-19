import React from "react";

interface ReflectionPageProps {
    task: string;
    notes: string;
    setNotes: (notes: string) => void;
    minutes: number;
    onFinish: () => void;
    onCancel: () => void;
}

export default function ReflectionPage({ task, notes, setNotes, onFinish, minutes, onCancel }: ReflectionPageProps) {
    return (
        <>
            <div className="fixed top-0 left-0 w-screen h-screen bg-black bg-opacity-50 z-9" />
            <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 mt-8 flex flex-1 flex-col items-center justify-center px-4 bg-black rounded-lg shadow-lg border-2 border-[#151515] z-10 mx-auto py-6 px-6">
                <div className="w-[455px] text-left flex flex-col gap-4 ">
                    <div>
                        <div className='flex items-center justify-between'>
                            <h2 className="text-xl text-white mb-1">{task}</h2>
                            <button onClick={onCancel} className='opacity-50 hover:opacity-70 transition-opacity'>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" color="#ffffff">
                                    <path xmlns="http://www.w3.org/2000/svg" d="M17.293 5.29295C17.6835 4.90243 18.3165 4.90243 18.707 5.29295C19.0976 5.68348 19.0976 6.31649 18.707 6.70702L13.4131 12L18.7061 17.293L18.7754 17.3691C19.0954 17.7619 19.0721 18.341 18.7061 18.707C18.3399 19.0731 17.7609 19.0958 17.3682 18.7754L17.292 18.707L11.999 13.414L6.70802 18.706C6.3175 19.0966 5.68449 19.0965 5.29396 18.706C4.90344 18.3155 4.90344 17.6825 5.29396 17.292L10.585 12L5.29298 6.70799L5.22462 6.63182C4.90423 6.23907 4.92691 5.66007 5.29298 5.29393C5.65897 4.92794 6.23811 4.9046 6.63087 5.22459L6.70705 5.29393L11.999 10.5859L17.293 5.29295Z" fill="currentColor"></path>
                                </svg>
                            </button>
                        </div>
                        <p className="text-zinc-500 text-sm mb-4">{minutes} minutes</p>
                    </div>
                    <div className='flex flex-col gap-4'>
                        <span className="text-[#5A5A5A] text-sm text-left max-w-md font-medium">
                            Writing a few notes can help you spot patterns, avoid repeating mistakes, and get better at focusing over time.
                        </span>
                        <textarea
                            className="w-full h-[175px] bg-[#101010] border-2 border-[#464646] rounded-lg text-sm text-zinc-300 px-3 py-2 placeholder:text-zinc-500 resize-none outline-4 outline-[#262626] focus-within:outline transition-all"
                            placeholder="Notes..."
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                        />
                    </div>
                    <div className='flex gap-3 items-center justify-end'>
                        <button
                            className="mt-5 px-3 py-2 text-sm font-base rounded-md bg-black hover:bg-[#141414] border border-[#1B1B1B] text-sm text-zinc-200 transition-all"
                            onClick={onCancel}
                        >
                            Cancel
                        </button>
                        <button
                            className="mt-5 px-3 py-2 text-sm font-base rounded-md bg-white text-black hover:bg-zinc-200 transition"
                            onClick={onFinish}
                        >
                            Finish session
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}