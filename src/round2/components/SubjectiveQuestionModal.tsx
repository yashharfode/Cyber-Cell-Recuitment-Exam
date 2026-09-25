import { useState } from 'react';
import type { Round2Challenge } from '../../types/round2';
import { evaluateSubjectiveAnswer } from '../engine/subjectiveEvaluator';
import { 
  FileText, 
  Sparkles, 
  Send, 
  Clock, 
  AlertCircle
} from 'lucide-react';

interface SubjectiveQuestionModalProps {
  challenge: Round2Challenge;
  onSubmit: (score: number, answerText: string, matchedConcepts: string[]) => void;
  secondsRemaining: number;
}

export default function SubjectiveQuestionModal({
  challenge,
  onSubmit,
  secondsRemaining
}: SubjectiveQuestionModalProps) {
  const [answerText, setAnswerText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const charCount = answerText.length;
  const wordCount = answerText.trim() ? answerText.trim().split(/\s+/).length : 0;
  const maxChars = 1200;

  const handleSubmit = () => {
    if (isSubmitting || wordCount < 3) return;
    setIsSubmitting(true);

    const rubric = challenge.rubric || { requiredConcepts: [] };
    const evalResult = evaluateSubjectiveAnswer(answerText, rubric, challenge.points);

    onSubmit(evalResult.awardedScore, answerText, evalResult.matchedConcepts);
  };

  return (
    <div className="w-full max-w-3xl bg-[#0D1322] border border-white/[0.1] flex flex-col max-h-[85vh] shadow-2xl rounded-xl animate-scaleIn font-sans overflow-hidden my-auto">
      
      {/* Header - Fixed */}
      <div className="flex items-center justify-between border-b border-white/[0.08] px-6 py-4 bg-[#090D18] shrink-0">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-sky-500/10 border border-sky-500/20 text-sky-400 rounded-lg">
            <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-sky-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 bg-sky-500/10 text-sky-400 border border-sky-500/20 rounded">
                TIER 3 • SUBJECTIVE CONCEPT
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

        <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-white/[0.04] border border-white/[0.08] text-xs rounded-md">
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            <span className={secondsRemaining < 30 ? 'text-red-400 font-bold animate-pulse' : 'text-slate-300'}>
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
        {/* Question Prompt */}
        <div className="p-4 bg-[#070A12] border border-white/[0.06] rounded-lg text-sm text-slate-200 leading-relaxed">
          <p className="font-semibold text-white mb-1 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-sky-400" />
            CONCEPTUAL INVESTIGATION PROMPT:
          </p>
          <p className="text-sm text-slate-300 mt-2 whitespace-pre-wrap">
            {challenge.prompt}
          </p>
        </div>

        {/* Answer Input Area */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="flex items-center gap-1.5 text-slate-300">
              <span>✍️</span> Type your technical explanation below:
            </span>
            <span className={charCount > maxChars ? 'text-red-400 font-semibold' : 'text-slate-400'}>
              {charCount} / {maxChars} characters ({wordCount} words)
            </span>
          </div>

          <textarea
            rows={5}
            value={answerText}
            onChange={(e) => setAnswerText(e.target.value.slice(0, maxChars))}
            placeholder="Formulate your explanation here. Describe the core purpose, relationships, and technical reason in your own words..."
            className="w-full p-3.5 bg-[#090D18] border border-white/15 focus:border-sky-400 text-white text-sm rounded-lg outline-none font-sans resize-none transition-colors leading-relaxed shadow-sm"
          />

          <div className="flex items-center gap-2 text-[11px] text-slate-400 bg-white/[0.02] p-2.5 rounded-lg border border-white/[0.06]">
            <AlertCircle className="w-4 h-4 text-sky-400 shrink-0" />
            <span>
              Scoring evaluates technical concept coverage, logic, and clarity. Minor spelling or typing errors are not penalized.
            </span>
          </div>
        </div>
      </div>

      {/* Fixed Footer */}
      <div className="flex justify-between items-center px-6 py-4 border-t border-white/[0.08] bg-[#090D18] shrink-0">
        <span className="text-xs text-slate-400">
          {wordCount >= 3 ? 'Ready to submit.' : 'Please provide at least a few words.'}
        </span>

        <button
          onClick={handleSubmit}
          disabled={wordCount < 3 || isSubmitting}
          className="px-6 py-2.5 bg-white hover:bg-slate-200 text-slate-950 font-semibold text-xs uppercase tracking-wider rounded-lg transition-all shadow-sm active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer flex items-center gap-2"
        >
          <Send className="w-4 h-4 text-slate-950" />
          <span>SUBMIT EXPLANATION</span>
        </button>
      </div>

    </div>
  );
}
