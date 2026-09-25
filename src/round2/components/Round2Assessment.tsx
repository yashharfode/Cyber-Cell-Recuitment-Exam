import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import type { 
  PersonalizedAssessmentBlueprint, 
  Round2Challenge, 
  ChallengeSubmission,
  TechnicalProfileResult,
  DomainProficiencyScore,
  Round2Domain,
  CandidateSkillProfile
} from '../../types/round2';
import { ROUND2_CHALLENGES } from '../data/challenges';
import { PRACTICAL_TASKS } from '../data/practicalTasks';
import FillInBlankModal from './FillInBlankModal';
import PracticalCodeEditor from './PracticalCodeEditor';
import { 
  Clock, 
  CheckCircle2, 
  ArrowRight, 
  Sparkles, 
  CornerDownLeft,
  Maximize2,
  AlertTriangle,
  ShieldAlert
} from 'lucide-react';
import { isBrowserFullscreen, enterBrowserFullscreen, FULLSCREEN_EVENTS } from '../../utils/fullscreen';

const cleanOptionText = (text: string) => text.replace(/^[A-Za-z0-9][.)]\s*/, '');

export default function Round2Assessment() {
  const navigate = useNavigate();

  const [blueprint, setBlueprint] = useState<PersonalizedAssessmentBlueprint | null>(null);
  const [profile, setProfile] = useState<CandidateSkillProfile | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [submissions, setSubmissions] = useState<ChallengeSubmission[]>([]);
  const [timeRemainingSeconds, setTimeRemainingSeconds] = useState(25 * 60);

  // Fullscreen & Proctoring Integrity
  const [showFullscreenModal, setShowFullscreenModal] = useState<boolean>(false);
  const [violationCount, setViolationCount] = useState<number>(0);
  const [violationNotice, setViolationNotice] = useState<string | null>(null);
  const proctorVideoRef = useRef<HTMLVideoElement>(null);
  const [cameraActive, setCameraActive] = useState<boolean>(false);

  // MCQ state for knowledge/application tiers
  const [selectedOption, setSelectedOption] = useState<string>('');
  const [isSubmittedCurrent, setIsSubmittedCurrent] = useState<boolean>(false);

  // Live webcam proctor stream
  useEffect(() => {
    let stream: MediaStream | null = null;
    let isMounted = true;

    const initWebcam = async () => {
      try {
        const s = await navigator.mediaDevices.getUserMedia({ 
          video: { width: { ideal: 320 }, height: { ideal: 240 }, facingMode: 'user' }, 
          audio: false 
        });
        if (isMounted) {
          stream = s;
          if (proctorVideoRef.current) {
            proctorVideoRef.current.srcObject = s;
          }
          setCameraActive(true);
        }
      } catch (err) {
        console.warn('Webcam stream unavailable in Round 01 B:', err);
        if (isMounted) setCameraActive(false);
      }
    };

    initWebcam();

    return () => {
      isMounted = false;
      if (stream) {
        stream.getTracks().forEach(t => t.stop());
      }
    };
  }, []);

  useEffect(() => {
    const rawBp = localStorage.getItem('round2_blueprint');
    const rawProfile = localStorage.getItem('round2_profile');

    if (!rawBp) {
      navigate('/technical-profile');
      return;
    }

    try {
      const parsedBp: PersonalizedAssessmentBlueprint = JSON.parse(rawBp);
      const parsedProf = rawProfile ? JSON.parse(rawProfile) : null;
      setBlueprint(parsedBp);
      setProfile(parsedProf);
      setTimeRemainingSeconds(parsedBp.timeLimitSeconds || 25 * 60);
    } catch (e) {
      console.error(e);
      navigate('/technical-profile');
    }
  }, [navigate]);

  const currentChallengeId = blueprint?.orderedChallengeIds[currentIndex];
  const currentChallenge: Round2Challenge | undefined = currentChallengeId 
    ? ROUND2_CHALLENGES.find(c => c.id === currentChallengeId) 
    : undefined;

  // Global Session Timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemainingSeconds(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          finalizeAssessment();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [submissions]);

  // Fullscreen integrity monitoring
  useEffect(() => {
    const handleFullscreenState = () => {
      if (!isBrowserFullscreen()) {
        setShowFullscreenModal(true);
        setViolationCount(prev => prev + 1);
        setViolationNotice('FULLSCREEN EXITED: Continuous fullscreen mode is required during the technical examination.');
      } else {
        setShowFullscreenModal(false);
      }
    };

    FULLSCREEN_EVENTS.forEach(evt => document.addEventListener(evt, handleFullscreenState));
    if (!isBrowserFullscreen()) {
      setShowFullscreenModal(true);
    }

    return () => {
      FULLSCREEN_EVENTS.forEach(evt => document.removeEventListener(evt, handleFullscreenState));
    };
  }, []);

  // Anti-Cheat: Tab switch & visibility monitoring
  useEffect(() => {
    const handleTabSwitch = () => {
      if (document.hidden) {
        setViolationCount(prev => prev + 1);
        setViolationNotice('TAB SWITCH RECORDED: You navigated away from the assessment tab. This event is logged in your candidate dossier.');
        setShowFullscreenModal(true);
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
  }, [submissions]);

  const requestFullscreen = async () => {
    const success = await enterBrowserFullscreen();
    if (success || isBrowserFullscreen()) {
      setShowFullscreenModal(false);
      setViolationNotice(null);
    }
  };

  // Keyboard navigation for MCQ tiers
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!currentChallenge || currentChallenge.tier === 'fill_in_blank' || currentChallenge.tier === 'subjective' || currentChallenge.tier === 'practical') return;

      const key = e.key.toUpperCase();

      if (e.key === 'Enter') {
        e.preventDefault();
        if (!isSubmittedCurrent) {
          if (selectedOption) handleMcqSubmit();
        } else {
          handleNextQuestion();
        }
        return;
      }

      if (!isSubmittedCurrent && currentChallenge.options) {
        if (key === 'A' || key === '1') setSelectedOption(currentChallenge.options[0] || '');
        else if (key === 'B' || key === '2') setSelectedOption(currentChallenge.options[1] || '');
        else if (key === 'C' || key === '3') setSelectedOption(currentChallenge.options[2] || '');
        else if (key === 'D' || key === '4') setSelectedOption(currentChallenge.options[3] || '');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  });

  const handleMcqSubmit = () => {
    if (!currentChallenge || !selectedOption || isSubmittedCurrent) return;

    const normUser = selectedOption.trim().toLowerCase();
    const normCorrect = String(currentChallenge.correctAnswer).trim().toLowerCase();
    const isCorrect = normUser === normCorrect || normCorrect.includes(normUser) || normUser.includes(normCorrect);
    const scoreEarned = isCorrect ? currentChallenge.points : 0;

    const sub: ChallengeSubmission = {
      challengeId: currentChallenge.id,
      domain: currentChallenge.domain,
      tier: currentChallenge.tier,
      userAnswer: selectedOption,
      awardedScore: scoreEarned,
      maxScore: currentChallenge.points,
      isCorrect,
      timeSpentSeconds: 30,
      timestamp: new Date().toISOString()
    };

    setSubmissions(prev => [...prev, sub]);
    setIsSubmittedCurrent(true);
  };

  const handleFillInBlankSubmit = (scoreEarned: number, userAnswer: string, isCorrect: boolean) => {
    if (!currentChallenge) return;

    const sub: ChallengeSubmission = {
      challengeId: currentChallenge.id,
      domain: currentChallenge.domain,
      tier: 'fill_in_blank',
      userAnswer,
      awardedScore: scoreEarned,
      maxScore: currentChallenge.points,
      isCorrect,
      timeSpentSeconds: 45,
      timestamp: new Date().toISOString()
    };

    setSubmissions(prev => [...prev, sub]);
    handleNextQuestion();
  };

  const handlePracticalSubmit = (scoreEarned: number, evaluation: any, codeFiles: Record<string, string>) => {
    if (!currentChallenge) return;

    const sub: ChallengeSubmission = {
      challengeId: currentChallenge.id,
      domain: currentChallenge.domain,
      tier: 'practical',
      userAnswer: '[PRACTICAL SOLUTION]',
      awardedScore: scoreEarned,
      maxScore: currentChallenge.points,
      practicalResult: {
        passedCount: evaluation.passedCount,
        totalCount: evaluation.totalCount,
        testCaseResults: evaluation.testCaseResults,
        code: codeFiles
      },
      timeSpentSeconds: 120,
      timestamp: new Date().toISOString()
    };

    setSubmissions(prev => [...prev, sub]);
    handleNextQuestion();
  };

  const handleNextQuestion = () => {
    setSelectedOption('');
    setIsSubmittedCurrent(false);

    if (currentIndex + 1 < (blueprint?.orderedChallengeIds.length || 0)) {
      setCurrentIndex(prev => prev + 1);
    } else {
      finalizeAssessment();
    }
  };

  const finalizeAssessment = () => {
    if (!profile || !blueprint) return;

    const totalAwarded = submissions.reduce((sum, s) => sum + s.awardedScore, 0);
    const totalMax = submissions.reduce((sum, s) => sum + s.maxScore, 0);

    const domainScores: Record<Round2Domain, DomainProficiencyScore> = {} as any;

    const domainsList: Round2Domain[] = [
      'WEB_DEVELOPMENT', 'PROGRAMMING', 'DSA', 'CYBERSECURITY', 
      'NETWORKING', 'DATABASE_SQL', 'LINUX_CLI', 'GIT_GITHUB', 'CLOUD_DEVOPS', 'OTHER'
    ];

    domainsList.forEach(domain => {
      const isAssessed = profile.selectedDomains.includes(domain);
      const domainSubs = submissions.filter(s => s.domain === domain);
      const earned = domainSubs.reduce((sum, s) => sum + s.awardedScore, 0);
      const maxPossible = domainSubs.reduce((sum, s) => sum + s.maxScore, 0);
      const pct = maxPossible > 0 ? Math.round((earned / maxPossible) * 100) : 0;

      domainScores[domain] = {
        domain,
        status: isAssessed ? 'ASSESSED' : 'NOT_ASSESSED',
        claimedLevel: profile.domainRatings[domain],
        knowledgeScore: isAssessed ? pct : null,
        applicationScore: isAssessed ? pct : null,
        practicalScore: isAssessed ? pct : null,
        overallDemonstrated: isAssessed ? pct : null,
        demonstratedBand: pct >= 80 ? 'Advanced' : pct >= 50 ? 'Intermediate' : pct > 0 ? 'Basic' : 'Beginner',
        challengesCount: domainSubs.length
      };
    });

    const evaluatedDomains = Object.values(domainScores).filter(d => d.status === 'ASSESSED');
    const sortedDomains = [...evaluatedDomains].sort((a, b) => (b.overallDemonstrated || 0) - (a.overallDemonstrated || 0));

    const result: TechnicalProfileResult = {
      round2AttemptId: `r2-${Date.now()}`,
      candidateId: profile.candidateId,
      candidateName: (profile as any).candidateName || 'Candidate',
      scholarNumber: (profile as any).scholarNumber || '12345',
      totalScoreEarned: totalAwarded,
      maxScorePossible: totalMax,
      percentage: totalMax > 0 ? Math.round((totalAwarded / totalMax) * 100) : 0,
      domainScores,
      primaryStrength: sortedDomains[0]?.domain || 'Technical Fundamentals',
      secondaryStrength: sortedDomains[1]?.domain,
      emergingStrength: sortedDomains[2]?.domain,
      submissions,
      completedAt: new Date().toISOString()
    };

    try {
      localStorage.setItem('round2_result', JSON.stringify(result));
    } catch (e) {
      console.error(e);
    }

    navigate('/technical-result');
  };

  const currentPracticalTask = currentChallenge?.practicalTaskId 
    ? PRACTICAL_TASKS[currentChallenge.practicalTaskId] 
    : undefined;

  if (!blueprint) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center font-mono text-sky-700 text-xs">
        INITIALIZING TECHNICAL ASSESSMENT ENVIRONMENT...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans select-none">
      
      {/* Top Fixed HUD Banner */}
      <div className="bg-white/95 backdrop-blur-md border-b border-slate-200 px-4 md:px-8 py-3 flex items-center justify-between sticky top-0 z-30 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-2.5 h-2.5 rounded-full bg-sky-600 animate-ping" />
          <div>
            <h1 className="text-xs md:text-sm font-bold text-slate-900 tracking-wider uppercase">
              ROUND 01 B • TECHNICAL ASSESSMENT
            </h1>
            <p className="text-[10px] text-slate-500 font-mono">
              CHALLENGE {currentIndex + 1} OF {blueprint.orderedChallengeIds.length} • {currentChallenge?.domain || 'TECHNICAL'}
            </p>
          </div>
        </div>

        {/* Step Indicator */}
        <div className="hidden sm:flex items-center gap-1.5">
          {blueprint.orderedChallengeIds.map((_, idx) => (
            <div
              key={idx}
              className={`w-2 h-2 rounded-full transition-all ${
                idx === currentIndex
                  ? 'bg-sky-600 ring-4 ring-sky-100 scale-125'
                  : idx < currentIndex
                  ? 'bg-emerald-500'
                  : 'bg-slate-200'
              }`}
            />
          ))}
        </div>

        {/* Right HUD Controls: Webcam + Fullscreen + Timer */}
        <div className="flex items-center gap-3">
          {/* Proctoring Webcam Mini-Pip */}
          <div className="relative w-12 h-9 sm:w-14 sm:h-10 bg-slate-100 border border-slate-200 rounded-lg overflow-hidden shrink-0">
            <video
              ref={proctorVideoRef}
              autoPlay
              muted
              playsInline
              className="w-full h-full object-cover -scale-x-100"
            />
            <div className="absolute top-1 right-1 flex items-center gap-1 bg-white/90 px-1 py-0.2 rounded text-[8px] font-mono shadow-xs">
              <span className={`w-1.5 h-1.5 rounded-full ${cameraActive ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`} />
              <span className="text-slate-800 hidden md:inline">PROCTOR</span>
            </div>
          </div>

          {/* Fullscreen Button */}
          <button
            onClick={requestFullscreen}
            className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 transition-all text-xs flex items-center gap-1.5 cursor-pointer"
            title="Toggle Fullscreen"
          >
            <Maximize2 className="w-3.5 h-3.5" />
            <span className="hidden lg:inline text-[10px] font-bold">FULLSCREEN</span>
          </button>

          {/* Countdown Timer */}
          <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 border border-slate-200 rounded-lg text-xs font-mono">
            <Clock className="w-4 h-4 text-amber-600" />
            <span className={timeRemainingSeconds < 180 ? 'text-red-600 font-bold animate-pulse' : 'text-slate-900 font-bold'}>
              {Math.floor(timeRemainingSeconds / 60)}:{(timeRemainingSeconds % 60).toString().padStart(2, '0')}
            </span>
          </div>
        </div>
      </div>

      {/* Main Challenge Viewport */}
      <div className="flex-1 flex items-center justify-center p-4 md:p-8">
        
        {/* Render Tier 4: Practical Coding Task */}
        {currentChallenge?.tier === 'practical' && currentPracticalTask && (
          <PracticalCodeEditor
            task={currentPracticalTask}
            onSubmit={handlePracticalSubmit}
            secondsRemaining={timeRemainingSeconds}
          />
        )}

        {/* Render Tier 3: Fill in the Blank Interactive Slots */}
        {(currentChallenge?.tier === 'fill_in_blank' || currentChallenge?.tier === 'subjective') && (
          <FillInBlankModal
            challenge={currentChallenge}
            onSubmit={handleFillInBlankSubmit}
            secondsRemaining={timeRemainingSeconds}
          />
        )}

        {/* Render Tier 1 & 2: Knowledge / Application MCQ */}
        {currentChallenge && 
         currentChallenge.tier !== 'fill_in_blank' && 
         currentChallenge.tier !== 'subjective' && 
         currentChallenge.tier !== 'practical' && (
          <div className="w-full max-w-3xl bg-white border border-slate-200 flex flex-col max-h-[85vh] shadow-xl rounded-2xl animate-scaleIn overflow-hidden my-auto font-sans">
            
            {/* Challenge Header - Fixed */}
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4 bg-slate-50 shrink-0">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 bg-sky-50 text-sky-700 border border-sky-200 rounded">
                    {currentChallenge.tier === 'knowledge' ? 'TIER 1 • KNOWLEDGE' : 'TIER 2 • APPLICATION'}
                  </span>
                  <span className="text-[10px] text-slate-500 uppercase font-mono">
                    {currentChallenge.domain} • {currentChallenge.subSkill}
                  </span>
                </div>
                <h2 className="text-base sm:text-lg md:text-xl font-bold text-slate-900 tracking-tight mt-1">
                  {currentChallenge.title}
                </h2>
              </div>
              <div className="text-xs px-2.5 py-1 bg-indigo-50 text-indigo-700 border border-indigo-200 font-semibold rounded-md shrink-0">
                +{currentChallenge.points} PTS
              </div>
            </div>

            {/* Scrollable Content Body */}
            <div className="flex-1 overflow-y-auto min-h-0 px-6 py-5 space-y-4">
              {/* Prompt Box */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl leading-relaxed text-sm text-slate-800 whitespace-pre-wrap">
                {currentChallenge.prompt}
              </div>

              {/* MCQ Options */}
              {currentChallenge.options && (
                <div className="space-y-2.5">
                  <div className="flex justify-between items-center mb-1">
                    <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">
                      SELECT YOUR ANSWER:
                    </p>
                    <span className="text-[11px] text-slate-500 hidden sm:inline-block">
                      Tip: Press <kbd className="px-1.5 py-0.5 bg-slate-100 border border-slate-300 text-slate-700 rounded text-[10px]">A</kbd> <kbd className="px-1.5 py-0.5 bg-slate-100 border border-slate-300 text-slate-700 rounded text-[10px]">B</kbd> <kbd className="px-1.5 py-0.5 bg-slate-100 border border-slate-300 text-slate-700 rounded text-[10px]">C</kbd> <kbd className="px-1.5 py-0.5 bg-slate-100 border border-slate-300 text-slate-700 rounded text-[10px]">D</kbd> or <kbd className="px-1.5 py-0.5 bg-slate-100 border border-slate-300 text-slate-700 rounded text-[10px]">↵ ENTER</kbd>
                    </span>
                  </div>

                  {currentChallenge.options.map((opt, idx) => {
                    const isSelected = selectedOption === opt;
                    return (
                      <button
                        key={idx}
                        type="button"
                        disabled={isSubmittedCurrent}
                        onClick={() => setSelectedOption(opt)}
                        className={`w-full text-left p-3.5 text-sm transition-all rounded-xl flex items-start gap-3 cursor-pointer disabled:cursor-not-allowed ${
                          isSelected
                            ? 'border border-sky-500 bg-sky-50 text-slate-900 font-semibold ring-1 ring-sky-500/20'
                            : 'border border-slate-200 bg-white text-slate-700 hover:border-sky-300 hover:bg-slate-50'
                        }`}
                      >
                        <span className={`w-5 h-5 shrink-0 rounded-full flex items-center justify-center text-xs font-semibold border transition-colors ${
                          isSelected ? 'border-sky-600 bg-sky-600 text-white font-bold' : 'border-slate-300 text-slate-500 bg-slate-100'
                        }`}>
                          {String.fromCharCode(65 + idx)}
                        </span>
                        <span className="leading-snug pt-0.5">{cleanOptionText(opt)}</span>
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Neutral Response Recorded Confirmation */}
              {isSubmittedCurrent && (
                <div className="p-3.5 border border-emerald-200 bg-emerald-50 rounded-xl flex items-center justify-between text-emerald-800 animate-fadeIn">
                  <div className="flex items-center gap-2.5 text-sm font-semibold">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    <span>RESPONSE RECORDED</span>
                  </div>
                  <span className="text-xs text-slate-500 hidden sm:inline">Press ENTER or click Next Challenge to proceed</span>
                </div>
              )}
            </div>

            {/* Footer - Fixed */}
            <div className="flex justify-between items-center px-6 py-4 border-t border-slate-200 bg-slate-50 shrink-0">
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <CornerDownLeft className="w-4 h-4 text-sky-600" />
                <span>Press <kbd className="px-1.5 py-0.5 bg-white border border-slate-300 text-slate-800 rounded font-mono text-[10px]">ENTER</kbd> to {isSubmittedCurrent ? 'proceed to next' : 'submit'}</span>
              </div>

              {!isSubmittedCurrent ? (
                <button
                  type="button"
                  onClick={handleMcqSubmit}
                  disabled={!selectedOption}
                  className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs uppercase tracking-wider rounded-xl transition-all shadow-xs active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4 text-sky-400" />
                  <span>SUBMIT ANSWER [ ↵ ]</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleNextQuestion}
                  className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs uppercase tracking-wider rounded-xl transition-all shadow-xs active:scale-95 cursor-pointer flex items-center gap-2"
                >
                  <span>NEXT CHALLENGE [ ↵ ]</span>
                  <ArrowRight className="w-4 h-4 text-white" />
                </button>
              )}
            </div>

          </div>
        )}

      </div>

      {/* Fullscreen Required / Exit Warning Modal */}
      {showFullscreenModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 select-none">
          <div className="w-full max-w-lg bg-white p-6 border border-red-200 text-center shadow-xl rounded-2xl animate-scaleIn">
            <div className="w-12 h-12 rounded-xl bg-red-50 border border-red-200 text-red-600 flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>

            <h3 className="text-lg font-bold text-slate-900 uppercase tracking-tight">
              Fullscreen Mode Mandatory
            </h3>

            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              {violationNotice || 'Recruitment integrity policies require uninterrupted fullscreen mode throughout Round 01 B.'}
            </p>

            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-xl text-left text-xs text-red-800 flex items-center gap-2.5">
              <ShieldAlert className="w-4 h-4 shrink-0 text-red-600" />
              <span>
                Violations Recorded: <strong>{violationCount}</strong>. Continued tab or app switching will result in automatic session termination.
              </span>
            </div>

            <button
              onClick={requestFullscreen}
              className="mt-6 w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
            >
              <Maximize2 className="w-4 h-4" />
              <span>RETURN TO FULLSCREEN & RESUME</span>
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
