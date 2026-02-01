import React, { useState } from 'react';
import type { ActivityLog } from '../lib/store';
import { TEAM_MEMBERS } from '../data/team';
import { X, Trash2, Edit2, Save, RotateCcw } from 'lucide-react';
import { format } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';

interface DailyLogModalProps {
    date: Date | null;
    logs: ActivityLog[];
    onClose: () => void;
    onUpdateLog: (log: ActivityLog) => void;
    onDeleteLog: (id: string) => void;
}

export const DailyLogModal: React.FC<DailyLogModalProps> = ({ date, logs, onClose, onUpdateLog, onDeleteLog }) => {
    if (!date) return null;

    const [editingId, setEditingId] = useState<string | null>(null);
    const [editSteps, setEditSteps] = useState<string>('');

    const handleEdit = (log: ActivityLog) => {
        setEditingId(log.id);
        setEditSteps(log.steps.toString());
    };

    const handleSave = (log: ActivityLog) => {
        const steps = parseInt(editSteps);
        if (!isNaN(steps) && steps > 0) {
            onUpdateLog({ ...log, steps });
            setEditingId(null);
        }
    };

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm" onClick={onClose}>
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-slate-900 border border-slate-700 w-full max-w-md rounded-bento overflow-hidden shadow-2xl relative"
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="p-6 border-b border-slate-800 flex justify-between items-center">
                        <div>
                            <h2 className="text-xl font-bold text-white">Ops Log</h2>
                            <p className="text-sm text-slate-400 font-mono">{format(date, 'MMMM d, yyyy')}</p>
                        </div>
                        <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-full transition-colors text-slate-400">
                            <X size={20} />
                        </button>
                    </div>

                    <div className="p-6 max-h-[60vh] overflow-y-auto space-y-4">
                        {logs.length === 0 ? (
                            <div className="text-center py-8 text-slate-500 italic">No activity recorded for this date.</div>
                        ) : (
                            logs.map(log => {
                                const member = TEAM_MEMBERS.find((m: any) => m.id === log.memberId);
                                if (!member) return null;
                                const isEditing = editingId === log.id;

                                return (
                                    <div key={log.id} className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/50 flex items-center justify-between gap-4">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${member.color} text-white shrink-0`}>
                                                {member.avatar}
                                            </div>
                                            <div>
                                                <div className="font-bold text-white">{member.name}</div>
                                                <div className="text-xs text-slate-400 font-mono">
                                                    {format(new Date(log.date), 'HH:mm')} hrs
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3">
                                            {isEditing ? (
                                                <div className="flex items-center gap-2">
                                                    <input
                                                        type="number"
                                                        value={editSteps}
                                                        onChange={(e) => setEditSteps(e.target.value)}
                                                        className="w-20 bg-slate-950 border border-slate-700 rounded px-2 py-1 text-white font-mono text-sm"
                                                        autoFocus
                                                    />
                                                    <button onClick={() => handleSave(log)} className="text-emerald-400 hover:text-emerald-300 p-1">
                                                        <Save size={16} />
                                                    </button>
                                                    <button onClick={() => setEditingId(null)} className="text-slate-400 hover:text-white p-1">
                                                        <RotateCcw size={16} />
                                                    </button>
                                                </div>
                                            ) : (
                                                <div className="text-right">
                                                    <div className="font-mono text-lg font-bold text-white tabular-nums">{log.steps.toLocaleString()}</div>
                                                    <div className="text-[10px] text-slate-500">STEPS</div>
                                                </div>
                                            )}

                                            {!isEditing && (
                                                <div className="flex gap-1 ml-2 pl-2 border-l border-slate-700">
                                                    <button onClick={() => handleEdit(log)} className="text-blue-400 hover:bg-blue-900/30 p-1.5 rounded transition-colors">
                                                        <Edit2 size={14} />
                                                    </button>
                                                    <button onClick={() => {
                                                        if (confirm('Confirm deletion of flight record?')) onDeleteLog(log.id);
                                                    }} className="text-rose-400 hover:bg-rose-900/30 p-1.5 rounded transition-colors">
                                                        <Trash2 size={14} />
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};
