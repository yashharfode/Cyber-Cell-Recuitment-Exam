import { useState, useRef, useEffect } from 'react';
import { Terminal, Send } from 'lucide-react';

interface CyberTerminalGameProps {
  onSolve?: (flag: string, isCorrect: boolean) => void;
  disabled?: boolean;
}

const FILE_SYSTEM: Record<string, string> = {
  'auth.log': `Oct 14 03:12:01 server sshd[1402]: Accepted publickey for rahul from 192.168.1.10 port 49152 ssh2
Oct 14 03:14:22 server sshd[1445]: Failed password for invalid user admin from 185.92.18.4 port 38291 ssh2
Oct 14 03:14:25 server sshd[1445]: Failed password for invalid user admin from 185.92.18.4 port 38291 ssh2
Oct 14 03:17:10 server sudo: pam_unix(sudo:auth): authentication failure; logname= uid=1002 euid=0
Oct 14 03:18:44 server token: Security flag payload generated -> secret_flag.b64`,

  'access.log': `192.168.1.10 - - [14/Oct/2026:10:20:11 +0530] "GET /api/status HTTP/1.1" 200 452
185.92.18.4 - - [14/Oct/2026:03:15:02 +0530] "POST /admin/login HTTP/1.1" 401 128
185.92.18.4 - - [14/Oct/2026:03:17:33 +0530] "GET /etc/shadow HTTP/1.1" 403 219`,

  'backup.conf': `# System Backup Configuration
SERVER_NAME="sati-soc-node-01"
BACKUP_TARGET="/mnt/cold_storage"
ENCRYPTION_STANDARD="AES-256-GCM"`,

  'secret_flag.b64': `Q1lCRVItQ0VMTC1aRVJPLURBWQ==`,
};

const SECRET_FLAG = 'CYBER-CELL-ZERO-DAY';

