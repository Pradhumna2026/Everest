import React from 'react';
import type { Milestone } from '../data/milestones';
import { X, Satellite, MapPin } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface MilestoneModalProps {
    milestone: Milestone | null;
    onClose: () => void;
}

export const MilestoneModal: React.FC<MilestoneModalProps> = ({ milestone, onClose }) => {
    if (!milestone) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm" onClick={onClose}>
                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    className="bg-slate-900 border border-slate-700 w-full max-w-lg rounded-bento overflow-hidden shadow-2xl relative"
                    onClick={(e) => e.stopPropagation()}
                >
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-slate-800/50 hover:bg-slate-700 text-white transition-colors"
                    >
                        <X size={18} />
                    </button>

                    <div className="h-64 bg-slate-800 relative group overflow-hidden">
                        {/* Placeholder for Dynamic Imagery */}
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-500 gap-2">
                            <Satellite size={48} className="opacity-50" />
                            <span className="text-xs uppercase tracking-widest opacity-50">Satellite Feed Offline</span>
                        </div>
                        {/* In a real app, this would be the generated image */}
                        <img
                            src={`https://placehold.co/600x400/0f172a/3b82f6?text=${encodeURIComponent(milestone.name)}`}
                            alt={milestone.name}
                            className="absolute inset-0 w-full h-full object-cover opacity-80 mix-blend-overlay"
                        />
                        <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-slate-900 to-transparent">
                            <div className="flex items-center gap-2 text-primary font-mono text-xs mb-1">
                                <MapPin size={12} />
                                <span>COORD: {milestone.coordinates.x.toFixed(2)}, {milestone.coordinates.y.toFixed(2)}</span>
                            </div>
                            <h2 className="text-3xl font-black text-white">{milestone.name}</h2>
                            <p className="text-emerald-400 font-bold">{milestone.elevation}m</p>
                        </div>
                    </div>

                    <div className="p-6">
                        <p className="text-slate-300 leading-relaxed font-light mb-6">
                            {milestone.description}
                        </p>

                        <div className="flex gap-4">
                            <button className="flex-1 bg-slate-800 hover:bg-slate-700 text-white py-3 rounded-lg text-sm font-bold transition-colors">
                                RECON INFO
                            </button>
                            <button className="flex-1 border border-blue-500/30 text-blue-400 hover:bg-blue-500/10 py-3 rounded-lg text-sm font-bold transition-colors">
                                3D TERRAIN
                            </button>
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};
