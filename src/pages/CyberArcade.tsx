import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Gamepad2, 
  Shield, 
  Terminal, 
  Code2, 
  KeyRound, 
  Binary, 
  Search, 
  Mail, 
  Link2, 
  Eye, 
  Sliders, 
  ArrowLeft, 
  Sparkles,
  Award,
  ChevronRight,
  ExternalLink,
  Maximize2,
  EyeOff,
  AlertTriangle,
  ShieldAlert
} from 'lucide-react';
import InteractiveGameDispatcher from '../minigames/InteractiveGameDispatcher';
import SkillUnlockTree from '../minigames/SkillUnlockTree';
import { isBrowserFullscreen, enterBrowserFullscreen, FULLSCREEN_EVENTS } from '../utils/fullscreen';

interface ArcadeGameMeta {
  id: string;
  type: string;
  title: string;
  category: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  points: number;
  description: string;
  icon: any;
}

const ARCADE_GAMES: ArcadeGameMeta[] = [
  {
    id: 'game-network',
    type: 'network-builder',
    title: 'Build Secure Network',
    category: 'Architecture & Defense',
    difficulty: 'Intermediate',
    points: 150,
    description: 'Arrange perimeter firewalls, core routers, switches, and databases in proper defense-in-depth sequence.',
    icon: Shield,
  },
  {
    id: 'game-intruder',
    type: 'find-intruder',
    title: 'Find the Intruder',
    category: 'SOC Telemetry & Anomaly',
    difficulty: 'Beginner',
    points: 100,
    description: 'Inspect live campus server authentication telemetry and isolate the unauthorized foreign IP intrusion.',
    icon: Eye,
  },
  {
    id: 'game-phishing',
    type: 'phishing-hunter',
    title: 'Phishing Hunter Lab',
    category: 'Social Engineering Defense',
    difficulty: 'Beginner',
    points: 120,
    description: 'Categorize incoming webmail into Safe vs Suspicious and identify the 3 deceptive red flag indicators.',
    icon: Mail,
  },
  {
    id: 'game-match',
    type: 'match-pairs',
    title: 'Match the Pair',
    category: 'Technical Foundation',
    difficulty: 'Beginner',
    points: 100,
    description: 'Connect core technologies (DNS, RAM, CPU, HTML, Git, SQL) with their exact operational roles.',
    icon: Link2,
  },
  {
    id: 'game-code',
    type: 'code-arranger',
    title: 'Code Puzzle: Arrange Lines',
    category: 'Programming Logic',
    difficulty: 'Intermediate',
    points: 150,
    description: 'Reorder shuffled Python code blocks into a valid executable sequence to evaluate program logic.',
    icon: Code2,
  },
  {
    id: 'game-password',
    type: 'password-strength',
    title: 'Credential Entropy Lab',
    category: 'Identity Security',
    difficulty: 'Beginner',
    points: 100,
    description: 'Sort passwords into Weak/Medium/Strong buckets and assemble high-entropy characters to hit &ge;50 bits.',
    icon: KeyRound,
  },
  {
    id: 'game-binary',
    type: 'binary-puzzle',
    title: '8-Bit Binary Switch Matrix',
    category: 'Networking & Hardware',
    difficulty: 'Intermediate',
    points: 150,
    description: 'Toggle 8 hardware bit switches (128..1) to synthesize targeted decimal values and IP subnet metrics.',
    icon: Binary,
  },
  {
    id: 'game-cipher',
    type: 'cipher-wheel',
    title: 'Caesar Cipher Ring',
    category: 'Cryptography',
    difficulty: 'Beginner',
    points: 100,
    description: 'Rotate the cryptographic Caesar substitution dial to decrypt intercepted threat transmissions.',
    icon: Sliders,
  },
  {
    id: 'game-detective',
    type: 'digital-detective',
    title: 'Digital Detective Kill-Chain',
    category: 'Signature Forensics',
    difficulty: 'Advanced',
    points: 200,
    description: 'Reconstruct a multi-stage corporate breach timeline from initial phishing payload to database exfiltration.',
    icon: Search,
  },
  {
    id: 'game-terminal',
    type: 'cyber-terminal',
    title: 'Cyber Terminal Forensics',
    category: 'Linux SOC CLI',
    difficulty: 'Advanced',
    points: 250,
    description: 'Investigate system auth logs using ls, cat, grep, and decode Base64 tokens inside a simulated Linux shell.',
    icon: Terminal,
  },
];

