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
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm mb-4 font-sans text-slate-800">
          {/* Email Client Header Bar */}
          <div className="bg-slate-50 px-4 py-2.5 border-b border-slate-200 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-sky-600" />
              <span className="font-semibold text-slate-900">SATI Webmail Portal • Inbox</span>
            </div>
            <span className="text-[10px] bg-red-50 text-red-700 px-2 py-0.5 rounded border border-red-200 font-mono font-medium">
              EXTERNAL SENDER
            </span>
          </div>

          {/* Email Metadata */}
          <div className="p-4 bg-white border-b border-slate-200 text-xs space-y-1.5 font-mono">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
              <span className="text-slate-900 font-bold text-sm">{data.subject}</span>
              <span className="text-slate-500 text-[11px]">{data.date || 'Today, 11:32 PM'}</span>
            </div>
            <div className="text-slate-600">
              <span className="font-semibold text-slate-800">From: </span>
              <span className="text-slate-900">{data.senderName} </span>
              <span className="text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200 text-[11px]">
                &lt;{data.senderEmail}&gt;
              </span>
            </div>
            <div className="text-slate-600">
              <span className="font-semibold text-slate-800">To: </span>
              <span>{data.recipient || 'student@satiengg.in'}</span>
            </div>
          </div>

          {/* Email Body */}
          <div className="p-5 bg-white text-xs space-y-3 leading-relaxed">
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2.5 text-red-700">
              <AlertTriangle className="w-5 h-5 shrink-0" />
              <span className="font-semibold">{data.alertBanner || 'CRITICAL NOTICE: IMMEDIATE ACTION REQUIRED'}</span>
            </div>

            <p className="whitespace-pre-line text-slate-700">{data.bodyText}</p>

            {data.buttonText && (
              <div className="py-2 text-center">
                <span className="inline-block px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg shadow-sm transition-all text-xs cursor-pointer">
                  {data.buttonText}
                </span>
                {data.linkUrl && (
                  <p className="text-[10px] text-slate-500 mt-2 font-mono">
                    Link points to: <span className="text-amber-700 underline">{data.linkUrl}</span>
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      );

    case 'sms':
      return (
        <div className="max-w-md mx-auto bg-slate-50 border border-slate-200 rounded-2xl overflow-hidden shadow-sm mb-4 font-sans text-slate-800">
          {/* Smartphone Top Notch Bar */}
          <div className="bg-slate-100 px-4 py-2.5 border-b border-slate-200 flex items-center justify-between text-xs text-slate-600">
            <div className="flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-sky-600" />
              <span className="font-semibold text-slate-900">Messages</span>
            </div>
            <span className="text-[10px] font-mono">SIM 1 • Airtel 5G</span>
          </div>

          <div className="p-4 text-center border-b border-slate-200 bg-white">
            <div className="w-10 h-10 rounded-full bg-sky-50 border border-sky-200 flex items-center justify-center mx-auto text-sky-700 font-bold text-sm">
              ?
            </div>
            <div className="text-xs font-bold text-slate-900 mt-1">{data.senderNumber}</div>
            <div className="text-[10px] text-slate-500">Not in your contacts</div>
          </div>

          {/* SMS Chat Bubble */}
          <div className="p-5 space-y-3 bg-slate-50">
            <div className="max-w-[85%] bg-white border border-slate-200 p-3.5 rounded-2xl rounded-tl-sm text-xs text-slate-800 shadow-xs leading-relaxed space-y-2">
              <p>{data.message}</p>
              {data.link && (
                <div className="p-2 bg-amber-50 border border-amber-200 rounded text-amber-800 text-[11px] font-mono break-all">
                  🔗 {data.link}
                </div>
              )}
              <div className="text-[9px] text-right text-slate-400 font-mono">
                {data.time || '10:45 AM'} • SMS
              </div>
            </div>
          </div>
        </div>
      );

    case 'wifi':
      return (
        <div className="max-w-md mx-auto bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm mb-4 font-sans text-slate-800">
          <div className="bg-slate-50 px-4 py-3 border-b border-slate-200 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <Wifi className="w-4 h-4 text-sky-600" />
              <span className="font-semibold text-slate-900">Wi-Fi Networks Available</span>
            </div>
            <span className="text-emerald-600 text-[11px] font-bold">Scanning...</span>
          </div>

          <div className="p-4 space-y-2 bg-white">
            {data.networks?.map((net: any, idx: number) => (
              <div 
                key={idx}
                className={`p-3 rounded-lg border flex items-center justify-between text-xs ${
                  net.highlight 
                    ? 'border-amber-300 bg-amber-50/70 text-slate-900' 
                    : 'border-slate-200 bg-slate-50/50 text-slate-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  {net.isSecure ? (
                    <Lock className="w-4 h-4 text-emerald-600 shrink-0" />
                  ) : (
                    <Unlock className="w-4 h-4 text-red-600 shrink-0 animate-pulse" />
                  )}
                  <div>
                    <div className="font-bold text-slate-900 flex items-center gap-1.5">
                      <span>{net.ssid}</span>
                      {net.highlight && (
                        <span className="text-[9px] bg-red-100 text-red-700 border border-red-200 font-semibold px-1.5 rounded">
                          SUSPICIOUS
                        </span>
                      )}
                    </div>
                    <div className="text-[10px] text-slate-500 mt-0.5">
                      {net.securityType} • Signal: {net.signal || 'Strong'}
                    </div>
                  </div>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 border border-slate-200 rounded bg-white text-slate-600">
                  {net.status || 'Available'}
                </span>
              </div>
            ))}
          </div>
        </div>
      );

    case 'upi':
      return (
        <div className="max-w-md mx-auto bg-white border border-slate-200 rounded-xl p-5 shadow-sm mb-4 font-sans text-center text-slate-800">
          <div className="text-xs uppercase tracking-wider text-sky-700 font-bold mb-3 flex items-center justify-center gap-2">
            <QrCode className="w-5 h-5 text-sky-600" />
            CANTEEN UPI PAYMENT COUNTER
          </div>

          {/* Simulated Physical Stand with Sticker Overlay */}
          <div className="relative inline-block p-4 bg-slate-50 rounded-xl border border-slate-200 shadow-inner">
            <div className="w-44 h-44 bg-white flex flex-col items-center justify-center border-2 border-dashed border-slate-300 p-2 rounded-lg">
              <QrCode className="w-28 h-28 text-slate-800" />
              <span className="text-[10px] font-bold text-slate-700 mt-1 font-mono">
                BHIM UPI • GPay • Paytm
              </span>
            </div>

            {/* Peeled Sticker Overlay Visual */}
            <div className="absolute -bottom-2 -right-2 bg-amber-100 text-amber-900 px-3 py-1 text-[11px] font-bold font-mono shadow-sm border border-amber-300 rotate-[-4deg] rounded">
              ⚠️ Counterfeit Sticker Pasted Over Board!
            </div>
          </div>

          <div className="mt-4 p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono text-left space-y-1">
            <div className="text-slate-600">
              Actual Canteen Account: <span className="text-emerald-700 font-bold">{data.realAccount}</span>
            </div>
            <div className="text-slate-600">
              Scanned Sticker Receiver: <span className="text-red-600 font-bold">{data.fakeAccount}</span>
            </div>
          </div>
        </div>
      );

    case 'explorer':
      return (
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm mb-4 font-sans text-slate-800">
          {/* Windows Explorer Title Bar */}
          <div className="bg-slate-50 px-4 py-2 border-b border-slate-200 flex items-center justify-between text-xs text-slate-600">
            <div className="flex items-center gap-2">
              <Folder className="w-4 h-4 text-amber-500" />
              <span className="text-slate-900 font-semibold">Downloads &gt; Telegram Desktop</span>
            </div>
            <span className="text-[10px] font-mono">View: Details</span>
          </div>

          {/* Files List Table */}
          <div className="p-3 bg-white overflow-x-auto text-xs font-mono">
            <table className="w-full text-left">
              <thead>
                <tr className="text-slate-500 border-b border-slate-200 text-[10px]">
                  <th className="pb-2">Name</th>
                  <th className="pb-2">Date modified</th>
                  <th className="pb-2">Type</th>
                  <th className="pb-2">Size</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {data.files?.map((file: any, idx: number) => (
                  <tr key={idx} className={file.isSuspicious ? 'bg-red-50 text-red-900 font-bold' : 'text-slate-700'}>
                    <td className="py-2.5 flex items-center gap-2">
                      {file.type.includes('Application') ? (
                        <FileCode className="w-4 h-4 text-red-600 shrink-0" />
                      ) : (
                        <FileText className="w-4 h-4 text-sky-600 shrink-0" />
                      )}
                      <span>{file.name}</span>
                    </td>
                    <td className="py-2.5 text-slate-500 text-[11px]">{file.date}</td>
                    <td className="py-2.5 text-[11px]">
                      <span className={file.isSuspicious ? 'text-red-700 font-semibold' : 'text-slate-500'}>
                        {file.type}
                      </span>
                    </td>
                    <td className="py-2.5 text-slate-500 text-[11px]">{file.size}</td>
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
