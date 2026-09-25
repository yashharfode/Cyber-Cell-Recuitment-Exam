import React, { useState, useRef, useEffect } from 'react';
import type { Round2Challenge } from '../../types/round2';
import { 
  Sparkles, 
  Send, 
  HelpCircle,
  RotateCcw,
  Code2
} from 'lucide-react';

interface FillInBlankModalProps {
  challenge: Round2Challenge;
  onSubmit: (score: number, userAnswer: string, isCorrect: boolean) => void;
  secondsRemaining?: number;
}

export default function FillInBlankModal({
  challenge,
  onSubmit
}: FillInBlankModalProps) {
  const targetWord = challenge.fillInBlank?.targetWord || challenge.correctAnswer || '';
  const acceptedAnswers = challenge.fillInBlank?.acceptedAnswers || [targetWord];
  const template = challenge.fillInBlank?.displayTemplate;

  // Split target word into words and characters for slot rendering
  // e.g. "GROUP BY" -> [["G","R","O","U","P"], ["B","Y"]]
  const targetChunks = targetWord.split(/\s+/).map((w: string) => w.split(''));
  const totalLetters = targetChunks.flat().length;

  // Linear array of user letters (only for alphabetic/numeric slots)
  const [letters, setLetters] = useState<string[]>(() => Array(totalLetters).fill(''));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showHint, setShowHint] = useState(false);

  // References to the slot input elements
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Focus the first empty slot on initial mount
  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, [challenge.id]);

  // Handle single character input in slot
  const handleSlotChange = (index: number, value: string) => {
    const val = value.slice(-1).toUpperCase(); // Take the last typed character
    const updated = [...letters];
    updated[index] = val;
    setLetters(updated);

    // Auto-advance to next slot if a letter was entered
    if (val && index < totalLetters - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // Handle backspace and navigation keys
  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      if (!letters[index] && index > 0) {
        // Current slot is already empty, move to previous slot and clear it
        e.preventDefault();
        const updated = [...letters];
        updated[index - 1] = '';
        setLetters(updated);
        inputRefs.current[index - 1]?.focus();
      } else {
        const updated = [...letters];
        updated[index] = '';
        setLetters(updated);
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      e.preventDefault();
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < totalLetters - 1) {
      e.preventDefault();
      inputRefs.current[index + 1]?.focus();
    } else if (e.key === 'Enter') {
      e.preventDefault();
      handleSubmit();
    }
  };

  // Handle paste into slots
  const handlePaste = (startIndex: number, e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedText = e.clipboardData.getData('text').toUpperCase().replace(/[^A-Z0-9]/g, '');
    const updated = [...letters];
    for (let i = 0; i < pastedText.length; i++) {
      if (startIndex + i < totalLetters) {
        updated[startIndex + i] = pastedText[i];
      }
    }
    setLetters(updated);
    const nextIdx = Math.min(totalLetters - 1, startIndex + pastedText.length);
    inputRefs.current[nextIdx]?.focus();
  };

  // Synchronize full typed string
  const assembleAnswer = () => {
    let letterPtr = 0;
    return targetChunks.map((chunk: string[]) => {
      const word = chunk.map(() => letters[letterPtr++] || '').join('');
      return word;
    }).join(' ').trim();
  };

  const currentAnswer = assembleAnswer();

  const handleClear = () => {
    setLetters(Array(totalLetters).fill(''));
    inputRefs.current[0]?.focus();
  };

  const handleSubmit = () => {
    if (isSubmitting) return;

    const userAnsClean = currentAnswer.replace(/\s+/g, ' ').toUpperCase();
    if (!userAnsClean) return;

    setIsSubmitting(true);

    const norm = (s: string) => s.replace(/[^A-Z0-9]/gi, '').toUpperCase();
    const targetNorm = norm(targetWord);
    const userNorm = norm(userAnsClean);

    const isMatch = userNorm === targetNorm || acceptedAnswers.some((ans: string) => norm(ans) === userNorm);
    const scoreAwarded = isMatch ? challenge.points : 0;

    onSubmit(scoreAwarded, userAnsClean, isMatch);
  };

  let globalSlotIndex = 0;

  return (
    <div className="w-full max-w-3xl cyber-panel border-2 border-cyber-primary/40 p-6 md:p-8 flex flex-col shadow-[0_0_50px_rgba(0,255,204,0.15)] rounded-lg animate-scaleIn font-mono-cyber">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-cyber-border pb-4 mb-5">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-cyber-primary/10 border border-cyber-primary/40 rounded">
            <Code2 className="w-5 h-5 text-cyber-primary" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 bg-cyber-primary/20 text-cyber-primary border border-cyber-primary/30 rounded">
                TIER 3 • FILL IN THE BLANK
              </span>
              <span className="text-[10px] text-cyber-muted uppercase">
                {challenge.domain} • {challenge.subSkill}
              </span>
            </div>
            <h2 className="text-lg md:text-xl font-bold text-white tracking-wide mt-1">
              {challenge.title}
            </h2>
          </div>
        </div>

        <div className="text-right">
          <span className="text-xs px-3 py-1 bg-cyber-primary text-black font-bold rounded">
            +{challenge.points} PTS
          </span>
          <span className="text-[10px] text-cyber-muted block mt-1">
            {totalLetters} LETTERS TOTAL
          </span>
        </div>
      </div>

      {/* Challenge Prompt */}
      <div className="mb-5 p-4 bg-[#05070D] border border-cyber-border/80 rounded leading-relaxed text-sm text-cyber-text">
        <p className="whitespace-pre-wrap">{challenge.prompt}</p>
        
        {/* Optional Code Snippet with template */}
        {challenge.codeSnippet && (
          <div className="mt-3 p-3 bg-black/80 border border-cyber-border rounded font-mono text-xs text-cyber-primary overflow-x-auto">
            <span className="text-[9px] uppercase text-cyber-muted block mb-1">
              Code Context ({challenge.codeSnippet.language}):
            </span>
            <pre className="whitespace-pre-wrap">{challenge.codeSnippet.code}</pre>
          </div>
        )}

        {template && (
          <div className="mt-3 p-3 bg-black/60 border border-cyber-primary/30 rounded font-mono text-xs text-white">
            <span className="text-[9px] uppercase text-cyber-muted block mb-1">Fill the blank:</span>
            <span className="text-cyber-primary font-bold text-sm tracking-wider">{template}</span>
          </div>
        )}
      </div>

      {/* Interactive Letter Slots Interface */}
      <div className="p-6 bg-[#080C14] border-2 border-cyber-primary/30 rounded-lg space-y-4 mb-5 shadow-inner">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-cyber-primary flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            ENTER LETTERS IN THE SLOTS ({totalLetters} LETTERS):
          </span>
          <button
            type="button"
            onClick={handleClear}
            className="text-[11px] text-cyber-muted hover:text-white flex items-center gap-1 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />
            Clear Slots
          </button>
        </div>

        {/* Discrete Letter Slots Grid */}
        <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-3 py-3 select-none">
          {targetChunks.map((chunk: string[], wordIdx: number) => (
            <div key={wordIdx} className="flex items-center gap-1.5 sm:gap-2">
              {chunk.map((_: string, charIdx: number) => {
                const currentSlot = globalSlotIndex++;
                const isFilled = !!letters[currentSlot];

                return (
                  <div key={charIdx} className="flex flex-col items-center gap-1">
                    <input
                      ref={(el) => { inputRefs.current[currentSlot] = el; }}
                      type="text"
                      maxLength={1}
                      value={letters[currentSlot] || ''}
                      onChange={(e) => handleSlotChange(currentSlot, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(currentSlot, e)}
                      onPaste={(e) => handlePaste(currentSlot, e)}
                      className={`w-9 h-11 sm:w-11 sm:h-13 text-center text-lg sm:text-xl font-bold uppercase rounded border-2 transition-all outline-none font-mono ${
                        isFilled
                          ? 'bg-cyber-primary/20 border-cyber-primary text-white shadow-[0_0_12px_rgba(0,255,204,0.3)]'
                          : 'bg-black/90 border-white/20 text-cyber-primary hover:border-cyber-primary/50 focus:border-cyber-primary focus:bg-cyber-primary/10'
                      }`}
                      placeholder="_"
                    />
                    <span className="text-[9px] text-cyber-muted/60">
                      {charIdx + 1}
                    </span>
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        {/* Live Answer Assembled Preview */}
        <div className="p-3 bg-black/60 border border-white/10 rounded flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="text-cyber-muted text-[11px] uppercase">Your Assembled Answer:</span>
            <span className="text-white font-bold font-mono tracking-widest text-sm">
              {currentAnswer || <span className="text-cyber-muted italic">_ _ _ _</span>}
            </span>
          </div>
          <span className="text-[10px] text-cyber-muted hidden sm:inline">
            Press <kbd className="px-1 py-0.5 bg-black border border-white/20 text-white rounded">↵ ENTER</kbd> to submit
          </span>
        </div>

        {/* Hint Disclosure */}
        {challenge.fillInBlank?.hint && (
          <div className="pt-1">
            {!showHint ? (
              <button
                type="button"
                onClick={() => setShowHint(true)}
                className="text-[11px] text-cyber-warning hover:underline flex items-center gap-1 cursor-pointer"
              >
                <HelpCircle className="w-3.5 h-3.5" />
                Need a clue? Click here to reveal technical hint
              </button>
            ) : (
              <div className="p-2.5 bg-amber-950/30 border border-amber-400/40 rounded text-xs text-amber-300 animate-fadeIn">
                💡 <strong className="text-white">Hint:</strong> {challenge.fillInBlank.hint}
              </div>
            )}
          </div>
        )}

      </div>

      {/* Footer & Submit Actions */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-3 border-t border-cyber-border">
        <div className="text-xs text-cyber-muted">
          <span>Objective Evaluation • Exact letter & keyword match</span>
        </div>

        <button
          type="button"
          onClick={handleSubmit}
          disabled={!currentAnswer.trim() || isSubmitting}
          className="w-full sm:w-auto px-8 py-3.5 bg-cyber-primary text-black font-extrabold text-xs uppercase tracking-wider hover:bg-white transition-all shadow-[0_0_20px_rgba(0,255,204,0.3)] rounded flex items-center justify-center gap-2 transform active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
        >
          <Send className="w-4 h-4" />
          <span>SUBMIT ANSWER [ ↵ ]</span>
        </button>
      </div>

    </div>
  );
}
