import type { Round2Challenge } from '../../types/round2';

export const ROUND2_CHALLENGES: Round2Challenge[] = [
  // ==========================================
  // WEB DEVELOPMENT CHALLENGES
  // ==========================================
  {
    id: 'r2-web-k1',
    domain: 'WEB_DEVELOPMENT',
    subSkill: 'HTML5 Semantic Elements',
    tier: 'knowledge',
    difficulty: 'easy',
    title: 'SEMANTIC HTML // ARCHITECTURE',
    prompt: 'Which HTML5 element represents an independent, self-contained piece of content that could be distributed or reused independently (such as a blog post or news story)?',
    options: [
      '<section>',
      '<article>',
      '<aside>',
      '<div>'
    ],
    correctAnswer: '<article>',
    explanation: 'The <article> element is intended to encapsulate a self-contained composition that makes sense on its own, whereas <section> is a thematic grouping.',
    points: 100,
    timeLimitSeconds: 60
  },
  {
    id: 'r2-web-k2',
    domain: 'WEB_DEVELOPMENT',
    subSkill: 'CSS3 Styling',
    tier: 'knowledge',
    difficulty: 'easy',
    title: 'CSS BOX MODEL // SIZING PROPERTY',
    prompt: 'Which CSS property ensures that padding and border are included within an element\'s total specified width and height?',
    options: [
      'box-sizing: border-box',
      'box-sizing: content-box',
      'display: inline-block',
      'overflow: hidden'
    ],
    correctAnswer: 'box-sizing: border-box',
    explanation: 'box-sizing: border-box instructs the browser to account for any border and padding inside the declared width and height.',
    points: 100,
    timeLimitSeconds: 60
  },
  {
    id: 'r2-web-a1',
    domain: 'WEB_DEVELOPMENT',
    subSkill: 'CSS Flexbox',
    tier: 'application',
    difficulty: 'moderate',
    title: 'FLEXBOX DEBUGGING // CENTERING DRIFT',
    prompt: 'A card container has `display: flex`. The developer wants to center the child card both horizontally and vertically inside a full-height container. Which pair of properties achieves this?',
    options: [
      'justify-content: center; align-items: center;',
      'align-content: center; text-align: center;',
      'float: center; margin: auto;',
      'position: relative; display: block;'
    ],
    correctAnswer: 'justify-content: center; align-items: center;',
    explanation: 'justify-content aligns children along the main axis (horizontal by default), and align-items aligns along the cross axis (vertical).',
    points: 100,
    timeLimitSeconds: 60
  },
  {
    id: 'r2-web-a2',
    domain: 'WEB_DEVELOPMENT',
    subSkill: 'JavaScript (ES6+)',
    tier: 'application',
    difficulty: 'moderate',
    title: 'JAVASCRIPT TRACE // ASYNC EXECUTION ORDER',
    prompt: `What will be the exact order of console outputs when this script runs?

\`\`\`javascript
console.log("1");
setTimeout(() => console.log("2"), 0);
Promise.resolve().then(() => console.log("3"));
console.log("4");
\`\`\``,
    options: [
      '1, 4, 3, 2',
      '1, 2, 3, 4',
      '1, 4, 2, 3',
      '1, 3, 4, 2'
    ],
    correctAnswer: '1, 4, 3, 2',
    explanation: 'Synchronous code runs first (1, 4). Microtasks (Promise then) execute immediately after the call stack clears (3). Macrotasks (setTimeout) execute on the next event loop iteration (2).',
    points: 100,
    timeLimitSeconds: 75
  },
  {
    id: 'r2-web-s1',
    domain: 'WEB_DEVELOPMENT',
    subSkill: 'CSS & Layouts',
    tier: 'fill_in_blank',
    difficulty: 'moderate',
    title: 'SYNTAX // CSS FLEXIBLE LAYOUT PROPERTY',
    prompt: 'Which CSS display value enables a flexible layout model providing dynamic alignment and space distribution across container items?',
    codeSnippet: {
      language: 'css',
      code: '.navbar {\n  display: ______;\n  justify-content: space-between;\n  align-items: center;\n}'
    },
    fillInBlank: {
      targetWord: 'FLEX',
      acceptedAnswers: ['FLEX', 'FLEXBOX'],
      hint: 'A 4-letter CSS display keyword introduced to lay out items in one dimension (rows or columns).',
      displayTemplate: 'display: ______;'
    },
    correctAnswer: 'FLEX',
    explanation: 'The CSS "display: flex" rule creates a flex container, positioning elements efficiently along main and cross axes.',
    points: 100,
    timeLimitSeconds: 90
  },

  // ==========================================
  // PROGRAMMING (PYTHON / C / C++ / GENERAL)
  // ==========================================
  {
    id: 'r2-prog-k1',
    domain: 'PROGRAMMING',
    subSkill: 'Basics & Syntax',
    tier: 'knowledge',
    difficulty: 'easy',
    title: 'VARIABLE MUTABILITY // MEMORY BEHAVIOR',
    prompt: 'In Python, which of the following built-in collection types is IMMUTABLE (cannot be modified after creation)?',
    options: [
      'Tuple (tuple)',
      'List (list)',
      'Dictionary (dict)',
      'Set (set)'
    ],
    correctAnswer: 'Tuple (tuple)',
    explanation: 'Tuples are immutable sequences; once defined, their elements cannot be reassigned, added, or deleted.',
    points: 100,
    timeLimitSeconds: 60
  },
  {
    id: 'r2-prog-a1',
    domain: 'PROGRAMMING',
    subSkill: 'Functions & Recursion',
    tier: 'application',
    difficulty: 'moderate',
    title: 'CODE READING // LIST COMPREHENSION TRACE',
    prompt: `What will be the output of this Python snippet?

\`\`\`python
numbers = [1, 2, 3, 4, 5, 6]
res = [x * 2 for x in numbers if x % 2 == 0]
print(res)
\`\`\``,
    options: [
      '[4, 8, 12]',
      '[2, 4, 6, 8, 10, 12]',
      '[4, 16, 36]',
      '[2, 6, 10]'
    ],
    correctAnswer: '[4, 8, 12]',
    explanation: 'The filter `if x % 2 == 0` selects even numbers [2, 4, 6]. Each is multiplied by 2, resulting in [4, 8, 12].',
    points: 100,
    timeLimitSeconds: 60
  },
  {
    id: 'r2-prog-a2',
    domain: 'PROGRAMMING',
    subSkill: 'Exception Handling',
    tier: 'application',
    difficulty: 'moderate',
    title: 'DEBUGGING // DICTIONARY KEY ACCESS',
    prompt: `Consider this code which crashes with a KeyError:

\`\`\`python
user = {"name": "Alice", "role": "admin"}
email = user["email"]
\`\`\`

Which is the most idiomatic, crash-resistant way to safely retrieve "email" with a default value of None?`,
    options: [
      'email = user.get("email")',
      'email = user.find("email")',
      'email = user.fetch("email", None)',
      'email = user.email'
    ],
    correctAnswer: 'email = user.get("email")',
    explanation: 'The .get(key) method returns None (or a specified default) instead of raising KeyError when the key does not exist.',
    points: 100,
    timeLimitSeconds: 60
  },
  {
    id: 'r2-prog-s1',
    domain: 'PROGRAMMING',
    subSkill: 'Functions & Lambdas',
    tier: 'fill_in_blank',
    difficulty: 'moderate',
    title: 'SYNTAX // ANONYMOUS FUNCTION KEYWORD',
    prompt: 'In Python, which keyword is used to declare a compact, inline anonymous function without using a def statement?',
    codeSnippet: {
      language: 'python',
      code: '# Anonymous function that doubles a number\ndouble = ______ x: x * 2\nprint(double(5)) # Output: 10'
    },
    fillInBlank: {
      targetWord: 'LAMBDA',
      acceptedAnswers: ['LAMBDA'],
      hint: '6-letter Python keyword derived from mathematical calculus notation.',
      displayTemplate: 'double = ______ x: x * 2'
    },
    correctAnswer: 'LAMBDA',
    explanation: 'In Python, the lambda keyword creates inline anonymous functions that can accept arguments and return the result of an expression.',
    points: 100,
    timeLimitSeconds: 90
  },

  // ==========================================
  // DSA (DATA STRUCTURES & ALGORITHMS)
  // ==========================================
  {
    id: 'r2-dsa-k1',
    domain: 'DSA',
    subSkill: 'Stack',
    tier: 'knowledge',
    difficulty: 'easy',
    title: 'DATA STRUCTURE INVARIANTS // STACK',
    prompt: 'Which ordering principle does a standard Stack data structure adhere to?',
    options: [
      'LIFO (Last In, First Out)',
      'FIFO (First In, First Out)',
      'Random Access',
      'Priority Ordered'
    ],
    correctAnswer: 'LIFO (Last In, First Out)',
    explanation: 'A Stack strictly follows Last-In, First-Out (LIFO), where elements are pushed and popped from the same end (the top).',
    points: 100,
    timeLimitSeconds: 60
  },
  {
    id: 'r2-dsa-a1',
    domain: 'DSA',
    subSkill: 'Searching (Binary Search)',
    tier: 'application',
    difficulty: 'moderate',
    title: 'ALGORITHMIC COMPLEXITY // SEARCH TRADE-OFFS',
    prompt: 'Given a sorted array of 1,000,000 integers, what is the maximum number of comparisons Binary Search will make in the worst case to locate a target element?',
    options: [
      'Approximately 20 comparisons (log2 1,000,000 ≈ 19.93)',
      '1,000,000 comparisons',
      '500,000 comparisons',
      '1,000 comparisons'
    ],
    correctAnswer: 'Approximately 20 comparisons (log2 1,000,000 ≈ 19.93)',
    explanation: 'Binary Search halves the search space each step: O(log2 N). For N = 1,000,000, log2(1,000,000) ≈ 20 comparisons.',
    points: 100,
    timeLimitSeconds: 60
  },
  {
    id: 'r2-dsa-s1',
    domain: 'DSA',
    subSkill: 'Data Structures',
    tier: 'fill_in_blank',
    difficulty: 'moderate',
    title: 'DATA STRUCTURES // LIFO OPERATING PRINCIPLE',
    prompt: 'Which fundamental linear data structure strictly follows the Last-In, First-Out (LIFO) order where insertions and deletions happen exclusively at the top?',
    codeSnippet: {
      language: 'cpp',
      code: '// Operating on LIFO principle\n______<int> callOrder;\ncallOrder.push(10);\ncallOrder.pop();'
    },
    fillInBlank: {
      targetWord: 'STACK',
      acceptedAnswers: ['STACK', 'STD::STACK'],
      hint: '5-letter linear data structure used for function call stacks, undo features, and balanced parenthesis parsing.',
      displayTemplate: '______<int> callOrder;'
    },
    correctAnswer: 'STACK',
    explanation: 'A Stack is a linear data structure that follows the LIFO (Last In First Out) principle, commonly used in function call stacks and expression parsing.',
    points: 100,
    timeLimitSeconds: 90
  },

  // ==========================================
  // CYBERSECURITY CHALLENGES
  // ==========================================
  {
    id: 'r2-sec-k1',
    domain: 'CYBERSECURITY',
    subSkill: 'Cybersecurity Fundamentals',
    tier: 'knowledge',
    difficulty: 'easy',
    title: 'INFORMATION SECURITY // CIA TRIAD',
    prompt: 'In the CIA Triad of cybersecurity, which pillar ensures that sensitive data is shielded from unauthorized viewing or disclosure?',
    options: [
      'Confidentiality',
      'Integrity',
      'Availability',
      'Authentication'
    ],
    correctAnswer: 'Confidentiality',
    explanation: 'Confidentiality protects sensitive data against unauthorized read access through encryption, access control lists, and least privilege.',
    points: 100,
    timeLimitSeconds: 60
  },
  {
    id: 'r2-sec-a1',
    domain: 'CYBERSECURITY',
    subSkill: 'Web Security (XSS, SQLi, CSRF)',
    tier: 'application',
    difficulty: 'moderate',
    title: 'ATTACK VULNERABILITY TRIAGE // WEB INJECTION',
    prompt: `An input field on a college forum renders user-submitted text directly into the web page without escaping or sanitization:

\`\`\`html
<div>Comments: <script>alert(document.cookie)</script></div>
\`\`\`

Which primary class of vulnerability does this represent?`,
    options: [
      'Cross-Site Scripting (XSS)',
      'SQL Injection (SQLi)',
      'Buffer Overflow',
      'Denial of Service (DoS)'
    ],
    correctAnswer: 'Cross-Site Scripting (XSS)',
    explanation: 'Executing arbitrary attacker JavaScript in the context of a victim\'s browser due to unescaped user input is Stored or Reflected XSS.',
    points: 100,
    timeLimitSeconds: 60
  },
  {
    id: 'r2-sec-s1',
    domain: 'CYBERSECURITY',
    subSkill: 'Network Defense & Filtering',
    tier: 'fill_in_blank',
    difficulty: 'moderate',
    title: 'SECURITY ARCHITECTURE // PACKET FILTERING DEFENSE',
    prompt: 'What network security device or software inspects incoming and outgoing traffic to permit or block data packets based on predefined stateful security rules?',
    codeSnippet: {
      language: 'bash',
      code: '# Configuring perimeter packet filter rules\nsudo ufw enable\n# Default: block unauthorized ingress via stateful ______'
    },
    fillInBlank: {
      targetWord: 'FIREWALL',
      acceptedAnswers: ['FIREWALL', 'WAF'],
      hint: '8-letter network security perimeter device used to block unauthorized port connections and inspect traffic.',
      displayTemplate: 'Perimeter network filter: ______'
    },
    correctAnswer: 'FIREWALL',
    explanation: 'A Firewall is a security system that monitors and controls incoming and outgoing network traffic based on predetermined rules.',
    points: 100,
    timeLimitSeconds: 90
  },

  // ==========================================
  // NETWORKING CHALLENGES
  // ==========================================
  {
    id: 'r2-net-k1',
    domain: 'NETWORKING',
    subSkill: 'DNS & Domain Resolution',
    tier: 'knowledge',
    difficulty: 'easy',
    title: 'NETWORK SERVICES // DOMAIN RESOLUTION',
    prompt: 'Which protocol translates human-readable domain names (such as satiengg.in) into machine-routable IP addresses?',
    options: [
      'DNS (Domain Name System)',
      'DHCP (Dynamic Host Configuration Protocol)',
      'FTP (File Transfer Protocol)',
      'ARP (Address Resolution Protocol)'
    ],
    correctAnswer: 'DNS (Domain Name System)',
    explanation: 'DNS maps human-friendly hostnames to IP addresses, acting as the internet\'s directory.',
    points: 100,
    timeLimitSeconds: 60
  },
  {
    id: 'r2-net-a1',
    domain: 'NETWORKING',
    subSkill: 'Network Troubleshooting (ping, traceroute)',
    tier: 'application',
    difficulty: 'moderate',
    title: 'NETWORK TRIAGE // DNS vs CONNECTIVITY',
    prompt: 'A student machine can successfully ping `8.8.8.8` over the terminal, but web browsers fail to open any website by URL (e.g. google.com). What is the most probable root cause?',
    options: [
      'DNS server configuration is failing or misconfigured',
      'The Ethernet network cable is disconnected',
      'The default gateway router is completely down',
      'The computer\'s network interface card is defective'
    ],
    correctAnswer: 'DNS server configuration is failing or misconfigured',
    explanation: 'Because IP ping works, Layer 1-3 network connectivity and routing are functional. Only domain name resolution (DNS) is failing.',
    points: 100,
    timeLimitSeconds: 60
  },

  // ==========================================
  // DATABASE / SQL CHALLENGES
  // ==========================================
  {
    id: 'r2-sql-k1',
    domain: 'DATABASE_SQL',
    subSkill: 'SQL Basics & Syntax',
    tier: 'knowledge',
    difficulty: 'easy',
    title: 'RELATIONAL QUERIES // SELECTION',
    prompt: 'Which SQL keyword is used to filter rows based on a specific boolean condition?',
    options: [
      'WHERE',
      'ORDER BY',
      'GROUP BY',
      'HAVING'
    ],
    correctAnswer: 'WHERE',
    explanation: 'The WHERE clause filters rows before aggregation or ordering based on specified predicates.',
    points: 100,
    timeLimitSeconds: 60
  },
  {
    id: 'r2-sql-a1',
    domain: 'DATABASE_SQL',
    subSkill: 'JOIN Operations (INNER, LEFT)',
    tier: 'application',
    difficulty: 'moderate',
    title: 'SQL JOIN // RECORD PRESERVATION',
    prompt: `You have two tables: \`Students\` and \`ClubRegistrations\`.
You want a list of ALL students, including those who have not yet registered for any club (their club columns should show NULL). Which JOIN type must be used?`,
    options: [
      'LEFT OUTER JOIN',
      'INNER JOIN',
      'CROSS JOIN',
      'NATURAL JOIN'
    ],
    correctAnswer: 'LEFT OUTER JOIN',
    explanation: 'LEFT JOIN returns all rows from the left table (Students), with matched values from the right table or NULL if no match exists.',
    points: 100,
    timeLimitSeconds: 60
  },

  // ==========================================
  // LINUX / CLI CHALLENGES
  // ==========================================
  {
    id: 'r2-lin-k1',
    domain: 'LINUX_CLI',
    subSkill: 'pwd, ls, cd',
    tier: 'knowledge',
    difficulty: 'easy',
    title: 'BASH CLI // CURRENT WORKING DIRECTORY',
    prompt: 'Which Linux command prints the full absolute path of the directory you are currently located in?',
    options: [
      'pwd',
      'whoami',
      'cd',
      'ls -l'
    ],
    correctAnswer: 'pwd',
    explanation: 'pwd stands for "print working directory", outputting the absolute path of the current shell context.',
    points: 100,
    timeLimitSeconds: 60
  },
  {
    id: 'r2-lin-a1',
    domain: 'LINUX_CLI',
    subSkill: 'cat, head, tail, grep',
    tier: 'application',
    difficulty: 'moderate',
    title: 'TERMINAL INVESTIGATION // PATTERN SEARCH',
    prompt: 'You need to search for all lines containing the word "Accepted" inside `/var/log/auth.log`. Which command correctly executes this search?',
    options: [
      'grep "Accepted" /var/log/auth.log',
      'find "Accepted" /var/log/auth.log',
      'cat /var/log/auth.log > Accepted',
      'touch "Accepted" /var/log/auth.log'
    ],
    correctAnswer: 'grep "Accepted" /var/log/auth.log',
    explanation: 'grep searches text files for regular expressions or literal strings and prints matching lines.',
    points: 100,
    timeLimitSeconds: 60
  },
  {
    id: 'r2-net-s1',
    domain: 'NETWORKING',
    subSkill: 'DNS & Domain Resolution',
    tier: 'fill_in_blank',
    difficulty: 'moderate',
    title: 'PROTOCOL IDENTIFICATION // DOMAIN RESOLUTION',
    prompt: 'Which 3-letter protocol is responsible for translating human-readable domain hostnames (e.g. satiengg.in) into machine-routable IP addresses?',
    codeSnippet: {
      language: 'bash',
      code: '# Querying hierarchical domain name servers\nnslookup satiengg.in\n# Server response provided by protocol: ______'
    },
    fillInBlank: {
      targetWord: 'DNS',
      acceptedAnswers: ['DNS'],
      hint: '3-letter abbreviation for Domain Name System operating on UDP port 53.',
      displayTemplate: 'Protocol: ______'
    },
    correctAnswer: 'DNS',
    explanation: 'DNS (Domain Name System) translates domain names into numerical IP addresses needed to locate and identify computer services and devices.',
    points: 100,
    timeLimitSeconds: 90
  },
  {
    id: 'r2-sql-s1',
    domain: 'DATABASE_SQL',
    subSkill: 'Aggregation & GROUP BY',
    tier: 'fill_in_blank',
    difficulty: 'moderate',
    title: 'SQL SYNTAX // RECORD AGGREGATION CLAUSE',
    prompt: 'Which two-word SQL clause is used to group identical data across multiple rows so that aggregate functions (COUNT, SUM, AVG) can be calculated per category?',
    codeSnippet: {
      language: 'sql',
      code: 'SELECT department, COUNT(*)\nFROM employees\n______ department;'
    },
    fillInBlank: {
      targetWord: 'GROUP BY',
      acceptedAnswers: ['GROUP BY'],
      hint: 'A two-word SQL clause starting with G and ending with BY.',
      displayTemplate: 'SELECT dept, COUNT(*) FROM employees ______ dept;'
    },
    correctAnswer: 'GROUP BY',
    explanation: 'The GROUP BY clause collapses rows that have the same values into summary rows, working alongside aggregate functions.',
    points: 100,
    timeLimitSeconds: 90
  },
  {
    id: 'r2-lin-s1',
    domain: 'LINUX_CLI',
    subSkill: 'Pattern Matching & Regex',
    tier: 'fill_in_blank',
    difficulty: 'moderate',
    title: 'CLI UTILITIES // REGULAR EXPRESSION SEARCH',
    prompt: 'Which famous 4-letter Linux command-line utility searches files or piped stream output for lines that match a specified regular expression or text pattern?',
    codeSnippet: {
      language: 'bash',
      code: '# Filtering system auth logs for failed login attempts\n______ -i "failed" /var/log/auth.log'
    },
    fillInBlank: {
      targetWord: 'GREP',
      acceptedAnswers: ['GREP'],
      hint: '4-letter utility standing for "Global Regular Expression Print".',
      displayTemplate: '______ -i "failed" /var/log/auth.log'
    },
    correctAnswer: 'GREP',
    explanation: 'grep (Global Regular Expression Print) searches plain-text data sets for lines that match a regular expression.',
    points: 100,
    timeLimitSeconds: 90
  },
  {
    id: 'r2-git-s1',
    domain: 'GIT_GITHUB',
    subSkill: 'Git Clone & Repositories',
    tier: 'fill_in_blank',
    difficulty: 'moderate',
    title: 'VERSION CONTROL // LOCAL REPOSITORY CREATION',
    prompt: 'Which Git subcommand clones an existing remote Git repository into a brand new directory on your local workstation?',
    codeSnippet: {
      language: 'bash',
      code: '# Download remote repository and initialize local tracking branch\ngit ______ https://github.com/cybercell/project.git'
    },
    fillInBlank: {
      targetWord: 'CLONE',
      acceptedAnswers: ['CLONE'],
      hint: '5-letter Git command used to duplicate an entire repository locally.',
      displayTemplate: 'git ______ <repository-url>'
    },
    correctAnswer: 'CLONE',
    explanation: 'git clone copies an existing Git repository, creating remote-tracking branches for each branch in the cloned repository.',
    points: 100,
    timeLimitSeconds: 90
  },
  {
    id: 'r2-cloud-s1',
    domain: 'CLOUD_DEVOPS',
    subSkill: 'Containers & Docker',
    tier: 'fill_in_blank',
    difficulty: 'moderate',
    title: 'DEVOPS PLATFORM // CONTAINER RUNTIME',
    prompt: 'Which widely adopted open-source containerization platform packages code and all its system dependencies into portable standardized containers?',
    codeSnippet: {
      language: 'bash',
      code: '# Run an isolated microservice container in the background\n______ run -d -p 8080:80 nginx:alpine'
    },
    fillInBlank: {
      targetWord: 'DOCKER',
      acceptedAnswers: ['DOCKER'],
      hint: '6-letter container platform with a whale mascot logo.',
      displayTemplate: '______ run -d -p 8080:80 nginx:alpine'
    },
    correctAnswer: 'DOCKER',
    explanation: 'Docker provides container virtualization allowing developers to package applications and dependencies into isolated portable containers.',
    points: 100,
    timeLimitSeconds: 90
  }
];
