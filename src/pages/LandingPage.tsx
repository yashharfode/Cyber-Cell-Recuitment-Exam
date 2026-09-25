import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Play, 
  Terminal, 
  X, 
  Lock, 
  Unlock, 
  ShieldCheck, 
  ChevronRight,
  ArrowRight,
  HelpCircle,
  Monitor,
  Sparkles,
  CheckCircle2
} from 'lucide-react';
import { useStore } from '../store/useStore';

export default function LandingPage() {
  const navigate = useNavigate();
  const { setMode, isRound1Submitted, setRound1Submitted, score, completedMissionIds, attemptId } = useStore();
  const [activeModal, setActiveModal] = useState<'howItWorks' | 'requirements' | null>(null);

  const isR1Complete = 
    isRound1Submitted || 
    (typeof window !== 'undefined' && (
      localStorage.getItem('r1_submitted') === 'true' || 
      sessionStorage.getItem('r1_submitted') === 'true'
    )) ||
    score > 0 ||
    completedMissionIds.length > 0 ||
    !!attemptId;

  const startDemo = () => {
    setMode('demo');
    navigate('/precheck');
  };

  const startRecruitment = () => {
    setMode('recruitment');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-[#080C14] text-slate-100 font-sans flex flex-col justify-between relative overflow-x-hidden selection:bg-sky-500/20 selection:text-sky-200">
      
      {/* Background Architectural Grid: Subtle & Enterprise-Grade */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(255, 255, 255, 0.3) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 255, 255, 0.3) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px'
        }}
      />
      
      {/* Restrained Ambient Radial Glow with Gentle Breathing Animation */}
      <div className="absolute top-[-100px] left-1/2 -translate-x-1/2 w-[650px] h-[350px] bg-sky-500/[0.04] rounded-full blur-[140px] pointer-events-none animate-pulseGlow" />
      <div className="absolute bottom-[-50px] right-[-50px] w-[400px] h-[250px] bg-indigo-500/[0.03] rounded-full blur-[120px] pointer-events-none" />

      {/* ========================================================================= */}
      {/* 1. PROFESSIONAL PRODUCT HEADER                                            */}
      {/* ========================================================================= */}
      <header className="relative z-20 border-b border-white/[0.08] bg-[#080C14]/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 py-3.5 sm:py-4 flex items-center justify-between">
          
          {/* Organization Identity */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-[#0F172A] border border-white/[0.12] flex items-center justify-center font-mono text-xs font-bold text-sky-400 shadow-sm relative group overflow-hidden">
              <span className="relative z-10">CC</span>
              <div className="absolute inset-0 bg-sky-400/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="text-xs sm:text-sm font-bold tracking-tight text-white uppercase">
                  CYBER CELL
                </span>
                <span className="text-[9px] sm:text-[10px] font-mono text-sky-400 px-1.5 py-0.2 rounded bg-sky-500/10 border border-sky-500/20 font-medium">
                  SATI
                </span>
              </div>
              <span className="text-[10px] sm:text-xs text-slate-400">
                Samrat Ashok Technological Institute, Vidisha
              </span>
            </div>
          </div>

          {/* Center Badge (Desktop) */}
          <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.03] border border-white/[0.08] text-xs font-medium text-slate-300">
            <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse" />
            <span className="font-mono text-[11px] tracking-wide">TECHNICAL RECRUITMENT 2026</span>
          </div>

          {/* Right Status Indicator */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg bg-[#0F172A] border border-white/[0.08] text-[11px] sm:text-xs font-mono">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
              </span>
              <span className="text-slate-400 hidden sm:inline">STATUS:</span>
              <span className="text-white font-medium">ACTIVE</span>
            </div>
          </div>

        </div>
      </header>

      {/* ========================================================================= */}
      {/* 2. HERO SECTION                                                           */}
      {/* ========================================================================= */}
      <main className="relative z-10 flex-1 max-w-7xl mx-auto w-full px-4 sm:px-8 lg:px-12 py-8 sm:py-12 lg:py-14 flex flex-col justify-center animate-fadeIn">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* LEFT COLUMN: Clean Title, Objective & Call to Action */}
          <div className="lg:col-span-7 flex flex-col items-start space-y-5 sm:space-y-6">
            
            {/* Minimal Eyebrow Tag */}
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-sky-500/10 border border-sky-500/20 text-sky-400 text-xs font-mono font-medium">
              <Sparkles className="w-3.5 h-3.5" />
              <span>OFFICIAL ENTRANCE ASSESSMENT</span>
            </div>

            {/* Main Editorial Title */}
            <div className="space-y-1.5">
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white uppercase leading-[1.05]">
                CYBER CELL
                <span className="block text-slate-300">TECHNICAL RECRUITMENT</span>
              </h1>
              <p className="text-sm sm:text-base font-medium text-slate-400 pt-1">
                Standardized Evaluation • Problem Solving, Logic & Engineering Capability
              </p>
            </div>

            {/* Briefing Narrative */}
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-xl">
              Welcome to the official technical evaluation for the Cyber Cell. This proctored platform measures your computational thinking, system awareness, problem-solving, and practical technical depth with zero bias.
            </p>

            {/* Primary & Secondary Call to Actions */}
            <div className="pt-1 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
              
              {/* Primary Action: Solid High-Contrast Button with Smooth Lift */}
              <button
                onClick={startRecruitment}
                className="group relative h-12 px-7 rounded-lg bg-white hover:bg-slate-100 text-slate-950 font-bold text-sm tracking-wide transition-all duration-200 flex items-center justify-center gap-2.5 shadow-lg shadow-white/5 hover:shadow-white/10 hover:-translate-y-0.5 active:translate-y-0 cursor-pointer overflow-hidden"
              >
                <Terminal className="w-4 h-4 stroke-[2.5] text-slate-950 transition-transform duration-200 group-hover:scale-110" />
                <span>ENTER RECRUITMENT</span>
                <ArrowRight className="w-4 h-4 stroke-[2.5] text-slate-950 transition-transform duration-200 group-hover:translate-x-1" />
              </button>

              {/* Secondary Action: Minimalist Practice Button */}
              <button
                onClick={startDemo}
                className="h-12 px-6 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-slate-200 hover:text-white border border-white/[0.1] hover:border-white/20 font-semibold text-sm transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer hover:-translate-y-0.5 active:translate-y-0"
              >
                <Play className="w-3.5 h-3.5 fill-current text-sky-400" />
                <span>PRACTICE DEMO</span>
              </button>
            </div>

            {/* 4 Essential Assessment Parameters */}
            <div className="pt-4 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 border-t border-white/[0.08] w-full max-w-xl">
              <div>
                <span className="text-[10px] sm:text-[11px] font-mono text-slate-400 uppercase block">
                  Duration
                </span>
                <span className="text-xs font-semibold text-white mt-0.5 block">
                  30–45 Mins
                </span>
              </div>

              <div>
                <span className="text-[10px] sm:text-[11px] font-mono text-slate-400 uppercase block">
                  Questions
                </span>
                <span className="text-xs font-semibold text-white mt-0.5 block">
                  30 MCQs + Depth
                </span>
              </div>

              <div>
                <span className="text-[10px] sm:text-[11px] font-mono text-slate-400 uppercase block">
                  Compatibility
                </span>
                <span className="text-xs font-semibold text-white mt-0.5 block">
                  Mobile & Desktop
                </span>
              </div>

              <div>
                <span className="text-[10px] sm:text-[11px] font-mono text-slate-400 uppercase block">
                  Eligibility
                </span>
                <span className="text-xs font-semibold text-white mt-0.5 block">
                  All Semesters
                </span>
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN: Authentic Assessment Protocol Card */}
          <div className="lg:col-span-5 flex flex-col space-y-3.5">
            
            <div className="p-5 sm:p-6 rounded-xl bg-[#0F172A] border border-white/[0.08] shadow-xl relative overflow-hidden transition-all duration-300 hover:border-white/[0.15]">
              
              <div className="flex items-center justify-between pb-3.5 border-b border-white/[0.08]">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-sky-400" />
                  <span className="text-xs font-mono font-bold uppercase text-white tracking-wider">
                    EVALUATION PROTOCOL
                  </span>
                </div>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 font-medium">
                  PROCTORED
                </span>
              </div>

              {/* Guidelines List */}
              <div className="py-3.5 space-y-2.5 text-xs">
                
                <div className="flex items-start gap-2.5 text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white font-medium">Open to All Branches:</strong> No prior advanced security knowledge required. Foundational logic, aptitude, and problem solving are prioritized.
                  </div>
                </div>

                <div className="flex items-start gap-2.5 text-slate-300">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white font-medium">Integrity Monitored:</strong> Fullscreen mode, app switching, and tab switching are monitored with negative marking penalties for violations.
                  </div>
                </div>

                <div className="flex items-start gap-2.5 text-slate-300">
                  <Monitor className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white font-medium">Headache-Free Mobile Test:</strong> On phones and tablets, questions open directly in clean sequential mode without 3D control friction.
                  </div>
                </div>

              </div>

              {/* Sequential Stage Unlocking Status Card */}
              <div className="pt-3 border-t border-white/[0.08] flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-md bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400 font-mono font-bold text-xs">
                    01
                  </div>
                  <div>
                    <div className="font-semibold text-white text-xs">Stage Progression</div>
                    <div className="text-[11px] text-slate-400">
                      {isR1Complete ? 'Stage 01 A Complete • Stage 01 B Unlocked' : 'Complete Stage 01 A to unlock Stage 01 B'}
                    </div>
                  </div>
                </div>

                {!isR1Complete && (
                  <button
                    type="button"
                    onClick={() => setRound1Submitted(true)}
                    className="px-2 py-1 rounded bg-white/[0.05] hover:bg-white/[0.1] text-[11px] text-sky-400 font-mono border border-sky-500/30 hover:border-sky-400 transition-colors cursor-pointer flex items-center gap-1 shrink-0"
                    title="Unlock Stage 01 B for testing"
                  >
                    <Unlock className="w-3 h-3" />
                    <span>Unlock</span>
                  </button>
                )}
              </div>

            </div>

          </div>

        </div>

        {/* ========================================================================= */}
        {/* 3. THE THREE ASSESSMENT STAGES (Clean 3-Card Grid)                        */}
        {/* ========================================================================= */}
        <div className="mt-10 sm:mt-14 pt-8 border-t border-white/[0.08]">
          
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-1 mb-5">
            <div>
              <span className="text-[11px] font-mono uppercase tracking-wider text-sky-400">
                ASSESSMENT STAGES
              </span>
              <h2 className="text-base sm:text-lg font-bold text-white tracking-tight mt-0.5">
                Evaluation Workflow & Modules
              </h2>
            </div>
            <span className="text-xs text-slate-400 hidden sm:inline">
              Calibrated multi-tier technical assessment
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* Card 1: Stage 01 A */}
            <div 
              onClick={startDemo}
              className="p-5 rounded-xl bg-[#0F172A] border border-white/[0.08] hover:border-sky-500/40 cursor-pointer transition-all duration-200 hover:-translate-y-1 hover:shadow-xl group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <span className="text-[10px] font-mono font-semibold text-sky-400 uppercase px-2 py-0.5 rounded bg-sky-500/10 border border-sky-500/20">
                    STAGE 01 A • SCREENING
                  </span>
                  <span className="text-[10px] font-mono text-emerald-400 font-semibold">
                    AVAILABLE
                  </span>
                </div>
                <h3 className="text-sm sm:text-base font-bold text-white group-hover:text-sky-300 transition-colors">
                  Common Technical Screening
                </h3>
                <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                  30 calibrated questions across 8 domains: Logical Thinking, CS Fundamentals, Web Basics, Security Concepts, and Incident Triage.
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-center justify-between text-xs font-medium text-slate-300 group-hover:text-white">
                <span>Start Screening</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* Card 2: Stage 01 B */}
            <div 
              onClick={() => navigate('/technical-profile')}
              className={`p-5 rounded-xl border transition-all duration-200 cursor-pointer flex flex-col justify-between ${
                isR1Complete
                  ? 'bg-[#0F172A] border-white/[0.08] hover:border-indigo-500/40 hover:-translate-y-1 hover:shadow-xl group'
                  : 'bg-[#0F172A]/50 border-white/[0.05] opacity-75 hover:opacity-100'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <span className={`text-[10px] font-mono font-semibold uppercase px-2 py-0.5 rounded border ${
                    isR1Complete 
                      ? 'text-indigo-400 bg-indigo-500/10 border-indigo-500/30' 
                      : 'text-amber-400 bg-amber-500/10 border-amber-500/20'
                  }`}>
                    STAGE 01 B • {isR1Complete ? 'UNLOCKED' : 'LOCKED'}
                  </span>
                  {isR1Complete ? (
                    <span className="text-[10px] font-mono text-indigo-400 font-semibold">READY</span>
                  ) : (
                    <Lock className="w-3.5 h-3.5 text-amber-400" />
                  )}
                </div>
                <h3 className={`text-sm sm:text-base font-bold transition-colors ${
                  isR1Complete ? 'text-white group-hover:text-indigo-300' : 'text-slate-300'
                }`}>
                  Technical Skill Profiling
                </h3>
                <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                  Personalized technical depth: Choose your domain (Web, Python, DSA, Security, Cloud) and complete targeted letter-slot and code challenges.
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-center justify-between text-xs font-medium">
                {isR1Complete ? (
                  <>
                    <span className="text-slate-300 group-hover:text-white">Enter Profiling</span>
                    <ChevronRight className="w-4 h-4 text-slate-300 group-hover:translate-x-1 transition-transform" />
                  </>
                ) : (
                  <>
                    <span className="text-amber-400/90 text-[11px]">Requires Stage 01 A</span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setRound1Submitted(true);
                      }}
                      className="text-[11px] text-sky-400 underline hover:text-white"
                    >
                      Unlock Now
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Card 3: Stage 01 C - Optional Bonus Labs */}
            <div 
              onClick={() => navigate('/arcade')}
              className={`p-5 rounded-xl border transition-all duration-200 cursor-pointer flex flex-col justify-between ${
                isR1Complete
                  ? 'bg-[#0F172A] border-white/[0.08] hover:border-amber-400/40 hover:-translate-y-1 hover:shadow-xl group'
                  : 'bg-[#0F172A]/50 border-white/[0.05] opacity-75 hover:opacity-100'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <span className={`text-[10px] font-mono font-semibold uppercase px-2 py-0.5 rounded border ${
                    isR1Complete 
                      ? 'text-amber-400 bg-amber-400/10 border-amber-400/30' 
                      : 'text-amber-400 bg-amber-500/10 border-amber-500/20'
                  }`}>
                    STAGE 01 C • OPTIONAL BONUS
                  </span>
                  {isR1Complete ? (
                    <span className="text-[10px] font-mono text-amber-400 font-semibold">+BONUS</span>
                  ) : (
                    <Lock className="w-3.5 h-3.5 text-amber-400" />
                  )}
                </div>
                <h3 className={`text-sm sm:text-base font-bold transition-colors ${
                  isR1Complete ? 'text-white group-hover:text-amber-300' : 'text-slate-300'
                }`}>
                  Simulation Labs (Bonus)
                </h3>
                <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                  Earn extra credit with 10 hands-on interactive simulations including Network Topology, Intrusion Log Inspection, and Linux Shell Forensics.
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-center justify-between text-xs font-medium">
                {isR1Complete ? (
                  <>
                    <span className="text-amber-400 font-medium">Launch Labs</span>
                    <ChevronRight className="w-4 h-4 text-amber-400 group-hover:translate-x-1 transition-transform" />
                  </>
                ) : (
                  <>
                    <span className="text-amber-400/90 text-[11px]">Requires Stage 01 A</span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setRound1Submitted(true);
                      }}
                      className="text-[11px] text-sky-400 underline hover:text-white"
                    >
                      Unlock Now
                    </button>
                  </>
                )}
              </div>
            </div>

          </div>
        </div>

      </main>

      {/* ========================================================================= */}
      {/* 4. PROFESSIONAL PRODUCT FOOTER                                            */}
      {/* ========================================================================= */}
      <footer className="relative z-20 border-t border-white/[0.08] bg-[#060911]/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
          
          {/* Left: Organization Credibility */}
          <div className="flex flex-col sm:flex-row items-center gap-1.5 sm:gap-2 text-center sm:text-left">
            <span className="font-semibold text-white">Cyber Cell</span>
            <span className="hidden sm:inline text-white/20">&bull;</span>
            <span className="text-[11px] sm:text-xs">Samrat Ashok Technological Institute, Vidisha (M.P.)</span>
          </div>

          {/* Center: Guidelines & Requirements Modal Triggers */}
          <div className="flex items-center gap-4 text-[11px] sm:text-xs">
            <button 
              onClick={() => setActiveModal('howItWorks')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Assessment Format
            </button>
            <span className="text-white/20">&bull;</span>
            <button 
              onClick={() => setActiveModal('requirements')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              System Requirements
            </button>
          </div>

          {/* Right: Technical Version & Admin Access */}
          <div className="flex items-center gap-3 text-[11px]">
            <span className="font-mono text-slate-500">
              Recruitment v2026
            </span>
            <span className="text-white/20">&bull;</span>
            <button
              onClick={() => navigate('/admin')}
              className="text-slate-400 hover:text-sky-400 transition-colors cursor-pointer font-medium"
              title="Recruiter & Evaluation Administration"
            >
              Admin Access
            </button>
          </div>

        </div>
      </footer>

      {/* ========================================================================= */}
      {/* 5. MODALS: CLEAN PRODUCT DIALOGS                                          */}
      {/* ========================================================================= */}
      {activeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="w-full max-w-lg bg-[#0A0F1D] border border-white/[0.12] rounded-xl p-6 text-slate-200 relative shadow-2xl animate-scaleIn">
            
            <button
              onClick={() => setActiveModal(null)}
              className="absolute top-4 right-4 p-1 rounded-md text-slate-400 hover:text-white hover:bg-white/[0.05] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {activeModal === 'howItWorks' && (
              <div className="space-y-4">
                <div className="flex items-center gap-2.5 pb-2 border-b border-white/[0.08]">
                  <HelpCircle className="w-5 h-5 text-sky-400" />
                  <h3 className="text-base font-bold text-white">
                    Recruitment Assessment Structure
                  </h3>
                </div>

                <div className="space-y-3 text-xs text-slate-300 leading-relaxed">
                  <p>
                    <strong className="text-white">1. Stage 01 A (Common Screening):</strong> 30 calibrated questions across logical reasoning, computer science fundamentals, web concepts, and security scenarios.
                  </p>
                  <p>
                    <strong className="text-white">2. Stage 01 B (Skill Profiling):</strong> Candidates declare their technical skills (Web, Python, DSA, Security, Cloud, etc.) and complete targeted fill-in-the-blank slots and questions.
                  </p>
                  <p>
                    <strong className="text-white">3. Stage 01 C (Bonus Labs):</strong> Optional hands-on simulations for candidates wishing to demonstrate practical depth and earn bonus credit.
                  </p>
                  <p>
                    <strong className="text-white">4. Integrity & Proctoring:</strong> Continuous fullscreen and webcam presence are monitored. Unsanctioned app or tab switching will skip the active question with negative marking.
                  </p>
                </div>
              </div>
            )}

            {activeModal === 'requirements' && (
              <div className="space-y-4">
                <div className="flex items-center gap-2.5 pb-2 border-b border-white/[0.08]">
                  <Monitor className="w-5 h-5 text-sky-400" />
                  <h3 className="text-base font-bold text-white">
                    Hardware & System Requirements
                  </h3>
                </div>

                <div className="space-y-2.5 text-xs text-slate-300">
                  <div className="p-2.5 rounded-lg bg-[#060911] border border-white/[0.06]">
                    <span className="font-semibold text-white block">Device Compatibility</span>
                    <span className="text-slate-400">Supported on all modern smartphones, laptops, and desktop computers.</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-[#060911] border border-white/[0.06]">
                    <span className="font-semibold text-white block">Browser</span>
                    <span className="text-slate-400">Google Chrome, Microsoft Edge, Safari, or Firefox.</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-[#060911] border border-white/[0.06]">
                    <span className="font-semibold text-white block">Camera Permission</span>
                    <span className="text-slate-400">Webcam access required during recruitment mode for continuous proctoring.</span>
                  </div>
                </div>
              </div>
            )}

            <button
              onClick={() => setActiveModal(null)}
              className="mt-6 w-full py-2.5 bg-white text-slate-950 text-xs font-bold uppercase tracking-wider rounded-lg transition-colors cursor-pointer hover:bg-slate-200"
            >
              Close
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
