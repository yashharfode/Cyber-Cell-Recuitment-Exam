import { useState, useEffect, useRef } from 'react';
import { useStore } from '../store/useStore';
import { useNavigate } from 'react-router-dom';
import ChallengeModal from '../challenges/components/ChallengeModal';
import { missions } from '../data/missions';
import { challenges } from '../data/challenges';
import { setupAntiCheatMonitors } from '../antiCheat';
import { 
  Clock, 
  Activity, 
  AlertTriangle,
  Maximize2,
  Trophy,
  Sparkles,
  VideoOff,
  ChevronRight,
  BookOpen
} from 'lucide-react';
import { isBrowserFullscreen, FULLSCREEN_EVENTS } from '../utils/fullscreen';

export default function GameMode() {
  const navigate = useNavigate();

  const { 
    mode, 
    score, 
    xp, 
    currentMissionIndex, 
    activeChallenge, 
    setActiveChallenge, 
    timeRemainingSeconds, 
    decrementTimer,
    flagCheat,
    warningNotice,
    setWarningNotice,
    advanceMission,
    penalizeAndSkipChallenge,
    setRound1Submitted
  } = useStore();

  const [showLevelUpAlert, setShowLevelUpAlert] = useState<string | null>(null);
  const [showRound1CompleteModal, setShowRound1CompleteModal] = useState<boolean>(false);
  const [challengeIndexInMission, setChallengeIndexInMission] = useState(0);
  const [logs, setLogs] = useState<string[]>([
    'CYBER CELL RECRUITMENT ASSESSMENT ENGINE ONLINE',
    '30 MCQS LOADED ACROSS 8 TECHNICAL DOMAIN LEVELS',
    'PRESS A/B/C/D TO CHOOSE • PRESS ENTER TO SUBMIT & PROCEED'
  ]);

  const currentMission = missions[currentMissionIndex] || missions[0];

  // Auto-open next active question in direct focused assessment mode
  useEffect(() => {
    if (!activeChallenge && !showRound1CompleteModal && !warningNotice) {
      const currentChallengeId = currentMission.challengeIds[challengeIndexInMission] || currentMission.challengeIds[0];
      const chal = challenges.find(c => c.id === currentChallengeId) || challenges[0];
      const timer = setTimeout(() => {
        setActiveChallenge(chal);
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [activeChallenge, currentMission, challengeIndexInMission, showRound1CompleteModal, warningNotice, setActiveChallenge]);

  const proctorVideoRef = useRef<HTMLVideoElement>(null);
  const [cameraActive, setCameraActive] = useState<boolean>(false);

  // Initialize live proctoring webcam
  useEffect(() => {
    let stream: MediaStream | null = null;
    let isMounted = true;

    const startCamera = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { width: { ideal: 320 }, height: { ideal: 240 }, facingMode: 'user' }
        });
        if (isMounted && proctorVideoRef.current) {
          proctorVideoRef.current.srcObject = stream;
          setCameraActive(true);
        }
      } catch (err) {
        console.warn('Proctoring webcam connection error:', err);
        if (isMounted) setCameraActive(false);
      }
    };

    startCamera();

    return () => {
      isMounted = false;
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  // Handle fullscreen exit: skip running question, apply -50 PTS negative marking, and display strong warning
  useEffect(() => {
    const handleFullscreenExit = () => {
      if (!isBrowserFullscreen()) {
        if (activeChallenge) {
          const skippedTitle = activeChallenge.title;
          const skippedId = activeChallenge.id;

          penalizeAndSkipChallenge(skippedId, 50);
          setActiveChallenge(null);

          // Advance to next challenge in mission
          const nextIdx = challengeIndexInMission + 1;
          if (nextIdx < currentMission.challengeIds.length) {
            setChallengeIndexInMission(nextIdx);
          } else {
            setChallengeIndexInMission(0);
            advanceMission();
          }

          setWarningNotice({
            message: `CRITICAL INTEGRITY VIOLATION: FULLSCREEN EXITED!\n\nQuestion "${skippedTitle}" was immediately SKIPPED and a -50 POINTS NEGATIVE MARKING penalty has been deducted from your score.\n\n⚠️ DO NOT EXIT FULLSCREEN AGAIN! Continuous fullscreen mode is strictly mandatory throughout the assessment.`,
            severity: 'high'
          });

          setLogs(prev => [
            `⛔ FULLSCREEN VIOLATION: "${skippedTitle}" SKIPPED (-50 PTS PENALTY)`,
            ...prev.slice(0, 6)
          ]);
        } else {
          setWarningNotice({
            message: `FULLSCREEN EXITED!\n\nRecruitment rules require continuous fullscreen mode. If you exit fullscreen while answering any question, it will be skipped with negative marking!\n\nPlease restore fullscreen immediately to continue.`,
            severity: 'high'
          });
        }
      }
    };

    FULLSCREEN_EVENTS.forEach(evt => document.addEventListener(evt, handleFullscreenExit));
    return () => {
      FULLSCREEN_EVENTS.forEach(evt => document.removeEventListener(evt, handleFullscreenExit));
    };
  }, [activeChallenge, challengeIndexInMission, currentMission, penalizeAndSkipChallenge, advanceMission, setWarningNotice]);

  // Handle Tab Switch: Immediately skip active question, apply penalty, and advance to next question
  useEffect(() => {
    const handleTabSwitch = () => {
      if (document.hidden) {
        if (activeChallenge) {
          const skippedTitle = activeChallenge.title;
          const skippedId = activeChallenge.id;

          penalizeAndSkipChallenge(skippedId, 50);
          setActiveChallenge(null);

          // Advance to next challenge in mission
          const nextIdx = challengeIndexInMission + 1;
          if (nextIdx < currentMission.challengeIds.length) {
            setChallengeIndexInMission(nextIdx);
          } else {
            setChallengeIndexInMission(0);
            advanceMission();
          }

          setWarningNotice({
            message: `CRITICAL INTEGRITY VIOLATION: TAB SWITCH DETECTED!\n\nYou switched tabs or minimized the browser window.\n\nQuestion "${skippedTitle}" was immediately SKIPPED and a -50 POINTS NEGATIVE MARKING penalty has been deducted from your score.\n\n⚠️ DO NOT SWITCH TABS AGAIN! Remain focused on the assessment tab at all times.`,
            severity: 'high'
          });

          setLogs(prev => [
            `⛔ TAB SWITCH VIOLATION: "${skippedTitle}" SKIPPED (-50 PTS PENALTY)`,
            ...prev.slice(0, 6)
          ]);
        } else {
          setWarningNotice({
            message: `TAB SWITCH DETECTED!\n\nSwitching tabs is strictly monitored. If you switch tabs while answering any question, it will be immediately skipped with negative marking!\n\nPlease remain focused on the assessment tab.`,
            severity: 'high'
          });
        }
      }
    };

    const handlePreventCopy = (e: Event) => {
      e.preventDefault();
    };

    document.addEventListener('visibilitychange', handleTabSwitch);
    window.addEventListener('blur', handleTabSwitch);
    window.addEventListener('pagehide', handleTabSwitch);
    document.addEventListener('copy', handlePreventCopy);
    document.addEventListener('cut', handlePreventCopy);
    document.addEventListener('contextmenu', handlePreventCopy);

    return () => {
      document.removeEventListener('visibilitychange', handleTabSwitch);
      window.removeEventListener('blur', handleTabSwitch);
      window.removeEventListener('pagehide', handleTabSwitch);
      document.removeEventListener('copy', handlePreventCopy);
      document.removeEventListener('cut', handlePreventCopy);
      document.removeEventListener('contextmenu', handlePreventCopy);
    };
  }, [activeChallenge, challengeIndexInMission, currentMission, penalizeAndSkipChallenge, advanceMission, setWarningNotice]);

  // Anti-cheat monitoring for recruitment mode
  useEffect(() => {
    if (mode === 'recruitment') {
      const cleanup = setupAntiCheatMonitors((msg, severity) => {
        flagCheat(severity);
        setWarningNotice({ message: msg, severity });
        setLogs(prev => [`[ALERT] ${msg}`, ...prev.slice(0, 6)]);
      }, currentMission.id);

      return cleanup;
    }
  }, [mode, currentMission.id, flagCheat, setWarningNotice]);

  // Session timer
  useEffect(() => {
    const timer = setInterval(() => {
      decrementTimer();
    }, 1000);

    return () => clearInterval(timer);
  }, [decrementTimer]);

  useEffect(() => {
    if (timeRemainingSeconds <= 0) {
      setRound1Submitted(true);
      navigate('/result');
    }
  }, [timeRemainingSeconds, navigate, setRound1Submitted]);

  const formatTimer = (totalSeconds: number) => {
    const m = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
    const s = (totalSeconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const handleNextChallenge = () => {
    const nextIdx = challengeIndexInMission + 1;
    if (nextIdx < currentMission.challengeIds.length) {
      setChallengeIndexInMission(nextIdx);
      const nextChallengeId = currentMission.challengeIds[nextIdx];
      const nextChal = challenges.find(c => c.id === nextChallengeId);
      if (nextChal) {
        setActiveChallenge(nextChal);
        setLogs(prev => [
          `> QUESTION ${nextIdx + 1} OF ${currentMission.challengeIds.length}: ${nextChal.title}`,
          ...prev.slice(0, 6)
        ]);
      }
    } else {
      setActiveChallenge(null);
      setChallengeIndexInMission(0);
      const hasMore = advanceMission();
      if (!hasMore || currentMissionIndex + 1 >= missions.length) {
        setRound1Submitted(true);
        setShowRound1CompleteModal(true);
      } else {
        const nextMission = missions[currentMissionIndex + 1];
        setShowLevelUpAlert(`LEVEL COMPLETED! ADVANCING TO LEVEL ${currentMissionIndex + 2}`);
        setTimeout(() => setShowLevelUpAlert(null), 3500);

        setLogs(prev => [
          `⭐ LEVEL ${currentMission.sequence} RESOLVED!`,
          `> BONUS XP AWARDED: +${currentMission.rewardXP}`,
          `> TELEMETRY FOR ${nextMission.title} READY`,
          ...prev.slice(0, 5)
        ]);
      }
    }
  };

  const restoreFullscreen = async () => {
    try {
      if (document.documentElement.requestFullscreen) {
        await document.documentElement.requestFullscreen();
      }
      setWarningNotice(null);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="relative w-screen h-screen bg-slate-50 text-slate-900 overflow-hidden select-none font-sans">
      
      {/* Light Clean Subtle Architectural Grid */}
      <div className="absolute inset-0 z-0 bg-slate-50 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none opacity-40" />

      {/* Level Up Celebration Toast */}
      {showLevelUpAlert && (
        <div className="absolute top-16 sm:top-20 left-1/2 -translate-x-1/2 z-40 bg-white border border-slate-200 p-3 sm:p-4 rounded-xl shadow-xl flex items-center gap-3 animate-fadeIn max-w-[90vw]">
          <Trophy className="w-5 h-5 sm:w-6 sm:h-6 text-amber-500 shrink-0" />
          <div>
            <div className="text-[10px] sm:text-xs uppercase text-sky-600 font-semibold tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              LEVEL COMPLETED
            </div>
            <div className="text-xs sm:text-sm font-semibold text-slate-900 mt-0.5">
              {showLevelUpAlert}
            </div>
          </div>
        </div>
      )}

      {/* Professional Light Header */}
      <header className="fixed top-0 inset-x-0 z-30 px-3 sm:px-6 py-2.5 sm:py-3 bg-white/95 backdrop-blur-md border-b border-slate-200 flex items-center justify-between pointer-events-auto shadow-xs">
        
        {/* Left: Organization Identity */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="w-8 h-8 rounded-lg bg-sky-50 border border-sky-200 flex items-center justify-center font-mono text-xs font-bold text-sky-700">
            CC
          </div>
          <div>
            <div className="flex items-center gap-1.5 sm:gap-2">
              <span className="text-xs font-bold tracking-tight text-slate-900 uppercase">
                CYBER CELL
              </span>
              <span className="text-[9px] sm:text-[10px] text-sky-700 font-mono px-1.5 py-0.5 rounded bg-sky-50 border border-sky-200 font-medium">
                SOC SCREENING
              </span>
            </div>
            <p className="text-[9px] sm:text-[10px] text-slate-500 font-mono">Stage 01 A • Technical Assessment</p>
          </div>
        </div>

        {/* Center: Clean Level Progression & Question Counter */}
        <div className="flex flex-col items-center gap-1 min-w-0 px-1">
          <div className="flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs">
            <span className="font-semibold text-slate-900">
              Level {currentMissionIndex + 1} of {missions.length}
            </span>
            <span className="text-slate-300">•</span>
            <span className="text-slate-600 font-medium truncate max-w-[120px] xs:max-w-[160px] sm:max-w-none">
              {currentMission.title.split(':')[1]?.trim() || currentMission.title}
            </span>
            <span className="text-slate-300 hidden sm:inline">•</span>
            <span className="text-sky-600 font-mono text-[10px] hidden sm:inline font-semibold">
              Q{challengeIndexInMission + 1}/{currentMission.challengeIds.length}
            </span>
          </div>
          
          <div className="flex items-center gap-1 sm:gap-1.5">
            {missions.map((m, idx) => {
              const isCompleted = idx < currentMissionIndex;
              const isCurrent = idx === currentMissionIndex;
              return (
                <div
                  key={m.id}
                  title={`Level ${idx + 1}: ${m.title}`}
                  className={`h-1.5 rounded-full transition-all ${
                    isCurrent
                      ? 'w-6 sm:w-8 bg-sky-600 ring-2 ring-sky-100'
                      : isCompleted
                      ? 'w-3 sm:w-6 bg-emerald-500'
                      : 'w-2 sm:w-5 bg-slate-200'
                  }`}
                />
              );
            })}
          </div>
        </div>

        {/* Right: Timer, Score & End Action */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-100 border border-slate-200 text-xs rounded-lg">
            <Clock className="w-3.5 h-3.5 text-amber-600" />
            <span className={`font-mono font-semibold ${timeRemainingSeconds < 300 ? 'text-red-600 animate-pulse' : 'text-slate-700'}`}>
              {formatTimer(timeRemainingSeconds)}
            </span>
          </div>

          <div className="hidden md:flex items-center gap-2 px-2.5 py-1 bg-slate-100 border border-slate-200 text-xs rounded-lg">
            <span className="text-[10px] uppercase font-mono text-slate-500 font-semibold">Score</span>
            <span className="font-bold text-slate-900 font-mono">{score}</span>
          </div>

          <button
            onClick={() => {
              if (window.confirm('Are you sure you want to finish Round 01 A and submit your test?')) {
                navigate('/result');
              }
            }}
            className="px-3 py-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 text-xs font-semibold transition-colors cursor-pointer"
          >
            Submit & End
          </button>
        </div>

      </header>

      {/* Main Focus Area (When question modal is preparing or transitioning) */}
      <main className="absolute inset-0 flex flex-col items-center justify-center p-4 pt-16 z-10">
        {!activeChallenge && !showRound1CompleteModal && (
          <div className="max-w-md w-full bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm text-center animate-scaleIn">
            <div className="w-12 h-12 rounded-xl bg-sky-50 border border-sky-200 text-sky-600 flex items-center justify-center mx-auto mb-4">
              <BookOpen className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">
              Level {currentMissionIndex + 1}: {currentMission.title}
            </h3>
            <p className="text-xs text-slate-500 mt-2 leading-relaxed">
              {currentMission.terminalHint || 'Prepare for next technical problem.'}
            </p>
            <div className="mt-5">
              <button
                onClick={() => {
                  const currentChallengeId = currentMission.challengeIds[challengeIndexInMission] || currentMission.challengeIds[0];
                  const chal = challenges.find(c => c.id === currentChallengeId) || challenges[0];
                  setActiveChallenge(chal);
                }}
                className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-1.5"
              >
                <span>Open Question {challengeIndexInMission + 1}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Live Proctoring Webcam Picture-In-Picture */}
      <div className="fixed bottom-3 right-3 sm:bottom-5 sm:right-5 z-30 bg-white/95 backdrop-blur-md border border-slate-200 rounded-xl p-2 shadow-md flex flex-col gap-1.5 pointer-events-auto font-sans w-28 sm:w-36">
        <div className="flex items-center justify-between text-[10px]">
          <div className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-semibold text-slate-800">Proctor</span>
          </div>
          <span className="text-[9px] text-slate-500 font-mono uppercase">
            {cameraActive ? 'Active' : 'Offline'}
          </span>
        </div>
        <div className="w-full h-18 sm:h-24 bg-slate-100 rounded-lg border border-slate-200 overflow-hidden relative flex items-center justify-center">
          <video
            ref={proctorVideoRef}
            autoPlay
            playsInline
            muted
            className={`w-full h-full object-cover scale-x-[-1] ${cameraActive ? 'block' : 'hidden'}`}
          />
          {!cameraActive && (
            <div className="flex flex-col items-center justify-center gap-1 text-slate-400 p-1 text-center">
              <VideoOff className="w-4 h-4 text-red-500" />
              <span className="text-[9px]">Camera...</span>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Telemetry Bar (Desktop) */}
      <div className="hidden lg:flex fixed bottom-5 left-5 z-20 w-80 p-3 bg-white/90 border border-slate-200 backdrop-blur-md rounded-xl shadow-xs pointer-events-auto items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-sky-600" />
          <span className="text-[11px] font-medium text-slate-700 font-mono">
            {logs[0] || 'System Active'}
          </span>
        </div>
        <span className="text-[10px] text-emerald-600 font-mono font-semibold">LIVE</span>
      </div>

      {/* Active Case Challenge Modal */}
      {activeChallenge && (
        <ChallengeModal
          challenge={activeChallenge}
          onClose={() => setActiveChallenge(null)}
          onSuccessNext={handleNextChallenge}
        />
      )}

      {/* Round 1 Completion Transition Modal */}
      {showRound1CompleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm pointer-events-auto p-4 select-none font-sans">
          <div className="w-full max-w-lg bg-white p-8 border border-slate-200 text-center shadow-xl rounded-2xl animate-scaleIn">
            <div className="w-14 h-14 rounded-2xl bg-sky-50 border border-sky-200 text-sky-600 flex items-center justify-center mx-auto mb-4">
              <Trophy className="w-7 h-7 text-sky-600" />
            </div>

            <span className="text-[10px] uppercase font-semibold tracking-wider px-2.5 py-0.5 bg-sky-50 border border-sky-200 text-sky-700 rounded-md inline-block mb-2">
              SOC OPERATIONS COMPLETE
            </span>

            <h3 className="text-xl md:text-2xl font-bold text-slate-900 uppercase tracking-tight">
              Round 01 A Assessment Complete
            </h3>

            <p className="text-xs text-slate-500 mt-2 max-w-md mx-auto leading-relaxed">
              All 30 SOC screening questions and scenarios resolved. Your tactical performance baseline has been captured.
            </p>

            <div className="grid grid-cols-2 gap-3 my-6 p-4 rounded-xl bg-slate-50 border border-slate-200 text-left">
              <div>
                <span className="text-[10px] text-slate-500 uppercase block font-mono">Score Earned</span>
                <span className="text-xl font-bold text-slate-900 font-mono">{score} PTS</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 uppercase block font-mono">XP Progression</span>
                <span className="text-xl font-bold text-indigo-600 font-mono">{xp} XP</span>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <button
                onClick={() => navigate('/technical-profile')}
                className="w-full py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider rounded-lg transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-sky-400" />
                <span>ENTER ROUND 01 B: SKILL PROFILING &rarr;</span>
              </button>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => navigate('/result')}
                  className="py-2.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 font-semibold text-xs uppercase tracking-wider rounded-lg transition-all cursor-pointer"
                >
                  View Scorecard
                </button>
                <button
                  onClick={() => navigate('/arcade')}
                  className="py-2.5 px-3 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 font-semibold text-xs uppercase tracking-wider rounded-lg transition-all cursor-pointer"
                >
                  Bonus Labs
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Anti-Cheat Warning Modal */}
      {warningNotice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm pointer-events-auto p-4 select-none font-sans">
          <div className="w-full max-w-lg bg-white p-6 border border-red-200 text-center shadow-xl rounded-2xl animate-scaleIn">
            <div className="w-12 h-12 rounded-xl bg-red-50 border border-red-200 text-red-600 flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 uppercase tracking-wider">
              Integrity Violation Recorded
            </h3>
            <div className="mt-4 p-4 bg-red-50/60 border border-red-200 rounded-xl text-left text-xs text-slate-700 whitespace-pre-line leading-relaxed font-mono">
              {warningNotice.message}
            </div>
            <div className="mt-6 flex flex-col gap-2.5">
              <button
                onClick={restoreFullscreen}
                className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 rounded-lg transition-all shadow-sm cursor-pointer"
              >
                <Maximize2 className="w-4 h-4" />
                RESTORE FULLSCREEN & CONTINUE
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
