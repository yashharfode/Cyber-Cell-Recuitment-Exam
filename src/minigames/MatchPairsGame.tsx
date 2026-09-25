import { useState } from 'react';
import { Link2, CheckCircle2, RotateCcw } from 'lucide-react';

export interface MatchPairItem {
  id: string;
  left: string;
  right: string;
}

interface MatchPairsGameProps {
  config?: {
    pairs?: MatchPairItem[];
    prompt?: string;
  };
  onSolve?: (matches: Record<string, string>, isCorrect: boolean) => void;
  disabled?: boolean;
}

const DEFAULT_PAIRS: MatchPairItem[] = [
  { id: 'pair-1', left: 'DNS (Domain Name System)', right: 'Translates domain names to IP addresses' },
  { id: 'pair-2', left: 'RAM (Random Access Memory)', right: 'Stores volatile temporary working data for running programs' },
  { id: 'pair-3', left: 'Git', right: 'Tracks code changes and coordinates distributed version control' },
  { id: 'pair-4', left: 'CPU (Processor)', right: 'Fetches, decodes, and executes low-level instructions' },
  { id: 'pair-5', left: 'HTML (Hypertext Markup)', right: 'Defines the structural skeleton and elements of a webpage' },
  { id: 'pair-6', left: 'SQL', right: 'Manages and queries relational database tables' },
];

