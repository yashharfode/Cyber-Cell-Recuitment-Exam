import { useState } from 'react';
import { Mail, ShieldCheck, ShieldAlert, CheckCircle2 } from 'lucide-react';

export interface PhishingEmail {
  id: string;
  senderName: string;
  senderEmail: string;
  subject: string;
  date: string;
  bodySnippet: string;
  isPhishing: boolean;
  redFlags?: {
    id: string;
    label: string;
    description: string;
  }[];
}

interface PhishingHunterGameProps {
  config?: {
    emails?: PhishingEmail[];
  };
  onSolve?: (answer: any, isCorrect: boolean) => void;
  disabled?: boolean;
}

const DEFAULT_EMAILS: PhishingEmail[] = [
  {
    id: 'email-1',
    senderName: 'SATI Academic Registrar',
    senderEmail: 'registrar@satiengg.in',
    subject: 'Even Semester 2026 Examination Schedule Published',
    date: 'Today, 09:15 AM',
    bodySnippet: 'Dear Students, the official schedule for upcoming technical end-term evaluations has been uploaded to the student ERP portal.',
    isPhishing: false
  },
  {
    id: 'email-2',
    senderName: 'PayPal Security Team',
    senderEmail: 'security@paypa1-support.com',
    subject: 'URGENT: Unauthorized Transaction of $849.00 Detected!',
    date: 'Today, 03:42 AM',
    bodySnippet: 'CRITICAL ALERT! An unauthorized transaction was triggered from Russian Federation. Verify your credentials within 10 MINUTES or your account will be permanently frozen! Click below to confirm identity.',
    isPhishing: true,
    redFlags: [
      { id: 'flag-typosquat', label: 'Typosquatted Domain (paypa1 instead of paypal)', description: 'The sender email address uses "paypa1-support.com" substituting digit "1" for letter "l".' },
      { id: 'flag-urgency', label: 'Artificial Urgency & Threat (10 Minutes deadline)', description: 'Attackers create panic through immediate account closure threats to bypass analytical reasoning.' },
      { id: 'flag-ip-link', label: 'Insecure IP Link (http://185.120.44.12/verify)', description: 'Legitimate institutions direct to official HTTPS domains, never unencrypted raw IP addresses.' }
    ]
  },
  {
    id: 'email-3',
    senderName: 'SATI Cyber Cell Leads',
    senderEmail: 'leads@cybercellsati.in',
    subject: 'Operation Zero-Day: Round 01 Technical Assessment Details',
    date: 'Yesterday, 04:30 PM',
    bodySnippet: 'Recruitment shortlisted candidates are invited to attend the interactive zero-day defense challenge at SATI Campus Computer Center.',
    isPhishing: false
  }
];

