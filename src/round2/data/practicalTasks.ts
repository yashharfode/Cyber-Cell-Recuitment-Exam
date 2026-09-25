import type { PracticalTask } from '../../types/round2';

export const PRACTICAL_TASKS: Record<string, PracticalTask> = {
  'web-cyber-card': {
    id: 'web-cyber-card',
    title: 'Cyber Cell Student Security Card',
    domain: 'WEB_DEVELOPMENT',
    skill: 'HTML / CSS / JavaScript Integration',
    difficulty: 'moderate',
    scenario: `You are tasked with completing the interactive "Student Security Card" component for the official Cyber Cell portal. The boilerplate markup is provided, but the layout is broken, unstyled, and the action button has no interactive behavior.`,
    requirements: [
      '1. Style the card (.profile-card) with dark background (#0B1018), border (#00ffcc), padding, and rounded corners.',
      '2. Center the card on the page using Flexbox or Grid on the body.',
      '3. Style the button (#joinBtn) with cyber neon accent, cursor: pointer, and a visible hover effect.',
      '4. In script.js, attach a click listener to #joinBtn so clicking changes the status badge text to "VERIFIED MEMBER" and adds class "status-verified".',
      '5. Ensure the card is responsive and fits comfortably on mobile screens (max-width: 420px, width: 90%).'
    ],
    starterFiles: [
      {
        name: 'index.html',
        language: 'html',
        content: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Cyber Cell Card</title>
  <link rel="stylesheet" href="style.css" />
</head>
<body>
  <div class="profile-card">
    <div class="card-badge" id="statusBadge">OPERATIVE PENDING</div>
    <h2 class="card-title">Cyber Cell</h2>
    <p class="card-subtitle">Technical Security Division • SATI Vidisha</p>
    <div class="card-details">
      <div class="detail-row">
        <span>Domain:</span>
        <strong id="domainVal">Technical Assessment</strong>
      </div>
      <div class="detail-row">
        <span>Security Clearance:</span>
        <strong>Level 01 B</strong>
      </div>
    </div>
    <button id="joinBtn" class="action-btn">ACTIVATE CLEARANCE</button>
  </div>
  <script src="script.js"></script>
</body>
</html>`
      },
      {
        name: 'style.css',
        language: 'css',
        content: `/* Student Security Card Stylesheet */
body {
  margin: 0;
  min-height: 100vh;
  background-color: #05070D;
  color: #EAF7F5;
  font-family: 'Segoe UI', system-ui, sans-serif;
  /* TODO: Center the profile-card on screen */
  display: flex;
  justify-content: center;
  align-items: center;
}

.profile-card {
  /* TODO: Complete styling: background, border, padding, border-radius, max-width */
  background: #0B1018;
  border: 1px solid #00ffcc;
  border-radius: 8px;
  padding: 24px;
  width: 90%;
  max-width: 380px;
  box-sizing: border-box;
}

.card-badge {
  display: inline-block;
  font-size: 11px;
  font-weight: bold;
  letter-spacing: 1px;
  padding: 4px 8px;
  background: rgba(0, 255, 204, 0.15);
  color: #00ffcc;
  border-radius: 4px;
  margin-bottom: 12px;
}

.card-badge.status-verified {
  background: rgba(34, 197, 94, 0.2);
  color: #22c55e;
  border: 1px solid #22c55e;
}

.card-title {
  margin: 0 0 6px 0;
  font-size: 22px;
  color: #ffffff;
}

.card-subtitle {
  margin: 0 0 16px 0;
  font-size: 12px;
  color: #8DA3A0;
}

.card-details {
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  padding: 12px 0;
  margin-bottom: 20px;
  font-size: 13px;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 6px;
}

.action-btn {
  width: 100%;
  padding: 12px;
  background: #00ffcc;
  color: #05070D;
  border: none;
  border-radius: 4px;
  font-weight: bold;
  font-size: 13px;
  letter-spacing: 1px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.action-btn:hover {
  background: #ffffff;
  box-shadow: 0 0 15px rgba(0, 255, 204, 0.5);
}`
      },
      {
        name: 'script.js',
        language: 'javascript',
        content: `// Attach interactive behavior
document.addEventListener('DOMContentLoaded', () => {
  const joinBtn = document.getElementById('joinBtn');
  const statusBadge = document.getElementById('statusBadge');

  if (joinBtn && statusBadge) {
    joinBtn.addEventListener('click', () => {
      // Update badge text and appearance
      statusBadge.textContent = 'VERIFIED MEMBER';
      statusBadge.classList.add('status-verified');
      joinBtn.textContent = 'ACCESS GRANTED';
      joinBtn.disabled = true;
      joinBtn.style.opacity = '0.7';
    });
  }
});`
      }
    ],
    testCases: [
      {
        id: 'tc-card-exists',
        description: 'Profile card container element (.profile-card) exists in DOM',
        assertionType: 'element_exists',
        selector: '.profile-card',
        points: 20
      },
      {
        id: 'tc-card-title',
        description: 'Header text (.card-title) is present',
        assertionType: 'element_exists',
        selector: '.card-title',
        points: 15
      },
      {
        id: 'tc-button-exists',
        description: 'Action button (#joinBtn) exists with cursor pointer',
        assertionType: 'element_exists',
        selector: '#joinBtn',
        points: 15
      },
      {
        id: 'tc-responsive-width',
        description: 'Card styles define max-width constraint for responsive layout',
        assertionType: 'style_match',
        selector: '.profile-card',
        targetProperty: 'maxWidth',
        expectedValue: '380px',
        points: 20
      },
      {
        id: 'tc-btn-interactive',
        description: 'Clicking #joinBtn updates status badge text to "VERIFIED MEMBER"',
        assertionType: 'event_reactive',
        selector: '#joinBtn',
        targetProperty: '#statusBadge',
        expectedValue: 'VERIFIED MEMBER',
        points: 30
      }
    ],
    rubricWeights: {
      functional: 40,
      visualLayout: 30,
      responsiveness: 15,
      codeQuality: 15
    },
    maxPoints: 100,
    timeLimitSeconds: 600
  },

  'python-log-filter': {
    id: 'python-log-filter',
    title: 'Suspicious IP Failed Login Aggregator',
    domain: 'PROGRAMMING',
    skill: 'Python Data Aggregation & Logic',
    language: 'Python',
    difficulty: 'moderate',
    scenario: `The SOC sensor captured a stream of authentication events containing IP addresses and login statuses ('SUCCESS' or 'FAILED'). Complete the function to detect brute force attempts.`,
    requirements: [
      'Implement find_flagged_ips(events, threshold):',
      '1. Count the number of "FAILED" logins for each IP address.',
      '2. Return an alphabetically sorted list of IP addresses that have failed logins greater than or equal to threshold.',
      '3. Ignore "SUCCESS" attempts when counting failures.'
    ],
    starterFiles: [
      {
        name: 'solution.py',
        language: 'python',
        content: `def find_flagged_ips(events, threshold):
    """
    events: List of dicts, e.g.:
      [{"ip": "192.168.1.5", "status": "FAILED"}, ...]
    threshold: int, minimum failed attempts to flag an IP
    Returns: List of unique IP strings sorted alphabetically
    """
    failed_counts = {}
    for ev in events:
        if ev.get("status") == "FAILED":
            ip = ev.get("ip")
            failed_counts[ip] = failed_counts.get(ip, 0) + 1
            
    flagged = [ip for ip, count in failed_counts.items() if count >= threshold]
    return sorted(flagged)

# Test run
if __name__ == "__main__":
    sample = [
        {"ip": "10.0.0.1", "status": "FAILED"},
        {"ip": "10.0.0.2", "status": "SUCCESS"},
        {"ip": "10.0.0.1", "status": "FAILED"},
        {"ip": "10.0.0.3", "status": "FAILED"},
        {"ip": "10.0.0.1", "status": "FAILED"}
    ]
    print("Flagged (threshold=2):", find_flagged_ips(sample, 2))
`
      }
    ],
    testCases: [
      {
        id: 'tc-py-basic',
        description: 'Flags IP reaching threshold of 2 failed attempts',
        assertionType: 'output_exact',
        expectedValue: ['10.0.0.1'],
        points: 40
      },
      {
        id: 'tc-py-multiple',
        description: 'Correctly sorts multiple flagged IPs alphabetically',
        assertionType: 'output_exact',
        points: 30
      },
      {
        id: 'tc-py-success-ignore',
        description: 'Does not count SUCCESS logins towards failure threshold',
        assertionType: 'output_exact',
        points: 30
      }
    ],
    rubricWeights: {
      functional: 50,
      codeQuality: 30,
      responsiveness: 20
    },
    maxPoints: 100,
    timeLimitSeconds: 600
  },

  'dsa-second-largest': {
    id: 'dsa-second-largest',
    title: 'Find Second Largest Distinct Element',
    domain: 'DSA',
    skill: 'Linear Array Traversal & Invariants',
    language: 'Python',
    difficulty: 'moderate',
    scenario: `Given an integer array nums, return the second largest distinct integer in O(N) time and O(1) auxiliary space. If no second largest distinct value exists, return -1.`,
    requirements: [
      '1. Implement get_second_largest(nums).',
      '2. Must handle duplicates gracefully (e.g. [10, 10, 5] -> 5).',
      '3. Return -1 if array has fewer than 2 distinct elements (e.g. [7, 7, 7] -> -1).'
    ],
    starterFiles: [
      {
        name: 'solution.py',
        language: 'python',
        content: `def get_second_largest(nums):
    if len(nums) < 2:
        return -1

    largest = -float('inf')
    second_largest = -float('inf')

    for n in nums:
        if n > largest:
            second_largest = largest
            largest = n
        elif n < largest and n > second_largest:
            second_largest = n

    return second_largest if second_largest != -float('inf') else -1

# Sample test run
if __name__ == "__main__":
    test_arr = [12, 35, 1, 10, 34, 1]
    print("Second largest:", get_second_largest(test_arr)) # Expected: 34
`
      }
    ],
    testCases: [
      {
        id: 'tc-dsa-basic',
        description: 'Returns 34 for [12, 35, 1, 10, 34, 1]',
        assertionType: 'output_exact',
        points: 40
      },
      {
        id: 'tc-dsa-duplicates',
        description: 'Correctly identifies second distinct element in [10, 10, 5]',
        assertionType: 'output_exact',
        points: 30
      },
      {
        id: 'tc-dsa-all-equal',
        description: 'Returns -1 when all elements are equal [5, 5, 5]',
        assertionType: 'output_exact',
        points: 30
      }
    ],
    rubricWeights: {
      functional: 60,
      codeQuality: 40
    },
    maxPoints: 100,
    timeLimitSeconds: 600
  }
};
