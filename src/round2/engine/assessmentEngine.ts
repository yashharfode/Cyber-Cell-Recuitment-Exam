import type { 
  CandidateSkillProfile, 
  PersonalizedAssessmentBlueprint, 
  Round2Challenge, 
  AssessmentSection,
  Round2Domain
} from '../../types/round2';
import { ROUND2_CHALLENGES } from '../data/challenges';
import { PRACTICAL_TASKS } from '../data/practicalTasks';

export function generateAssessmentBlueprint(
  profile: CandidateSkillProfile
): PersonalizedAssessmentBlueprint {
  const selectedDomains = profile.selectedDomains.length > 0 ? profile.selectedDomains : (['WEB_DEVELOPMENT'] as Round2Domain[]);
  const targetTotalChallenges = 10;
  const maxScore = 1000;
  const timeLimitSeconds = 25 * 60; // 25 minutes

  const sections: AssessmentSection[] = [];
  const orderedChallengeIds: string[] = [];

  // Determine budget per domain
  const challengesPerDomain = Math.max(2, Math.floor(targetTotalChallenges / selectedDomains.length));
  let remainingBudget = targetTotalChallenges;

  for (let i = 0; i < selectedDomains.length; i++) {
    const domain = selectedDomains[i];
    const isLast = i === selectedDomains.length - 1;
    const countForThisDomain = isLast ? remainingBudget : Math.min(remainingBudget, challengesPerDomain);
    remainingBudget -= countForThisDomain;

    // Filter available challenges in this domain
    const domainPool = ROUND2_CHALLENGES.filter((c) => c.domain === domain);
    
    // Pick challenges across tiers: Knowledge -> Application -> Fill in the Blank -> Practical
    const picked: Round2Challenge[] = [];

    // 1. Knowledge
    const kChal = domainPool.find((c) => c.tier === 'knowledge');
    if (kChal) picked.push(kChal);

    // 2. Application
    const aChal = domainPool.find((c) => c.tier === 'application');
    if (aChal && picked.length < countForThisDomain) picked.push(aChal);

    // 3. Fill in the Blank (Interactive Letter Slots)
    const fitbChal = domainPool.find((c) => c.tier === 'fill_in_blank');
    if (fitbChal && picked.length < countForThisDomain) picked.push(fitbChal);

    // 4. Practical task (if practical task exists for domain, e.g. web, python, dsa)
    const practicalKey = Object.keys(PRACTICAL_TASKS).find((k) => PRACTICAL_TASKS[k].domain === domain);
    if (practicalKey && picked.length < countForThisDomain) {
      const pTask = PRACTICAL_TASKS[practicalKey];
      picked.push({
        id: `practical-${pTask.id}`,
        domain,
        subSkill: pTask.skill,
        tier: 'practical',
        difficulty: pTask.difficulty,
        title: `PRACTICAL // ${pTask.title.toUpperCase()}`,
        prompt: pTask.scenario,
        practicalTaskId: pTask.id,
        points: 100,
        timeLimitSeconds: pTask.timeLimitSeconds
      });
    }

    // Fill remaining if needed
    for (const c of domainPool) {
      if (picked.length >= countForThisDomain) break;
      if (!picked.some((p) => p.id === c.id)) {
        picked.push(c);
      }
    }

    sections.push({
      domain,
      challenges: picked,
      maxScore: picked.length * 100
    });

    picked.forEach((c) => orderedChallengeIds.push(c.id));
  }

  // Calculate blueprint hash for integrity & refresh survival
  const blueprintHash = `bp-${profile.candidateId}-${Date.now().toString(36)}-${orderedChallengeIds.length}`;

  return {
    version: '1.0.0',
    blueprintHash,
    candidateId: profile.candidateId,
    createdAt: new Date().toISOString(),
    totalChallenges: orderedChallengeIds.length,
    maxScore: orderedChallengeIds.length * 100 || maxScore,
    timeLimitSeconds,
    sections,
    orderedChallengeIds
  };
}