export default function PhishingHunterGame({ config, onSolve, disabled }: PhishingHunterGameProps) {
  const emails = config?.emails || DEFAULT_EMAILS;

  // Track status for each email: 'SAFE' | 'SUSPICIOUS' | null
  const [triageStatus, setTriageStatus] = useState<Record<string, 'SAFE' | 'SUSPICIOUS'>>({});
  const [isEvaluated, setIsEvaluated] = useState<boolean>(false);

  const handleTriage = (emailId: string, status: 'SAFE' | 'SUSPICIOUS') => {
    if (disabled || isEvaluated) return;
    setTriageStatus(prev => ({ ...prev, [emailId]: status }));
  };

  const handleConfirmTriage = () => {
    if (disabled || isEvaluated) return;
    const allCorrect = emails.every(e => {
      const expected = e.isPhishing ? 'SUSPICIOUS' : 'SAFE';
      return triageStatus[e.id] === expected;
    });

    setIsEvaluated(true);
    if (onSolve) {
      onSolve(triageStatus, allCorrect);
    }
  };

  return (
    <div className="bg-[#080C14] border border-cyber-primary/30 p-5 rounded-lg font-mono-cyber">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 mb-4 border-b border-cyber-border">
        <div>
          <span className="text-[10px] text-cyber-danger uppercase tracking-widest px-2 py-0.5 bg-cyber-danger/10 border border-cyber-danger/30 rounded flex items-center gap-1.5 w-max">
            <Mail className="w-3 h-3" /> PHISHING HUNTER & TRIAGE LAB
          </span>
          <h3 className="text-base font-bold text-white mt-1">INSPECT INCOMING EMAILS & FLAG DECEPTION</h3>
          <p className="text-xs text-cyber-muted mt-0.5">
            Analyze each message carefully. Categorize each email as SAFE or SUSPICIOUS based on sender domain, urgency, and content.
          </p>
        </div>
      </div>

      {/* Email Inbox Cards */}
      <div className="space-y-3 my-4">
        {emails.map((email) => {
          const currentTriage = triageStatus[email.id];
          const isMarkedSuspicious = currentTriage === 'SUSPICIOUS';
          const isMarkedSafe = currentTriage === 'SAFE';

          return (
            <div
              key={email.id}
              className={`p-4 rounded-lg border transition-all ${
                isMarkedSuspicious
                  ? 'border-cyber-danger bg-red-950/20'
                  : isMarkedSafe
                  ? 'border-cyber-success bg-cyber-success/5'
                  : 'border-cyber-border bg-[#0D131F]'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/5 pb-2.5 mb-2.5">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white">{email.senderName}</span>
                    <span className="text-[11px] font-mono px-1.5 py-0.5 rounded border bg-white/5 text-cyber-muted border-white/10">
                      &lt;{email.senderEmail}&gt;
                    </span>
                  </div>
                  <h4 className="text-xs text-cyber-primary font-semibold mt-1">{email.subject}</h4>
                </div>

                {/* Triage Action Buttons */}
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => handleTriage(email.id, 'SAFE')}
                    disabled={disabled || isEvaluated}
                    className={`px-3 py-1.5 rounded text-xs font-bold uppercase transition-all flex items-center gap-1.5 border ${
                      isMarkedSafe
                        ? 'bg-cyber-success text-black border-cyber-success shadow-[0_0_10px_rgba(0,255,136,0.3)]'
                        : 'border-white/10 text-cyber-muted hover:text-white hover:border-cyber-success/50'
                    }`}
                  >
                    <ShieldCheck className="w-3.5 h-3.5" /> Mark Safe
                  </button>
                  <button
                    onClick={() => handleTriage(email.id, 'SUSPICIOUS')}
                    disabled={disabled || isEvaluated}
                    className={`px-3 py-1.5 rounded text-xs font-bold uppercase transition-all flex items-center gap-1.5 border ${
                      isMarkedSuspicious
                        ? 'bg-cyber-danger text-white border-cyber-danger shadow-[0_0_10px_rgba(255,51,102,0.3)]'
                        : 'border-white/10 text-cyber-muted hover:text-white hover:border-cyber-danger/50'
                    }`}
                  >
                    <ShieldAlert className="w-3.5 h-3.5" /> Suspicious
                  </button>
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">{email.bodySnippet}</p>
            </div>
          );
        })}
      </div>

      {/* Triage Confirmation Footer */}
      <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
        <span className="text-xs text-cyber-muted">
          {Object.keys(triageStatus).length} of {emails.length} emails categorized
        </span>
        <button
          onClick={handleConfirmTriage}
          disabled={disabled || isEvaluated || Object.keys(triageStatus).length < emails.length}
          className="w-full sm:w-auto px-5 py-2.5 bg-cyber-primary hover:bg-cyber-primary/90 text-black font-bold text-xs uppercase tracking-wider rounded disabled:opacity-30 disabled:pointer-events-none transition-all shadow-[0_0_15px_rgba(0,255,204,0.2)]"
        >
          {isEvaluated ? 'Decision Evaluated' : 'Confirm Email Triage'}
        </button>
      </div>

      {/* Outcome Banner */}
      {isEvaluated && (
        <div className={`mt-4 p-3 rounded border text-xs flex items-center justify-between ${
          emails.every(e => (e.isPhishing ? 'SUSPICIOUS' : 'SAFE') === triageStatus[e.id])
            ? 'bg-cyber-success/20 border-cyber-success/40 text-cyber-success'
            : 'bg-red-950/20 border-red-500/30 text-red-400'
        }`}>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span className="font-bold">
              {emails.every(e => (e.isPhishing ? 'SUSPICIOUS' : 'SAFE') === triageStatus[e.id])
                ? 'PHISHING DEFENSE VALIDATED: Deception vector successfully neutralized!'
                : 'ANALYSIS FLAW: One or more emails were misclassified.'}
            </span>
          </div>
          {emails.every(e => (e.isPhishing ? 'SUSPICIOUS' : 'SAFE') === triageStatus[e.id]) && (
            <span className="font-bold tracking-widest text-[11px] uppercase">+100 XP</span>
          )}
        </div>
      )}
    </div>
  );
}
