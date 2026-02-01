import React, { useMemo } from 'react';
import { MILESTONES } from '../data/milestones';
import type { Milestone } from '../data/milestones';
import { motion } from 'framer-motion';

interface EverestPathProps {
    currentElevation: number;
    onMilestoneClick: (milestone: Milestone) => void;
}

export const EverestPath: React.FC<EverestPathProps> = ({ currentElevation, onMilestoneClick }) => {
    // Determine current progress percentage relative to summit (8848m)
    // Map elevation to 0-100 range for visualization if we used a linear scale,
    // but we have specific coordinates for milestones.
    // simpler: Let's assume the path follows the milestone coordinates linearly.

    const lastReachedIndex = useMemo(() => {
        let index = -1;
        for (let i = 0; i < MILESTONES.length; i++) {
            if (currentElevation >= MILESTONES[i].elevation) {
                index = i;
            } else {
                break;
            }
        }
        return index;
    }, [currentElevation]);

    // Construct SVG path string
    const pathData = useMemo(() => {
        return MILESTONES.reduce((acc, m, i) => {
            return acc + (i === 0 ? `M ${m.coordinates.x} ${m.coordinates.y}` : ` L ${m.coordinates.x} ${m.coordinates.y}`);
        }, "");
    }, []);

    // Find current position on the line
    // If between milestones, interpolate
    const currentPosition = useMemo(() => {
        if (currentElevation >= 8848) return MILESTONES[MILESTONES.length - 1].coordinates;
        if (currentElevation < MILESTONES[0].elevation) return MILESTONES[0].coordinates;

        // Find which segment we are in
        // Filter milestones to find the two bounding current elevation
        // But milestones are not strictly linear in array index vs elevation always (though they should be sorted)
        // assuming sorted by elevation

        // Let's just find the next milestone
        const nextMilestoneIndex = MILESTONES.findIndex(m => m.elevation > currentElevation);
        if (nextMilestoneIndex === -1) return MILESTONES[MILESTONES.length - 1].coordinates; // Summit reached

        const prevMilestone = MILESTONES[nextMilestoneIndex - 1];
        const nextMilestone = MILESTONES[nextMilestoneIndex];

        // Interpolate
        const totalSegElevation = nextMilestone.elevation - prevMilestone.elevation;
        const progressInSeg = (currentElevation - prevMilestone.elevation) / totalSegElevation;

        const x = prevMilestone.coordinates.x + (nextMilestone.coordinates.x - prevMilestone.coordinates.x) * progressInSeg;
        const y = prevMilestone.coordinates.y + (nextMilestone.coordinates.y - prevMilestone.coordinates.y) * progressInSeg;

        return { x, y };

    }, [currentElevation]);


    return (
        <div className="relative w-full h-[300px] md:h-[400px] bg-slate-900/50 rounded-bento border border-slate-700 p-4 overflow-hidden">
            <h3 className="absolute top-4 left-6 text-xl text-primary font-bold z-10">
                Lhotse-Nuputse Route Visualizer
            </h3>

            <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                {/* Background Path (Grid) */}
                <path
                    d={pathData}
                    fill="none"
                    stroke="#1e293b"
                    strokeWidth="2"
                    strokeDasharray="4 4"
                />

                {/* Active Progress Path (Masked or partial? Complex with single path. 
                    Let's just draw the full path in dark and overlay active part? 
                    Actually, drawing only up to current position is harder with raw SVG path data string 
                    unless we calculate partial path. For now, let's just show the point moving.) 
                */}

                <path
                    d={pathData}
                    fill="none"
                    stroke="#3b82f6"
                    strokeWidth="1"
                    className="opacity-20"
                />

                {/* Milestones */}
                {MILESTONES.map((m, i) => {
                    const isReached = i <= lastReachedIndex;
                    return (
                        <g key={m.id} onClick={() => onMilestoneClick(m)} className="cursor-pointer group">
                            <circle
                                cx={m.coordinates.x}
                                cy={m.coordinates.y}
                                r={isReached ? 1.5 : 1}
                                className={`transition-all duration-300 ${isReached ? 'fill-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.8)]' : 'fill-slate-600 group-hover:fill-primary-glow'}`}
                            />
                            {/* Label? Too crowded. Maybe tooltip or on hover */}
                        </g>
                    )
                })}

                {/* Current Position Marker (Satellite Ping) */}
                <motion.circle
                    cx={currentPosition.x}
                    cy={currentPosition.y}
                    r={1}
                    fill="#3b82f6"
                    animate={{ r: [1, 3, 1], opacity: [1, 0.5, 1] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                />
                {/* Ping Ring */}
                <motion.circle
                    cx={currentPosition.x}
                    cy={currentPosition.y}
                    r={1}
                    fill="none"
                    stroke="#3b82f6"
                    strokeWidth={0.2}
                    animate={{ r: [1, 8], opacity: [0.8, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
                />
            </svg>

            {/* Stats Overlay */}
            <div className="absolute bottom-4 right-6 text-right">
                <div className="text-xs text-slate-400 uppercase tracking-widest">Current Altitude</div>
                <div className="text-3xl font-black text-white font-sans tabular-nums">{currentElevation}m</div>
            </div>
        </div>
    );
};
