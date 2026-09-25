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
    <div className="fixed inset-0 z-40 flex items-center justify-center p-2 sm:p-4 bg-slate-900/50 backdrop-blur-sm select-none font-sans">
      <div 
        className="w-full max-w-4xl max-h-[96vh] sm:max-h-[92vh] flex flex-col bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden animate-scaleIn"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Fixed Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-4 sm:px-6 py-3 sm:py-4 bg-slate-50/80 shrink-0">
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
            <div className="p-2 bg-sky-50 border border-sky-200 text-sky-700 rounded-lg shrink-0">
              <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-sky-600" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 bg-sky-50 text-sky-700 border border-sky-200 rounded truncate max-w-[120px] sm:max-w-none">
                  {challenge.category}
                </span>
                <span className="text-[10px] text-slate-500 uppercase hidden xs:inline sm:inline">
                  {challenge.skill} • {challenge.difficulty}
                </span>
              </div>
              <h2 className="text-sm sm:text-lg md:text-xl font-bold text-slate-900 tracking-tight mt-0.5 truncate sm:whitespace-normal">
                {challenge.title}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 shrink-0 ml-2">
            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-100 border border-slate-200 text-xs rounded-md">
              <Clock className="w-3.5 h-3.5 text-amber-600" />
              <span className={secondsRemaining < 15 ? 'text-red-600 font-bold animate-pulse' : 'text-slate-700 font-medium'}>
                {secondsRemaining}s
              </span>
            </div>
            <div className="text-xs px-2.5 py-1 bg-indigo-50 text-indigo-700 border border-indigo-200 font-semibold rounded-md">
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
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl leading-relaxed text-sm text-slate-800 whitespace-pre-wrap select-none">
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
                <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">
                  SELECT YOUR ANSWER:
                </p>
                <span className="text-[11px] text-slate-500 hidden sm:inline-block">
                  Tip: Press <kbd className="px-1.5 py-0.5 bg-slate-100 border border-slate-300 text-slate-700 rounded text-[10px]">A</kbd> <kbd className="px-1.5 py-0.5 bg-slate-100 border border-slate-300 text-slate-700 rounded text-[10px]">B</kbd> <kbd className="px-1.5 py-0.5 bg-slate-100 border border-slate-300 text-slate-700 rounded text-[10px]">C</kbd> <kbd className="px-1.5 py-0.5 bg-slate-100 border border-slate-300 text-slate-700 rounded text-[10px]">D</kbd> or <kbd className="px-1.5 py-0.5 bg-slate-100 border border-slate-300 text-slate-700 rounded text-[10px]">↵ ENTER</kbd>
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
                        ? 'border border-sky-500 bg-sky-50 text-slate-900 font-semibold shadow-xs ring-1 ring-sky-500/20'
                        : 'border border-slate-200 bg-white text-slate-700 hover:border-sky-300 hover:bg-slate-50'
                    }`}
                  >
                    <span className={`w-6 h-6 shrink-0 rounded-full flex items-center justify-center text-xs font-semibold border transition-colors ${
                      isSelected ? 'border-sky-600 bg-sky-600 text-white font-bold' : 'border-slate-300 text-slate-500 bg-slate-100'
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
              <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-2">
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
                        ? 'border border-sky-500 bg-sky-50 text-slate-900 font-semibold shadow-xs ring-1 ring-sky-500/20'
                        : 'border border-slate-200 bg-white text-slate-700 hover:border-sky-300 hover:bg-slate-50'
                    }`}
                  >
                    <span className="pr-4">{cleanOptionText(option)}</span>
                    <div className={`w-5 h-5 rounded border flex items-center justify-center font-bold text-xs ${
                      isChecked ? 'border-sky-600 bg-sky-600 text-white' : 'border-slate-300 text-slate-400 bg-slate-50'
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
              <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-2">
                ARRANGE IN CHRONOLOGICAL ORDER (1ST TO 4TH):
              </p>
              {orderedList.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-800"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-5 h-5 rounded-full bg-sky-50 border border-sky-200 flex items-center justify-center text-xs text-sky-700 font-bold">
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
                        className="px-2.5 py-1 bg-slate-100 border border-slate-200 text-xs text-slate-600 hover:text-slate-900 hover:border-slate-300 disabled:opacity-30 rounded transition-colors cursor-pointer disabled:cursor-not-allowed"
                      >
                        ▲
                      </button>
                      <button
                        type="button"
                        onClick={() => moveSequenceItem(idx, 'down')}
                        disabled={idx === orderedList.length - 1}
                        className="px-2.5 py-1 bg-slate-100 border border-slate-200 text-xs text-slate-600 hover:text-slate-900 hover:border-slate-300 disabled:opacity-30 rounded transition-colors cursor-pointer disabled:cursor-not-allowed"
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
            <div className="p-3.5 border border-emerald-200 bg-emerald-50 rounded-xl flex items-center justify-between animate-fadeIn text-emerald-800">
              <div className="flex items-center gap-2.5 text-sm font-semibold">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <span>RESPONSE RECORDED</span>
              </div>
              <span className="text-xs text-slate-500 hidden sm:inline">Press ENTER or click Next Question to continue</span>
            </div>
          )}
        </div>

        {/* Fixed Footer Actions - ALWAYS visible on screen */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-2 sm:gap-4 px-4 sm:px-6 py-3 sm:py-4 border-t border-slate-200 bg-slate-50/80 shrink-0">
          <div className="hidden sm:flex items-center gap-2 text-xs text-slate-500">
            <CornerDownLeft className="w-4 h-4 text-sky-600" />
            <span>Press <kbd className="px-1.5 py-0.5 bg-white border border-slate-300 text-slate-800 rounded font-mono text-[10px]">ENTER</kbd> to {isSubmitted ? 'proceed to next' : 'submit'}</span>
          </div>

          {!isSubmitted ? (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={!selectedOption && selectedOptions.length === 0 && challenge.type !== 'sequence'}
              className="w-full sm:w-auto px-6 py-3 sm:py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs uppercase tracking-wider rounded-xl transition-all shadow-xs active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-sky-400" />
              <span>SUBMIT ANSWER</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={handleNextOrClose}
              className="w-full sm:w-auto px-6 py-3 sm:py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs uppercase tracking-wider rounded-xl transition-all shadow-xs active:scale-95 cursor-pointer flex items-center justify-center gap-2"
            >
              <span>NEXT QUESTION</span>
              <ArrowRight className="w-4 h-4 text-white" />
            </button>
          )}
        </div>

      </div>
    </div>
  );
}
