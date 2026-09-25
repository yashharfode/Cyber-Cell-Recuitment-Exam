import { useState } from 'react';
import { Eye, CheckCircle2, AlertTriangle, Terminal, Clock } from 'lucide-react';

export interface LogEntry {
  id: string;
  user: string;
  ip: string;
  time: string;
  location: string;
  role: string;
  isAnomaly: boolean;
  anomalyReason?: string;
}

interface FindIntruderGameProps {
  config?: {
    logs?: LogEntry[];
    prompt?: string;
  };
  onSolve?: (selectedId: string, isCorrect: boolean) => void;
  disabled?: boolean;
}

const DEFAULT_LOGS: LogEntry[] = [
  { id: 'log-1', user: 'Rahul_Sharma', ip: '192.168.1.10', time: '10:20 AM', location: 'SATI Lab-3', role: 'Student User', isAnomaly: false },
  { id: 'log-2', user: 'Aman_Verma', ip: '192.168.1.12', time: '10:21 AM', location: 'SATI Library', role: 'Student User', isAnomaly: false },
  { id: 'log-3', user: 'Riya_Gupta', ip: '192.168.1.14', time: '10:22 AM', location: 'SATI Lab-1', role: 'Student User', isAnomaly: false },
  { id: 'log-4', user: 'Domain_Admin', ip: '185.92.18.4', time: '03:17 AM', location: 'Foreign VPS / Tor Exit', role: 'System Admin', isAnomaly: true, anomalyReason: 'Untrusted public IP (185.92.18.4) accessing domain root privileges at 03:17 AM outside authorized academic hours.' },
  { id: 'log-5', user: 'Priya_Patel', ip: '192.168.1.15', time: '10:25 AM', location: 'SATI Faculty Block', role: 'Staff User', isAnomaly: false },
  { id: 'log-6', user: 'Vikas_Joshi', ip: '192.168.1.18', time: '10:27 AM', location: 'SATI Lab-2', role: 'Student User', isAnomaly: false },
];

export default function FindIntruderGame({ config, onSolve, disabled }: FindIntruderGameProps) {
  const logs = config?.logs || DEFAULT_LOGS;
  const promptText = config?.prompt || 'Inspect the authentication telemetry below. One login record violates normal organizational baseline security. Identify and click the malicious intruder.';

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isEvaluated, setIsEvaluated] = useState<boolean>(false);

  const handleSelectRow = (entry: LogEntry) => {
    if (disabled || isEvaluated) return;
    setSelectedId(entry.id);
    setIsEvaluated(true);
    if (onSolve) {
      onSolve(entry.id, entry.isAnomaly);
    }
  };

  const selectedEntry = logs.find(l => l.id === selectedId);

  return (
    <div className="bg-[#080C14] border border-cyber-primary/30 p-5 rounded-lg font-mono-cyber">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 mb-4 border-b border-cyber-border">
        <div>
          <span className="text-[10px] text-cyber-warning uppercase tracking-widest px-2 py-0.5 bg-cyber-warning/10 border border-cyber-warning/30 rounded flex items-center gap-1.5 w-max">
            <Eye className="w-3 h-3" /> SOC ANOMALY DETECTION
          </span>
          <h3 className="text-base font-bold text-white mt-1">FIND THE UNUSUAL INTRUSION LOG</h3>
          <p className="text-xs text-cyber-muted mt-0.5">{promptText}</p>
        </div>
        <div className="flex items-center gap-2 text-xs text-cyber-muted">
          <Terminal className="w-3.5 h-3.5 text-cyber-primary" />
          <span>Live Auth Stream</span>
        </div>
      </div>

      {/* Log Table */}
      <div className="overflow-x-auto rounded border border-cyber-border bg-[#05080F]">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#0D131F] text-cyber-muted uppercase text-[10px] border-b border-cyber-border">
            <tr>
              <th className="py-2.5 px-3">Session User</th>
              <th className="py-2.5 px-3">Source IP</th>
              <th className="py-2.5 px-3">Timestamp</th>
              <th className="py-2.5 px-3">Network Origin</th>
              <th className="py-2.5 px-3">Authorization Role</th>
              <th className="py-2.5 px-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {logs.map((entry) => {
              const isSelected = selectedId === entry.id;
              const showAnomaly = isEvaluated && entry.isAnomaly;
              const isWrongSelection = isEvaluated && isSelected && !entry.isAnomaly;

              return (
                <tr
                  key={entry.id}
                  onClick={() => handleSelectRow(entry)}
                  className={`cursor-pointer transition-all ${
                    showAnomaly
                      ? 'bg-red-950/40 text-red-200 border-l-4 border-red-500'
                      : isWrongSelection
                      ? 'bg-amber-950/30 text-amber-200 border-l-4 border-amber-500'
                      : isSelected
                      ? 'bg-cyber-primary/15 text-white'
                      : 'hover:bg-white/5 text-slate-300'
                  }`}
                >
                  <td className="py-2.5 px-3 font-semibold text-white flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-cyber-primary animate-pulse" />
                    {entry.user}
                  </td>
                  <td className="py-2.5 px-3 font-mono text-cyan-300">{entry.ip}</td>
                  <td className="py-2.5 px-3 text-cyber-muted flex items-center gap-1">
                    <Clock className="w-3 h-3 inline text-cyber-secondary" /> {entry.time}
                  </td>
                  <td className="py-2.5 px-3">{entry.location}</td>
                  <td className="py-2.5 px-3">
                    <span className="text-[10px] px-2 py-0.5 rounded uppercase font-medium bg-white/5 text-cyber-muted border border-white/10">
                      {entry.role}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-right">
                    <button
                      disabled={disabled || isEvaluated}
                      className="px-2.5 py-1 text-[10px] uppercase font-bold tracking-wider rounded border border-cyber-primary/40 text-cyber-primary hover:bg-cyber-primary/20 transition-all"
                    >
                      {isSelected ? 'Flagged' : 'Flag Event'}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Investigation Debrief */}
      {isEvaluated && selectedEntry && (
        <div className={`mt-4 p-4 rounded-lg border ${
          selectedEntry.isAnomaly
            ? 'bg-cyber-success/15 border-cyber-success text-white shadow-[0_0_20px_rgba(0,255,136,0.15)]'
            : 'bg-cyber-danger/15 border-cyber-danger text-white'
        }`}>
          <div className="flex items-start gap-3">
            {selectedEntry.isAnomaly ? (
              <CheckCircle2 className="w-5 h-5 text-cyber-success shrink-0 mt-0.5" />
            ) : (
              <AlertTriangle className="w-5 h-5 text-cyber-danger shrink-0 mt-0.5" />
            )}
            <div className="space-y-1">
              <span className="font-bold text-sm block">
                {selectedEntry.isAnomaly
                  ? '🎯 THREAT DETECTED: Intruder Successfully Isolated!'
                  : '⚠️ FALSE POSITIVE: Selected event represents legitimate campus network traffic.'}
              </span>
              <p className="text-xs text-slate-300 leading-relaxed">
                {logs.find(l => l.isAnomaly)?.anomalyReason}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
