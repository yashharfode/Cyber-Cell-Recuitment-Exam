import { useState, useEffect, useRef, useCallback } from 'react';
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
import { useStore } from '../../store/useStore';
import { DOMAIN_METADATA } from '../data/skillTree';
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
  const { candidate } = useStore();

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
    const rawBp = sessionStorage.getItem('r2_blueprint');
    const rawProfile = sessionStorage.getItem('r2_profile');

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

  // Overall Countdown Timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemainingSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          finalizeAssessment();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [submissions, blueprint]);

  const currentChallengeId = blueprint?.orderedChallengeIds[currentIndex];
  // Look up challenge from static bank or blueprint sections
  let currentChallenge: Round2Challenge | undefined = undefined;
  if (blueprint) {
    for (const sec of blueprint.sections) {
      const found = sec.challenges.find(c => c.id === currentChallengeId);
      if (found) {
        currentChallenge = found;
        break;
      }
    }
    if (!currentChallenge) {
      currentChallenge = ROUND2_CHALLENGES.find(c => c.id === currentChallengeId);
    }
  }

  // Active state refs for event listeners
  const currentChallengeRef = useRef<Round2Challenge | undefined>(currentChallenge);
  const currentIndexRef = useRef<number>(currentIndex);
  const isSubmittedCurrentRef = useRef<boolean>(isSubmittedCurrent);
  const blueprintRef = useRef<PersonalizedAssessmentBlueprint | null>(blueprint);
  const finalizeAssessmentRef = useRef<(customSubs?: ChallengeSubmission[]) => void>(() => {});

  useEffect(() => {
    currentChallengeRef.current = currentChallenge;
  }, [currentChallenge]);

  useEffect(() => {
    currentIndexRef.current = currentIndex;
  }, [currentIndex]);

  useEffect(() => {
    isSubmittedCurrentRef.current = isSubmittedCurrent;
  }, [isSubmittedCurrent]);

  useEffect(() => {
    blueprintRef.current = blueprint;
  }, [blueprint]);

  const finalizeAssessment = useCallback((customSubs?: ChallengeSubmission[]) => {
    if (!blueprintRef.current) return;
    const bp = blueprintRef.current;
    const finalSubs = customSubs || submissions;

    // Compile domain proficiency scores
    const allDomains = Object.keys(DOMAIN_METADATA) as Round2Domain[];
    const domainScores: Record<Round2Domain, DomainProficiencyScore> = {} as any;
    const selectedDomainsList = profile?.selectedDomains || [];

    allDomains.forEach((dom) => {
      const isAssessed = selectedDomainsList.includes(dom);

      if (!isAssessed) {
        domainScores[dom] = {
          domain: dom,
          status: 'NOT_ASSESSED',
          knowledgeScore: null,
          applicationScore: null,
          practicalScore: null,
          overallDemonstrated: null,
          challengesCount: 0
        };
      } else {
        const domSubs = finalSubs.filter(s => s.domain === dom);
        const kSubs = domSubs.filter(s => s.tier === 'knowledge');
        const aSubs = domSubs.filter(s => s.tier === 'application' || s.tier === 'fill_in_blank');
        const pSubs = domSubs.filter(s => s.tier === 'practical');

        const kScore = kSubs.length > 0 
          ? Math.max(0, Math.round((kSubs.reduce((acc, s) => acc + s.awardedScore, 0) / (kSubs.length * 100)) * 100))
          : 80;
        const aScore = aSubs.length > 0 
          ? Math.max(0, Math.round((aSubs.reduce((acc, s) => acc + s.awardedScore, 0) / (aSubs.length * 100)) * 100))
          : 75;
        const pScore = pSubs.length > 0 
          ? Math.max(0, Math.round((pSubs.reduce((acc, s) => acc + s.awardedScore, 0) / (pSubs.length * 100)) * 100))
          : 85;

        const overall = Math.max(0, Math.round((kScore * 0.3) + (aScore * 0.35) + (pScore * 0.35)));

        let band: 'Beginner' | 'Basic' | 'Intermediate' | 'Advanced' | 'Mastery' = 'Basic';
        if (overall >= 90) band = 'Mastery';
        else if (overall >= 80) band = 'Advanced';
        else if (overall >= 65) band = 'Intermediate';
        else if (overall >= 45) band = 'Basic';
        else band = 'Beginner';

        domainScores[dom] = {
          domain: dom,
          status: 'ASSESSED',
          claimedLevel: profile?.domainRatings[dom] || 'intermediate',
          knowledgeScore: kScore,
          applicationScore: aScore,
          practicalScore: pScore,
          overallDemonstrated: overall,
          demonstratedBand: band,
          challengesCount: domSubs.length
        };
      }
    });

    const assessedList = Object.values(domainScores)
      .filter(d => d.status === 'ASSESSED' && d.overallDemonstrated !== null)
      .sort((a, b) => (b.overallDemonstrated || 0) - (a.overallDemonstrated || 0));

    const primaryStrength = assessedList[0]?.domain 
      ? DOMAIN_METADATA[assessedList[0].domain].title 
      : 'Technical Problem Solving';
    const secondaryStrength = assessedList[1]?.domain 
      ? DOMAIN_METADATA[assessedList[1].domain].title 
      : undefined;
    const emergingStrength = assessedList[2]?.domain 
      ? DOMAIN_METADATA[assessedList[2].domain].title 
      : undefined;

    const totalEarned = finalSubs.reduce((acc, s) => acc + s.awardedScore, 0);
    const maxPoss = bp.maxScore;

    const result: TechnicalProfileResult = {
      round2AttemptId: `r2-${candidate?.id || 'demo'}-${Date.now().toString(36)}`,
      candidateId: candidate?.id || 'demo-user',
      candidateName: candidate?.name || 'Candidate Operative',
      scholarNumber: candidate?.scholarNumber || '00000',
      completedAt: new Date().toISOString(),
      totalScoreEarned: totalEarned,
      maxScorePossible: maxPoss,
      percentage: Math.max(0, Math.round((totalEarned / maxPoss) * 100)),
      domainScores,
      primaryStrength,
      secondaryStrength,
      emergingStrength,
      submissions: finalSubs
    };

    sessionStorage.setItem('r2_result', JSON.stringify(result));
    navigate('/round2-result');
  }, [submissions, profile, candidate, navigate]);

  useEffect(() => {
    finalizeAssessmentRef.current = finalizeAssessment;
  }, [finalizeAssessment]);

  // Robust Cross-Browser Fullscreen integrity listener
  useEffect(() => {
    // 450ms initial check grace period to allow browser fullscreen transition from button click to resolve
    const mountCheckTimer = setTimeout(() => {
      if (!isBrowserFullscreen()) {
        setShowFullscreenModal(true);
      }
    }, 450);

    const handleFullscreenChange = () => {
      const isFs = isBrowserFullscreen();
      if (!isFs) {
        const activeChal = currentChallengeRef.current;
        const isSubmitted = isSubmittedCurrentRef.current;
        const bp = blueprintRef.current;
        const cIdx = currentIndexRef.current;

        if (activeChal && !isSubmitted) {
          const skippedTitle = activeChal.title;

          // Deduct -50 PTS negative marking penalty and skip
          const skippedSubmission: ChallengeSubmission = {
            challengeId: activeChal.id,
            domain: activeChal.domain,
            tier: activeChal.tier,
            userAnswer: '[SKIPPED DUE TO FULLSCREEN VIOLATION]',
            awardedScore: -50,
            maxScore: activeChal.points,
            isCorrect: false,
            timeSpentSeconds: 0,
            timestamp: new Date().toISOString()
          };

          const updatedSubs = [...submissions, skippedSubmission];
          setSubmissions(updatedSubs);

          // Advance to next challenge
          if (bp && cIdx + 1 < bp.orderedChallengeIds.length) {
            setCurrentIndex(cIdx + 1);
          } else {
            finalizeAssessmentRef.current(updatedSubs);
          }

          setSelectedOption('');
          setIsSubmittedCurrent(false);
          setViolationCount(prev => prev + 1);

          setViolationNotice(
            `CRITICAL INTEGRITY VIOLATION: FULLSCREEN EXITED!\n\nQuestion "${skippedTitle}" was immediately SKIPPED and a -50 POINTS NEGATIVE MARKING penalty has been deducted from your score!\n\n⚠️ DO NOT EXIT FULLSCREEN AGAIN! Continuous fullscreen mode is strictly mandatory throughout Round 01 B.`
          );
          setShowFullscreenModal(true);
        } else {
          setViolationNotice(
            `SECURITY WARNING: FULLSCREEN EXITED!\n\nContinuous fullscreen mode is strictly mandatory during Round 01 B. Exiting fullscreen during an active question will skip it with -50 PTS negative marking!\n\nPlease restore fullscreen immediately to continue.`
          );
          setShowFullscreenModal(true);
        }
      } else {
        setShowFullscreenModal(false);
      }
    };

    FULLSCREEN_EVENTS.forEach((evt) => {
      document.addEventListener(evt, handleFullscreenChange);
    });

    return () => {
      clearTimeout(mountCheckTimer);
      FULLSCREEN_EVENTS.forEach((evt) => {
        document.removeEventListener(evt, handleFullscreenChange);
      });
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

  if (!blueprint) {
    return (
      <div className="min-h-screen bg-[#05070D] flex items-center justify-center font-mono-cyber text-cyber-primary">
        INITIALIZING PERSONALIZED TECHNICAL ENVIRONMENT...
      </div>
    );
  }

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

    if (currentIndex + 1 < blueprint.orderedChallengeIds.length) {
      setCurrentIndex(prev => prev + 1);
    } else {
      finalizeAssessment();
    }
  };

  const currentPracticalTask = currentChallenge?.practicalTaskId 
    ? PRACTICAL_TASKS[currentChallenge.practicalTaskId] 
    : undefined;

  return (
    <div className="min-h-screen bg-[#05070D] text-cyber-text flex flex-col font-mono-cyber select-none">
      
      {/* Top Fixed HUD Banner */}
      <div className="bg-[#0B1018] border-b border-cyber-border px-4 md:px-8 py-3 flex items-center justify-between sticky top-0 z-30 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-2.5 h-2.5 rounded-full bg-cyber-primary animate-ping" />
          <div>
            <h1 className="text-xs md:text-sm font-bold text-white tracking-widest uppercase">
              ROUND 01 B • TECHNICAL ASSESSMENT
            </h1>
            <p className="text-[10px] text-cyber-muted">
              CHALLENGE {currentIndex + 1} OF {blueprint.orderedChallengeIds.length} • {currentChallenge?.domain || 'TECHNICAL'}
            </p>
          </div>
        </div>

        {/* Step Indicator */}
        <div className="hidden sm:flex items-center gap-1.5">
          {blueprint.orderedChallengeIds.map((_, idx) => (
            <div
              key={idx}
              className={`w-2.5 h-2.5 rounded-full transition-all ${
                idx === currentIndex
                  ? 'bg-cyber-primary ring-4 ring-cyber-primary/20 scale-125'
                  : idx < currentIndex
                  ? 'bg-cyber-success'
                  : 'bg-white/10'
              }`}
            />
          ))}
        </div>

        {/* Right HUD Controls: Webcam + Fullscreen + Timer */}
        <div className="flex items-center gap-3">
          {/* Proctoring Webcam Mini-Pip */}
          <div className="relative w-14 h-10 bg-black border border-cyber-border rounded overflow-hidden hidden sm:block">
            <video
              ref={proctorVideoRef}
              autoPlay
              muted
              playsInline
              className="w-full h-full object-cover mirror"
            />
            <div className="absolute top-1 right-1 flex items-center gap-1 bg-black/70 px-1 py-0.2 rounded text-[8px]">
              <span className={`w-1.5 h-1.5 rounded-full ${cameraActive ? 'bg-cyber-success animate-pulse' : 'bg-red-500'}`} />
              <span className="text-white hidden md:inline">PROCTOR</span>
            </div>
          </div>

          {/* Fullscreen Button */}
          <button
            onClick={requestFullscreen}
            className="p-2 rounded bg-[#05070D] hover:bg-white/5 border border-cyber-border text-cyber-muted hover:text-cyber-primary transition-all text-xs flex items-center gap-1.5"
            title="Toggle Fullscreen"
          >
            <Maximize2 className="w-3.5 h-3.5" />
            <span className="hidden lg:inline text-[10px] font-bold">FULLSCREEN</span>
          </button>

          {/* Countdown Timer */}
          <div className="flex items-center gap-2 px-3 py-1.5 bg-[#05070D] border border-cyber-border rounded text-xs">
            <Clock className="w-4 h-4 text-cyber-warning" />
            <span className={timeRemainingSeconds < 180 ? 'text-cyber-danger font-bold animate-pulse' : 'text-cyber-primary font-bold'}>
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
          <div className="w-full max-w-3xl cyber-panel border border-cyber-primary/40 p-6 md:p-8 flex flex-col shadow-[0_0_50px_rgba(0,255,204,0.15)] rounded-lg animate-scaleIn">
            
            {/* Challenge Header */}
            <div className="flex items-center justify-between border-b border-cyber-border pb-4 mb-5">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 bg-cyber-primary/20 text-cyber-primary border border-cyber-primary/30 rounded">
                    {currentChallenge.tier === 'knowledge' ? 'TIER 1 • KNOWLEDGE' : 'TIER 2 • APPLICATION'}
                  </span>
                  <span className="text-[10px] text-cyber-muted uppercase">
                    {currentChallenge.domain} • {currentChallenge.subSkill}
                  </span>
                </div>
                <h2 className="text-lg md:text-xl font-bold text-white tracking-wide mt-1">
                  {currentChallenge.title}
                </h2>
              </div>
              <div className="text-xs px-3 py-1 bg-cyber-primary text-black font-bold rounded">
                +{currentChallenge.points} PTS
              </div>
            </div>

            {/* Prompt Box */}
            <div className="mb-6 p-4 bg-[#05070D] border border-cyber-border/80 rounded leading-relaxed text-sm text-cyber-text whitespace-pre-wrap">
              {currentChallenge.prompt}
            </div>

            {/* MCQ Options */}
            {currentChallenge.options && (
              <div className="space-y-3 flex-1">
                <div className="flex justify-between items-center mb-2">
                  <p className="text-xs text-cyber-muted font-bold uppercase tracking-wider">
                    SELECT YOUR ANSWER:
                  </p>
                  <span className="text-[11px] text-cyber-primary/80 hidden sm:inline-block">
                    Tip: Press <kbd className="px-1.5 py-0.5 bg-black border border-cyber-primary/50 text-cyber-primary rounded">A</kbd> <kbd className="px-1.5 py-0.5 bg-black border border-cyber-primary/50 text-cyber-primary rounded">B</kbd> <kbd className="px-1.5 py-0.5 bg-black border border-cyber-primary/50 text-cyber-primary rounded">C</kbd> <kbd className="px-1.5 py-0.5 bg-black border border-cyber-primary/50 text-cyber-primary rounded">D</kbd> or <kbd className="px-1.5 py-0.5 bg-black border border-cyber-primary/50 text-cyber-primary rounded">↵ ENTER</kbd>
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
                      className={`w-full text-left p-4 text-sm transition-all duration-200 transform hover:scale-[1.01] active:scale-[0.99] border rounded flex items-start gap-3.5 cursor-pointer disabled:cursor-not-allowed ${
                        isSelected
                          ? 'border-cyber-primary bg-cyber-primary/15 text-white shadow-[0_0_15px_rgba(0,255,204,0.15)] font-medium'
                          : 'border-cyber-border bg-[#0B1018] text-cyber-muted hover:border-cyber-primary/40 hover:text-white'
                      }`}
                    >
                      <span className={`w-6 h-6 shrink-0 rounded-full flex items-center justify-center text-xs font-bold border transition-colors ${
                        isSelected ? 'border-cyber-primary bg-cyber-primary text-black' : 'border-cyber-border text-cyber-muted'
                      }`}>
                        {String.fromCharCode(65 + idx)}
                      </span>
                      <span className="leading-snug pt-0.5">{cleanOptionText(opt)}</span>
                    </button>
                  );
                })}
              </div>
            )}

            {/* Neutral Response Recorded Confirmation (No correct/wrong or explanation during test) */}
            {isSubmittedCurrent && (
              <div className="mt-6 p-4 border border-cyber-primary/40 bg-cyber-primary/10 rounded flex items-center justify-between text-cyber-primary animate-fadeIn">
                <div className="flex items-center gap-2.5 text-sm font-bold">
                  <CheckCircle2 className="w-5 h-5 text-cyber-primary" />
                  <span>RESPONSE RECORDED</span>
                </div>
                <span className="text-xs text-cyber-muted hidden sm:inline">Press ENTER or click Next Challenge to proceed</span>
              </div>
            )}

            {/* Footer */}
            <div className="flex justify-between items-center mt-6 pt-4 border-t border-cyber-border">
              <div className="flex items-center gap-2 text-xs text-cyber-muted">
                <CornerDownLeft className="w-4 h-4 text-cyber-primary" />
                <span>Press <kbd className="px-1.5 py-0.5 bg-black border border-cyber-border text-white rounded font-bold">ENTER</kbd> to {isSubmittedCurrent ? 'proceed to next' : 'submit'}</span>
              </div>

              {!isSubmittedCurrent ? (
                <button
                  type="button"
                  onClick={handleMcqSubmit}
                  disabled={!selectedOption}
                  className="px-6 py-3 bg-cyber-primary text-black font-bold text-xs uppercase tracking-wider hover:bg-white transition-all shadow-[0_0_20px_rgba(0,255,204,0.3)] rounded flex items-center gap-2 transform active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>SUBMIT ANSWER [ ↵ ]</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleNextQuestion}
                  className="px-6 py-3 bg-cyber-primary text-black font-bold text-xs uppercase tracking-wider hover:bg-white transition-all rounded flex items-center gap-2 shadow-[0_0_20px_rgba(0,255,204,0.3)] transform active:scale-95 cursor-pointer"
                >
                  <span>NEXT CHALLENGE [ ↵ ]</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>

          </div>
        )}

      </div>

      {/* Fullscreen Required / Exit Warning Modal */}
      {showFullscreenModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md pointer-events-auto p-4 select-none font-mono-cyber">
          <div className="w-full max-w-lg cyber-panel p-8 border-2 border-red-500 text-center shadow-[0_0_60px_rgba(239,68,68,0.5)] rounded-lg animate-scaleIn">
            <div className="w-16 h-16 rounded-full bg-red-950/40 border-2 border-red-500 flex items-center justify-center mx-auto mb-4 animate-bounce">
              <AlertTriangle className="w-8 h-8 text-red-500" />
            </div>

            <span className="text-[10px] uppercase font-bold tracking-widest px-3 py-1 bg-red-500/10 border border-red-500/30 text-red-400 rounded inline-block mb-2">
              COMPETITIVE INTEGRITY ENFORCEMENT
            </span>

            <h2 className="text-xl md:text-2xl font-bold text-white uppercase tracking-tight">
              FULLSCREEN MODE REQUIRED
            </h2>

            <p className="text-xs text-slate-300 mt-2 max-w-md mx-auto leading-relaxed">
              Round 01 B is an official technical skill assessment. Candidates are strictly required to maintain continuous fullscreen mode. Exiting fullscreen or tab switching triggers an immediate penalty!
            </p>

            {violationNotice ? (
              <div className="mt-4 p-4 bg-red-950/60 border-2 border-red-500/60 rounded text-xs text-red-200 text-left whitespace-pre-wrap leading-relaxed shadow-lg">
                <div className="flex items-center gap-2 text-red-400 font-bold mb-1.5 uppercase tracking-wider text-[11px]">
                  <ShieldAlert className="w-4 h-4 shrink-0" />
                  <span>INTEGRITY PENALTY RECORDED:</span>
                </div>
                {violationNotice}
                {violationCount > 1 && (
                  <p className="mt-2 pt-2 border-t border-red-500/30 text-[11px] text-red-300 font-bold">
                    Total violations logged: {violationCount}
                  </p>
                )}
              </div>
            ) : (
              <div className="mt-4 p-3 bg-red-950/40 border border-red-500/30 rounded text-xs text-red-300">
                Please enter fullscreen mode to begin or continue your calibrated technical assessment.
              </div>
            )}

            <div className="mt-6 flex flex-col gap-3">
              <button
                onClick={requestFullscreen}
                className="w-full py-4 bg-cyber-primary text-black font-extrabold text-xs uppercase tracking-wider rounded hover:bg-white transition-all shadow-[0_0_25px_rgba(0,255,204,0.35)] flex items-center justify-center gap-2 cursor-pointer transform active:scale-95"
              >
                <Maximize2 className="w-4 h-4" />
                RESTORE FULLSCREEN & CONTINUE TEST &rarr;
              </button>

              <button
                onClick={() => navigate('/technical-profile')}
                className="w-full py-2.5 bg-white/5 hover:bg-white/10 text-cyber-muted hover:text-white text-xs font-bold uppercase tracking-wider rounded border border-white/10 transition-all cursor-pointer"
              >
                Return to Skill Setup
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
