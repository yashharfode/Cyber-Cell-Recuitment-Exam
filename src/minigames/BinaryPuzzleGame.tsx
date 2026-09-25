import { useState } from 'react';
import { Binary, CheckCircle2, RotateCcw } from 'lucide-react';

interface BinaryPuzzleGameProps {
  config?: {
    targetDecimal?: number;
    prompt?: string;
  };
  onSolve?: (answer: { binaryStr: string; decimal: number }, isCorrect: boolean) => void;
  disabled?: boolean;
}

const BIT_VALUES = [128, 64, 32, 16, 8, 4, 2, 1];

export default function BinaryPuzzleGame({ config, onSolve, disabled }: BinaryPuzzleGameProps) {
  const target = config?.targetDecimal || 165; // 128 + 32 + 4 + 1 = 10100101
  const prompt = config?.prompt || `Flip the 8-bit switches to construct the decimal value: ${target}`;

  const [bits, setBits] = useState<number[]>([0, 0, 0, 0, 0, 0, 0, 0]);
  const [isEvaluated, setIsEvaluated] = useState<boolean>(false);

  const toggleBit = (index: number) => {
    if (disabled || isEvaluated) return;
    const copy = [...bits];
    copy[index] = copy[index] === 1 ? 0 : 1;
    setBits(copy);

    const currentDecimal = copy.reduce((sum, b, i) => sum + b * BIT_VALUES[i], 0);
    if (currentDecimal === target) {
      setIsEvaluated(true);
      if (onSolve) {
        onSolve({ binaryStr: copy.join(''), decimal: currentDecimal }, true);
      }
    }
  };

  const handleReset = () => {
    if (disabled) return;
    setBits([0, 0, 0, 0, 0, 0, 0, 0]);
    setIsEvaluated(false);
  };

  const currentDecimal = bits.reduce((sum, b, i) => sum + b * BIT_VALUES[i], 0);
  const isMatch = currentDecimal === target;

  return (
    <div className="bg-[#080C14] border border-cyber-primary/30 p-5 rounded-lg font-mono-cyber">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 mb-4 border-b border-cyber-border">
        <div>
          <span className="text-[10px] text-cyan-400 uppercase tracking-widest px-2 py-0.5 bg-cyan-400/10 border border-cyan-400/30 rounded flex items-center gap-1.5 w-max">
            <Binary className="w-3 h-3" /> HARDWARE & NETWORKING LOGIC
          </span>
          <h3 className="text-base font-bold text-white mt-1">8-BIT BINARY CONVERSION MATRIX</h3>
          <p className="text-xs text-cyber-muted mt-0.5">{prompt}</p>
        </div>
        <button
          onClick={handleReset}
          disabled={disabled}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-cyber-muted hover:text-white bg-white/5 hover:bg-white/10 rounded transition-all border border-white/10"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Clear Bits
        </button>
      </div>

      {/* Target & Current Readout Displays */}
      <div className="grid grid-cols-2 gap-4 my-4">
        <div className="p-3 bg-[#0D131F] border border-cyber-border rounded text-center">
          <span className="text-[10px] uppercase text-cyber-muted block">TARGET DECIMAL VALUE</span>
          <span className="text-3xl font-bold text-cyan-300 font-mono mt-1 block">
            {target}
          </span>
        </div>

        <div className={`p-3 rounded border text-center transition-all ${
          isMatch
            ? 'bg-cyber-success/15 border-cyber-success'
            : 'bg-[#0D131F] border-cyber-border'
        }`}>
          <span className="text-[10px] uppercase text-cyber-muted block">CURRENT CALCULATED SUM</span>
          <span className={`text-3xl font-bold font-mono mt-1 block ${
            isMatch ? 'text-cyber-success' : 'text-white'
          }`}>
            {currentDecimal}
          </span>
        </div>
      </div>

      {/* 8 Bit Switches */}
      <div className="my-5">
        <div className="grid grid-cols-8 gap-1.5 sm:gap-3">
          {BIT_VALUES.map((weight, index) => {
            const isOn = bits[index] === 1;

            return (
              <button
                key={weight}
                onClick={() => toggleBit(index)}
                disabled={disabled || (isEvaluated && isMatch)}
                className={`py-3 px-1 rounded flex flex-col items-center justify-center transition-all border ${
                  isOn
                    ? 'bg-cyan-500/20 border-cyan-400 text-white shadow-[0_0_15px_rgba(6,182,212,0.3)]'
                    : 'bg-[#05080F] border-cyber-border/70 text-cyber-muted hover:border-cyan-400/40'
                }`}
              >
                {/* Weight */}
                <span className="text-[10px] sm:text-xs font-bold text-cyan-300/80 mb-1">
                  2^{7 - index}
                </span>
                <span className="text-[9px] text-cyber-muted mb-2">
                  {weight}
                </span>

                {/* Switch LED / State */}
                <div className={`w-8 h-8 rounded flex items-center justify-center font-mono font-bold text-base border transition-all ${
                  isOn
                    ? 'bg-cyan-400 text-black border-cyan-300 shadow-[0_0_10px_#22d3ee]'
                    : 'bg-black/60 text-cyber-muted border-white/10'
                }`}>
                  {isOn ? '1' : '0'}
                </div>
              </button>
            );
          })}
        </div>

        {/* Calculation Formula Breakdown */}
        <div className="mt-4 p-2.5 rounded bg-black/40 border border-white/5 text-center text-xs font-mono text-cyber-muted">
          Active Terms: {
            bits.map((b, i) => b === 1 ? BIT_VALUES[i] : null).filter(Boolean).join(' + ') || '0'
          } = <span className="text-white font-bold">{currentDecimal}</span>
        </div>
      </div>

      {/* Outcome Banner */}
      {isEvaluated && (
        <div className="mt-4 p-3 rounded bg-cyber-success/20 border border-cyber-success/40 text-cyber-success text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span className="font-bold">
              BINARY CONVERSION COMPLETE: 8-bit byte representation ({bits.join('')}) correctly produces {target}!
            </span>
          </div>
          <span className="font-bold tracking-widest text-[11px] uppercase">+100 XP</span>
        </div>
      )}
    </div>
  );
}
