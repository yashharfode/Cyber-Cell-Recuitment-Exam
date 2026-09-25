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
  AlertTriangle
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
    description: 'Sort passwords into Weak/Medium/Strong buckets and assemble high-entropy characters to hit ≥50 bits.',
    icon: KeyRound,
  },
  {
    id: 'game-binary',
    type: 'binary-puzzle',
    title: 'Binary & Subnet Calculator',
    category: 'Foundational Math',
    difficulty: 'Beginner',
    points: 100,
    description: 'Flip individual binary bit gates to compute target decimals and evaluate basic subnet masks.',
    icon: Binary,
  },
  {
    id: 'game-cipher',
    type: 'cipher-wheel',
    title: 'Caesar Cipher Wheel',
    category: 'Applied Cryptography',
    difficulty: 'Intermediate',
    points: 150,
    description: 'Rotate the cryptanalytic ring to decipher an intercepted SATI network ciphertext broadcast.',
    icon: Sliders,
  },
  {
    id: 'game-detective',
    type: 'digital-detective',
    title: 'Forensic Log Investigator',
    category: 'Incident Response',
    difficulty: 'Intermediate',
    points: 150,
    description: 'Correlate timestamps and web server access logs to uncover an automated credential stuffing attack.',
    icon: Search,
  },
  {
    id: 'game-terminal',
    type: 'cyber-terminal',
    title: 'Linux Incident Triage CLI',
    category: 'Systems & Shell',
    difficulty: 'Advanced',
    points: 200,
    description: 'Execute realistic Linux shell commands (grep, netstat, ps, kill, chmod) to neutralize an active server threat.',
    icon: Terminal,
  }
];

