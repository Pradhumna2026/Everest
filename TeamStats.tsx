import React from 'react';
import { TEAM_MEMBERS } from '../data/team';
import type { ActivityLog } from '../lib/store';

interface TeamStatsProps {
    logs: ActivityLog[];
}

export const TeamStats: React.FC<TeamStatsProps> = ({ logs }) => {
    const totalSteps = logs.reduce((acc, log) => acc + log.steps, 0);

    const stats = TEAM_MEMBERS.map(member => {
        const memberSteps = logs
            .filter(l => l.memberId === member.id)
            .reduce((acc, l) => l.steps + acc, 0);

        const percentage = totalSteps > 0 ? (memberSteps / totalSteps) * 100 : 0;

        return {
            ...member,
            memberSteps,
            percentage
        };
    }).sort((a, b) => b.memberSteps - a.memberSteps);

    return (
        <div className="glass-panel p-6 rounded-bento h-full">
            <h2 className="text-xl font-bold text-white mb-6 uppercase tracking-wider">Squadron Performance</h2>

            <div className="space-y-6">
                {stats.map((member, index) => (
                    <div key={member.id}>
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-3">
                                <div className="text-xs font-mono text-slate-500 w-4">0{index + 1}</div>
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shadow-lg ${member.color} text-white`}>
                                    {member.avatar}
                                </div>
                                <div>
                                    <div className="text-sm font-bold text-white">{member.name}</div>
                                    <div className="text-[10px] text-slate-400 uppercase">{member.memberSteps.toLocaleString()} steps</div>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="text-sm font-bold text-white">{member.percentage.toFixed(1)}%</div>
                            </div>
                        </div>
                        <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                            <div
                                className={`h-full ${member.color} transition-all duration-1000`}
                                style={{ width: `${member.percentage}%` }}
                            />
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-8 pt-6 border-t border-slate-700/50">
                <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                        <div className="text-xs text-slate-400 uppercase">Total Steps</div>
                        <div className="text-2xl font-black text-white">{totalSteps.toLocaleString()}</div>
                    </div>
                    <div>
                        <div className="text-xs text-slate-400 uppercase">Avg / Member</div>
                        <div className="text-2xl font-black text-white">{(Math.round(totalSteps / 4)).toLocaleString()}</div>
                    </div>
                </div>
            </div>
        </div>
    );
};
