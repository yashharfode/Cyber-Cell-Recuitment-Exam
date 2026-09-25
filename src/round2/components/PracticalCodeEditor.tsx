import { useState } from 'react';
import type { PracticalTask } from '../../types/round2';
import WebPreview from './WebPreview';
import { 
  evaluateWebPracticalSolution, 
  evaluateCodePracticalSolution,
  type PracticalEvaluationSummary 
} from '../engine/practicalTaskEngine';
import { 
  Code, 
  Play, 
  RotateCcw, 
  CheckCircle2, 
  XCircle, 
  Send, 
  Clock, 
  FileCode,
  Sparkles,
  Terminal
} from 'lucide-react';

interface PracticalCodeEditorProps {
  task: PracticalTask;
  onSubmit: (score: number, evaluation: PracticalEvaluationSummary, files: Record<string, string>) => void;
  secondsRemaining: number;
}

export default function PracticalCodeEditor({
  task,
  onSubmit,
  secondsRemaining
}: PracticalCodeEditorProps) {
  // Initialize files dictionary from starterFiles
  const [files, setFiles] = useState<Record<string, string>>(() => {
    const map: Record<string, string> = {};
    task.starterFiles.forEach(f => {
      map[f.name] = f.content;
    });
    return map;
  });

  const [activeFileName, setActiveFileName] = useState<string>(task.starterFiles[0]?.name || 'index.html');
  const [showConfirmReset, setShowConfirmReset] = useState(false);
  const [testSummary, setTestSummary] = useState<PracticalEvaluationSummary | null>(null);
  const [isRunningTests, setIsRunningTests] = useState(false);

  const isWebTask = task.domain === 'WEB_DEVELOPMENT';

  const handleCodeChange = (val: string) => {
    setFiles(prev => ({
      ...prev,
      [activeFileName]: val
    }));
  };

  const handleReset = () => {
    const map: Record<string, string> = {};
    task.starterFiles.forEach(f => {
      map[f.name] = f.content;
    });
    setFiles(map);
    setShowConfirmReset(false);
    setTestSummary(null);
  };

  const handleRunTests = () => {
    setIsRunningTests(true);
    let summary: PracticalEvaluationSummary;

    if (isWebTask) {
      summary = evaluateWebPracticalSolution(task, files);
    } else {
      const mainFileContent = files[activeFileName] || Object.values(files)[0] || '';
      summary = evaluateCodePracticalSolution(task, mainFileContent);
    }

    setTestSummary(summary);
    setIsRunningTests(false);
  };

  const handleSubmit = () => {
    let summary = testSummary;
    if (!summary) {
      if (isWebTask) {
        summary = evaluateWebPracticalSolution(task, files);
      } else {
        const mainFileContent = files[activeFileName] || Object.values(files)[0] || '';
        summary = evaluateCodePracticalSolution(task, mainFileContent);
      }
    }
    onSubmit(summary.earnedScore, summary, files);
  };

  return (
    <div className="w-full max-w-6xl cyber-panel border border-cyber-primary/40 flex flex-col h-[90vh] shadow-[0_0_60px_rgba(0,255,204,0.15)] rounded-lg font-mono-cyber overflow-hidden animate-scaleIn">
      
      {/* Top Header Bar */}
      <div className="bg-[#0B1018] px-4 py-3 border-b border-cyber-border flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-cyber-primary/10 border border-cyber-primary/40 rounded">
            <Code className="w-5 h-5 text-cyber-primary" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 bg-cyber-primary/20 text-cyber-primary border border-cyber-primary/30 rounded">
                TIER 4 • PRACTICAL LAB
              </span>
              <span className="text-[10px] text-cyber-muted uppercase">
                {task.domain} • {task.difficulty}
              </span>
            </div>
            <h2 className="text-base md:text-lg font-bold text-white tracking-wide mt-0.5">
              {task.title}
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1 bg-cyber-panel-secondary border border-cyber-border text-xs rounded">
            <Clock className="w-4 h-4 text-cyber-warning" />
            <span className={secondsRemaining < 60 ? 'text-cyber-danger font-bold animate-pulse' : 'text-cyber-text'}>
              {Math.floor(secondsRemaining / 60)}:{(secondsRemaining % 60).toString().padStart(2, '0')}
            </span>
          </div>
          <div className="text-xs px-3 py-1 bg-cyber-primary text-black font-bold rounded">
            +{task.maxPoints} PTS
          </div>
        </div>
      </div>

      {/* Main Workspace Layout (2 columns for web task, single column with test drawer for code) */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        
        {/* Left Column: Requirements & Code Editor */}
        <div className={`flex flex-col border-r border-cyber-border ${isWebTask ? 'w-full md:w-1/2' : 'w-full'}`}>
          
          {/* Scenario & Requirements Collapsible Box */}
          <div className="p-3 bg-[#05070D] border-b border-cyber-border text-xs space-y-1.5 max-h-36 overflow-y-auto">
            <p className="text-white font-bold flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-cyber-primary" />
              TASK REQUIREMENTS:
            </p>
            <ul className="text-slate-300 space-y-1 list-none pl-1 text-[11px]">
              {task.requirements.map((req, idx) => (
                <li key={idx} className="flex items-start gap-1.5">
                  <span className="text-cyber-primary">▸</span>
                  <span>{req}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* File Tabs Bar */}
          <div className="bg-[#080C14] px-2 pt-2 border-b border-cyber-border flex items-center justify-between">
            <div className="flex items-center gap-1">
              {task.starterFiles.map((f) => (
                <button
                  key={f.name}
                  onClick={() => setActiveFileName(f.name)}
                  className={`px-3 py-1.5 text-xs font-bold rounded-t flex items-center gap-1.5 border-t border-x transition-colors ${
                    activeFileName === f.name
                      ? 'bg-[#0B1018] border-cyber-primary text-cyber-primary'
                      : 'border-transparent text-cyber-muted hover:text-white'
                  }`}
                >
                  <FileCode className="w-3.5 h-3.5" />
                  <span>{f.name}</span>
                </button>
              ))}
            </div>

            <div className="flex items-center gap-1.5 pb-1">
              <button
                type="button"
                onClick={() => setShowConfirmReset(true)}
                className="px-2.5 py-1 text-[11px] text-cyber-muted hover:text-cyber-danger border border-cyber-border hover:border-cyber-danger rounded transition-colors flex items-center gap-1"
                title="Reset to original boilerplate"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            </div>
          </div>

          {/* Code Textarea Editor */}
          <div className="flex-1 relative bg-[#0B1018] p-2 flex">
            <textarea
              value={files[activeFileName] || ''}
              onChange={(e) => handleCodeChange(e.target.value)}
              spellCheck={false}
              className="w-full h-full p-3 bg-transparent text-white font-mono-cyber text-xs leading-relaxed resize-none outline-none border-none select-text"
              placeholder="// Write your implementation here..."
            />
          </div>

          {/* Bottom Editor Action Strip */}
          <div className="p-2.5 bg-[#080C14] border-t border-cyber-border flex items-center justify-between">
            <button
              onClick={handleRunTests}
              disabled={isRunningTests}
              className="px-4 py-2 bg-cyber-panel border border-cyber-primary text-cyber-primary hover:bg-cyber-primary hover:text-black font-bold text-xs uppercase tracking-wider rounded transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Play className="w-3.5 h-3.5" />
              <span>RUN AUTOMATED TESTS</span>
            </button>

            {testSummary && (
              <span className={`text-xs font-bold ${testSummary.percentage >= 70 ? 'text-cyber-success' : 'text-cyber-warning'}`}>
                Tests: {testSummary.passedCount} / {testSummary.totalCount} Passed ({testSummary.percentage}%)
              </span>
            )}
          </div>

        </div>

        {/* Right Column: Sandboxed Live Preview (for web) OR Test Results Console (for code) */}
        {isWebTask ? (
          <div className="w-full md:w-1/2 flex flex-col h-full bg-[#05070D]">
            <WebPreview 
              html={files['index.html'] || ''}
              css={files['style.css'] || ''}
              js={files['script.js'] || ''}
            />

            {/* Test Results Drawer if tests were run */}
            {testSummary && (
              <div className="border-t border-cyber-border bg-[#080C14] p-3 max-h-48 overflow-y-auto">
                <div className="flex items-center justify-between text-xs font-bold text-white mb-2">
                  <span className="flex items-center gap-1 text-cyber-primary">
                    <Terminal className="w-3.5 h-3.5" />
                    VALIDATION TEST SUITE:
                  </span>
                  <span className="text-[11px] text-cyber-muted">
                    Score: {testSummary.earnedScore} / {testSummary.maxScore} PTS
                  </span>
                </div>
                <div className="space-y-1.5">
                  {testSummary.testCaseResults.map((tc) => (
                    <div key={tc.id} className="flex items-center justify-between text-[11px] p-1.5 bg-[#05070D] rounded border border-cyber-border">
                      <div className="flex items-center gap-2">
                        {tc.passed ? (
                          <CheckCircle2 className="w-4 h-4 text-cyber-success shrink-0" />
                        ) : (
                          <XCircle className="w-4 h-4 text-cyber-danger shrink-0" />
                        )}
                        <span className={tc.passed ? 'text-white' : 'text-cyber-muted'}>{tc.description}</span>
                      </div>
                      <span className={tc.passed ? 'text-cyber-success font-bold' : 'text-cyber-muted'}>
                        +{tc.awardedPoints}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Non-web Code Task: Test Suite & Assertions Panel */
          <div className="p-4 bg-[#05070D] flex flex-col justify-between">
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-cyber-primary flex items-center gap-2">
                <Terminal className="w-4 h-4" />
                AUTOMATED TEST SPECIFICATIONS
              </h3>
              <div className="space-y-2">
                {task.testCases.map((tc) => (
                  <div key={tc.id} className="p-3 bg-[#0B1018] border border-cyber-border rounded text-xs flex items-center justify-between">
                    <div>
                      <span className="font-bold text-white">{tc.description}</span>
                      <p className="text-[10px] text-cyber-muted mt-0.5">Type: {tc.assertionType}</p>
                    </div>
                    <span className="text-xs px-2 py-0.5 bg-cyber-primary/10 text-cyber-primary border border-cyber-primary/30 rounded font-bold">
                      {tc.points} PTS
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

      </div>

      {/* Footer Submission Bar */}
      <div className="bg-[#0B1018] px-5 py-3 border-t border-cyber-border flex items-center justify-between">
        <span className="text-xs text-cyber-muted hidden sm:inline">
          {testSummary ? 'Review test cases above, then finalize and submit.' : 'Run tests to verify your implementation before submitting.'}
        </span>

        <button
          onClick={handleSubmit}
          className="px-6 py-2.5 bg-cyber-primary text-black font-bold text-xs uppercase tracking-wider hover:bg-white transition-all shadow-[0_0_20px_rgba(0,255,204,0.3)] rounded flex items-center gap-2 cursor-pointer ml-auto"
        >
          <Send className="w-4 h-4" />
          <span>SUBMIT PRACTICAL SOLUTION</span>
        </button>
      </div>

      {/* Confirm Reset Modal */}
      {showConfirmReset && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm cyber-panel p-5 border-2 border-cyber-warning text-center rounded-lg animate-scaleIn">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">RESET STARTER CODE?</h3>
            <p className="text-xs text-cyber-muted mt-2">
              This will overwrite your current changes with the default starter boilerplate. This action cannot be undone.
            </p>
            <div className="flex gap-2.5 mt-5">
              <button
                onClick={() => setShowConfirmReset(false)}
                className="flex-1 py-2 border border-cyber-border text-xs text-white rounded hover:bg-white/5"
              >
                Cancel
              </button>
              <button
                onClick={handleReset}
                className="flex-1 py-2 bg-cyber-danger hover:bg-red-600 text-white font-bold text-xs rounded uppercase tracking-wider"
              >
                Yes, Reset
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
