import React, { useState } from 'react';
import { MemoryRouter, Routes, Route, NavLink, useLocation } from 'react-router-dom';
import { 
  BookOpen, 
  GitGraph, 
  Layers, 
  LayoutDashboard, 
  Settings, 
  Menu,
  X,
  ChevronRight,
  ChevronDown
} from 'lucide-react';
import DependencyGraph from './components/DependencyGraph';
import StoryboardGen from './components/StoryboardGen';
import { PLAYBOOK_DATA } from './constants';
import { Phase } from './types';

// Components
const SidebarItem = ({ to, icon: Icon, label }: { to: string, icon: any, label: string }) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  return (
    <NavLink 
      to={to} 
      className={`group flex items-center gap-3 px-3 py-2 rounded-lg transition-all ${
        isActive 
          ? 'bg-blue-600/10 text-blue-400 border border-blue-600/20' 
          : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
      }`}
    >
      <Icon className={`w-5 h-5 ${isActive ? 'text-blue-400' : 'text-slate-500 group-hover:text-slate-300'}`} />
      <span className="font-medium text-sm">{label}</span>
    </NavLink>
  );
};

const PlaybookView: React.FC = () => {
    const [expandedPhase, setExpandedPhase] = useState<number | null>(1);

    return (
        <div className="h-full overflow-y-auto p-8 bg-slate-900">
            <div className="max-w-4xl mx-auto">
                <header className="mb-12 border-b border-slate-800 pb-8">
                    <h1 className="text-4xl font-bold text-white mb-4">Meta-AI Playbook</h1>
                    <p className="text-lg text-slate-400 leading-relaxed">
                        The systematic approach, interdependencies, and operational guidelines for transforming abstract ideas into clear, insightful visual narratives.
                    </p>
                </header>

                <div className="space-y-6">
                    {PLAYBOOK_DATA.map((phase: Phase) => (
                        <div key={phase.id} className="bg-slate-800/40 border border-slate-700/50 rounded-xl overflow-hidden transition-all duration-300 hover:border-slate-600">
                            <button 
                                onClick={() => setExpandedPhase(expandedPhase === phase.id ? null : phase.id)}
                                className="w-full flex items-center justify-between p-6 text-left cursor-pointer focus:outline-none"
                            >
                                <div>
                                    <span className="text-xs font-bold text-blue-500 tracking-wider uppercase mb-1 block">Phase {phase.id}</span>
                                    <h2 className="text-xl font-semibold text-white">{phase.title}</h2>
                                    <p className="text-slate-400 text-sm mt-1">{phase.description}</p>
                                </div>
                                {expandedPhase === phase.id ? <ChevronDown className="text-slate-400"/> : <ChevronRight className="text-slate-600"/>}
                            </button>
                            
                            {expandedPhase === phase.id && (
                                <div className="px-6 pb-6 bg-slate-800/20 border-t border-slate-700/50 animate-fade-in">
                                    <div className="grid gap-4 mt-4">
                                        {phase.steps.map((step) => (
                                            <div key={step.id} className="flex gap-4 p-4 rounded-lg hover:bg-slate-700/30 transition-colors group">
                                                <div className="flex-shrink-0 w-12 pt-1">
                                                    <span className="font-mono text-sm text-blue-400 font-bold">{step.id}</span>
                                                </div>
                                                <div>
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <h3 className="font-medium text-slate-200">{step.title}</h3>
                                                        <span className="text-[10px] bg-slate-700 text-slate-400 px-1.5 py-0.5 rounded border border-slate-600">
                                                            {step.refId}
                                                        </span>
                                                    </div>
                                                    <p className="text-sm text-slate-400 leading-relaxed">{step.description}</p>
                                                    {step.dependencies.length > 0 && (
                                                        <div className="mt-2 flex items-center gap-2">
                                                            <span className="text-[10px] text-slate-500 uppercase font-bold">Depends On:</span>
                                                            <div className="flex gap-1">
                                                                {step.dependencies.map(dep => (
                                                                    <span key={dep} className="text-[10px] bg-slate-800 text-slate-500 px-1 rounded border border-slate-700/50">
                                                                        {dep}
                                                                    </span>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

const DashboardView: React.FC = () => {
    return (
        <div className="h-full p-8 bg-slate-900 overflow-y-auto">
             <div className="max-w-5xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                     <div className="bg-gradient-to-br from-blue-900/40 to-slate-900 border border-blue-800/30 p-6 rounded-2xl">
                         <h3 className="text-slate-400 text-sm font-medium mb-2">Active Role</h3>
                         <div className="text-2xl font-bold text-white mb-1">Storyboard Creator</div>
                         <div className="text-blue-400 text-xs font-mono">ID 1 / Visual Narrator</div>
                     </div>
                     <div className="bg-slate-800/40 border border-slate-700 p-6 rounded-2xl">
                         <h3 className="text-slate-400 text-sm font-medium mb-2">System Status</h3>
                         <div className="flex items-center gap-2">
                            <span className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></span>
                            <div className="text-2xl font-bold text-white">Operational</div>
                         </div>
                         <div className="text-slate-500 text-xs font-mono mt-1">Integrity Check ID 15: PASS</div>
                     </div>
                     <div className="bg-slate-800/40 border border-slate-700 p-6 rounded-2xl">
                         <h3 className="text-slate-400 text-sm font-medium mb-2">Total Modules</h3>
                         <div className="text-2xl font-bold text-white">{PLAYBOOK_DATA.reduce((acc, curr) => acc + curr.steps.length, 0)}</div>
                         <div className="text-slate-500 text-xs font-mono mt-1">Operational Nodes</div>
                     </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-[500px]">
                    <div className="bg-slate-800/30 border border-slate-700 rounded-2xl p-6 flex flex-col">
                        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                            <GitGraph className="w-5 h-5 text-blue-500"/> Dependency Map
                        </h3>
                        <div className="flex-1 min-h-0 rounded-lg overflow-hidden border border-slate-700/50 bg-slate-900">
                             <DependencyGraph />
                        </div>
                    </div>
                     <div className="bg-slate-800/30 border border-slate-700 rounded-2xl p-6">
                        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                            <Layers className="w-5 h-5 text-purple-500"/> Operational Phases
                        </h3>
                        <div className="space-y-4">
                            {PLAYBOOK_DATA.map((phase, idx) => (
                                <div key={phase.id} className="relative pl-6 border-l-2 border-slate-700 pb-2 last:pb-0">
                                    <div className={`absolute -left-[9px] top-0 w-4 h-4 rounded-full border-2 ${idx === 2 ? 'border-blue-500 bg-blue-500/20' : 'border-slate-600 bg-slate-900'}`}></div>
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h4 className={`text-sm font-bold ${idx === 2 ? 'text-blue-400' : 'text-slate-300'}`}>Phase {phase.id}: {phase.title}</h4>
                                            <p className="text-xs text-slate-500 mt-1">{phase.description}</p>
                                        </div>
                                        <span className="text-xs font-mono text-slate-600 bg-slate-800 px-2 py-1 rounded">
                                            {phase.steps.length} Steps
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="mt-8 pt-6 border-t border-slate-700/50">
                            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Quick Actions</h4>
                            <div className="grid grid-cols-2 gap-3">
                                <NavLink to="/generator" className="block text-center bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold py-2 rounded transition-colors">
                                    New Storyboard (ID 20)
                                </NavLink>
                                <NavLink to="/playbook" className="block text-center bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs font-bold py-2 rounded transition-colors">
                                    View Protocols (ID 1)
                                </NavLink>
                            </div>
                        </div>
                    </div>
                </div>
             </div>
        </div>
    )
}

const App: React.FC = () => {
  return (
    <MemoryRouter>
      <div className="flex h-screen bg-slate-950 text-slate-200 font-sans selection:bg-blue-500/30">
        {/* Sidebar */}
        <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col flex-shrink-0 z-50">
          <div className="p-6 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
                <Layers className="text-white w-5 h-5" />
              </div>
              <div>
                <h1 className="font-bold text-white tracking-tight">Meta-AI</h1>
                <p className="text-[10px] text-slate-500 font-mono tracking-widest uppercase">Storyboard Creator</p>
              </div>
            </div>
          </div>

          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            <div className="mb-6">
                <p className="px-3 mb-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Platform</p>
                <SidebarItem to="/" icon={LayoutDashboard} label="Dashboard" />
                <SidebarItem to="/playbook" icon={BookOpen} label="Playbook Protocol" />
                <SidebarItem to="/graph" icon={GitGraph} label="Knowledge Graph" />
            </div>

            <div className="mb-6">
                <p className="px-3 mb-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Tools</p>
                <SidebarItem to="/generator" icon={Settings} label="Storyboard Gen (ID 20)" />
            </div>
          </nav>

          <div className="p-4 border-t border-slate-800">
            <div className="flex items-center gap-3 p-2 rounded-lg bg-slate-800/50 border border-slate-700/50">
              <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold text-slate-300">
                AI
              </div>
              <div className="overflow-hidden">
                <p className="text-xs font-medium text-white truncate">System Agent</p>
                <p className="text-[10px] text-emerald-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                  Connected
                </p>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 relative overflow-hidden bg-slate-950">
            <Routes>
                <Route path="/" element={<DashboardView />} />
                <Route path="/playbook" element={<PlaybookView />} />
                <Route path="/graph" element={<div className="h-full p-6"><DependencyGraph/></div>} />
                <Route path="/generator" element={<StoryboardGen />} />
            </Routes>
        </main>
      </div>
    </MemoryRouter>
  );
};

export default App;