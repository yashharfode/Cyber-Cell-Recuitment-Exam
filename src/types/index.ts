export type SkillCategory =
  | 'CYBERSECURITY'
  | 'NETWORKING'
  | 'PROGRAMMING'
  | 'WEB'
  | 'WEB_SECURITY'
  | 'LINUX'
  | 'LOGIC'
  | 'INVESTIGATION'
  | 'DECISION_MAKING'
  | 'TECHNICAL_AWARENESS'
  | 'APTITUDE'
  | 'GRAMMAR';

export type Difficulty = 'easy' | 'moderate' | 'hard' | 'advanced';

export type ChallengeType =
  | 'mcq'
  | 'multiSelect'
  | 'terminal'
  | 'code'
  | 'debug'
  | 'logic'
  | 'sequence'
  | 'decision'
  | 'logInvestigation';

export interface VisualCase {
  type: 'email' | 'sms' | 'wifi' | 'url' | 'explorer' | 'upi' | 'ransomware';
  title?: string;
  data: Record<string, any>;
}

export type InteractiveGameType =
  | 'network-builder'
  | 'match-pairs'
  | 'password-strength'
  | 'find-intruder'
  | 'phishing-hunter'
  | 'code-arranger'
  | 'binary-puzzle'
  | 'cipher-wheel'
  | 'digital-detective'
  | 'cyber-terminal';

export interface Challenge {
  id: string;
  type: ChallengeType;
  category: SkillCategory;
  skill: string;
  difficulty: Difficulty;
  points: number;
  timeLimit: number;
  title: string;
  prompt: string;
  context?: string;
  visualCase?: VisualCase;
  options?: string[];
  correctAnswer: any; // string, string[], number, or evaluation criteria
  explanation?: string;
  missionId: string;
  interactiveType?: InteractiveGameType;
  interactiveConfig?: Record<string, any>;
  metadata?: Record<string, any>;
  tags?: string[];
}

export interface Mission {
  id: string;
  sequence: number;
  title: string;
  briefing: string;
  objective: string;
  difficulty: Difficulty;
  challengeIds: string[];
  rewardXP: number;
  terminalHint?: string;
}

export interface Candidate {
  id: string;
  name: string;
  scholarNumber: string;
  email: string;
  password?: string;
  domain: 'Technical' | 'Graphic Design' | 'Media' | 'Management';
  preferredSkills?: string[];
  enabled: boolean;
  status?: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED' | 'FLAGGED' | 'DISQUALIFIED' | 'BLACKLISTED';
  replayAllowed?: boolean;
}

export interface ChallengeResult {
  challengeId: string;
  skill: SkillCategory;
  difficulty: Difficulty;
  correct: boolean;
  pointsEarned: number;
  timeSpentSeconds: number;
  userAnswer: any;
  timestamp: string;
}

export interface Attempt {
  id: string;
  candidateId: string;
  candidateName: string;
  scholarNumber: string;
  mode: 'demo' | 'recruitment';
  startedAt: string;
  completedAt?: string;
  score: number;
  xp: number;
  accuracy: number;
  status: 'not_started' | 'in_progress' | 'completed' | 'disqualified';
  currentMissionIndex: number;
  challengeResults: ChallengeResult[];
  skillScores: Record<SkillCategory, { total: number; correct: number; score: number }>;
  redFlagsCount: number;
}

export interface RedFlagEvent {
  id: string;
  attemptId: string;
  candidateId: string;
  type: 'FULLSCREEN_EXIT' | 'TAB_HIDDEN' | 'WINDOW_BLUR' | 'CAMERA_DISCONNECTED' | 'DEVTOOLS_SUSPECTED' | 'SUSPICIOUS_KEYSTROKE';
  severity: 'low' | 'medium' | 'high';
  timestamp: string;
  missionId?: string;
  challengeId?: string;
  metadata?: Record<string, any>;
}

export interface VolunteerReport {
  id: string;
  candidateId: string;
  candidateName: string;
  scholarNumber: string;
  volunteerId: string;
  timestamp: string;
  type: 'MOBILE_PHONE' | 'ANOTHER_DEVICE' | 'OUTSIDE_HELP' | 'DISCUSSION' | 'SUSPICIOUS_BEHAVIOR' | 'OTHER';
  note: string;
  status: 'pending' | 'reviewed' | 'actioned' | 'dismissed';
}

export interface CandidatePhoto {
  candidateId: string;
  dataUrl: string; // base64 or object URL for reliable browser preview/storage
  capturedAt: string;
  sizeBytes: number;
  syncStatus: 'local' | 'pending' | 'synced';
}

export interface AdminAuditLog {
  id: string;
  adminId: string;
  action: 'DISQUALIFY' | 'GRANT_REPLAY' | 'BLACKLIST' | 'FLAG' | 'DISMISS_FLAG' | 'PUBLISH_RESULTS' | 'TOGGLE_LEADERBOARD';
  candidateId?: string;
  timestamp: string;
  reason?: string;
  details?: Record<string, any>;
}
