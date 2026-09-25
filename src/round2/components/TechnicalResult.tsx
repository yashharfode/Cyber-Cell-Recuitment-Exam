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
    const rawResult = sessionStorage.getItem('r2_result');
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
      <div className="min-h-screen bg-[#05070D] flex flex-col items-center justify-center font-mono-cyber text-cyber-text p-4">
        <p className="text-cyber-muted text-sm mb-4">No technical assessment result found.</p>
        <button
          onClick={() => navigate('/technical-profile')}
          className="px-6 py-2.5 bg-cyber-primary text-black font-bold text-xs uppercase rounded"
        >
          Go to Technical Profile Setup
        </button>
      </div>
    );
  }

  const allDomains = Object.keys(DOMAIN_METADATA) as Round2Domain[];
  const assessedDomains = Object.values(result.domainScores).filter(d => d.status === 'ASSESSED');

  return (
    <div className="min-h-screen bg-[#05070D] text-cyber-text p-4 md:p-8 font-mono-cyber select-none">
      <div className="max-w-5xl mx-auto space-y-6 animate-scaleIn">
        
        {/* Top Completion Banner */}
        <div className="cyber-panel p-6 md:p-8 border border-cyber-primary/40 rounded-lg relative overflow-hidden shadow-2xl bg-[#080C14]">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-cyber-border pb-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-cyber-primary/10 border-2 border-cyber-primary flex items-center justify-center text-cyber-primary shadow-[0_0_20px_rgba(0,255,204,0.3)] shrink-0">
                <Award className="w-8 h-8" />
              </div>
              <div>
                <div className="flex items-center gap-2 text-cyber-primary text-xs uppercase tracking-widest font-bold">
                  <Shield className="w-4 h-4 text-cyber-primary" />
                  OPERATION ZERO-DAY • ROUND 01 B
                </div>
                <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white mt-1">
                  TECHNICAL PROFILING COMPLETE
                </h1>
                <p className="text-xs text-cyber-muted mt-0.5">
                  Candidate: <strong className="text-white">{result.candidateName}</strong> ({result.scholarNumber})
                </p>
              </div>
            </div>

            <div className="text-right">
              <span className="text-[10px] text-cyber-muted uppercase block leading-none">TOTAL SCORE EARNED</span>
              <span className="text-2xl md:text-3xl font-bold text-cyber-primary">
                {result.totalScoreEarned} / {result.maxScorePossible}
              </span>
              <span className="text-xs text-cyber-muted block mt-0.5">
                Demonstrated Accuracy: <strong className="text-white">{result.percentage}%</strong>
              </span>
            </div>
          </div>

          {/* Strength Detection Summary */}
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3.5 bg-[#0B1018] border border-cyber-primary/40 rounded">
              <span className="text-[10px] text-cyber-primary font-bold uppercase tracking-wider block flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                PRIMARY STRENGTH
              </span>
              <span className="text-base font-bold text-white mt-1 block">
                {result.primaryStrength}
              </span>
              <span className="text-[10px] text-cyber-muted mt-0.5 block">Highest demonstrated competency</span>
            </div>

            <div className="p-3.5 bg-[#0B1018] border border-cyber-border rounded">
              <span className="text-[10px] text-cyber-secondary font-bold uppercase tracking-wider block flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5" />
                SECONDARY STRENGTH
              </span>
              <span className="text-base font-bold text-white mt-1 block">
                {result.secondaryStrength || 'Not Assessed'}
              </span>
              <span className="text-[10px] text-cyber-muted mt-0.5 block">Secondary demonstrated area</span>
            </div>

            <div className="p-3.5 bg-[#0B1018] border border-cyber-border rounded">
              <span className="text-[10px] text-cyber-warning font-bold uppercase tracking-wider block flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5" />
                EMERGING STRENGTH
              </span>
              <span className="text-base font-bold text-white mt-1 block">
                {result.emergingStrength || 'Not Assessed'}
              </span>
              <span className="text-[10px] text-cyber-muted mt-0.5 block">Emerging technical exposure</span>
            </div>
          </div>
        </div>

        {/* Multi-Dimensional Skill Matrix */}
        <div className="cyber-panel p-6 border border-cyber-border rounded-lg space-y-4">
          <div className="flex items-center justify-between border-b border-cyber-border pb-3">
            <div>
              <h2 className="text-base font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Code className="w-4 h-4 text-cyber-primary" />
                TECHNICAL COMPETENCY MATRIX
              </h2>
              <p className="text-xs text-cyber-muted mt-0.5">
                Breakdown across Knowledge, Application, and Practical Depth dimensions
              </p>
            </div>
            <span className="text-[11px] text-cyber-muted">
              {assessedDomains.length} Domains Assessed
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-cyber-border text-cyber-muted uppercase text-[10px]">
                  <th className="pb-3 font-bold">Technical Domain</th>
                  <th className="pb-3 font-bold">Status</th>
                  <th className="pb-3 font-bold">Claimed Level</th>
                  <th className="pb-3 font-bold text-center">Knowledge</th>
                  <th className="pb-3 font-bold text-center">Application</th>
                  <th className="pb-3 font-bold text-center">Practical</th>
                  <th className="pb-3 font-bold text-right">Demonstrated Band</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cyber-border/40">
                {allDomains.map((dom) => {
                  const meta = DOMAIN_METADATA[dom];
                  const scoreObj = result.domainScores[dom];
                  const isAssessed = scoreObj && scoreObj.status === 'ASSESSED';

                  return (
                    <tr key={dom} className={isAssessed ? 'hover:bg-white/5 transition-colors' : 'opacity-40'}>
                      <td className="py-3 font-bold text-white">
                        {meta.title}
                      </td>
                      <td className="py-3">
                        {isAssessed ? (
                          <span className="px-2 py-0.5 bg-cyber-success/20 text-cyber-success border border-cyber-success/30 rounded text-[10px] font-bold">
                            ASSESSED
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 bg-cyber-panel-secondary text-cyber-muted border border-cyber-border rounded text-[10px]">
                            NOT ASSESSED
                          </span>
                        )}
                      </td>
                      <td className="py-3 uppercase text-cyber-muted">
                        {isAssessed ? scoreObj.claimedLevel : '—'}
                      </td>
                      <td className="py-3 text-center">
                        {isAssessed && scoreObj.knowledgeScore !== null ? (
                          <span className="font-bold text-white">{scoreObj.knowledgeScore}%</span>
                        ) : (
                          '—'
                        )}
                      </td>
                      <td className="py-3 text-center">
                        {isAssessed && scoreObj.applicationScore !== null ? (
                          <span className="font-bold text-white">{scoreObj.applicationScore}%</span>
                        ) : (
                          '—'
                        )}
                      </td>
                      <td className="py-3 text-center">
                        {isAssessed && scoreObj.practicalScore !== null ? (
                          <span className="font-bold text-cyber-primary">{scoreObj.practicalScore}%</span>
                        ) : (
                          '—'
                        )}
                      </td>
                      <td className="py-3 text-right">
                        {isAssessed && scoreObj.demonstratedBand ? (
                          <span className="font-bold px-2 py-0.5 bg-cyber-primary/10 border border-cyber-primary/40 text-cyber-primary rounded">
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
            className="w-full sm:w-auto px-5 py-2.5 border border-cyber-border hover:border-cyber-primary text-cyber-muted hover:text-white text-xs rounded transition-colors flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Re-configure Skills (Practice)</span>
          </button>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
            <button
              onClick={() => navigate('/arcade')}
              className="w-full sm:w-auto px-5 py-3.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/40 font-bold text-xs uppercase tracking-wider rounded transition-all flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>STAGE 01 C: BONUS LABS (OPTIONAL)</span>
            </button>

            <button
              onClick={() => navigate('/result')}
              className="w-full sm:w-auto px-8 py-3.5 bg-cyber-primary hover:bg-white text-black font-bold text-xs uppercase tracking-wider rounded transition-all shadow-[0_0_20px_rgba(0,255,204,0.3)] flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>VIEW DOSSIER</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
