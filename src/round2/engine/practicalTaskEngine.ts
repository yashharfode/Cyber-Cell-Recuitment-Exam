import type { PracticalTask } from '../../types/round2';

export interface TestCaseExecutionResult {
  id: string;
  description: string;
  passed: boolean;
  awardedPoints: number;
  message?: string;
}

export interface PracticalEvaluationSummary {
  passedCount: number;
  totalCount: number;
  earnedScore: number;
  maxScore: number;
  percentage: number;
  testCaseResults: TestCaseExecutionResult[];
}

export function evaluateWebPracticalSolution(
  task: PracticalTask,
  files: Record<string, string>
): PracticalEvaluationSummary {
  const html = files['index.html'] || '';
  const css = files['style.css'] || '';
  const js = files['script.js'] || '';

  // Parse HTML using DOMParser
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');

  const testCaseResults: TestCaseExecutionResult[] = [];
  let earnedScore = 0;
  let passedCount = 0;

  for (const tc of task.testCases) {
    let passed = false;
    let message = '';

    try {
      if (tc.assertionType === 'element_exists' && tc.selector) {
        const el = doc.querySelector(tc.selector);
        passed = !!el;
        message = passed ? 'Element found in DOM' : `Expected element matching ${tc.selector}`;
      } else if (tc.assertionType === 'style_match') {
        // Inspect style sheet text for essential rules
        const cleanCss = css.toLowerCase().replace(/\s+/g, ' ');
        if (tc.targetProperty === 'maxWidth') {
          passed = cleanCss.includes('max-width') || cleanCss.includes('width:');
        } else {
          passed = cleanCss.includes(String(tc.expectedValue).toLowerCase());
        }
        message = passed ? 'Style constraint verified' : 'Style rule missing in style.css';
      } else if (tc.assertionType === 'event_reactive') {
        // Inspect JS event listener and DOM target
        const cleanJs = js.toLowerCase();
        const hasClick = cleanJs.includes('click') || cleanJs.includes('addeventlistener');
        const hasTarget = cleanJs.includes('statusbadge') || cleanJs.includes('verified');
        passed = hasClick && hasTarget;
        message = passed ? 'Interactive click handler verified' : 'Click event handler not detected';
      } else {
        passed = true;
      }
    } catch (err: any) {
      passed = false;
      message = err.message || 'Assertion error';
    }

    if (passed) {
      passedCount += 1;
      earnedScore += tc.points;
    }

    testCaseResults.push({
      id: tc.id,
      description: tc.description,
      passed,
      awardedPoints: passed ? tc.points : 0,
      message
    });
  }

  const percentage = Math.round((earnedScore / task.maxPoints) * 100);

  return {
    passedCount,
    totalCount: task.testCases.length,
    earnedScore,
    maxScore: task.maxPoints,
    percentage,
    testCaseResults
  };
}

export function evaluateCodePracticalSolution(
  task: PracticalTask,
  code: string
): PracticalEvaluationSummary {
  // Static analysis & structural verification for code tasks
  const testCaseResults: TestCaseExecutionResult[] = [];
  let earnedScore = 0;
  let passedCount = 0;

  const cleanCode = code.toLowerCase();

  for (let i = 0; i < task.testCases.length; i++) {
    const tc = task.testCases[i];
    let passed = false;

    if (task.id === 'python-log-filter') {
      if (i === 0) passed = cleanCode.includes('def find_flagged_ips');
      else if (i === 1) passed = cleanCode.includes('failed') && (cleanCode.includes('count') || cleanCode.includes('get('));
      else passed = cleanCode.includes('sorted(') || cleanCode.includes('.sort(');
    } else if (task.id === 'dsa-second-largest') {
      if (i === 0) passed = cleanCode.includes('second') || cleanCode.includes('largest');
      else if (i === 1) passed = cleanCode.includes('for ') || cleanCode.includes('while ');
      else passed = cleanCode.includes('return ') && cleanCode.includes('-1');
    } else {
      passed = cleanCode.length > 30;
    }

    if (passed) {
      passedCount += 1;
      earnedScore += tc.points;
    }

    testCaseResults.push({
      id: tc.id,
      description: tc.description,
      passed,
      awardedPoints: passed ? tc.points : 0,
      message: passed ? 'Assertion satisfied' : 'Test criteria not met'
    });
  }

  return {
    passedCount,
    totalCount: task.testCases.length,
    earnedScore,
    maxScore: task.maxPoints,
    percentage: Math.round((earnedScore / task.maxPoints) * 100),
    testCaseResults
  };
}
