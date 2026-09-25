import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  CheckCircle2, 
  Camera, 
  Maximize2, 
  Shield, 
  User, 
  RefreshCw, 
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  FileText,
  AlertTriangle,
  MonitorCheck,
  Video
} from 'lucide-react';
import { useStore } from '../store/useStore';
import { savePhoto } from '../storage/indexedDb';
import { isBrowserFullscreen, enterBrowserFullscreen, FULLSCREEN_EVENTS } from '../utils/fullscreen';

export default function PreCheck() {
  const navigate = useNavigate();
  const { candidate, mode, startAttempt } = useStore();

  const [cameraPermission, setCameraPermission] = useState<'pending' | 'granted' | 'denied'>('pending');
  const [capturedPhotoUrl, setCapturedPhotoUrl] = useState<string | null>(null);
  const [fullscreenReady, setFullscreenReady] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');

  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Check for previously saved photo in localStorage
  useEffect(() => {
    try {
      const savedPhoto = localStorage.getItem('candidate_photo');
      if (savedPhoto && savedPhoto.startsWith('data:image/')) {
        setCapturedPhotoUrl(savedPhoto);
      }
    } catch (e) {
      console.warn('Could not read photo from localStorage:', e);
    }
  }, []);

  useEffect(() => {
    // If recruitment mode and no candidate, redirect to login
    if (mode === 'recruitment' && !candidate) {
      navigate('/login');
    }
  }, [candidate, mode, navigate]);

  // Fullscreen change listener
  useEffect(() => {
    const handleFullscreenChange = () => {
      setFullscreenReady(isBrowserFullscreen());
    };
    FULLSCREEN_EVENTS.forEach((evt) => {
      document.addEventListener(evt, handleFullscreenChange);
    });
    setFullscreenReady(isBrowserFullscreen());
    return () => {
      FULLSCREEN_EVENTS.forEach((evt) => {
        document.removeEventListener(evt, handleFullscreenChange);
      });
    };
  }, []);

  // Request camera permission and attach live feed
  const requestCamera = async () => {
    setErrorMsg('');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 640 }, height: { ideal: 480 }, facingMode: 'user' },
        audio: false
      });
      streamRef.current = stream;
      setCameraPermission('granted');

      // Immediate attachment if element is present
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play().catch(e => console.warn('Video play error:', e));
      }
    } catch (err: any) {
      console.error('Camera access error:', err);
      setCameraPermission('denied');
      setErrorMsg('Camera access was denied or hardware not found. A functional webcam is required for identity verification.');
    }
  };

  // Guarantee video element receives the stream as soon as it mounts or changes
  useEffect(() => {
    if (cameraPermission === 'granted' && streamRef.current && videoRef.current) {
      const video = videoRef.current;
      if (video.srcObject !== streamRef.current) {
        video.srcObject = streamRef.current;
      }
      video.onloadedmetadata = () => {
        video.play().catch(err => console.warn('Video playback warning:', err));
      };
      video.play().catch(err => console.warn('Video playback warning:', err));
    }
  }, [cameraPermission, capturedPhotoUrl]);

  // Cleanup stream on component unmount
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  // Capture verification photo and save to localStorage
  const capturePhoto = () => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.88);
    setCapturedPhotoUrl(dataUrl);

    // Save to localStorage as requested
    try {
      localStorage.setItem('candidate_photo', dataUrl);
      localStorage.setItem('candidate_photo_captured_at', new Date().toISOString());
      if (candidate) {
        localStorage.setItem(`candidate_photo_${candidate.id}`, dataUrl);
        localStorage.setItem(`candidate_photo_${candidate.scholarNumber}`, dataUrl);
      }
    } catch (e) {
      console.warn('Could not save photo to localStorage:', e);
    }

    // Save to IndexedDB for audit trail
    if (candidate) {
      savePhoto({
        candidateId: candidate.id,
        dataUrl,
        capturedAt: new Date().toISOString(),
        sizeBytes: Math.round(dataUrl.length * 0.75),
        syncStatus: 'local'
      }).catch(console.error);
    }
  };

  const retakePhoto = () => {
    setCapturedPhotoUrl(null);
    try {
      localStorage.removeItem('candidate_photo');
      if (candidate) {
        localStorage.removeItem(`candidate_photo_${candidate.id}`);
        localStorage.removeItem(`candidate_photo_${candidate.scholarNumber}`);
      }
    } catch (e) {
      console.warn(e);
    }
  };

  const requestFullscreen = async () => {
    const success = await enterBrowserFullscreen();
    if (success || isBrowserFullscreen()) {
      setFullscreenReady(true);
    }
  };

  const handleStartOperation = async () => {
    // Stop camera video track after verification before entering game
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
    await enterBrowserFullscreen();
    startAttempt();
    navigate('/game');
  };

  // Gatekeeper: All requirements must pass
  const isReadyToStart = (mode === 'demo') || (
    cameraPermission === 'granted' &&
    capturedPhotoUrl !== null &&
    fullscreenReady
  );

  return (
    <div className="min-h-screen bg-[#05070D] text-[#EAF7F5] font-sans flex flex-col justify-between p-4 sm:p-6 md:p-10 selection:bg-slate-700 selection:text-white">
      
      {/* Top Bar */}
      <header className="max-w-4xl w-full mx-auto flex items-center justify-between pb-6 border-b border-white/[0.08]">
        <button
          onClick={() => navigate(mode === 'recruitment' ? '/login' : '/')}
          className="flex items-center gap-2 text-xs font-medium text-slate-400 hover:text-white transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to {mode === 'recruitment' ? 'Login' : 'Portal'}</span>
        </button>

        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-400">
            Cyber Cell • SATI Vidisha
          </span>
          <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-white/[0.05] border border-white/[0.1] text-slate-300">
            Stage 01 • Pre-Check
          </span>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-4xl w-full mx-auto my-6 sm:my-8 space-y-6">
        
        {/* Title Header */}
        <div className="space-y-1">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Technical Recruitment Assessment 2026
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            System & Identity Pre-Check
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 max-w-2xl leading-relaxed pt-1">
            Complete the identity verification and hardware readiness checks below. Continuous fullscreen and live proctoring are enforced to ensure assessment integrity.
          </p>
        </div>

        {errorMsg && (
          <div className="p-3.5 bg-red-500/10 border border-red-500/30 rounded-lg text-red-300 text-xs flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-400 mt-0.5" />
            <span className="leading-relaxed">{errorMsg}</span>
          </div>
        )}

        {/* Verification Check Cards */}
        <div className="space-y-4">
          
          {/* Card 1: Candidate Identity */}
          <div className="p-5 rounded-lg bg-[#0A0E18] border border-white/[0.08] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-md bg-white/[0.05] border border-white/[0.1] flex items-center justify-center text-slate-300 shrink-0">
                <User className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider block">
                  Candidate Profile
                </span>
                <div className="text-base font-semibold text-white mt-0.5">
                  {candidate ? candidate.name : 'Demo Candidate'}
                </div>
                <div className="text-xs text-slate-400 flex items-center gap-2 mt-0.5">
                  <span className="font-mono text-slate-300">
                    Scholar ID: {candidate ? candidate.scholarNumber : '00000'}
                  </span>
                  <span>•</span>
                  <span>Domain: {candidate ? candidate.domain : 'Technical'}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium self-start sm:self-center">
              <CheckCircle2 className="w-4 h-4" />
              <span>Identity Verified</span>
            </div>
          </div>

          {/* Card 2: Camera Access & Identity Capture */}
          <div className="p-5 rounded-lg bg-[#0A0E18] border border-white/[0.08] space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start sm:items-center gap-3.5">
                <div className="w-10 h-10 rounded-md bg-white/[0.05] border border-white/[0.1] flex items-center justify-center text-slate-300 shrink-0">
                  <Camera className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider block">
                    Webcam Verification
                  </span>
                  <div className="text-sm font-semibold text-white mt-0.5">
                    Live Proctoring & Candidate Photo Verification
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Your camera will remain active in the assessment workspace to ensure fair evaluation.
                  </p>
                </div>
              </div>

              <div className="shrink-0 self-start sm:self-center">
                {cameraPermission !== 'granted' ? (
                  <button
                    onClick={requestCamera}
                    className="px-4 py-2 rounded-md bg-white text-slate-900 hover:bg-slate-100 font-semibold text-xs transition-colors cursor-pointer"
                  >
                    Enable Camera
                  </button>
                ) : capturedPhotoUrl ? (
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Photo Verified</span>
                  </div>
                ) : (
                  <button
                    onClick={capturePhoto}
                    className="px-4 py-2 rounded-md bg-white text-slate-900 hover:bg-slate-100 font-semibold text-xs transition-colors cursor-pointer"
                  >
                    Capture Photo
                  </button>
                )}
              </div>
            </div>

            {/* Live Camera Stream & Photo Preview Panel */}
            {cameraPermission === 'granted' && (
              <div className="p-4 rounded-lg bg-[#060911] border border-white/[0.06] flex flex-col md:flex-row items-center gap-5">
                
                {/* Visual Viewport */}
                <div className="w-56 h-40 bg-black rounded-md border border-white/[0.1] relative overflow-hidden shrink-0 shadow-sm">
                  {/* Mirrored Live Video Feed */}
                  <video 
                    ref={videoRef} 
                    autoPlay 
                    playsInline 
                    muted 
                    className={`w-full h-full object-cover transform -scale-x-100 ${capturedPhotoUrl ? 'hidden' : 'block'}`} 
                  />
                  
                  {/* Verified Captured Snapshot */}
                  {capturedPhotoUrl && (
                    <img 
                      src={capturedPhotoUrl} 
                      alt="Candidate Identity Snapshot" 
                      className="w-full h-full object-cover transform -scale-x-100" 
                    />
                  )}

                  {/* Status Overlay */}
                  {!capturedPhotoUrl ? (
                    <div className="absolute bottom-2 left-2 flex items-center gap-1.5 bg-black/80 px-2 py-0.5 rounded text-[10px] text-slate-200 border border-white/10 font-mono">
                      <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                      <span>LIVE FEED</span>
                    </div>
                  ) : (
                    <div className="absolute bottom-2 left-2 flex items-center gap-1.5 bg-black/80 px-2 py-0.5 rounded text-[10px] text-emerald-300 border border-emerald-500/30 font-medium">
                      <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                      <span>SAVED SNAPSHOT</span>
                    </div>
                  )}
                </div>

                {/* Instructions & Actions */}
                <div className="flex-1 text-xs text-slate-300 space-y-2">
                  {!capturedPhotoUrl ? (
                    <>
                      <div className="font-semibold text-white">Center your face in the camera preview</div>
                      <p className="text-slate-400 text-xs leading-relaxed">
                        Ensure adequate room lighting. When ready, click the capture button to record your identity snapshot for the exam record.
                      </p>
                      <button
                        onClick={capturePhoto}
                        className="px-4 py-2 bg-white text-slate-900 hover:bg-slate-100 font-semibold text-xs rounded-md transition-colors flex items-center gap-2 cursor-pointer mt-1"
                      >
                        <Camera className="w-3.5 h-3.5 text-slate-700" />
                        <span>Take & Save Photo</span>
                      </button>
                    </>
                  ) : (
                    <>
                      <div className="text-emerald-400 font-medium flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Identity snapshot verified and stored in local session.</span>
                      </div>
                      <p className="text-slate-400 text-xs leading-relaxed">
                        Your identity has been confirmed for this examination session. You may retake the photo if you wish to adjust the frame.
                      </p>
                      <button
                        onClick={retakePhoto}
                        className="text-xs text-slate-300 hover:text-white underline inline-flex items-center gap-1.5 cursor-pointer pt-1"
                      >
                        <RefreshCw className="w-3 h-3" />
                        <span>Retake Photo</span>
                      </button>
                    </>
                  )}
                </div>

              </div>
            )}

          </div>

          {/* Card 3: Fullscreen Gate */}
          <div className="p-5 rounded-lg bg-[#0A0E18] border border-white/[0.08] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start sm:items-center gap-3.5">
              <div className="w-10 h-10 rounded-md bg-white/[0.05] border border-white/[0.1] flex items-center justify-center text-slate-300 shrink-0">
                <Maximize2 className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider block">
                  Display Environment
                </span>
                <div className="text-sm font-semibold text-white mt-0.5">
                  Mandatory Fullscreen Mode
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  Continuous fullscreen is strictly enforced. Exiting fullscreen during a question will skip it with negative marking.
                </p>
              </div>
            </div>

            <div className="shrink-0 self-start sm:self-center">
              {fullscreenReady ? (
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Fullscreen Active</span>
                </div>
              ) : (
                <button
                  onClick={requestFullscreen}
                  className="px-4 py-2 rounded-md bg-white text-slate-900 hover:bg-slate-100 font-semibold text-xs transition-colors cursor-pointer"
                >
                  Enter Fullscreen
                </button>
              )}
            </div>
          </div>

          {/* Card 4: Assessment Instructions & Integrity Policy */}
          <div className="p-5 rounded-lg bg-[#0A0E18] border border-white/[0.08] space-y-3">
            <div className="flex items-center gap-2 text-xs font-semibold text-white pb-1 border-b border-white/[0.06]">
              <FileText className="w-4 h-4 text-slate-400" />
              <span>Assessment Guidelines & Integrity Rules</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-300">
              
              <div className="p-3 rounded-md bg-[#060911] border border-white/[0.05] space-y-1">
                <div className="font-semibold text-white flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>Continuous Fullscreen Enforced</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Do not exit fullscreen or switch tabs. Any exit while answering an active challenge results in immediate skip and a <strong className="text-rose-400">-50 PTS penalty</strong>.
                </p>
              </div>

              <div className="p-3 rounded-md bg-[#060911] border border-white/[0.05] space-y-1">
                <div className="font-semibold text-white flex items-center gap-1.5">
                  <Video className="w-3.5 h-3.5 text-slate-300 shrink-0" />
                  <span>Live Proctoring Active</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Your webcam feed will remain active in the proctoring HUD throughout the evaluation session to ensure candidate verification.
                </p>
              </div>

              <div className="p-3 rounded-md bg-[#060911] border border-white/[0.05] space-y-1">
                <div className="font-semibold text-white flex items-center gap-1.5">
                  <MonitorCheck className="w-3.5 h-3.5 text-slate-300 shrink-0" />
                  <span>Keyboard & Cursor Navigation</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Click options directly or press keys <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-white font-mono text-[10px]">A</kbd> <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-white font-mono text-[10px]">B</kbd> <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-white font-mono text-[10px]">C</kbd> <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-white font-mono text-[10px]">D</kbd>, and press <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-white font-mono text-[10px]">ENTER</kbd> to submit.
                </p>
              </div>

              <div className="p-3 rounded-md bg-[#060911] border border-white/[0.05] space-y-1">
                <div className="font-semibold text-white flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-slate-300 shrink-0" />
                  <span>Anti-Cheat Audit Log</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Tab blur, developer tools, and copy-pasting are automatically monitored and recorded in your candidate audit dossier.
                </p>
              </div>

            </div>
          </div>

        </div>

        {/* Bottom Action Footer */}
        <div className="p-5 rounded-lg bg-[#0A0E18] border border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-slate-400 text-center sm:text-left">
            {isReadyToStart ? (
              <span className="text-emerald-400 font-medium flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                All checks passed. You may enter the assessment environment.
              </span>
            ) : (
              <span>
                Please enable camera, capture your photo, and enter fullscreen to proceed.
              </span>
            )}
          </div>

          <button
            disabled={!isReadyToStart}
            onClick={handleStartOperation}
            className={`w-full sm:w-auto h-11 px-7 rounded-md font-semibold text-xs tracking-wide flex items-center justify-center gap-2 transition-all ${
              isReadyToStart
                ? 'bg-white hover:bg-slate-100 text-slate-900 cursor-pointer shadow-sm active:translate-y-0.5'
                : 'bg-white/[0.05] text-slate-500 border border-white/[0.08] cursor-not-allowed opacity-60'
            }`}
          >
            <span>Start Technical Assessment</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </main>

      {/* Footer Attribution */}
      <footer className="max-w-4xl w-full mx-auto pt-6 text-center text-xs text-slate-500 border-t border-white/[0.08]">
        Samrat Ashok Technological Institute (SATI), Vidisha &bull; Cyber Cell Recruitment Engine 2026
      </footer>

    </div>
  );
}
