import { eachDayOfInterval, format, subMonths } from 'date-fns';
import Tooltip from "./tooltip";

export type SessionsMap = Record<string, number>;

const getColor = (minutes: number) => {
    if (minutes >= 240) return 'bg-white';
    if (minutes >= 180) return 'bg-zinc-300';
    if (minutes >= 120) return 'bg-zinc-600';
    if (minutes >= 60) return 'bg-zinc-800';
    return 'bg-zinc-900';
}

export default function HeatMap({ sessions }: { sessions: SessionsMap }) {
    const today = new Date();
    const startDate = subMonths(today, 6);

    const days = eachDayOfInterval({
        start: startDate,
        end: today
    });

    const columns: Date[][] = []

    for (let i = 0; i < days.length; i += 7) {
        columns.push(days.slice(i, i + 7));
    }

    return (
        <div className='flex flex-col items-center mt-12'>
            <div className='flex gap-[3px]'>
                {columns.map((week, i) => (
                    <div key={i} className='flex flex-col gap-[3px]'>
                        {week.map((date) => {
                            const dateKey = format(date, 'yyyy-MM-dd');
                            const count = sessions[dateKey] || 0;
                            return (
                                <Tooltip date={`${format(date, "MMM dd (EEE)")}`} count={`${count} minutes`}>
                                <div
                                        className={`w-3.5 h-3.5 rounded-sm ${getColor(count)}`}
                                    />
                                </Tooltip>
                            );
                        })}
                    </div>
                ))}
            </div>
            <p className='text-[#5A5A5A] text-sm text-center mt-2'>Sessions in the last 6 months</p>
        </div>
    );
}