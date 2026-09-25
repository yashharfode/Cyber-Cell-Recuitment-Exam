export type Round2Domain =
  | 'PROGRAMMING'
  | 'WEB_DEVELOPMENT'
  | 'DSA'
  | 'CYBERSECURITY'
  | 'NETWORKING'
  | 'DATABASE_SQL'
  | 'LINUX_CLI'
  | 'GIT_GITHUB'
  | 'CLOUD_DEVOPS'
  | 'OTHER';

export type SkillSelfRating = 'beginner' | 'basic' | 'intermediate' | 'advanced';

export type ChallengeTier = 'knowledge' | 'application' | 'fill_in_blank' | 'practical' | 'subjective';

export interface FillInTheBlankConfig {
  targetWord: string;
  acceptedAnswers?: string[];
  hint?: string;
  displayTemplate?: string;
}

export interface SubSkillItem {
  id: string;
  name: string;
  category: string;
}

export interface DomainMeta {
  id: Round2Domain;
  title: string;
  tagline: string;
  description: string;
  iconName: string;
  subSkills: {
    groupName: string;
    items: string[];
  }[];
  languagesAllowed?: string[];
}

export interface CandidateSkillProfile {
  candidateId: string;
  selectedDomains: Round2Domain[];
  domainRatings: Record<Round2Domain, SkillSelfRating>;
  selectedSubSkills: Record<Round2Domain, string[]>;
  preferredLanguage?: string;
  otherSkillText?: string;
  updatedAt: string;
}

export interface OpenResponseRubric {
  requiredConcepts: string[][]; // Array of concept synonym groups (e.g. [['instruction', 'command'], ['computer', 'machine']])
  minWordCount?: number;
  bonusKeywords?: string[];
  sampleGoodAnswer?: string;
}

export interface PracticalFile {
  name: string;
  language: 'html' | 'css' | 'javascript' | 'python' | 'cpp' | 'java';
  content: string;
  readOnly?: boolean;
}

export interface PracticalTestCase {
  id: string;
  description: string;
  isHidden?: boolean;
  selector?: string; // For web DOM assertions
  assertionType: 'element_exists' | 'class_present' | 'style_match' | 'event_reactive' | 'output_exact' | 'regex_match';
  targetProperty?: string;
  expectedValue?: any;
  points: number;
}

export interface PracticalTask {
  id: string;
  title: string;
  domain: Round2Domain;
  skill: string;
  language?: string;
  difficulty: 'easy' | 'moderate' | 'hard' | 'advanced';
  scenario: string;
  requirements: string[];
  starterFiles: PracticalFile[];
  testCases: PracticalTestCase[];
  rubricWeights: {
    functional: number;
    visualLayout?: number;
    responsiveness?: number;
    codeQuality: number;
  };
  maxPoints: number;
  timeLimitSeconds: number;
}

export interface Round2Challenge {
  id: string;
  domain: Round2Domain;
  subSkill: string;
  tier: ChallengeTier;
  difficulty: 'easy' | 'moderate' | 'hard' | 'advanced';
  title: string;
  prompt: string;
  codeSnippet?: {
    language: string;
    code: string;
  };
  options?: string[]; // For Knowledge/Application MCQs
  correctAnswer?: any;
  explanation?: string;
  fillInBlank?: FillInTheBlankConfig; // For fill_in_blank tier
  rubric?: OpenResponseRubric; // For legacy subjective if needed
  practicalTaskId?: string; // For practical
  points: number;
  timeLimitSeconds: number;
}

export interface AssessmentSection {
  domain: Round2Domain;
  challenges: Round2Challenge[];
  maxScore: number;
}

export interface PersonalizedAssessmentBlueprint {
  version: string;
  blueprintHash: string;
  candidateId: string;
  createdAt: string;
  totalChallenges: number;
  maxScore: number;
  timeLimitSeconds: number;
  sections: AssessmentSection[];
  orderedChallengeIds: string[];
}

export interface ChallengeSubmission {
  challengeId: string;
  domain: Round2Domain;
  tier: ChallengeTier;
  userAnswer: any;
  awardedScore: number;
  maxScore: number;
  isCorrect?: boolean;
  matchedConcepts?: string[];
  practicalResult?: {
    passedCount: number;
    totalCount: number;
    testCaseResults: { id: string; description: string; passed: boolean }[];
    code: Record<string, string>;
  };
  timeSpentSeconds: number;
  timestamp: string;
}

export type SkillAssessmentStatus = 'NOT_ASSESSED' | 'ASSESSED';

export interface DomainProficiencyScore {
  domain: Round2Domain;
  status: SkillAssessmentStatus;
  claimedLevel?: SkillSelfRating;
  knowledgeScore: number | null; // 0-100 or null if not assessed
  applicationScore: number | null;
  practicalScore: number | null;
  overallDemonstrated: number | null;
  demonstratedBand?: 'Beginner' | 'Basic' | 'Intermediate' | 'Advanced' | 'Mastery';
  challengesCount: number;
}

export interface TechnicalProfileResult {
  round2AttemptId: string;
  candidateId: string;
  candidateName: string;
  scholarNumber: string;
  completedAt: string;
  totalScoreEarned: number;
  maxScorePossible: number;
  percentage: number;
  domainScores: Record<Round2Domain, DomainProficiencyScore>;
  primaryStrength: string;
  secondaryStrength?: string;
  emergingStrength?: string;
  submissions: ChallengeSubmission[];
}