export default function CyberArcade() {
  const navigate = useNavigate();
  const [selectedGameId, setSelectedGameId] = useState<string>('game-terminal');
  const [viewMode, setViewMode] = useState<'games' | 'tree'>('games');
  const [completedGames, setCompletedGames] = useState<Record<string, number>>({});
  const [isFullscreen, setIsFullscreen] = useState<boolean>(isBrowserFullscreen());
  const [showWarningModal, setShowWarningModal] = useState<boolean>(false);

  useEffect(() => {
    // Initial verification after slight mount delay
    const initialCheck = setTimeout(() => {
      setIsFullscreen(isBrowserFullscreen());
    }, 350);

    const handleFullscreenChange = () => {
      const fs = isBrowserFullscreen();
      setIsFullscreen(fs);
      if (!fs) {
        setShowWarningModal(true);
      }
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        setShowWarningModal(true);
      }
    };

    FULLSCREEN_EVENTS.forEach(evt => document.addEventListener(evt, handleFullscreenChange));
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      clearTimeout(initialCheck);
      FULLSCREEN_EVENTS.forEach(evt => document.removeEventListener(evt, handleFullscreenChange));
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  const handleRestoreFullscreen = async () => {
    const success = await enterBrowserFullscreen();
    if (success) {
      setIsFullscreen(true);
      setShowWarningModal(false);
    }
  };

  const currentGame = ARCADE_GAMES.find(g => g.id === selectedGameId) || ARCADE_GAMES[0];

  const handleGameSolved = (gameId: string, pts: number, isCorrect: boolean) => {
    if (isCorrect) {
      setCompletedGames(prev => ({
        ...prev,
        [gameId]: pts
      }));
    }
  };

  const totalScoreEarned = Object.values(completedGames).reduce((a, b) => a + b, 0);

  return (
    <div className="min-h-screen bg-[#05070D] text-cyber-text font-mono-cyber flex flex-col">
      {/* Top Navbar */}
      <header className="border-b border-cyber-border bg-[#070B14]/90 backdrop-blur sticky top-0 z-50 px-4 md:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/')}
            className="p-2 rounded bg-white/5 hover:bg-white/10 text-cyber-muted hover:text-white transition-all border border-white/10"
            title="Return to Base"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] tracking-widest text-cyber-primary uppercase font-bold px-2 py-0.5 bg-cyber-primary/10 border border-cyber-primary/30 rounded">
                SIMULATION LAB
              </span>
              <span className="text-xs text-cyber-muted hidden sm:inline">• OPERATION ZERO-DAY</span>
            </div>
            <h1 className="text-base md:text-lg font-bold text-white uppercase tracking-tight">
              CYBER ARCADE: HANDS-ON CHALLENGES
            </h1>
          </div>
        </div>

        {/* Score, Fullscreen Status & View Switcher */}
        <div className="flex items-center gap-3">
          {isFullscreen ? (
            <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-bold">FULLSCREEN ACTIVE</span>
            </div>
          ) : (
            <button
              onClick={handleRestoreFullscreen}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-red-500/20 border border-red-500/50 text-red-300 hover:bg-red-500/30 text-xs font-bold transition-all animate-pulse"
              title="Click to restore fullscreen"
            >
              <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
              <span>FULLSCREEN OFF • QUESTION HIDDEN</span>
            </button>
          )}

          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded bg-black/40 border border-cyber-border text-xs">
            <Award className="w-4 h-4 text-cyber-secondary" />
            <span className="text-cyber-muted">Lab Points:</span>
            <span className="font-bold text-cyber-secondary">{totalScoreEarned} XP</span>
          </div>

          <div className="flex rounded border border-cyber-border overflow-hidden">
            <button
              onClick={() => setViewMode('games')}
              className={`px-3 py-1.5 text-xs font-bold uppercase transition-all flex items-center gap-1.5 ${
                viewMode === 'games'
                  ? 'bg-cyber-primary text-black'
                  : 'bg-[#0D131F] text-cyber-muted hover:text-white'
              }`}
            >
              <Gamepad2 className="w-3.5 h-3.5" /> Puzzles
            </button>
            <button
              onClick={() => setViewMode('tree')}
              className={`px-3 py-1.5 text-xs font-bold uppercase transition-all flex items-center gap-1.5 ${
                viewMode === 'tree'
                  ? 'bg-cyber-primary text-black'
                  : 'bg-[#0D131F] text-cyber-muted hover:text-white'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" /> Skill Tree
            </button>
          </div>
        </div>
      </header>

      {/* Main Body */}
      <main className="flex-1 p-4 md:p-8 max-w-7xl mx-auto w-full">
        {viewMode === 'tree' ? (
          <div className="space-y-6">
            <SkillUnlockTree />
            <div className="p-4 rounded-lg bg-cyber-panel border border-cyber-border flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-white">Ready for Personalized Technical Profiling?</h4>
                <p className="text-xs text-cyber-muted mt-0.5">
                  Declare your actual skills in Round 01 B and complete calibrated knowledge, application, and practical lab challenges.
                </p>
              </div>
              <button
                onClick={() => navigate('/technical-profile')}
                className="px-4 py-2 bg-cyber-primary text-black font-bold text-xs uppercase tracking-wider rounded hover:bg-cyber-primary/90 flex items-center gap-2"
              >
                Enter Round 01 B <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Sidebar: Game Roster */}
            <div className="lg:col-span-4 space-y-2.5">
              <div className="flex items-center justify-between text-xs text-cyber-muted uppercase font-bold pb-1">
                <span>Select Simulation ({ARCADE_GAMES.length})</span>
                <span>{Object.keys(completedGames).length} Mastered</span>
              </div>

              <div className="space-y-2 max-h-[75vh] overflow-y-auto pr-1">
                {ARCADE_GAMES.map((game) => {
                  const Icon = game.icon;
                  const isSelected = selectedGameId === game.id;
                  const isDone = !!completedGames[game.id];

                  return (
                    <button
                      key={game.id}
                      onClick={() => {
                        setSelectedGameId(game.id);
                        if (!isBrowserFullscreen()) {
                          setShowWarningModal(true);
                        }
                      }}
                      className={`w-full p-3 rounded border text-left transition-all flex items-start gap-3 ${
                        isSelected
                          ? 'border-cyber-primary bg-cyber-primary/15 text-white shadow-[0_0_15px_rgba(0,255,204,0.15)] ring-1 ring-cyber-primary'
                          : isDone
                          ? 'border-cyber-success/40 bg-cyber-success/5 text-slate-200'
                          : 'border-cyber-border bg-[#0D131F] text-slate-300 hover:border-white/20'
                      }`}
                    >
                      <div className={`p-2 rounded mt-0.5 ${
                        isSelected
                          ? 'bg-cyber-primary text-black'
                          : isDone
                          ? 'bg-cyber-success/20 text-cyber-success'
                          : 'bg-black/50 text-cyber-primary border border-white/10'
                      }`}>
                        <Icon className="w-4 h-4" />
                      </div>

                      <div className="overflow-hidden flex-1">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold truncate text-white">{game.title}</span>
                          <span className="text-[10px] text-cyber-muted">+{game.points} XP</span>
                        </div>
                        <span className="text-[10px] text-cyber-muted block truncate mt-0.5">{game.category}</span>
                        <div className="flex items-center gap-2 mt-1.5">
                          <span className={`text-[9px] px-1.5 py-0.2 rounded font-bold uppercase ${
                            game.difficulty === 'Advanced' ? 'bg-red-500/20 text-red-300' : game.difficulty === 'Intermediate' ? 'bg-yellow-500/20 text-yellow-300' : 'bg-emerald-500/20 text-emerald-300'
                          }`}>
                            {game.difficulty}
                          </span>
                          {isDone && (
                            <span className="text-[9px] text-cyber-success font-bold uppercase">
                              &bull; Mastered
                            </span>
                          )}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Right Panel: Interactive Active Simulation */}
            <div className="lg:col-span-8 space-y-4">
              {!isFullscreen ? (
                /* Disappeared Arcade Question Security Lockdown */
                <div className="p-8 md:p-12 rounded-xl bg-[#080D1A] border-2 border-dashed border-red-500/50 text-center flex flex-col items-center justify-center space-y-5 shadow-[0_0_35px_rgba(239,68,68,0.2)] min-h-[460px] animate-fadeIn">
                  <div className="w-16 h-16 rounded-full bg-red-500/15 border border-red-500/50 flex items-center justify-center text-red-400 shadow-[0_0_20px_rgba(239,68,68,0.3)] animate-pulse">
                    <EyeOff className="w-8 h-8" />
                  </div>

                  <div className="space-y-2">
                    <span className="text-[10px] font-bold tracking-widest text-red-400 uppercase px-3 py-1 bg-red-500/10 border border-red-500/30 rounded-full inline-block">
                      INTEGRITY ENFORCEMENT ACTIVE
                    </span>
                    <h3 className="text-xl md:text-2xl font-black text-white uppercase tracking-tight">
                      ARCADE QUESTION DISAPPEARED
                    </h3>
                    <p className="text-xs text-slate-300 max-w-md mx-auto leading-relaxed">
                      You have exited fullscreen mode. In accordance with Operation Zero-Day anti-cheat standards, interactive simulation questions and challenge mechanics are hidden in windowed mode.
                    </p>
                  </div>

                  <div className="p-4 bg-black/60 border border-red-500/30 rounded-lg max-w-md w-full text-left text-xs space-y-1.5 text-slate-300">
                    <div className="flex items-center gap-2 text-red-400 font-bold">
                      <ShieldAlert className="w-4 h-4 shrink-0" />
                      <span>Security Notice: Windowed Mode Detected</span>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-normal">
                      The active arcade challenge <span className="text-cyber-primary font-semibold">"{currentGame.title}"</span> is currently suppressed. Restore continuous fullscreen mode to reveal and solve.
                    </p>
                  </div>

                  <button
                    onClick={handleRestoreFullscreen}
                    className="px-6 py-3.5 bg-gradient-to-r from-cyber-primary to-cyan-400 hover:from-cyber-primary/90 hover:to-cyan-400/90 text-black font-bold uppercase tracking-wider text-xs rounded-lg transition-all shadow-[0_0_25px_rgba(0,255,204,0.35)] flex items-center gap-2 transform hover:scale-[1.02] active:scale-95"
                  >
                    <Maximize2 className="w-4 h-4" />
                    Restore Fullscreen & Reveal Question
                  </button>
                </div>
              ) : (
                /* Question and Interactive Simulation Lab (Active in Fullscreen) */
                <>
                  {/* Game Meta Header Card */}
                  <div className="p-4 bg-[#090E1A] border border-cyber-border rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] uppercase font-bold text-cyber-primary px-2 py-0.5 bg-cyber-primary/10 rounded border border-cyber-primary/30">
                          {currentGame.category}
                        </span>
                        <span className="text-[10px] text-cyber-muted">Difficulty: {currentGame.difficulty}</span>
                      </div>
                      <h2 className="text-lg font-bold text-white mt-1 uppercase">{currentGame.title}</h2>
                      <p className="text-xs text-cyber-muted mt-0.5">{currentGame.description}</p>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-xs text-cyber-muted block">Completion Reward</span>
                      <span className="text-xl font-bold text-cyber-secondary font-mono">+{currentGame.points} XP</span>
                    </div>
                  </div>

                  {/* Render the Active Interactive Puzzle */}
                  <InteractiveGameDispatcher
                    key={currentGame.id}
                    type={currentGame.type}
                    onSolve={(_ans, isCorrect) => handleGameSolved(currentGame.id, currentGame.points, isCorrect)}
                  />

                  {/* Quick links to technical assessment */}
                  <div className="p-3 bg-black/40 border border-white/5 rounded flex items-center justify-between text-xs text-cyber-muted">
                    <span>Want to test in official competitive conditions?</span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => navigate('/technical-profile')}
                        className="text-cyber-primary hover:underline font-bold flex items-center gap-1"
                      >
                        Open Round 01 B Assessment <ExternalLink className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Fullscreen Exit Warning Modal */}
      {showWarningModal && !isFullscreen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
          <div className="max-w-md w-full bg-[#0B0F19] border-2 border-red-500/60 rounded-xl p-6 shadow-[0_0_50px_rgba(239,68,68,0.3)] text-center space-y-4">
            <div className="w-14 h-14 mx-auto rounded-full bg-red-500/20 border border-red-500/50 flex items-center justify-center text-red-400 animate-pulse">
              <AlertTriangle className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white uppercase tracking-wider">
                FULLSCREEN MODE EXITED
              </h3>
              <p className="text-xs font-bold text-red-400 uppercase mt-1">
                Arcade Challenge Has Disappeared
              </p>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed bg-black/50 p-3 rounded-lg border border-white/10 text-left">
              ⚠️ <strong>INTEGRITY WARNING:</strong> Continuous fullscreen mode is strictly required during all technical exercises. The active question has been concealed to preserve evaluation integrity.
            </p>
            <div className="flex flex-col gap-2 pt-1">
              <button
                onClick={handleRestoreFullscreen}
                className="w-full py-3 bg-gradient-to-r from-cyber-primary to-cyan-400 text-black font-bold text-xs uppercase tracking-wider rounded-lg shadow-[0_0_20px_rgba(0,255,204,0.4)] hover:brightness-110 flex items-center justify-center gap-2"
              >
                <Maximize2 className="w-4 h-4" />
                Restore Fullscreen & Play
              </button>
              <button
                onClick={() => setShowWarningModal(false)}
                className="w-full py-2 bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white font-medium text-xs rounded border border-white/10 transition-all"
              >
                Dismiss Notice (Keep Hidden)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