export default function CyberTerminalGame({ onSolve, disabled }: CyberTerminalGameProps) {
  const [history, setHistory] = useState<Array<{ command?: string; output: string; isError?: boolean; isSuccess?: boolean }>>([
    { output: 'CYBER CELL TERMINAL v4.2 [SATI VIDISHA SOC ENVIRONMENT]\nType "help" to view investigative commands or use the quick-action chips below.' }
  ]);
  const [inputVal, setInputVal] = useState<string>('');
  const [isSolved, setIsSolved] = useState<boolean>(false);
  const terminalBottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    terminalBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  const executeCommand = (cmdStr: string) => {
    const trimmed = cmdStr.trim();
    if (!trimmed) return;

    const parts = trimmed.split(/\s+/);
    const cmd = parts[0].toLowerCase();
    const arg1 = parts[1];
    const arg2 = parts[2];

    let output = '';
    let isError = false;
    let isSuccess = false;

    switch (cmd) {
      case 'help':
        output = `AVAILABLE SYSTEM UTILITIES:
  ls                     - List files in current directory
  cat <filename>         - Display contents of a file
  grep <pattern> <file>  - Filter file lines matching text pattern
  decode <b64_string>    - Decode Base64 encoded payload
  submit <flag_token>    - Submit recovered verification token
  clear                  - Clear terminal screen`;
        break;

      case 'ls':
        output = Object.keys(FILE_SYSTEM).join('    ');
        break;

      case 'clear':
        setHistory([]);
        return;

      case 'cat':
        if (!arg1) {
          output = 'cat: missing filename operand. Usage: cat <filename>';
          isError = true;
        } else if (FILE_SYSTEM[arg1]) {
          output = FILE_SYSTEM[arg1];
        } else {
          output = `cat: ${arg1}: No such file or directory`;
          isError = true;
        }
        break;

      case 'grep':
        if (!arg1 || !arg2) {
          output = 'grep: missing pattern or filename. Usage: grep <pattern> <file>';
          isError = true;
        } else if (FILE_SYSTEM[arg2]) {
          const cleanPattern = arg1.replace(/["']/g, '');
          const lines = FILE_SYSTEM[arg2].split('\n');
          const matched = lines.filter(l => l.toLowerCase().includes(cleanPattern.toLowerCase()));
          output = matched.length > 0 ? matched.join('\n') : `[No lines matched "${cleanPattern}"]`;
        } else {
          output = `grep: ${arg2}: No such file or directory`;
          isError = true;
        }
        break;

      case 'decode':
      case 'base64':
        const targetStr = (cmd === 'decode' ? arg1 : (arg1 === '-d' ? arg2 : arg1)) || '';
        if (!targetStr) {
          output = 'Usage: decode <base64_string>';
          isError = true;
        } else {
          try {
            const decoded = atob(targetStr);
            output = `DECODED STREAM: ${decoded}`;
          } catch {
            output = 'Error: Invalid Base64 character sequence.';
            isError = true;
          }
        }
        break;

      case 'submit':
        if (!arg1) {
          output = 'submit: missing token argument. Usage: submit <FLAG>';
          isError = true;
        } else if (arg1.toUpperCase() === SECRET_FLAG) {
          output = `✅ FLAG ACCEPTED: "${SECRET_FLAG}" VERIFIED!\nIncident investigation resolved. +100 XP awarded to operator.`;
          isSuccess = true;
          setIsSolved(true);
          if (onSolve) onSolve(SECRET_FLAG, true);
        } else {
          output = `❌ INVALID TOKEN: "${arg1}" is not the secret investigation key. Inspect secret_flag.b64!`;
          isError = true;
        }
        break;

      default:
        output = `bash: ${cmd}: command not found. Type "help" for valid commands.`;
        isError = true;
        break;
    }

    setHistory(prev => [...prev, { command: trimmed, output, isError, isSuccess }]);
    setInputVal('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      executeCommand(inputVal);
    }
  };

  return (
    <div className="bg-[#05080F] border border-cyber-primary/40 rounded-lg overflow-hidden font-mono-cyber shadow-2xl">
      {/* Terminal Title Bar */}
      <div className="bg-[#0A101D] px-4 py-2.5 border-b border-cyber-border flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-cyber-primary" />
          <span className="font-bold text-white tracking-wide">bash: soc-analyst@sati-node-01: ~</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-red-500/80 inline-block" />
          <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80 inline-block" />
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block" />
        </div>
      </div>

      {/* Terminal Screen Stream */}
      <div className="p-4 h-72 overflow-y-auto space-y-3 text-xs">
        {history.map((h, i) => (
          <div key={i} className="space-y-1">
            {h.command && (
              <div className="flex items-center gap-2 text-cyber-primary font-bold">
                <span>soc-analyst@sati-node-01:~$</span>
                <span className="text-white">{h.command}</span>
              </div>
            )}
            <div className={`whitespace-pre-wrap leading-relaxed ${
              h.isSuccess
                ? 'text-cyber-success font-bold bg-cyber-success/10 p-2 rounded border border-cyber-success/30'
                : h.isError
                ? 'text-red-400'
                : 'text-slate-300'
            }`}>
              {h.output}
            </div>
          </div>
        ))}
        <div ref={terminalBottomRef} />
      </div>

      {/* Quick Action Chips for Beginners */}
      <div className="px-4 py-2 bg-[#090D17] border-t border-white/5 flex flex-wrap items-center gap-1.5 text-[11px]">
        <span className="text-cyber-muted mr-1">Quick Utilities:</span>
        <button
          onClick={() => executeCommand('ls')}
          className="px-2 py-0.5 rounded bg-white/5 hover:bg-cyber-primary/20 text-cyber-primary border border-cyber-primary/30"
        >
          ls
        </button>
        <button
          onClick={() => executeCommand('cat auth.log')}
          className="px-2 py-0.5 rounded bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10"
        >
          cat auth.log
        </button>
        <button
          onClick={() => executeCommand('grep Failed auth.log')}
          className="px-2 py-0.5 rounded bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10"
        >
          grep Failed
        </button>
        <button
          onClick={() => executeCommand('cat secret_flag.b64')}
          className="px-2 py-0.5 rounded bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10"
        >
          cat secret_flag.b64
        </button>
        <button
          onClick={() => executeCommand('decode Q1lCRVItQ0VMTC1aRVJPLURBWQ==')}
          className="px-2 py-0.5 rounded bg-white/5 hover:bg-purple-400/20 text-purple-300 border border-purple-400/30"
        >
          decode flag
        </button>
        <button
          onClick={() => executeCommand('submit CYBER-CELL-ZERO-DAY')}
          className="px-2 py-0.5 rounded bg-cyber-success/10 hover:bg-cyber-success/20 text-cyber-success border border-cyber-success/30 font-bold ml-auto"
        >
          submit flag
        </button>
      </div>

      {/* Terminal Input Line */}
      <div className="p-3 bg-[#0A101D] border-t border-cyber-border flex items-center gap-2">
        <span className="text-xs text-cyber-primary font-bold shrink-0">
          $
        </span>
        <input
          type="text"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={disabled || isSolved}
          placeholder={isSolved ? 'Investigation complete! Token validated.' : 'Type terminal command (e.g. ls, cat auth.log, help)...'}
          className="w-full bg-transparent text-xs text-white placeholder-cyber-muted/50 focus:outline-none font-mono"
        />
        <button
          onClick={() => executeCommand(inputVal)}
          disabled={disabled || isSolved || !inputVal.trim()}
          className="p-1.5 rounded bg-cyber-primary/20 hover:bg-cyber-primary/30 text-cyber-primary disabled:opacity-40"
        >
          <Send className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
