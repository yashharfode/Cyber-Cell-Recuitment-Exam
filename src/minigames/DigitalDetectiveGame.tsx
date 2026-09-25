import { useState } from 'react';
import { Search, CheckCircle2, RotateCcw } from 'lucide-react';

export interface IncidentEvidence {
  id: string;
  stepNumber: number; // 1 to 5
  phase: string;
  title: string;
  summary: string;
  iconName: string;
}

interface DigitalDetectiveGameProps {
  onSolve?: (orderedChain: IncidentEvidence[], isCorrect: boolean) => void;
  disabled?: boolean;
}

const DEFAULT_EVIDENCE: IncidentEvidence[] = [
  {
    id: 'ev-1',
    stepNumber: 1,
    phase: 'INITIAL ACCESS',
    title: 'Phishing Email Delivered',
    summary: 'A spoofed SATI notification containing a deceptive URL is received by an administrative employee.',
    iconName: 'FileText'
  },
  {
    id: 'ev-2',
    stepNumber: 2,
    phase: 'CREDENTIAL HARVESTING',
    title: 'Employee Inputs Credentials',
    summary: 'Target enters valid campus domain credentials on the cloned authentication portal.',
    iconName: 'KeyRound'
  },
  {
    id: 'ev-3',
    stepNumber: 3,
    phase: 'UNAUTHORIZED ACCESS',
    title: 'Anomalous Foreign IP Session',
    summary: 'Stolen credentials are used to establish a remote session from external IP 185.92.18.4 at 03:17 AM.',
    iconName: 'Globe'
  },
  {
    id: 'ev-4',
    stepNumber: 4,
    phase: 'PRIVILEGE ESCALATION',
    title: 'Domain Admin Elevated',
    summary: 'Intruder exploits misconfigured sudo token to obtain superuser domain administrative rights.',
    iconName: 'ShieldAlert'
  },
  {
    id: 'ev-5',
    stepNumber: 5,
    phase: 'EXFILTRATION',
    title: 'Database Archive Transferred',
    summary: 'Encrypted SQL student records dump (1.4 GB) is exfiltrated to an off-site cloud bucket.',
    iconName: 'Database'
  }
];

