import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Candidate, Challenge, ChallengeResult, Attempt } from '../types';
import { missions } from '../data/missions';
import { challenges } from '../data/challenges';
import { saveAttempt } from '../storage/indexedDb';

export interface GameState {
  candidate: Candidate | null;
  mode: 'demo' | 'recruitment' | null;
  attemptId: string | null;
  score: number;
  xp: number;
  accuracy: number;
  currentMissionIndex: number;
  completedMissionIds: string[];
  activeChallenge: Challenge | null;
  antiCheatFlags: number;
  timeRemainingSeconds: number;
  isPaused: boolean;
  warningNotice: { message: string; severity: 'low' | 'medium' | 'high' } | null;
  skillScores: Record<string, { total: number; correct: number; score: number }>;
  challengeResults: ChallengeResult[];
  isRound1Submitted: boolean;

  // Actions
  setCandidate: (candidate: Candidate | null) => void;
  setMode: (mode: 'demo' | 'recruitment') => void;
  startAttempt: () => void;
  setActiveChallenge: (challenge: Challenge | null) => void;
  submitChallengeAnswer: (challengeId: string, answer: any, timeSpentSeconds: number) => { isCorrect: boolean; points: number; xp: number };
  penalizeAndSkipChallenge: (challengeId: string, penaltyPoints?: number) => void;
  advanceMission: () => boolean; // returns true if more missions, false if game completed
  flagCheat: (severity?: 'low' | 'medium' | 'high') => void;
  setWarningNotice: (notice: { message: string; severity: 'low' | 'medium' | 'high' } | null) => void;
  decrementTimer: () => void;
  setPaused: (isPaused: boolean) => void;
  setRound1Submitted: (submitted: boolean) => void;
  reset: () => void;
  restoreFromAttempt: (attempt: Attempt) => void;
}

const initialSkillScores: Record<string, { total: number; correct: number; score: number }> = {
  CYBERSECURITY: { total: 0, correct: 0, score: 0 },
  NETWORKING: { total: 0, correct: 0, score: 0 },
  PROGRAMMING: { total: 0, correct: 0, score: 0 },
  WEB: { total: 0, correct: 0, score: 0 },
  WEB_SECURITY: { total: 0, correct: 0, score: 0 },
  LINUX: { total: 0, correct: 0, score: 0 },
  LOGIC: { total: 0, correct: 0, score: 0 },
  INVESTIGATION: { total: 0, correct: 0, score: 0 },
  DECISION_MAKING: { total: 0, correct: 0, score: 0 },
  TECHNICAL_AWARENESS: { total: 0, correct: 0, score: 0 },
  APTITUDE: { total: 0, correct: 0, score: 0 },
  GRAMMAR: { total: 0, correct: 0, score: 0 },
};

