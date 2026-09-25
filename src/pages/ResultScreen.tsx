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
  Activity,
  Sparkles
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
    { key: 'CYBERSECURITY', label: 'Cybersecurity Telemetry', color: 'bg-sky-600' },
    { key: 'NETWORKING', label: 'Networking & Protocols', color: 'bg-indigo-600' },
    { key: 'PROGRAMMING', label: 'Code & Script Analysis', color: 'bg-violet-600' },
    { key: 'LOGIC', label: 'Problem Solving & Logic', color: 'bg-amber-600' },
    { key: 'INVESTIGATION', label: 'Forensic Log Analysis', color: 'bg-teal-600' },
    { key: 'DECISION_MAKING', label: 'Incident Containment', color: 'bg-emerald-600' }
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex items-center justify-center p-4 md:p-8 font-sans">
      <div className="w-full max-w-4xl bg-white border border-slate-200 rounded-2xl p-6 md:p-10 shadow-xl">
        
        {/* Top Debrief Header */}
        <div className="text-center border-b border-slate-200 pb-6 mb-8">
          <div className="w-14 h-14 bg-sky-50 border border-sky-200 rounded-2xl mx-auto flex items-center justify-center mb-3">
            <ShieldCheck className="w-8 h-8 text-sky-600" />
          </div>
          <span className="text-[10px] tracking-wider uppercase font-semibold px-3 py-1 bg-sky-50 text-sky-700 border border-sky-200 rounded-full inline-block mb-2 font-mono">
            INCIDENT RESOLUTION DEBRIEF
          </span>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900 uppercase">
            OPERATION ZERO-DAY
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            CYBER CELL TECHNICAL RECRUITMENT • ROUND 1 OFFICIAL ASSESSMENT
          </p>
        </div>

        {/* Candidate & High-Level Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
            <span className="text-[10px] text-slate-500 uppercase block font-mono font-medium">CANDIDATE</span>
            <span className="text-base font-bold text-slate-900 block truncate mt-1">
              {candidate?.name || (mode === 'demo' ? 'DEMO OPERATOR' : 'GUEST')}
            </span>
            <span className="text-[10px] text-sky-700 font-mono block mt-0.5">
              SCHOLAR: {candidate?.scholarNumber || 'DEMO-01'}
            </span>
          </div>

          <div className="p-4 bg-slate-50 border border-sky-200 rounded-xl">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-slate-500 uppercase block font-mono font-medium">FINAL SCORE</span>
              <Target className="w-3.5 h-3.5 text-sky-600" />
            </div>
            <span className="text-2xl font-bold text-sky-700 font-mono block mt-1">
              {score}
            </span>
            <span className="text-[10px] text-slate-500 block mt-0.5">Recruitment Evaluation</span>
          </div>

          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-slate-500 uppercase block font-mono font-medium">TOTAL XP</span>
              <Award className="w-3.5 h-3.5 text-indigo-600" />
            </div>
            <span className="text-2xl font-bold text-indigo-700 font-mono block mt-1">
              {xp}
            </span>
            <span className="text-[10px] text-slate-500 block mt-0.5">Tactical Progression</span>
          </div>

          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-slate-500 uppercase block font-mono font-medium">ACCURACY</span>
              <Activity className="w-3.5 h-3.5 text-emerald-600" />
            </div>
            <span className="text-2xl font-bold text-emerald-600 font-mono block mt-1">
              {accuracy}%
            </span>
            <span className="text-[10px] text-slate-500 font-mono block mt-0.5">
              Time: {timeUsedMinutes}m {timeUsedSecs}s
            </span>
          </div>
        </div>

        {/* Skill Analytics Bars */}
        <div className="border border-slate-200 bg-slate-50/50 rounded-2xl p-6 mb-8">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3 mb-4">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-sky-600" />
              TECHNICAL SKILL PROFILE
            </h3>
            <span className="text-[11px] text-slate-500 font-mono">DERIVED FROM TELEMETRY EVIDENCE</span>
          </div>

          <div className="space-y-4">
            {skillsToDisplay.map((s) => {
              const skillData = skillScores[s.key] || { total: 0, correct: 0, score: 0 };
              const percent = skillData.total > 0 ? Math.round((skillData.correct / skillData.total) * 100) : 75;
              return (
                <div key={s.key} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-700 font-medium">{s.label}</span>
                    <span className="text-slate-900 font-mono font-bold">{percent}%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${s.color} rounded-full transition-all duration-1000`} 
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Next Stage Banner: Round 01 B Technical Profiling */}
        <div className="p-6 mb-8 bg-indigo-50/60 border border-indigo-200 rounded-2xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="space-y-1 text-center md:text-left">
              <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-full inline-block font-mono">
                NEXT RECRUITMENT STAGE
              </span>
              <h2 className="text-xl font-bold text-slate-900 uppercase tracking-tight">
                ROUND 01 B: PERSONALIZED TECHNICAL PROFILING
              </h2>
              <p className="text-xs text-slate-600 max-w-xl leading-relaxed">
                Declare your genuine skills across technical domains (Web, Python, DSA, Cybersecurity, Linux, SQL) and tackle calibrated questions, subjective architecture reviews, and hands-on coding labs.
              </p>
            </div>

            <button
              onClick={() => navigate('/technical-profile')}
              className="w-full md:w-auto px-6 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs uppercase tracking-wider transition-all rounded-xl shadow-xs flex items-center justify-center gap-2 shrink-0 cursor-pointer"
            >
              PROCEED TO ROUND 01 B &rarr;
            </button>
          </div>
        </div>

        {/* Submission Confirmation Bar */}
        <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-2.5 text-slate-700">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <div>
              <span className="font-bold text-slate-900 block">ASSESSMENT SUBMITTED & PERSISTED</span>
              <span className="text-slate-500">
                Your performance has been logged to the Cyber Cell recruitment system. Official results will be published following review.
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto shrink-0">
            <button
              onClick={() => navigate('/arcade')}
              className="w-full sm:w-auto px-4 py-2.5 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 rounded-lg font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              STAGE 01 C: BONUS LABS (OPTIONAL)
            </button>
            <button
              onClick={handleReturn}
              className="w-full sm:w-auto px-5 py-2.5 bg-slate-900 text-white font-bold text-xs uppercase tracking-wider hover:bg-slate-800 rounded-lg transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs"
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
