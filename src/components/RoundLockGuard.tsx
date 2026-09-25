import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { Lock, Unlock, ShieldAlert, Home, Terminal } from 'lucide-react';

interface RoundLockGuardProps {
  children: React.ReactNode;
  roundName?: string;
  roundDescription?: string;
}

export default function RoundLockGuard({
  children,
  roundName = 'ROUND 01 B: PERSONALIZED TECHNICAL PROFILING',
  roundDescription
}: RoundLockGuardProps) {
  const navigate = useNavigate();
  const { isRound1Submitted, setRound1Submitted, score, completedMissionIds, attemptId } = useStore();

  const isR1Complete = 
    isRound1Submitted || 
    (typeof window !== 'undefined' && (
      localStorage.getItem('r1_submitted') === 'true' || 
      sessionStorage.getItem('r1_submitted') === 'true'
    )) ||
    score > 0 ||
    completedMissionIds.length > 0 ||
    !!attemptId;

  if (isR1Complete) {
    return <>{children}</>;
  }

  const handleQuickUnlock = () => {
    setRound1Submitted(true);
  };

  return (
    <div className="min-h-screen bg-[#05070D] text-cyber-text flex items-center justify-center p-4 md:p-8 font-mono-cyber select-none">
      <div className="w-full max-w-xl cyber-panel border-2 border-red-500/50 p-6 md:p-10 shadow-[0_0_50px_rgba(239,68,68,0.2)] rounded-lg text-center animate-scaleIn">
        
        {/* Lock Icon Emblem */}
        <div className="w-16 h-16 rounded-full bg-red-950/40 border-2 border-red-500 flex items-center justify-center mx-auto mb-4 shadow-[0_0_20px_rgba(239,68,68,0.4)] animate-pulse">
          <Lock className="w-8 h-8 text-red-400" />
        </div>

        <span className="text-[10px] uppercase font-bold tracking-widest px-3 py-1 bg-red-500/10 border border-red-500/30 text-red-400 rounded inline-block mb-2">
          ACCESS RESTRICTED • PREREQUISITE UNFULFILLED
        </span>

        <h2 className="text-2xl md:text-3xl font-bold text-white uppercase tracking-tight">
          {roundName} IS LOCKED
        </h2>

        <p className="text-xs text-slate-300 mt-3 max-w-md mx-auto leading-relaxed">
          Operation Zero-Day recruitment rules mandate that candidates must first complete and submit <strong className="text-cyber-primary">Round 01 (Common SOC Screening Assessment)</strong> before subsequent technical rounds unlock.
        </p>

        {roundDescription && (
          <p className="text-[11px] text-cyber-muted mt-1 italic max-w-md mx-auto">
            {roundDescription}
          </p>
        )}

        {/* Lock Status Details Card */}
        <div className="my-6 p-4 rounded bg-[#090D17] border border-white/10 text-left space-y-2 text-xs">
          <div className="flex items-center justify-between pb-2 border-b border-white/5">
            <span className="text-cyber-muted uppercase text-[10px]">Round 01 A Status:</span>
            <span className="text-red-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
              <ShieldAlert className="w-3.5 h-3.5" /> PENDING SUBMISSION
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-cyber-muted uppercase text-[10px]">Round 01 B Status:</span>
            <span className="text-cyber-muted font-bold uppercase tracking-wider flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5" /> LOCKED
            </span>
          </div>
          <p className="text-[11px] text-cyber-muted pt-1">
            * Once you complete the 30 SOC screening questions and review your debrief, Round 01 B will automatically unlock.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-3">
          <button
            onClick={handleQuickUnlock}
            className="w-full py-3.5 bg-cyber-secondary hover:bg-white text-white hover:text-black font-extrabold text-xs uppercase tracking-wider rounded transition-all shadow-[0_0_25px_rgba(112,0,255,0.4)] flex items-center justify-center gap-2 cursor-pointer transform active:scale-95"
          >
            <Unlock className="w-4 h-4" />
            I ALREADY GAVE ROUND 01 A &bull; UNLOCK ACCESS NOW &rarr;
          </button>

          <button
            onClick={() => navigate('/precheck')}
            className="w-full py-3 bg-cyber-primary/20 hover:bg-cyber-primary text-cyber-primary hover:text-black border border-cyber-primary/40 font-bold text-xs uppercase tracking-wider rounded transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Terminal className="w-4 h-4" />
            START / RETAKE ROUND 01 (SOC ASSESSMENT) &rarr;
          </button>

          <button
            onClick={() => navigate('/')}
            className="w-full py-2.5 bg-white/5 hover:bg-white/10 text-slate-300 font-bold text-xs uppercase tracking-wider rounded border border-white/10 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Home className="w-4 h-4" />
            RETURN TO HOMEPAGE
          </button>
        </div>

      </div>
    </div>
  );
}
