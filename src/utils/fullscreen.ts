/**
 * Cross-browser Fullscreen Helpers
 * Ensures seamless fullscreen enforcement across Chrome, Firefox, Edge, Safari, and Windows webviews.
 */

export const isBrowserFullscreen = (): boolean => {
  const d = document as any;
  return !!(
    d.fullscreenElement ||
    d.webkitFullscreenElement ||
    d.mozFullScreenElement ||
    d.msFullscreenElement
  );
};

export const enterBrowserFullscreen = async (): Promise<boolean> => {
  const elem = document.documentElement as any;
  try {
    if (elem.requestFullscreen) {
      await elem.requestFullscreen();
      return true;
    } else if (elem.webkitRequestFullscreen) {
      await elem.webkitRequestFullscreen();
      return true;
    } else if (elem.mozRequestFullScreen) {
      await elem.mozRequestFullScreen();
      return true;
    } else if (elem.msRequestFullscreen) {
      await elem.msRequestFullscreen();
      return true;
    }
  } catch (err) {
    console.warn('Fullscreen entry rejected or dismissed by user:', err);
    return false;
  }
  return false;
};

export const exitBrowserFullscreen = async (): Promise<boolean> => {
  const d = document as any;
  try {
    if (d.exitFullscreen) {
      await d.exitFullscreen();
      return true;
    } else if (d.webkitExitFullscreen) {
      await d.webkitExitFullscreen();
      return true;
    } else if (d.mozCancelFullScreen) {
      await d.mozCancelFullScreen();
      return true;
    } else if (d.msExitFullscreen) {
      await d.msExitFullscreen();
      return true;
    }
  } catch (err) {
    console.warn('Exit fullscreen rejected:', err);
    return false;
  }
  return false;
};

export const FULLSCREEN_EVENTS = [
  'fullscreenchange',
  'webkitfullscreenchange',
  'mozfullscreenchange',
  'MSFullscreenChange'
] as const;
