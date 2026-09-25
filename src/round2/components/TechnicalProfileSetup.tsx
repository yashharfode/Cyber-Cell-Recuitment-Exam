import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DOMAIN_METADATA } from '../data/skillTree';
import type { Round2Domain, SkillSelfRating, CandidateSkillProfile } from '../../types/round2';
import { generateAssessmentBlueprint } from '../engine/assessmentEngine';
import { useStore } from '../../store/useStore';
import { 
  Shield, 
  Code, 
  Globe, 
  Cpu, 
  Network, 
  Database, 
  Terminal, 
  GitBranch, 
  Cloud, 
  Sparkles,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  Maximize2
} from 'lucide-react';

import { enterBrowserFullscreen } from '../../utils/fullscreen';

const ICON_MAP: Record<string, any> = {
  Code,
  Globe,
  Cpu,
  Shield,
  Network,
  Database,
  Terminal,
  GitBranch,
  Cloud,
  Sparkles
};

export default function TechnicalProfileSetup() {
  const navigate = useNavigate();
  const { candidate } = useStore();

  const [selectedDomains, setSelectedDomains] = useState<Round2Domain[]>(['WEB_DEVELOPMENT']);
  const [domainRatings, setDomainRatings] = useState<Record<Round2Domain, SkillSelfRating>>({
    WEB_DEVELOPMENT: 'intermediate',
    PROGRAMMING: 'basic',
    DSA: 'basic',
    CYBERSECURITY: 'beginner',
    NETWORKING: 'basic',
    DATABASE_SQL: 'basic',
    LINUX_CLI: 'basic',
    GIT_GITHUB: 'basic',
    CLOUD_DEVOPS: 'beginner',
    OTHER: 'beginner'
  });

  const [selectedSubSkills, setSelectedSubSkills] = useState<Record<Round2Domain, string[]>>({
    WEB_DEVELOPMENT: ['HTML5 Semantic Elements', 'CSS3 Styling', 'JavaScript (ES6+)'],
    PROGRAMMING: ['Python', 'Basics & Syntax', 'Functions & Recursion'],
    DSA: ['Arrays', 'Searching (Binary Search)'],
    CYBERSECURITY: ['Cybersecurity Fundamentals'],
    NETWORKING: ['IP Addressing (IPv4/IPv6)', 'DNS & Domain Resolution'],
    DATABASE_SQL: ['SQL Basics & Syntax'],
    LINUX_CLI: ['pwd, ls, cd'],
    GIT_GITHUB: ['Repositories & git clone'],
    CLOUD_DEVOPS: ['Docker & Container Basics'],
    OTHER: []
  });

  const [expandedDomain, setExpandedDomain] = useState<Round2Domain | null>('WEB_DEVELOPMENT');
  const [preferredLanguage, setPreferredLanguage] = useState<string>('Python');
  const [otherSkillText, setOtherSkillText] = useState<string>('');

  const toggleDomain = (domain: Round2Domain) => {
    if (selectedDomains.includes(domain)) {
      if (selectedDomains.length === 1) return; // Keep at least one selected
      setSelectedDomains(selectedDomains.filter(d => d !== domain));
      if (expandedDomain === domain) setExpandedDomain(null);
    } else {
      setSelectedDomains([...selectedDomains, domain]);
      setExpandedDomain(domain);
    }
  };

  const toggleSubSkill = (domain: Round2Domain, subSkill: string) => {
    const current = selectedSubSkills[domain] || [];
    if (current.includes(subSkill)) {
      setSelectedSubSkills({
        ...selectedSubSkills,
        [domain]: current.filter(s => s !== subSkill)
      });
    } else {
      setSelectedSubSkills({
        ...selectedSubSkills,
        [domain]: [...current, subSkill]
      });
    }
  };

  const setRating = (domain: Round2Domain, rating: SkillSelfRating) => {
    setDomainRatings({
      ...domainRatings,
      [domain]: rating
    });
  };

  const handleStartRound2 = async () => {
    const profile: CandidateSkillProfile = {
      candidateId: candidate?.id || 'demo-user',
      selectedDomains,
      domainRatings,
      selectedSubSkills,
      preferredLanguage,
      otherSkillText,
      updatedAt: new Date().toISOString()
    };

    const blueprint = generateAssessmentBlueprint(profile);

    try {
      localStorage.setItem('round2_profile', JSON.stringify(profile));
      localStorage.setItem('round2_blueprint', JSON.stringify(blueprint));
    } catch (e) {
      console.error(e);
    }

    try {
      await enterBrowserFullscreen();
    } catch (e) {
      console.warn('Could not auto-request fullscreen:', e);
    }

    navigate('/round2-assessment');
  };

  const requiresLanguageSelect = selectedDomains.includes('PROGRAMMING') || selectedDomains.includes('DSA');

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 p-4 sm:p-8 font-sans selection:bg-sky-100 selection:text-sky-900">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Top Header Card */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider px-2.5 py-0.5 bg-sky-50 text-sky-700 border border-sky-200 rounded-md font-semibold inline-block mb-1.5">
                ROUND 01 B • TECHNICAL PROFILING
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 uppercase">
                DECLARE YOUR TECHNICAL SKILLS
              </h1>
              <p className="text-xs text-slate-500 mt-1">
                Candidate: <strong className="text-slate-900">{candidate?.name || 'Guest Candidate'}</strong> ({candidate?.scholarNumber || 'DEMO-01'})
              </p>
            </div>
            <div className="px-3 py-1.5 bg-sky-50 border border-sky-200 text-sky-700 text-xs font-bold rounded-lg shrink-0">
              PHASE 2 OF RECRUITMENT
            </div>
          </div>

          {/* 3-Step Simple Visual Guide */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-5">
            <div className="p-3 bg-sky-50 border border-sky-200 rounded-xl flex items-center gap-2.5">
              <span className="w-6 h-6 rounded-full bg-sky-600 text-white font-extrabold flex items-center justify-center text-xs">1</span>
              <div>
                <span className="text-xs font-bold text-slate-900 block">Step 1: Pick Domains</span>
                <span className="text-[10px] text-slate-500">Choose 1 to 9 skills you know</span>
              </div>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center gap-2.5">
              <span className="w-6 h-6 rounded-full bg-slate-200 text-slate-700 font-bold flex items-center justify-center text-xs">2</span>
              <div>
                <span className="text-xs font-bold text-slate-900 block">Step 2: Sub-Skills & Level</span>
                <span className="text-[10px] text-slate-500">Rate confidence & pick topics</span>
              </div>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center gap-2.5">
              <span className="w-6 h-6 rounded-full bg-slate-200 text-slate-700 font-bold flex items-center justify-center text-xs">3</span>
              <div>
                <span className="text-xs font-bold text-slate-900 block">Step 3: Launch Test</span>
                <span className="text-[10px] text-slate-500">Fullscreen 25-min calibrated lab</span>
              </div>
            </div>
          </div>

          {/* Reassuring Fairness Notice */}
          <div className="mt-3 p-3.5 bg-slate-50 border border-slate-200 rounded-xl flex items-start gap-3 text-xs leading-relaxed">
            <AlertCircle className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
            <div>
              <strong className="text-slate-900">Fairness Guarantee: </strong>
              <span className="text-slate-600">
                You do NOT need to select every skill! Selecting only what you know does NOT lower your score. Unselected domains are recorded as <strong className="text-slate-800 font-mono">NOT_ASSESSED</strong>, never zero.
              </span>
            </div>
          </div>
        </div>

        {/* Step 1: Major Domains Grid */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-bold">1</span>
              SELECT TECHNICAL DOMAINS ({selectedDomains.length} SELECTED)
            </h2>
            <span className="text-[11px] text-slate-500">Click to select/unselect domains</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {Object.values(DOMAIN_METADATA).map((dom) => {
              const Icon = ICON_MAP[dom.iconName] || Code;
              const isSelected = selectedDomains.includes(dom.id);

              return (
                <div
                  key={dom.id}
                  onClick={() => toggleDomain(dom.id)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer select-none flex flex-col justify-between ${
                    isSelected
                      ? 'bg-sky-50/70 border-2 border-sky-500 shadow-xs'
                      : 'bg-white border-slate-200 hover:border-slate-300 text-slate-600'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2.5">
                      <div className={`p-2 rounded-lg border ${isSelected ? 'bg-sky-100 border-sky-200 text-sky-700' : 'bg-slate-50 border-slate-200 text-slate-500'}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className={`w-5 h-5 rounded border flex items-center justify-center text-xs font-bold ${isSelected ? 'bg-sky-600 text-white border-sky-600' : 'border-slate-300 text-transparent'}`}>
                        {isSelected && '✓'}
                      </div>
                    </div>
                    <h3 className="text-sm font-bold text-slate-900 tracking-tight">{dom.title}</h3>
                    <p className="text-[11px] text-slate-500 mt-1 leading-snug">{dom.tagline}</p>
                  </div>

                  <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[10px]">
                    <span className={isSelected ? 'text-sky-700 font-bold' : 'text-slate-400 font-medium'}>
                      {isSelected ? 'ACTIVE IN PROFILE' : 'CLICK TO ADD'}
                    </span>
                    {isSelected && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setExpandedDomain(expandedDomain === dom.id ? null : dom.id);
                        }}
                        className="text-sky-700 hover:underline flex items-center gap-0.5 font-semibold"
                      >
                        <span>Configure</span>
                        {expandedDomain === dom.id ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Step 2 & 3: Selected Domain Details Accordions */}
        <div className="space-y-4">
          <div className="flex items-center justify-between pt-2">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-bold">2</span>
              CONFIGURE SUB-SKILLS & SELF-RATED CONFIDENCE
            </h2>
            <span className="text-[11px] text-slate-500">Calibrate question range for chosen domains</span>
          </div>

          {selectedDomains.map((domainId) => {
            const dom = DOMAIN_METADATA[domainId];
            const isExpanded = expandedDomain === domainId;
            const currentSubSkills = selectedSubSkills[domainId] || [];
            const currentRating = domainRatings[domainId] || 'basic';
            const Icon = ICON_MAP[dom.iconName] || Code;

            return (
              <div key={domainId} className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
                {/* Header row */}
                <div
                  onClick={() => setExpandedDomain(isExpanded ? null : domainId)}
                  className="p-4 bg-slate-50 flex items-center justify-between cursor-pointer hover:bg-slate-100/70 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-sky-50 border border-sky-200 rounded-lg text-sky-700">
                      <Icon className="w-4 h-4 text-sky-600" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">{dom.title}</h3>
                      <p className="text-[11px] text-slate-500">
                        Rating: <strong className="text-sky-700 uppercase">{currentRating}</strong> • {currentSubSkills.length} sub-skills selected
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-sky-700 font-semibold hidden sm:inline">
                      {isExpanded ? 'Collapse' : 'Expand Sub-skills'}
                    </span>
                    {isExpanded ? <ChevronUp className="w-4 h-4 text-slate-500" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
                  </div>
                </div>

                {/* Expanded configuration body */}
                {isExpanded && (
                  <div className="p-5 bg-white border-t border-slate-200 space-y-5 animate-fadeIn">
                    
                    {/* Self-Rating Selector */}
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                        How comfortable are you with {dom.title}?
                      </p>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        {(['beginner', 'basic', 'intermediate', 'advanced'] as SkillSelfRating[]).map((level) => {
                          const isLevelActive = currentRating === level;
                          return (
                            <button
                              key={level}
                              type="button"
                              onClick={() => setRating(domainId, level)}
                              className={`py-2 px-3 text-xs uppercase font-bold rounded-lg border transition-all cursor-pointer ${
                                isLevelActive
                                  ? 'bg-sky-600 text-white border-sky-600 shadow-xs'
                                  : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                              }`}
                            >
                              {level}
                            </button>
                          );
                        })}
                      </div>
                      <p className="text-[10px] text-slate-500 mt-1.5 font-mono">
                        * Used to initialize baseline difficulty and evaluate self-perception vs demonstrated ability.
                      </p>
                    </div>

                    {/* Sub-skill Checkbox Groups */}
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                        Which sub-skills have you genuinely worked with?
                      </p>
                      <div className="space-y-3">
                        {dom.subSkills.map((group, gIdx) => (
                          <div key={gIdx} className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                            <span className="text-[11px] font-bold text-sky-800 uppercase tracking-wider block">
                              {group.groupName}
                            </span>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                              {group.items.map((item) => {
                                const isChecked = currentSubSkills.includes(item);
                                return (
                                  <label
                                    key={item}
                                    onClick={() => toggleSubSkill(domainId, item)}
                                    className={`p-2 rounded-lg border text-xs flex items-center justify-between cursor-pointer transition-colors ${
                                      isChecked
                                        ? 'bg-sky-50 border-sky-300 text-slate-900 font-semibold'
                                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                                    }`}
                                  >
                                    <span className="truncate pr-2">{item}</span>
                                    <div className={`w-4 h-4 rounded border flex items-center justify-center text-[10px] font-bold shrink-0 ${isChecked ? 'bg-sky-600 text-white border-sky-600' : 'border-slate-300'}`}>
                                      {isChecked && '✓'}
                                    </div>
                                  </label>
                                );
                              })}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {domainId === 'OTHER' && (
                      <div className="pt-2">
                        <label className="text-xs font-bold text-slate-700 uppercase block mb-1.5">
                          Specify Other Technical Skills or Frameworks:
                        </label>
                        <input
                          type="text"
                          value={otherSkillText}
                          onChange={(e) => setOtherSkillText(e.target.value)}
                          placeholder="e.g. Flutter, Rust, Embedded C, Unreal Engine..."
                          className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-sky-500 font-mono"
                        />
                      </div>
                    )}

                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Step 4: Preferred Programming Language */}
        {requiresLanguageSelect && (
          <div className="bg-white p-5 border border-slate-200 rounded-xl space-y-3 shadow-xs">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-bold">3</span>
              PRIMARY PROGRAMMING LANGUAGE FOR PRACTICAL TASKS
            </h2>
            <p className="text-xs text-slate-500">
              Select the primary language you prefer to write and debug code in:
            </p>
            <div className="flex flex-wrap gap-2.5">
              {['Python', 'C++', 'Java', 'C', 'JavaScript'].map((lang) => {
                const isLangActive = preferredLanguage === lang;
                return (
                  <button
                    key={lang}
                    type="button"
                    onClick={() => setPreferredLanguage(lang)}
                    className={`px-5 py-2.5 text-xs font-bold rounded-lg border transition-all cursor-pointer ${
                      isLangActive
                        ? 'bg-sky-600 text-white border-sky-600 shadow-xs'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {lang}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Launch Assessment Sticky Footer Bar */}
        <div className="bg-white p-6 border-2 border-slate-200 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4 shadow-xl sticky bottom-4 z-20">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 bg-sky-50 text-sky-700 border border-sky-200 rounded-full font-mono">
                STEP 3: READY TO LAUNCH
              </span>
              <span className="text-[10px] text-slate-500">
                Mandatory Fullscreen Mode
              </span>
            </div>
            <h3 className="text-base font-bold text-slate-900 mt-1">START YOUR 25-MIN TECHNICAL TEST</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              {selectedDomains.length} domains selected • {Object.values(selectedSubSkills).flat().length} sub-skills covered • Calibrated multi-tier challenges
            </p>
          </div>

          <button
            onClick={handleStartRound2}
            className="w-full md:w-auto px-8 py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center justify-center gap-2.5 cursor-pointer transform active:scale-95"
          >
            <Maximize2 className="w-4 h-4 text-sky-400" />
            <span>ENTER FULLSCREEN & START TEST &rarr;</span>
          </button>
        </div>

      </div>
    </div>
  );
}
