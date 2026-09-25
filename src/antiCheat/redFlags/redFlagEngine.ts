import type { RedFlagEvent } from '../../types';
import { saveRedFlag } from '../../storage/indexedDb';

export type RedFlagCallback = (event: RedFlagEvent) => void;

class RedFlagEngine {
  private listeners: RedFlagCallback[] = [];
  private attemptId: string = '';
  private candidateId: string = '';
  private redFlagCount: number = 0;

  public initialize(attemptId: string, candidateId: string) {
    this.attemptId = attemptId;
    this.candidateId = candidateId;
    this.redFlagCount = 0;
  }

  public subscribe(cb: RedFlagCallback) {
    this.listeners.push(cb);
    return () => {
      this.listeners = this.listeners.filter(l => l !== cb);
    };
  }

  public recordEvent(
    type: RedFlagEvent['type'],
    severity: 'low' | 'medium' | 'high' = 'low',
    missionId?: string,
    metadata?: Record<string, any>
  ): RedFlagEvent {
    this.redFlagCount += severity === 'high' ? 3 : severity === 'medium' ? 2 : 1;
    const event: RedFlagEvent = {
      id: `rf-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      attemptId: this.attemptId || 'temp-attempt',
      candidateId: this.candidateId || 'guest',
      type,
      severity,
      timestamp: new Date().toISOString(),
      missionId,
      metadata
    };

    saveRedFlag(event).catch(console.error);
    this.listeners.forEach(cb => cb(event));
    return event;
  }

  public getCount(): number {
    return this.redFlagCount;
  }
}

export const redFlagEngine = new RedFlagEngine();
