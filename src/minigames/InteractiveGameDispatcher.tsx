import type { InteractiveGameType } from '../types';
import NetworkBuilderGame from './NetworkBuilderGame';
import MatchPairsGame from './MatchPairsGame';
import FindIntruderGame from './FindIntruderGame';
import PhishingHunterGame from './PhishingHunterGame';
import CodeArrangerGame from './CodeArrangerGame';
import PasswordStrengthGame from './PasswordStrengthGame';
import BinaryPuzzleGame from './BinaryPuzzleGame';
import CipherWheelGame from './CipherWheelGame';
import DigitalDetectiveGame from './DigitalDetectiveGame';
import CyberTerminalGame from './CyberTerminalGame';

interface InteractiveGameDispatcherProps {
  type: InteractiveGameType | string;
  config?: Record<string, any>;
  onSolve?: (answer: any, isCorrect: boolean) => void;
  disabled?: boolean;
}

export default function InteractiveGameDispatcher({
  type,
  config,
  onSolve,
  disabled
}: InteractiveGameDispatcherProps) {
  switch (type) {
    case 'network-builder':
      return <NetworkBuilderGame config={config} onSolve={onSolve} disabled={disabled} />;

    case 'match-pairs':
      return <MatchPairsGame config={config} onSolve={onSolve} disabled={disabled} />;

    case 'find-intruder':
      return <FindIntruderGame config={config} onSolve={onSolve} disabled={disabled} />;

    case 'phishing-hunter':
      return <PhishingHunterGame config={config} onSolve={onSolve} disabled={disabled} />;

    case 'code-arranger':
      return <CodeArrangerGame config={config} onSolve={onSolve} disabled={disabled} />;

    case 'password-strength':
      return <PasswordStrengthGame onSolve={onSolve} disabled={disabled} />;

    case 'binary-puzzle':
      return <BinaryPuzzleGame config={config} onSolve={onSolve} disabled={disabled} />;

    case 'cipher-wheel':
      return <CipherWheelGame config={config} onSolve={onSolve} disabled={disabled} />;

    case 'digital-detective':
      return <DigitalDetectiveGame onSolve={onSolve} disabled={disabled} />;

    case 'cyber-terminal':
      return <CyberTerminalGame onSolve={onSolve} disabled={disabled} />;

    default:
      return (
        <div className="p-4 rounded border border-cyber-border text-xs text-cyber-muted">
          Interactive simulation type &quot;{type}&quot; not found.
        </div>
      );
  }
}
