import React, { ReactNode } from "react";

interface TooltipProps {
    children: ReactNode; // texto do tooltip
    date: string; // elemento que terá o tooltip
    count: string;
}

export default function Tooltip({ date, count, children }: TooltipProps) {
    return (
        <div className="relative group inline-block">
            {children}
            <div
                className="
          absolute
          bottom-full
          left-1/2
          transform -translate-x-1/2
          mb-2
          w-max
          max-w-xs
          bg-stone-900
          text-white
          text-xs
          rounded
          px-2
          py-1
          opacity-0
          pointer-events-none
          group-hover:opacity-100
          transition-opacity duration-200
          whitespace-nowrap
          z-50
        "
            >
                <div className='flex flex-col items-center justify-center font-mono'>
                    <span className='font-medium'>{date}</span>
                    <span>{count}</span>
                </div>
            </div>
        </div>
    );
}
