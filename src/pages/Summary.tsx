import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

function DigitScroller({ from, to, duration }: { from: number; to: number; duration: number }) {
    const [sequence, setSequence] = useState<number[]>([]);

    useEffect(() => {
        const seq = [];
        let current = from;
        if (from === to) {
            seq.push(from);
        } else {
            while (current !== to) {
                seq.push(current);
                current = (current + 1) % 10;
            }
            seq.push(to);
        }
        setSequence(seq);
    }, [from, to]);

    const targetIndex = sequence.indexOf(to);

    const animationY = `-${targetIndex * 3.75}em`;

    return (
        <div className="overflow-hidden h-[4em] inline-block">
            <motion.div
                initial={{ y: 0 }}
                animate={{ y: animationY }}
                transition={{ duration, ease: "easeInOut" }}
                className="flex flex-col"
            >
                {sequence.map((num, idx) => (
                    <div key={idx} className="text-6xl font-bold leading-none">
                        {num}
                    </div>
                ))}
            </motion.div>
        </div>
    );
}

export default function SummaryScreen({
                                          sessionsTime,
                                          addedMinutes,
                                          onComplete,
                                      }: {
    sessionsTime: Record<string, number>;
    addedMinutes: number;
    onComplete: () => void;
}) {
    const today = new Date().toISOString().split("T")[0];
    const todayMinutesBefore = sessionsTime[today] || 0;
    const todayMinutesAfter = todayMinutesBefore + addedMinutes;

    const [fromDigits, setFromDigits] = useState<number[]>([]);
    const [toDigits, setToDigits] = useState<number[]>([]);

    useEffect(() => {
        const fromStr = todayMinutesBefore.toString().padStart(2, "0");
        const toStr = todayMinutesAfter.toString().padStart(2, "0");
        setFromDigits(fromStr.split("").map(Number));
        setToDigits(toStr.split("").map(Number));

        const timeout = setTimeout(onComplete, 2000);
        return () => clearTimeout(timeout);
    }, [todayMinutesBefore, todayMinutesAfter, onComplete]);

    return (
        <div className="text-center text-white flex flex-col flex-1 items-center justify-center">
            <p className="text-lg text-gray-400 mb-2">Focused today</p>
            <div className="flex">
                {fromDigits.map((from, i) => (
                    <DigitScroller
                        key={i}
                        from={from}
                        to={toDigits[i] ?? 0}
                        duration={1}
                    />
                ))}
            </div>
        </div>
    );
}
