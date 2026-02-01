import { useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from './supabase';
import { TEAM_MEMBERS } from '../data/team';

export interface ActivityLog {
    id: string;
    memberId: string;
    steps: number;
    date: string; // ISO string
    timestamp: number;
}

export interface AppState {
    logs: ActivityLog[];
    loading: boolean;
    online: boolean;
    totalSteps: number;
    currentElevation: number; // meters
}

const STEPS_PER_METER = 100;
const STORAGE_KEY = 'everest_logs';

export const useStore = () => {
    const [logs, setLogs] = useState<ActivityLog[]>([]);
    const [loading, setLoading] = useState(true);
    const [online, setOnline] = useState(false);

    // Derived state
    const totalSteps = logs.reduce((acc, log) => acc + log.steps, 0);
    const currentElevation = Math.floor(totalSteps / STEPS_PER_METER);

    useEffect(() => {
        const init = async () => {
            try {
                if (isSupabaseConfigured()) {
                    const { data, error } = await supabase
                        .from('logs')
                        .select('*')
                        .order('timestamp', { ascending: true });

                    if (!error && data) {
                        setLogs(data as ActivityLog[]);
                        setOnline(true);
                    } else {
                        console.warn('Supabase fetch failed, falling back to local', error);
                        loadLocal();
                    }
                } else {
                    loadLocal();
                }
            } catch (e) {
                console.error('Init error', e);
                loadLocal();
            } finally {
                setLoading(false);
            }
        };

        init();

        // Subscribe to realtime if online
        if (isSupabaseConfigured()) {
            const channel = supabase
                .channel('public:logs')
                .on('postgres_changes', { event: '*', schema: 'public', table: 'logs' }, (payload) => {
                    // Simple re-fetch or optimistically update. Re-fetch is safer for now.
                    // Ideally we handle INSERT/DELETE
                    if (payload.eventType === 'INSERT') {
                        setLogs(prev => [...prev, payload.new as ActivityLog]);
                    } else if (payload.eventType === 'DELETE') {
                        setLogs(prev => prev.filter(l => l.id !== payload.old.id));
                    }
                })
                .subscribe((status) => {
                    if (status === 'SUBSCRIBED') setOnline(true);
                });

            return () => {
                supabase.removeChannel(channel);
            };
        }
    }, []);

    const loadLocal = () => {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            setLogs(JSON.parse(stored));
        }
        setOnline(false);
    };

    const addLog = async (memberId: string, steps: number, date: string) => {
        const newLog: ActivityLog = {
            id: crypto.randomUUID(),
            memberId,
            steps,
            date,
            timestamp: new Date(date).getTime(),
        };

        if (isSupabaseConfigured() && online) {
            const { error } = await supabase.from('logs').insert([newLog]);
            if (error) {
                console.error('Supabase insert failed', error);
                saveLocal(newLog);
            }
        } else {
            saveLocal(newLog);
        }
    };

    const updateLog = async (updatedLog: ActivityLog) => {
        // Optimistic update
        setLogs(prev => prev.map(l => l.id === updatedLog.id ? updatedLog : l));

        if (isSupabaseConfigured() && online) {
            const { error } = await supabase.from('logs').update(updatedLog).eq('id', updatedLog.id);
            if (error) {
                console.error('Supabase update failed', error);
                // Revert on error? Or just warn. Warn for now.
            }
        } else {
            updateLocal(updatedLog);
        }
    };

    const deleteLog = async (id: string) => {
        // Optimistic update
        setLogs(prev => prev.filter(l => l.id !== id));

        if (isSupabaseConfigured() && online) {
            const { error } = await supabase.from('logs').delete().eq('id', id);
            if (error) {
                console.error('Supabase delete failed', error);
            }
        } else {
            deleteLocal(id);
        }
    };

    const saveLocal = (log: ActivityLog) => {
        const newLogs = [...logs, log];
        setLogs(newLogs);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newLogs));
    };

    const updateLocal = (updatedLog: ActivityLog) => {
        const newLogs = logs.map(l => l.id === updatedLog.id ? updatedLog : l);
        setLogs(newLogs);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newLogs));
    };

    const deleteLocal = (id: string) => {
        const newLogs = logs.filter(l => l.id !== id);
        setLogs(newLogs);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newLogs));
    };

    return {
        logs,
        loading,
        online,
        totalSteps,
        currentElevation,
        addLog,
        updateLog,
        deleteLog,
        teamMembers: TEAM_MEMBERS,
    };
};
