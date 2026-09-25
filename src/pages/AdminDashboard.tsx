import { useState, useEffect, useMemo, useCallback } from 'react';
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
  X,
  Download,
  Trash2,
  RotateCcw,
  Camera,
  Activity,
  Award
} from 'lucide-react';
import { 
  getAllAttempts, 
  getAllPhotos, 
  getAllRedFlags, 
  updateAttemptStatus, 
  deleteAttempt, 
  resetCandidateAttempt, 
  seedInitialDataIfEmpty,
  saveAuditLog, 
  saveVolunteerReport,
  type Attempt,
  type CandidatePhoto,
  type RedFlagEvent
} from '../storage/indexedDb';

export default function AdminDashboard() {
  const navigate = useNavigate();

  const [attempts, setAttempts] = useState<Attempt[]>([]);
  const [photos, setPhotos] = useState<CandidatePhoto[]>([]);
  const [redFlags, setRedFlags] = useState<RedFlagEvent[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [selectedCandidate, setSelectedCandidate] = useState<Attempt | null>(null);
  const [volunteerReportTarget, setVolunteerReportTarget] = useState<Attempt | null>(null);
  const [reportType, setReportType] = useState('MOBILE_PHONE');
  const [reportNote, setReportNote] = useState('');
  const [actionSuccessMsg, setActionSuccessMsg] = useState('');

  const showNotification = (msg: string) => {
    setActionSuccessMsg(msg);
    setTimeout(() => setActionSuccessMsg(''), 3500);
  };

  const loadData = useCallback(async (isInitial = false) => {
    if (isInitial) setIsLoading(true);
    else setIsRefreshing(true);
    try {
      await seedInitialDataIfEmpty();
      const [atts, pts, flags] = await Promise.all([
        getAllAttempts(),
        getAllPhotos(),
        getAllRedFlags()
      ]);
      setAttempts(atts);
      setPhotos(pts);
      setRedFlags(flags);
    } catch (err) {
      console.error('Error loading admin dashboard live data:', err);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadData(true);
    // Poll live data every 6 seconds to reflect active exam candidates
    const interval = setInterval(() => {
      loadData(false);
    }, 6000);
    return () => clearInterval(interval);
  }, [loadData]);

  // Photo map candidateId -> dataUrl
  const photoMap = useMemo(() => {
    const map: Record<string, string> = {};
    photos.forEach(p => {
      if (p.dataUrl && (!map[p.candidateId] || new Date(p.capturedAt).getTime() > 0)) {
        map[p.candidateId] = p.dataUrl;
      }
    });
    return map;
  }, [photos]);

  // Red flags map attemptId -> RedFlagEvent[]
  const flagsByAttempt = useMemo(() => {
    const map: Record<string, RedFlagEvent[]> = {};
    redFlags.forEach(f => {
      if (!map[f.attemptId]) map[f.attemptId] = [];
      map[f.attemptId].push(f);
    });
    return map;
  }, [redFlags]);

  // Aggregate Metrics
  const stats = useMemo(() => {
    const total = attempts.length;
    const completed = attempts.filter(a => a.status === 'completed').length;
    const inProgress = attempts.filter(a => a.status === 'in_progress').length;
    const flagged = attempts.filter(a => (a.status as any) === 'flagged' || a.redFlagsCount > 2).length;
    const disqualified = attempts.filter(a => a.status === 'disqualified').length;
    const avgScore = total > 0 
      ? Math.round(attempts.reduce((sum, a) => sum + (a.score || 0), 0) / total)
      : 0;
    const maxScore = total > 0 
      ? Math.max(...attempts.map(a => a.score || 0))
      : 0;

    return { total, completed, inProgress, flagged, disqualified, avgScore, maxScore };
  }, [attempts]);

  // Filtered List
  const filteredCandidates = useMemo(() => {
    return attempts.filter(cand => {
      const name = cand.candidateName || '';
      const scholar = cand.scholarNumber || '';
      const matchesSearch = name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            scholar.toLowerCase().includes(searchQuery.toLowerCase());
      
      const st = (cand.status || '').toLowerCase();
      let matchesStatus = true;
      if (filterStatus === 'COMPLETED') matchesStatus = st === 'completed';
      else if (filterStatus === 'IN_PROGRESS') matchesStatus = st === 'in_progress';
      else if (filterStatus === 'FLAGGED') matchesStatus = st === 'flagged' || cand.redFlagsCount > 2;
      else if (filterStatus === 'DISQUALIFIED') matchesStatus = st === 'disqualified';

      return matchesSearch && matchesStatus;
    });
  }, [attempts, searchQuery, filterStatus]);

  // Action handlers
  const handleDisqualify = async (attemptId: string) => {
    if (!window.confirm('Are you sure you want to DISQUALIFY this candidate?')) return;
    try {
      await updateAttemptStatus(attemptId, 'disqualified');
      await saveAuditLog({
        id: `audit-${Date.now()}`,
        adminId: 'ADMIN-01',
        action: 'DISQUALIFY',
        candidateId: attemptId,
        timestamp: new Date().toISOString(),
        reason: 'Administrative disqualification for recruitment protocol breach'
      });
      await loadData(false);
      showNotification('Candidate status updated to DISQUALIFIED.');
      if (selectedCandidate?.id === attemptId) {
        setSelectedCandidate((prev: Attempt | null) => prev ? { ...prev, status: 'disqualified' } : null);
      }
    } catch (err) {
      console.error(err);
      showNotification('Failed to update candidate status.');
    }
  };

  const handleResetAttempt = async (cand: Attempt) => {
    if (!window.confirm(`Reset attempt for ${cand.candidateName} (${cand.scholarNumber})? This will clear their answers and red flags, allowing them to re-take the exam.`)) return;
    try {
      await resetCandidateAttempt(cand.candidateId);
      await saveAuditLog({
        id: `audit-${Date.now()}`,
        adminId: 'ADMIN-01',
        action: 'GRANT_REPLAY',
        candidateId: cand.candidateId,
        timestamp: new Date().toISOString(),
        reason: 'Proctor-authorized re-attempt for technical difficulties'
      });
      await loadData(false);
      setSelectedCandidate(null);
      showNotification(`Exam attempt reset for ${cand.candidateName}. They can now login and re-attempt.`);
    } catch (err) {
      console.error(err);
      showNotification('Failed to reset candidate attempt.');
    }
  };

  const handleDeleteAttempt = async (attemptId: string) => {
    if (!window.confirm('Permanently delete this exam attempt record? This cannot be undone.')) return;
    try {
      await deleteAttempt(attemptId);
      await loadData(false);
      setSelectedCandidate(null);
      showNotification('Attempt record deleted.');
    } catch (err) {
      console.error(err);
      showNotification('Failed to delete attempt.');
    }
  };

  const handleUpdateStatus = async (attemptId: string, newStatus: any) => {
    try {
      await updateAttemptStatus(attemptId, newStatus);
      await loadData(false);
      if (selectedCandidate?.id === attemptId) {
        setSelectedCandidate((prev: Attempt | null) => prev ? { ...prev, status: newStatus } : null);
      }
      showNotification(`Status updated to ${newStatus.toUpperCase()}.`);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmitVolunteerReport = async () => {
    if (!volunteerReportTarget) return;
    try {
      await saveVolunteerReport({
        id: `vol-${Date.now()}`,
        volunteerId: 'VOL-01',
        candidateId: volunteerReportTarget.candidateId,
        candidateName: volunteerReportTarget.candidateName,
        scholarNumber: volunteerReportTarget.scholarNumber,
        type: reportType as any,
        note: reportNote || 'Incident observed during lab proctoring',
        timestamp: new Date().toISOString(),
        status: 'pending'
      });
      // Also flag the candidate attempt
      await updateAttemptStatus(volunteerReportTarget.id, 'flagged');
      await loadData(false);
      setVolunteerReportTarget(null);
      setReportNote('');
      showNotification(`Volunteer report filed. ${volunteerReportTarget.candidateName} marked as FLAGGED.`);
    } catch (err) {
      console.error(err);
      showNotification('Failed to save report.');
    }
  };

  // Export to CSV
  const handleExportCSV = () => {
    if (attempts.length === 0) {
      showNotification('No candidate data available to export.');
      return;
    }

    const headers = ['Candidate ID', 'Scholar Number', 'Name', 'Status', 'Score', 'XP', 'Accuracy %', 'Red Flags Count', 'Started At'];
    const rows = attempts.map(a => [
      `"${a.candidateId}"`,
      `"${a.scholarNumber}"`,
      `"${a.candidateName}"`,
      `"${(a.status || 'unknown').toUpperCase()}"`,
      a.score || 0,
      a.xp || 0,
      `${a.accuracy || 0}%`,
      a.redFlagsCount || 0,
      `"${new Date(a.startedAt).toLocaleString()}"`
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `CyberCell_Recruitment_Candidates_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showNotification('Exported candidate data to CSV.');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans pb-16">
      
      {/* Top Banner & Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/')}
              className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
              title="Return to Home"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div className="w-9 h-9 rounded-lg bg-sky-50 border border-sky-200 flex items-center justify-center font-mono text-sm font-bold text-sky-700">
              <Shield className="w-5 h-5 text-sky-600" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-bold text-slate-900 tracking-tight">
                  CYBER CELL SOC RECRUITMENT • ADMIN PORTAL
                </h1>
                <span className="text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full font-mono font-semibold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  LIVE DATABASE
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Real-time candidate evaluation, proctoring audit trails, and examination management
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            <button
              onClick={() => loadData(false)}
              disabled={isRefreshing}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 border border-slate-200 text-xs font-semibold text-slate-700 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-slate-600 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span>{isRefreshing ? 'Refreshing...' : 'Refresh'}</span>
            </button>

            <button
              onClick={handleExportCSV}
              className="px-3 py-1.5 bg-sky-50 hover:bg-sky-100 border border-sky-200 text-xs font-semibold text-sky-700 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-sky-600" />
              <span>Export CSV</span>
            </button>
          </div>

        </div>
      </header>

      {/* Global Notification Toast */}
      {actionSuccessMsg && (
        <div className="fixed top-18 right-6 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-xl shadow-lg text-xs font-medium flex items-center gap-2 animate-fadeIn border border-slate-700">
          <CheckCircle className="w-4 h-4 text-emerald-400" />
          <span>{actionSuccessMsg}</span>
        </div>
      )}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-6">
        
        {/* Metric Overview Cards */}
        <section className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
            <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
              <span>Total Candidates</span>
              <Users className="w-4 h-4 text-slate-400" />
            </div>
            <div className="text-2xl font-bold text-slate-900 mt-2 font-mono">{stats.total}</div>
            <div className="text-[10px] text-slate-400 mt-0.5">IndexedDB records</div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
            <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
              <span>Completed</span>
              <CheckCircle className="w-4 h-4 text-emerald-500" />
            </div>
            <div className="text-2xl font-bold text-emerald-600 mt-2 font-mono">{stats.completed}</div>
            <div className="text-[10px] text-slate-400 mt-0.5">Finished all 30 MCQs</div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
            <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
              <span>In-Progress</span>
              <Activity className="w-4 h-4 text-sky-500" />
            </div>
            <div className="text-2xl font-bold text-sky-600 mt-2 font-mono">{stats.inProgress}</div>
            <div className="text-[10px] text-slate-400 mt-0.5">Currently testing</div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
            <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
              <span>Flagged</span>
              <AlertTriangle className="w-4 h-4 text-amber-500" />
            </div>
            <div className="text-2xl font-bold text-amber-600 mt-2 font-mono">{stats.flagged}</div>
            <div className="text-[10px] text-slate-400 mt-0.5">&gt;2 anti-cheat flags</div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
            <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
              <span>Disqualified</span>
              <Ban className="w-4 h-4 text-red-500" />
            </div>
            <div className="text-2xl font-bold text-red-600 mt-2 font-mono">{stats.disqualified}</div>
            <div className="text-[10px] text-slate-400 mt-0.5">Banned by proctor</div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
            <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
              <span>Average Score</span>
              <Award className="w-4 h-4 text-indigo-500" />
            </div>
            <div className="text-2xl font-bold text-indigo-600 mt-2 font-mono">{stats.avgScore}</div>
            <div className="text-[10px] text-slate-400 mt-0.5">Top: {stats.maxScore} PTS</div>
          </div>
        </section>

        {/* Filters and Search Bar */}
        <section className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
          
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search candidate name or scholar number..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500/30 transition-colors"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
            {['ALL', 'COMPLETED', 'IN_PROGRESS', 'FLAGGED', 'DISQUALIFIED'].map((statusKey) => (
              <button
                key={statusKey}
                onClick={() => setFilterStatus(statusKey)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                  filterStatus === statusKey
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {statusKey.replace('_', ' ')}
              </button>
            ))}
          </div>

        </section>

        {/* Live Candidates Table */}
        <section className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-sky-600" />
              <h2 className="text-sm font-bold text-slate-900">
                Candidate Attempts ({filteredCandidates.length})
              </h2>
            </div>
            <span className="text-[11px] text-slate-500 font-mono">
              Auto-updating every 6s
            </span>
          </div>

          {isLoading ? (
            <div className="p-12 text-center text-slate-400 text-xs">
              <RefreshCw className="w-6 h-6 animate-spin mx-auto text-sky-600 mb-2" />
              Loading real-time recruitment records from IndexedDB...
            </div>
          ) : filteredCandidates.length === 0 ? (
            <div className="p-12 text-center text-slate-500 text-xs">
              No candidates found matching the active filter or search query.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/70 text-slate-500 text-[11px] font-semibold uppercase tracking-wider">
                    <th className="py-3 px-4">Candidate</th>
                    <th className="py-3 px-4">Scholar No</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Score / XP</th>
                    <th className="py-3 px-4">Accuracy</th>
                    <th className="py-3 px-4">Red Flags</th>
                    <th className="py-3 px-4">Started At</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredCandidates.map((cand) => {
                    const candPhoto = photoMap[cand.candidateId];
                    const flagsList = flagsByAttempt[cand.id] || [];
                    const statusStr = (cand.status || 'in_progress').toLowerCase();

                    return (
                      <tr key={cand.id} className="hover:bg-slate-50/70 transition-colors">
                        
                        {/* Candidate Identity with Photo / Avatar */}
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            {candPhoto ? (
                              <img
                                src={candPhoto}
                                alt={cand.candidateName}
                                className="w-9 h-9 rounded-lg object-cover border border-slate-200 shrink-0"
                              />
                            ) : (
                              <div className="w-9 h-9 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-slate-700 text-xs shrink-0 font-mono">
                                {cand.candidateName ? cand.candidateName.slice(0, 2).toUpperCase() : 'CC'}
                              </div>
                            )}
                            <div>
                              <div className="font-bold text-slate-900">{cand.candidateName}</div>
                              <div className="text-[10px] text-slate-500 font-mono">ID: {cand.candidateId}</div>
                            </div>
                          </div>
                        </td>

                        {/* Scholar Number */}
                        <td className="py-3 px-4 font-mono font-medium text-slate-700">
                          {cand.scholarNumber}
                        </td>

                        {/* Status Badge */}
                        <td className="py-3 px-4">
                          {statusStr === 'completed' && (
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                              Completed
                            </span>
                          )}
                          {statusStr === 'in_progress' && (
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-sky-50 text-sky-700 border border-sky-200 flex items-center gap-1 w-max">
                              <span className="w-1.5 h-1.5 rounded-full bg-sky-500 animate-pulse" />
                              In Progress
                            </span>
                          )}
                          {statusStr === 'flagged' && (
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                              Flagged
                            </span>
                          )}
                          {statusStr === 'disqualified' && (
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-red-50 text-red-700 border border-red-200">
                              Disqualified
                            </span>
                          )}
                        </td>

                        {/* Score & XP */}
                        <td className="py-3 px-4 font-mono">
                          <span className="font-bold text-slate-900">{cand.score || 0} PTS</span>
                          <span className="text-[10px] text-slate-500 block">{cand.xp || 0} XP</span>
                        </td>

                        {/* Accuracy */}
                        <td className="py-3 px-4 font-mono">
                          <span className="font-semibold text-slate-800">{cand.accuracy || 0}%</span>
                        </td>

                        {/* Red Flags Count */}
                        <td className="py-3 px-4">
                          <span className={`px-2 py-0.5 rounded-md text-[10px] font-mono font-bold ${
                            cand.redFlagsCount > 2 || flagsList.length > 2
                              ? 'bg-red-50 text-red-700 border border-red-200'
                              : cand.redFlagsCount > 0 || flagsList.length > 0
                              ? 'bg-amber-50 text-amber-700 border border-amber-200'
                              : 'bg-slate-100 text-slate-600 border border-slate-200'
                          }`}>
                            {Math.max(cand.redFlagsCount || 0, flagsList.length)} Flags
                          </span>
                        </td>

                        {/* Started At */}
                        <td className="py-3 px-4 text-slate-500 font-mono text-[11px]">
                          {new Date(cand.startedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </td>

                        {/* Actions */}
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => setSelectedCandidate(cand)}
                              className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors cursor-pointer"
                              title="Inspect Candidate Dossier & Red Flags"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>

                            <button
                              onClick={() => setVolunteerReportTarget(cand)}
                              className="p-1.5 bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 rounded-lg transition-colors cursor-pointer"
                              title="File On-Ground Incident Report"
                            >
                              <AlertTriangle className="w-3.5 h-3.5" />
                            </button>

                            {statusStr !== 'disqualified' && (
                              <button
                                onClick={() => handleDisqualify(cand.id)}
                                className="p-1.5 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 rounded-lg transition-colors cursor-pointer"
                                title="Disqualify Candidate"
                              >
                                <Ban className="w-3.5 h-3.5" />
                              </button>
                            )}

                            <button
                              onClick={() => handleResetAttempt(cand)}
                              className="p-1.5 bg-sky-50 hover:bg-sky-100 text-sky-700 border border-sky-200 rounded-lg transition-colors cursor-pointer"
                              title="Reset Attempt (Allow Retake)"
                            >
                              <RotateCcw className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>

                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>

      </main>

      {/* Candidate Dossier & Audit Inspection Modal */}
      {selectedCandidate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 select-none">
          <div className="w-full max-w-2xl bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] animate-scaleIn">
            
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-sky-50 border border-sky-200 flex items-center justify-center font-mono font-bold text-sky-700">
                  <UserCheck className="w-5 h-5 text-sky-600" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Candidate Audit Dossier: {selectedCandidate.candidateName}
                  </h3>
                  <p className="text-xs text-slate-500 font-mono">
                    Scholar #{selectedCandidate.scholarNumber} • Attempt ID: {selectedCandidate.id}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedCandidate(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-5 flex-1 text-xs">
              
              {/* Photo & Quick Overview Card */}
              <div className="flex flex-col sm:flex-row gap-4 p-4 bg-slate-50 border border-slate-200 rounded-xl items-center sm:items-start">
                {photoMap[selectedCandidate.candidateId] ? (
                  <div className="space-y-1 text-center shrink-0">
                    <img
                      src={photoMap[selectedCandidate.candidateId]}
                      alt="Captured Proctor Photo"
                      className="w-28 h-28 object-cover rounded-xl border border-slate-200 shadow-xs"
                    />
                    <span className="text-[10px] text-slate-500 font-mono flex items-center justify-center gap-1">
                      <Camera className="w-3 h-3 text-sky-600" /> PreCheck Capture
                    </span>
                  </div>
                ) : (
                  <div className="w-28 h-28 rounded-xl bg-slate-200 border border-slate-300 flex flex-col items-center justify-center text-slate-400 shrink-0">
                    <Camera className="w-6 h-6 mb-1" />
                    <span className="text-[10px]">No Photo</span>
                  </div>
                )}

                <div className="flex-1 space-y-2 w-full">
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    <div className="p-2.5 bg-white border border-slate-200 rounded-lg">
                      <span className="text-[10px] text-slate-500 block uppercase font-mono">Score</span>
                      <span className="text-base font-bold text-slate-900 font-mono">{selectedCandidate.score || 0} PTS</span>
                    </div>
                    <div className="p-2.5 bg-white border border-slate-200 rounded-lg">
                      <span className="text-[10px] text-slate-500 block uppercase font-mono">Accuracy</span>
                      <span className="text-base font-bold text-emerald-600 font-mono">{selectedCandidate.accuracy || 0}%</span>
                    </div>
                    <div className="p-2.5 bg-white border border-slate-200 rounded-lg">
                      <span className="text-[10px] text-slate-500 block uppercase font-mono">Status</span>
                      <span className="text-xs font-bold uppercase text-sky-700 font-mono">{selectedCandidate.status}</span>
                    </div>
                  </div>

                  <div className="text-xs text-slate-600 pt-1 space-y-1">
                    <p><span className="font-semibold text-slate-800">Started:</span> {new Date(selectedCandidate.startedAt).toLocaleString()}</p>
                    <p><span className="font-semibold text-slate-800">Current Level Index:</span> Level {(selectedCandidate.currentMissionIndex || 0) + 1} of 8</p>
                  </div>
                </div>
              </div>

              {/* Skill Scores Breakdown */}
              {selectedCandidate.skillScores && (
                <div className="space-y-2">
                  <h4 className="font-bold text-slate-900 flex items-center gap-1.5">
                    <Award className="w-4 h-4 text-indigo-600" />
                    Domain Breakdown
                  </h4>
                  <div className="grid grid-cols-2 gap-2">
                    {Object.entries(selectedCandidate.skillScores).map(([skill, data]: [string, any]) => (
                      <div key={skill} className="p-3 bg-white border border-slate-200 rounded-lg flex items-center justify-between">
                        <span className="font-medium text-slate-700 truncate mr-2">{skill}</span>
                        <span className="font-mono font-bold text-indigo-600">{data.score || 0} pts</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Anti-Cheat Red Flags Timeline */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-slate-900 flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-amber-500" />
                    Proctoring Incident Logs ({flagsByAttempt[selectedCandidate.id]?.length || selectedCandidate.redFlagsCount || 0})
                  </h4>
                  <span className="text-[10px] text-slate-500">Continuous telemetry</span>
                </div>

                {(!flagsByAttempt[selectedCandidate.id] || flagsByAttempt[selectedCandidate.id].length === 0) ? (
                  <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Clean Integrity Record: No proctoring violations recorded for this candidate session.</span>
                  </div>
                ) : (
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {flagsByAttempt[selectedCandidate.id].map((flag) => (
                      <div key={flag.id} className="p-3 bg-red-50/70 border border-red-200 rounded-xl flex items-start justify-between gap-3">
                        <div>
                          <div className="font-bold text-red-800 flex items-center gap-1.5">
                            <span className="px-1.5 py-0.2 bg-red-200 text-red-900 rounded text-[9px] uppercase font-mono">
                              {flag.type}
                            </span>
                            <span>{flag.metadata?.reason || flag.type}</span>
                          </div>
                          <div className="text-[10px] text-slate-500 font-mono mt-1">
                            {new Date(flag.timestamp).toLocaleTimeString()}
                          </div>
                        </div>
                        <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-red-100 text-red-700 uppercase font-mono">
                          {flag.severity}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>

            {/* Modal Footer Actions */}
            <div className="px-6 py-3.5 border-t border-slate-200 bg-slate-50 flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-slate-500">Change Status:</span>
                <select
                  value={selectedCandidate.status}
                  onChange={(e) => handleUpdateStatus(selectedCandidate.id, e.target.value)}
                  className="bg-white border border-slate-200 rounded-lg px-2.5 py-1 text-xs font-semibold text-slate-800 cursor-pointer focus:outline-none"
                >
                  <option value="in_progress">In Progress</option>
                  <option value="completed">Completed</option>
                  <option value="flagged">Flagged</option>
                  <option value="disqualified">Disqualified</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleResetAttempt(selectedCandidate)}
                  className="px-3 py-1.5 bg-sky-50 hover:bg-sky-100 text-sky-700 border border-sky-200 rounded-lg font-semibold text-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset / Retake</span>
                </button>
                <button
                  onClick={() => handleDeleteAttempt(selectedCandidate.id)}
                  className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 rounded-lg font-semibold text-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete Record</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Volunteer Report Filing Modal */}
      {volunteerReportTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 select-none">
          <div className="w-full max-w-md bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden animate-scaleIn">
            
            <div className="px-6 py-4 border-b border-slate-200 bg-amber-50/70 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <AlertTriangle className="w-5 h-5 text-amber-600" />
                <h3 className="text-sm font-bold text-slate-900">
                  File On-Ground Proctor Report
                </h3>
              </div>
              <button
                onClick={() => setVolunteerReportTarget(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                <span className="text-[10px] text-slate-500 uppercase block font-mono">Candidate Target</span>
                <span className="font-bold text-slate-900 text-sm">{volunteerReportTarget.candidateName}</span>
                <span className="text-slate-500 font-mono block mt-0.5">Scholar #{volunteerReportTarget.scholarNumber}</span>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Incident Category</label>
                <select
                  value={reportType}
                  onChange={(e) => setReportType(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 font-medium focus:outline-none focus:border-amber-500"
                >
                  <option value="MOBILE_PHONE">Physical Mobile Phone in Lab</option>
                  <option value="COMMUNICATION">Peer Communication / Whispering</option>
                  <option value="UNAUTHORIZED_MATERIAL">Chits / Notes / Paper Material</option>
                  <option value="IMPERSONATION">Proxy / Impersonation Suspected</option>
                  <option value="LAB_RULES_BREACH">Violation of Lab Conduct</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Invigilator Notes & Observation</label>
                <textarea
                  rows={3}
                  value={reportNote}
                  onChange={(e) => setReportNote(e.target.value)}
                  placeholder="Describe what occurred, time, seat position, or physical evidence observed..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs text-slate-800 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setVolunteerReportTarget(null)}
                  className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSubmitVolunteerReport}
                  className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Submit Incident Report</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
