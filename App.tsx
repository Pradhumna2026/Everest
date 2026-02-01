import { useState } from 'react';
import { useStore } from './lib/store';
import { EverestPath } from './components/EverestPath';
import { ActivityLogger } from './components/ActivityLogger';
import { TeamStats } from './components/TeamStats';
import { ConsistencyGrid } from './components/ConsistencyGrid';
import { SummitStatus } from './components/SummitStatus';
import { DynamicSync } from './components/DynamicSync';
import { MilestoneModal } from './components/MilestoneModal';
import { DailyLogModal } from './components/DailyLogModal';
import type { Milestone } from './data/milestones';
import { Satellite, ShieldCheck } from 'lucide-react';
import { isSameDay } from 'date-fns';

function App() {
  const { logs, loading, online, currentElevation, addLog, updateLog, deleteLog } = useStore();
  const [selectedMilestone, setSelectedMilestone] = useState<Milestone | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-blue-500">
        <Satellite size={64} className="animate-spin mb-4" />
        <div className="text-xl font-mono tracking-widest animate-pulse">ESTABLISHING UPLINK...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white p-4 md:p-8 font-sans selection:bg-blue-500/30">

      {/* Header */}
      <header className="max-w-7xl mx-auto mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="p-2 bg-blue-600 rounded-lg shadow-[0_0_15px_rgba(37,99,235,0.5)]">
              <ShieldCheck size={24} className="text-white" />
            </div>
            <h1 className="text-3xl md:text-4xl font-black tracking-tight text-white">
              PROJECT <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">EVEREST</span>
            </h1>
          </div>
          <p className="text-slate-400 font-mono text-xs tracking-[0.2em] uppercase pl-1">
            Vertical Expedition Command Center
          </p>
        </div>
        <DynamicSync online={online} />
      </header>

      <main className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* Hero Section: Map & Status */}
        <section className="lg:col-span-8 flex flex-col gap-6">
          <EverestPath currentElevation={currentElevation} onMilestoneClick={setSelectedMilestone} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <SummitStatus currentElevation={currentElevation} />
            <ConsistencyGrid logs={logs} onDateClick={setSelectedDate} />
          </div>
        </section>

        {/* Sidebar: Stats & Logger */}
        <section className="lg:col-span-4 flex flex-col gap-6">
          <ActivityLogger onLogStep={(memberId, steps, date) => addLog(memberId, steps, date)} />
          <TeamStats logs={logs} />
        </section>

      </main>

      {/* Modals */}
      <MilestoneModal milestone={selectedMilestone} onClose={() => setSelectedMilestone(null)} />

      <DailyLogModal
        date={selectedDate}
        logs={selectedDate ? logs.filter(l => isSameDay(new Date(l.date), selectedDate)) : []}
        onClose={() => setSelectedDate(null)}
        onUpdateLog={updateLog}
        onDeleteLog={deleteLog}
      />

      {/* Footer */}
      <footer className="max-w-7xl mx-auto mt-12 py-8 border-t border-slate-800 text-center">
        <p className="text-slate-600 text-xs font-mono">
          SYSTEM STATUS: NOMINAL • ELEVATION DATA: SCALED 1:100 • SECURE CONNECTION
        </p>
      </footer>
    </div>
  );
}

export default App;
