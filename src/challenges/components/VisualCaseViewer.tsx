import type { VisualCase } from '../../types';
import { 
  Mail, 
  AlertTriangle, 
  Wifi, 
  Lock, 
  Unlock, 
  Smartphone, 
  Folder, 
  FileText, 
  FileCode,
  QrCode
} from 'lucide-react';

interface VisualCaseViewerProps {
  visualCase: VisualCase;
}

export default function VisualCaseViewer({ visualCase }: VisualCaseViewerProps) {
  const { type, data } = visualCase;

  switch (type) {
    case 'email':
      return (
        <div className="bg-[#0D131F] border border-cyber-border rounded-lg overflow-hidden shadow-xl mb-5 font-sans">
          {/* Email Client Header Bar */}
          <div className="bg-[#121927] px-4 py-2 border-b border-cyber-border flex items-center justify-between text-xs text-cyber-muted">
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-cyber-primary" />
              <span className="font-bold text-white">SATI Webmail Portal • Inbox</span>
            </div>
            <span className="text-[11px] bg-cyber-danger/20 text-cyber-danger px-2 py-0.5 rounded border border-cyber-danger/30 font-mono-cyber">
              EXTERNAL SENDER
            </span>
          </div>

          {/* Email Metadata */}
          <div className="p-4 bg-[#0A0F18] border-b border-cyber-border text-xs space-y-1.5 font-mono-cyber">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
              <span className="text-white font-bold text-sm">{data.subject}</span>
              <span className="text-cyber-muted text-[11px]">{data.date || 'Today, 11:32 PM'}</span>
            </div>
            <div className="text-cyber-muted">
              <span className="text-cyber-text font-semibold">From: </span>
              <span className="text-white">{data.senderName} </span>
              <span className="text-cyber-muted bg-white/5 px-1.5 py-0.5 rounded border border-white/10 text-[11px]">
                &lt;{data.senderEmail}&gt;
              </span>
            </div>
            <div className="text-cyber-muted">
              <span className="text-cyber-text font-semibold">To: </span>
              <span>{data.recipient || 'student@satiengg.in'}</span>
            </div>
          </div>

          {/* Email Body */}
          <div className="p-5 bg-[#080C14] text-xs text-cyber-text space-y-3 leading-relaxed">
            <div className="p-3 bg-red-950/20 border border-red-500/30 rounded flex items-center gap-2.5 text-cyber-danger">
              <AlertTriangle className="w-5 h-5 shrink-0" />
              <span className="font-semibold">{data.alertBanner || 'CRITICAL NOTICE: IMMEDIATE ACTION REQUIRED'}</span>
            </div>

            <p className="whitespace-pre-line text-slate-200">{data.bodyText}</p>

            {data.buttonText && (
              <div className="py-2 text-center">
                <span className="inline-block px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded shadow-lg transition-all text-xs cursor-pointer">
                  {data.buttonText}
                </span>
                {data.linkUrl && (
                  <p className="text-[10px] text-cyber-muted mt-2 font-mono-cyber">
                    Link points to: <span className="text-cyber-warning underline">{data.linkUrl}</span>
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      );

    case 'sms':
      return (
        <div className="max-w-md mx-auto bg-[#0A0E17] border border-cyber-border rounded-2xl overflow-hidden shadow-2xl mb-5 font-sans">
          {/* Smartphone Top Notch Bar */}
          <div className="bg-[#101724] px-4 py-2.5 border-b border-cyber-border flex items-center justify-between text-xs text-cyber-muted">
            <div className="flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-cyber-primary" />
              <span className="font-bold text-white">Messages</span>
            </div>
            <span className="text-[10px] font-mono-cyber">SIM 1 • Airtel 5G</span>
          </div>

          <div className="p-4 text-center border-b border-white/5 bg-[#080C14]">
            <div className="w-10 h-10 rounded-full bg-cyber-primary/20 border border-cyber-primary/40 flex items-center justify-center mx-auto text-cyber-primary font-bold text-sm">
              ?
            </div>
            <div className="text-xs font-bold text-white mt-1">{data.senderNumber}</div>
            <div className="text-[10px] text-cyber-muted">Not in your contacts</div>
          </div>

          {/* SMS Chat Bubble */}
          <div className="p-5 space-y-3 bg-[#05070D]">
            <div className="max-w-[85%] bg-[#121A2B] border border-cyber-primary/30 p-3.5 rounded-2xl rounded-tl-sm text-xs text-slate-200 leading-relaxed space-y-2">
              <p>{data.message}</p>
              {data.link && (
                <div className="p-2 bg-black/40 border border-cyber-warning/40 rounded text-cyber-warning text-[11px] font-mono-cyber break-all">
                  🔗 {data.link}
                </div>
              )}
              <div className="text-[9px] text-right text-cyber-muted font-mono-cyber">
                {data.time || '10:45 AM'} • SMS
              </div>
            </div>
          </div>
        </div>
      );

    case 'wifi':
      return (
        <div className="max-w-md mx-auto bg-[#0A0E17] border border-cyber-border rounded-xl overflow-hidden shadow-xl mb-5 font-sans">
          <div className="bg-[#121927] px-4 py-3 border-b border-cyber-border flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <Wifi className="w-4 h-4 text-cyber-primary" />
              <span className="font-bold text-white">Wi-Fi Networks Available</span>
            </div>
            <span className="text-cyber-success text-[11px] font-bold">Scanning...</span>
          </div>

          <div className="p-4 space-y-2.5 bg-[#060911]">
            {data.networks?.map((net: any, idx: number) => (
              <div 
                key={idx}
                className={`p-3 rounded border flex items-center justify-between text-xs ${
                  net.highlight 
                    ? 'border-cyber-warning bg-cyber-warning/10 text-white' 
                    : 'border-cyber-border bg-[#0E1524] text-cyber-muted'
                }`}
              >
                <div className="flex items-center gap-3">
                  {net.isSecure ? (
                    <Lock className="w-4 h-4 text-cyber-success shrink-0" />
                  ) : (
                    <Unlock className="w-4 h-4 text-cyber-danger shrink-0 animate-pulse" />
                  )}
                  <div>
                    <div className="font-bold text-white flex items-center gap-1.5">
                      <span>{net.ssid}</span>
                      {net.highlight && (
                        <span className="text-[9px] bg-cyber-danger text-black font-bold px-1.5 rounded">
                          SUSPICIOUS
                        </span>
                      )}
                    </div>
                    <div className="text-[10px] text-cyber-muted mt-0.5">
                      {net.securityType} • Signal: {net.signal || 'Strong'}
                    </div>
                  </div>
                </div>
                <span className="text-[10px] font-mono-cyber px-2 py-0.5 border border-cyber-border rounded">
                  {net.status || 'Available'}
                </span>
              </div>
            ))}
          </div>
        </div>
      );

    case 'upi':
      return (
        <div className="max-w-md mx-auto bg-[#0A0F1A] border-2 border-cyber-primary/40 rounded-xl p-5 shadow-2xl mb-5 font-sans text-center">
          <div className="text-xs uppercase tracking-widest text-cyber-primary font-bold mb-3 flex items-center justify-center gap-2">
            <QrCode className="w-5 h-5 text-cyber-primary" />
            CANTEEN UPI PAYMENT COUNTER
          </div>

          {/* Simulated Physical Stand with Sticker Overlay */}
          <div className="relative inline-block p-4 bg-white rounded-lg shadow-inner border-4 border-slate-300">
            <div className="w-44 h-44 bg-slate-100 flex flex-col items-center justify-center border-2 border-dashed border-slate-400 p-2">
              <QrCode className="w-28 h-28 text-slate-800" />
              <span className="text-[10px] font-bold text-slate-700 mt-1 font-mono-cyber">
                BHIM UPI • GPay • Paytm
              </span>
            </div>

            {/* Peeled Sticker Overlay Visual */}
            <div className="absolute -bottom-2 -right-2 bg-amber-300 text-black px-3 py-1 text-[11px] font-bold font-mono-cyber shadow-lg border border-black rotate-[-4deg] rounded">
              ⚠️ Counterfeit Sticker Pasted Over Board!
            </div>
          </div>

          <div className="mt-4 p-3 bg-black/60 border border-cyber-border rounded text-xs font-mono-cyber text-left space-y-1">
            <div className="text-cyber-muted">
              Actual Canteen Account: <span className="text-cyber-success font-bold">{data.realAccount}</span>
            </div>
            <div className="text-cyber-muted">
              Scanned Sticker Receiver: <span className="text-cyber-danger font-bold">{data.fakeAccount}</span>
            </div>
          </div>
        </div>
      );

    case 'explorer':
      return (
        <div className="bg-[#0D131F] border border-cyber-border rounded-lg overflow-hidden shadow-xl mb-5 font-sans">
          {/* Windows Explorer Title Bar */}
          <div className="bg-[#121927] px-4 py-2 border-b border-cyber-border flex items-center justify-between text-xs text-cyber-muted">
            <div className="flex items-center gap-2">
              <Folder className="w-4 h-4 text-cyber-warning" />
              <span className="text-white font-semibold">Downloads &gt; Telegram Desktop</span>
            </div>
            <span className="text-[10px] font-mono-cyber">View: Details</span>
          </div>

          {/* Files List Table */}
          <div className="p-3 bg-[#080C14] overflow-x-auto text-xs font-mono-cyber">
            <table className="w-full text-left">
              <thead>
                <tr className="text-cyber-muted border-b border-white/10 text-[10px]">
                  <th className="pb-2">Name</th>
                  <th className="pb-2">Date modified</th>
                  <th className="pb-2">Type</th>
                  <th className="pb-2">Size</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {data.files?.map((file: any, idx: number) => (
                  <tr key={idx} className={file.isSuspicious ? 'bg-red-500/10 text-white font-bold' : 'text-slate-300'}>
                    <td className="py-2.5 flex items-center gap-2">
                      {file.type.includes('Application') ? (
                        <FileCode className="w-4 h-4 text-cyber-danger shrink-0" />
                      ) : (
                        <FileText className="w-4 h-4 text-cyber-primary shrink-0" />
                      )}
                      <span>{file.name}</span>
                    </td>
                    <td className="py-2.5 text-cyber-muted text-[11px]">{file.date}</td>
                    <td className="py-2.5 text-[11px]">
                      <span className={file.isSuspicious ? 'text-cyber-danger' : 'text-cyber-muted'}>
                        {file.type}
                      </span>
                    </td>
                    <td className="py-2.5 text-cyber-muted text-[11px]">{file.size}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      );

    default:
      return null;
  }
}
