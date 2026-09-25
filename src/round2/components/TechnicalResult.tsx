import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import type { TechnicalProfileResult, Round2Domain } from '../../types/round2';
import { DOMAIN_METADATA } from '../data/skillTree';
import { 
  Shield, 
  Award, 
  Sparkles, 
  Layers, 
  Code,
  ArrowRight,
  TrendingUp,
  RotateCcw
} from 'lucide-react';

export default function TechnicalResult() {
  const navigate = useNavigate();
  const [result, setResult] = useState<TechnicalProfileResult | null>(null);

  useEffect(() => {
    const rawResult = localStorage.getItem('round2_result');
    if (rawResult) {
      try {
        setResult(JSON.parse(rawResult));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  if (!result) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center font-sans text-slate-800 p-4">
        <p className="text-slate-500 text-sm mb-4">No technical assessment result found.</p>
        <button
          onClick={() => navigate('/technical-profile')}
          className="px-6 py-2.5 bg-slate-900 text-white font-semibold text-xs uppercase rounded-xl cursor-pointer hover:bg-slate-800"
        >
          Go to Technical Profile Setup
        </button>
      </div>
    );
  }

  const allDomains = Object.keys(DOMAIN_METADATA) as Round2Domain[];
  const assessedDomains = Object.values(result.domainScores || {}).filter(d => d.status === 'ASSESSED');

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 p-4 md:p-8 font-sans select-none">
      <div className="max-w-5xl mx-auto space-y-6 animate-scaleIn">
        
        {/* Top Completion Banner */}
        <div className="p-6 md:p-8 border border-slate-200 rounded-2xl shadow-xl bg-white">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-sky-50 border border-sky-200 flex items-center justify-center text-sky-700 shrink-0">
                <Award className="w-8 h-8 text-sky-600" />
              </div>
              <div>
                <div className="flex items-center gap-2 text-sky-700 text-xs uppercase tracking-wider font-semibold font-mono">
                  <Shield className="w-4 h-4 text-sky-600" />
                  OPERATION ZERO-DAY • ROUND 01 B
                </div>
                <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900 mt-1">
                  TECHNICAL PROFILING COMPLETE
                </h1>
                <p className="text-xs text-slate-500 mt-0.5">
                  Candidate: <strong className="text-slate-800">{result.candidateName}</strong> ({result.scholarNumber})
                </p>
              </div>
            </div>

            <div className="text-right">
              <span className="text-[10px] text-slate-500 uppercase block font-mono">TOTAL SCORE EARNED</span>
              <span className="text-2xl md:text-3xl font-bold text-slate-900 font-mono">
                {result.totalScoreEarned} / {result.maxScorePossible}
              </span>
              <span className="text-xs text-slate-500 block mt-0.5 font-mono">
                Demonstrated Accuracy: <strong className="text-emerald-600 font-bold">{result.percentage}%</strong>
              </span>
            </div>
          </div>

          {/* Strength Detection Summary */}
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-4 bg-sky-50/60 border border-sky-200 rounded-xl">
              <span className="text-[10px] text-sky-800 font-bold uppercase tracking-wider block flex items-center gap-1.5 font-mono">
                <Sparkles className="w-3.5 h-3.5 text-sky-600" />
                ASSESSED COVERAGE
              </span>
              <span className="text-base font-bold text-slate-900 mt-1 block">
                {assessedDomains.length} Active Domains
              </span>
              <span className="text-[10px] text-slate-500 mt-0.5 block">Declared in engineering profile</span>
            </div>

            <div className="p-4 bg-indigo-50/60 border border-indigo-200 rounded-xl">
              <span className="text-[10px] text-indigo-800 font-bold uppercase tracking-wider block flex items-center gap-1.5 font-mono">
                <TrendingUp className="w-3.5 h-3.5 text-indigo-600" />
                ACCURACY BAND
              </span>
              <span className="text-base font-bold text-slate-900 mt-1 block">
                {result.percentage >= 75 ? 'Advanced Competency' : result.percentage >= 50 ? 'Intermediate Baseline' : 'Developing'}
              </span>
              <span className="text-[10px] text-slate-500 mt-0.5 block">Standardized technical index</span>
            </div>

            <div className="p-4 bg-amber-50/60 border border-amber-200 rounded-xl">
              <span className="text-[10px] text-amber-800 font-bold uppercase tracking-wider block flex items-center gap-1.5 font-mono">
                <Layers className="w-3.5 h-3.5 text-amber-600" />
                LAB CHALLENGES
              </span>
              <span className="text-base font-bold text-slate-900 mt-1 block">
                {result.submissions?.length || 0} Solved
              </span>
              <span className="text-[10px] text-slate-500 mt-0.5 block">Evaluated across all tiers</span>
            </div>
          </div>
        </div>

        {/* Multi-Dimensional Skill Matrix */}
        <div className="p-6 bg-white border border-slate-200 rounded-2xl space-y-4 shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <div>
              <h2 className="text-base font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <Code className="w-4 h-4 text-sky-600" />
                TECHNICAL COMPETENCY MATRIX
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Breakdown across declared engineering competencies
              </p>
            </div>
            <span className="text-[11px] text-slate-500 font-mono">
              {assessedDomains.length} Domains Assessed
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 uppercase text-[10px] font-mono">
                  <th className="pb-3 font-bold">Technical Domain</th>
                  <th className="pb-3 font-bold">Status</th>
                  <th className="pb-3 font-bold">Claimed Level</th>
                  <th className="pb-3 font-bold text-center">Score</th>
                  <th className="pb-3 font-bold text-center">Accuracy</th>
                  <th className="pb-3 font-bold text-right">Demonstrated Band</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {allDomains.map((dom) => {
                  const meta = DOMAIN_METADATA[dom];
                  const scoreObj = result.domainScores ? result.domainScores[dom] : undefined;
                  const isAssessed = scoreObj && scoreObj.status === 'ASSESSED';

                  return (
                    <tr key={dom} className={isAssessed ? 'hover:bg-slate-50 transition-colors' : 'opacity-40'}>
                      <td className="py-3 font-bold text-slate-900">
                        {meta.title}
                      </td>
                      <td className="py-3">
                        {isAssessed ? (
                          <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded text-[10px] font-semibold">
                            ASSESSED
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 bg-slate-100 text-slate-500 border border-slate-200 rounded text-[10px]">
                            NOT ASSESSED
                          </span>
                        )}
                      </td>
                      <td className="py-3 uppercase text-slate-600 font-mono text-[11px]">
                        {isAssessed ? scoreObj.claimedLevel : '—'}
                      </td>
                      <td className="py-3 text-center font-mono font-medium">
                        {isAssessed && scoreObj.knowledgeScore !== null ? `${scoreObj.knowledgeScore}%` : '—'}
                      </td>
                      <td className="py-3 text-center font-mono font-bold text-sky-700">
                        {isAssessed && scoreObj.overallDemonstrated !== null ? `${scoreObj.overallDemonstrated}%` : '—'}
                      </td>
                      <td className="py-3 text-right">
                        {isAssessed && scoreObj.demonstratedBand ? (
                          <span className="font-bold px-2 py-0.5 bg-sky-50 border border-sky-200 text-sky-700 rounded uppercase font-mono text-[10px]">
                            {scoreObj.demonstratedBand}
                          </span>
                        ) : (
                          '—'
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Navigation & Action Footer */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
          <button
            onClick={() => navigate('/technical-profile')}
            className="w-full sm:w-auto px-5 py-2.5 border border-slate-200 hover:border-slate-300 text-slate-700 hover:text-slate-900 text-xs rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer bg-white"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Re-configure Skills (Practice)</span>
          </button>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
            <button
              onClick={() => navigate('/arcade')}
              className="w-full sm:w-auto px-5 py-3 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 font-bold text-xs uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-amber-600" />
              <span>STAGE 01 C: BONUS LABS</span>
            </button>

            <button
              onClick={() => navigate('/result')}
              className="w-full sm:w-auto px-8 py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>VIEW ROUND 1 DOSSIER</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
