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
  Layers,
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
        <div className="absolute top-20 left-1/2 -translate-x-1/2 z-40 bg-[#0B1018] border-2 border-cyber-primary p-4 rounded-lg shadow-[0_0_40px_rgba(0,255,204,0.4)] flex items-center gap-3 animate-fadeIn">
          <Trophy className="w-7 h-7 text-cyber-warning animate-bounce" />
          <div>
            <div className="text-xs uppercase text-cyber-primary font-bold tracking-widest flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              EXCELLENT INVESTIGATION!
            </div>
            <div className="text-sm font-bold text-white mt-0.5">
              {showLevelUpAlert}
            </div>
          </div>
        </div>
      )}

      {/* Pointer Lock Overlay */}
      {!isLocked && !activeChallenge && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/60 backdrop-blur-[2px] pointer-events-auto">
          <div className="text-center p-6 bg-[#0B1018] border border-cyber-primary/40 shadow-[0_0_35px_rgba(0,255,204,0.2)] max-w-md rounded-lg animate-scaleIn">
            <Shield className="w-12 h-12 text-cyber-primary mx-auto mb-3" />
            <h3 className="text-lg font-bold text-white tracking-wider">CLICK TO CONTROL AGENT</h3>
            <p className="text-xs text-cyber-muted mt-2 leading-relaxed">
              Click anywhere to steer your agent. Walk over to the central console and press <span className="text-cyber-primary font-bold">[E]</span> to open the case investigation file.
            </p>
            <div className="mt-4 px-4 py-2 bg-cyber-primary/10 border border-cyber-primary/30 text-cyber-primary text-xs font-bold rounded inline-block">
              {mode === 'demo' ? 'DEMO MODE (PRACTICE)' : 'RECRUITMENT MODE ACTIVE'}
            </div>
          </div>
        </div>
      )}

      {/* Proximity Aim Target */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
        {inRangeOfTerminal ? (
          <div className="flex flex-col items-center gap-1.5 animate-scaleIn">
            <div className="w-4 h-4 border-2 border-cyber-primary rotate-45 animate-spin" style={{ animationDuration: '4s' }} />
            <span className="text-xs font-bold text-black bg-cyber-primary px-3 py-1 rounded shadow-[0_0_15px_rgba(0,255,204,0.6)]">
              [E] OPEN CASE FILE
            </span>
          </div>
        ) : (
          <div className="w-2 h-2 bg-cyber-primary/70 rounded-full ring-4 ring-cyber-primary/20" />
        )}
      </div>

      {/* Top Level Progression Bar */}
      <div className="absolute top-0 inset-x-0 z-30 pointer-events-none p-3 md:p-5 flex flex-col gap-2">
        
        {/* Top Navbar Row */}
        <div className="flex justify-between items-center pointer-events-auto">
          {/* Club Logo */}
          <div className="cyber-panel px-4 py-2 bg-[#0B1018]/90 backdrop-blur-sm border border-cyber-border rounded flex items-center gap-3">
            <div className="w-2.5 h-2.5 bg-cyber-primary rounded-full animate-ping" />
            <div>
              <h1 className="text-xs md:text-sm font-bold text-cyber-primary tracking-widest">
                CYBER CELL • SATI VIDISHA
              </h1>
              <p className="text-[10px] text-cyber-muted">OPERATION ZERO-DAY</p>
            </div>
          </div>

          {/* Level Tracker Badge */}
          <div className="cyber-panel px-5 py-2 bg-[#0B1018]/90 backdrop-blur-sm border border-cyber-primary/40 rounded flex items-center gap-3">
            <Layers className="w-4 h-4 text-cyber-primary" />
            <div>
              <span className="text-[10px] text-cyber-muted uppercase block leading-none">ACTIVE LEVEL</span>
              <span className="text-sm font-bold text-white">LEVEL {currentMissionIndex + 1} OF {missions.length}</span>
            </div>
          </div>

          {/* Clock */}
          <div className="cyber-panel px-4 py-2 bg-[#0B1018]/90 backdrop-blur-sm border border-cyber-border rounded text-right flex items-center gap-3">
            <Clock className="w-4 h-4 text-cyber-warning" />
            <div>
              <span className="text-[10px] text-cyber-muted uppercase block leading-none">TIME REMAINING</span>
              <span className={`text-base font-bold tracking-wider ${
                timeRemainingSeconds < 300 ? 'text-cyber-danger animate-pulse' : 'text-cyber-primary'
              }`}>
                {formatTimer(timeRemainingSeconds)}
              </span>
            </div>
          </div>
        </div>

        {/* 7-Level Step Indicator Bar */}
        <div className="cyber-panel px-4 py-2.5 bg-[#0B1018]/90 backdrop-blur-sm border border-cyber-border rounded flex items-center justify-between gap-1 overflow-x-auto pointer-events-auto">
          {missions.map((m, idx) => {
            const isCompleted = idx < currentMissionIndex;
            const isCurrent = idx === currentMissionIndex;
            return (
              <div key={m.id} className="flex items-center gap-1.5 flex-1 min-w-[90px]">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 transition-all ${
                  isCompleted 
                    ? 'bg-cyber-success text-black' 
                    : isCurrent 
                    ? 'bg-cyber-primary text-black ring-4 ring-cyber-primary/20 shadow-[0_0_12px_rgba(0,255,204,0.5)]' 
                    : 'bg-cyber-panel-secondary text-cyber-muted border border-cyber-border'
                }`}>
                  {isCompleted ? '✓' : idx + 1}
                </div>
                <div className="flex flex-col truncate">
                  <span className={`text-[10px] font-bold leading-tight truncate ${
                    isCurrent ? 'text-cyber-primary' : isCompleted ? 'text-cyber-success' : 'text-cyber-muted'
                  }`}>
                    L{idx + 1}: {m.title.split(':')[1]?.trim() || m.title}
                  </span>
                  <span className="text-[9px] text-cyber-muted/70 uppercase">
                    {m.difficulty}
                  </span>
                </div>
                {idx < missions.length - 1 && (
                  <div className={`h-0.5 flex-1 mx-1 ${isCompleted ? 'bg-cyber-success/50' : 'bg-white/10'}`} />
                )}
              </div>
            );
          })}
        </div>

      </div>

      {/* Bottom HUD Bar */}
      <div className="absolute bottom-0 inset-x-0 z-10 pointer-events-none p-3 md:p-5 flex justify-between items-end">
        
        {/* Real-time Case Telemetry Log */}
        <div className="cyber-panel w-72 md:w-96 p-3 bg-[#0B1018]/90 border border-cyber-border backdrop-blur-sm rounded pointer-events-auto">
          <div className="flex items-center justify-between border-b border-cyber-border pb-1.5 mb-2">
            <span className="text-[10px] font-bold text-cyber-muted uppercase tracking-wider flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-cyber-primary" />
              CASE TELEMETRY
            </span>
            <span className="text-[9px] text-cyber-primary">STATUS: CONNECTED</span>
          </div>
          <div className="space-y-1 text-[11px] h-20 overflow-y-auto leading-relaxed">
            {logs.map((log, idx) => (
              <p key={idx} className={idx === 0 ? 'text-cyber-primary font-bold' : 'text-cyber-muted'}>
                {log}
              </p>
            ))}
          </div>
          <div className="mt-2 pt-2 border-t border-cyber-border text-[10px] text-cyber-warning leading-snug">
            💡 Case Clue: {currentMission.terminalHint}
          </div>
        </div>

        {/* Score & Progression */}
        <div className="flex flex-col items-end gap-2.5 pointer-events-auto">
          <div className="cyber-panel px-6 py-2.5 bg-[#0B1018]/90 border border-cyber-border backdrop-blur-sm rounded flex items-center gap-5">
            <div>
              <span className="text-[10px] text-cyber-muted uppercase block leading-none">SCORE</span>
              <span className="text-xl font-bold text-cyber-primary">{score}</span>
            </div>
            <div className="w-px h-7 bg-cyber-border" />
            <div>
              <span className="text-[10px] text-cyber-muted uppercase block leading-none">TACTICAL XP</span>
              <span className="text-xl font-bold text-cyber-secondary">{xp}</span>
            </div>
          </div>

          <button
            onClick={() => navigate('/result')}
            className="px-4 py-2 bg-cyber-danger/15 border border-cyber-danger text-cyber-danger hover:bg-cyber-danger hover:text-black text-xs font-bold uppercase tracking-wider rounded transition-all"
          >
            END ASSESSMENT & SUBMIT →
          </button>
        </div>

      </div>

      {/* Live Proctoring Webcam Feed */}
      <div className="fixed top-28 right-4 z-40 bg-[#0B1018]/95 border border-cyber-primary/40 backdrop-blur-md rounded-lg p-2.5 shadow-[0_0_25px_rgba(0,255,204,0.15)] flex flex-col gap-1.5 w-44 pointer-events-auto">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
            <span className="text-[9px] font-bold text-red-400 tracking-wider">PROCTORING</span>
          </div>
          <span className="text-[8px] text-cyber-primary font-mono-cyber uppercase">
            {cameraActive ? 'LIVE • OK' : 'CONNECTING'}
          </span>
        </div>
        <div className="w-full h-28 bg-black rounded border border-cyber-border overflow-hidden relative flex items-center justify-center">
          <video
            ref={proctorVideoRef}
            autoPlay
            playsInline
            muted
            className={`w-full h-full object-cover scale-x-[-1] ${cameraActive ? 'block' : 'hidden'}`}
          />
          {!cameraActive && (
            <div className="flex flex-col items-center justify-center gap-1 text-cyber-muted p-2 text-center">
              <VideoOff className="w-5 h-5 text-cyber-danger animate-pulse" />
              <span className="text-[8px] text-cyber-danger font-bold">CONNECTING CAM...</span>
            </div>
          )}
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md pointer-events-auto p-4 select-none font-mono-cyber">
          <div className="w-full max-w-xl cyber-panel p-8 border-2 border-cyber-primary text-center shadow-[0_0_60px_rgba(0,255,204,0.3)] rounded-lg animate-scaleIn">
            <div className="w-16 h-16 rounded-full bg-cyber-primary/20 border border-cyber-primary flex items-center justify-center mx-auto mb-4 shadow-[0_0_20px_rgba(0,255,204,0.3)]">
              <Trophy className="w-8 h-8 text-cyber-primary" />
            </div>

            <span className="text-[10px] uppercase font-bold tracking-widest px-3 py-1 bg-cyber-primary/10 border border-cyber-primary/30 text-cyber-primary rounded inline-block mb-2">
              SOC OPERATIONS COMPLETE
            </span>

            <h3 className="text-2xl md:text-3xl font-bold text-white uppercase tracking-tight">
              ROUND 01 A DEBRIEF COMPLETE
            </h3>

            <p className="text-xs text-cyber-muted mt-2 max-w-md mx-auto leading-relaxed">
              All 30 SOC screening questions and scenarios resolved. Your tactical performance baseline has been captured.
            </p>

            <div className="grid grid-cols-2 gap-3 my-6 p-4 rounded bg-[#090E1A] border border-cyber-border text-left">
              <div>
                <span className="text-[10px] text-cyber-muted uppercase block">SCORE EARNED</span>
                <span className="text-2xl font-bold text-cyber-primary font-mono">{score} PTS</span>
              </div>
              <div>
                <span className="text-[10px] text-cyber-muted uppercase block">XP PROGRESSION</span>
                <span className="text-2xl font-bold text-cyber-secondary font-mono">{xp} XP</span>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <button
                onClick={() => navigate('/technical-profile')}
                className="w-full py-4 bg-cyber-primary text-black font-bold text-xs uppercase tracking-wider rounded hover:bg-white transition-all shadow-[0_0_25px_rgba(0,255,204,0.3)] flex items-center justify-center gap-2 cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                ENTER ROUND 01 B: PERSONALIZED SKILL PROFILING &rarr;
              </button>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => navigate('/result')}
                  className="py-2.5 px-3 bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 font-bold text-xs uppercase tracking-wider rounded transition-all cursor-pointer"
                >
                  View Scorecard
                </button>
                <button
                  onClick={() => navigate('/arcade')}
                  className="py-2.5 px-3 bg-white/5 hover:bg-white/10 text-amber-400 border border-amber-400/30 font-bold text-xs uppercase tracking-wider rounded transition-all cursor-pointer"
                >
                  Play Arcade Puzzles
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Anti-Cheat Warning Modal */}
      {warningNotice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md pointer-events-auto p-4 select-none font-mono-cyber">
          <div className="w-full max-w-lg cyber-panel p-6 border-2 border-cyber-danger text-center shadow-[0_0_50px_rgba(239,68,68,0.5)] rounded-lg animate-scaleIn">
            <div className="w-14 h-14 rounded-full bg-cyber-danger/20 border border-cyber-danger flex items-center justify-center mx-auto mb-4 animate-bounce">
              <AlertTriangle className="w-8 h-8 text-cyber-danger" />
            </div>
            <h3 className="text-lg md:text-xl font-bold text-cyber-danger uppercase tracking-wider">
              INTEGRITY VIOLATION RECORDED
            </h3>
            <div className="mt-4 p-4 bg-black/70 border border-cyber-danger/40 rounded text-left text-xs text-cyber-text whitespace-pre-line leading-relaxed">
              {warningNotice.message}
            </div>
            <div className="mt-6 flex flex-col gap-2.5">
              <button
                onClick={restoreFullscreen}
                className="w-full py-3.5 bg-cyber-danger hover:bg-red-600 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 rounded transition-all shadow-[0_0_20px_rgba(239,68,68,0.4)] cursor-pointer"
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
