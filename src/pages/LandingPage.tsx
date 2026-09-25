import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Play, 
  Terminal, 
  X, 
  Menu,
  Shield, 
  Lock, 
  ShieldCheck, 
  ChevronRight,
  ChevronDown,
  ArrowRight,
  HelpCircle,
  Monitor,
  Sparkles,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Award
} from 'lucide-react';
import { useStore } from '../store/useStore';

export default function LandingPage() {
  const navigate = useNavigate();
  const { setMode, isRound1Submitted, setRound1Submitted, score, completedMissionIds, attemptId } = useStore();
  const [activeModal, setActiveModal] = useState<'howItWorks' | 'requirements' | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#080C14] text-slate-100 font-sans flex flex-col justify-between relative overflow-x-hidden selection:bg-sky-500/20 selection:text-sky-200">
      
      {/* Background Architectural Grid: Subtle & Enterprise-Grade */}
      <div 
        className="fixed inset-0 pointer-events-none opacity-[0.03] z-0"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(255, 255, 255, 0.3) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 255, 255, 0.3) 1px, transparent 1px)
          `,
          backgroundSize: '48px 48px'
        }}
      />
      
      {/* Subtle Ambient Radial Glow with Gentle Breathing Animation */}
      <div className="fixed top-[-100px] left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-sky-500/[0.04] rounded-full blur-[140px] pointer-events-none animate-pulseGlow z-0" />
      <div className="fixed bottom-[-80px] right-[-50px] w-[450px] h-[300px] bg-indigo-500/[0.03] rounded-full blur-[120px] pointer-events-none z-0" />

      {/* ========================================================================= */}
      {/* 1. CLEAN MODERN ENTERPRISE NAVBAR                                         */}
      {/* ========================================================================= */}
      <header className="sticky top-0 z-40 border-b border-white/[0.08] bg-[#080C14]/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 py-3 sm:py-3.5 flex items-center justify-between">
          
          {/* Left: Organization Identity / Brand */}
          <div 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-8 h-8 rounded-lg bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400 group-hover:border-sky-500/40 transition-colors">
              <Shield className="w-4 h-4 text-sky-400" />
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold tracking-tight text-white group-hover:text-sky-300 transition-colors">
                Cyber Cell
              </span>
              <span className="text-[10px] font-mono text-slate-400 bg-white/[0.05] border border-white/[0.08] px-1.5 py-0.5 rounded">
                SATI Vidisha
              </span>
            </div>
          </div>

          {/* Center: Real Functional Navigation Links (Desktop) */}
          <nav className="hidden md:flex items-center gap-7 text-xs font-medium text-slate-400">
            <button 
              onClick={() => scrollToSection('about-test')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              About Test
            </button>
            <button 
              onClick={() => scrollToSection('guidelines')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Guidelines
            </button>
            <button 
              onClick={() => scrollToSection('stages')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Stage 01 A & Modules
            </button>
            <button 
              onClick={() => navigate('/arcade')}
              className="hover:text-amber-300 transition-colors cursor-pointer flex items-center gap-1.5 text-slate-300"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
              <span>Bonus Labs</span>
            </button>
          </nav>

          {/* Right: Actions (Admin & Primary CTA) */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/admin')}
              className="hidden lg:inline-flex text-xs text-slate-400 hover:text-white transition-colors cursor-pointer px-2.5 py-1"
            >
              Admin Portal
            </button>

            <button
              onClick={startRecruitment}
              className="h-9 px-4 rounded-lg bg-white hover:bg-slate-200 text-slate-950 font-semibold text-xs tracking-wide transition-all shadow-sm active:scale-95 cursor-pointer flex items-center gap-1.5"
            >
              <span>Candidate Login</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.05] transition-colors cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>

        {/* Mobile Navigation Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-white/[0.08] bg-[#0A0F1D] px-5 py-4 space-y-3 animate-fadeIn">
            <div className="flex flex-col space-y-2 text-xs text-slate-300 font-medium">
              <button
                onClick={() => scrollToSection('about-test')}
                className="text-left py-2 hover:text-white transition-colors cursor-pointer"
              >
                About The Recruitment Test
              </button>
              <button
                onClick={() => scrollToSection('guidelines')}
                className="text-left py-2 hover:text-white transition-colors cursor-pointer"
              >
                Guidelines & Anti-Cheat Rules
              </button>
              <button
                onClick={() => scrollToSection('stages')}
                className="text-left py-2 hover:text-white transition-colors cursor-pointer"
              >
                Stage 01 A & Assessment Modules
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  navigate('/arcade');
                }}
                className="text-left py-2 text-amber-400 hover:text-amber-300 transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                <span>Bonus Simulation Labs</span>
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  navigate('/admin');
                }}
                className="text-left py-2 text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                Admin Evaluation Portal
              </button>
            </div>
          </div>
        )}
      </header>

      {/* ========================================================================= */}
      {/* 2. LAPTOP HERO VIEWPORT (Above the Fold - Minimalist & High Impact)        */}
      {/* ========================================================================= */}
      <section className="relative z-10 min-h-[calc(100vh-65px)] flex flex-col justify-between max-w-5xl mx-auto w-full px-4 sm:px-8 py-10 sm:py-14 text-center animate-fadeIn">
        
        {/* Empty flex balance item for vertical centering */}
        <div className="hidden sm:block" />

        {/* Core Hero Content Block */}
        <div className="flex flex-col items-center space-y-6 sm:space-y-7 my-auto">
          
          {/* Eyebrow Tag */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.1] text-sky-400 text-xs font-mono font-medium shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse" />
            <span>CYBER CELL • TECHNICAL RECRUITMENT 2026</span>
          </div>

          {/* Main Hero Headline */}
          <div className="space-y-2 max-w-4xl">
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white uppercase leading-[0.98]">
              CYBER CELL
              <span className="block text-slate-300">ENTRANCE ASSESSMENT</span>
            </h1>
            <p className="text-sm sm:text-base md:text-lg text-slate-400 font-normal max-w-2xl mx-auto pt-2 leading-relaxed">
              The official standardized technical evaluation for SATI's premier technology club. Designed to measure problem-solving, computing fundamentals, and engineering capability.
            </p>
          </div>

          {/* Primary High-Contrast Actions */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3.5 w-full sm:w-auto">
            <button
              onClick={startRecruitment}
              className="w-full sm:w-auto h-12 px-8 rounded-lg bg-white hover:bg-slate-100 text-slate-950 font-bold text-sm tracking-wide transition-all duration-200 flex items-center justify-center gap-2.5 shadow-xl shadow-white/5 hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
            >
              <Terminal className="w-4 h-4 stroke-[2.5] text-slate-950" />
              <span>ENTER RECRUITMENT</span>
              <ArrowRight className="w-4 h-4 stroke-[2.5] text-slate-950" />
            </button>

            <button
              onClick={startDemo}
              className="w-full sm:w-auto h-12 px-7 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-slate-200 hover:text-white border border-white/[0.1] hover:border-white/20 font-semibold text-sm transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer hover:-translate-y-0.5 active:translate-y-0"
            >
              <Play className="w-3.5 h-3.5 fill-current text-sky-400" />
              <span>PRACTICE DEMO</span>
            </button>
          </div>

          {/* Minimalist Specs Strip */}
          <div className="pt-6 flex flex-wrap items-center justify-center gap-y-2 gap-x-6 text-xs text-slate-400 font-mono">
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              <span>45 Mins Duration</span>
            </span>
            <span className="text-white/20 hidden sm:inline">•</span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-sky-400" />
              <span>30 MCQs + Depth</span>
            </span>
            <span className="text-white/20 hidden sm:inline">•</span>
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Proctored Session</span>
            </span>
            <span className="text-white/20 hidden sm:inline">•</span>
            <span className="flex items-center gap-1.5">
              <Monitor className="w-3.5 h-3.5 text-slate-300" />
              <span>Mobile & Laptop Ready</span>
            </span>
          </div>

        </div>

        {/* Scroll Prompt at the bottom of the fold */}
        <div className="pt-8 pb-2 flex flex-col items-center justify-center">
          <button 
            onClick={() => scrollToSection('about-test')}
            className="group flex flex-col items-center gap-1.5 text-xs text-slate-500 hover:text-slate-300 transition-colors cursor-pointer"
          >
            <span className="font-mono text-[11px] tracking-wider uppercase">Scroll To Explore Details</span>
            <ChevronDown className="w-4 h-4 text-sky-400 group-hover:translate-y-1 transition-transform animate-bounce" />
          </button>
        </div>

      </section>

      {/* ========================================================================= */}
      {/* 3. SCROLL SECTION 1: ABOUT THE RECRUITMENT TEST                           */}
      {/* ========================================================================= */}
      <section id="about-test" className="relative z-10 max-w-6xl mx-auto w-full px-4 sm:px-8 py-16 sm:py-20 border-t border-white/[0.08] scroll-mt-14">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-sky-400 font-semibold mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>OVERVIEW & ELIGIBILITY</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              About The Recruitment Test
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 max-w-md leading-relaxed">
            Calibrated evaluation framework tailored to identify raw problem-solving capability, computational thinking, and engineering passion.
          </p>
        </div>

        {/* 3 Value Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          
          <div className="p-6 rounded-xl bg-[#0F172A] border border-white/[0.08] hover:border-white/[0.15] transition-all space-y-3">
            <div className="w-10 h-10 rounded-lg bg-sky-500/10 border border-sky-500/20 text-sky-400 flex items-center justify-center font-mono font-bold text-sm">
              01
            </div>
            <h3 className="text-base font-bold text-white">
              Open To All Branches
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Open to 1st, 2nd, and 3rd-year students from all departments (CSE, IT, AI/DS, ECE, Mechanical, Civil). No prior specialized cybersecurity training is required.
            </p>
          </div>

          <div className="p-6 rounded-xl bg-[#0F172A] border border-white/[0.08] hover:border-white/[0.15] transition-all space-y-3">
            <div className="w-10 h-10 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center font-mono font-bold text-sm">
              02
            </div>
            <h3 className="text-base font-bold text-white">
              Logic & Core Aptitude
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Stage 01 A tests foundational computational logic, deduction, pattern recognition, basic networking, and analytical clarity with immediate scoring.
            </p>
          </div>

          <div className="p-6 rounded-xl bg-[#0F172A] border border-white/[0.08] hover:border-white/[0.15] transition-all space-y-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center font-mono font-bold text-sm">
              03
            </div>
            <h3 className="text-base font-bold text-white">
              Objective & Bias-Free
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Every candidate is evaluated through an automated test engine that generates an individual diagnostic dossier measuring accuracy, time-spent, and domain strengths.
            </p>
          </div>

        </div>

      </section>

      {/* ========================================================================= */}
      {/* 4. SCROLL SECTION 2: GUIDELINES & ANTI-CHEAT RULES                        */}
      {/* ========================================================================= */}
      <section id="guidelines" className="relative z-10 max-w-6xl mx-auto w-full px-4 sm:px-8 py-16 sm:py-20 border-t border-white/[0.08] scroll-mt-14">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-amber-400 font-semibold mb-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>RULES & COMPLIANCE</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Examination Guidelines & Anti-Cheat
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 max-w-md leading-relaxed">
            Strict automated proctoring monitors every session to guarantee equal opportunity and fair merit.
          </p>
        </div>

        {/* 4 Clean Guidelines Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          <div className="p-5 rounded-xl bg-[#0F172A] border border-white/[0.08] space-y-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-white">
              Continuous Fullscreen
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Exiting fullscreen mode while answering a question immediately skips it and records a <strong className="text-rose-400">-50 PTS penalty</strong>.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-[#0F172A] border border-white/[0.08] space-y-2.5">
            <div className="w-8 h-8 rounded-lg bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
              <Shield className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-white">
              No Tab / App Switching
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Switching browser tabs or mobile apps (WhatsApp, Lens, ChatGPT) is strictly prohibited and immediately penalizes the question.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-[#0F172A] border border-white/[0.08] space-y-2.5">
            <div className="w-8 h-8 rounded-lg bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400">
              <Monitor className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-white">
              Webcam Proctoring
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Live webcam proctoring runs in the HUD corner throughout the exam to verify candidate presence and identity integrity.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-[#0F172A] border border-white/[0.08] space-y-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-white">
              Smooth Mobile Mode
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              No headache of 3D controls on mobile phones: questions open sequentially in clean direct view with large touch targets.
            </p>
          </div>

        </div>

      </section>

      {/* ========================================================================= */}
      {/* 5. SCROLL SECTION 3: ASSESSMENT STAGES STARTING WITH STAGE 01 A           */}
      {/* ========================================================================= */}
      <section id="stages" className="relative z-10 max-w-6xl mx-auto w-full px-4 sm:px-8 py-16 sm:py-20 border-t border-white/[0.08] scroll-mt-14">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-sky-400 font-semibold mb-1">
              <Award className="w-3.5 h-3.5" />
              <span>ASSESSMENT MODULES</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Evaluation Stages
            </h2>
          </div>
          <span className="text-xs sm:text-sm text-slate-400">
            Complete Stage 01 A to unlock Stage 01 B Profiling
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          
          {/* Card 1: Stage 01 A - Highlighted as the Starting Gate */}
          <div 
            onClick={startDemo}
            className="p-6 rounded-xl bg-[#0F172A] border-2 border-sky-500/40 hover:border-sky-400 cursor-pointer transition-all duration-200 hover:-translate-y-1 hover:shadow-2xl group flex flex-col justify-between relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-sky-500/10 rounded-full blur-xl pointer-events-none" />
            
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-mono font-bold text-sky-400 uppercase px-2.5 py-0.5 rounded bg-sky-500/15 border border-sky-500/30">
                  STAGE 01 A • SCREENING
                </span>
                <span className="text-[10px] font-mono text-emerald-400 font-bold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  AVAILABLE
                </span>
              </div>

              <h3 className="text-lg font-bold text-white group-hover:text-sky-300 transition-colors">
                Common Technical Screening
              </h3>

              <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                Foundational entrance screening featuring <strong>30 calibrated questions</strong> across 8 levels: Logical Thinking, CS Fundamentals, Web Basics, Security Concepts, and Incident Triage.
              </p>

              <div className="mt-4 pt-3 border-t border-white/[0.08] text-[11px] text-slate-400 font-mono space-y-1">
                <div>• Format: 30 Questions • MCQs & Logic</div>
                <div>• Environment: Direct Mode or 3D Cyber Room</div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-white/[0.08] flex items-center justify-between text-xs font-bold text-white group-hover:text-sky-300">
              <span>Start Stage 01 A Screening</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
            </div>
          </div>

          {/* Card 2: Stage 01 B */}
          <div 
            onClick={() => navigate('/technical-profile')}
            className={`p-6 rounded-xl border transition-all duration-200 cursor-pointer flex flex-col justify-between ${
              isR1Complete
                ? 'bg-[#0F172A] border-white/[0.1] hover:border-indigo-400 hover:-translate-y-1 hover:shadow-xl group'
                : 'bg-[#0F172A]/50 border-white/[0.05] opacity-75 hover:opacity-100'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className={`text-[10px] font-mono font-bold uppercase px-2.5 py-0.5 rounded border ${
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

              <h3 className={`text-lg font-bold transition-colors ${
                isR1Complete ? 'text-white group-hover:text-indigo-300' : 'text-slate-300'
              }`}>
                Technical Skill Profiling
              </h3>

              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Personalized domain depth: Select your engineering skills (Web Development, Python, DSA, Cybersecurity, or Cloud) and complete tailored fill-in-the-blank letter slots and questions.
              </p>

              <div className="mt-4 pt-3 border-t border-white/[0.06] text-[11px] text-slate-400 font-mono space-y-1">
                <div>• Format: Domain Declaration + Letter Slots</div>
                <div>• Duration: ~20 Minutes</div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-white/[0.06] flex items-center justify-between text-xs font-semibold">
              {isR1Complete ? (
                <>
                  <span className="text-slate-200 group-hover:text-white">Enter Skill Profiling</span>
                  <ChevronRight className="w-4 h-4 text-slate-200 group-hover:translate-x-1.5 transition-transform" />
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
            className={`p-6 rounded-xl border transition-all duration-200 cursor-pointer flex flex-col justify-between ${
              isR1Complete
                ? 'bg-[#0F172A] border-white/[0.1] hover:border-amber-400/50 hover:-translate-y-1 hover:shadow-xl group'
                : 'bg-[#0F172A]/50 border-white/[0.05] opacity-75 hover:opacity-100'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className={`text-[10px] font-mono font-bold uppercase px-2.5 py-0.5 rounded border ${
                  isR1Complete 
                    ? 'text-amber-400 bg-amber-400/10 border-amber-400/30' 
                    : 'text-amber-400 bg-amber-500/10 border-amber-500/20'
                }`}>
                  STAGE 01 C • OPTIONAL BONUS
                </span>
                {isR1Complete ? (
                  <span className="text-[10px] font-mono text-amber-400 font-semibold">+BONUS PTS</span>
                ) : (
                  <Lock className="w-3.5 h-3.5 text-amber-400" />
                )}
              </div>

              <h3 className={`text-lg font-bold transition-colors ${
                isR1Complete ? 'text-white group-hover:text-amber-300' : 'text-slate-300'
              }`}>
                Simulation Labs (Bonus)
              </h3>

              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Earn extra credit with 10 hands-on interactive simulations including Network Topology, Intrusion Log Inspection, Password Entropy, and Linux Shell Forensics.
              </p>

              <div className="mt-4 pt-3 border-t border-white/[0.06] text-[11px] text-slate-400 font-mono space-y-1">
                <div>• Format: 10 Interactive Labs</div>
                <div>• Credit: Optional Extra Merit Points</div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-white/[0.06] flex items-center justify-between text-xs font-semibold">
              {isR1Complete ? (
                <>
                  <span className="text-amber-400 font-medium">Launch Stage 01 C Labs</span>
                  <ChevronRight className="w-4 h-4 text-amber-400 group-hover:translate-x-1.5 transition-transform" />
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

      </section>

      {/* ========================================================================= */}
      {/* 6. PROFESSIONAL PRODUCT FOOTER                                            */}
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
      {/* 7. MODALS: CLEAN PRODUCT DIALOGS                                          */}
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