export const useStore = create<GameState>()(
  persist(
    (set, get) => ({
      candidate: null,
      mode: null,
      attemptId: null,
      score: 0,
      xp: 0,
      accuracy: 100,
      currentMissionIndex: 0,
      completedMissionIds: [],
      activeChallenge: null,
      antiCheatFlags: 0,
      timeRemainingSeconds: 2700, // 45 minutes default (PRD Section 18)
      isPaused: false,
      warningNotice: null,
      skillScores: { ...initialSkillScores },
      challengeResults: [],
      isRound1Submitted: typeof window !== 'undefined' ? (localStorage.getItem('r1_submitted') === 'true' || sessionStorage.getItem('r1_submitted') === 'true') : false,

      setCandidate: (candidate) => set({ candidate }),
      setMode: (mode) => set({ mode }),

      startAttempt: () => {
        const id = `att-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
        set({
          attemptId: id,
          score: 0,
          xp: 0,
          accuracy: 100,
          currentMissionIndex: 0,
          completedMissionIds: [],
          antiCheatFlags: 0,
          timeRemainingSeconds: 2700,
          skillScores: { ...initialSkillScores },
          challengeResults: [],
          isRound1Submitted: false
        });

        // Persist attempt in IndexedDB
        const cand = get().candidate;
        if (cand) {
          saveAttempt({
            id,
            candidateId: cand.id,
            candidateName: cand.name,
            scholarNumber: cand.scholarNumber,
            mode: get().mode || 'recruitment',
            startedAt: new Date().toISOString(),
            score: 0,
            xp: 0,
            accuracy: 100,
            status: 'in_progress',
            currentMissionIndex: 0,
            challengeResults: [],
            skillScores: { ...initialSkillScores } as any,
            redFlagsCount: 0
          }).catch(console.error);
        }
      },

      setActiveChallenge: (challenge) => set({ activeChallenge: challenge }),

      submitChallengeAnswer: (challengeId, answer, timeSpentSeconds) => {
        const challenge = challenges.find((c) => c.id === challengeId);
        if (!challenge) return { isCorrect: false, points: 0, xp: 0 };

        // Evaluate answer
        let isCorrect = false;
        if (challenge.type === 'multiSelect') {
          if (Array.isArray(answer) && Array.isArray(challenge.correctAnswer)) {
            const sortedAns = [...answer].sort();
            const sortedExpected = [...challenge.correctAnswer].sort();
            isCorrect = JSON.stringify(sortedAns) === JSON.stringify(sortedExpected);
          }
        } else if (challenge.type === 'sequence') {
          if (Array.isArray(answer) && Array.isArray(challenge.correctAnswer)) {
            isCorrect = JSON.stringify(answer) === JSON.stringify(challenge.correctAnswer);
          }
        } else {
          const normAns = String(answer).trim().toLowerCase();
          const normExpected = String(challenge.correctAnswer).trim().toLowerCase();
          isCorrect = normAns === normExpected || 
                      (normAns.length > 0 && (normExpected.startsWith(normAns + '.') || normExpected.startsWith(normAns + ' ') || normAns.startsWith(normExpected.slice(0, 2))));
        }

        const state = get();
        const pointsEarned = isCorrect ? challenge.points : 0;
        const xpEarned = isCorrect
          ? challenge.difficulty === 'advanced'
            ? 250
            : challenge.difficulty === 'hard'
            ? 175
            : challenge.difficulty === 'moderate'
            ? 100
            : 50
          : 0;

        const newScore = state.score + pointsEarned;
        const newXp = state.xp + xpEarned;

        const result: ChallengeResult = {
          challengeId,
          skill: challenge.category,
          difficulty: challenge.difficulty,
          correct: isCorrect,
          pointsEarned,
          timeSpentSeconds,
          userAnswer: answer,
          timestamp: new Date().toISOString(),
        };

        const updatedResults = [...state.challengeResults, result];
        const correctCount = updatedResults.filter((r) => r.correct).length;
        const newAccuracy = Math.round((correctCount / updatedResults.length) * 100);

        // Update skill metrics
        const updatedSkills = { ...state.skillScores };
        const cat = challenge.category;
        if (!updatedSkills[cat]) {
          updatedSkills[cat] = { total: 0, correct: 0, score: 0 };
        }
        updatedSkills[cat].total += 1;
        if (isCorrect) {
          updatedSkills[cat].correct += 1;
          updatedSkills[cat].score += pointsEarned;
        }

        set({
          score: newScore,
          xp: newXp,
          accuracy: newAccuracy,
          challengeResults: updatedResults,
          skillScores: updatedSkills,
        });

        // Persist to IndexedDB
        if (state.candidate && state.attemptId) {
          saveAttempt({
            id: state.attemptId,
            candidateId: state.candidate.id,
            candidateName: state.candidate.name,
            scholarNumber: state.candidate.scholarNumber,
            mode: state.mode || 'recruitment',
            startedAt: new Date().toISOString(),
            score: newScore,
            xp: newXp,
            accuracy: newAccuracy,
            status: 'in_progress',
            currentMissionIndex: state.currentMissionIndex,
            challengeResults: updatedResults,
            skillScores: updatedSkills as any,
            redFlagsCount: state.antiCheatFlags
          }).catch(console.error);
        }

        return { isCorrect, points: pointsEarned, xp: xpEarned };
      },

      penalizeAndSkipChallenge: (challengeId, penaltyPoints = 50) => {
        const challenge = challenges.find((c) => c.id === challengeId);
        const state = get();
        if (!challenge) return;

        const newScore = Math.max(0, state.score - penaltyPoints);
        const newFlags = state.antiCheatFlags + 1;

        const result: ChallengeResult = {
          challengeId,
          skill: challenge.category,
          difficulty: challenge.difficulty,
          correct: false,
          pointsEarned: -penaltyPoints,
          timeSpentSeconds: 0,
          userAnswer: '[SKIPPED DUE TO FULLSCREEN VIOLATION]',
          timestamp: new Date().toISOString(),
        };

        const updatedResults = [...state.challengeResults, result];
        const correctCount = updatedResults.filter((r) => r.correct).length;
        const newAccuracy = Math.round((correctCount / updatedResults.length) * 100);

        const updatedSkills = { ...state.skillScores };
        const cat = challenge.category;
        if (!updatedSkills[cat]) {
          updatedSkills[cat] = { total: 0, correct: 0, score: 0 };
        }
        updatedSkills[cat].total += 1;

        set({
          score: newScore,
          accuracy: newAccuracy,
          antiCheatFlags: newFlags,
          challengeResults: updatedResults,
          skillScores: updatedSkills,
          activeChallenge: null
        });

        // Persist to IndexedDB
        if (state.candidate && state.attemptId) {
          saveAttempt({
            id: state.attemptId,
            candidateId: state.candidate.id,
            candidateName: state.candidate.name,
            scholarNumber: state.candidate.scholarNumber,
            mode: state.mode || 'recruitment',
            startedAt: new Date().toISOString(),
            score: newScore,
            xp: state.xp,
            accuracy: newAccuracy,
            status: 'in_progress',
            currentMissionIndex: state.currentMissionIndex,
            challengeResults: updatedResults,
            skillScores: updatedSkills as any,
            redFlagsCount: newFlags
          }).catch(console.error);
        }
      },

      advanceMission: () => {
        const state = get();
        const nextIndex = state.currentMissionIndex + 1;
        const currentMission = missions[state.currentMissionIndex];
        const updatedCompleted = currentMission ? [...state.completedMissionIds, currentMission.id] : state.completedMissionIds;

        if (nextIndex < missions.length) {
          // Mission completion bonus XP
          const bonusXP = currentMission ? currentMission.rewardXP : 100;
          set({
            currentMissionIndex: nextIndex,
            completedMissionIds: updatedCompleted,
            xp: state.xp + bonusXP,
            activeChallenge: null
          });
          return true;
        } else {
          set({
            completedMissionIds: updatedCompleted,
            activeChallenge: null
          });
          return false;
        }
      },

      flagCheat: (severity = 'low') => {
        const inc = severity === 'high' ? 3 : severity === 'medium' ? 2 : 1;
        set((s) => ({ antiCheatFlags: s.antiCheatFlags + inc }));
      },

      setWarningNotice: (notice) => set({ warningNotice: notice }),
      decrementTimer: () => set((s) => ({ timeRemainingSeconds: Math.max(0, s.timeRemainingSeconds - 1) })),
      setPaused: (isPaused) => set({ isPaused }),
      setRound1Submitted: (submitted) => {
        if (typeof window !== 'undefined') {
          sessionStorage.setItem('r1_submitted', submitted ? 'true' : 'false');
          localStorage.setItem('r1_submitted', submitted ? 'true' : 'false');
        }
        set({ isRound1Submitted: submitted });
      },

      reset: () => {
        if (typeof window !== 'undefined') {
          sessionStorage.removeItem('r1_submitted');
          localStorage.removeItem('r1_submitted');
          sessionStorage.removeItem('r2_profile');
          sessionStorage.removeItem('r2_blueprint');
          sessionStorage.removeItem('r2_result');
        }
        set({
          candidate: null,
          mode: null,
          attemptId: null,
          score: 0,
          xp: 0,
          accuracy: 100,
          currentMissionIndex: 0,
          completedMissionIds: [],
          activeChallenge: null,
          antiCheatFlags: 0,
          timeRemainingSeconds: 2700,
          isPaused: false,
          warningNotice: null,
          skillScores: { ...initialSkillScores },
          challengeResults: [],
          isRound1Submitted: false
        });
      },

      restoreFromAttempt: (attempt) =>
        set({
          attemptId: attempt.id,
          mode: attempt.mode,
          score: attempt.score,
          xp: attempt.xp,
          accuracy: attempt.accuracy,
          currentMissionIndex: attempt.currentMissionIndex,
          challengeResults: attempt.challengeResults,
          skillScores: attempt.skillScores as any,
          antiCheatFlags: attempt.redFlagsCount
        }),
    }),
    {
      name: 'cyber-cell-session-v2',
    }
  )
);
