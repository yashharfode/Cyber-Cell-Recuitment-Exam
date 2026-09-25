import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Shield, 
  Users, 
  CheckCircle, 
  AlertTriangle, 
  Ban, 
  RefreshCw, 
  Search, 
  Eye, 
  ArrowLeft,
  UserCheck,
  Send,
  X
} from 'lucide-react';
import { saveAuditLog, saveVolunteerReport } from '../storage/indexedDb';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [candidatesList, setCandidatesList] = useState([
    {
      id: 'cand-001',
      name: 'Candidate One',
      scholarNumber: '12345',
      domain: 'Technical',
      score: 1420,
      xp: 1850,
      accuracy: 92,
      time: '32:15',
      status: 'COMPLETED',
      redFlags: 1,
      primaryStrength: 'Cybersecurity & Forensics'
    },
    {
      id: 'cand-002',
      name: 'Candidate Two',
      scholarNumber: '12346',
      domain: 'Technical',
      score: 1180,
      xp: 1450,
      accuracy: 84,
      time: '38:40',
      status: 'COMPLETED',
      redFlags: 3,
      primaryStrength: 'Networking & Protocols'
    },
    {
      id: 'cand-003',
      name: 'Rohan Sharma',
      scholarNumber: '12350',
      domain: 'Technical',
      score: 1560,
      xp: 2100,
      accuracy: 96,
      time: '28:10',
      status: 'COMPLETED',
      redFlags: 0,
      primaryStrength: 'Code & Debugging'
    },
    {
      id: 'cand-004',
      name: 'Aditi Verma',
      scholarNumber: '12355',
      domain: 'Technical',
      score: 890,
      xp: 1100,
      accuracy: 72,
      time: '41:20',
      status: 'FLAGGED',
      redFlags: 5,
      primaryStrength: 'Logic & Aptitude'
    }
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [selectedCandidate, setSelectedCandidate] = useState<any | null>(null);
  const [volunteerReportTarget, setVolunteerReportTarget] = useState<any | null>(null);
  const [reportType, setReportType] = useState('MOBILE_PHONE');
  const [reportNote, setReportNote] = useState('');
  const [leaderboardLive, setLeaderboardLive] = useState(false);
  const [actionSuccessMsg, setActionSuccessMsg] = useState('');

  const showNotification = (msg: string) => {
    setActionSuccessMsg(msg);
    setTimeout(() => setActionSuccessMsg(''), 3000);
  };

  const handleDisqualify = (candId: string) => {
    setCandidatesList(prev => prev.map(c => c.id === candId ? { ...c, status: 'DISQUALIFIED' } : c));
    saveAuditLog({
      id: `audit-${Date.now()}`,
      adminId: 'ADMIN-01',
      action: 'DISQUALIFY',
      candidateId: candId,
      timestamp: new Date().toISOString(),
      reason: 'Administrative disqualification for recruitment protocol breach'
    }).catch(console.error);
    showNotification('Candidate status updated to DISQUALIFIED.');
  };

  const handleGrantReplay = (candId: string) => {
    setCandidatesList(prev => prev.map(c => c.id === candId ? { ...c, status: 'IN_PROGRESS', redFlags: 0 } : c));
    saveAuditLog({
      id: `audit-${Date.now()}`,
      adminId: 'ADMIN-01',
      action: 'GRANT_REPLAY',
      candidateId: candId,
      timestamp: new Date().toISOString(),
      reason: 'Exceptional replay authorized by recruitment committee'
    }).catch(console.error);
    showNotification('Exceptional replay clearance granted.');
  };

  const handleBlacklist = (candId: string) => {
    setCandidatesList(prev => prev.map(c => c.id === candId ? { ...c, status: 'BLACKLISTED' } : c));
    saveAuditLog({
      id: `audit-${Date.now()}`,
      adminId: 'ADMIN-01',
      action: 'BLACKLIST',
      candidateId: candId,
      timestamp: new Date().toISOString(),
      reason: 'Confirmed unfair practices / blacklisted for 2026 cycle'
    }).catch(console.error);
    showNotification('Candidate moved to BLACKLISTED.');
  };

  const submitVolunteerReport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!volunteerReportTarget) return;

    saveVolunteerReport({
      id: `vr-${Date.now()}`,
      candidateId: volunteerReportTarget.id,
      candidateName: volunteerReportTarget.name,
      scholarNumber: volunteerReportTarget.scholarNumber,
      volunteerId: 'VOLUNTEER-DESK-01',
      timestamp: new Date().toISOString(),
      type: reportType as any,
      note: reportNote,
      status: 'pending'
    }).catch(console.error);

    setCandidatesList(prev => prev.map(c => 
      c.id === volunteerReportTarget.id ? { ...c, redFlags: c.redFlags + 2, status: 'FLAGGED' } : c
    ));

    showNotification(`Volunteer report submitted for ${volunteerReportTarget.name}`);
    setVolunteerReportTarget(null);
    setReportNote('');
  };

  const filteredCandidates = candidatesList.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          c.scholarNumber.includes(searchQuery);
    if (filterStatus === 'ALL') return matchesSearch;
    if (filterStatus === 'FLAGGED') return matchesSearch && c.redFlags > 0;
    return matchesSearch && c.status === filterStatus;
  });

  return (
    <div className="min-h-screen bg-[#05070D] text-cyber-text p-6 md:p-10 font-mono-cyber">
      
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-cyber-border pb-6 mb-8 gap-4">
        <div>
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-1.5 text-xs text-cyber-muted hover:text-cyber-primary transition-colors mb-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Exit Admin Portal
          </button>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-cyber-primary/10 border border-cyber-primary/30">
              <Shield className="w-6 h-6 text-cyber-primary" />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight uppercase">
                CYBER CELL RECRUITMENT CONTROL
              </h1>
              <p className="text-xs text-cyber-muted">
                SATI VIDISHA • ROUND 1 TECHNICAL DOMAIN OVERSIGHT
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 p-2 bg-cyber-panel border border-cyber-border text-xs">
            <span className="text-cyber-muted">LIVE LEADERBOARD:</span>
            <button
              onClick={() => {
                setLeaderboardLive(!leaderboardLive);
                showNotification(`Leaderboard visibility set to ${!leaderboardLive ? 'LIVE' : 'HIDDEN'}`);
              }}
              className={`px-3 py-1 font-bold text-xs uppercase transition-all ${
                leaderboardLive ? 'bg-cyber-success text-black' : 'bg-cyber-panel-secondary text-cyber-muted border border-cyber-border'
              }`}
            >
              {leaderboardLive ? 'PUBLISHED' : 'HIDDEN'}
            </button>
          </div>
        </div>
      </div>

      {actionSuccessMsg && (
        <div className="mb-6 p-3 bg-cyber-primary/15 border border-cyber-primary text-cyber-primary text-xs flex items-center gap-2 animate-fadeIn">
          <CheckCircle className="w-4 h-4" />
          <span>{actionSuccessMsg}</span>
        </div>
      )}

      {/* Analytics Summary Cards (Section 70) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="cyber-panel p-4 border border-cyber-border">
          <div className="flex justify-between items-center text-xs text-cyber-muted uppercase">
            <span>REGISTERED CANDIDATES</span>
            <Users className="w-4 h-4 text-cyber-primary" />
          </div>
          <div className="text-2xl font-bold text-white mt-1">104</div>
          <div className="text-[10px] text-cyber-muted mt-0.5">Round 1 Technical Cohort</div>
        </div>

        <div className="cyber-panel p-4 border border-cyber-border">
          <div className="flex justify-between items-center text-xs text-cyber-muted uppercase">
            <span>COMPLETED ATTEMPTS</span>
            <CheckCircle className="w-4 h-4 text-cyber-success" />
          </div>
          <div className="text-2xl font-bold text-cyber-success mt-1">87</div>
          <div className="text-[10px] text-cyber-muted mt-0.5">Avg Score: 1,280 pts</div>
        </div>

        <div className="cyber-panel p-4 border border-cyber-border">
          <div className="flex justify-between items-center text-xs text-cyber-muted uppercase">
            <span>FLAGGED ANOMALIES</span>
            <AlertTriangle className="w-4 h-4 text-cyber-warning" />
          </div>
          <div className="text-2xl font-bold text-cyber-warning mt-1">6</div>
          <div className="text-[10px] text-cyber-muted mt-0.5">Fullscreen & Tab switches</div>
        </div>

        <div className="cyber-panel p-4 border border-cyber-border">
          <div className="flex justify-between items-center text-xs text-cyber-muted uppercase">
            <span>DISQUALIFIED</span>
            <Ban className="w-4 h-4 text-cyber-danger" />
          </div>
          <div className="text-2xl font-bold text-cyber-danger mt-1">2</div>
          <div className="text-[10px] text-cyber-muted mt-0.5">Disciplinary actioned</div>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="cyber-panel p-4 border border-cyber-border mb-6 flex flex-col md:flex-row justify-between items-center gap-4 text-xs">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-cyber-muted absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search candidate or scholar..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full bg-[#05070D] border border-cyber-border pl-9 pr-3 py-2 text-white outline-none focus:border-cyber-primary"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto">
          {['ALL', 'COMPLETED', 'FLAGGED', 'DISQUALIFIED'].map(st => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-3 py-1.5 border transition-all ${
                filterStatus === st 
                  ? 'border-cyber-primary bg-cyber-primary/10 text-cyber-primary font-bold'
                  : 'border-cyber-border text-cyber-muted hover:text-white'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Candidates Table (Section 72) */}
      <div className="cyber-panel border border-cyber-border overflow-x-auto">
        <table className="w-full text-left text-xs font-mono-cyber">
          <thead className="bg-cyber-panel-secondary border-b border-cyber-border text-cyber-muted uppercase text-[11px]">
            <tr>
              <th className="p-4">Candidate</th>
              <th className="p-4">Scholar No</th>
              <th className="p-4">Score</th>
              <th className="p-4">XP</th>
              <th className="p-4">Accuracy</th>
              <th className="p-4">Red Flags</th>
              <th className="p-4">Strength Profile</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-cyber-border">
            {filteredCandidates.map((cand, idx) => (
              <tr key={cand.id} className="hover:bg-white/5 transition-colors">
                <td className="p-4 font-bold text-white flex items-center gap-2">
                  <span className="text-[10px] text-cyber-muted">#{idx + 1}</span>
                  <span>{cand.name}</span>
                </td>
                <td className="p-4 text-cyber-primary">{cand.scholarNumber}</td>
                <td className="p-4 font-bold text-white">{cand.score}</td>
                <td className="p-4 text-cyber-secondary font-bold">{cand.xp}</td>
                <td className="p-4 text-cyber-success">{cand.accuracy}%</td>
                <td className="p-4">
                  <span className={`px-2 py-0.5 border ${
                    cand.redFlags === 0 
                      ? 'border-cyber-border text-cyber-muted' 
                      : cand.redFlags < 3 
                      ? 'border-cyber-warning/40 bg-cyber-warning/10 text-cyber-warning' 
                      : 'border-cyber-danger/40 bg-cyber-danger/10 text-cyber-danger font-bold'
                  }`}>
                    {cand.redFlags} Flags
                  </span>
                </td>
                <td className="p-4 text-cyber-muted">{cand.primaryStrength}</td>
                <td className="p-4">
                  <span className={`text-[10px] px-2 py-0.5 font-bold uppercase ${
                    cand.status === 'COMPLETED' ? 'text-cyber-success bg-cyber-success/10 border border-cyber-success/30' :
                    cand.status === 'FLAGGED' ? 'text-cyber-warning bg-cyber-warning/10 border border-cyber-warning/30' :
                    cand.status === 'DISQUALIFIED' ? 'text-cyber-danger bg-cyber-danger/10 border border-cyber-danger/30' :
                    'text-cyber-muted bg-white/5'
                  }`}>
                    {cand.status}
                  </span>
                </td>
                <td className="p-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => setSelectedCandidate(cand)}
                      title="View Telemetry Evidence"
                      className="p-1.5 border border-cyber-border hover:border-cyber-primary text-cyber-muted hover:text-cyber-primary"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setVolunteerReportTarget(cand)}
                      title="Volunteer Incident Report"
                      className="p-1.5 border border-cyber-border hover:border-cyber-warning text-cyber-muted hover:text-cyber-warning"
                    >
                      <AlertTriangle className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleGrantReplay(cand.id)}
                      title="Grant Exceptional Replay"
                      className="p-1.5 border border-cyber-border hover:border-cyber-primary text-cyber-muted hover:text-cyber-primary"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                    </button>
                    {cand.status !== 'DISQUALIFIED' && (
                      <button
                        onClick={() => handleDisqualify(cand.id)}
                        title="Disqualify Candidate"
                        className="p-1.5 border border-cyber-border hover:border-cyber-danger text-cyber-muted hover:text-cyber-danger"
                      >
                        <Ban className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Candidate Detail Modal (Section 73) */}
      {selectedCandidate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4">
          <div className="w-full max-w-2xl cyber-panel p-6 border border-cyber-primary/40 relative max-h-[85vh] overflow-y-auto">
            <button
              onClick={() => setSelectedCandidate(null)}
              className="absolute top-4 right-4 text-cyber-muted hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-white uppercase flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-cyber-primary" />
              CANDIDATE TELEMETRY EVIDENCE DOSSIER
            </h3>
            <p className="text-xs text-cyber-primary mt-0.5">
              {selectedCandidate.name} • SCHOLAR: {selectedCandidate.scholarNumber}
            </p>

            <div className="grid grid-cols-2 gap-4 my-6 text-xs">
              <div className="p-3 bg-cyber-panel-secondary border border-cyber-border">
                <span className="text-cyber-muted block">FINAL SCORE / XP</span>
                <span className="text-base font-bold text-cyber-primary mt-1 block">
                  {selectedCandidate.score} PTS / {selectedCandidate.xp} XP
                </span>
              </div>
              <div className="p-3 bg-cyber-panel-secondary border border-cyber-border">
                <span className="text-cyber-muted block">INTEGRITY FLAGS</span>
                <span className="text-base font-bold text-cyber-warning mt-1 block">
                  {selectedCandidate.redFlags} Suspicious Browser Events
                </span>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <h4 className="text-white font-bold uppercase tracking-wider">Recorded Session Telemetry:</h4>
              <div className="p-3 bg-black border border-cyber-border text-cyber-muted space-y-1.5 leading-relaxed">
                <p>• Pre-check camera snapshot: <span className="text-cyber-success">VERIFIED & COMPLIANT</span></p>
                <p>• Fullscreen adherence: <span className="text-white">Active (Exited {selectedCandidate.redFlags} times)</span></p>
                <p>• Primary Skill Affinity: <span className="text-cyber-primary">{selectedCandidate.primaryStrength}</span></p>
                <p>• Assessment duration: <span className="text-white">{selectedCandidate.time} mins</span></p>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-cyber-border">
              <button
                onClick={() => handleBlacklist(selectedCandidate.id)}
                className="px-4 py-2 border border-cyber-danger text-cyber-danger text-xs font-bold hover:bg-cyber-danger hover:text-black transition-all"
              >
                BLACKLIST CANDIDATE
              </button>
              <button
                onClick={() => setSelectedCandidate(null)}
                className="px-4 py-2 bg-cyber-panel-secondary border border-cyber-border text-white text-xs hover:border-cyber-primary transition-all"
              >
                CLOSE DOSSIER
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Volunteer Incident Report Modal (Section 16, 58) */}
      {volunteerReportTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg cyber-panel p-6 border border-cyber-warning/50 relative">
            <button
              onClick={() => setVolunteerReportTarget(null)}
              className="absolute top-4 right-4 text-cyber-muted hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-base font-bold text-cyber-warning uppercase flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-cyber-warning" />
              VOLUNTEER INCIDENT REPORT
            </h3>
            <p className="text-xs text-cyber-muted mt-1">
              Filing observation for: <span className="text-white font-bold">{volunteerReportTarget.name} ({volunteerReportTarget.scholarNumber})</span>
            </p>

            <form onSubmit={submitVolunteerReport} className="mt-4 space-y-4 text-xs">
              <div>
                <label className="text-cyber-muted block mb-1 uppercase">INCIDENT CATEGORY</label>
                <select
                  value={reportType}
                  onChange={e => setReportType(e.target.value)}
                  className="w-full bg-[#05070D] border border-cyber-border p-2.5 text-white outline-none focus:border-cyber-warning"
                >
                  <option value="MOBILE_PHONE">Mobile Phone Observed</option>
                  <option value="ANOTHER_DEVICE">Secondary Device Active</option>
                  <option value="DISCUSSION">Candidate Discussing Answers</option>
                  <option value="OUTSIDE_HELP">Receiving Outside Help</option>
                  <option value="SUSPICIOUS_BEHAVIOR">Anomalous / Suspicious Behavior</option>
                  <option value="OTHER">Other Protocol Breach</option>
                </select>
              </div>

              <div>
                <label className="text-cyber-muted block mb-1 uppercase">OBSERVATION NOTE</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Detail observed activity, time, and desk number..."
                  value={reportNote}
                  onChange={e => setReportNote(e.target.value)}
                  className="w-full bg-[#05070D] border border-cyber-border p-2.5 text-white outline-none focus:border-cyber-warning"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setVolunteerReportTarget(null)}
                  className="px-4 py-2 border border-cyber-border text-cyber-muted hover:text-white"
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-cyber-warning text-black font-bold uppercase tracking-wider hover:bg-white transition-all flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  SUBMIT REPORT
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
