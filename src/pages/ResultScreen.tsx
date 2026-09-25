import { useEffect } from 'react';
import { useStore } from '../store/useStore';
import { useNavigate } from 'react-router-dom';
import { 
  ShieldCheck, 
  Award, 
  Target, 
  CheckCircle2, 
  Home, 
  BarChart3,
  Activity
} from 'lucide-react';

export default function ResultScreen() {
  const { candidate, score, xp, accuracy, skillScores, timeRemainingSeconds, mode, setRound1Submitted } = useStore();
  const navigate = useNavigate();

  useEffect(() => {
    setRound1Submitted(true);
  }, [setRound1Submitted]);

  const handleReturn = () => {
    navigate('/');
  };

  const timeUsedSeconds = 2700 - timeRemainingSeconds;
  const timeUsedMinutes = Math.floor(timeUsedSeconds / 60);
  const timeUsedSecs = timeUsedSeconds % 60;

  // Compute skill percentages
  const skillsToDisplay = [
    { key: 'CYBERSECURITY', label: 'Cybersecurity Telemetry', color: 'bg-cyber-primary' },
    { key: 'NETWORKING', label: 'Networking & Protocols', color: 'bg-cyber-info' },
    { key: 'PROGRAMMING', label: 'Code & Script Analysis', color: 'bg-cyber-secondary' },
    { key: 'LOGIC', label: 'Problem Solving & Logic', color: 'bg-cyber-warning' },
    { key: 'INVESTIGATION', label: 'Forensic Log Analysis', color: 'bg-cyber-primary' },
    { key: 'DECISION_MAKING', label: 'Incident Containment', color: 'bg-cyber-success' }
  ];

  return (
    <div className="min-h-screen bg-[#05070D] text-cyber-text flex items-center justify-center p-4 md:p-8 font-mono-cyber">
      <div className="w-full max-w-4xl cyber-panel border border-cyber-primary/40 p-6 md:p-10 shadow-[0_0_40px_rgba(0,255,204,0.12)]">
        
        {/* Top Debrief Header */}
        <div className="text-center border-b border-cyber-border pb-6 mb-8">
          <div className="w-14 h-14 bg-cyber-primary/10 border border-cyber-primary/40 mx-auto flex items-center justify-center mb-3">
            <ShieldCheck className="w-8 h-8 text-cyber-primary" />
          </div>
          <span className="text-[10px] tracking-widest uppercase px-3 py-1 bg-cyber-primary/15 text-cyber-primary border border-cyber-primary/30 inline-block mb-2">
            INCIDENT RESOLUTION DEBRIEF
          </span>
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-white uppercase">
            OPERATION ZERO-DAY
          </h1>
          <p className="text-xs text-cyber-muted mt-2">
            CYBER CELL TECHNICAL RECRUITMENT • ROUND 1 OFFICIAL ASSESSMENT
          </p>
        </div>

        {/* Candidate & High-Level Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="p-4 bg-cyber-panel-secondary border border-cyber-border">
            <span className="text-[10px] text-cyber-muted uppercase block">CANDIDATE</span>
            <span className="text-base font-bold text-white block truncate mt-1">
              {candidate?.name || (mode === 'demo' ? 'DEMO OPERATOR' : 'GUEST')}
            </span>
            <span className="text-[10px] text-cyber-primary block mt-0.5">
              SCHOLAR: {candidate?.scholarNumber || 'DEMO-01'}
            </span>
          </div>

          <div className="p-4 bg-cyber-panel-secondary border border-cyber-primary/30">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-cyber-muted uppercase block">FINAL SCORE</span>
              <Target className="w-3.5 h-3.5 text-cyber-primary" />
            </div>
            <span className="text-2xl font-bold text-cyber-primary block mt-1">
              {score}
            </span>
            <span className="text-[10px] text-cyber-muted block mt-0.5">Recruitment Evaluation</span>
          </div>

          <div className="p-4 bg-cyber-panel-secondary border border-cyber-border">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-cyber-muted uppercase block">TOTAL XP</span>
              <Award className="w-3.5 h-3.5 text-cyber-secondary" />
            </div>
            <span className="text-2xl font-bold text-cyber-secondary block mt-1">
              {xp}
            </span>
            <span className="text-[10px] text-cyber-muted block mt-0.5">Tactical Progression</span>
          </div>

          <div className="p-4 bg-cyber-panel-secondary border border-cyber-border">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-cyber-muted uppercase block">ACCURACY</span>
              <Activity className="w-3.5 h-3.5 text-cyber-success" />
            </div>
            <span className="text-2xl font-bold text-cyber-success block mt-1">
              {accuracy}%
            </span>
            <span className="text-[10px] text-cyber-muted block mt-0.5">
              Time: {timeUsedMinutes}m {timeUsedSecs}s
            </span>
          </div>
        </div>

        {/* Skill Analytics Bars */}
        <div className="border border-cyber-border bg-[#0B1018] p-6 mb-8">
          <div className="flex items-center justify-between border-b border-cyber-border pb-3 mb-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-cyber-primary" />
              TECHNICAL SKILL PROFILE
            </h3>
            <span className="text-[11px] text-cyber-muted">DERIVED FROM TELEMETRY EVIDENCE</span>
          </div>

          <div className="space-y-4">
            {skillsToDisplay.map((s) => {
              const skillData = skillScores[s.key] || { total: 0, correct: 0, score: 0 };
              const percent = skillData.total > 0 ? Math.round((skillData.correct / skillData.total) * 100) : 75; // baseline visual
              return (
                <div key={s.key} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-cyber-text">{s.label}</span>
                    <span className="text-cyber-primary font-bold">{percent}%</span>
                  </div>
                  <div className="w-full h-2 bg-black border border-cyber-border rounded-none overflow-hidden">
                    <div 
                      className={`h-full ${s.color} transition-all duration-1000`} 
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Next Stage Banner: Round 01 B Technical Profiling */}
        <div className="p-6 mb-8 bg-gradient-to-r from-purple-950/40 via-cyan-950/30 to-black border-2 border-cyber-secondary rounded-lg shadow-[0_0_30px_rgba(112,0,255,0.2)]">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="space-y-1 text-center md:text-left">
              <span className="text-[10px] uppercase font-bold tracking-widest px-2.5 py-0.5 bg-cyber-secondary/20 text-cyber-secondary border border-cyber-secondary/40 rounded inline-block">
                NEXT RECRUITMENT STAGE
              </span>
              <h2 className="text-xl font-bold text-white uppercase tracking-tight">
                ROUND 01 B: PERSONALIZED TECHNICAL PROFILING
              </h2>
              <p className="text-xs text-cyber-muted max-w-xl leading-relaxed">
                Declare your genuine skills across 9 technical domains (Web, Python, DSA, Cybersecurity, Linux, SQL) and tackle calibrated questions, subjective architecture reviews, and hands-on coding labs.
              </p>
            </div>

            <button
              onClick={() => navigate('/technical-profile')}
              className="w-full md:w-auto px-6 py-3.5 bg-cyber-secondary hover:bg-white text-white hover:text-black font-bold text-xs uppercase tracking-wider transition-all rounded shadow-[0_0_25px_rgba(112,0,255,0.4)] flex items-center justify-center gap-2 shrink-0 cursor-pointer"
            >
              PROCEED TO ROUND 01 B &rarr;
            </button>
          </div>
        </div>

        {/* Submission Confirmation Bar */}
        <div className="p-4 bg-cyber-panel-secondary border border-cyber-border flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-2.5 text-cyber-text">
            <CheckCircle2 className="w-5 h-5 text-cyber-primary shrink-0" />
            <div>
              <span className="font-bold text-white block">ASSESSMENT SUBMITTED & PERSISTED</span>
              <span className="text-cyber-muted">
                Your performance has been logged to the Cyber Cell recruitment system. Official results will be published following review.
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto shrink-0">
            <button
              onClick={() => navigate('/arcade')}
              className="w-full sm:w-auto px-4 py-2.5 bg-white/5 hover:bg-white/10 text-amber-400 border border-amber-400/40 font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-1.5"
            >
              PLAY ARCADE LAB
            </button>
            <button
              onClick={handleReturn}
              className="w-full sm:w-auto px-5 py-2.5 bg-cyber-primary text-black font-bold text-xs uppercase tracking-wider hover:bg-white transition-all flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(0,255,204,0.3)]"
            >
              <Home className="w-4 h-4" />
              HOME
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