export default function MatchPairsGame({ config, onSolve, disabled }: MatchPairsGameProps) {
  const pairs = config?.pairs || DEFAULT_PAIRS;

  // Shuffled right items for candidate to match
  const [shuffledRights] = useState(() => {
    return [...pairs].sort(() => Math.random() - 0.5);
  });

  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
  const [matches, setMatches] = useState<Record<string, string>>({}); // leftId -> rightId
  const [isEvaluated, setIsEvaluated] = useState<boolean>(false);
  const [isAllCorrect, setIsAllCorrect] = useState<boolean>(false);

  const handleSelectLeft = (leftId: string) => {
    if (disabled || isEvaluated) return;
    if (matches[leftId]) {
      // Unpair if already paired
      const updated = { ...matches };
      delete updated[leftId];
      setMatches(updated);
      setSelectedLeft(null);
      return;
    }
    setSelectedLeft(leftId);
  };

  const handleSelectRight = (rightId: string) => {
    if (disabled || isEvaluated) return;
    if (!selectedLeft) return;

    // Check if this rightId was already assigned to another left
    const updated = { ...matches };
    for (const [lKey, rVal] of Object.entries(updated)) {
      if (rVal === rightId) {
        delete updated[lKey];
      }
    }

    updated[selectedLeft] = rightId;
    setMatches(updated);
    setSelectedLeft(null);

    // If all left items matched, evaluate
    if (Object.keys(updated).length === pairs.length) {
      const correct = pairs.every(pair => updated[pair.id] === pair.id);
      setIsAllCorrect(correct);
      setIsEvaluated(true);
      if (onSolve) {
        onSolve(updated, correct);
      }
    }
  };

  const handleReset = () => {
    if (disabled) return;
    setMatches({});
    setSelectedLeft(null);
    setIsEvaluated(false);
    setIsAllCorrect(false);
  };

  // Distinct cyber color borders for each matched pair
  const PAIR_COLORS = [
    'border-cyan-400 text-cyan-400 bg-cyan-400/10',
    'border-emerald-400 text-emerald-400 bg-emerald-400/10',
    'border-purple-400 text-purple-400 bg-purple-400/10',
    'border-amber-400 text-amber-400 bg-amber-400/10',
    'border-rose-400 text-rose-400 bg-rose-400/10',
    'border-indigo-400 text-indigo-400 bg-indigo-400/10',
  ];

  const getMatchIndex = (leftId: string) => {
    const keys = Object.keys(matches);
    return keys.indexOf(leftId);
  };

  const getRightMatchIndex = (rightId: string) => {
    for (const [leftId, rId] of Object.entries(matches)) {
      if (rId === rightId) {
        return Object.keys(matches).indexOf(leftId);
      }
    }
    return -1;
  };

  return (
    <div className="bg-[#080C14] border border-cyber-primary/30 p-5 rounded-lg font-mono-cyber">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 mb-4 border-b border-cyber-border">
        <div>
          <span className="text-[10px] text-cyber-info uppercase tracking-widest px-2 py-0.5 bg-cyber-info/10 border border-cyber-info/30 rounded">
            CONCEPT SYNCHRONIZATION
          </span>
          <h3 className="text-base font-bold text-white mt-1">MATCH TECHNICAL ENTITY WITH ITS CORE ROLE</h3>
          <p className="text-xs text-cyber-muted mt-0.5">
            Click an entity on the left, then click its corresponding definition on the right.
          </p>
        </div>
        <button
          onClick={handleReset}
          disabled={disabled}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-cyber-muted hover:text-white bg-white/5 hover:bg-white/10 rounded transition-all border border-white/10"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Clear Pairs
        </button>
      </div>

      {/* Columns Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-4">
        {/* Left Column: Entities */}
        <div className="space-y-2.5">
          <div className="text-[11px] font-bold text-cyber-primary uppercase tracking-wider mb-2 flex items-center justify-between">
            <span>Entity / Technology</span>
            <span className="text-cyber-muted font-normal text-[10px]">
              {Object.keys(matches).length} of {pairs.length} connected
            </span>
          </div>

          {pairs.map((item) => {
            const isSelected = selectedLeft === item.id;
            const matchIdx = getMatchIndex(item.id);
            const isPaired = matchIdx !== -1;
            const colorClass = isPaired ? PAIR_COLORS[matchIdx % PAIR_COLORS.length] : '';

            return (
              <div
                key={item.id}
                onClick={() => handleSelectLeft(item.id)}
                className={`p-3 rounded border text-xs font-semibold cursor-pointer transition-all flex items-center justify-between ${
                  isSelected
                    ? 'border-cyber-primary bg-cyber-primary/20 ring-1 ring-cyber-primary shadow-[0_0_15px_rgba(0,255,204,0.2)]'
                    : isPaired
                    ? `${colorClass} shadow-sm`
                    : 'border-cyber-border bg-[#0D131F] hover:border-cyber-primary/40 text-slate-200'
                }`}
              >
                <span>{item.left}</span>
                {isPaired && (
                  <span className="text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.5 bg-black/40 rounded flex items-center gap-1">
                    <Link2 className="w-3 h-3" /> Pair #{matchIdx + 1}
                  </span>
                )}
              </div>
            );
          })}
        </div>

        {/* Right Column: Definitions */}
        <div className="space-y-2.5">
          <div className="text-[11px] font-bold text-cyber-secondary uppercase tracking-wider mb-2 flex items-center justify-between">
            <span>Operational Role / Purpose</span>
            <span className="text-cyber-muted font-normal text-[10px]">Select corresponding slot</span>
          </div>

          {shuffledRights.map((item) => {
            const rightMatchIdx = getRightMatchIndex(item.id);
            const isPaired = rightMatchIdx !== -1;
            const colorClass = isPaired ? PAIR_COLORS[rightMatchIdx % PAIR_COLORS.length] : '';

            return (
              <div
                key={item.id}
                onClick={() => handleSelectRight(item.id)}
                className={`p-3 rounded border text-xs cursor-pointer transition-all flex items-center justify-between ${
                  isPaired
                    ? `${colorClass} shadow-sm font-semibold`
                    : selectedLeft
                    ? 'border-dashed border-cyber-secondary/60 bg-cyber-secondary/5 hover:border-cyber-secondary hover:bg-cyber-secondary/15 text-slate-300'
                    : 'border-cyber-border bg-[#0D131F] hover:border-cyber-secondary/40 text-slate-300'
                }`}
              >
                <span className="leading-snug">{item.right}</span>
                {isPaired && (
                  <span className="text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.5 bg-black/40 rounded shrink-0 ml-2">
                    Linked #{rightMatchIdx + 1}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Evaluation Banner */}
      {isEvaluated && (
        <div className={`mt-4 p-3 rounded flex items-center justify-between text-xs ${
          isAllCorrect 
            ? 'bg-cyber-success/20 border border-cyber-success/40 text-cyber-success'
            : 'bg-cyber-danger/20 border border-cyber-danger/40 text-cyber-danger'
        }`}>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span className="font-bold">
              {isAllCorrect 
                ? 'ALL PAIRS PERFECTLY SYNCHRONIZED: Technical concepts validated!' 
                : 'SYNCHRONIZATION ERROR: One or more entities are paired with incorrect operational roles.'}
            </span>
          </div>
          <span className="font-bold tracking-widest text-[11px] uppercase">
            {isAllCorrect ? '+100 XP' : 'PARTIAL / INCORRECT'}
          </span>
        </div>
      )}
    </div>
  );
}
