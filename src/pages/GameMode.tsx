import { useState, useEffect, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { useStore } from '../store/useStore';
import { useNavigate } from 'react-router-dom';
import CyberRoom from '../game/environment/CyberRoom';
import Player from '../game/player/Player';
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
  Shield,
  VideoOff
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

  const [inRangeOfTerminal, setInRangeOfTerminal] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [showLevelUpAlert, setShowLevelUpAlert] = useState<string | null>(null);
  const [showRound1CompleteModal, setShowRound1CompleteModal] = useState<boolean>(false);
  const [challengeIndexInMission, setChallengeIndexInMission] = useState(0);
  const [logs, setLogs] = useState<string[]>([
    'CYBER CELL RECRUITMENT ASSESSMENT ENGINE ONLINE',
    '30 MCQS LOADED ACROSS 8 TECHNICAL DOMAIN LEVELS',
    'CONTROLS: W/A/S/D TO WALK • MOUSE TO LOOK • [E] TO INTERACT',
    'PRESS A/B/C/D TO CHOOSE • PRESS ENTER TO SUBMIT & PROCEED'
  ]);

  const currentMission = missions[currentMissionIndex] || missions[0];

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

    document.addEventListener('visibilitychange', handleTabSwitch);
    window.addEventListener('blur', handleTabSwitch);

    return () => {
      document.removeEventListener('visibilitychange', handleTabSwitch);
      window.removeEventListener('blur', handleTabSwitch);
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

  // Pointer lock change listener
  useEffect(() => {
    const handleLockChange = () => {
      setIsLocked(document.pointerLockElement !== null);
    };
    document.addEventListener('pointerlockchange', handleLockChange);
    return () => document.removeEventListener('pointerlockchange', handleLockChange);
  }, []);

  const formatTimer = (totalSeconds: number) => {
    const m = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
    const s = (totalSeconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const handleOpenTerminal = () => {
    if (document.exitPointerLock) {
      document.exitPointerLock();
    }
    const currentChallengeId = currentMission.challengeIds[challengeIndexInMission] || currentMission.challengeIds[0];
    const chal = challenges.find(c => c.id === currentChallengeId) || challenges[0];
    setActiveChallenge(chal);
    setLogs(prev => [`> OPENED: ${chal.title}`, ...prev.slice(0, 6)]);
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
    <div className="relative w-screen h-screen bg-[#05070D] overflow-hidden select-none font-mono-cyber">
      
      {/* 3D Cyber Room Canvas */}
      <div className="absolute inset-0 z-0">
        <Canvas camera={{ position: [0, 1.6, 3], fov: 65 }}>
          <CyberRoom 
            onInteractTerminal={handleOpenTerminal} 
            missionTitle={currentMission.title}
          />
          <Player 
            onInteract={handleOpenTerminal} 
            canInteract={inRangeOfTerminal} 
            onProximityChange={setInRangeOfTerminal}
            isChallengeOpen={!!activeChallenge}
          />
        </Canvas>
      </div>

      {/* Level Up Celebration Toast Notification */}
      {showLevelUpAlert && (
        <div className="absolute top-20 left-1/2 -translate-x-1/2 z-40 bg-[#0D1322] border border-white/[0.12] p-4 rounded-xl shadow-2xl flex items-center gap-3 animate-fadeIn font-sans">
          <Trophy className="w-6 h-6 text-amber-400" />
          <div>
            <div className="text-xs uppercase text-sky-400 font-semibold tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              LEVEL COMPLETED
            </div>
            <div className="text-sm font-semibold text-white mt-0.5">
              {showLevelUpAlert}
            </div>
          </div>
        </div>
      )}

      {/* Pointer Lock Overlay */}
      {!isLocked && !activeChallenge && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/70 backdrop-blur-sm pointer-events-auto font-sans">
          <div className="text-center p-6 bg-[#0D1322] border border-white/[0.1] shadow-2xl max-w-md rounded-xl animate-scaleIn">
            <Shield className="w-10 h-10 text-sky-400 mx-auto mb-3" />
            <h3 className="text-base font-bold text-white tracking-wide uppercase">CLICK TO CONTROL AGENT</h3>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Click anywhere to steer your agent. Walk over to the central console and press <span className="text-white font-semibold">[E]</span> to open the case investigation file.
            </p>
            <div className="mt-4 px-3.5 py-1.5 bg-white/[0.04] border border-white/[0.08] text-slate-300 text-xs font-medium rounded-lg inline-block font-mono">
              {mode === 'demo' ? 'DEMO MODE (PRACTICE)' : 'RECRUITMENT MODE ACTIVE'}
            </div>
          </div>
        </div>
      )}

      {/* Proximity Aim Target / Interaction Prompt */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10 font-sans">
        {inRangeOfTerminal ? (
          <div className="flex flex-col items-center gap-1.5 animate-scaleIn">
            <span className="text-xs font-semibold text-slate-950 bg-white px-4 py-2 rounded-lg shadow-xl flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-sky-500" />
              Press [E] or Click to Open Terminal
            </span>
          </div>
        ) : (
          <div className="w-1.5 h-1.5 bg-white/70 rounded-full ring-4 ring-white/10" />
        )}
      </div>

      {/* Sleek Unified Top Navigation Bar */}
      <header className="fixed top-0 inset-x-0 z-30 px-4 sm:px-6 py-3 bg-[#080C14]/90 backdrop-blur-md border-b border-white/[0.08] flex items-center justify-between font-sans pointer-events-auto shadow-sm">
        
        {/* Left: Organization Identity */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#0F172A] border border-white/[0.1] flex items-center justify-center font-mono text-xs font-bold text-sky-400">
            CC
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold tracking-tight text-white uppercase">
                CYBER CELL
              </span>
              <span className="text-[10px] text-sky-400 font-mono px-1.5 py-0.2 rounded bg-sky-500/10 border border-sky-500/20 font-medium">
                SOC
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-mono">Stage 01 A • Screening</p>
          </div>
        </div>

        {/* Center: Clean Level Progression & Minimalist Pips */}
        <div className="hidden md:flex flex-col items-center gap-1.5">
          <div className="flex items-center gap-2 text-xs">
            <span className="font-semibold text-white">
              Level {currentMissionIndex + 1} of {missions.length}
            </span>
            <span className="text-slate-500">•</span>
            <span className="text-slate-300 font-medium">
              {currentMission.title.split(':')[1]?.trim() || currentMission.title}
            </span>
          </div>
          
          <div className="flex items-center gap-1.5">
            {missions.map((m, idx) => {
              const isCompleted = idx < currentMissionIndex;
              const isCurrent = idx === currentMissionIndex;
              return (
                <div
                  key={m.id}
                  title={`Level ${idx + 1}: ${m.title}`}
                  className={`h-1.5 rounded-full transition-all ${
                    isCurrent
                      ? 'w-8 bg-sky-400 ring-2 ring-sky-400/30'
                      : isCompleted
                      ? 'w-6 bg-emerald-400'
                      : 'w-5 bg-white/10'
                  }`}
                />
              );
            })}
          </div>
        </div>

        {/* Right: Timer, Score & End Action */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-white/[0.04] border border-white/[0.08] text-xs rounded-lg">
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            <span className={`font-mono font-semibold ${timeRemainingSeconds < 300 ? 'text-red-400 animate-pulse' : 'text-slate-200'}`}>
              {formatTimer(timeRemainingSeconds)}
            </span>
          </div>

          <div className="hidden sm:flex items-center gap-2 px-2.5 py-1 bg-white/[0.04] border border-white/[0.08] text-xs rounded-lg">
            <span className="text-[10px] uppercase font-mono text-slate-400">Score</span>
            <span className="font-bold text-white font-mono">{score}</span>
          </div>

          <button
            onClick={() => {
              if (window.confirm('Are you sure you want to finish Round 01 A and view your scorecard?')) {
                navigate('/result');
              }
            }}
            className="px-3 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-300 border border-red-500/20 text-xs font-medium transition-colors cursor-pointer"
          >
            End Assessment
          </button>
        </div>

      </header>

      {/* Live Proctoring Webcam Corner Card */}
      <div className="fixed top-18 right-5 z-30 bg-[#0D1322]/90 backdrop-blur-md border border-white/[0.1] rounded-xl p-2.5 shadow-xl flex flex-col gap-2 w-44 pointer-events-auto font-sans">
        <div className="flex items-center justify-between text-[11px]">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span className="font-semibold text-white">Proctoring</span>
          </div>
          <span className="text-[10px] text-slate-400 font-mono uppercase">
            {cameraActive ? 'Active' : 'Offline'}
          </span>
        </div>
        <div className="w-full h-28 bg-black rounded-lg border border-white/[0.08] overflow-hidden relative flex items-center justify-center">
          <video
            ref={proctorVideoRef}
            autoPlay
            playsInline
            muted
            className={`w-full h-full object-cover scale-x-[-1] ${cameraActive ? 'block' : 'hidden'}`}
          />
          {!cameraActive && (
            <div className="flex flex-col items-center justify-center gap-1 text-slate-400 p-2 text-center">
              <VideoOff className="w-5 h-5 text-red-400" />
              <span className="text-[10px]">Camera Connecting...</span>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Telemetry & Case Briefing Card */}
      <div className="fixed bottom-5 left-5 z-20 w-80 sm:w-96 p-4 bg-[#0D1322]/90 border border-white/[0.08] backdrop-blur-md rounded-xl shadow-2xl pointer-events-auto font-sans">
        <div className="flex items-center justify-between border-b border-white/[0.06] pb-2 mb-2.5">
          <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5 font-mono">
            <Activity className="w-3.5 h-3.5 text-sky-400" />
            Case Telemetry
          </span>
          <span className="text-[10px] text-emerald-400 font-mono font-medium">LIVE STREAM</span>
        </div>
        
        <div className="space-y-1 text-xs h-20 overflow-y-auto leading-relaxed font-mono">
          {logs.map((log, idx) => (
            <p key={idx} className={idx === 0 ? 'text-sky-300 font-medium' : 'text-slate-400'}>
              {log}
            </p>
          ))}
        </div>

        <div className="mt-2.5 pt-2.5 border-t border-white/[0.06] text-xs text-amber-300/90 leading-snug flex items-start gap-1.5">
          <span className="shrink-0">💡</span>
          <span><strong>Case Objective:</strong> {currentMission.terminalHint}</span>
        </div>
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm pointer-events-auto p-4 select-none font-sans">
          <div className="w-full max-w-lg bg-[#0D1322] p-8 border border-white/[0.1] text-center shadow-2xl rounded-2xl animate-scaleIn">
            <div className="w-14 h-14 rounded-2xl bg-sky-500/10 border border-sky-500/20 text-sky-400 flex items-center justify-center mx-auto mb-4">
              <Trophy className="w-7 h-7 text-sky-400" />
            </div>

            <span className="text-[10px] uppercase font-semibold tracking-wider px-2.5 py-0.5 bg-sky-500/10 border border-sky-500/20 text-sky-400 rounded-md inline-block mb-2">
              SOC OPERATIONS COMPLETE
            </span>

            <h3 className="text-xl md:text-2xl font-bold text-white uppercase tracking-tight">
              Round 01 A Debrief Complete
            </h3>

            <p className="text-xs text-slate-400 mt-2 max-w-md mx-auto leading-relaxed">
              All 30 SOC screening questions and scenarios resolved. Your tactical performance baseline has been captured.
            </p>

            <div className="grid grid-cols-2 gap-3 my-6 p-4 rounded-xl bg-[#090D18] border border-white/[0.06] text-left">
              <div>
                <span className="text-[10px] text-slate-400 uppercase block font-mono">Score Earned</span>
                <span className="text-xl font-bold text-white font-mono">{score} PTS</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase block font-mono">XP Progression</span>
                <span className="text-xl font-bold text-indigo-400 font-mono">{xp} XP</span>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <button
                onClick={() => navigate('/technical-profile')}
                className="w-full py-3.5 bg-white hover:bg-slate-200 text-slate-950 font-bold text-xs uppercase tracking-wider rounded-lg transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-sky-600" />
                <span>ENTER ROUND 01 B: SKILL PROFILING &rarr;</span>
              </button>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => navigate('/result')}
                  className="py-2.5 px-3 bg-white/[0.05] hover:bg-white/[0.1] text-slate-200 border border-white/[0.08] font-semibold text-xs uppercase tracking-wider rounded-lg transition-all cursor-pointer"
                >
                  View Scorecard
                </button>
                <button
                  onClick={() => navigate('/arcade')}
                  className="py-2.5 px-3 bg-white/[0.05] hover:bg-white/[0.1] text-amber-400 border border-amber-400/20 font-semibold text-xs uppercase tracking-wider rounded-lg transition-all cursor-pointer"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm pointer-events-auto p-4 select-none font-sans">
          <div className="w-full max-w-lg bg-[#0D1322] p-6 border border-red-500/40 text-center shadow-2xl rounded-2xl animate-scaleIn">
            <div className="w-12 h-12 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-6 h-6 text-red-400" />
            </div>
            <h3 className="text-lg font-bold text-white uppercase tracking-wider">
              Integrity Violation Recorded
            </h3>
            <div className="mt-4 p-4 bg-[#080C14] border border-red-500/20 rounded-xl text-left text-xs text-slate-200 whitespace-pre-line leading-relaxed">
              {warningNotice.message}
            </div>
            <div className="mt-6 flex flex-col gap-2.5">
              <button
                onClick={restoreFullscreen}
                className="w-full py-3 bg-white hover:bg-slate-200 text-slate-950 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 rounded-lg transition-all shadow-sm cursor-pointer"
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
