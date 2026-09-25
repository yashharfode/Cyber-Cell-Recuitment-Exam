import { useState, useEffect } from 'react';
import type { Challenge } from '../../types';
import { useStore } from '../../store/useStore';
import { 
  FileText, 
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowRight,
  CornerDownLeft
} from 'lucide-react';
import VisualCaseViewer from './VisualCaseViewer';
import InteractiveGameDispatcher from '../../minigames/InteractiveGameDispatcher';
import { isBrowserFullscreen, FULLSCREEN_EVENTS } from '../../utils/fullscreen';

interface ChallengeModalProps {
  challenge: Challenge;
  onClose: () => void;
  onSuccessNext?: () => void;
}

const cleanOptionText = (text: string) => text.replace(/^[A-Za-z0-9][.)]\s*/, '');

export default function ChallengeModal({ challenge, onClose, onSuccessNext }: ChallengeModalProps) {
  const { submitChallengeAnswer } = useStore();

  const [selectedOption, setSelectedOption] = useState<string>('');
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [orderedList, setOrderedList] = useState<string[]>([]);
  
  const [startTime] = useState<number>(Date.now());
  const [secondsRemaining, setSecondsRemaining] = useState<number>(challenge.timeLimit || 60);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  // Guarantee pointer lock is released and mouse cursor is visible
  useEffect(() => {
    if (document.exitPointerLock) {
      document.exitPointerLock();
    }
    const prevCursor = document.body.style.cursor;
    document.body.style.cursor = 'default';
    return () => {
      document.body.style.cursor = prevCursor;
    };
  }, []);

  // Security integrity: If candidate exits fullscreen or switches tabs, immediately disappear the question
  useEffect(() => {
    const handleFullscreenState = () => {
      if (!isBrowserFullscreen()) {
        onClose();
      }
    };

    const handleVisibilityState = () => {
      if (document.hidden) {
        onClose();
      }
    };

    FULLSCREEN_EVENTS.forEach(evt => document.addEventListener(evt, handleFullscreenState));
    document.addEventListener('visibilitychange', handleVisibilityState);
    window.addEventListener('blur', handleVisibilityState);

    return () => {
      FULLSCREEN_EVENTS.forEach(evt => document.removeEventListener(evt, handleFullscreenState));
      document.removeEventListener('visibilitychange', handleVisibilityState);
      window.removeEventListener('blur', handleVisibilityState);
    };
  }, [onClose]);

  useEffect(() => {
    // Reset state whenever challenge changes
    setSelectedOption('');
    setSelectedOptions([]);
    setIsSubmitted(false);
    setSecondsRemaining(challenge.timeLimit || 60);

    if (challenge.type === 'sequence' && challenge.options) {
      setOrderedList([...challenge.options].reverse());
    }
  }, [challenge]);

  const handleSubmit = () => {
    if (isSubmitted) return;
    const timeSpent = Math.max(1, Math.round((Date.now() - startTime) / 1000));
    let submissionAnswer: any = null;

    if (challenge.interactiveType) {
      submissionAnswer = selectedOption || challenge.correctAnswer;
    } else if (challenge.type === 'multiSelect') {
      submissionAnswer = selectedOptions;
    } else if (challenge.type === 'sequence') {
      submissionAnswer = orderedList;
    } else {
      submissionAnswer = selectedOption;
    }

    submitChallengeAnswer(challenge.id, submissionAnswer, timeSpent);
    setIsSubmitted(true);
  };

  // Challenge countdown timer
  useEffect(() => {
    if (isSubmitted) return;
    const interval = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isSubmitted]);

  // Trigger submission if time runs out
  useEffect(() => {
    if (secondsRemaining === 0 && !isSubmitted) {
      handleSubmit();
    }
  }, [secondsRemaining, isSubmitted]);

  const handleNextOrClose = () => {
    if (onSuccessNext) {
      onSuccessNext();
    } else {
      onClose();
    }
  };

  // Keyboard shortcut listener: Enter to submit or next, A/B/C/D or 1/2/3/4 to choose
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toUpperCase();

      if (e.key === 'Enter') {
        e.preventDefault();
        if (!isSubmitted) {
          if (selectedOption || selectedOptions.length > 0 || challenge.type === 'sequence' || challenge.interactiveType) {
            handleSubmit();
          }
        } else {
          handleNextOrClose();
        }
        return;
      }

      if (!isSubmitted && challenge.options && !challenge.interactiveType) {
        if (key === 'A' || key === '1') {
          if (challenge.options[0]) setSelectedOption(challenge.options[0]);
        } else if (key === 'B' || key === '2') {
          if (challenge.options[1]) setSelectedOption(challenge.options[1]);
        } else if (key === 'C' || key === '3') {
          if (challenge.options[2]) setSelectedOption(challenge.options[2]);
        } else if (key === 'D' || key === '4') {
          if (challenge.options[3]) setSelectedOption(challenge.options[3]);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSubmitted, selectedOption, selectedOptions, challenge, orderedList, startTime]);

  const toggleMultiSelect = (opt: string) => {
    if (selectedOptions.includes(opt)) {
      setSelectedOptions(selectedOptions.filter(o => o !== opt));
    } else {
      setSelectedOptions([...selectedOptions, opt]);
    }
  };

  const moveSequenceItem = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= orderedList.length) return;
    const newList = [...orderedList];
    const temp = newList[index];
    newList[index] = newList[targetIndex];
    newList[targetIndex] = temp;
    setOrderedList(newList);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-3 sm:p-5 pointer-events-auto select-none font-sans cursor-default overflow-hidden">
      <div className="w-full max-w-3xl bg-[#0D1322] border border-white/[0.1] flex flex-col max-h-[88vh] shadow-2xl rounded-xl animate-scaleIn cursor-default overflow-hidden">
        
        {/* Fixed Header */}
        <div className="flex items-center justify-between border-b border-white/[0.08] px-6 py-4 bg-[#090D18] shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-sky-500/10 border border-sky-500/20 text-sky-400 rounded-lg">
              <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-sky-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 bg-sky-500/10 text-sky-400 border border-sky-500/20 rounded">
                  {challenge.category}
                </span>
                <span className="text-[10px] text-slate-400 uppercase">
                  {challenge.skill} • {challenge.difficulty}
                </span>
              </div>
              <h2 className="text-base sm:text-lg md:text-xl font-bold text-white tracking-wide mt-0.5">
                {challenge.title}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-white/[0.04] border border-white/[0.08] text-xs rounded-md">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              <span className={secondsRemaining < 15 ? 'text-red-400 font-bold animate-pulse' : 'text-slate-300'}>
                {secondsRemaining}s
              </span>
            </div>
            <div className="text-xs px-2.5 py-1 bg-white/[0.08] text-slate-200 border border-white/[0.12] font-semibold rounded-md">
              +{challenge.points} PTS
            </div>
          </div>
        </div>

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto min-h-0 px-6 py-5 space-y-4">
          {/* Visual Story Case Mockup (if available) */}
          {challenge.visualCase && !challenge.interactiveType && (
            <VisualCaseViewer visualCase={challenge.visualCase} />
          )}

          {/* Case Narrative Dossier Box */}
          {challenge.prompt && (
            <div className="p-4 bg-[#070A12] border border-white/[0.06] rounded-lg leading-relaxed text-sm text-slate-200 whitespace-pre-wrap select-none">
              {challenge.prompt}
            </div>
          )}

          {/* Challenge Interactive Mini Game or Standard Options */}
          <div className="my-1">
          {/* Interactive Mini Game */}
          {challenge.interactiveType && (
            <div className="my-2">
              <InteractiveGameDispatcher
                type={challenge.interactiveType}
                config={challenge.interactiveConfig}
                disabled={isSubmitted}
                onSolve={(answer, isCorrect) => {
                  if (typeof isCorrect === 'boolean') {
                    setSelectedOption(isCorrect ? (typeof challenge.correctAnswer === 'string' ? challenge.correctAnswer : JSON.stringify(answer)) : 'INCORRECT_SOLUTION');
                  } else {
                    setSelectedOption(typeof answer === 'string' ? answer : JSON.stringify(answer));
                  }
                }}
              />
            </div>
          )}

          {/* MCQ Options */}
          {!challenge.interactiveType && challenge.type !== 'multiSelect' && challenge.type !== 'sequence' && challenge.options && (
            <div className="space-y-3">
              <div className="flex justify-between items-center mb-2">
                <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
                  SELECT YOUR ANSWER:
                </p>
                <span className="text-[11px] text-slate-400 hidden sm:inline-block">
                  Tip: Press <kbd className="px-1.5 py-0.5 bg-black/50 border border-white/20 text-slate-300 rounded text-[10px]">A</kbd> <kbd className="px-1.5 py-0.5 bg-black/50 border border-white/20 text-slate-300 rounded text-[10px]">B</kbd> <kbd className="px-1.5 py-0.5 bg-black/50 border border-white/20 text-slate-300 rounded text-[10px]">C</kbd> <kbd className="px-1.5 py-0.5 bg-black/50 border border-white/20 text-slate-300 rounded text-[10px]">D</kbd> or <kbd className="px-1.5 py-0.5 bg-black/50 border border-white/20 text-slate-300 rounded text-[10px]">↵ ENTER</kbd>
                </span>
              </div>

              {challenge.options.map((option, idx) => {
                const isSelected = selectedOption === option;
                return (
                  <button
                    key={idx}
                    type="button"
                    disabled={isSubmitted}
                    onClick={() => setSelectedOption(option)}
                    className={`w-full text-left p-3.5 sm:p-4 text-sm transition-all rounded-lg flex items-start gap-3.5 cursor-pointer disabled:cursor-not-allowed ${
                      isSelected
                        ? 'border border-sky-500/80 bg-sky-500/10 text-white font-medium'
                        : 'border border-white/[0.08] bg-[#0A0F1D] text-slate-300 hover:border-white/20 hover:text-white hover:bg-[#0E1528]'
                    }`}
                  >
                    <span className={`w-6 h-6 shrink-0 rounded-full flex items-center justify-center text-xs font-semibold border transition-colors ${
                      isSelected ? 'border-sky-500 bg-sky-500 text-slate-950 font-bold' : 'border-white/15 text-slate-400 bg-white/[0.03]'
                    }`}>
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span className="leading-snug pt-0.5">{cleanOptionText(option)}</span>
                  </button>
                );
              })}
            </div>
          )}

          {/* Multi-Select */}
          {challenge.type === 'multiSelect' && challenge.options && (
            <div className="space-y-3">
              <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-2">
                SELECT ALL VALID OPTIONS:
              </p>
              {challenge.options.map((option, idx) => {
                const isChecked = selectedOptions.includes(option);
                return (
                  <button
                    key={idx}
                    type="button"
                    disabled={isSubmitted}
                    onClick={() => toggleMultiSelect(option)}
                    className={`w-full text-left p-3.5 sm:p-4 text-sm transition-all rounded-lg flex items-center justify-between cursor-pointer disabled:cursor-not-allowed ${
                      isChecked
                        ? 'border border-sky-500/80 bg-sky-500/10 text-white font-medium'
                        : 'border border-white/[0.08] bg-[#0A0F1D] text-slate-300 hover:border-white/20 hover:text-white hover:bg-[#0E1528]'
                    }`}
                  >
                    <span className="pr-4">{cleanOptionText(option)}</span>
                    <div className={`w-5 h-5 rounded border flex items-center justify-center font-bold text-xs ${
                      isChecked ? 'border-sky-500 bg-sky-500 text-slate-950' : 'border-white/20 text-slate-400'
                    }`}>
                      {isChecked && '✓'}
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          {/* Sequence Reordering */}
          {challenge.type === 'sequence' && (
            <div className="space-y-2">
              <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-2">
                ARRANGE IN CHRONOLOGICAL ORDER (1ST TO 4TH):
              </p>
              {orderedList.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3.5 bg-[#0A0F1D] border border-white/[0.08] rounded-lg text-sm text-slate-200"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-5 h-5 rounded-full bg-white/[0.05] border border-white/10 flex items-center justify-center text-xs text-sky-400 font-semibold">
                      {idx + 1}
                    </span>
                    <span>{item}</span>
                  </div>
                  {!isSubmitted && (
                    <div className="flex gap-1.5">
                      <button
                        type="button"
                        onClick={() => moveSequenceItem(idx, 'up')}
                        disabled={idx === 0}
                        className="px-2.5 py-1 bg-white/[0.05] border border-white/10 text-xs text-slate-400 hover:text-white hover:border-white/30 disabled:opacity-20 rounded transition-colors cursor-pointer disabled:cursor-not-allowed"
                      >
                        ▲
                      </button>
                      <button
                        type="button"
                        onClick={() => moveSequenceItem(idx, 'down')}
                        disabled={idx === orderedList.length - 1}
                        className="px-2.5 py-1 bg-white/[0.05] border border-white/10 text-xs text-slate-400 hover:text-white hover:border-white/30 disabled:opacity-20 rounded transition-colors cursor-pointer disabled:cursor-not-allowed"
                      >
                        ▼
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

          {/* Neutral Submission Confirmation Banner */}
          {isSubmitted && (
            <div className="p-3.5 border border-sky-500/30 bg-sky-500/10 rounded-lg flex items-center justify-between animate-fadeIn text-sky-300">
              <div className="flex items-center gap-2.5 text-sm font-semibold">
                <CheckCircle2 className="w-5 h-5 text-sky-400" />
                <span>RESPONSE RECORDED</span>
              </div>
              <span className="text-xs text-slate-400 hidden sm:inline">Press ENTER or click Next Question to continue</span>
            </div>
          )}
        </div>

        {/* Fixed Footer Actions - ALWAYS visible on screen */}
        <div className="flex justify-between items-center px-6 py-4 border-t border-white/[0.08] bg-[#090D18] shrink-0">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <CornerDownLeft className="w-4 h-4 text-sky-400" />
            <span>Press <kbd className="px-1.5 py-0.5 bg-black/40 border border-white/15 text-white rounded font-mono text-[10px]">ENTER</kbd> to {isSubmitted ? 'proceed to next' : 'submit'}</span>
          </div>

          {!isSubmitted ? (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={!selectedOption && selectedOptions.length === 0 && challenge.type !== 'sequence'}
              className="px-6 py-2.5 bg-white hover:bg-slate-200 text-slate-950 font-semibold text-xs uppercase tracking-wider rounded-lg transition-all shadow-sm active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-sky-600" />
              <span>SUBMIT ANSWER [ ↵ ]</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={handleNextOrClose}
              className="px-6 py-2.5 bg-white hover:bg-slate-200 text-slate-950 font-semibold text-xs uppercase tracking-wider rounded-lg transition-all shadow-sm active:scale-95 cursor-pointer flex items-center gap-2"
            >
              <span>NEXT QUESTION [ ↵ ]</span>
              <ArrowRight className="w-4 h-4 text-slate-950" />
            </button>
          )}
        </div>

      </div>
    </div>
  );
}
