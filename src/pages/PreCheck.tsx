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
    }
  }, [cameraPermission, capturedPhotoUrl]);

  // Cleanup media tracks on unmount
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
      }
    };
  }, []);

  // Capture still photo from video stream
  const capturePhoto = () => {
    if (!videoRef.current) return;
    try {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth || 640;
      canvas.height = videoRef.current.videoHeight || 480;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
        setCapturedPhotoUrl(dataUrl);

        try {
          localStorage.setItem('candidate_photo', dataUrl);
        } catch (e) {
          console.warn('Could not cache photo in localStorage:', e);
        }

        const candidateId = candidate?.id || 'demo-user';
        savePhoto({
          candidateId,
          dataUrl,
          capturedAt: new Date().toISOString(),
          sizeBytes: dataUrl.length,
          syncStatus: 'local'
        }).catch((err) => console.error('IndexedDB photo save error:', err));
      }
    } catch (err) {
      console.error('Error capturing snapshot:', err);
    }
  };

  const retakePhoto = () => {
    setCapturedPhotoUrl(null);
    try {
      localStorage.removeItem('candidate_photo');
    } catch (e) {
      console.warn(e);
    }
    // Re-ensure video element plays stream
    setTimeout(() => {
      if (videoRef.current && streamRef.current) {
        videoRef.current.srcObject = streamRef.current;
        videoRef.current.play().catch(e => console.warn(e));
      }
    }, 100);
  };

  const requestFullscreen = async () => {
    try {
      await enterBrowserFullscreen();
    } catch (err) {
      console.error('Fullscreen request error:', err);
    }
  };

  const isReadyToStart = (cameraPermission === 'granted' || !!capturedPhotoUrl) && !!capturedPhotoUrl && fullscreenReady;

  const handleStartOperation = () => {
    if (!isReadyToStart) return;
    startAttempt();
    navigate('/game');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans p-4 sm:p-8 flex flex-col justify-between selection:bg-sky-100 selection:text-sky-900">
      
      {/* Top Header */}
      <header className="max-w-4xl w-full mx-auto flex items-center justify-between pb-6 border-b border-slate-200">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-1.5 text-xs text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Exit Pre-Check</span>
        </button>

        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-sky-600" />
          <span className="text-xs font-mono text-slate-600 font-semibold uppercase tracking-wider">
            System Verification & Identity Check
          </span>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-4xl w-full mx-auto my-8 space-y-6">
        
        {/* Title & Introduction */}
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            System Pre-Check & Candidate Verification
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Complete the verification requirements below to unlock the Technical Assessment workspace.
          </p>
        </div>

        {errorMsg && (
          <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-600" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Verification Cards */}
        <div className="space-y-4">
          
          {/* Card 1: Candidate Identity */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start sm:items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-sky-50 border border-sky-200 flex items-center justify-center text-sky-700 shrink-0">
                <User className="w-5 h-5 text-sky-600" />
              </div>
              <div>
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block font-mono">
                  Candidate Identity
                </span>
                <div className="text-sm font-bold text-slate-900 mt-0.5">
                  {candidate ? candidate.name : 'Practice / Demo Candidate'}
                </div>
                <div className="text-xs text-slate-500 font-mono">
                  Scholar: {candidate ? candidate.scholarNumber : 'DEMO-USER-01'} &bull; Domain: Technical
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold shrink-0 self-start sm:self-center">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Identity Verified</span>
            </div>
          </div>

          {/* Card 2: Webcam Permission & Identity Snapshot */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start sm:items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-sky-50 border border-sky-200 flex items-center justify-center text-sky-700 shrink-0">
                  <Camera className="w-5 h-5 text-sky-600" />
                </div>
                <div>
                  <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block font-mono">
                    Webcam Proctoring
                  </span>
                  <div className="text-sm font-bold text-slate-900 mt-0.5">
                    Live Video Feed & Photo Verification
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Required for continuous anti-cheat proctoring and identity capture.
                  </p>
                </div>
              </div>

              <div className="shrink-0 self-start sm:self-center">
                {cameraPermission !== 'granted' && !capturedPhotoUrl ? (
                  <button
                    onClick={requestCamera}
                    className="px-4 py-2 rounded-xl bg-slate-900 text-white hover:bg-slate-800 font-semibold text-xs transition-colors cursor-pointer shadow-xs"
                  >
                    Enable Camera
                  </button>
                ) : capturedPhotoUrl ? (
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Photo Stored</span>
                  </div>
                ) : (
                  <button
                    onClick={capturePhoto}
                    className="px-4 py-2 rounded-xl bg-slate-900 text-white hover:bg-slate-800 font-semibold text-xs transition-colors cursor-pointer shadow-xs"
                  >
                    Capture Photo
                  </button>
                )}
              </div>
            </div>

            {/* Live Camera Stream & Photo Preview Panel */}
            {cameraPermission === 'granted' && (
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col md:flex-row items-center gap-5">
                
                {/* Visual Viewport */}
                <div className="w-full max-w-[260px] h-44 sm:w-56 sm:h-40 bg-slate-100 rounded-xl border border-slate-200 relative overflow-hidden shrink-0 shadow-xs mx-auto md:mx-0">
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
                    <div className="absolute bottom-2 left-2 flex items-center gap-1.5 bg-white/90 px-2 py-0.5 rounded text-[10px] text-slate-800 border border-slate-200 font-mono shadow-xs">
                      <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                      <span>LIVE FEED</span>
                    </div>
                  ) : (
                    <div className="absolute bottom-2 left-2 flex items-center gap-1.5 bg-white/90 px-2 py-0.5 rounded text-[10px] text-emerald-700 border border-emerald-200 font-semibold shadow-xs">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      <span>SAVED SNAPSHOT</span>
                    </div>
                  )}
                </div>

                {/* Instructions & Actions */}
                <div className="flex-1 text-xs text-slate-600 space-y-2">
                  {!capturedPhotoUrl ? (
                    <>
                      <div className="font-bold text-slate-900">Center your face in the camera preview</div>
                      <p className="text-slate-500 text-xs leading-relaxed">
                        Ensure adequate room lighting. When ready, click the capture button to record your identity snapshot for the exam record.
                      </p>
                      <button
                        onClick={capturePhoto}
                        className="px-4 py-2 bg-slate-900 text-white hover:bg-slate-800 font-semibold text-xs rounded-xl transition-colors flex items-center gap-2 cursor-pointer mt-1 shadow-xs"
                      >
                        <Camera className="w-3.5 h-3.5 text-sky-400" />
                        <span>Take & Save Photo</span>
                      </button>
                    </>
                  ) : (
                    <>
                      <div className="text-emerald-700 font-semibold flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>Identity snapshot verified and stored in local session.</span>
                      </div>
                      <p className="text-slate-500 text-xs leading-relaxed">
                        Your identity has been confirmed for this examination session. You may retake the photo if you wish to adjust the frame.
                      </p>
                      <button
                        onClick={retakePhoto}
                        className="text-xs text-sky-700 hover:text-slate-900 font-semibold underline inline-flex items-center gap-1.5 cursor-pointer pt-1"
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
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start sm:items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-sky-50 border border-sky-200 flex items-center justify-center text-sky-700 shrink-0">
                <Maximize2 className="w-5 h-5 text-sky-600" />
              </div>
              <div>
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block font-mono">
                  Display Environment
                </span>
                <div className="text-sm font-bold text-slate-900 mt-0.5">
                  Mandatory Fullscreen Mode
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Continuous fullscreen is strictly enforced. Exiting fullscreen during a question will skip it with negative marking.
                </p>
              </div>
            </div>

            <div className="shrink-0 self-start sm:self-center">
              {fullscreenReady ? (
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Fullscreen Active</span>
                </div>
              ) : (
                <button
                  onClick={requestFullscreen}
                  className="px-4 py-2 rounded-xl bg-slate-900 text-white hover:bg-slate-800 font-semibold text-xs transition-colors cursor-pointer shadow-xs"
                >
                  Enter Fullscreen
                </button>
              )}
            </div>
          </div>

          {/* Card 4: Assessment Instructions & Integrity Policy */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-900 pb-1 border-b border-slate-100">
              <FileText className="w-4 h-4 text-sky-600" />
              <span>Assessment Guidelines & Integrity Rules</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-600">
              
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <div className="font-bold text-slate-900 flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                  <span>Continuous Fullscreen Enforced</span>
                </div>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Do not exit fullscreen or switch tabs. Any exit while answering an active challenge results in immediate skip and a <strong className="text-red-600">-50 PTS penalty</strong>.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <div className="font-bold text-slate-900 flex items-center gap-1.5">
                  <Video className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                  <span>Live Proctoring Active</span>
                </div>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Your webcam feed will remain active in the proctoring corner throughout the evaluation session to ensure candidate verification.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <div className="font-bold text-slate-900 flex items-center gap-1.5">
                  <MonitorCheck className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                  <span>Keyboard & Cursor Navigation</span>
                </div>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Click options directly or press keys <kbd className="px-1.5 py-0.5 rounded bg-white border border-slate-300 text-slate-800 font-mono text-[10px]">A</kbd> <kbd className="px-1.5 py-0.5 rounded bg-white border border-slate-300 text-slate-800 font-mono text-[10px]">B</kbd> <kbd className="px-1.5 py-0.5 rounded bg-white border border-slate-300 text-slate-800 font-mono text-[10px]">C</kbd> <kbd className="px-1.5 py-0.5 rounded bg-white border border-slate-300 text-slate-800 font-mono text-[10px]">D</kbd>, and press <kbd className="px-1.5 py-0.5 rounded bg-white border border-slate-300 text-slate-800 font-mono text-[10px]">ENTER</kbd> to submit.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <div className="font-bold text-slate-900 flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                  <span>Anti-Cheat Audit Log</span>
                </div>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Tab blur, developer tools, and copy-pasting are automatically monitored and recorded in your candidate audit dossier.
                </p>
              </div>

            </div>
          </div>

        </div>

        {/* Bottom Action Footer */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-slate-500 text-center sm:text-left">
            {isReadyToStart ? (
              <span className="text-emerald-700 font-semibold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
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
            className={`w-full sm:w-auto h-11 px-7 rounded-xl font-bold text-xs tracking-wider uppercase flex items-center justify-center gap-2 transition-all ${
              isReadyToStart
                ? 'bg-slate-900 hover:bg-slate-800 text-white cursor-pointer shadow-md active:translate-y-0.5'
                : 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed opacity-60'
            }`}
          >
            <span>Start Technical Assessment</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </main>

      {/* Footer Attribution */}
      <footer className="max-w-4xl w-full mx-auto pt-6 text-center text-xs text-slate-500 border-t border-slate-200">
        Samrat Ashok Technological Institute (SATI), Vidisha &bull; Cyber Cell Recruitment Engine 2026
      </footer>

    </div>
  );
}
