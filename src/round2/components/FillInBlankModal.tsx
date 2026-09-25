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
  const targetChunks = targetWord.split(/\s+/).map((w: string) => w.split(''));
  const totalLetters = targetChunks.flat().length;

  const [letters, setLetters] = useState<string[]>(() => Array(totalLetters).fill(''));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showHint, setShowHint] = useState(false);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, [challenge.id]);

  const handleSlotChange = (index: number, value: string) => {
    const val = value.slice(-1).toUpperCase();
    const updated = [...letters];
    updated[index] = val;
    setLetters(updated);

    if (val && index < totalLetters - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      if (!letters[index] && index > 0) {
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

  const getAssembledAnswer = () => {
    let letterPtr = 0;
    return targetChunks
      .map((chunk: string[]) => {
        const word = chunk.map(() => letters[letterPtr++] || '_').join('');
        return word;
      })
      .join(' ');
  };

  const handleClear = () => {
    setLetters(Array(totalLetters).fill(''));
    inputRefs.current[0]?.focus();
  };

  const handleSubmit = () => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    const userAnsClean = getAssembledAnswer().replace(/_/g, '').trim().toUpperCase();
    const isMatch = acceptedAnswers.some(
      ans => ans.trim().toUpperCase() === userAnsClean || ans.replace(/\s+/g, '').toUpperCase() === userAnsClean.replace(/\s+/g, '')
    );

    let scoreAwarded = 0;
    if (isMatch) {
      scoreAwarded = challenge.points;
    } else {
      let matchedLetters = 0;
      const targetClean = targetWord.replace(/\s+/g, '').toUpperCase();
      const userClean = userAnsClean.replace(/\s+/g, '').toUpperCase();
      for (let i = 0; i < Math.min(targetClean.length, userClean.length); i++) {
        if (targetClean[i] === userClean[i]) matchedLetters++;
      }
      if (matchedLetters >= targetClean.length * 0.75) {
        scoreAwarded = Math.round(challenge.points * 0.5);
      }
    }

    onSubmit(scoreAwarded, userAnsClean, isMatch);
  };

  let globalSlotIndex = 0;

  return (
    <div className="w-full max-w-3xl bg-white border border-slate-200 flex flex-col max-h-[85vh] shadow-xl rounded-2xl animate-scaleIn font-sans overflow-hidden my-auto">
      
      {/* Header - Fixed */}
      <div className="flex items-center justify-between border-b border-slate-200 px-4 sm:px-6 py-3 sm:py-4 bg-slate-50 shrink-0">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-sky-50 border border-sky-200 text-sky-700 rounded-lg shrink-0">
            <Code2 className="w-5 h-5 text-sky-600" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 bg-sky-50 text-sky-700 border border-sky-200 rounded">
                TIER 3 • FILL IN THE BLANK
              </span>
              <span className="text-[10px] text-slate-500 uppercase">
                {challenge.domain} • {challenge.subSkill}
              </span>
            </div>
            <h2 className="text-base sm:text-lg md:text-xl font-bold text-slate-900 tracking-tight mt-1">
              {challenge.title}
            </h2>
          </div>
        </div>

        <div className="text-right shrink-0">
          <span className="text-xs px-2.5 py-1 bg-indigo-50 text-indigo-700 border border-indigo-200 font-semibold rounded-md">
            +{challenge.points} PTS
          </span>
          <span className="text-[10px] text-slate-500 block mt-1 font-mono">
            {totalLetters} LETTERS TOTAL
          </span>
        </div>
      </div>

      {/* Scrollable Challenge Content */}
      <div className="flex-1 overflow-y-auto min-h-0 px-6 py-5 space-y-4">
        {/* Challenge Prompt */}
        <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl leading-relaxed text-sm text-slate-800">
          <p className="whitespace-pre-wrap">{challenge.prompt}</p>
          
          {/* Optional Code Snippet with template */}
          {challenge.codeSnippet && (
            <div className="mt-3 p-3 bg-white border border-slate-200 rounded-lg font-mono text-xs text-sky-800 overflow-x-auto">
              <span className="text-[9px] uppercase text-slate-500 block mb-1 font-semibold">
                Code Context ({challenge.codeSnippet.language}):
              </span>
              <pre className="whitespace-pre-wrap">{challenge.codeSnippet.code}</pre>
            </div>
          )}

          {template && (
            <div className="mt-3 p-3 bg-white border border-slate-200 rounded-lg font-mono text-xs text-slate-900">
              <span className="text-[9px] uppercase text-slate-500 block mb-1 font-semibold">Fill the blank:</span>
              <span className="text-sky-700 font-bold text-sm tracking-wider">{template}</span>
            </div>
          )}
        </div>

        {/* Interactive Letter Slots Interface */}
        <div className="p-4 sm:p-5 bg-slate-50 border border-slate-200 rounded-xl space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-700 flex items-center gap-1.5 font-mono">
              <Sparkles className="w-3.5 h-3.5 text-sky-600" />
              ENTER LETTERS IN THE SLOTS ({totalLetters} LETTERS):
            </span>
            <button
              type="button"
              onClick={handleClear}
              className="text-[11px] text-slate-500 hover:text-slate-900 flex items-center gap-1 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              Clear Slots
            </button>
          </div>

          {/* Discrete Letter Slots Grid */}
          <div className="flex flex-wrap items-center justify-center gap-x-3 sm:gap-x-4 gap-y-3 py-2 select-none">
            {targetChunks.map((chunk: string[], wordIdx: number) => (
              <div key={wordIdx} className="flex flex-wrap items-center justify-center gap-1 sm:gap-1.5 max-w-full">
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
                        className={`w-8 h-10 sm:w-11 sm:h-12 text-center text-base sm:text-xl font-bold uppercase rounded-lg border transition-all outline-none font-mono ${
                          isFilled
                            ? 'bg-sky-50 border-sky-500 text-slate-900 shadow-xs'
                            : 'bg-white border-slate-300 text-slate-700 hover:border-slate-400 focus:border-sky-500 focus:bg-sky-50/50'
                        }`}
                        placeholder="_"
                      />
                      <span className="text-[8px] sm:text-[9px] text-slate-400 font-mono">
                        {charIdx + 1}
                      </span>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>

          {/* Live Answer Assembled Preview */}
          <div className="p-3 bg-white border border-slate-200 rounded-lg flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="text-slate-500 text-[11px] uppercase font-mono">Your Assembled Answer:</span>
              <span className="text-slate-900 font-bold font-mono tracking-widest text-sm">
                {getAssembledAnswer()}
              </span>
            </div>
            
            {challenge.fillInBlank?.hint && (
              <button
                type="button"
                onClick={() => setShowHint(!showHint)}
                className="text-[11px] text-amber-700 hover:underline flex items-center gap-1 cursor-pointer font-medium"
              >
                <HelpCircle className="w-3 h-3" />
                {showHint ? 'Hide Hint' : 'Show Hint'}
              </button>
            )}
          </div>

          {showHint && challenge.fillInBlank?.hint && (
            <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-800 animate-fadeIn">
              💡 <strong>Hint:</strong> {challenge.fillInBlank.hint}
            </div>
          )}
        </div>
      </div>

      {/* Footer - Fixed */}
      <div className="flex justify-between items-center px-6 py-4 border-t border-slate-200 bg-slate-50 shrink-0">
        <span className="text-xs text-slate-500 hidden sm:inline font-mono">
          Tip: Type directly or use Backspace to step backwards
        </span>

        <button
          type="button"
          onClick={handleSubmit}
          className="w-full sm:w-auto px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs uppercase tracking-wider rounded-xl transition-all shadow-xs active:scale-95 cursor-pointer flex items-center justify-center gap-2"
        >
          <span>SUBMIT SLOT ANSWER</span>
          <Send className="w-3.5 h-3.5 text-white" />
        </button>
      </div>

    </div>
  );
}
