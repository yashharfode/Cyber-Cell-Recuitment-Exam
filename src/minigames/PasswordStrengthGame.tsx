import { useState } from 'react';
import { KeyRound, CheckCircle2 } from 'lucide-react';

interface PasswordItem {
  id: string;
  value: string;
  expectedCategory: 'WEAK' | 'MEDIUM' | 'STRONG';
}

interface PasswordStrengthGameProps {
  onSolve?: (answer: any, isCorrect: boolean) => void;
  disabled?: boolean;
}

const DEFAULT_PASSWORDS: PasswordItem[] = [
  { id: 'p-1', value: '123456', expectedCategory: 'WEAK' },
  { id: 'p-2', value: 'password', expectedCategory: 'WEAK' },
  { id: 'p-3', value: 'Admin123', expectedCategory: 'MEDIUM' },
  { id: 'p-4', value: 'Cyber@2026', expectedCategory: 'MEDIUM' },
  { id: 'p-5', value: 'T9#kL2!pQ7', expectedCategory: 'STRONG' },
];

const ENTROPY_BLOCKS = [
  { id: 'b-1', text: 'Admin', entropy: 12, label: 'Common word' },
  { id: 'b-2', text: '123', entropy: 10, label: 'Predictable digits' },
  { id: 'b-3', text: '@', entropy: 6, label: 'Common symbol' },
  { id: 'b-4', text: 'T9#', entropy: 20, label: 'Alphanumeric symbol' },
  { id: 'b-5', text: 'kL2!pQ', entropy: 35, label: 'High-entropy random' },
];

