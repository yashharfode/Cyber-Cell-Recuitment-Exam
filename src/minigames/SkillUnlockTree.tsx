import { useState } from 'react';
import { Lock, Unlock, CheckCircle2, ChevronRight, Sparkles } from 'lucide-react';

interface SkillNode {
  id: string;
  label: string;
  description: string;
  status: 'locked' | 'unlocked' | 'completed';
  xp: number;
}

interface SkillTrack {
  id: string;
  title: string;
  iconName: string;
  color: string;
  nodes: SkillNode[];
}

const SKILL_TRACKS: Record<string, SkillTrack> = {
  web: {
    id: 'web',
    title: 'WEB DEVELOPMENT PATH',
    iconName: 'Code2',
    color: 'border-cyan-400 text-cyan-400',
    nodes: [
      { id: 'web-1', label: 'HTML Semantics', description: 'Document hierarchy, forms, meta tags & accessible tags', status: 'completed', xp: 100 },
      { id: 'web-2', label: 'CSS Flexbox & Grid', description: 'Responsive layouts, positioning & aesthetic cyber styling', status: 'completed', xp: 150 },
      { id: 'web-3', label: 'JavaScript Reactivity', description: 'Event loops, async fetch, state mutation & callbacks', status: 'unlocked', xp: 200 },
      { id: 'web-4', label: 'DOM Security & Sanitization', description: 'Preventing client-side script injection & secure state', status: 'locked', xp: 250 },
      { id: 'web-5', label: 'Mini VS Code Project', description: 'Live coding reactive cyber incident badge with preview', status: 'locked', xp: 300 },
    ]
  },
  cyber: {
    id: 'cyber',
    title: 'CYBERSECURITY DEFENSE PATH',
    iconName: 'Shield',
    color: 'border-red-400 text-red-400',
    nodes: [
      { id: 'cyb-1', label: 'Security Awareness', description: 'Phishing deception triage & password entropy analysis', status: 'completed', xp: 100 },
      { id: 'cyb-2', label: 'Threat Anomaly Spotter', description: 'Detecting unusual auth timestamps and unauthorized root tokens', status: 'completed', xp: 150 },
      { id: 'cyb-3', label: 'SOC Terminal Investigation', description: 'Linux CLI forensics, log parsing and payload decoding', status: 'unlocked', xp: 200 },
      { id: 'cyb-4', label: 'Digital Detective Kill-Chain', description: 'Connecting multi-stage incident forensic artifacts', status: 'locked', xp: 250 },
      { id: 'cyb-5', label: 'Live Incident Containment', description: 'Applying perimeter firewall rules under active intrusion', status: 'locked', xp: 300 },
    ]
  },
  python: {
    id: 'python',
    title: 'PYTHON & SOFTWARE CRAFT PATH',
    iconName: 'Terminal',
    color: 'border-emerald-400 text-emerald-400',
    nodes: [
      { id: 'py-1', label: 'Core Syntax & Types', description: 'Conditionals, loops, list comprehensions & slices', status: 'completed', xp: 100 },
      { id: 'py-2', label: 'Algorithmic Flow', description: 'Ordering execution pipelines & deterministic branching', status: 'unlocked', xp: 150 },
      { id: 'py-3', label: 'Error Trapping & Debugging', description: 'Handling runtime exceptions & off-by-one errors', status: 'locked', xp: 200 },
      { id: 'py-4', label: 'File & Stream Processing', description: 'Parsing structured auth logs & regex token extraction', status: 'locked', xp: 250 },
      { id: 'py-5', label: 'Log Analysis Automation', description: 'Building autonomous cyber threat filtering script', status: 'locked', xp: 300 },
    ]
  },
  dsa: {
    id: 'dsa',
    title: 'ALGORITHMS & DATA STRUCTURES PATH',
    iconName: 'Network',
    color: 'border-purple-400 text-purple-400',
    nodes: [
      { id: 'dsa-1', label: 'Array & Pointer Logic', description: 'Linear traversal, two-pointer bounds & boundary edge cases', status: 'completed', xp: 100 },
      { id: 'dsa-2', label: 'Hash Maps & Sets', description: 'O(1) lookups, deduplication & frequency mapping', status: 'unlocked', xp: 150 },
      { id: 'dsa-3', label: 'Time & Space Complexity', description: 'Big-O asymptotic bounds & avoiding nested quadratic loops', status: 'locked', xp: 200 },
      { id: 'dsa-4', label: 'Search & Divide/Conquer', description: 'Binary search over sorted spaces & recursion depth', status: 'locked', xp: 250 },
      { id: 'dsa-5', label: 'Second-Largest Algorithm', description: 'Optimal single-pass O(N) array metric extraction', status: 'locked', xp: 300 },
    ]
  }
};

