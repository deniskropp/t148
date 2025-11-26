import React, { useState } from 'react';
import { generateStoryboardFromConcept, refineSceneWithAI } from '../services/geminiService';
import { StoryboardScene } from '../types';
import { Loader2, Clapperboard, Sparkles, RefreshCcw, Save } from 'lucide-react';

const StoryboardGen: React.FC = () => {
  const [concept, setConcept] = useState('');
  const [scenes, setScenes] = useState<StoryboardScene[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editingScene, setEditingScene] = useState<number | null>(null);
  const [refinementInstruction, setRefinementInstruction] = useState('');
  const [refining, setRefining] = useState(false);

  const handleGenerate = async () => {
    if (!concept.trim()) return;
    setLoading(true);
    setError(null);
    setScenes([]);
    
    try {
      const generatedScenes = await generateStoryboardFromConcept(concept);
      setScenes(generatedScenes);
    } catch (err: any) {
      setError(err.message || "Failed to generate storyboard. Check API Key.");
    } finally {
      setLoading(false);
    }
  };

  const handleRefineScene = async (scene: StoryboardScene) => {
      if(!refinementInstruction.trim()) return;
      setRefining(true);
      try {
          const updatedScene = await refineSceneWithAI(scene, refinementInstruction);
          const newScenes = scenes.map(s => s.sceneNumber === updatedScene.sceneNumber ? updatedScene : s);
          setScenes(newScenes);
          setEditingScene(null);
          setRefinementInstruction('');
      } catch (err) {
          console.error(err);
      } finally {
          setRefining(false);
      }
  }

  return (
    <div className="flex flex-col h-full bg-slate-900 overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-slate-800 bg-slate-900/50 backdrop-blur-sm sticky top-0 z-20">
        <div className="flex items-center gap-3 mb-2">
          <Clapperboard className="w-6 h-6 text-blue-500" />
          <h2 className="text-2xl font-bold text-white">Storyboard Generator (ID 20)</h2>
        </div>
        <p className="text-slate-400 max-w-2xl">
          Enter a concept to operationalize Phase 3 of the playbook. The system will utilize Gemini (ID 20) to generate visual narrative structures.
        </p>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Input Panel */}
        <div className="w-1/3 min-w-[350px] p-6 border-r border-slate-800 overflow-y-auto bg-slate-900">
          <label className="block text-sm font-semibold text-slate-300 mb-2">
            Operational Concept / Narrative Idea
          </label>
          <textarea
            className="w-full h-48 bg-slate-800 border border-slate-700 rounded-lg p-4 text-slate-100 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all resize-none mb-4"
            placeholder="E.g., Visualize the process of a human engineer collaborating with an AI agent to refine system prompts. Show the iterative cycle and the successful output."
            value={concept}
            onChange={(e) => setConcept(e.target.value)}
          />
          
          <button
            onClick={handleGenerate}
            disabled={loading || !concept.trim()}
            className={`w-full py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all ${
              loading || !concept.trim()
                ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-lg shadow-blue-500/20'
            }`}
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
            {loading ? 'Processing Protocol...' : 'Generate Storyboard'}
          </button>

          {error && (
            <div className="mt-4 p-4 bg-red-900/20 border border-red-800 rounded-lg text-red-200 text-sm">
              <strong>Error:</strong> {error}
            </div>
          )}

           {/* Guidelines Panel */}
           <div className="mt-8 p-4 bg-slate-800/50 rounded-lg border border-slate-700">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">System Protocols</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li className="flex items-start gap-2">
                <span className="text-blue-500 font-mono">ID 1</span> Defines Storyboard Creator role.
              </li>
               <li className="flex items-start gap-2">
                <span className="text-blue-500 font-mono">ID 3.1</span> Translates NL to formal structure.
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 font-mono">ID 20</span> Generates the visual narrative.
              </li>
            </ul>
          </div>
        </div>

        {/* Results Panel */}
        <div className="flex-1 bg-slate-950 p-6 overflow-y-auto">
          {scenes.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-600 opacity-60">
              <Clapperboard className="w-16 h-16 mb-4" />
              <p>Awaiting concept input for visualization...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 pb-20">
              {scenes.map((scene) => (
                <div key={scene.sceneNumber} className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden hover:border-slate-600 transition-colors group">
                  <div className="px-5 py-3 border-b border-slate-800 bg-slate-800/30 flex justify-between items-center">
                    <span className="font-mono text-xs font-bold text-blue-400 bg-blue-400/10 px-2 py-1 rounded">
                      SCENE {scene.sceneNumber.toString().padStart(2, '0')}
                    </span>
                    <h3 className="text-sm font-semibold text-white ml-2 flex-1 truncate">{scene.title}</h3>
                    <button 
                        onClick={() => setEditingScene(editingScene === scene.sceneNumber ? null : scene.sceneNumber)}
                        className="text-slate-500 hover:text-white transition-colors">
                        <RefreshCcw className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <div className="p-5 space-y-4">
                    <div>
                      <h4 className="text-xs font-bold text-slate-500 uppercase mb-1">Visual</h4>
                      <p className="text-sm text-slate-300 leading-relaxed font-light">{scene.visual}</p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <h4 className="text-xs font-bold text-slate-500 uppercase mb-1">Action</h4>
                            <p className="text-sm text-slate-400 italic">{scene.action}</p>
                        </div>
                        <div>
                             <h4 className="text-xs font-bold text-slate-500 uppercase mb-1">Audio/Dialogue</h4>
                             <p className="text-sm text-slate-400 font-serif border-l-2 border-slate-700 pl-3">
                                "{scene.dialogue}"
                             </p>
                        </div>
                    </div>
                    
                    {editingScene === scene.sceneNumber && (
                        <div className="mt-4 pt-4 border-t border-slate-700 animate-fade-in">
                            <label className="text-xs text-slate-400 block mb-2">Refinement Instruction (ID 1.5)</label>
                            <div className="flex gap-2">
                                <input 
                                    type="text" 
                                    className="flex-1 bg-slate-950 border border-slate-700 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                                    placeholder="e.g., Make the lighting more dramatic..."
                                    value={refinementInstruction}
                                    onChange={(e) => setRefinementInstruction(e.target.value)}
                                />
                                <button 
                                    onClick={() => handleRefineScene(scene)}
                                    disabled={refining}
                                    className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-500 disabled:opacity-50">
                                    {refining ? <Loader2 className="w-4 h-4 animate-spin"/> : <Save className="w-4 h-4"/>}
                                </button>
                            </div>
                        </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StoryboardGen;
