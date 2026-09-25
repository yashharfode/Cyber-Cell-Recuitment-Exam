import Dexie, { type Table } from 'dexie';
import type { Attempt, RedFlagEvent, CandidatePhoto, VolunteerReport, AdminAuditLog } from '../types';

export class CyberCellDatabase extends Dexie {
  attempts!: Table<Attempt, string>;
  redFlags!: Table<RedFlagEvent, string>;
  photos!: Table<CandidatePhoto, string>;
  volunteerReports!: Table<VolunteerReport, string>;
  auditLogs!: Table<AdminAuditLog, string>;

  constructor() {
    super('CyberCellRecruitmentDB');
    this.version(1).stores({
      attempts: 'id, candidateId, mode, status, startedAt',
      redFlags: 'id, attemptId, candidateId, type, severity, timestamp',
      photos: 'candidateId, capturedAt, syncStatus',
      volunteerReports: 'id, candidateId, volunteerId, timestamp, type, status',
      auditLogs: 'id, adminId, action, candidateId, timestamp'
    });
  }
}

export const db = new CyberCellDatabase();

export async function saveAttempt(attempt: Attempt): Promise<void> {
  await db.attempts.put(attempt);
}

export async function getAttempt(id: string): Promise<Attempt | undefined> {
  return await db.attempts.get(id);
}

export async function getActiveAttemptForCandidate(candidateId: string): Promise<Attempt | undefined> {
  return await db.attempts
    .where('candidateId')
    .equals(candidateId)
    .and(att => att.status === 'in_progress')
    .first();
}

export async function saveRedFlag(event: RedFlagEvent): Promise<void> {
  await db.redFlags.put(event);
}

export async function getRedFlagsForAttempt(attemptId: string): Promise<RedFlagEvent[]> {
  return await db.redFlags.where('attemptId').equals(attemptId).toArray();
}

export async function savePhoto(photo: CandidatePhoto): Promise<void> {
  await db.photos.put(photo);
}

export async function getPhoto(candidateId: string): Promise<CandidatePhoto | undefined> {
  return await db.photos.get(candidateId);
}

export async function saveVolunteerReport(report: VolunteerReport): Promise<void> {
  await db.volunteerReports.put(report);
}

export async function getAllVolunteerReports(): Promise<VolunteerReport[]> {
  return await db.volunteerReports.reverse().toArray();
}

export async function saveAuditLog(log: AdminAuditLog): Promise<void> {
  await db.auditLogs.put(log);
}

export async function getAllAttempts(): Promise<Attempt[]> {
  const list = await db.attempts.toArray();
  return list.sort((a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime());
}

export async function getAllPhotos(): Promise<CandidatePhoto[]> {
  return await db.photos.toArray();
}

export async function getAllRedFlags(): Promise<RedFlagEvent[]> {
  const flags = await db.redFlags.toArray();
  return flags.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
}

export async function updateAttemptStatus(attemptId: string, status: any): Promise<void> {
  await db.attempts.update(attemptId, { status });
}

export async function deleteAttempt(attemptId: string): Promise<void> {
  await db.attempts.delete(attemptId);
  await db.redFlags.where('attemptId').equals(attemptId).delete();
}

export type { Attempt, RedFlagEvent, CandidatePhoto, VolunteerReport, AdminAuditLog };

export async function resetCandidateAttempt(candidateId: string): Promise<void> {
  const attempts = await db.attempts.where('candidateId').equals(candidateId).toArray();
  for (const att of attempts) {
    await db.attempts.delete(att.id);
    await db.redFlags.where('attemptId').equals(att.id).delete();
  }
}

export async function seedInitialDataIfEmpty(): Promise<void> {
  const count = await db.attempts.count();
  if (count === 0) {
    const mockBaseline: Attempt[] = [
      {
        id: 'att-live-101',
        candidateId: 'cand-001',
        candidateName: 'Yash Harfode',
        scholarNumber: '211112056',
        mode: 'recruitment',
        startedAt: new Date(Date.now() - 1800000).toISOString(),
        score: 1650,
        xp: 2200,
        accuracy: 94,
        status: 'completed',
        currentMissionIndex: 7,
        challengeResults: [],
        skillScores: {
          'Logical Thinking': { total: 4, correct: 4, score: 400 },
          'Programming & Syntax': { total: 4, correct: 4, score: 400 },
          'Web Security': { total: 4, correct: 3, score: 300 },
          'Network Forensics': { total: 4, correct: 4, score: 400 }
        } as any,
        redFlagsCount: 0
      },
      {
        id: 'att-live-102',
        candidateId: 'cand-002',
        candidateName: 'Rohan Sharma',
        scholarNumber: '221112011',
        mode: 'recruitment',
        startedAt: new Date(Date.now() - 2400000).toISOString(),
        score: 1350,
        xp: 1750,
        accuracy: 86,
        status: 'completed',
        currentMissionIndex: 6,
        challengeResults: [],
        skillScores: {
          'Logical Thinking': { total: 4, correct: 3, score: 300 },
          'Programming & Syntax': { total: 4, correct: 4, score: 400 }
        } as any,
        redFlagsCount: 1
      },
      {
        id: 'att-live-103',
        candidateId: 'cand-003',
        candidateName: 'Aditi Verma',
        scholarNumber: '231112089',
        mode: 'recruitment',
        startedAt: new Date(Date.now() - 900000).toISOString(),
        score: 650,
        xp: 800,
        accuracy: 78,
        status: 'in_progress',
        currentMissionIndex: 3,
        challengeResults: [],
        skillScores: {} as any,
        redFlagsCount: 2
      }
    ];

    for (const att of mockBaseline) {
      await db.attempts.put(att);
    }

    await db.redFlags.put({
      id: 'rf-seed-1',
      attemptId: 'att-live-103',
      candidateId: 'cand-003',
      type: 'TAB_HIDDEN',
      severity: 'medium',
      timestamp: new Date(Date.now() - 600000).toISOString(),
      metadata: { reason: 'User switched window/tab during question' }
    });
  }
}