interface SkillUnlockTreeProps {
  initialTrack?: string;
}

export default function SkillUnlockTree({ initialTrack = 'cyber' }: SkillUnlockTreeProps) {
  const [activeTrackKey, setActiveTrackKey] = useState<string>(initialTrack);

  const activeTrack = SKILL_TRACKS[activeTrackKey] || SKILL_TRACKS.cyber;

  return (
    <div className="bg-[#080C14] border border-cyber-primary/30 p-5 rounded-lg font-mono-cyber">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 mb-4 border-b border-cyber-border">
        <div>
          <span className="text-[10px] text-cyber-primary uppercase tracking-widest px-2 py-0.5 bg-cyber-primary/10 border border-cyber-primary/30 rounded flex items-center gap-1.5 w-max">
            <Sparkles className="w-3 h-3" /> TACTICAL SKILL TREE
          </span>
          <h3 className="text-base font-bold text-white mt-1">PROGRESSION & DOMAIN UNLOCK MATRIX</h3>
          <p className="text-xs text-cyber-muted mt-0.5">
            Demonstrating foundational competency dynamically unlocks higher-tier challenge tiers and live labs.
          </p>
        </div>

        {/* Track Switcher */}
        <div className="flex flex-wrap gap-1.5">
          {Object.entries(SKILL_TRACKS).map(([key]) => {
            const isSelected = activeTrackKey === key;
            return (
              <button
                key={key}
                onClick={() => setActiveTrackKey(key)}
                className={`px-3 py-1.5 rounded text-xs font-bold uppercase transition-all border ${
                  isSelected
                    ? 'bg-cyber-primary/20 text-cyber-primary border-cyber-primary'
                    : 'bg-white/5 text-cyber-muted border-white/10 hover:border-white/30'
                }`}
              >
                {key}
              </button>
            );
          })}
        </div>
      </div>

      {/* Visual Roadmap Path */}
      <div className="space-y-3 my-4">
        {activeTrack.nodes.map((node, index) => {
          const isCompleted = node.status === 'completed';
          const isUnlocked = node.status === 'unlocked';
          const isLocked = node.status === 'locked';

          return (
            <div
              key={node.id}
              className={`p-4 rounded-lg border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                isCompleted
                  ? 'border-cyber-success/50 bg-cyber-success/5 text-white'
                  : isUnlocked
                  ? 'border-cyber-primary bg-cyber-primary/10 text-white shadow-[0_0_15px_rgba(0,255,204,0.12)]'
                  : 'border-white/5 bg-[#05080F] text-cyber-muted opacity-60'
              }`}
            >
              <div className="flex items-center gap-3">
                {/* Node Status Badge */}
                <div className={`w-8 h-8 rounded flex items-center justify-center font-bold text-xs shrink-0 ${
                  isCompleted
                    ? 'bg-cyber-success/20 text-cyber-success border border-cyber-success'
                    : isUnlocked
                    ? 'bg-cyber-primary text-black font-extrabold shadow-[0_0_10px_#00ffcc]'
                    : 'bg-black/50 text-cyber-muted border border-white/10'
                }`}>
                  {isCompleted ? (
                    <CheckCircle2 className="w-4 h-4" />
                  ) : isUnlocked ? (
                    <Unlock className="w-4 h-4" />
                  ) : (
                    <Lock className="w-4 h-4" />
                  )}
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-cyber-muted">
                      TIER {index + 1} • {node.status.toUpperCase()}
                    </span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-white/10 text-cyber-primary font-bold">
                      +{node.xp} XP
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-white mt-0.5">{node.label}</h4>
                  <p className="text-xs text-slate-300 mt-0.5">{node.description}</p>
                </div>
              </div>

              {/* Status Action Indicator */}
              <div className="shrink-0 flex items-center gap-2">
                {isCompleted && (
                  <span className="text-xs font-bold text-cyber-success uppercase tracking-wider flex items-center gap-1">
                    Mastered <CheckCircle2 className="w-3.5 h-3.5" />
                  </span>
                )}
                {isUnlocked && (
                  <span className="text-xs font-bold text-cyber-primary uppercase tracking-wider animate-pulse flex items-center gap-1">
                    Active Challenge <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                )}
                {isLocked && (
                  <span className="text-xs text-cyber-muted uppercase tracking-wider flex items-center gap-1">
                    Prerequisite Required <Lock className="w-3 h-3" />
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
