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
    <div className="w-full max-w-3xl bg-[#0D1322] border border-white/[0.1] flex flex-col max-h-[85vh] shadow-2xl rounded-xl animate-scaleIn font-sans overflow-hidden my-auto">
      
      {/* Header - Fixed */}
      <div className="flex items-center justify-between border-b border-white/[0.08] px-6 py-4 bg-[#090D18] shrink-0">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-sky-500/10 border border-sky-500/20 text-sky-400 rounded-lg shrink-0">
            <Code2 className="w-5 h-5 text-sky-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 bg-sky-500/10 text-sky-400 border border-sky-500/20 rounded">
                TIER 3 • FILL IN THE BLANK
              </span>
              <span className="text-[10px] text-slate-400 uppercase">
                {challenge.domain} • {challenge.subSkill}
              </span>
            </div>
            <h2 className="text-base sm:text-lg md:text-xl font-bold text-white tracking-wide mt-1">
              {challenge.title}
            </h2>
          </div>
        </div>

        <div className="text-right shrink-0">
          <span className="text-xs px-2.5 py-1 bg-white/[0.08] text-slate-200 border border-white/[0.12] font-semibold rounded-md">
            +{challenge.points} PTS
          </span>
          <span className="text-[10px] text-slate-400 block mt-1">
            {totalLetters} LETTERS TOTAL
          </span>
        </div>
      </div>

      {/* Scrollable Challenge Content */}
      <div className="flex-1 overflow-y-auto min-h-0 px-6 py-5 space-y-4">
        {/* Challenge Prompt */}
        <div className="p-4 bg-[#070A12] border border-white/[0.06] rounded-lg leading-relaxed text-sm text-slate-200">
          <p className="whitespace-pre-wrap">{challenge.prompt}</p>
          
          {/* Optional Code Snippet with template */}
          {challenge.codeSnippet && (
            <div className="mt-3 p-3 bg-black/60 border border-white/10 rounded-lg font-mono text-xs text-sky-300 overflow-x-auto">
              <span className="text-[9px] uppercase text-slate-400 block mb-1">
                Code Context ({challenge.codeSnippet.language}):
              </span>
              <pre className="whitespace-pre-wrap">{challenge.codeSnippet.code}</pre>
            </div>
          )}

          {template && (
            <div className="mt-3 p-3 bg-black/40 border border-white/10 rounded-lg font-mono text-xs text-white">
              <span className="text-[9px] uppercase text-slate-400 block mb-1">Fill the blank:</span>
              <span className="text-sky-300 font-bold text-sm tracking-wider">{template}</span>
            </div>
          )}
        </div>

        {/* Interactive Letter Slots Interface */}
        <div className="p-4 sm:p-5 bg-[#090D18] border border-white/[0.08] rounded-xl space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-sky-400" />
              ENTER LETTERS IN THE SLOTS ({totalLetters} LETTERS):
            </span>
            <button
              type="button"
              onClick={handleClear}
              className="text-[11px] text-slate-400 hover:text-white flex items-center gap-1 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              Clear Slots
            </button>
          </div>

          {/* Discrete Letter Slots Grid */}
          <div className="flex flex-wrap items-center justify-center gap-x-3 sm:gap-x-4 gap-y-3 py-2 select-none">
            {targetChunks.map((chunk: string[], wordIdx: number) => (
              <div key={wordIdx} className="flex items-center gap-1 sm:gap-1.5">
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
                        className={`w-9 h-11 sm:w-11 sm:h-12 text-center text-lg sm:text-xl font-bold uppercase rounded-lg border transition-all outline-none font-mono ${
                          isFilled
                            ? 'bg-sky-500/15 border-sky-400 text-white'
                            : 'bg-black/40 border-white/20 text-slate-300 hover:border-white/40 focus:border-sky-400 focus:bg-sky-500/10'
                        }`}
                        placeholder="_"
                      />
                      <span className="text-[9px] text-slate-500">
                        {charIdx + 1}
                      </span>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>

          {/* Live Answer Assembled Preview */}
          <div className="p-3 bg-black/40 border border-white/10 rounded-lg flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="text-slate-400 text-[11px] uppercase">Your Assembled Answer:</span>
              <span className="text-white font-bold font-mono tracking-widest text-sm">
                {currentAnswer || <span className="text-slate-500 italic">_ _ _ _</span>}
              </span>
            </div>
            <span className="text-[10px] text-slate-400 hidden sm:inline">
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
                  className="text-[11px] text-amber-400 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <HelpCircle className="w-3.5 h-3.5" />
                  Need a clue? Click here to reveal technical hint
                </button>
              ) : (
                <div className="p-3 bg-amber-950/20 border border-amber-500/30 rounded-lg text-xs text-amber-300 animate-fadeIn">
                  💡 <strong className="text-white">Hint:</strong> {challenge.fillInBlank.hint}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Fixed Footer & Submit Actions */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-4 border-t border-white/[0.08] bg-[#090D18] shrink-0">
        <div className="text-xs text-slate-400">
          <span>Objective Evaluation • Exact letter & keyword match</span>
        </div>

        <button
          type="button"
          onClick={handleSubmit}
          disabled={!currentAnswer.trim() || isSubmitting}
          className="w-full sm:w-auto px-6 py-2.5 bg-white hover:bg-slate-200 text-slate-950 font-semibold text-xs uppercase tracking-wider rounded-lg transition-all shadow-sm active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2"
        >
          <Send className="w-4 h-4 text-slate-950" />
          <span>SUBMIT ANSWER [ ↵ ]</span>
        </button>
      </div>

    </div>
  );
}
