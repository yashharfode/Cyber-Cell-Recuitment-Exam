import { redFlagEngine } from './redFlags/redFlagEngine';

export function setupAntiCheatMonitors(
  onWarning: (msg: string, severity: 'low' | 'medium' | 'high') => void,
  currentMissionId?: string
) {
  let blurStartTime = 0;

  // 1. Visibility Monitor
  const handleVisibility = () => {
    if (document.hidden) {
      blurStartTime = Date.now();
      redFlagEngine.recordEvent('TAB_HIDDEN', 'medium', currentMissionId, { reason: 'User switched away from assessment tab' });
      onWarning('Tab switch detected! This event has been logged to your candidate profile.', 'medium');
    } else {
      const duration = blurStartTime ? Math.round((Date.now() - blurStartTime) / 1000) : 0;
      redFlagEngine.recordEvent('TAB_HIDDEN', 'low', currentMissionId, { durationSeconds: duration });
    }
  };

  // 2. Fullscreen Monitor
  const handleFullscreen = () => {
    if (!document.fullscreenElement) {
      redFlagEngine.recordEvent('FULLSCREEN_EXIT', 'medium', currentMissionId, { reason: 'Fullscreen mode exited' });
      onWarning('Fullscreen exited! Recruitment rules require fullscreen. Please re-enter fullscreen immediately.', 'medium');
    }
  };

  // 3. Window Blur Monitor
  const handleBlur = () => {
    redFlagEngine.recordEvent('WINDOW_BLUR', 'low', currentMissionId, { reason: 'Browser window lost focus' });
  };

  // 4. Block common assistance shortcuts (Ctrl+C, Ctrl+V, F12, Inspect)
  const handleKeyDown = (e: KeyboardEvent) => {
    const isCtrl = e.ctrlKey || e.metaKey;
    if (
      e.key === 'F12' ||
      (isCtrl && (e.key === 'c' || e.key === 'v' || e.key === 'u' || e.key === 'i' || e.key === 'j'))
    ) {
      e.preventDefault();
      redFlagEngine.recordEvent('SUSPICIOUS_KEYSTROKE', 'low', currentMissionId, { key: e.key });
      onWarning(`Shortcut '${e.key}' blocked during assessment.`, 'low');
    }
  };

  // 5. Prevent context menu (right click)
  const handleContextMenu = (e: MouseEvent) => {
    e.preventDefault();
  };

  // 6. Prevent text selection
  const handleSelectStart = (e: Event) => {
    const target = e.target as HTMLElement | null;
    if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA')) {
      return;
    }
    e.preventDefault();
  };

  // 7. Prevent element dragging
  const handleDragStart = (e: DragEvent) => {
    e.preventDefault();
  };

  // 8. Prevent copying text
  const handleCopy = (e: ClipboardEvent) => {
    const target = e.target as HTMLElement | null;
    if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA')) {
      return;
    }
    e.preventDefault();
    redFlagEngine.recordEvent('SUSPICIOUS_KEYSTROKE', 'low', currentMissionId, { reason: 'Copy event blocked' });
    onWarning('Copying text is prohibited during assessment.', 'low');
  };

  document.addEventListener('visibilitychange', handleVisibility);
  document.addEventListener('fullscreenchange', handleFullscreen);
  window.addEventListener('blur', handleBlur);
  window.addEventListener('keydown', handleKeyDown);
  window.addEventListener('contextmenu', handleContextMenu);
  document.addEventListener('selectstart', handleSelectStart);
  document.addEventListener('dragstart', handleDragStart);
  document.addEventListener('copy', handleCopy);

  return () => {
    document.removeEventListener('visibilitychange', handleVisibility);
    document.removeEventListener('fullscreenchange', handleFullscreen);
    window.removeEventListener('blur', handleBlur);
    window.removeEventListener('keydown', handleKeyDown);
    window.removeEventListener('contextmenu', handleContextMenu);
    document.removeEventListener('selectstart', handleSelectStart);
    document.removeEventListener('dragstart', handleDragStart);
    document.removeEventListener('copy', handleCopy);
  };
}
