import React from 'react';
import { MILESTONES } from '../data/milestones';
import { Mountain, ArrowUp } from 'lucide-react';

interface SummitStatusProps {
    currentElevation: number;
}

export const SummitStatus: React.FC<SummitStatusProps> = ({ currentElevation }) => {
    const SUMMIT_ELEVATION = 8848;
    const remaining = SUMMIT_ELEVATION - currentElevation;
    const progress = Math.min((currentElevation / SUMMIT_ELEVATION) * 100, 100);

    const nextMilestone = MILESTONES.find(m => m.elevation > currentElevation);

    return (
        <div className="glass-panel p-6 rounded-bento relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10">
                <Mountain size={120} />
            </div>

            <h2 className="text-sm font-bold text-accent uppercase tracking-widest mb-1">Mission Objective</h2>
            <div className="text-4xl font-black text-white mb-4">
                {remaining > 0 ? (
                    <>
                        <span className="text-slate-500 text-2xl align-top mr-1">+</span>
                        {remaining}m
                    </>
                ) : (
                    <span className="text-emerald-400">SUMMIT REACHED</span>
                )}
            </div>

            <div className="space-y-4 relative z-10">
                <div>
                    <div className="flex justify-between text-xs text-slate-400 mb-1">
                        <span>Sea Level</span>
                        <span>Summit (8848m)</span>
                    </div>
                    <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-blue-600 to-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)]"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                </div>

                {nextMilestone && (
                    <div className="bg-slate-800/50 rounded-lg p-3 flex items-center gap-3 border border-slate-700/50">
                        <div className="p-2 bg-blue-500/10 rounded-full text-blue-400">
                            <ArrowUp size={18} />
                        </div>
                        <div>
                            <div className="text-xs text-slate-400">Next Waypoint</div>
                            <div className="font-bold text-white text-sm">{nextMilestone.name} <span className="text-slate-500">({nextMilestone.elevation}m)</span></div>
                        </div>
                        <div className="ml-auto text-xs font-mono text-slate-400">
                            {nextMilestone.elevation - currentElevation}m
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
