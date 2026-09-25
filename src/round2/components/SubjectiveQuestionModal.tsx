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
    <div className="w-full max-w-3xl cyber-panel border border-cyber-primary/40 p-6 md:p-8 flex flex-col max-h-[92vh] overflow-y-auto shadow-[0_0_50px_rgba(0,255,204,0.15)] rounded-lg animate-scaleIn font-mono-cyber">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-cyber-border pb-4 mb-5">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-cyber-primary/10 border border-cyber-primary/40 rounded">
            <FileText className="w-5 h-5 text-cyber-primary" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 bg-cyber-primary/20 text-cyber-primary border border-cyber-primary/30 rounded">
                TIER 3 • SUBJECTIVE CONCEPT
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

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1 bg-cyber-panel-secondary border border-cyber-border text-xs rounded">
            <Clock className="w-4 h-4 text-cyber-warning" />
            <span className={secondsRemaining < 30 ? 'text-cyber-danger font-bold animate-pulse' : 'text-cyber-text'}>
              {secondsRemaining}s
            </span>
          </div>
          <div className="text-xs px-3 py-1 bg-cyber-primary text-black font-bold rounded">
            +{challenge.points} PTS
          </div>
        </div>
      </div>

      {/* Question Prompt */}
      <div className="mb-5 p-4 bg-[#05070D] border border-cyber-border/80 rounded text-sm text-cyber-text leading-relaxed">
        <p className="font-bold text-white mb-1 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-cyber-primary" />
          CONCEPTUAL INVESTIGATION PROMPT:
        </p>
        <p className="text-sm text-slate-200 mt-2 whitespace-pre-wrap">
          {challenge.prompt}
        </p>
      </div>

      {/* Answer Input Area */}
      <div className="space-y-2 flex-1">
        <div className="flex items-center justify-between text-xs text-cyber-muted">
          <span className="flex items-center gap-1.5 text-cyber-primary">
            <span>✍️</span> Type your technical explanation below:
          </span>
          <span className={charCount > maxChars ? 'text-cyber-danger font-bold' : 'text-cyber-muted'}>
            {charCount} / {maxChars} characters ({wordCount} words)
          </span>
        </div>

        <textarea
          rows={7}
          value={answerText}
          onChange={(e) => setAnswerText(e.target.value.slice(0, maxChars))}
          placeholder="Formulate your explanation here. Describe the core purpose, relationships, and technical reason in your own words..."
          className="w-full p-4 bg-[#0B1018] border border-cyber-border focus:border-cyber-primary text-white text-sm rounded outline-none font-mono-cyber resize-none transition-colors leading-relaxed shadow-inner"
        />

        <div className="flex items-center gap-2 text-[11px] text-cyber-muted bg-cyber-panel-secondary p-2.5 rounded border border-cyber-border">
          <AlertCircle className="w-4 h-4 text-cyber-info shrink-0" />
          <span>
            Scoring evaluates technical concept coverage, logic, and clarity. Minor spelling or typing errors are not penalized.
          </span>
        </div>
      </div>

      {/* Footer */}
      <div className="flex justify-between items-center mt-6 pt-4 border-t border-cyber-border">
        <span className="text-xs text-cyber-muted">
          {wordCount >= 3 ? 'Ready to submit.' : 'Please provide at least a few words.'}
        </span>

        <button
          onClick={handleSubmit}
          disabled={wordCount < 3 || isSubmitting}
          className="px-6 py-3 bg-cyber-primary text-black font-bold text-xs uppercase tracking-wider hover:bg-white transition-all shadow-[0_0_20px_rgba(0,255,204,0.3)] rounded flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
        >
          <Send className="w-4 h-4" />
          <span>SUBMIT EXPLANATION</span>
        </button>
      </div>

    </div>
  );
}
