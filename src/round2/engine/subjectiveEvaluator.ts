import type { OpenResponseRubric } from '../../types/round2';

export interface SubjectiveEvaluationResult {
  awardedScore: number;
  maxScore: number;
  percentage: number;
  matchedConcepts: string[];
  feedback: string;
}

export function evaluateSubjectiveAnswer(
  answer: string,
  rubric: OpenResponseRubric,
  maxPoints: number = 100
): SubjectiveEvaluationResult {
  const cleanAnswer = (answer || '').toLowerCase().trim();
  const wordCount = cleanAnswer ? cleanAnswer.split(/\s+/).length : 0;

  if (wordCount < 3) {
    return {
      awardedScore: 0,
      maxScore: maxPoints,
      percentage: 0,
      matchedConcepts: [],
      feedback: 'Answer is too brief to demonstrate technical understanding.'
    };
  }

  const matchedConcepts: string[] = [];
  const requiredGroups = rubric.requiredConcepts || [];
  let groupsSatisfied = 0;

  // Check required concept clusters
  for (const group of requiredGroups) {
    const matchedTerm = group.find((term) => cleanAnswer.includes(term.toLowerCase()));
    if (matchedTerm) {
      groupsSatisfied += 1;
      matchedConcepts.push(matchedTerm);
    }
  }

  // Base score from concept coverage (up to 80% of max points)
  const conceptRatio = requiredGroups.length > 0 ? groupsSatisfied / requiredGroups.length : 1;
  let score = conceptRatio * 80;

  // Word count adequacy check (up to 10%)
  const minWords = rubric.minWordCount || 10;
  if (wordCount >= minWords) {
    score += 10;
  } else {
    score += (wordCount / minWords) * 10;
  }

  // Bonus keywords (up to 10%)
  if (rubric.bonusKeywords && rubric.bonusKeywords.length > 0) {
    const bonusMatches = rubric.bonusKeywords.filter((kw) => cleanAnswer.includes(kw.toLowerCase()));
    if (bonusMatches.length > 0) {
      score += Math.min(10, bonusMatches.length * 5);
      matchedConcepts.push(...bonusMatches);
    }
  } else if (conceptRatio >= 0.8) {
    score += 10;
  }

  const finalScore = Math.min(maxPoints, Math.round((score / 100) * maxPoints));
  const percentage = Math.round((finalScore / maxPoints) * 100);

  let feedback = 'Technical concept adequately demonstrated.';
  if (percentage >= 85) {
    feedback = 'Strong conceptual explanation covering core technical fundamentals.';
  } else if (percentage >= 50) {
    feedback = 'Partial technical understanding shown; covered some key concepts.';
  } else {
    feedback = 'Incomplete conceptual coverage. Core technical relationships missing.';
  }

  return {
    awardedScore: finalScore,
    maxScore: maxPoints,
    percentage,
    matchedConcepts: Array.from(new Set(matchedConcepts)),
    feedback
  };
}
