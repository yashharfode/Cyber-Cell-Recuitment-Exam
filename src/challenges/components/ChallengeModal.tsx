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

  // Guarantee mouse cursor is visible
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

  // Security integrity: If candidate exits fullscreen or switches tabs, close the question
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
    window.addEventListener('pagehide', handleVisibilityState);

    return () => {
      FULLSCREEN_EVENTS.forEach(evt => document.removeEventListener(evt, handleFullscreenState));
      document.removeEventListener('visibilitychange', handleVisibilityState);
      window.removeEventListener('blur', handleVisibilityState);
      window.removeEventListener('pagehide', handleVisibilityState);
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

  const handleNextOrClose = () => {
    if (onSuccessNext) {
      onSuccessNext();
    } else {
      onClose();
    }
  };

  // Keyboard navigation shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      if (e.key === 'Enter') {
        e.preventDefault();
        if (!isSubmitted) {
          const hasSelection = selectedOption || selectedOptions.length > 0 || challenge.type === 'sequence';
          if (hasSelection) {
            handleSubmit();
          }
        } else {
          handleNextOrClose();
        }
        return;
      }

      if (!isSubmitted && !challenge.interactiveType && challenge.type !== 'sequence') {
        const key = e.key.toUpperCase();
        const optionKeys = ['A', 'B', 'C', 'D', 'E', 'F'];
        const index = optionKeys.indexOf(key);

        if (index !== -1 && challenge.options && index < challenge.options.length) {
          const targetOpt = challenge.options[index];
          if (challenge.type === 'multiSelect') {
            toggleMultiSelect(targetOpt);
          } else {
            setSelectedOption(targetOpt);
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSubmitted, selectedOption, selectedOptions, challenge, orderedList]);

  // Question countdown timer
  useEffect(() => {
    if (isSubmitted) return;
    const interval = setInterval(() => {
      setSecondsRemaining(prev => {
        if (prev <= 1) {
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isSubmitted]);

  const toggleMultiSelect = (option: string) => {
    setSelectedOptions(prev => 
      prev.includes(option) ? prev.filter(o => o !== option) : [...prev, option]
    );
  };

  const moveSequenceItem = (fromIdx: number, direction: 'up' | 'down') => {
    const toIdx = direction === 'up' ? fromIdx - 1 : fromIdx + 1;
    if (toIdx < 0 || toIdx >= orderedList.length) return;
    const updated = [...orderedList];
    const [moved] = updated.splice(fromIdx, 1);
    updated.splice(toIdx, 0, moved);
    setOrderedList(updated);
  };

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-sm select-none font-sans">
      <div 
        className="w-full max-w-4xl max-h-[96vh] sm:max-h-[92vh] flex flex-col bg-[#0D1322] border border-white/[0.12] rounded-2xl shadow-2xl overflow-hidden animate-scaleIn"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Fixed Header */}
        <div className="flex items-center justify-between border-b border-white/[0.08] px-4 sm:px-6 py-3 sm:py-4 bg-[#090D18]/90 shrink-0">
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
            <div className="p-2 bg-sky-500/10 border border-sky-500/20 text-sky-400 rounded-lg shrink-0">
              <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-sky-400" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 bg-sky-500/10 text-sky-400 border border-sky-500/20 rounded truncate max-w-[120px] sm:max-w-none">
                  {challenge.category}
                </span>
                <span className="text-[10px] text-slate-400 uppercase hidden xs:inline sm:inline">
                  {challenge.skill} • {challenge.difficulty}
                </span>
              </div>
              <h2 className="text-sm sm:text-lg md:text-xl font-bold text-white tracking-tight mt-0.5 truncate sm:whitespace-normal">
                {challenge.title}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 shrink-0 ml-2">
            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-white/[0.05] border border-white/[0.08] text-xs rounded-md">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              <span className={secondsRemaining < 15 ? 'text-rose-400 font-bold animate-pulse' : 'text-slate-300 font-medium'}>
                {secondsRemaining}s
              </span>
            </div>
            <div className="text-xs px-2.5 py-1 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-semibold rounded-md">
              +{challenge.points} PTS
            </div>
          </div>
        </div>

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto min-h-0 px-4 sm:px-6 py-3.5 sm:py-5 space-y-4">
          {/* Visual Story Case Mockup (if available) */}
          {challenge.visualCase && !challenge.interactiveType && (
            <VisualCaseViewer visualCase={challenge.visualCase} />
          )}

          {/* Case Narrative Dossier Box */}
          {challenge.prompt && (
            <div className="p-4 bg-[#080C14] border border-white/[0.08] rounded-xl leading-relaxed text-sm text-slate-200 whitespace-pre-wrap select-none">
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
                  Tip: Press <kbd className="px-1.5 py-0.5 bg-white/10 border border-white/20 text-white rounded text-[10px]">A</kbd> <kbd className="px-1.5 py-0.5 bg-white/10 border border-white/20 text-white rounded text-[10px]">B</kbd> <kbd className="px-1.5 py-0.5 bg-white/10 border border-white/20 text-white rounded text-[10px]">C</kbd> <kbd className="px-1.5 py-0.5 bg-white/10 border border-white/20 text-white rounded text-[10px]">D</kbd> or <kbd className="px-1.5 py-0.5 bg-white/10 border border-white/20 text-white rounded text-[10px]">↵ ENTER</kbd>
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
                    className={`w-full text-left p-3.5 sm:p-4 text-sm transition-all rounded-xl flex items-start gap-3.5 cursor-pointer disabled:cursor-not-allowed ${
                      isSelected
                        ? 'border border-sky-400 bg-sky-500/15 text-white font-semibold shadow-sm ring-1 ring-sky-400/30'
                        : 'border border-white/[0.08] bg-[#0A0F1D] text-slate-300 hover:border-white/20 hover:bg-white/[0.04]'
                    }`}
                  >
                    <span className={`w-6 h-6 shrink-0 rounded-full flex items-center justify-center text-xs font-semibold border transition-colors ${
                      isSelected ? 'border-sky-400 bg-sky-400 text-slate-950 font-bold' : 'border-white/20 text-slate-400 bg-white/[0.05]'
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
                    className={`w-full text-left p-3.5 sm:p-4 text-sm transition-all rounded-xl flex items-center justify-between cursor-pointer disabled:cursor-not-allowed ${
                      isChecked
                        ? 'border border-sky-400 bg-sky-500/15 text-white font-semibold shadow-sm ring-1 ring-sky-400/30'
                        : 'border border-white/[0.08] bg-[#0A0F1D] text-slate-300 hover:border-white/20 hover:bg-white/[0.04]'
                    }`}
                  >
                    <span className="pr-4">{cleanOptionText(option)}</span>
                    <div className={`w-5 h-5 rounded border flex items-center justify-center font-bold text-xs ${
                      isChecked ? 'border-sky-400 bg-sky-400 text-slate-950' : 'border-white/20 text-slate-400 bg-white/[0.05]'
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
                  className="flex items-center justify-between p-3.5 bg-[#0A0F1D] border border-white/[0.08] rounded-xl text-sm text-slate-200"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-5 h-5 rounded-full bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-xs text-sky-400 font-bold">
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
                        className="px-2.5 py-1 bg-white/[0.06] border border-white/[0.1] text-xs text-slate-300 hover:text-white hover:border-white/20 disabled:opacity-30 rounded transition-colors cursor-pointer disabled:cursor-not-allowed"
                      >
                        ▲
                      </button>
                      <button
                        type="button"
                        onClick={() => moveSequenceItem(idx, 'down')}
                        disabled={idx === orderedList.length - 1}
                        className="px-2.5 py-1 bg-white/[0.06] border border-white/[0.1] text-xs text-slate-300 hover:text-white hover:border-white/20 disabled:opacity-30 rounded transition-colors cursor-pointer disabled:cursor-not-allowed"
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
            <div className="p-3.5 border border-emerald-500/30 bg-emerald-500/10 rounded-xl flex items-center justify-between animate-fadeIn text-emerald-300">
              <div className="flex items-center gap-2.5 text-sm font-semibold">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <span>RESPONSE RECORDED</span>
              </div>
              <span className="text-xs text-slate-400 hidden sm:inline">Press ENTER or click Next Question to continue</span>
            </div>
          )}
        </div>

        {/* Fixed Footer Actions - ALWAYS visible on screen */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-2 sm:gap-4 px-4 sm:px-6 py-3 sm:py-4 border-t border-white/[0.08] bg-[#090D18]/90 shrink-0">
          <div className="hidden sm:flex items-center gap-2 text-xs text-slate-400">
            <CornerDownLeft className="w-4 h-4 text-sky-400" />
            <span>Press <kbd className="px-1.5 py-0.5 bg-white/10 border border-white/20 text-white rounded font-mono text-[10px]">ENTER</kbd> to {isSubmitted ? 'proceed to next' : 'submit'}</span>
          </div>

          {!isSubmitted ? (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={!selectedOption && selectedOptions.length === 0 && challenge.type !== 'sequence'}
              className="w-full sm:w-auto px-6 py-3 sm:py-2.5 bg-white hover:bg-slate-200 text-slate-950 font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg shadow-white/10 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-sky-600" />
              <span>SUBMIT ANSWER</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={handleNextOrClose}
              className="w-full sm:w-auto px-6 py-3 sm:py-2.5 bg-white hover:bg-slate-200 text-slate-950 font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg shadow-white/10 active:scale-95 cursor-pointer flex items-center justify-center gap-2"
            >
              <span>NEXT QUESTION</span>
              <ArrowRight className="w-4 h-4 text-slate-950" />
            </button>
          )}
        </div>

      </div>
    </div>
  );
}
