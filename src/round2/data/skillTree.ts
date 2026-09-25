import type { DomainMeta, Round2Domain } from '../../types/round2';

export const DOMAIN_METADATA: Record<Round2Domain, DomainMeta> = {
  PROGRAMMING: {
    id: 'PROGRAMMING',
    title: 'Programming Languages',
    tagline: 'Write, debug and reason about code',
    description: 'Test your understanding and coding ability in languages you know.',
    iconName: 'Code',
    languagesAllowed: ['Python', 'C', 'C++', 'Java', 'JavaScript', 'C#', 'Go', 'Other'],
    subSkills: [
      {
        groupName: 'Languages Known',
        items: ['Python', 'C', 'C++', 'Java', 'JavaScript', 'C#', 'Go']
      },
      {
        groupName: 'Capabilities & Exposure',
        items: ['Basics & Syntax', 'Loops & Conditions', 'Functions & Recursion', 'Arrays & Strings', 'Object Oriented Programming', 'File Handling', 'Exception Handling']
      }
    ]
  },
  WEB_DEVELOPMENT: {
    id: 'WEB_DEVELOPMENT',
    title: 'Web Development',
    tagline: 'HTML, CSS, JavaScript, React & Web architecture',
    description: 'HTML, CSS, JavaScript, React, frontend/backend and web concepts.',
    iconName: 'Globe',
    subSkills: [
      {
        groupName: 'Frontend Fundamentals',
        items: ['HTML5 Semantic Elements', 'CSS3 Styling', 'JavaScript (ES6+)']
      },
      {
        groupName: 'CSS & Modern Layout',
        items: ['CSS Flexbox', 'CSS Grid', 'Responsive Design & Media Queries', 'CSS Animations & Transitions']
      },
      {
        groupName: 'JavaScript & Browser APIs',
        items: ['DOM Manipulation', 'Event Handling', 'Fetch & REST APIs', 'Async / Await & Promises', 'Error Handling']
      },
      {
        groupName: 'Frameworks & Libraries',
        items: ['React', 'Next.js', 'Tailwind CSS']
      },
      {
        groupName: 'Backend & APIs',
        items: ['Node.js', 'Express', 'REST API Architecture']
      }
    ]
  },
  DSA: {
    id: 'DSA',
    title: 'DSA / Problem Solving',
    tagline: 'Data structures, algorithms & computational thinking',
    description: 'Data structures, algorithms, complexity and problem solving.',
    iconName: 'Cpu',
    languagesAllowed: ['Python', 'C++', 'Java', 'C', 'JavaScript'],
    subSkills: [
      {
        groupName: 'Data Structures',
        items: ['Arrays', 'Strings', 'Linked Lists', 'Stack', 'Queue', 'Hashing & HashMaps', 'Trees & BST', 'Heap', 'Graphs']
      },
      {
        groupName: 'Algorithms',
        items: ['Searching (Binary Search)', 'Sorting Algorithms', 'Recursion', 'Greedy Techniques', 'Dynamic Programming', 'Backtracking']
      }
    ]
  },
  CYBERSECURITY: {
    id: 'CYBERSECURITY',
    title: 'Cybersecurity',
    tagline: 'Threats, web vulnerabilities & security operations',
    description: 'Security fundamentals, web security, Linux, investigation and security reasoning.',
    iconName: 'Shield',
    subSkills: [
      {
        groupName: 'Foundations & Identity',
        items: ['Cybersecurity Fundamentals', 'Authentication & Multi-Factor Auth', 'Password Security & Hashes']
      },
      {
        groupName: 'Attacks & Defense',
        items: ['Phishing & Social Engineering', 'Web Security (XSS, SQLi, CSRF)', 'Networking for Security', 'Malware Basics']
      },
      {
        groupName: 'Operations & Forensics',
        items: ['Security Operations (SOC) & Incident Response', 'Digital Forensics & Log Correlation', 'OSINT & Reconnaissance', 'CTF Solving & Cryptography']
      }
    ]
  },
  NETWORKING: {
    id: 'NETWORKING',
    title: 'Networking',
    tagline: 'IP, protocols, packet flows & troubleshooting',
    description: 'IP, DNS, ports, protocols, troubleshooting and network analysis.',
    iconName: 'Network',
    subSkills: [
      {
        groupName: 'Core Protocol Stack',
        items: ['IP Addressing (IPv4/IPv6)', 'MAC Address & ARP', 'DNS & Domain Resolution', 'DHCP & Auto-Configuration', 'TCP vs UDP Transport', 'HTTP & HTTPS (SSL/TLS)']
      },
      {
        groupName: 'Routing & Troubleshooting',
        items: ['Well-Known Ports (21, 22, 53, 80, 443)', 'Routing & Gateways', 'Subnetting & CIDR', 'Network Troubleshooting (ping, traceroute)']
      }
    ]
  },
  DATABASE_SQL: {
    id: 'DATABASE_SQL',
    title: 'Database / SQL',
    tagline: 'Relational design, query writing & data modeling',
    description: 'SQL, queries, relational concepts and database reasoning.',
    iconName: 'Database',
    subSkills: [
      {
        groupName: 'SQL Queries',
        items: ['SQL Basics & Syntax', 'SELECT & WHERE Filtering', 'JOIN Operations (INNER, LEFT)', 'GROUP BY & Aggregations (COUNT, SUM, AVG)', 'ORDER BY & LIMIT']
      },
      {
        groupName: 'Database Concepts',
        items: ['Relational Database Design', 'Primary & Foreign Keys', 'Database Normalization', 'MongoDB & NoSQL Concepts']
      }
    ]
  },
  LINUX_CLI: {
    id: 'LINUX_CLI',
    title: 'Linux / CLI',
    tagline: 'Terminal mastery, permissions & process management',
    description: 'Command line, files, permissions, processes and troubleshooting.',
    iconName: 'Terminal',
    subSkills: [
      {
        groupName: 'File System Navigation',
        items: ['pwd, ls, cd', 'mkdir, cp, mv, rm', 'cat, head, tail, grep']
      },
      {
        groupName: 'System Administration',
        items: ['File Permissions (chmod, chown)', 'Process Management (ps, top, kill)', 'Package Management (apt, pacman)', 'Basic Shell Scripting (bash)']
      }
    ]
  },
  GIT_GITHUB: {
    id: 'GIT_GITHUB',
    title: 'Git / GitHub',
    tagline: 'Distributed version control & collaboration flows',
    description: 'Version control concepts and practical Git workflows.',
    iconName: 'GitBranch',
    subSkills: [
      {
        groupName: 'Core Commands',
        items: ['Repositories & git clone', 'git add & git status', 'git commit & commit history', 'git push & git pull']
      },
      {
        groupName: 'Branches & Collaboration',
        items: ['Branching & Checkout', 'Git Merge & Conflict Resolution', 'Pull Requests & Code Reviews']
      }
    ]
  },
  CLOUD_DEVOPS: {
    id: 'CLOUD_DEVOPS',
    title: 'Cloud / DevOps',
    tagline: 'Containers, deployment pipelines & infrastructure',
    description: 'Linux, deployment, Docker, CI/CD and cloud fundamentals.',
    iconName: 'Cloud',
    subSkills: [
      {
        groupName: 'Containers & Environment',
        items: ['Docker & Container Basics', 'Environment Variables & Configuration', 'Linux for Servers']
      },
      {
        groupName: 'CI/CD & Cloud Infrastructure',
        items: ['CI/CD Pipelines (GitHub Actions)', 'Deployment Concepts (Vercel, AWS)', 'Cloud Storage & CDN Basics']
      }
    ]
  },
  OTHER: {
    id: 'OTHER',
    title: 'Other Technical Skill',
    tagline: 'Specialized or emerging technical competencies',
    description: 'Declare any other specialized technical areas (Embedded, Game Dev, AI/ML, UI/UX, etc.).',
    iconName: 'Sparkles',
    subSkills: [
      {
        groupName: 'Custom Skills',
        items: ['AI / Machine Learning', 'App Development (Flutter / Kotlin)', 'UI/UX Design Systems', 'Embedded Systems / Arduino', 'Game Development']
      }
    ]
  }
};
