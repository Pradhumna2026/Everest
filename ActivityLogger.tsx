import React, { useState } from 'react';
import { PIN_CODE, TEAM_MEMBERS } from '../data/team';
import { Lock, Unlock, Send, Activity } from 'lucide-react';

interface ActivityLoggerProps {
    onLogStep: (memberId: string, steps: number, date: string) => void;
}

export const ActivityLogger: React.FC<ActivityLoggerProps> = ({ onLogStep }) => {
    const [pin, setPin] = useState('');
    const [unlocked, setUnlocked] = useState(false);
    const [selectedMember, setSelectedMember] = useState(TEAM_MEMBERS[0].id);
    const [steps, setSteps] = useState('');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [time, setTime] = useState(new Date().toTimeString().slice(0, 5));
    const [error, setError] = useState('');

    const handleUnlock = (e: React.FormEvent) => {
        e.preventDefault();
        if (pin === PIN_CODE) {
            setUnlocked(true);
            setError('');
        } else {
            setError('Access Denied: Invalid Security Code');
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const stepCount = parseInt(steps);
        if (isNaN(stepCount) || stepCount <= 0) {
            setError('Invalid vertical yield data.');
            return;
        }

        // Combine date and time
        try {
            const combinedDate = new Date(`${date}T${time}:00`).toISOString();
            onLogStep(selectedMember, stepCount, combinedDate);
            setSteps('');
            setError('');
        } catch (e) {
            setError('Invalid date/time configuration.');
        }
    };

    if (!unlocked) {
        return (
            <div className="glass-panel p-6 rounded-bento text-center relative overflow-hidden group">
                <div className="absolute inset-0 bg-slate-900/80 z-10 flex flex-col items-center justify-center p-6 backdrop-blur-sm">
                    <div className="bg-slate-800 p-4 rounded-full mb-4 text-slate-400 group-hover:text-primary transition-colors">
                        <Lock size={32} />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">Restricted Access</h3>
                    <p className="text-slate-400 text-sm mb-6">Enter Mission Control Authorization Code to log activity data.</p>

                    <form onSubmit={handleUnlock} className="w-full max-w-xs">
                        <input
                            type="password"
                            value={pin}
                            onChange={(e) => setPin(e.target.value)}
                            placeholder="ENTER PIN (8848)"
                            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-center text-white font-mono tracking-widest focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary mb-3"
                            autoFocus
                        />
                        {error && <p className="text-rose-500 text-xs mb-3 font-bold">{error}</p>}
                        <button
                            type="submit"
                            className="w-full bg-primary hover:bg-blue-600 text-white font-bold py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
                        >
                            <Unlock size={18} /> Authenticate
                        </button>
                    </form>
                </div>
                {/* Background decoration */}
                <div className="opacity-20 blur-sm pointer-events-none">
                    <div className="h-8 bg-slate-700 w-full mb-4 rounded"></div>
                    <div className="h-24 bg-slate-700 w-full mb-4 rounded"></div>
                    <button className="h-10 bg-blue-900 w-full rounded"></button>
                </div>
            </div>
        );
    }

    return (
        <div className="glass-panel p-6 rounded-bento">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <Activity className="text-primary" />
                    Data Entry
                </h2>
                <button
                    onClick={() => { setUnlocked(false); setPin(''); }}
                    className="text-slate-400 hover:text-white text-xs uppercase tracking-wider flex items-center gap-1"
                >
                    <Lock size={12} /> Lock
                </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-xs text-slate-400 uppercase tracking-widest mb-2">Operative</label>
                    <div className="grid grid-cols-2 gap-2">
                        {TEAM_MEMBERS.map(member => (
                            <button
                                key={member.id}
                                type="button"
                                onClick={() => setSelectedMember(member.id)}
                                className={`flex items-center gap-2 p-2 rounded-lg border transition-all ${selectedMember === member.id
                                        ? 'bg-blue-500/20 border-blue-500 text-white'
                                        : 'bg-slate-800/50 border-transparent text-slate-400 hover:bg-slate-800'
                                    }`}
                            >
                                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${member.color} text-white`}>
                                    {member.avatar}
                                </div>
                                <span className="text-sm font-medium">{member.name}</span>
                            </button>
                        ))}
                    </div>
                </div>

                <div>
                    <label className="block text-xs text-slate-400 uppercase tracking-widest mb-2">Vertical Yield (Steps)</label>
                    <div className="relative">
                        <input
                            type="number"
                            value={steps}
                            onChange={(e) => setSteps(e.target.value)}
                            placeholder="0"
                            className="w-full bg-slate-950 border border-slate-700 rounded-lg py-3 pl-4 pr-12 text-white font-mono focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                        />
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 text-xs">
                            STEPS
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs text-slate-400 uppercase tracking-widest mb-2">Ops Date</label>
                        <input
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            max={new Date().toISOString().split('T')[0]}
                            className="w-full bg-slate-950 border border-slate-700 rounded-lg py-2 px-3 text-white font-mono text-sm focus:border-primary focus:outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-xs text-slate-400 uppercase tracking-widest mb-2">Ops Time</label>
                        <input
                            type="time"
                            value={time}
                            onChange={(e) => setTime(e.target.value)}
                            className="w-full bg-slate-950 border border-slate-700 rounded-lg py-2 px-3 text-white font-mono text-sm focus:border-primary focus:outline-none"
                        />
                    </div>
                </div>

                {error && <p className="text-rose-500 text-xs font-bold">{error}</p>}

                <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold py-3 rounded-lg shadow-lg shadow-blue-500/20 transition-all flex items-center justify-center gap-2"
                >
                    <Send size={18} /> Upload Data
                </button>

                <div className="text-center text-[10px] text-slate-500 font-mono mt-2">
                    SESSION ID: {Math.random().toString(36).substr(2, 9).toUpperCase()}
                </div>
            </form>
        </div>
    );
};
