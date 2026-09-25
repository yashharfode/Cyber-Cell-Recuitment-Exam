import { useState } from 'react';
import { Lock, Unlock, CheckCircle2, RotateCcw, Sliders } from 'lucide-react';

interface CipherWheelGameProps {
  config?: {
    ciphertext?: string;
    expectedPlaintext?: string;
    prompt?: string;
  };
  onSolve?: (answer: { shift: number; plaintext: string }, isCorrect: boolean) => void;
  disabled?: boolean;
}

export default function CipherWheelGame({ config, onSolve, disabled }: CipherWheelGameProps) {
  const ciphertext = (config?.ciphertext || 'KHOOR').toUpperCase();
  const expectedPlaintext = (config?.expectedPlaintext || 'HELLO').toUpperCase();
  const prompt = config?.prompt || 'An intercepted transmission was scrambled using a Caesar substitution cipher. Adjust the cryptographic shift key to decrypt the secret message.';

  const [shift, setShift] = useState<number>(0);
  const [isEvaluated, setIsEvaluated] = useState<boolean>(false);

  // Decrypt with current shift
  const decryptCaesar = (text: string, s: number) => {
    return text.split('').map(char => {
      const code = char.charCodeAt(0);
      if (code >= 65 && code <= 90) {
        // Shift backward by s
        const decryptedCode = ((code - 65 - s + 26) % 26) + 65;
        return String.fromCharCode(decryptedCode);
      }
      return char;
    }).join('');
  };

  const currentPlaintext = decryptCaesar(ciphertext, shift);
  const isMatch = currentPlaintext === expectedPlaintext;

  const handleConfirm = () => {
    if (disabled) return;
    setIsEvaluated(true);
    if (onSolve) {
      onSolve({ shift, plaintext: currentPlaintext }, isMatch);
    }
  };

  const handleReset = () => {
    if (disabled) return;
    setShift(0);
    setIsEvaluated(false);
  };

  return (
    <div className="bg-[#080C14] border border-cyber-primary/30 p-5 rounded-lg font-mono-cyber">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 mb-4 border-b border-cyber-border">
        <div>
          <span className="text-[10px] text-purple-400 uppercase tracking-widest px-2 py-0.5 bg-purple-400/10 border border-purple-400/30 rounded flex items-center gap-1.5 w-max">
            <Lock className="w-3 h-3" /> CRYPTOGRAPHIC TELEMETRY
          </span>
          <h3 className="text-base font-bold text-white mt-1">CAESAR CIPHER DECODER RING</h3>
          <p className="text-xs text-cyber-muted mt-0.5">{prompt}</p>
        </div>
        <button
          onClick={handleReset}
          disabled={disabled}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-cyber-muted hover:text-white bg-white/5 hover:bg-white/10 rounded transition-all border border-white/10"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Reset Shift
        </button>
      </div>

      {/* Ciphertext & Live Plaintext Display */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
        {/* Ciphertext Card */}
        <div className="p-4 bg-[#0D131F] border border-cyber-border rounded text-center">
          <span className="text-[10px] uppercase text-cyber-muted block flex items-center justify-center gap-1.5">
            <Lock className="w-3 h-3 text-red-400" /> ENCRYPTED PAYLOAD
          </span>
          <span className="text-3xl font-bold font-mono text-red-400 tracking-widest mt-2 block">
            {ciphertext}
          </span>
          <span className="text-[10px] text-cyber-muted mt-1 block">Intercepted Raw Stream</span>
        </div>

        {/* Decrypted Output Card */}
        <div className={`p-4 rounded border text-center transition-all ${
          isMatch
            ? 'bg-cyber-success/15 border-cyber-success'
            : 'bg-[#0D131F] border-cyber-border'
        }`}>
          <span className="text-[10px] uppercase text-cyber-muted block flex items-center justify-center gap-1.5">
            <Unlock className={`w-3 h-3 ${isMatch ? 'text-cyber-success' : 'text-purple-400'}`} /> DECRYPTED PLAINTEXT PREVIEW
          </span>
          <span className={`text-3xl font-bold font-mono tracking-widest mt-2 block ${
            isMatch ? 'text-cyber-success' : 'text-purple-300'
          }`}>
            {currentPlaintext}
          </span>
          <span className="text-[10px] text-cyber-muted mt-1 block">
            Shift Key: -{shift} (A &rarr; {String.fromCharCode(((65 - shift - 65 + 26) % 26) + 65)})
          </span>
        </div>
      </div>

      {/* Shift Wheel / Slider Controller */}
      <div className="p-4 bg-[#05080F] border border-white/10 rounded-lg my-4 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-white flex items-center gap-2">
            <Sliders className="w-4 h-4 text-purple-400" /> CIPHER SHIFT OFFSET (0 - 25)
          </span>
          <span className="text-sm font-bold font-mono text-purple-400">
            SHIFT = {shift}
          </span>
        </div>

        <input
          type="range"
          min={0}
          max={25}
          value={shift}
          onChange={(e) => {
            if (disabled) return;
            setShift(Number(e.target.value));
            setIsEvaluated(false);
          }}
          disabled={disabled}
          className="w-full accent-purple-400 cursor-pointer h-2 bg-black/60 rounded-lg appearance-none"
        />

        <div className="flex justify-between text-[10px] text-cyber-muted font-mono">
          <span>0 (Raw)</span>
          <span>Shift 6</span>
          <span>Shift 13 (ROT13)</span>
          <span>Shift 19</span>
          <span>25</span>
        </div>

        <button
          onClick={handleConfirm}
          disabled={disabled}
          className="w-full mt-3 py-2.5 bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 font-bold text-xs uppercase tracking-wider rounded border border-purple-500/50 flex items-center justify-center gap-2 transition-all shadow-[0_0_15px_rgba(168,85,247,0.2)]"
        >
          <Unlock className="w-4 h-4" /> Confirm & Verify Decryption
        </button>
      </div>

      {/* Outcome Banner */}
      {isEvaluated && (
        <div className={`mt-4 p-3 rounded flex items-center justify-between text-xs ${
          isMatch 
            ? 'bg-cyber-success/20 border border-cyber-success/40 text-cyber-success'
            : 'bg-cyber-danger/20 border border-cyber-danger/40 text-cyber-danger'
        }`}>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span className="font-bold">
              {isMatch 
                ? `CIPHERTEXT DECODED: Message cleanly decrypted as "${expectedPlaintext}"!` 
                : 'DECRYPTION MISMATCH: Decoded string does not produce readable plain text.'}
            </span>
          </div>
          <span className="font-bold tracking-widest text-[11px] uppercase">
            {isMatch ? '+100 XP' : 'TRY ANOTHER SHIFT'}
          </span>
        </div>
      )}
    </div>
  );
}
