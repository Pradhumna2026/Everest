import React from 'react';
import type { ActivityLog } from '../lib/store';
import { format, subDays, isSameDay } from 'date-fns';
import clsx from 'clsx';

interface ConsistencyGridProps {
    logs: ActivityLog[];
    onDateClick?: (date: Date) => void;
}

export const ConsistencyGrid: React.FC<ConsistencyGridProps> = ({ logs, onDateClick }) => {
    // Generate last 14 days
    const days = Array.from({ length: 14 }, (_, i) => subDays(new Date(), 13 - i));

    const getIntensity = (date: Date) => {
        const dailySteps = logs
            .filter(log => isSameDay(new Date(log.date), date))
            .reduce((acc, log) => acc + log.steps, 0);

        if (dailySteps === 0) return 'bg-slate-800';
        if (dailySteps < 5000) return 'bg-emerald-900';
        if (dailySteps < 10000) return 'bg-emerald-700';
        if (dailySteps < 15000) return 'bg-emerald-500';
        return 'bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.5)]';
    };

    return (
        <div className="glass-panel p-6 rounded-bento">
            <h2 className="text-xl font-bold text-white mb-4 uppercase tracking-wider">Ops Consistency</h2>

            <div className="grid grid-cols-7 gap-3">
                {days.map((date) => (
                    <button
                        key={date.toISOString()}
                        onClick={() => onDateClick?.(date)}
                        className="flex flex-col items-center gap-1 group focus:outline-none"
                    >
                        <div
                            className={clsx(
                                "w-full aspect-square rounded-md transition-all duration-500 border border-slate-700/50",
                                getIntensity(date),
                                "group-hover:scale-110 group-hover:border-blue-400 group-focus:ring-2 group-focus:ring-blue-500"
                            )}
                        />
                        <span className="text-[10px] text-slate-500 font-mono">{format(date, 'd')}</span>
                    </button>
                ))}
            </div>

            <div className="flex justify-end items-center gap-2 mt-4 text-[10px] text-slate-500 font-mono">
                <span>LESS</span>
                <div className="flex gap-1">
                    <div className="w-3 h-3 rounded-sm bg-slate-800"></div>
                    <div className="w-3 h-3 rounded-sm bg-emerald-900"></div>
                    <div className="w-3 h-3 rounded-sm bg-emerald-500"></div>
                    <div className="w-3 h-3 rounded-sm bg-emerald-400"></div>
                </div>
                <span>MORE</span>
            </div>
        </div>
    );
};
