# OPERATION ZERO-DAY: Cyber Cell Technical Recruitment Assessment Platform

<div align="center">

![Cyber Cell Logo](public/favicon.svg)

**CYBER CELL — SATI VIDISHA**  
*Cybersecurity Club • Samrat Ashok Technological Institute, Vidisha (M.P.)*

[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue.svg?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19.0-61DAFB.svg?logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8.3-646CFF.svg?logo=vite&logoColor=white)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-v4.0-38B2AC.svg?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Three.js](https://img.shields.io/badge/Three.js-WebGL-black.svg?logo=three.js&logoColor=white)](https://threejs.org/)
[![License](https://img.shields.io/badge/License-Proprietary-red.svg)](#)

A high-fidelity incident-response simulation and recruitment assessment engine designed to objectively benchmark technical aptitude, problem solving, hands-on diagnostics, and domain proficiency for engineering candidates.

[Features](#-key-features) • [Assessment Architecture](#-assessment-architecture) • [Anti-Cheat & Proctoring](#-anti-cheat--integrity-engine) • [Tech Stack](#-technology-stack) • [Quick Start](#-quick-start)

</div>

---

## 🎯 Overview & Philosophy

**Operation Zero-Day** abandons generic, unproctored multiple-choice exams in favor of an **active, calibrated operational environment**. Candidates step into a 3D simulated Security Operations Center (SOC) where they investigate live institutional network telemetry, diagnose active vulnerabilities, solve interactive puzzles, and demonstrate practical engineering skills.

### Core Evaluation Principles:
1. **Demonstrated Performance over Self-Declaration:** Self-selecting a domain does not award points; it determines the calibrated technical assessment path presented to the candidate.
2. **Deterministic Evaluation:** Subjective essay prompts have been replaced with **interactive letter-slot (`_ _ _ _ __`) questions** and practical code analyzers to guarantee 100% automated, reproducible scoring.
3. **Defense-in-Depth Proctoring:** Multi-layered security monitors ensure continuous fullscreen mode, camera proctoring verification, tab-blur tracking, and immediate question suppression upon integrity violations.
4. **Accessible to All Engineering Streams:** The foundation assessment tests core computing logic, networking, and security hygiene without assuming prior specialization.

---

## 🏗️ Assessment Architecture

```
                       ┌──────────────────────────────────────────────┐
                       │           OPERATION ZERO-DAY PORTAL          │
                       │           Landing Page & Auth Gateway        │
                       └──────────────────────┬───────────────────────┘
                                              │
                      ┌───────────────────────┴───────────────────────┐
                      ▼                                               ▼
         ┌─────────────────────────┐                     ┌─────────────────────────┐
         │     DEMO SANDBOX        │                     │    RECRUITMENT MODE     │
         │  Unscored practice run  │                     │  Live candidate auth    │
         └─────────────────────────┘                     └────────────┬────────────┘
                                                                      │
                                              ┌───────────────────────┴───────────────────────┐
                                              ▼                                               ▼
                                  ┌───────────────────────┐                       ┌───────────────────────┐
                                  │   PRE-CHECK PROCTOR   │                       │   ADMIN DASHBOARD     │
                                  │ Webcam, Audio, Full-  │                       │ Telemetry & review    │
                                  │ screen Verification   │                       └───────────────────────┘
                                  └───────────┬───────────┘
                                              │
                                              ▼
                                 ┌─────────────────────────┐
                                 │       ROUND 01 A        │
                                 │   Common SOC Screening  │
                                 │   3D Cyber Room • 30 Qs │
                                 └────────────┬────────────┘
                                              │
                                              ▼ (Requires Submission)
                                 ┌─────────────────────────┐
                                 │       ROUND 01 B        │
                                 │ Technical Skill Profile │
                                 │ Personalized Evaluation │
                                 └────────────┬────────────┘
                                              │
                                 ┌────────────┴────────────┐
                                 ▼                         ▼
                    ┌─────────────────────────┐ ┌─────────────────────────┐
                    │  TIER 2: LETTER SLOTS   │ │   TIER 3: PRACTICAL     │
                    │ Interactive word blanks │ │ Mini-IDE code debugger  │
                    └─────────────────────────┘ └─────────────────────────┘
                                 │                         │
                                 └────────────┬────────────┘
                                              ▼
                                 ┌─────────────────────────┐
                                 │  DIAGNOSTIC DOSSIER     │
                                 │ Automated radar chart & │
                                 │ verified talent matrix  │
                                 └─────────────────────────┘
```

---

## 🧩 Assessment Rounds Breakdown

### 1. Round 01 A — Common SOC Assessment (`/game`)
- **Immersive 3D First-Person Cyber Room:** Built with Three.js and `@react-three/fiber`, allowing operatives to navigate between perimeter terminals, server racks, and central workstations.
- **30 Calibrated Challenges:** Spanning across 7 progressive missions:
  - *Perimeter Reconnaissance & Network Architecture*
  - *Log Analysis & Unauthorized Telemetry Infiltration*
  - *Authentication Mechanisms & Credential Entropy*
  - *Code Prediction, Reverse Engineering & Linux SOC CLI*
  - *Incident Response & Defensive Triage*
- **Interactive Mini-Games:** Embedded directly into the terminal modals:
  - `network-builder`: Defense-in-depth hardware sequence
  - `find-intruder`: Campus server authentication log anomaly spotter
  - `phishing-hunter`: Suspicious indicator isolation
  - `password-strength`: High-entropy credential synthesizer

### 2. Round 01 B — Personalized Technical Skill Profiling (`/technical-profile` & `/round2-assessment`)
- **Domain Selection:** Candidates declare proficiency in up to 3 domains:
  - *Web Development (Frontend & Backend)*
  - *Programming Logic (Python, C++, Java)*
  - *Data Structures & Algorithms*
  - *Cybersecurity & Ethical Hacking*
  - *Computer Networks*
  - *Databases & SQL*
  - *Linux & Shell Scripting*
  - *Git & GitHub Version Control*
  - *Cloud & DevOps*
- **Tier 1: Knowledge Challenges:** Multi-choice architectural concept questions.
- **Tier 2: Interactive Letter-Slot Fill in the Blank (`_ _ _ _ __`):**
  - Discrete letter boxes with auto-cursor advancement and backspace memory.
  - Multi-word spacing support (e.g. `GROUP BY`, `DOCKER`, `FIREWALL`).
  - 100% deterministic keyword validation awarding `+100 PTS` or `0 PTS`.
- **Tier 3: Practical Demonstration Lab:**
  - Real-time in-browser code editor with syntax highlighting and file tree.
  - Test case runner that verifies standard outputs against hidden test assertions.

### 3. Cyber Arcade — Hands-On Simulation Lab (`/arcade`)
- **10 Standalone Diagnostic Simulations:**
  1. *Build Secure Network* (Architecture & Defense)
  2. *Find the Intruder* (Telemetry & Anomaly Spotter)
  3. *Phishing Hunter Lab* (Social Engineering Defense)
  4. *Match the Pair* (Core Technology Operations)
  5. *Code Puzzle: Reorder Shuffled Lines* (Algorithm Flow)
  6. *Credential Entropy Lab* (Password Bit Strength)
  7. *8-Bit Binary Switch Matrix* (Hardware Subnet Math)
  8. *Caesar Cipher Wheel* (Cryptography Decryption Dial)
  9. *Digital Detective Kill-Chain* (Multi-stage Forensic Replay)
  10. *Cyber Terminal Forensics* (Simulated Linux Bash Shell with `cat`, `grep`, `ls`, and `base64`)
- **Skill Unlock Tree:** Visual progression mapping mastered competencies into security career pathways.

---

## 🛡️ Anti-Cheat & Integrity Engine

Operation Zero-Day enforces strict proctoring mechanisms across Chromium, Gecko, and WebKit rendering engines:

| Feature | Mechanism | Consequence / Action |
| :--- | :--- | :--- |
| **Fullscreen Enforcement** | Cross-browser `FULLSCREEN_EVENTS` listener | Active challenge immediately unmounts/disappears; `-50 PTS` negative marking penalty applied |
| **Arcade Question Concealment** | Immediate state suppression upon window resize / exit | Challenge details and simulator hide behind a security lockdown screen until fullscreen is restored |
| **Webcam Live Proctoring** | `getUserMedia` hardware video stream with canvas snapshot | Identity snapshot taken during pre-check; stream active throughout live exam |
| **Window & Tab Blur** | `visibilitychange` and `blur` telemetry event hooks | Red-flag audit event logged to IndexedDB candidate dossier |
| **Sequential Round Lock** | `RoundLockGuard` preventing unauthorized URL jumps | Subsequent rounds remain locked until Round 01 A is submitted |

---

## 💻 Technology Stack

- **Core Framework:** [React 19](https://react.dev/) + [TypeScript 5.9](https://www.typescriptlang.org/)
- **Build System:** [Vite 8](https://vitejs.dev/) with Rolldown / Oxc architecture
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/) + Custom SOC Design Tokens
- **3D Graphics:** [Three.js](https://threejs.org/) + [@react-three/fiber](https://r3f.docs.pmnd.rs/) + [@react-three/drei](https://github.com/pmndrs/drei)
- **State Management:** [Zustand](https://github.com/pmndrs/zustand) with multi-storage persistence
- **Client Database:** [Dexie.js](https://dexie.org/) (IndexedDB wrapper for audit trails and candidate snapshots)
- **Icons:** [Lucide React](https://lucide.dev/)
- **Data Visualizations:** Dynamic SVG radar charts, telemetry gauges, and skill nodes

---

## 🚀 Quick Start

### Prerequisites
- [Node.js](https://nodejs.org/) v18.0.0 or higher
- [npm](https://www.npmjs.com/) v9.0.0 or higher

### Installation

```bash
# Clone the repository
git clone https://github.com/yashharfode/Cyber-Cell-Recuitment-Exam.git

# Navigate to the project directory
cd Cyber-Cell-Recuitment-Exam

# Install dependencies
npm install

# Start local development server
npm run dev
```

The application will launch on `http://localhost:5173/`.

### Production Build

```bash
# Type check and build production assets
npm run build

# Preview production build locally
npm run preview
```

---

## 📁 Repository Directory Structure

```text
Cyber-Cell-Recuitment-Exam/
├── public/                       # Static public assets (logos, icons, audio)
├── src/
│   ├── antiCheat/                # Proctoring monitors, tab tracking, audit hooks
│   ├── challenges/               # Round 01 challenge dispatcher and modal components
│   ├── components/               # Global navigation guards, badges, and shared UI
│   ├── data/                     # Challenge banks, mission configs, mock candidates
│   ├── game/                     # Three.js 3D Cyber Room environment and player controls
│   ├── minigames/                # 10 interactive arcade simulation modules & skill tree
│   ├── pages/                    # Primary application views:
│   │   ├── LandingPage.tsx       # Professional asymmetric product entrance
│   │   ├── Login.tsx             # Universal candidate authentication
│   │   ├── PreCheck.tsx          # Camera, audio, and fullscreen hardware check
│   │   ├── GameMode.tsx          # 3D SOC incident environment (Round 01 A)
│   │   ├── CyberArcade.tsx       # Simulation lab with fullscreen security suppression
│   │   ├── AdminDashboard.tsx    # Recruiter dossier, live flags, and score management
│   │   └── ResultScreen.tsx      # Comprehensive candidate performance breakdown
│   ├── round2/                   # Round 01 B Personalized Profiling engine:
│   │   ├── components/           # FillInBlankModal, MiniIDE, TechnicalProfileSetup
│   │   └── pages/                # AssessmentRunner, Round2ResultScreen
│   ├── storage/                  # IndexedDB audit log and photo persistence
│   ├── store/                    # Zustand store for session state, scoring, timers
│   ├── types/                    # TypeScript interfaces for challenges, profiles, telemetry
│   └── utils/                    # Cross-browser fullscreen helpers and audio synthesizers
├── index.html                    # Root HTML template
├── package.json                  # Dependencies and build scripts
├── tsconfig.json                 # Strict TypeScript configuration
└── vite.config.ts                # Vite plugin pipeline
```

---

## 👥 Organization & Credits

Developed with pride for:

**CYBER CELL — SATI VIDISHA**  
*The Premier Cybersecurity & Technology Club*  
**Samrat Ashok Technological Institute (Autonomous Institute)**  
Vidisha, Madhya Pradesh — 464001, India  

---

<div align="center">
  <sub>Built for fair, transparent, and rigorous technical talent discovery. &copy; 2026 Cyber Cell, SATI Vidisha.</sub>
</div>
