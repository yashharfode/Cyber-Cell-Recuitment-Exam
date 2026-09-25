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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 pointer-events-auto select-none font-mono-cyber cursor-default">
      <div className="w-full max-w-3xl cyber-panel border border-cyber-primary/40 p-6 md:p-8 flex flex-col max-h-[92vh] overflow-y-auto shadow-[0_0_50px_rgba(0,255,204,0.15)] rounded-lg animate-scaleIn cursor-default">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-cyber-border pb-4 mb-5">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-cyber-primary/10 border border-cyber-primary/40 rounded">
              <FileText className="w-5 h-5 text-cyber-primary" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 bg-cyber-primary/20 text-cyber-primary border border-cyber-primary/30 rounded">
                  {challenge.category}
                </span>
                <span className="text-[10px] text-cyber-muted uppercase">
                  {challenge.skill} • {challenge.difficulty}
                </span>
              </div>
              <h2 className="text-lg md:text-xl font-bold text-white tracking-wide mt-1">
                {challenge.title}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 px-3 py-1 bg-cyber-panel-secondary border border-cyber-border text-xs rounded">
              <Clock className="w-4 h-4 text-cyber-warning" />
              <span className={secondsRemaining < 15 ? 'text-cyber-danger font-bold animate-pulse' : 'text-cyber-text'}>
                {secondsRemaining}s
              </span>
            </div>
            <div className="text-xs px-3 py-1 bg-cyber-primary text-black font-bold rounded">
              +{challenge.points} PTS
            </div>
          </div>
        </div>

        {/* Visual Story Case Mockup (if available) */}
        {challenge.visualCase && !challenge.interactiveType && (
          <VisualCaseViewer visualCase={challenge.visualCase} />
        )}

        {/* Case Narrative Dossier Box */}
        {challenge.prompt && (
          <div className="mb-6 p-4 bg-[#05070D] border border-cyber-border/80 rounded leading-relaxed text-sm text-cyber-text whitespace-pre-wrap select-none">
            {challenge.prompt}
          </div>
        )}

        {/* Challenge Interactive Mini Game or Standard Options */}
        <div className="flex-1 my-1">
          {/* Interactive Mini Game */}
          {challenge.interactiveType && (
            <div className="my-2">
              <InteractiveGameDispatcher
                type={challenge.interactiveType}
                config={challenge.interactiveConfig}
                disabled={isSubmitted}
                onSolve={(answer) => {
                  setSelectedOption(typeof answer === 'string' ? answer : JSON.stringify(answer));
                }}
              />
            </div>
          )}

          {/* MCQ Options */}
          {!challenge.interactiveType && challenge.type !== 'multiSelect' && challenge.type !== 'sequence' && challenge.options && (
            <div className="space-y-3">
              <div className="flex justify-between items-center mb-2">
                <p className="text-xs text-cyber-muted font-bold uppercase tracking-wider">
                  SELECT YOUR ANSWER:
                </p>
                <span className="text-[11px] text-cyber-primary/80 hidden sm:inline-block">
                  Tip: Press <kbd className="px-1.5 py-0.5 bg-black border border-cyber-primary/50 text-cyber-primary rounded">A</kbd> <kbd className="px-1.5 py-0.5 bg-black border border-cyber-primary/50 text-cyber-primary rounded">B</kbd> <kbd className="px-1.5 py-0.5 bg-black border border-cyber-primary/50 text-cyber-primary rounded">C</kbd> <kbd className="px-1.5 py-0.5 bg-black border border-cyber-primary/50 text-cyber-primary rounded">D</kbd> or <kbd className="px-1.5 py-0.5 bg-black border border-cyber-primary/50 text-cyber-primary rounded">↵ ENTER</kbd>
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
                    <span className="leading-snug pt-0.5">{cleanOptionText(option)}</span>
                  </button>
                );
              })}
            </div>
          )}

          {/* Multi-Select */}
          {challenge.type === 'multiSelect' && challenge.options && (
            <div className="space-y-3">
              <p className="text-xs text-cyber-muted font-bold uppercase tracking-wider mb-2">
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
                    className={`w-full text-left p-4 text-sm transition-all duration-200 transform hover:scale-[1.01] active:scale-[0.99] border rounded flex items-center justify-between cursor-pointer disabled:cursor-not-allowed ${
                      isChecked
                        ? 'border-cyber-primary bg-cyber-primary/15 text-white shadow-[0_0_15px_rgba(0,255,204,0.15)]'
                        : 'border-cyber-border bg-[#0B1018] text-cyber-muted hover:border-cyber-primary/40 hover:text-white'
                    }`}
                  >
                    <span className="pr-4">{cleanOptionText(option)}</span>
                    <div className={`w-5 h-5 rounded border flex items-center justify-center font-bold text-xs ${
                      isChecked ? 'border-cyber-primary bg-cyber-primary text-black' : 'border-cyber-border'
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
              <p className="text-xs text-cyber-muted font-bold uppercase tracking-wider mb-2">
                ARRANGE IN CHRONOLOGICAL ORDER (1ST TO 4TH):
              </p>
              {orderedList.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3.5 bg-[#0B1018] border border-cyber-border rounded text-sm text-white"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-5 h-5 rounded-full bg-cyber-panel-secondary border border-cyber-border flex items-center justify-center text-xs text-cyber-primary font-bold">
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
                        className="px-2.5 py-1 bg-cyber-panel border border-cyber-border text-xs text-cyber-muted hover:text-cyber-primary hover:border-cyber-primary disabled:opacity-20 rounded transition-colors cursor-pointer disabled:cursor-not-allowed"
                      >
                        ▲
                      </button>
                      <button
                        type="button"
                        onClick={() => moveSequenceItem(idx, 'down')}
                        disabled={idx === orderedList.length - 1}
                        className="px-2.5 py-1 bg-cyber-panel border border-cyber-border text-xs text-cyber-muted hover:text-cyber-primary hover:border-cyber-primary disabled:opacity-20 rounded transition-colors cursor-pointer disabled:cursor-not-allowed"
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

        {/* Neutral Submission Confirmation Banner (No right/wrong or explanation revealed during test) */}
        {isSubmitted && (
          <div className="mt-6 p-4 border border-cyber-primary/40 bg-cyber-primary/10 rounded font-mono-cyber flex items-center justify-between animate-fadeIn text-cyber-primary">
            <div className="flex items-center gap-2.5 text-sm font-bold">
              <CheckCircle2 className="w-5 h-5 text-cyber-primary" />
              <span>RESPONSE RECORDED</span>
            </div>
            <span className="text-xs text-cyber-muted hidden sm:inline">Press ENTER or click Next Question to continue</span>
          </div>
        )}

        {/* Footer Actions with Enter Key Badges */}
        <div className="flex justify-between items-center mt-6 pt-4 border-t border-cyber-border">
          <div className="flex items-center gap-2 text-xs text-cyber-muted">
            <CornerDownLeft className="w-4 h-4 text-cyber-primary" />
            <span>Press <kbd className="px-1.5 py-0.5 bg-black border border-cyber-border text-white rounded font-bold">ENTER</kbd> to {isSubmitted ? 'proceed to next' : 'submit'}</span>
          </div>

          {!isSubmitted ? (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={!selectedOption && selectedOptions.length === 0 && challenge.type !== 'sequence'}
              className="px-6 py-3 bg-cyber-primary text-black font-bold text-xs uppercase tracking-wider hover:bg-white transition-all shadow-[0_0_20px_rgba(0,255,204,0.3)] rounded flex items-center gap-2 transform active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              SUBMIT ANSWER [ ↵ ]
            </button>
          ) : (
            <button
              type="button"
              onClick={handleNextOrClose}
              className="px-6 py-3 bg-cyber-primary text-black font-bold text-xs uppercase tracking-wider hover:bg-white transition-all rounded flex items-center gap-2 shadow-[0_0_20px_rgba(0,255,204,0.3)] transform active:scale-95 cursor-pointer"
            >
              <span>NEXT QUESTION [ ↵ ]</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>

      </div>
    </div>
  );
}
