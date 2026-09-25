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

export async function getAllAuditLogs(): Promise<AdminAuditLog[]> {
  return await db.auditLogs.reverse().toArray();
}
