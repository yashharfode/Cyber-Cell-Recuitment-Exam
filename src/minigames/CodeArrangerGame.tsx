import { useState } from 'react';
import { ArrowUp, ArrowDown, Play, CheckCircle2, RotateCcw, Code2 } from 'lucide-react';

export interface CodeBlock {
  id: string;
  text: string;
  expectedIndex: number;
  indent?: number;
}

interface CodeArrangerGameProps {
  config?: {
    prompt?: string;
    blocks?: CodeBlock[];
    language?: string;
    expectedOutput?: string;
  };
  onSolve?: (orderedBlocks: CodeBlock[], isCorrect: boolean) => void;
  disabled?: boolean;
}

const DEFAULT_BLOCKS: CodeBlock[] = [
  { id: 'b-1', text: 'x = 10', expectedIndex: 0, indent: 0 },
  { id: 'b-2', text: 'if x > 0:', expectedIndex: 1, indent: 0 },
  { id: 'b-3', text: 'print("Positive")', expectedIndex: 2, indent: 4 },
  { id: 'b-4', text: 'else:', expectedIndex: 3, indent: 0 },
  { id: 'b-5', text: 'print("Negative")', expectedIndex: 4, indent: 4 },
];

export default function CodeArrangerGame({ config, onSolve, disabled }: CodeArrangerGameProps) {
  const prompt = config?.prompt || 'Arrange the shuffled lines of Python code into the correct execution sequence to evaluate whether x is positive.';
  const initialBlocks = config?.blocks || DEFAULT_BLOCKS;
  const expectedOutput = config?.expectedOutput || 'Positive';

  // Start with shuffled blocks
  const [blocks, setBlocks] = useState<CodeBlock[]>(() => {
    return [...initialBlocks].sort(() => Math.random() - 0.5);
  });

  const [output, setOutput] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean>(false);
  const [isEvaluated, setIsEvaluated] = useState<boolean>(false);

  const moveUp = (index: number) => {
    if (disabled || isEvaluated || index === 0) return;
    const copy = [...blocks];
    const temp = copy[index];
    copy[index] = copy[index - 1];
    copy[index - 1] = temp;
    setBlocks(copy);
    setOutput(null);
  };

  const moveDown = (index: number) => {
    if (disabled || isEvaluated || index === blocks.length - 1) return;
    const copy = [...blocks];
    const temp = copy[index];
    copy[index] = copy[index + 1];
    copy[index + 1] = temp;
    setBlocks(copy);
    setOutput(null);
  };

  const handleTestRun = () => {
    if (disabled) return;
    const correct = blocks.every((b, idx) => b.expectedIndex === idx);
    setIsCorrect(correct);
    setIsEvaluated(true);
    setOutput(correct ? expectedOutput : 'SyntaxError / LogicError: Unindent does not match any outer indentation level or variable referenced before assignment.');

    if (onSolve) {
      onSolve(blocks, correct);
    }
  };

  const handleReset = () => {
    if (disabled) return;
    setBlocks([...initialBlocks].sort(() => Math.random() - 0.5));
    setOutput(null);
    setIsCorrect(false);
    setIsEvaluated(false);
  };

  return (
    <div className="bg-[#080C14] border border-cyber-primary/30 p-5 rounded-lg font-mono-cyber">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 mb-4 border-b border-cyber-border">
        <div>
          <span className="text-[10px] text-cyber-secondary uppercase tracking-widest px-2 py-0.5 bg-cyber-secondary/10 border border-cyber-secondary/30 rounded flex items-center gap-1.5 w-max">
            <Code2 className="w-3 h-3" /> ALGORITHMIC LOGIC PUZZLE
          </span>
          <h3 className="text-base font-bold text-white mt-1">ARRANGE THE CODE SEQUENCE</h3>
          <p className="text-xs text-cyber-muted mt-0.5">{prompt}</p>
        </div>
        <button
          onClick={handleReset}
          disabled={disabled}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-cyber-muted hover:text-white bg-white/5 hover:bg-white/10 rounded transition-all border border-white/10"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Reshuffle
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 my-4">
        {/* Reordering Blocks Panel */}
        <div className="space-y-2">
          <div className="text-[11px] font-bold text-cyber-primary uppercase tracking-wider mb-2 flex items-center justify-between">
            <span>Code Blocks (Use arrows to reorder)</span>
            <span className="text-cyber-muted text-[10px]">Top-to-Bottom Execution</span>
          </div>

          {blocks.map((block, index) => (
            <div
              key={block.id}
              className="p-3 bg-[#0D131F] border border-cyber-border rounded flex items-center justify-between text-xs hover:border-cyber-primary/40 transition-all group"
            >
              <div className="flex items-center gap-3">
                <span className="text-cyber-muted text-[11px] w-5 text-right font-mono">
                  {index + 1}
                </span>
                <span 
                  className="font-mono text-cyan-200"
                  style={{ paddingLeft: `${(block.indent || 0) * 4}px` }}
                >
                  {block.text}
                </span>
              </div>

              {/* Up / Down Controls */}
              <div className="flex items-center gap-1 shrink-0">
                <button
                  onClick={() => moveUp(index)}
                  disabled={index === 0 || disabled || isEvaluated}
                  className="p-1 rounded bg-white/5 hover:bg-cyber-primary/20 text-cyber-muted hover:text-cyber-primary disabled:opacity-30 disabled:pointer-events-none transition-all"
                  title="Move Up"
                >
                  <ArrowUp className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => moveDown(index)}
                  disabled={index === blocks.length - 1 || disabled || isEvaluated}
                  className="p-1 rounded bg-white/5 hover:bg-cyber-primary/20 text-cyber-muted hover:text-cyber-primary disabled:opacity-30 disabled:pointer-events-none transition-all"
                  title="Move Down"
                >
                  <ArrowDown className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}

          <button
            onClick={handleTestRun}
            disabled={disabled}
            className="w-full mt-3 py-2.5 bg-cyber-primary/20 hover:bg-cyber-primary/30 text-cyber-primary font-bold text-xs uppercase tracking-wider rounded border border-cyber-primary/50 flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(0,255,204,0.15)] transition-all"
          >
            <Play className="w-3.5 h-3.5 fill-current" /> Execute Code Sequence
          </button>
        </div>

        {/* Live Terminal Output & Preview */}
        <div className="flex flex-col h-full bg-[#05080F] border border-cyber-border rounded overflow-hidden">
          <div className="bg-[#0B101A] px-3 py-2 border-b border-cyber-border flex items-center justify-between text-[11px] text-cyber-muted">
            <span className="font-bold text-white flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-cyber-secondary animate-pulse" />
              PYTHON INTERPRETER CONSOLE
            </span>
            <span>stdout</span>
          </div>

          <div className="p-4 flex-1 font-mono text-xs space-y-2 overflow-y-auto min-h-[160px]">
            <div className="text-cyber-muted text-[11px]">
              $ python3 solution.py
            </div>

            {output ? (
              <div className={`p-3 rounded border ${
                isCorrect 
                  ? 'bg-cyber-success/10 border-cyber-success/30 text-cyber-success'
                  : 'bg-red-950/20 border-red-500/30 text-red-400'
              }`}>
                <div className="text-[10px] uppercase font-bold tracking-widest text-cyber-muted mb-1">
                  Program Output:
                </div>
                <div className="font-bold text-sm">
                  {output}
                </div>
              </div>
            ) : (
              <div className="text-cyber-muted/60 italic text-[11px] pt-4">
                Arrange blocks in sequence on the left and click "Execute Code Sequence" to compile and run.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Result Status */}
      {isEvaluated && (
        <div className={`mt-4 p-3 rounded flex items-center justify-between text-xs ${
          isCorrect 
            ? 'bg-cyber-success/20 border border-cyber-success/40 text-cyber-success'
            : 'bg-cyber-danger/20 border border-cyber-danger/40 text-cyber-danger'
        }`}>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span className="font-bold">
              {isCorrect 
                ? 'ALGORITHM COMPILED & EXECUTED SUCCESSFULLY: Program output matches expected result!' 
                : 'EXECUTION FAILED: Control flow or statement ordering is incorrect.'}
            </span>
          </div>
          <span className="font-bold tracking-widest text-[11px] uppercase">
            {isCorrect ? '+100 XP' : 'RETRY NEEDED'}
          </span>
        </div>
      )}
    </div>
  );
}