export default function DigitalDetectiveGame({ onSolve, disabled }: DigitalDetectiveGameProps) {
  // Scramble cards
  const [timelineSlots, setTimelineSlots] = useState<string[]>([]);
  const [availableEvidence, setAvailableEvidence] = useState<IncidentEvidence[]>(() => {
    return [...DEFAULT_EVIDENCE].sort(() => Math.random() - 0.5);
  });

  const [isEvaluated, setIsEvaluated] = useState<boolean>(false);
  const [isCorrect, setIsCorrect] = useState<boolean>(false);

  const handleSelectCard = (evId: string) => {
    if (disabled || isEvaluated) return;
    if (timelineSlots.includes(evId)) {
      // Remove from timeline
      const updated = timelineSlots.filter(id => id !== evId);
      setTimelineSlots(updated);
    } else {
      const updated = [...timelineSlots, evId];
      setTimelineSlots(updated);

      if (updated.length === DEFAULT_EVIDENCE.length) {
        // Evaluate
        const allCorrect = updated.every((id, idx) => {
          const ev = DEFAULT_EVIDENCE.find(e => e.id === id);
          return ev?.stepNumber === idx + 1;
        });

        setIsCorrect(allCorrect);
        setIsEvaluated(true);

        if (onSolve) {
          const ordered = updated.map(id => DEFAULT_EVIDENCE.find(e => e.id === id)!);
          onSolve(ordered, allCorrect);
        }
      }
    }
  };

  const handleReset = () => {
    if (disabled) return;
    setTimelineSlots([]);
    setIsEvaluated(false);
    setIsCorrect(false);
    setAvailableEvidence([...DEFAULT_EVIDENCE].sort(() => Math.random() - 0.5));
  };

  const getEvidenceById = (id: string) => DEFAULT_EVIDENCE.find(e => e.id === id);

  return (
    <div className="bg-[#080C14] border border-cyber-primary/30 p-5 rounded-lg font-mono-cyber">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 mb-4 border-b border-cyber-border">
        <div>
          <span className="text-[10px] text-amber-400 uppercase tracking-widest px-2 py-0.5 bg-amber-400/10 border border-amber-400/30 rounded flex items-center gap-1.5 w-max">
            <Search className="w-3 h-3" /> SIGNATURE INVESTIGATION: DIGITAL DETECTIVE
          </span>
          <h3 className="text-base font-bold text-white mt-1">RECONSTRUCT THE ATTACK KILL-CHAIN</h3>
          <p className="text-xs text-cyber-muted mt-0.5">
            Click forensic evidence items in exact chronological order (from Initial Vector to Final Exfiltration).
          </p>
        </div>
        <button
          onClick={handleReset}
          disabled={disabled}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-cyber-muted hover:text-white bg-white/5 hover:bg-white/10 rounded transition-all border border-white/10"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Reset Timeline
        </button>
      </div>

      {/* Timeline Pipeline */}
      <div className="my-4">
        <div className="text-[11px] font-bold text-cyber-primary uppercase tracking-wider mb-2 flex items-center justify-between">
          <span>Active Incident Sequence ({timelineSlots.length} / 5 assigned)</span>
          <span className="text-cyber-muted text-[10px]">Click any assigned step to remove</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-5 gap-2">
          {[0, 1, 2, 3, 4].map((index) => {
            const evId = timelineSlots[index];
            const ev = evId ? getEvidenceById(evId) : null;
            const isSlotCorrect = isEvaluated && ev?.stepNumber === index + 1;
            const isSlotWrong = isEvaluated && ev && ev?.stepNumber !== index + 1;

            return (
              <div
                key={index}
                onClick={() => evId && handleSelectCard(evId)}
                className={`p-3 rounded border flex flex-col justify-between min-h-[105px] transition-all ${
                  ev
                    ? isSlotCorrect
                      ? 'border-cyber-success bg-cyber-success/15 cursor-pointer shadow-[0_0_15px_rgba(0,255,136,0.15)]'
                      : isSlotWrong
                      ? 'border-cyber-danger bg-cyber-danger/15 cursor-pointer'
                      : 'border-amber-400/50 bg-[#0D131F] cursor-pointer'
                    : 'border-dashed border-cyber-border bg-[#05080F]'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] uppercase font-bold text-cyber-muted">
                      STEP {index + 1}
                    </span>
                    {ev && (
                      <span className="text-[9px] px-1 py-0.2 rounded bg-white/10 text-amber-300">
                        {ev.phase.split(' ')[0]}
                      </span>
                    )}
                  </div>
                  <span className="text-xs font-bold text-white block leading-tight">
                    {ev ? ev.title : `[ Empty Slot ]`}
                  </span>
                </div>

                {ev && (
                  <span className="text-[9px] text-cyber-muted block truncate mt-2">
                    {ev.phase}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Available Evidence Pool */}
      <div className="mt-5 pt-4 border-t border-cyber-border">
        <span className="text-xs font-bold text-white uppercase block mb-2">
          DISCOVERED FORENSIC LOGS & TRACES (Click to append to timeline)
        </span>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
          {availableEvidence.map((ev) => {
            const isSelected = timelineSlots.includes(ev.id);

            return (
              <button
                key={ev.id}
                onClick={() => handleSelectCard(ev.id)}
                disabled={disabled || isEvaluated}
                className={`p-3 rounded border text-left transition-all ${
                  isSelected
                    ? 'border-amber-400 bg-amber-400/10 opacity-50'
                    : 'border-cyber-border bg-[#0D131F] hover:border-amber-400/50 hover:bg-[#121A2B]'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[9px] uppercase font-bold text-amber-400 px-1.5 py-0.2 bg-amber-400/10 rounded">
                    {ev.phase}
                  </span>
                  {isSelected && (
                    <span className="text-[10px] text-white bg-black/60 px-1.5 rounded">
                      #{timelineSlots.indexOf(ev.id) + 1}
                    </span>
                  )}
                </div>
                <h5 className="text-xs font-bold text-white mt-1">{ev.title}</h5>
                <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">{ev.summary}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Outcome Banner */}
      {isEvaluated && (
        <div className={`mt-4 p-3 rounded flex items-center justify-between text-xs ${
          isCorrect 
            ? 'bg-cyber-success/20 border border-cyber-success/40 text-cyber-success'
            : 'bg-cyber-danger/20 border border-cyber-danger/40 text-cyber-danger'
        }`}>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span className="font-bold">
              {isCorrect 
                ? 'ATTACK KILL-CHAIN RECONSTRUCTED: Complete chronological threat progression established!' 
                : 'SEQUENCE MISMATCH: Kill-chain events do not match the technical attack trajectory.'}
            </span>
          </div>
          <span className="font-bold tracking-widest text-[11px] uppercase">
            {isCorrect ? '+100 XP' : 'TRY AGAIN'}
          </span>
        </div>
      )}
    </div>
  );
}
