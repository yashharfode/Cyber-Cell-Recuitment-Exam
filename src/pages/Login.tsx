import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { mockCandidates } from '../data/mockCandidates';
import type { Candidate } from '../types';
import { Lock, User, Mail, Hash, ShieldAlert, ArrowLeft, KeyRound } from 'lucide-react';

export default function Login() {
  const navigate = useNavigate();
  const { setCandidate, setMode } = useStore();
  
  const [formData, setFormData] = useState({
    name: '',
    scholarNumber: '',
    email: '',
    password: ''
  });
  
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const cleanName = formData.name.trim();
    const cleanScholar = formData.scholarNumber.trim();
    const cleanEmail = formData.email.toLowerCase().trim();
    const cleanPassword = formData.password.trim();

    if (!cleanName || !cleanScholar || !cleanEmail || !cleanPassword) {
      setError('Please fill in all required fields (Name, Scholar Number, Email, and Password).');
      return;
    }

    // Check if matching mock candidate
    const candidate = mockCandidates.find(
      c => c.email.toLowerCase().trim() === cleanEmail &&
           c.scholarNumber.trim() === cleanScholar
    );

    if (candidate) {
      if (!candidate.enabled) {
        setError('This recruitment account is currently disabled. Please contact the Cyber Cell recruitment administrator.');
        return;
      }
      if (candidate.domain !== 'Technical') {
        setError('This assessment is strictly for the Technical Domain. Your registration is associated with another domain.');
        return;
      }
      if (candidate.password && candidate.password !== cleanPassword) {
        setError('Incorrect password. Please verify your credentials.');
        return;
      }

      setCandidate({
        ...candidate,
        name: cleanName || candidate.name
      });
      setMode('recruitment');
      navigate('/precheck');
    } else {
      // Dynamic candidate entry: allow any valid candidate taking the assessment to proceed
      const dynamicCandidate: Candidate = {
        id: `cand-${Date.now().toString(36)}`,
        name: cleanName,
        scholarNumber: cleanScholar,
        email: cleanEmail,
        password: cleanPassword,
        domain: 'Technical',
        enabled: true,
        status: 'IN_PROGRESS'
      };

      setCandidate(dynamicCandidate);
      setMode('recruitment');
      navigate('/precheck');
    }
  };

  const autoFillCandidate = (idx: number) => {
    const c = mockCandidates[idx];
    if (c) {
      setFormData({
        name: c.name,
        scholarNumber: c.scholarNumber,
        email: c.email,
        password: c.password || '123'
      });
      setError('');
    }
  };

  return (
    <div className="min-h-screen bg-[#080C14] text-slate-100 flex flex-col justify-center items-center p-4 md:p-8 font-sans">
      
      {/* Top back button */}
      <div className="w-full max-w-md mb-4 flex justify-between items-center text-xs">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-1.5 text-slate-400 hover:text-white transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Portal
        </button>
        <span className="text-slate-400 font-mono text-[11px] font-medium tracking-wide">CYBER CELL • SATI VIDISHA</span>
      </div>

      <div className="w-full max-w-md bg-[#0D1322] p-7 md:p-8 rounded-2xl border border-white/[0.1] shadow-2xl relative">
        <div className="text-center mb-6">
          <div className="w-11 h-11 bg-sky-500/10 border border-sky-500/20 rounded-xl mx-auto flex items-center justify-center mb-3 text-sky-400">
            <Lock className="w-5 h-5" />
          </div>
          <h2 className="text-xl md:text-2xl font-bold tracking-tight text-white uppercase">RECRUITMENT LOGIN</h2>
          <p className="text-xs text-slate-400 mt-1">
            Technical Domain • Round 1 Assessment Entry
          </p>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-300 text-xs flex items-start gap-2 leading-relaxed">
            <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5 text-red-400" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4 text-xs">
          <div>
            <label className="text-slate-300 block mb-1.5 font-medium text-xs">
              Enter your Name <span className="text-sky-400">*</span>
            </label>
            <div className="relative">
              <User className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
              <input
                required
                type="text"
                placeholder="Enter your Name"
                className="w-full bg-[#080C14] border border-white/[0.1] rounded-lg pl-10 pr-4 py-2.5 text-white placeholder:text-slate-500 outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-400/30 transition-all text-base sm:text-xs"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
          </div>

          <div>
            <label className="text-slate-300 block mb-1.5 font-medium text-xs">
              Enter Scholar Number <span className="text-sky-400">*</span>
            </label>
            <div className="relative">
              <Hash className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
              <input
                required
                type="text"
                placeholder="Enter your Scholar Number"
                className="w-full bg-[#080C14] border border-white/[0.1] rounded-lg pl-10 pr-4 py-2.5 text-white placeholder:text-slate-500 outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-400/30 transition-all text-base sm:text-xs"
                value={formData.scholarNumber}
                onChange={e => setFormData({ ...formData, scholarNumber: e.target.value })}
              />
            </div>
          </div>

          <div>
            <label className="text-slate-300 block mb-1.5 font-medium text-xs">
              Enter your Email <span className="text-sky-400">*</span>
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
              <input
                required
                type="email"
                placeholder="Enter your Email (e.g. name@example.com)"
                className="w-full bg-[#080C14] border border-white/[0.1] rounded-lg pl-10 pr-4 py-2.5 text-white placeholder:text-slate-500 outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-400/30 transition-all text-base sm:text-xs"
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
          </div>

          <div>
            <label className="text-slate-300 block mb-1.5 font-medium text-xs">
              Enter your Password <span className="text-sky-400">*</span>
            </label>
            <div className="relative">
              <KeyRound className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
              <input
                required
                type="password"
                placeholder="Enter your Password"
                className="w-full bg-[#080C14] border border-white/[0.1] rounded-lg pl-10 pr-4 py-2.5 text-white placeholder:text-slate-500 outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-400/30 transition-all text-base sm:text-xs"
                value={formData.password}
                onChange={e => setFormData({ ...formData, password: e.target.value })}
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-white hover:bg-slate-200 text-slate-950 font-semibold uppercase tracking-wider rounded-lg transition-all mt-6 cursor-pointer text-xs shadow-sm active:scale-[0.99]"
          >
            Authenticate & Proceed
          </button>
        </form>

        {/* Quick Testing Autofill Helpers */}
        <div className="mt-8 pt-4 border-t border-white/[0.08] text-center">
          <p className="text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-2">QUICK TEST ACCOUNTS:</p>
          <div className="flex gap-2 justify-center">
            <button
              type="button"
              onClick={() => autoFillCandidate(0)}
              className="text-[11px] px-3 py-1.5 rounded-lg bg-[#080C14] border border-white/[0.1] hover:border-white/30 text-slate-300 hover:text-white transition-colors cursor-pointer"
            >
              Candidate 01 (12345)
            </button>
            <button
              type="button"
              onClick={() => autoFillCandidate(1)}
              className="text-[11px] px-3 py-1.5 rounded-lg bg-[#080C14] border border-white/[0.1] hover:border-white/30 text-slate-300 hover:text-white transition-colors cursor-pointer"
            >
              Candidate 02 (12346)
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
