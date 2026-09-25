import type { Challenge } from '../types';

export const challenges: Challenge[] = [
  // ==========================================
  // SECTION A: LOGIC & PROBLEM SOLVING (Q1-Q6)
  // ==========================================
  {
    id: 'c-q01',
    missionId: 'm1',
    type: 'mcq',
    category: 'CYBERSECURITY',
    skill: 'Phishing & Threat Identification',
    difficulty: 'easy',
    points: 100,
    timeLimit: 60,
    title: 'CASE 01 // URGENT ACCOUNT SUSPENSION EMAIL',
    prompt: `CASE FILE #001:
You receive an alarming email in your inbox claiming your SATI Vidisha student account is about to be terminated in 2 hours.

Examine the simulated Webmail portal above (sender address, alert banner, and embedded link). What is the BIGGEST red flag proving this is a deceptive phishing attack?`,
    interactiveType: 'phishing-hunter',
    visualCase: {
      type: 'email',
      data: {
        subject: 'URGENT: SATI Student Portal Account Suspension Notice',
        senderName: 'SATI Vidisha IT Support',
        senderEmail: 'admin-support@satiengg-portal-verify.com',
        recipient: 'student@satiengg.in',
        date: 'Today, 09:15 AM',
        alertBanner: 'CRITICAL NOTICE: IMMEDIATE ACTION REQUIRED (2 HOURS REMAINING)',
        bodyText: `Dear Student,

Our security system detected unauthorized login attempts from an unknown device. Your access to examination forms, admit cards, and student records will be PERMANENTLY SUSPENDED within 2 hours.

To prevent account termination, verify your credentials immediately using the security portal link below.`,
        buttonText: 'CLICK HERE TO VERIFY ACCOUNT CREDENTIALS',
        linkUrl: 'http://satiengg-portal-verify.com/login-reset?id=92841'
      }
    },
    options: [
      'A. The email was delivered at 09:15 AM during normal morning class hours',
      'B. The sender domain "@satiengg-portal-verify.com" is an unverified look-alike domain instead of the official college domain',
      'C. The message is addressed to the candidate email "student@satiengg.in"',
      'D. The email body contains an alert banner with red warning indicators'
    ],
    correctAnswer: 'B. The sender domain "@satiengg-portal-verify.com" is an unverified look-alike domain instead of the official college domain',
    explanation: 'Attackers register look-alike domains (typosquatting) like "satiengg-portal-verify.com" and create fake urgency ("suspended in 2 hours") to scare victims into clicking malicious login portals.'
  },
  {
    id: 'c-q02',
    missionId: 'm1',
    type: 'mcq',
    category: 'LOGIC',
    skill: 'Logical Reasoning',
    difficulty: 'easy',
    points: 100,
    timeLimit: 60,
    title: 'QUESTION 2 // RULE TRANSFORMATION',
    prompt: `A machine follows this transformation rule:

3 → 9
4 → 16
5 → 25

Then:
8 → ?`,
    options: [
      'A. 32',
      'B. 48',
      'C. 56',
      'D. 64'
    ],
    correctAnswer: 'D. 64',
    explanation: 'Each number is squared: 3² = 9, 4² = 16, 5² = 25. Thus, 8² = 64.'
  },
  {
    id: 'c-q03',
    missionId: 'm1',
    type: 'mcq',
    category: 'LOGIC',
    skill: 'Deduction Puzzle',
    difficulty: 'easy',
    points: 100,
    timeLimit: 75,
    title: 'QUESTION 3 // THE MISLABELLED FRUIT BOXES',
    prompt: `You have three boxes labelled:
• APPLE
• ORANGE
• APPLE + ORANGE

All three labels are KNOWN TO BE WRONG. You can take only ONE fruit from ONE box to determine the correct labels for all three boxes.

Which box must you pick from?`,
    options: [
      'A. APPLE',
      'B. ORANGE',
      'C. APPLE + ORANGE',
      'D. Any box'
    ],
    correctAnswer: 'C. APPLE + ORANGE',
    explanation: 'Since APPLE + ORANGE has a wrong label, it must contain entirely Apples or entirely Oranges. Picking one fruit from it immediately identifies that box, which uniquely unlocks the other two.'
  },
  {
    id: 'c-q04',
    missionId: 'm1',
    type: 'mcq',
    category: 'LOGIC',
    skill: 'Logical Ordering',
    difficulty: 'easy',
    points: 100,
    timeLimit: 60,
    title: 'QUESTION 4 // QUEUE ORDERING',
    prompt: `Four students are standing in a line:
• Rahul is before Aman
• Aman is before Riya
• Riya is before Karan

Who must be standing last in line?`,
    options: [
      'A. Rahul',
      'B. Aman',
      'C. Riya',
      'D. Karan'
    ],
    correctAnswer: 'D. Karan',
    explanation: 'The relative order is: Rahul → Aman → Riya → Karan. Karan is at the end.'
  },
  {
    id: 'c-q05',
    missionId: 'm1',
    type: 'mcq',
    category: 'LOGIC',
    skill: 'Constraint Solving',
    difficulty: 'easy',
    points: 100,
    timeLimit: 60,
    title: 'QUESTION 5 // SECURITY DOOR PIN CODE',
    prompt: `A security door has a 4-digit numeric code. You know:
• 1st digit = 2
• 2nd digit = twice the 1st digit
• 3rd digit = 1
• 4th digit = 3 more than the 3rd digit

What is the secret 4-digit code?`,
    options: [
      'A. 2414',
      'B. 2415',
      'C. 4214',
      'D. 2424'
    ],
    correctAnswer: 'A. 2414',
    explanation: '1st = 2. 2nd = 2 × 2 = 4. 3rd = 1. 4th = 1 + 3 = 4. Combined code: 2414.'
  },
  {
    id: 'c-q06',
    missionId: 'm1',
    type: 'mcq',
    category: 'LOGIC',
    skill: 'Pattern Recognition',
    difficulty: 'easy',
    points: 100,
    timeLimit: 45,
    title: 'QUESTION 6 // SHAPE ALTERNATION',
    prompt: `You see the following visual pattern:

▲   ●   ▲   ●   ▲   ?

What shape should come next?`,
    options: [
      'A. ▲',
      'B. ●',
      'C. ■',
      'D. ◆'
    ],
    correctAnswer: 'B. ●',
    explanation: 'The pattern alternates strictly between triangle (▲) and circle (●).'
  },

  // ==========================================
  // SECTION B: COMPUTER & TECHNICAL (Q7-Q11)
  // ==========================================
  {
    id: 'c-q07',
    missionId: 'm2',
    type: 'mcq',
    category: 'TECHNICAL_AWARENESS',
    skill: 'Computer Fundamentals',
    difficulty: 'easy',
    points: 100,
    timeLimit: 45,
    title: 'QUESTION 7 // TEMPORARY SYSTEM MEMORY',
    prompt: `Which hardware component temporarily stores data that is being actively used by running computer applications?`,
    options: [
      'A. SSD',
      'B. RAM',
      'C. Monitor',
      'D. Keyboard'
    ],
    correctAnswer: 'B. RAM',
    explanation: 'RAM (Random Access Memory) provides high-speed volatile storage for data and programs currently in active use.'
  },
  {
    id: 'c-q08',
    missionId: 'm2',
    type: 'mcq',
    category: 'TECHNICAL_AWARENESS',
    skill: 'Permanent Storage',
    difficulty: 'easy',
    points: 100,
    timeLimit: 45,
    title: 'QUESTION 8 // PERMANENT STORAGE',
    prompt: `Which of these hardware components is mainly used to store files, documents, and programs permanently even when powered off?`,
    options: [
      'A. RAM',
      'B. CPU',
      'C. SSD',
      'D. Cache'
    ],
    correctAnswer: 'C. SSD',
    explanation: 'An SSD (Solid State Drive) is non-volatile flash storage that preserves files permanently.'
  },
  {
    id: 'c-q09',
    missionId: 'm2',
    type: 'mcq',
    category: 'NETWORKING',
    skill: 'Wireless Hardware',
    difficulty: 'easy',
    points: 100,
    timeLimit: 45,
    title: 'QUESTION 9 // WI-FI CONNECTIVITY',
    prompt: `You want to connect a laptop to a wireless Wi-Fi network. Which component is primarily responsible for wireless network connectivity?`,
    options: [
      'A. GPU',
      'B. Network adapter',
      'C. CPU fan',
      'D. Power supply'
    ],
    correctAnswer: 'B. Network adapter',
    explanation: 'The wireless network adapter (NIC) manages radio transmissions to communicate with Wi-Fi routers.'
  },
  {
    id: 'c-q10',
    missionId: 'm2',
    type: 'mcq',
    category: 'TECHNICAL_AWARENESS',
    skill: 'Operating Systems',
    difficulty: 'easy',
    points: 100,
    timeLimit: 45,
    title: 'QUESTION 10 // OPERATING SYSTEM IDENTIFICATION',
    prompt: `Which of the following is an Operating System?`,
    options: [
      'A. Python',
      'B. Windows',
      'C. Chrome',
      'D. HTML'
    ],
    correctAnswer: 'B. Windows',
    explanation: 'Microsoft Windows is an operating system. Python is a programming language, Chrome is a web browser, and HTML is a markup language.'
  },
  {
    id: 'c-q11',
    missionId: 'm2',
    type: 'mcq',
    category: 'TECHNICAL_AWARENESS',
    skill: 'Basic Troubleshooting',
    difficulty: 'easy',
    points: 100,
    timeLimit: 50,
    title: 'QUESTION 11 // FROZEN COMPUTER TRIAGE',
    prompt: `Your computer suddenly stops responding to clicks and keystrokes. Which is generally the most sensible and safe first step?`,
    options: [
      'A. Immediately delete system files',
      'B. Check whether the application is frozen and try closing it normally',
      'C. Format the computer',
      'D. Remove the SSD'
    ],
    correctAnswer: 'B. Check whether the application is frozen and try closing it normally',
    explanation: 'Most system freezes are caused by a single unresponsive application. Attempting to end that process is the least disruptive troubleshooting first step.'
  },

  // ==========================================
  // SECTION C: PROGRAMMING & LOGIC (Q12-Q16)
  // ==========================================
  {
    id: 'c-q12',
    missionId: 'm3',
    type: 'mcq',
    category: 'PROGRAMMING',
    skill: 'Code Tracing',
    difficulty: 'easy',
    points: 100,
    timeLimit: 45,
    title: 'QUESTION 12 // PYTHON ADDITION OUTPUT',
    prompt: `What will this code print to the screen?

\`\`\`python
x = 5
y = 3
print(x + y)
\`\`\``,
    options: [
      'A. 2',
      'B. 8',
      'C. 15',
      'D. 53'
    ],
    correctAnswer: 'B. 8',
    explanation: 'x is 5 and y is 3. 5 + 3 = 8.'
  },
  {
    id: 'c-q13',
    missionId: 'm3',
    type: 'mcq',
    category: 'PROGRAMMING',
    skill: 'Conditional Branching',
    difficulty: 'easy',
    points: 100,
    timeLimit: 45,
    title: 'QUESTION 13 // IF-ELSE BRANCH EVALUATION',
    prompt: `ALGORITHM SPECIFICATION:
A Python script must evaluate authorization levels according to these exact conditions:
1. Initialize variable 'x' with the value 10.
2. Check if 'x' is strictly greater than 5:
   - When True, output "A"
   - Otherwise, output "B"

The statements below are currently scrambled. Use the controls to arrange the code blocks in the correct execution sequence and indentation, then run the sequence to verify your logic.`,
    interactiveType: 'code-arranger',
    interactiveConfig: {
      prompt: 'Reorder the blocks into valid Python syntax matching the specification above.',
      blocks: [
        { id: 'b-1', text: 'x = 10', expectedIndex: 0, indent: 0 },
        { id: 'b-2', text: 'if x > 5:', expectedIndex: 1, indent: 0 },
        { id: 'b-3', text: 'print("A")', expectedIndex: 2, indent: 4 },
        { id: 'b-4', text: 'else:', expectedIndex: 3, indent: 0 },
        { id: 'b-5', text: 'print("B")', expectedIndex: 4, indent: 4 },
      ],
      expectedOutput: 'A'
    },
    options: [
      'A. A',
      'B. B',
      'C. 10',
      'D. Error'
    ],
    correctAnswer: 'A. A',
    explanation: 'Since x = 10 and 10 > 5 is True, the if branch executes: print("A").'
  },
  {
    id: 'c-q14',
    missionId: 'm3',
    type: 'mcq',
    category: 'PROGRAMMING',
    skill: 'Syntax Error Detection',
    difficulty: 'easy',
    points: 100,
    timeLimit: 45,
    title: 'QUESTION 14 // SYNTAX DEFECT IDENTIFICATION',
    prompt: `What is wrong with this line of code?

\`\`\`python
print("Hello"
\`\`\``,
    options: [
      'A. print cannot be used for text',
      'B. Missing closing parenthesis',
      'C. Missing variable',
      'D. Nothing is wrong'
    ],
    correctAnswer: 'B. Missing closing parenthesis',
    explanation: 'The opening parenthesis after print is not closed, causing a SyntaxError: unexpected EOF.'
  },
  {
    id: 'c-q15',
    missionId: 'm3',
    type: 'mcq',
    category: 'PROGRAMMING',
    skill: 'Sequential Variable Mutation',
    difficulty: 'easy',
    points: 100,
    timeLimit: 45,
    title: 'QUESTION 15 // SEQUENTIAL VALUE TRACKING',
    prompt: `What will be the final value of x?

\`\`\`text
x = 5
x = x + 3
x = x * 2
\`\`\``,
    options: [
      'A. 10',
      'B. 13',
      'C. 16',
      'D. 18'
    ],
    correctAnswer: 'C. 16',
    explanation: 'Initially x = 5. After x = x + 3, x becomes 8. After x = x * 2, x becomes 16.'
  },
  {
    id: 'c-q16',
    missionId: 'm3',
    type: 'mcq',
    category: 'PROGRAMMING',
    skill: 'Programming Concepts',
    difficulty: 'easy',
    points: 100,
    timeLimit: 45,
    title: 'QUESTION 16 // PURPOSE OF A LOOP',
    prompt: `Which of the following best describes the purpose of a loop (such as for or while) in programming?`,
    options: [
      'A. A way to repeat instructions',
      'B. A way to delete a program',
      'C. A way to turn off a computer',
      'D. A way to store electricity'
    ],
    correctAnswer: 'A. A way to repeat instructions',
    explanation: 'Loops automate repeating a set of instructions until a specified condition is satisfied.'
  },

  // ==========================================
  // SECTION D: WEB & INTERNET BASICS (Q17-Q19)
  // ==========================================
  {
    id: 'c-q17',
    missionId: 'm4',
    type: 'mcq',
    category: 'WEB',
    skill: 'Web Basics',
    difficulty: 'easy',
    points: 100,
    timeLimit: 45,
    title: 'QUESTION 17 // ROLE OF A WEB BROWSER',
    prompt: `What does a web browser primarily allow a user to do?`,
    options: [
      'A. Compile a CPU',
      'B. Access and interact with websites',
      'C. Increase RAM physically',
      'D. Repair a monitor'
    ],
    correctAnswer: 'B. Access and interact with websites',
    explanation: 'A browser retrieves, renders, and enables user interaction with web pages over the internet.'
  },
  {
    id: 'c-q18',
    missionId: 'm4',
    type: 'mcq',
    category: 'WEB',
    skill: 'Web Application Awareness',
    difficulty: 'easy',
    points: 100,
    timeLimit: 45,
    title: 'QUESTION 18 // BROWSER IDENTIFICATION',
    prompt: `Which of the following is a web browser?`,
    options: [
      'A. Python',
      'B. Chrome',
      'C. Linux',
      'D. MySQL'
    ],
    correctAnswer: 'B. Chrome',
    explanation: 'Google Chrome is a web browser. Linux is an OS, Python is a programming language, and MySQL is a database.'
  },
  {
    id: 'c-q19',
    missionId: 'm4',
    type: 'mcq',
    category: 'WEB',
    skill: 'HTTPS Protocol Indicator',
    difficulty: 'easy',
    points: 100,
    timeLimit: 50,
    title: 'QUESTION 19 // HTTPS ENCRYPTION MEANING',
    prompt: `A website URL starts with:

https://

What does the "s" in "https://" generally indicate?`,
    options: [
      'A. The site is faster',
      'B. The connection uses encryption/security mechanisms',
      'C. The site is offline',
      'D. The site is a search engine'
    ],
    correctAnswer: 'B. The connection uses encryption/security mechanisms',
    explanation: 'HTTPS stands for HyperText Transfer Protocol Secure. The "s" indicates that communications are encrypted using TLS/SSL.'
  },

  // ==========================================
  // SECTION E: BEGINNER CYBERSECURITY (Q20-Q24)
  // ==========================================
  {
    id: 'c-q20',
    missionId: 'm5',
    type: 'mcq',
    category: 'CYBERSECURITY',
    skill: 'Phishing Awareness',
    difficulty: 'easy',
    points: 100,
    timeLimit: 50,
    title: 'QUESTION 20 // SUSPICIOUS URGENT EMAIL',
    prompt: `You receive this email message:

"URGENT! Your account will be permanently deleted in 10 minutes. Click this link immediately!"

What is the safest first action?`,
    options: [
      'A. Click immediately',
      'B. Reply with your password',
      'C. Verify whether the message is genuine before taking action',
      'D. Forward your password to the sender'
    ],
    correctAnswer: 'C. Verify whether the message is genuine before taking action',
    explanation: 'Extreme artificial urgency is a classic sign of phishing. Never click links or share credentials under panic.'
  },
  {
    id: 'c-q21',
    missionId: 'm5',
    type: 'mcq',
    category: 'CYBERSECURITY',
    skill: 'Password Strength',
    difficulty: 'easy',
    points: 100,
    timeLimit: 45,
    title: 'QUESTION 21 // PASSWORD COMPLEXITY & ENTROPY',
    prompt: `Which of the following passwords is generally the strongest against automated cracking? Test credential entropy below.`,
    interactiveType: 'password-strength',
    options: [
      'A. 12345678',
      'B. password',
      'C. admin123',
      'D. T7@qL9#vP2!'
    ],
    correctAnswer: 'D. T7@qL9#vP2!',
    explanation: 'T7@qL9#vP2! has high entropy due to a mix of uppercase letters, lowercase letters, numbers, and special symbols with no dictionary words.'
  },
  {
    id: 'c-q22',
    missionId: 'm5',
    type: 'mcq',
    category: 'CYBERSECURITY',
    skill: 'Security Incident Response',
    difficulty: 'easy',
    points: 100,
    timeLimit: 45,
    title: 'QUESTION 22 // UNRECOGNIZED LOGIN ALERT',
    prompt: `You receive a security login alert on your phone for your account, but you did not attempt to log in. What should you do?`,
    options: [
      'A. Ignore it',
      'B. Investigate the activity and secure the account',
      'C. Share the alert publicly',
      'D. Turn off all security features'
    ],
    correctAnswer: 'B. Investigate the activity and secure the account',
    explanation: 'An unexpected login notification indicates someone else may have entered your credentials. You should immediately change your password and review active sessions.'
  },
  {
    id: 'c-q23',
    missionId: 'm5',
    type: 'mcq',
    category: 'CYBERSECURITY',
    skill: 'Attack Terminology',
    difficulty: 'easy',
    points: 100,
    timeLimit: 45,
    title: 'QUESTION 23 // ATTACK CLASSIFICATION',
    prompt: `A website asks for your bank password through a suspicious-looking email link. What type of cyber attack does this represent?`,
    options: [
      'A. Phishing',
      'B. Debugging',
      'C. Compression',
      'D. Formatting'
    ],
    correctAnswer: 'A. Phishing',
    explanation: 'Phishing is a social engineering attack where fraudsters impersonate trustworthy entities to steal sensitive information.'
  },
  {
    id: 'c-q24',
    missionId: 'm5',
    type: 'mcq',
    category: 'CYBERSECURITY',
    skill: 'Multi-Factor Authentication',
    difficulty: 'easy',
    points: 100,
    timeLimit: 45,
    title: 'QUESTION 24 // MULTI-FACTOR AUTHENTICATION',
    prompt: `Which of the following is an example of an additional authentication factor alongside a password?`,
    options: [
      'A. Username',
      'B. Password',
      'C. One-time password sent to your phone',
      'D. Website logo'
    ],
    correctAnswer: 'C. One-time password sent to your phone',
    explanation: 'An OTP (One-Time Password) sent to a personal physical device acts as a "possession factor" (something you have).'
  },

  // ==========================================
  // SECTION F: OBSERVATION & LOGS (Q25-Q27)
  // ==========================================
  {
    id: 'c-q25',
    missionId: 'm6',
    type: 'mcq',
    category: 'INVESTIGATION',
    skill: 'Log Telemetry Analysis',
    difficulty: 'moderate',
    points: 100,
    timeLimit: 60,
    title: 'QUESTION 25 // LOGIN LOG INVESTIGATION',
    prompt: `Inspect the authentication telemetry below and click the anomalous intrusion row:`,
    interactiveType: 'find-intruder',
    options: [
      'A. Rahul — 192.168.1.10',
      'B. Aman — 192.168.1.11',
      'C. Rahul — 185.44.19.7 SUCCESS',
      'D. None of them'
    ],
    correctAnswer: 'C. Rahul — 185.44.19.7 SUCCESS',
    explanation: 'Rahul normally logs in from local IP 192.168.1.10. An external IP (185.44.19.7) failed and then immediately succeeded 1 minute later, indicating potential credential compromise.'
  },
  {
    id: 'c-q26',
    missionId: 'm6',
    type: 'mcq',
    category: 'INVESTIGATION',
    skill: 'File Extension Awareness',
    difficulty: 'moderate',
    points: 100,
    timeLimit: 50,
    title: 'QUESTION 26 // SUSPICIOUS FILE IDENTIFICATION',
    prompt: `You are given this list of downloaded files:

• report.pdf
• photo.jpg
• holiday.png
• invoice.exe
• notes.txt

Which file should make you most cautious if you were expecting only documents and images?`,
    options: [
      'A. report.pdf',
      'B. photo.jpg',
      'C. holiday.png',
      'D. invoice.exe'
    ],
    correctAnswer: 'D. invoice.exe',
    explanation: 'An .exe file is an executable program that can run arbitrary code or install malware. An invoice should be a PDF or document, never an executable program.'
  },
  {
    id: 'c-q27',
    missionId: 'm6',
    type: 'mcq',
    category: 'INVESTIGATION',
    skill: 'Analytical Investigation',
    difficulty: 'moderate',
    points: 100,
    timeLimit: 50,
    title: 'QUESTION 27 // UNUSUAL IP ADDRESS DISCOVERY',
    prompt: `A candidate notices that one of the five displayed IP addresses is:

192.168.1.25

while the others all belong to completely different ranges and one address is marked as an external source.

What is the best next step?`,
    options: [
      'A. Ignore all addresses',
      'B. Compare the address with the scenario and investigate the unusual activity',
      'C. Delete the network logs',
      'D. Restart the computer immediately'
    ],
    correctAnswer: 'B. Compare the address with the scenario and investigate the unusual activity',
    explanation: 'Anomalies in network logs should be correlated against legitimate asset inventories to identify unauthorized hosts or exfiltration endpoints.'
  },

  // ==========================================
  // SECTION G: DECISION & TROUBLESHOOTING (Q28-Q29)
  // ==========================================
  {
    id: 'c-q28',
    missionId: 'm7',
    type: 'mcq',
    category: 'DECISION_MAKING',
    skill: 'Network Troubleshooting',
    difficulty: 'moderate',
    points: 100,
    timeLimit: 50,
    title: 'QUESTION 28 // SINGLE WEBSITE OUTAGE',
    prompt: `A specific website is not loading for you, but all other websites work normally. What should you try first?`,
    options: [
      'A. Replace your CPU',
      'B. Check whether the specific website is available and refresh/retry',
      'C. Format your laptop',
      'D. Remove the RAM'
    ],
    correctAnswer: 'B. Check whether the specific website is available and refresh/retry',
    explanation: 'Since other sites work, your internet connection and local computer are fine. The issue is likely with that specific website\'s server or temporary caching.'
  },
  {
    id: 'c-q29',
    missionId: 'm7',
    type: 'mcq',
    category: 'DECISION_MAKING',
    skill: 'Team Incident Management',
    difficulty: 'moderate',
    points: 100,
    timeLimit: 50,
    title: 'QUESTION 29 // ACCIDENTAL FILE DELETION',
    prompt: `You are working on a team project and notice that an important project file has been accidentally deleted. What is the most sensible first action?`,
    options: [
      'A. Blame the person immediately',
      'B. Check whether a backup/recovery copy exists',
      'C. Delete the remaining files',
      'D. Shut down all computers'
    ],
    correctAnswer: 'B. Check whether a backup/recovery copy exists',
    explanation: 'The immediate priority is recovery. Checking version control (Git), the recycle bin, or cloud backups resolves the issue without causing chaos.'
  },

  // ==========================================
  // SECTION H: APTITUDE & COMMUNICATION (Q30)
  // ==========================================
  {
    id: 'c-q30',
    missionId: 'm8',
    type: 'mcq',
    category: 'GRAMMAR',
    skill: 'Technical Communication',
    difficulty: 'easy',
    points: 100,
    timeLimit: 45,
    title: 'QUESTION 30 // PROFESSIONAL TECHNICAL REPORTING',
    prompt: `Which sentence is the most professional way to report a technical problem to team leads or clients?`,
    options: [
      'A. “Bro, system is totally dead.”',
      'B. “Something is wrong with the PC.”',
      'C. “The system is not responding, and the application has stopped working.”',
      'D. “Computer gone.”'
    ],
    correctAnswer: 'C. “The system is not responding, and the application has stopped working.”',
    explanation: 'Professional communication states the specific observation and symptom clearly and objectively without casual slang.'
  }
];