export default function PasswordStrengthGame({ onSolve, disabled }: PasswordStrengthGameProps) {
  // Part 1: Bucket classification
  const [buckets, setBuckets] = useState<Record<string, 'WEAK' | 'MEDIUM' | 'STRONG'>>({});
  const [selectedPassword, setSelectedPassword] = useState<string | null>(null);

  // Part 2: Custom builder
  const [builderBlocks, setBuilderBlocks] = useState<string[]>([]);

  const [isEvaluated, setIsEvaluated] = useState<boolean>(false);
  const [isCorrect, setIsCorrect] = useState<boolean>(false);

  const handlePlaceInBucket = (bucketName: 'WEAK' | 'MEDIUM' | 'STRONG') => {
    if (disabled || isEvaluated || !selectedPassword) return;
    const updated = { ...buckets, [selectedPassword]: bucketName };
    setBuckets(updated);
    setSelectedPassword(null);

    // If all passwords sorted
    if (Object.keys(updated).length === DEFAULT_PASSWORDS.length) {
      checkOutcome(updated, builderBlocks);
    }
  };

  const handleToggleBuilderBlock = (blockId: string) => {
    if (disabled || isEvaluated) return;
    const updated = builderBlocks.includes(blockId)
      ? builderBlocks.filter(b => b !== blockId)
      : [...builderBlocks, blockId];
    setBuilderBlocks(updated);

    if (Object.keys(buckets).length === DEFAULT_PASSWORDS.length) {
      checkOutcome(buckets, updated);
    }
  };

  const checkOutcome = (currentBuckets: Record<string, 'WEAK' | 'MEDIUM' | 'STRONG'>, blocks: string[]) => {
    const bucketsCorrect = DEFAULT_PASSWORDS.every(p => currentBuckets[p.id] === p.expectedCategory);
    // Strong password builder contains high-entropy blocks
    const totalEntropy = blocks.reduce((sum, bId) => {
      const b = ENTROPY_BLOCKS.find(x => x.id === bId);
      return sum + (b?.entropy || 0);
    }, 0);
    const builderValid = totalEntropy >= 50;

    const allPassed = bucketsCorrect && builderValid;
    setIsCorrect(allPassed);
    setIsEvaluated(true);
    if (onSolve) {
      onSolve({ buckets: currentBuckets, builtPassword: blocks, totalEntropy }, allPassed);
    }
  };

  const currentEntropy = builderBlocks.reduce((sum, bId) => {
    const b = ENTROPY_BLOCKS.find(x => x.id === bId);
    return sum + (b?.entropy || 0);
  }, 0);

  const assembledPassword = builderBlocks
    .map(bId => ENTROPY_BLOCKS.find(x => x.id === bId)?.text || '')
    .join('');

  return (
    <div className="bg-[#080C14] border border-cyber-primary/30 p-5 rounded-lg font-mono-cyber">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 mb-4 border-b border-cyber-border">
        <div>
          <span className="text-[10px] text-cyber-warning uppercase tracking-widest px-2 py-0.5 bg-cyber-warning/10 border border-cyber-warning/30 rounded flex items-center gap-1.5 w-max">
            <KeyRound className="w-3 h-3" /> CREDENTIAL ENTROPY LAB
          </span>
          <h3 className="text-base font-bold text-white mt-1">PASSWORD STRENGTH CLASSIFIER & BUILDER</h3>
          <p className="text-xs text-cyber-muted mt-0.5">
            1. Categorize all passwords into WEAK, MEDIUM, or STRONG. 2. Assemble high-entropy blocks to build a resilient passphrase.
          </p>
        </div>
      </div>

      {/* Part 1: Classification */}
      <div className="mb-6">
        <span className="text-xs font-bold text-white uppercase mb-2 block">
          PHASE 1: SORT TARGET CREDENTIALS BY STRENGTH
        </span>

        {/* Password Cards to pick */}
        <div className="flex flex-wrap gap-2 mb-3">
          {DEFAULT_PASSWORDS.map((pw) => {
            const isAssigned = !!buckets[pw.id];
            const isSelected = selectedPassword === pw.id;

            return (
              <button
                key={pw.id}
                onClick={() => setSelectedPassword(isSelected ? null : pw.id)}
                disabled={disabled || isEvaluated}
                className={`px-3 py-2 rounded border text-xs font-mono font-semibold transition-all ${
                  isSelected
                    ? 'border-cyber-primary bg-cyber-primary/20 text-white ring-1 ring-cyber-primary shadow-[0_0_10px_rgba(0,255,204,0.3)]'
                    : isAssigned
                    ? 'border-white/10 bg-white/5 text-cyber-muted opacity-60'
                    : 'border-cyber-border bg-[#0D131F] text-slate-200 hover:border-cyber-primary/40'
                }`}
              >
                {pw.value}
                {isAssigned && (
                  <span className="ml-2 text-[9px] uppercase px-1 py-0.2 bg-black/40 rounded">
                    [{buckets[pw.id]}]
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* 3 Buckets */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {(['WEAK', 'MEDIUM', 'STRONG'] as const).map((bucket) => {
            const itemsInBucket = DEFAULT_PASSWORDS.filter(p => buckets[p.id] === bucket);

            return (
              <div
                key={bucket}
                onClick={() => handlePlaceInBucket(bucket)}
                className={`p-3 rounded border transition-all cursor-pointer ${
                  selectedPassword
                    ? 'border-dashed border-cyber-primary bg-cyber-primary/5 hover:bg-cyber-primary/15'
                    : 'border-cyber-border bg-[#05080F]'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-xs font-bold uppercase ${
                    bucket === 'STRONG' ? 'text-cyber-success' : bucket === 'MEDIUM' ? 'text-cyber-warning' : 'text-cyber-danger'
                  }`}>
                    {bucket} ZONE
                  </span>
                  <span className="text-[10px] text-cyber-muted">{itemsInBucket.length} items</span>
                </div>

                <div className="min-h-[45px] space-y-1">
                  {itemsInBucket.map(p => (
                    <div key={p.id} className="text-xs font-mono text-white bg-black/40 px-2 py-1 rounded border border-white/5 truncate">
                      {p.value}
                    </div>
                  ))}
                  {itemsInBucket.length === 0 && (
                    <div className="text-[10px] text-cyber-muted/50 italic pt-2">
                      Click password above, then click here to assign
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Part 2: Password Builder */}
      <div className="pt-4 border-t border-cyber-border">
        <span className="text-xs font-bold text-white uppercase mb-2 block">
          PHASE 2: BUILD A HIGH-ENTROPY PASSPHRASE (&ge; 50 BITS ENTROPY)
        </span>

        {/* Block Choices */}
        <div className="flex flex-wrap gap-2 mb-3">
          {ENTROPY_BLOCKS.map((block) => {
            const isUsed = builderBlocks.includes(block.id);

            return (
              <button
                key={block.id}
                onClick={() => handleToggleBuilderBlock(block.id)}
                disabled={disabled || isEvaluated}
                className={`p-2.5 rounded border text-xs font-mono font-bold transition-all flex items-center gap-2 ${
                  isUsed
                    ? 'border-cyber-secondary bg-cyber-secondary/20 text-white shadow-[0_0_10px_rgba(112,0,255,0.3)]'
                    : 'border-cyber-border bg-[#0D131F] text-slate-300 hover:border-cyber-secondary/40'
                }`}
              >
                <span>{block.text}</span>
                <span className="text-[10px] text-cyber-secondary font-normal font-mono-cyber">
                  +{block.entropy} bits
                </span>
              </button>
            );
          })}
        </div>

        {/* Assembled Result & Entropy Meter */}
        <div className="p-3 rounded bg-[#05080F] border border-cyber-border flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="text-[10px] text-cyber-muted uppercase block">Constructed String:</span>
            <span className="text-sm font-mono text-cyber-primary font-bold">
              {assembledPassword || '(Select blocks above to assemble)'}
            </span>
          </div>

          <div className="sm:w-48">
            <div className="flex justify-between text-[10px] uppercase font-bold mb-1">
              <span className="text-cyber-muted">Entropy Meter</span>
              <span className={currentEntropy >= 50 ? 'text-cyber-success font-bold' : 'text-cyber-warning'}>
                {currentEntropy} Bits
              </span>
            </div>
            <div className="w-full h-2 bg-black/60 rounded-full overflow-hidden border border-white/10">
              <div
                className={`h-full transition-all duration-300 ${
                  currentEntropy >= 50 ? 'bg-cyber-success shadow-[0_0_10px_#00ff88]' : 'bg-cyber-warning'
                }`}
                style={{ width: `${Math.min(100, (currentEntropy / 65) * 100)}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Outcome Banner */}
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
                ? 'CREDENTIAL DEFENSE VALIDATED: Strengths mapped and high-entropy key generated!' 
                : 'SECURITY DEFICIT: Check password categorization or increase passphrase entropy.'}
            </span>
          </div>
          <span className="font-bold tracking-widest text-[11px] uppercase">
            {isCorrect ? '+100 XP' : 'NEEDS REVISION'}
          </span>
        </div>
      )}
    </div>
  );
}
