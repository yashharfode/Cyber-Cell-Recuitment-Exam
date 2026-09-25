import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import PreCheck from './pages/PreCheck';
import GameMode from './pages/GameMode';
import ResultScreen from './pages/ResultScreen';
import TechnicalProfileSetup from './round2/components/TechnicalProfileSetup';
import Round2Assessment from './round2/components/Round2Assessment';
import TechnicalResult from './round2/components/TechnicalResult';
import AdminDashboard from './pages/AdminDashboard';
import CyberArcade from './pages/CyberArcade';
import RoundLockGuard from './components/RoundLockGuard';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/precheck" element={<PreCheck />} />
        <Route path="/game" element={<GameMode />} />
        <Route path="/result" element={<ResultScreen />} />
        <Route 
          path="/arcade" 
          element={
            <RoundLockGuard 
              roundName="STAGE 01 C: SIMULATION LABS (OPTIONAL BONUS)"
              roundDescription="Stage 01 C provides 10 optional hands-on interactive simulations. Complete them to earn bonus points towards your final recruitment ranking."
            >
              <CyberArcade />
            </RoundLockGuard>
          } 
        />
        <Route 
          path="/technical-profile" 
          element={
            <RoundLockGuard roundName="ROUND 01 B: PERSONALIZED TECHNICAL PROFILING">
              <TechnicalProfileSetup />
            </RoundLockGuard>
          } 
        />
        <Route 
          path="/round2-assessment" 
          element={
            <RoundLockGuard roundName="ROUND 01 B: TECHNICAL ASSESSMENT">
              <Round2Assessment />
            </RoundLockGuard>
          } 
        />
        <Route 
          path="/round2-result" 
          element={
            <RoundLockGuard roundName="ROUND 01 B: TECHNICAL RESULTS">
              <TechnicalResult />
            </RoundLockGuard>
          } 
        />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/candidates" element={<AdminDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
