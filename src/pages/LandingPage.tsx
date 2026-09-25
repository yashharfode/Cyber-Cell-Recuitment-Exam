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
  Sliders,
  HelpCircle,
  Monitor
} from 'lucide-react';
import { useStore } from '../store/useStore';

export default function LandingPage() {
  const navigate = useNavigate();
  const { setMode, isRound1Submitted, setRound1Submitted, score, completedMissionIds, attemptId } = useStore();
  const [activeModal, setActiveModal] = useState<'controls' | 'howItWorks' | 'requirements' | null>(null);

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
    <div className="min-h-screen bg-[#05070D] text-[#EAF7F5] font-sans flex flex-col justify-between selection:bg-[#00FFCC]/20 selection:text-[#00FFCC] relative">
      
      {/* Background Architectural Grid: Controlled, subtle, enterprise-grade */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.035]"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(255, 255, 255, 0.3) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 255, 255, 0.3) 1px, transparent 1px)
          `,
          backgroundSize: '48px 48px'
        }}
      />
      
      {/* Very faint ambient light focused behind the hero content - restrained, no neon bloom */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[350px] bg-[#00FFCC]/[0.025] rounded-full blur-[140px] pointer-events-none" />

      {/* ========================================================================= */}
      {/* 1. PROFESSIONAL PRODUCT HEADER                                            */}
      {/* ========================================================================= */}
      <header className="relative z-20 border-b border-white/[0.08] bg-[#060911]/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-4 flex items-center justify-between">
          
          {/* Organization Identity */}
          <div className="flex items-center gap-3.5">
            {/* Cyber Cell Emblem: Precision Geometric Monogram */}
            <div className="w-10 h-10 rounded-md bg-[#0A0F1D] border border-[#00FFCC]/30 flex items-center justify-center relative overflow-hidden group shadow-sm">
              <div className="absolute inset-0 bg-gradient-to-br from-[#00FFCC]/10 to-transparent" />
              <div className="relative font-mono text-xs font-bold tracking-tight text-[#00FFCC]">
                CC
              </div>
            </div>
            
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold tracking-tight text-white uppercase">
                  CYBER CELL
                </span>
                <span className="text-[10px] font-mono text-[#00FFCC] px-1.5 py-0.5 rounded bg-[#00FFCC]/10 border border-[#00FFCC]/20 font-medium">
                  SATI
                </span>
              </div>
              <span className="text-xs text-[#8DA3A0]">
                Cybersecurity Club • SATI Vidisha
              </span>
            </div>
          </div>

          {/* Center Badge (Desktop) */}
          <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-md bg-white/[0.03] border border-white/[0.08] text-xs font-medium text-[#8DA3A0]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00FFCC]" />
            <span>TECHNICAL RECRUITMENT 2026</span>
          </div>

          {/* Right Status Indicator */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-[#0A0F1D] border border-white/[0.08] text-xs font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[#8DA3A0] hidden sm:inline">SYSTEM STATUS:</span>
              <span className="text-white font-medium">OPERATIONAL</span>
            </div>
          </div>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* 2. HERO SECTION: 12-COLUMN ASYMMETRIC GRID                                */}
      {/* ========================================================================= */}
      <main className="relative z-10 flex-1 max-w-7xl mx-auto w-full px-6 lg:px-12 py-10 lg:py-16 flex flex-col justify-center">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          
          {/* LEFT COLUMN: Editorial Typography & Intentional Actions (~58%) */}
          <div className="lg:col-span-7 flex flex-col items-start space-y-6">
            
            {/* Eyebrow Label */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono uppercase tracking-wider text-[#00FFCC] font-semibold">
                ROUND 01 • TECHNICAL EVALUATION
              </span>
              <span className="text-white/20">•</span>
              <span className="text-xs font-mono text-[#8DA3A0]">
                VER 01.0
              </span>
            </div>

            {/* Main Editorial Title: Two-Line Controlled Structure */}
            <div className="space-y-1">
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white uppercase leading-[0.95]">
                OPERATION
                <span className="block text-[#00FFCC]">ZERO-DAY</span>
              </h1>
              <p className="text-base sm:text-lg font-medium text-[#8DA3A0] pt-2">
                Technical Assessment Environment
              </p>
            </div>

            {/* Briefing Narrative */}
            <p className="text-sm sm:text-base text-[#BAC8C5] leading-relaxed max-w-xl">
              A simulated incident-response environment designed to evaluate technical thinking, problem solving, and practical capability. Investigate live telemetry, diagnose threats, and demonstrate core technical aptitude.
            </p>

            {/* Primary & Secondary Call to Actions */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 w-full sm:w-auto">
              
              {/* Primary Action: High-emphasis, clean solid cyan, 4-6px radius, no excessive glow */}
              <button
                onClick={startRecruitment}
                className="h-12 px-7 rounded-md bg-[#00FFCC] hover:bg-[#1affa3] text-[#05070D] font-bold text-sm tracking-wide transition-all duration-150 flex items-center justify-center gap-2.5 shadow-sm active:translate-y-0.5 cursor-pointer"
              >
                <Terminal className="w-4 h-4 stroke-[2.5]" />
                <span>ENTER RECRUITMENT</span>
              </button>

              {/* Secondary Action: Restrained, crisp product button */}
              <button
                onClick={startDemo}
                className="h-12 px-6 rounded-md bg-[#0C121E] hover:bg-[#121A2B] text-white border border-white/[0.12] hover:border-white/[0.25] font-semibold text-sm transition-all duration-150 flex items-center justify-center gap-2.5 cursor-pointer"
              >
                <Play className="w-3.5 h-3.5 fill-current text-[#00FFCC]" />
                <span>PLAY DEMO</span>
              </button>
            </div>

            {/* Assessment Parameter Metadata Badges */}
            <div className="pt-4 grid grid-cols-2 sm:grid-cols-4 gap-4 border-t border-white/[0.08] w-full max-w-xl">
              <div>
                <span className="text-[11px] font-mono text-[#8DA3A0] uppercase block">
                  Duration
                </span>
                <span className="text-xs font-semibold text-white mt-0.5 block">
                  30–50 Minutes
                </span>
              </div>

              <div>
                <span className="text-[11px] font-mono text-[#8DA3A0] uppercase block">
                  Assessment
                </span>
                <span className="text-xs font-semibold text-white mt-0.5 block">
                  Multi-Skill Profiling
                </span>
              </div>

              <div>
                <span className="text-[11px] font-mono text-[#8DA3A0] uppercase block">
                  Policy
                </span>
                <span className="text-xs font-semibold text-white mt-0.5 block">
                  One Attempt
                </span>
              </div>

              <div>
                <span className="text-[11px] font-mono text-[#8DA3A0] uppercase block">
                  Environment
                </span>
                <span className="text-xs font-semibold text-white mt-0.5 block">
                  Browser-Based
                </span>
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN: Realistic SOC Mission Panel & Pipeline (~42%) */}
          <div className="lg:col-span-5 flex flex-col space-y-4">
            
            {/* Live Operational Status Card */}
            <div className="p-6 rounded-lg bg-[#0A0F1D] border border-white/[0.08] shadow-sm relative overflow-hidden">
              <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-[#00FFCC]" />
                  <span className="text-xs font-mono font-bold uppercase text-white tracking-wider">
                    MISSION STATUS
                  </span>
                </div>
                <span className="text-[11px] font-mono text-[#8DA3A0]">
                  ROUND 01 • SOC SCREENING
                </span>
              </div>

              {/* Story / Mission Briefing */}
              <div className="py-4 space-y-3">
                <div className="text-xs text-[#BAC8C5] leading-relaxed">
                  A simulated institutional network has reported anomalous telemetry and credential degradation. Your objective is to isolate unauthorized intrusions, correct defensive configurations, and record technical benchmarks.
                </div>
                
                <div className="p-3 rounded-md bg-[#060911] border border-white/[0.06] text-xs text-[#8DA3A0] flex items-start gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-[#00FFCC] shrink-0 mt-0.5" />
                  <span>
                    No prior cybersecurity specialization is required for the common assessment. Open to all technical streams and beginners.
                  </span>
                </div>
              </div>

              {/* Functional Systems Telemetry Readout */}
              <div className="pt-3 border-t border-white/[0.08] grid grid-cols-2 gap-3 text-xs font-mono">
                <div className="p-2.5 rounded bg-[#060911] border border-white/[0.06]">
                  <span className="text-[10px] text-[#8DA3A0] block">CAMPUS NETWORK</span>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-white font-bold">91%</span>
                    <span className="text-[10px] text-emerald-400">STABLE</span>
                  </div>
                  <div className="w-full bg-white/10 h-1 rounded-full mt-1.5 overflow-hidden">
                    <div className="bg-[#00FFCC] h-full rounded-full" style={{ width: '91%' }} />
                  </div>
                </div>

                <div className="p-2.5 rounded bg-[#060911] border border-white/[0.06]">
                  <span className="text-[10px] text-[#8DA3A0] block">EVALUATION CORES</span>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-white font-bold">12 / 12</span>
                    <span className="text-[10px] text-[#00FFCC]">ONLINE</span>
                  </div>
                  <div className="w-full bg-white/10 h-1 rounded-full mt-1.5 overflow-hidden">
                    <div className="bg-[#00FFCC] h-full rounded-full" style={{ width: '100%' }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Sequential Stage Unlocking Status Card */}
            <div className="p-4 rounded-lg bg-[#0A0F1D]/80 border border-white/[0.08] flex items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-md bg-[#00FFCC]/10 border border-[#00FFCC]/20 flex items-center justify-center text-[#00FFCC] font-mono font-bold text-xs">
                  01
                </div>
                <div>
                  <div className="font-semibold text-white">Stage Progression</div>
                  <div className="text-[11px] text-[#8DA3A0]">
                    {isR1Complete ? 'Round 01 A Complete • Round 01 B Unlocked' : 'Submit Round 01 A to unlock Round 01 B Profiling'}
                  </div>
                </div>
              </div>

              {!isR1Complete && (
                <button
                  type="button"
                  onClick={() => setRound1Submitted(true)}
                  className="px-2.5 py-1 rounded bg-white/[0.05] hover:bg-white/[0.1] text-xs text-[#00FFCC] font-mono border border-[#00FFCC]/30 hover:border-[#00FFCC] transition-colors cursor-pointer flex items-center gap-1.5 shrink-0"
                  title="Mark Round 01 A complete for testing"
                >
                  <Unlock className="w-3 h-3" />
                  <span>Unlock</span>
                </button>
              )}
            </div>

          </div>

        </div>

        {/* ========================================================================= */}
        {/* 3. WHAT YOU'LL DO: 4-STEP PRODUCT PROCESS (Product Clarity)               */}
        {/* ========================================================================= */}
        <div className="mt-14 lg:mt-20 pt-10 border-t border-white/[0.08]">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 mb-6">
            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-[#00FFCC]">
                EVALUATION WORKFLOW
              </span>
              <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight mt-0.5">
                What You'll Do During The Assessment
              </h2>
            </div>
            <span className="text-xs text-[#8DA3A0]">
              Objective, calibrated performance measurement
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            <div className="p-4 rounded-md bg-[#0A0F1D] border border-white/[0.06] hover:border-white/[0.12] transition-colors">
              <div className="text-xs font-mono font-bold text-[#00FFCC] mb-2">
                01 &bull; INVESTIGATE
              </div>
              <h3 className="text-sm font-semibold text-white mb-1">
                Explore The Cyber Room
              </h3>
              <p className="text-xs text-[#8DA3A0] leading-relaxed">
                Navigate the 3D terminal stations and inspect live institutional telemetry to identify alerts.
              </p>
            </div>

            <div className="p-4 rounded-md bg-[#0A0F1D] border border-white/[0.06] hover:border-white/[0.12] transition-colors">
              <div className="text-xs font-mono font-bold text-[#00FFCC] mb-2">
                02 &bull; SOLVE
              </div>
              <h3 className="text-sm font-semibold text-white mb-1">
                Solve Technical Challenges
              </h3>
              <p className="text-xs text-[#8DA3A0] leading-relaxed">
                Answer calibrated questions across programming, logic, networking, and system forensics.
              </p>
            </div>

            <div className="p-4 rounded-md bg-[#0A0F1D] border border-white/[0.06] hover:border-white/[0.12] transition-colors">
              <div className="text-xs font-mono font-bold text-[#00FFCC] mb-2">
                03 &bull; DEMONSTRATE
              </div>
              <h3 className="text-sm font-semibold text-white mb-1">
                Hands-On Profiling
              </h3>
              <p className="text-xs text-[#8DA3A0] leading-relaxed">
                Declare your specific technical skills in Round 01 B and complete letter-slot and lab evaluations.
              </p>
            </div>

            <div className="p-4 rounded-md bg-[#0A0F1D] border border-white/[0.06] hover:border-white/[0.12] transition-colors">
              <div className="text-xs font-mono font-bold text-[#00FFCC] mb-2">
                04 &bull; BENCHMARK
              </div>
              <h3 className="text-sm font-semibold text-white mb-1">
                Receive Performance Dossier
              </h3>
              <p className="text-xs text-[#8DA3A0] leading-relaxed">
                Generate an automated candidate diagnostic profiling your verified strengths and competencies.
              </p>
            </div>

          </div>
        </div>

        {/* ========================================================================= */}
        {/* 4. THREE OPERATIONAL ASSESSMENT TRACKS (Clean Enterprise Cards)           */}
        {/* ========================================================================= */}
        <div className="mt-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            
            {/* Card 1: Round 01 A */}
            <div 
              onClick={startDemo}
              className="p-5 rounded-lg bg-[#0A0F1D] border border-white/[0.08] hover:border-[#00FFCC]/50 cursor-pointer transition-all duration-150 group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-mono font-bold text-[#00FFCC] uppercase px-2 py-0.5 rounded bg-[#00FFCC]/10 border border-[#00FFCC]/20">
                    STAGE 01 A • SCREENING
                  </span>
                  <span className="text-[10px] font-mono text-emerald-400 font-semibold">
                    AVAILABLE
                  </span>
                </div>
                <h3 className="text-base font-bold text-white group-hover:text-[#00FFCC] transition-colors">
                  Common SOC Assessment
                </h3>
                <p className="text-xs text-[#8DA3A0] mt-1.5 leading-relaxed">
                  Foundational screening inside the 3D Cyber Room: 30 calibrated questions & puzzles across technical logic, networking, and security.
                </p>
              </div>

              <div className="mt-5 pt-3 border-t border-white/[0.06] flex items-center justify-between text-xs font-medium text-[#00FFCC]">
                <span>Launch Assessment</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* Card 2: Round 01 B */}
            <div 
              onClick={() => navigate('/technical-profile')}
              className={`p-5 rounded-lg border transition-all duration-150 cursor-pointer flex flex-col justify-between ${
                isR1Complete
                  ? 'bg-[#0A0F1D] border-white/[0.08] hover:border-[#7000ff]/60 group'
                  : 'bg-[#0A0F1D]/50 border-white/[0.05] opacity-80 hover:opacity-100'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className={`text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded border ${
                    isR1Complete 
                      ? 'text-[#a855f7] bg-[#a855f7]/10 border-[#a855f7]/30' 
                      : 'text-amber-400 bg-amber-500/10 border-amber-500/20'
                  }`}>
                    STAGE 01 B • {isR1Complete ? 'UNLOCKED' : 'LOCKED'}
                  </span>
                  {isR1Complete ? (
                    <span className="text-[10px] font-mono text-[#a855f7] font-semibold">READY</span>
                  ) : (
                    <Lock className="w-3.5 h-3.5 text-amber-400" />
                  )}
                </div>
                <h3 className={`text-base font-bold transition-colors ${
                  isR1Complete ? 'text-white group-hover:text-[#a855f7]' : 'text-slate-300'
                }`}>
                  Technical Skill Profiling
                </h3>
                <p className="text-xs text-[#8DA3A0] mt-1.5 leading-relaxed">
                  {isR1Complete 
                    ? 'Personalized technical depth: Declare your specific skills, answer fill-in-the-blank letter slots, and run practical labs.'
                    : 'Prerequisite required: Submit Round 01 A first to generate your baseline and unlock personalized profiling.'}
                </p>
              </div>

              <div className="mt-5 pt-3 border-t border-white/[0.06] flex items-center justify-between text-xs font-medium">
                {isR1Complete ? (
                  <>
                    <span className="text-[#a855f7]">Enter Skill Profiling</span>
                    <ChevronRight className="w-4 h-4 text-[#a855f7] group-hover:translate-x-1 transition-transform" />
                  </>
                ) : (
                  <>
                    <span className="text-amber-400/90 text-[11px]">Requires Round 01 A</span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setRound1Submitted(true);
                      }}
                      className="text-[11px] text-[#00FFCC] underline hover:text-white"
                    >
                      Unlock Now
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Card 3: Cyber Arcade */}
            <div 
              onClick={() => navigate('/arcade')}
              className={`p-5 rounded-lg border transition-all duration-150 cursor-pointer flex flex-col justify-between ${
                isR1Complete
                  ? 'bg-[#0A0F1D] border-white/[0.08] hover:border-amber-400/50 group'
                  : 'bg-[#0A0F1D]/50 border-white/[0.05] opacity-80 hover:opacity-100'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className={`text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded border ${
                    isR1Complete 
                      ? 'text-amber-400 bg-amber-400/10 border-amber-400/30' 
                      : 'text-amber-400 bg-amber-500/10 border-amber-500/20'
                  }`}>
                    LAB • {isR1Complete ? 'PRACTICE READY' : 'LOCKED'}
                  </span>
                  {isR1Complete ? (
                    <span className="text-[10px] font-mono text-amber-400 font-semibold">10 PUZZLES</span>
                  ) : (
                    <Lock className="w-3.5 h-3.5 text-amber-400" />
                  )}
                </div>
                <h3 className={`text-base font-bold transition-colors ${
                  isR1Complete ? 'text-white group-hover:text-amber-400' : 'text-slate-300'
                }`}>
                  Simulation Lab & Skill Tree
                </h3>
                <p className="text-xs text-[#8DA3A0] mt-1.5 leading-relaxed">
                  10 interactive simulations including Network Topology, Intrusion Log Inspection, Password Entropy, and Linux Shell Forensics.
                </p>
              </div>

              <div className="mt-5 pt-3 border-t border-white/[0.06] flex items-center justify-between text-xs font-medium">
                {isR1Complete ? (
                  <>
                    <span className="text-amber-400">Open Simulation Lab</span>
                    <ChevronRight className="w-4 h-4 text-amber-400 group-hover:translate-x-1 transition-transform" />
                  </>
                ) : (
                  <>
                    <span className="text-amber-400/90 text-[11px]">Requires Round 01 A</span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setRound1Submitted(true);
                      }}
                      className="text-[11px] text-[#00FFCC] underline hover:text-white"
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
      {/* 5. PROFESSIONAL FOOTER                                                    */}
      {/* ========================================================================= */}
      <footer className="relative z-20 border-t border-white/[0.08] bg-[#060911]/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-[#8DA3A0]">
          
          {/* Left: Organization Credibility */}
          <div className="flex flex-col sm:flex-row items-center gap-2 text-center sm:text-left">
            <span className="font-semibold text-white">Cyber Cell</span>
            <span className="hidden sm:inline text-white/20">&bull;</span>
            <span>Samrat Ashok Technological Institute, Vidisha (M.P.)</span>
          </div>

          {/* Center: Helpful Modal Links */}
          <div className="flex items-center gap-5">
            <button 
              onClick={() => setActiveModal('controls')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Controls Guide
            </button>
            <span className="text-white/20">&bull;</span>
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

          {/* Right: Technical Version & Discreet Admin Access */}
          <div className="flex items-center gap-3">
            <span className="font-mono text-[11px] text-[#8DA3A0]">
              Operation Zero-Day v1.0
            </span>
            <span className="text-white/20">&bull;</span>
            <button
              onClick={() => navigate('/admin')}
              className="text-[#8DA3A0] hover:text-[#00FFCC] transition-colors cursor-pointer font-medium text-[11px]"
              title="Recruiter & Evaluation Administration"
            >
              Admin Access
            </button>
          </div>

        </div>
      </footer>

      {/* ========================================================================= */}
      {/* 6. MODALS: CLEAN PRODUCT DIALOGS                                          */}
      {/* ========================================================================= */}
      {activeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="w-full max-w-lg bg-[#0A0F1D] border border-white/[0.12] rounded-lg p-6 text-[#EAF7F5] relative shadow-2xl">
            
            <button
              onClick={() => setActiveModal(null)}
              className="absolute top-4 right-4 p-1 rounded-md text-[#8DA3A0] hover:text-white hover:bg-white/[0.05] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {activeModal === 'controls' && (
              <div className="space-y-4">
                <div className="flex items-center gap-2.5 pb-2 border-b border-white/[0.08]">
                  <Sliders className="w-5 h-5 text-[#00FFCC]" />
                  <h3 className="text-base font-bold text-white">
                    Candidate Navigation & Controls
                  </h3>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="p-3 rounded bg-[#060911] border border-white/[0.06] flex justify-between items-center">
                    <span className="font-mono font-bold text-white">W / A / S / D</span>
                    <span className="text-[#8DA3A0]">Walk forward, left, backward, right</span>
                  </div>
                  <div className="p-3 rounded bg-[#060911] border border-white/[0.06] flex justify-between items-center">
                    <span className="font-mono font-bold text-white">MOUSE MOVEMENT</span>
                    <span className="text-[#8DA3A0]">Look around 360° (first-person view)</span>
                  </div>
                  <div className="p-3 rounded bg-[#060911] border border-white/[0.06] flex justify-between items-center">
                    <span className="font-mono font-bold text-white">[E] KEY OR CLICK</span>
                    <span className="text-[#8DA3A0]">Interact with active terminal console</span>
                  </div>
                  <div className="p-3 rounded bg-[#060911] border border-white/[0.06] flex justify-between items-center">
                    <span className="font-mono font-bold text-white">ESC</span>
                    <span className="text-[#8DA3A0]">Release mouse cursor lock</span>
                  </div>
                </div>
              </div>
            )}

            {activeModal === 'howItWorks' && (
              <div className="space-y-4">
                <div className="flex items-center gap-2.5 pb-2 border-b border-white/[0.08]">
                  <HelpCircle className="w-5 h-5 text-[#00FFCC]" />
                  <h3 className="text-base font-bold text-white">
                    Recruitment Assessment Structure
                  </h3>
                </div>

                <div className="space-y-3 text-xs text-[#BAC8C5] leading-relaxed">
                  <p>
                    <strong className="text-white">1. Stage 01 A (Common Screening):</strong> All candidates complete a 3D simulated incident environment featuring 30 questions across logic, networking, and computing concepts.
                  </p>
                  <p>
                    <strong className="text-white">2. Stage 01 B (Skill Profiling):</strong> Candidates declare their technical skills (Web, Python, DSA, Security, Cloud, etc.) and complete calibrated knowledge, letter-slot, and lab challenges.
                  </p>
                  <p>
                    <strong className="text-white">3. Integrity & Proctoring:</strong> Continuous fullscreen mode is strictly required. Unsanctioned tab switching or window minimization triggers negative marking.
                  </p>
                  <p>
                    <strong className="text-white">4. Objective Evaluation:</strong> Submissions are automatically scored against technical criteria to form a transparent diagnostic dossier.
                  </p>
                </div>
              </div>
            )}

            {activeModal === 'requirements' && (
              <div className="space-y-4">
                <div className="flex items-center gap-2.5 pb-2 border-b border-white/[0.08]">
                  <Monitor className="w-5 h-5 text-[#00FFCC]" />
                  <h3 className="text-base font-bold text-white">
                    Hardware & Browser Requirements
                  </h3>
                </div>

                <div className="space-y-2.5 text-xs text-[#BAC8C5]">
                  <div className="p-2.5 rounded bg-[#060911] border border-white/[0.06]">
                    <span className="font-semibold text-white block">Operating Browser</span>
                    <span className="text-[#8DA3A0]">Modern Google Chrome, Microsoft Edge, or Firefox on Desktop/Laptop.</span>
                  </div>
                  <div className="p-2.5 rounded bg-[#060911] border border-white/[0.06]">
                    <span className="font-semibold text-white block">Webcam Access</span>
                    <span className="text-[#8DA3A0]">Functional camera for live proctoring verification during recruitment mode.</span>
                  </div>
                  <div className="p-2.5 rounded bg-[#060911] border border-white/[0.06]">
                    <span className="font-semibold text-white block">Display Standard</span>
                    <span className="text-[#8DA3A0]">Continuous fullscreen mode is enforced throughout all assessment rounds.</span>
                  </div>
                </div>
              </div>
            )}

            <button
              onClick={() => setActiveModal(null)}
              className="mt-6 w-full py-2.5 bg-white/[0.06] hover:bg-white/[0.1] text-white text-xs font-semibold rounded-md transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
