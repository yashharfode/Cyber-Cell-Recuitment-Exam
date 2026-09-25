import type { Mission } from '../types';

export const missions: Mission[] = [
  {
    id: 'm1',
    sequence: 1,
    title: 'LEVEL 1: LOGICAL THINKING & PATTERNS',
    briefing: 'Test pattern recognition, deduction, and constraint solving to initialize SOC authorization.',
    objective: 'Solve 6 logical thinking and sequence puzzles',
    difficulty: 'easy',
    challengeIds: ['c-q01', 'c-q02', 'c-q03', 'c-q04', 'c-q05', 'c-q06'],
    rewardXP: 150,
    terminalHint: 'Identify number patterns, logic rules, and deductions.'
  },
  {
    id: 'm2',
    sequence: 2,
    title: 'LEVEL 2: COMPUTER & HARDWARE BASICS',
    briefing: 'Assess core understanding of memory, storage, operating systems, and network adapters.',
    objective: 'Demonstrate essential hardware and system awareness',
    difficulty: 'easy',
    challengeIds: ['c-q07', 'c-q08', 'c-q09', 'c-q10', 'c-q11'],
    rewardXP: 150,
    terminalHint: 'Differentiate between volatile RAM, permanent storage, and network components.'
  },
  {
    id: 'm3',
    sequence: 3,
    title: 'LEVEL 3: PROGRAMMING & CODING LOGIC',
    briefing: 'Evaluate code tracing, output prediction, condition evaluation, and syntax debugging.',
    objective: 'Analyze Python snippets and algorithm execution flows',
    difficulty: 'moderate',
    challengeIds: ['c-q12', 'c-q13', 'c-q14', 'c-q15', 'c-q16'],
    rewardXP: 200,
    terminalHint: 'Trace variable values step-by-step through arithmetic and conditional branches.'
  },
  {
    id: 'm4',
    sequence: 4,
    title: 'LEVEL 4: WEB & INTERNET BASICS',
    briefing: 'Examine web browser mechanics, encryption protocols (HTTPS), and internet fundamentals.',
    objective: 'Verify web architecture and secure communication understanding',
    difficulty: 'moderate',
    challengeIds: ['c-q17', 'c-q18', 'c-q19'],
    rewardXP: 150,
    terminalHint: 'Recall standard browser functions and security indicators in URLs.'
  },
  {
    id: 'm5',
    sequence: 5,
    title: 'LEVEL 5: CYBERSECURITY ESSENTIALS',
    briefing: 'Investigate urgent phishing emails, password complexity, unexpected login alerts, and MFA.',
    objective: 'Defend against common cyber social engineering threats',
    difficulty: 'moderate',
    challengeIds: ['c-q20', 'c-q21', 'c-q22', 'c-q23', 'c-q24'],
    rewardXP: 200,
    terminalHint: 'Prioritize credential protection and multi-factor verification.'
  },
  {
    id: 'm6',
    sequence: 6,
    title: 'LEVEL 6: OBSERVATION & LOG INVESTIGATION',
    briefing: 'Inspect access logs, detect disguised malicious executables, and correlate anomalous IP addresses.',
    objective: 'Pinpoint suspicious telemetry records in incident files',
    difficulty: 'hard',
    challengeIds: ['c-q25', 'c-q26', 'c-q27'],
    rewardXP: 200,
    terminalHint: 'Look for failed-then-success login sequences and disguised .exe file extensions.'
  },
  {
    id: 'm7',
    sequence: 7,
    title: 'LEVEL 7: TROUBLESHOOTING & DECISION MAKING',
    briefing: 'Address sudden service failures and accidental deletion incidents with sound engineering judgment.',
    objective: 'Select optimal recovery procedures during technical interruptions',
    difficulty: 'hard',
    challengeIds: ['c-q28', 'c-q29'],
    rewardXP: 150,
    terminalHint: 'Isolate single points of failure before taking irreversible actions.'
  },
  {
    id: 'm8',
    sequence: 8,
    title: 'LEVEL 8: TECHNICAL COMMUNICATION',
    briefing: 'Formulate an objective, professional incident description for academic leadership.',
    objective: 'Deliver clear executive technical reporting',
    difficulty: 'easy',
    challengeIds: ['c-q30'],
    rewardXP: 100,
    terminalHint: 'Choose clear, factual technical phrasing over informal slang.'
  }
];
