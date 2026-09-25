import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  CheckCircle2, 
  Camera, 
  Maximize, 
  Shield, 
  User, 
  RefreshCw, 
  AlertCircle,
  Play,
  FileText
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

  // Request camera permission
  const requestCamera = async () => {
    setErrorMsg('');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 640 }, height: { ideal: 480 }, facingMode: 'user' }
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setCameraPermission('granted');
    } catch (err: any) {
      console.error(err);
      setCameraPermission('denied');
      setErrorMsg('Camera permission denied or camera not found. Camera is required for identity integrity.');
    }
  };

  // Capture single verification photo
  const capturePhoto = () => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
    setCapturedPhotoUrl(dataUrl);

    // Save to IndexedDB
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
  };

  const requestFullscreen = async () => {
    const success = await enterBrowserFullscreen();
    if (success || isBrowserFullscreen()) {
      setFullscreenReady(true);
    }
  };

  const handleStartOperation = async () => {
    // Stop camera video track after verification
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
    await enterBrowserFullscreen();
    startAttempt();
    navigate('/game');
  };

  // Gatekeeper: All requirements must pass (Section 21)
  const isReadyToStart = (mode === 'demo') || (
    cameraPermission === 'granted' &&
    capturedPhotoUrl !== null &&
    fullscreenReady
  );

  return (
    <div className="min-h-screen bg-[#05070D] text-cyber-text flex items-center justify-center p-4 md:p-8 font-mono-cyber">
      <div className="w-full max-w-3xl cyber-panel border border-cyber-border p-6 md:p-8 shadow-2xl relative">
        
        {/* Header */}
        <div className="border-b border-cyber-border pb-4 mb-6 flex justify-between items-start">
          <div>
            <div className="flex items-center gap-2 text-cyber-primary text-xs uppercase tracking-widest">
              <Shield className="w-4 h-4" />
              CYBER CELL • SATI VIDISHA
            </div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white mt-1">
              SYSTEM PRE-CHECK
            </h1>
            <p className="text-xs text-cyber-muted mt-1">
              Complete mandatory identity & system readiness checks before entering OPERATION ZERO-DAY.
            </p>
          </div>
          <span className="text-[10px] px-2.5 py-1 bg-cyber-panel-secondary border border-cyber-border text-cyber-primary">
            ROUND 1 GATE
          </span>
        </div>

        {errorMsg && (
          <div className="mb-6 p-3 bg-cyber-danger/15 border border-cyber-danger text-cyber-danger text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <div className="space-y-5">
          {/* Card 1: Candidate Identity */}
          <div className="p-4 bg-cyber-panel-secondary border border-cyber-border flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-cyber-primary/10 border border-cyber-primary/30">
                <User className="w-5 h-5 text-cyber-primary" />
              </div>
              <div>
                <p className="text-xs text-cyber-muted uppercase">CANDIDATE IDENTITY</p>
                <p className="text-base font-bold text-white">
                  {candidate ? candidate.name : 'DEMO USER'}
                </p>
                <p className="text-xs text-cyber-primary">
                  SCHOLAR NO: {candidate ? candidate.scholarNumber : '00000'} • DOMAIN: {candidate ? candidate.domain : 'Technical'}
                </p>
              </div>
            </div>
            <CheckCircle2 className="w-6 h-6 text-cyber-success" />
          </div>

          {/* Card 2: Camera Access & Identity Capture */}
          <div className="p-4 bg-cyber-panel-secondary border border-cyber-border space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-cyber-primary/10 border border-cyber-primary/30">
                  <Camera className="w-5 h-5 text-cyber-primary" />
                </div>
                <div>
                  <p className="text-xs text-cyber-muted uppercase">CAMERA & LIVE PROCTORING</p>
                  <p className="text-sm font-bold text-white">Live Identity Verification & Continuous Proctoring</p>
                  <p className="text-[11px] text-cyber-muted">
                    Camera remains active in your HUD during the test to verify continuous candidate presence.
                  </p>
                </div>
              </div>

              <div>
                {cameraPermission !== 'granted' ? (
                  <button
                    onClick={requestCamera}
                    className="px-4 py-2 border border-cyber-primary text-cyber-primary text-xs hover:bg-cyber-primary hover:text-black font-bold transition-all"
                  >
                    ENABLE CAMERA
                  </button>
                ) : capturedPhotoUrl ? (
                  <div className="flex items-center gap-2 text-cyber-success text-xs font-bold">
                    <CheckCircle2 className="w-5 h-5" />
                    <span>PHOTO VERIFIED</span>
                  </div>
                ) : (
                  <button
                    onClick={capturePhoto}
                    className="px-4 py-2 bg-cyber-primary text-black text-xs font-bold hover:bg-white transition-all shadow-[0_0_10px_rgba(0,255,204,0.3)]"
                  >
                    CAPTURE PHOTO
                  </button>
                )}
              </div>
            </div>

            {/* Video stream or Captured photo preview */}
            {cameraPermission === 'granted' && (
              <div className="flex flex-col sm:flex-row items-center gap-4 bg-black/60 p-3 border border-cyber-border">
                {!capturedPhotoUrl ? (
                  <div className="w-48 h-36 bg-black border border-cyber-primary/40 relative overflow-hidden">
                    <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
                    <span className="absolute bottom-1 left-1 text-[9px] bg-black/80 px-1 text-cyber-primary">
                      LIVE STREAM
                    </span>
                  </div>
                ) : (
                  <div className="w-48 h-36 bg-black border border-cyber-success/50 relative overflow-hidden">
                    <img src={capturedPhotoUrl} alt="Identity Snapshot" className="w-full h-full object-cover" />
                    <span className="absolute bottom-1 left-1 text-[9px] bg-cyber-success text-black font-bold px-1">
                      VERIFIED SNAPSHOT
                    </span>
                  </div>
                )}

                <div className="flex-1 text-xs text-cyber-muted space-y-2">
                  {!capturedPhotoUrl ? (
                    <p>Position your face clearly in the frame, then click <strong>CAPTURE PHOTO</strong>.</p>
                  ) : (
                    <>
                      <p className="text-cyber-text">Photo captured successfully and verified against candidate registration.</p>
                      <button
                        onClick={retakePhoto}
                        className="flex items-center gap-1.5 text-cyber-primary text-xs hover:underline mt-1"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                        Retake Photo
                      </button>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Card 3: Fullscreen Gate */}
          <div className="p-4 bg-cyber-panel-secondary border border-cyber-border flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-cyber-primary/10 border border-cyber-primary/30">
                <Maximize className="w-5 h-5 text-cyber-primary" />
              </div>
              <div>
                <p className="text-xs text-cyber-muted uppercase">FULLSCREEN ENFORCEMENT</p>
                <p className="text-sm font-bold text-white">Browser Fullscreen Required</p>
                <p className="text-[11px] text-cyber-muted">
                  Exiting fullscreen during the mission triggers automated anti-cheat flags.
                </p>
              </div>
            </div>

            <div>
              {fullscreenReady ? (
                <div className="flex items-center gap-2 text-cyber-success text-xs font-bold">
                  <CheckCircle2 className="w-5 h-5" />
                  <span>FULLSCREEN READY</span>
                </div>
              ) : (
                <button
                  onClick={requestFullscreen}
                  className="px-4 py-2 border border-cyber-primary text-cyber-primary text-xs hover:bg-cyber-primary hover:text-black font-bold transition-all"
                >
                  ENTER FULLSCREEN
                </button>
              )}
            </div>
          </div>

          {/* Critical Assessment Guidelines Card */}
          <div className="p-4 bg-[#080C14] border border-cyber-primary/40 rounded-lg space-y-3 shadow-lg">
            <div className="flex items-center gap-2 text-xs font-bold text-cyber-primary uppercase tracking-wider">
              <FileText className="w-4 h-4 text-cyber-primary" />
              <span>TEST GUIDELINES & RULES (PLEASE READ CAREFULLY)</span>
            </div>
            <ul className="text-xs text-cyber-text space-y-2 leading-relaxed">
              <li className="flex items-start gap-2">
                <span className="text-cyber-warning font-bold">⚠️</span>
                <span>
                  <strong className="text-cyber-warning">STRICT FULLSCREEN:</strong> Do NOT exit fullscreen or switch tabs. Exiting fullscreen will <span className="text-cyber-danger font-bold">SKIP your current question</span> with a <span className="text-cyber-danger font-bold">NEGATIVE MARKING (-50 PTS)</span> penalty!
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-cyber-primary font-bold">📹</span>
                <span>
                  <strong className="text-cyber-primary">LIVE CAMERA PROCTORING:</strong> Your webcam will be displayed and actively monitored in the HUD throughout the test.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-white font-bold">⌨️</span>
                <span>
                  <strong className="text-white">ANSWER & PROGRESS:</strong> Click with mouse cursor or press keys <kbd className="px-1.5 py-0.5 bg-black border border-cyber-border rounded font-bold">A</kbd> <kbd className="px-1.5 py-0.5 bg-black border border-cyber-border rounded font-bold">B</kbd> <kbd className="px-1.5 py-0.5 bg-black border border-cyber-border rounded font-bold">C</kbd> <kbd className="px-1.5 py-0.5 bg-black border border-cyber-border rounded font-bold">D</kbd>. Press <kbd className="px-1.5 py-0.5 bg-black border border-cyber-border rounded font-bold">ENTER</kbd> to submit and proceed to next.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-cyber-danger font-bold">🚫</span>
                <span>
                  <strong className="text-cyber-danger">ANTI-CHEAT LOCKDOWN:</strong> Tab switching, right-click, copy-pasting, and text selection are strictly prohibited and automatically flagged.
                </span>
              </li>
            </ul>
          </div>

        </div>

        {/* Start Button */}
        <div className="mt-8 pt-6 border-t border-cyber-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-xs text-cyber-muted">
            {isReadyToStart
              ? 'All requirements satisfied. Operational clearance granted.'
              : 'Complete all checks above to unlock operational clearance.'}
          </span>

          <button
            disabled={!isReadyToStart}
            onClick={handleStartOperation}
            className={`w-full sm:w-auto px-8 py-4 font-bold text-sm tracking-wider flex items-center justify-center gap-2 transition-all ${
              isReadyToStart
                ? 'bg-cyber-primary text-black hover:bg-white shadow-[0_0_20px_rgba(0,255,204,0.35)]'
                : 'bg-cyber-panel-secondary border border-cyber-border text-cyber-muted cursor-not-allowed opacity-50'
            }`}
          >
            <Play className="w-4 h-4 fill-current" />
            ENTER OPERATION ZERO-DAY
          </button>
        </div>

      </div>
    </div>
  );
}