export default function CyberArcade() {
  const navigate = useNavigate();
  const [selectedGameId, setSelectedGameId] = useState<string>('game-network');
  const [completedGames, setCompletedGames] = useState<Record<string, number>>({});
  const [activeMessage, setActiveMessage] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'games' | 'tree'>('games');
  
  const [fullscreenReady, setFullscreenReady] = useState<boolean>(true);
  const [warningMessage, setWarningMessage] = useState<string | null>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('arcade_completed');
      if (saved) {
        setCompletedGames(JSON.parse(saved));
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  useEffect(() => {
    const handleFullscreenState = () => {
      const isFs = isBrowserFullscreen();
      setFullscreenReady(isFs);
      if (!isFs) {
        setWarningMessage('FULLSCREEN EXITED: Simulation paused for examination integrity. Restore fullscreen to resume.');
      } else {
        setWarningMessage(null);
      }
    };

    FULLSCREEN_EVENTS.forEach(evt => document.addEventListener(evt, handleFullscreenState));
    setFullscreenReady(isBrowserFullscreen());

    return () => {
      FULLSCREEN_EVENTS.forEach(evt => document.removeEventListener(evt, handleFullscreenState));
    };
  }, []);

  const handleGameSolved = (gameId: string, points: number) => {
    setCompletedGames(prev => {
      const updated = { ...prev, [gameId]: points };
      try {
        localStorage.setItem('arcade_completed', JSON.stringify(updated));
      } catch (e) {
        console.error(e);
      }
      return updated;
    });

    setActiveMessage(`Lab Simulation Mastered! +${points} Bonus Recruitment Points Awarded.`);
    setTimeout(() => setActiveMessage(null), 4000);
  };

  const handleRestoreFullscreen = async () => {
    try {
      await enterBrowserFullscreen();
      setWarningMessage(null);
    } catch (e) {
      console.warn(e);
    }
  };

  const selectedGame = ARCADE_GAMES.find(g => g.id === selectedGameId) || ARCADE_GAMES[0];
  const totalScoreEarned = Object.values(completedGames).reduce((a, b) => a + b, 0);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans select-none">
      
      {/* Top Header */}
      <header className="bg-white border-b border-slate-200 px-4 md:px-8 py-3.5 flex flex-wrap items-center justify-between gap-3 sticky top-0 z-30 shadow-xs">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/')}
            className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
            title="Return to Home"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          
          <div className="w-9 h-9 rounded-xl bg-amber-50 border border-amber-200 text-amber-700 flex items-center justify-center font-bold">
            <Gamepad2 className="w-5 h-5 text-amber-600" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm md:text-base font-bold text-slate-900 tracking-tight">
                CYBER ARCADE • BONUS SIMULATION LABS
              </h1>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 font-semibold hidden sm:inline-block">
                STAGE 01 C
              </span>
            </div>
            <p className="text-[10px] sm:text-xs text-slate-500">
              Interactive practical puzzles designed for extra credit
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 ml-auto">
          {fullscreenReady ? (
            <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span>Fullscreen Active</span>
            </div>
          ) : (
            <button
              onClick={handleRestoreFullscreen}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-50 border border-red-200 text-red-700 hover:bg-red-100 text-xs font-bold transition-all cursor-pointer animate-pulse"
            >
              <AlertTriangle className="w-3.5 h-3.5 text-red-600" />
              <span>FULLSCREEN OFF</span>
            </button>
          )}

          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-amber-50 border border-amber-200 text-xs font-mono">
            <Award className="w-4 h-4 text-amber-600" />
            <span className="text-slate-600">Bonus:</span>
            <span className="font-bold text-amber-800">+{totalScoreEarned} BONUS XP</span>
          </div>

          <div className="flex rounded-lg border border-slate-200 overflow-hidden bg-slate-100 p-0.5">
            <button
              onClick={() => setViewMode('games')}
              className={`px-3 py-1 rounded-md text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                viewMode === 'games'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Gamepad2 className="w-3.5 h-3.5" /> Puzzles
            </button>
            <button
              onClick={() => setViewMode('tree')}
              className={`px-3 py-1 rounded-md text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                viewMode === 'tree'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-600" /> Skill Tree
            </button>
          </div>
        </div>
      </header>

      {/* Main Body */}
      <main className="flex-1 p-4 md:p-8 max-w-7xl mx-auto w-full">
        {/* Stage 01 C Optional Bonus Notice Banner */}
        <div className="mb-6 p-4 rounded-xl bg-amber-50/70 border border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-start sm:items-center gap-3">
            <div className="p-2 rounded-lg bg-amber-100 text-amber-800 shrink-0">
              <Sparkles className="w-4 h-4 text-amber-600" />
            </div>
            <div>
              <div className="font-bold text-slate-900 uppercase tracking-wide flex items-center gap-2">
                <span>Stage 01 C: Simulation Labs</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200 font-semibold">OPTIONAL • BONUS CREDITS</span>
              </div>
              <p className="text-slate-600 mt-0.5 leading-relaxed">
                Stage 01 C is completely optional. Each mastered simulation awards bonus points credited directly to your final recruitment profile.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-[11px] text-amber-800 font-bold px-3 py-1 bg-white border border-amber-200 rounded-lg shadow-xs font-mono">
              +{totalScoreEarned} / 1,220 BONUS PTS
            </span>
          </div>
        </div>

        {viewMode === 'tree' ? (
          <div className="space-y-6">
            <SkillUnlockTree />
            <div className="p-4 rounded-xl bg-white border border-slate-200 flex items-center justify-between shadow-xs">
              <div>
                <h4 className="text-sm font-bold text-slate-900">Ready for Personalized Technical Profiling?</h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  Declare your actual skills in Round 01 B and complete calibrated knowledge, application, and practical lab challenges.
                </p>
              </div>
              <button
                onClick={() => navigate('/technical-profile')}
                className="px-4 py-2 bg-slate-900 text-white font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-slate-800 flex items-center gap-2 cursor-pointer shadow-xs"
              >
                Enter Round 01 B <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Sidebar: Game Roster */}
            <div className="lg:col-span-4 space-y-2.5">
              <div className="flex items-center justify-between text-xs text-slate-500 uppercase font-semibold pb-1 font-mono">
                <span>Select Simulation ({ARCADE_GAMES.length})</span>
                <span>{Object.keys(completedGames).length} Mastered</span>
              </div>

              <div className="space-y-2 max-h-[75vh] overflow-y-auto pr-1">
                {ARCADE_GAMES.map((game) => {
                  const Icon = game.icon;
                  const isSelected = selectedGameId === game.id;
                  const isDone = !!completedGames[game.id];

                  return (
                    <div
                      key={game.id}
                      onClick={() => setSelectedGameId(game.id)}
                      className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                        isSelected
                          ? 'bg-sky-50 border-sky-500 shadow-xs'
                          : 'bg-white border-slate-200 hover:border-slate-300 text-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className={`p-2 rounded-lg border shrink-0 ${
                          isSelected 
                            ? 'bg-sky-100 border-sky-200 text-sky-700' 
                            : 'bg-slate-50 border-slate-200 text-slate-500'
                        }`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-bold text-slate-900 truncate">
                              {game.title}
                            </span>
                            {isDone && (
                              <span className="text-[9px] px-1 rounded bg-emerald-50 text-emerald-700 font-bold border border-emerald-200 font-mono">
                                ✓
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] text-slate-500 block truncate font-mono">
                            {game.category} • +{game.points} PTS
                          </span>
                        </div>
                      </div>

                      <ChevronRight className={`w-4 h-4 shrink-0 transition-transform ${isSelected ? 'text-sky-600 translate-x-0.5' : 'text-slate-400'}`} />
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right Main Stage: Active Game Engine */}
            <div className="lg:col-span-8 flex flex-col space-y-4">
              {/* Game Metadata Header */}
              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3 mb-3">
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-sky-50 text-sky-700 border border-sky-200 font-mono inline-block mb-1">
                      {selectedGame.category}
                    </span>
                    <h2 className="text-lg font-bold text-slate-900">
                      {selectedGame.title}
                    </h2>
                  </div>
                  <div className="flex items-center gap-2 self-start sm:self-auto font-mono">
                    <span className="text-xs px-2.5 py-1 rounded-md bg-amber-50 border border-amber-200 text-amber-800 font-bold">
                      +{selectedGame.points} BONUS PTS
                    </span>
                    <span className="text-[10px] px-2 py-1 rounded-md bg-slate-100 border border-slate-200 text-slate-600 uppercase font-semibold">
                      {selectedGame.difficulty}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">
                  {selectedGame.description}
                </p>

                {activeMessage && (
                  <div className="mt-3 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold animate-fadeIn flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-emerald-600" />
                    <span>{activeMessage}</span>
                  </div>
                )}
              </div>

              {/* Interactive Game Dispatcher Viewport */}
              <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-6 shadow-xs min-h-[420px] flex items-center justify-center relative overflow-hidden">
                <InteractiveGameDispatcher
                  type={selectedGame.type}
                  config={{}}
                  disabled={false}
                  onSolve={() => handleGameSolved(selectedGame.id, selectedGame.points)}
                />
              </div>
            </div>

          </div>
        )}
      </main>

      {/* Floating Fullscreen Warning Notice */}
      {warningMessage && (
        <div className="fixed bottom-6 right-6 z-50 max-w-sm bg-white border border-red-200 p-4 rounded-2xl shadow-xl animate-scaleIn">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
            <div className="text-xs">
              <span className="font-bold text-slate-900 block">Fullscreen Required</span>
              <p className="text-slate-600 mt-1 leading-relaxed">
                {warningMessage}
              </p>
              <button
                onClick={handleRestoreFullscreen}
                className="mt-2.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-bold text-[11px] uppercase cursor-pointer"
              >
                Restore Fullscreen
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
