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

    // Save profile and blueprint to sessionStorage for robust recovery
    sessionStorage.setItem('r2_profile', JSON.stringify(profile));
    sessionStorage.setItem('r2_blueprint', JSON.stringify(blueprint));

    // Request fullscreen immediately from user click gesture
    await enterBrowserFullscreen();

    navigate('/round2-assessment');
  };

  const requiresLanguageSelect = selectedDomains.includes('PROGRAMMING') || selectedDomains.includes('DSA');

  return (
    <div className="min-h-screen bg-[#05070D] text-cyber-text p-4 md:p-8 font-mono-cyber">
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* Header Banner & Step Wizard */}
        <div className="cyber-panel p-6 md:p-8 border border-cyber-border rounded-lg relative overflow-hidden shadow-2xl">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-cyber-border pb-6">
            <div>
              <div className="flex items-center gap-2 text-cyber-primary text-xs uppercase tracking-widest">
                <Shield className="w-4 h-4 text-cyber-primary" />
                CYBER CELL • SATI VIDISHA
              </div>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white mt-1">
                ROUND 01 B: TECHNICAL SKILL PROFILING
              </h1>
              <p className="text-xs text-cyber-muted mt-1 max-w-2xl leading-relaxed">
                Choose the technical skills you genuinely know. The system will build a custom 25-minute assessment tailored specifically to your selections.
              </p>
            </div>
            <div className="px-3 py-1.5 bg-cyber-primary/10 border border-cyber-primary text-cyber-primary text-xs font-bold rounded shrink-0">
              PHASE 2 OF RECRUITMENT
            </div>
          </div>

          {/* 3-Step Simple Visual Guide */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-5">
            <div className="p-3 bg-cyber-primary/10 border border-cyber-primary/40 rounded flex items-center gap-2.5">
              <span className="w-6 h-6 rounded-full bg-cyber-primary text-black font-extrabold flex items-center justify-center text-xs">1</span>
              <div>
                <span className="text-xs font-bold text-white block">Step 1: Pick Domains</span>
                <span className="text-[10px] text-cyber-muted">Choose 1 to 9 skills you know</span>
              </div>
            </div>

            <div className="p-3 bg-[#0B1018] border border-cyber-border rounded flex items-center gap-2.5">
              <span className="w-6 h-6 rounded-full bg-white/10 text-white font-bold flex items-center justify-center text-xs">2</span>
              <div>
                <span className="text-xs font-bold text-white block">Step 2: Sub-Skills & Level</span>
                <span className="text-[10px] text-cyber-muted">Rate confidence & pick topics</span>
              </div>
            </div>

            <div className="p-3 bg-[#0B1018] border border-cyber-border rounded flex items-center gap-2.5">
              <span className="w-6 h-6 rounded-full bg-white/10 text-white font-bold flex items-center justify-center text-xs">3</span>
              <div>
                <span className="text-xs font-bold text-white block">Step 3: Launch Test</span>
                <span className="text-[10px] text-cyber-muted">Fullscreen 25-min calibrated lab</span>
              </div>
            </div>
          </div>

          {/* Reassuring Fairness Notice */}
          <div className="mt-3 p-3.5 bg-[#080C14] border border-cyber-primary/40 rounded flex items-start gap-3 text-xs leading-relaxed">
            <AlertCircle className="w-4 h-4 text-cyber-primary shrink-0 mt-0.5" />
            <div>
              <strong className="text-white">Fairness Guarantee: </strong>
              <span className="text-slate-300">
                You do NOT need to select every skill! Selecting only what you know does NOT lower your score. Unselected domains are recorded as <strong className="text-cyber-muted font-mono-cyber">NOT_ASSESSED</strong>, never zero.
              </span>
            </div>
          </div>
        </div>

        {/* Step 1: Major Domains Grid */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-cyber-primary text-black flex items-center justify-center text-xs font-bold">1</span>
              SELECT TECHNICAL DOMAINS ({selectedDomains.length} SELECTED)
            </h2>
            <span className="text-[11px] text-cyber-muted">Click to select/unselect domains</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {Object.values(DOMAIN_METADATA).map((dom) => {
              const Icon = ICON_MAP[dom.iconName] || Code;
              const isSelected = selectedDomains.includes(dom.id);

              return (
                <div
                  key={dom.id}
                  onClick={() => toggleDomain(dom.id)}
                  className={`p-4 rounded-lg border transition-all cursor-pointer transform hover:scale-[1.01] active:scale-[0.99] flex flex-col justify-between select-none ${
                    isSelected
                      ? 'bg-cyber-primary/10 border-cyber-primary shadow-[0_0_20px_rgba(0,255,204,0.15)]'
                      : 'bg-[#0B1018] border-cyber-border hover:border-cyber-primary/40 text-cyber-muted'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2.5">
                      <div className={`p-2 rounded border ${isSelected ? 'bg-cyber-primary/20 border-cyber-primary text-cyber-primary' : 'bg-black border-cyber-border text-cyber-muted'}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className={`w-5 h-5 rounded border flex items-center justify-center text-xs font-bold ${isSelected ? 'bg-cyber-primary text-black border-cyber-primary' : 'border-cyber-border'}`}>
                        {isSelected && '✓'}
                      </div>
                    </div>
                    <h3 className="text-sm font-bold text-white tracking-wide">{dom.title}</h3>
                    <p className="text-[11px] text-cyber-muted mt-1 leading-snug">{dom.tagline}</p>
                  </div>

                  <div className="mt-3 pt-2.5 border-t border-cyber-border/60 flex items-center justify-between text-[10px]">
                    <span className={isSelected ? 'text-cyber-primary font-bold' : 'text-cyber-muted'}>
                      {isSelected ? 'ACTIVE IN PROFILE' : 'CLICK TO ADD'}
                    </span>
                    {isSelected && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setExpandedDomain(expandedDomain === dom.id ? null : dom.id);
                        }}
                        className="text-cyber-primary hover:underline flex items-center gap-0.5"
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

        {/* Step 2 & 3: Selected Domain Details Accordions (Sub-skills & Self-Rating) */}
        <div className="space-y-4">
          <div className="flex items-center justify-between pt-2">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-cyber-primary text-black flex items-center justify-center text-xs font-bold">2</span>
              CONFIGURE SUB-SKILLS & SELF-RATED CONFIDENCE
            </h2>
            <span className="text-[11px] text-cyber-muted">Calibrate question range for chosen domains</span>
          </div>

          {selectedDomains.map((domainId) => {
            const dom = DOMAIN_METADATA[domainId];
            const isExpanded = expandedDomain === domainId;
            const currentSubSkills = selectedSubSkills[domainId] || [];
            const currentRating = domainRatings[domainId] || 'basic';
            const Icon = ICON_MAP[dom.iconName] || Code;

            return (
              <div key={domainId} className="cyber-panel border border-cyber-border rounded-lg overflow-hidden">
                {/* Header row */}
                <div
                  onClick={() => setExpandedDomain(isExpanded ? null : domainId)}
                  className="p-4 bg-[#0B1018] flex items-center justify-between cursor-pointer hover:bg-white/5 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-cyber-primary/10 border border-cyber-primary/30 rounded text-cyber-primary">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white">{dom.title}</h3>
                      <p className="text-[11px] text-cyber-muted">
                        Rating: <strong className="text-cyber-primary uppercase">{currentRating}</strong> • {currentSubSkills.length} sub-skills selected
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-cyber-primary hidden sm:inline">
                      {isExpanded ? 'Collapse' : 'Expand Sub-skills'}
                    </span>
                    {isExpanded ? <ChevronUp className="w-4 h-4 text-cyber-muted" /> : <ChevronDown className="w-4 h-4 text-cyber-muted" />}
                  </div>
                </div>

                {/* Expanded configuration body */}
                {isExpanded && (
                  <div className="p-5 bg-[#05070D] border-t border-cyber-border space-y-5 animate-fadeIn">
                    
                    {/* Self-Rating Selector */}
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-cyber-muted mb-2">
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
                              className={`py-2 px-3 text-xs uppercase font-bold rounded border transition-all ${
                                isLevelActive
                                  ? 'bg-cyber-primary text-black border-cyber-primary shadow-[0_0_12px_rgba(0,255,204,0.3)]'
                                  : 'bg-[#0B1018] border-cyber-border text-cyber-muted hover:text-white hover:border-cyber-primary/40'
                              }`}
                            >
                              {level}
                            </button>
                          );
                        })}
                      </div>
                      <p className="text-[10px] text-cyber-muted mt-1.5">
                        * Used to initialize baseline difficulty and evaluate self-perception vs demonstrated ability.
                      </p>
                    </div>

                    {/* Sub-skill Checkbox Groups */}
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-cyber-muted mb-2">
                        Which sub-skills have you genuinely worked with?
                      </p>
                      <div className="space-y-3">
                        {dom.subSkills.map((group, gIdx) => (
                          <div key={gIdx} className="p-3 bg-[#0B1018] border border-cyber-border rounded space-y-2">
                            <span className="text-[11px] font-bold text-cyber-primary uppercase tracking-wider block">
                              {group.groupName}
                            </span>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                              {group.items.map((item) => {
                                const isChecked = currentSubSkills.includes(item);
                                return (
                                  <label
                                    key={item}
                                    onClick={() => toggleSubSkill(domainId, item)}
                                    className={`p-2 rounded border text-xs flex items-center justify-between cursor-pointer transition-colors ${
                                      isChecked
                                        ? 'bg-cyber-primary/15 border-cyber-primary text-white'
                                        : 'bg-[#080C14] border-cyber-border/70 text-cyber-muted hover:text-white'
                                    }`}
                                  >
                                    <span className="truncate pr-2">{item}</span>
                                    <div className={`w-4 h-4 rounded border flex items-center justify-center text-[10px] font-bold shrink-0 ${isChecked ? 'bg-cyber-primary text-black border-cyber-primary' : 'border-cyber-border'}`}>
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
                        <label className="text-xs font-bold text-cyber-muted uppercase block mb-1.5">
                          Specify Other Technical Skills or Frameworks:
                        </label>
                        <input
                          type="text"
                          value={otherSkillText}
                          onChange={(e) => setOtherSkillText(e.target.value)}
                          placeholder="e.g. Flutter, Rust, Embedded C, Unreal Engine..."
                          className="w-full p-2.5 bg-[#080C14] border border-cyber-border rounded text-xs text-white placeholder-cyber-muted/50 focus:outline-none focus:border-cyber-primary font-mono"
                        />
                      </div>
                    )}

                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Step 4: Preferred Programming Language (if applicable) */}
        {requiresLanguageSelect && (
          <div className="cyber-panel p-5 border border-cyber-border rounded-lg space-y-3">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-cyber-primary text-black flex items-center justify-center text-xs font-bold">3</span>
              PRIMARY PROGRAMMING LANGUAGE FOR PRACTICAL TASKS
            </h2>
            <p className="text-xs text-cyber-muted">
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
                    className={`px-5 py-2.5 text-xs font-bold rounded border transition-all ${
                      isLangActive
                        ? 'bg-cyber-primary text-black border-cyber-primary shadow-[0_0_15px_rgba(0,255,204,0.3)]'
                        : 'bg-[#0B1018] border-cyber-border text-cyber-muted hover:text-white hover:border-cyber-primary/40'
                    }`}
                  >
                    {lang}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Step 3: Launch Assessment Sticky Footer Bar */}
        <div className="cyber-panel p-6 border-2 border-cyber-primary/60 rounded-lg flex flex-col md:flex-row items-center justify-between gap-4 bg-[#080C14] shadow-[0_0_30px_rgba(0,255,204,0.15)] sticky bottom-4 z-20">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 bg-cyber-primary/20 text-cyber-primary border border-cyber-primary/40 rounded">
                STEP 3: READY TO LAUNCH
              </span>
              <span className="text-[10px] text-cyber-muted">
                Mandatory Fullscreen Mode
              </span>
            </div>
            <h3 className="text-base font-bold text-white mt-1">START YOUR 25-MIN TECHNICAL TEST</h3>
            <p className="text-xs text-cyber-muted mt-0.5">
              {selectedDomains.length} domains selected • {Object.values(selectedSubSkills).flat().length} sub-skills covered • Calibrated multi-tier challenges
            </p>
          </div>

          <button
            onClick={handleStartRound2}
            className="w-full md:w-auto px-8 py-4 bg-cyber-primary hover:bg-white text-black font-extrabold text-xs uppercase tracking-wider rounded transition-all shadow-[0_0_25px_rgba(0,255,204,0.4)] flex items-center justify-center gap-2.5 cursor-pointer transform active:scale-95"
          >
            <Maximize2 className="w-4 h-4" />
            <span>ENTER FULLSCREEN & START TEST &rarr;</span>
          </button>
        </div>

      </div>
    </div>
  );
}
