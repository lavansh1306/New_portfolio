/**
 * ─────────────────────────────────────────────────────────────
 *  SINGLE SOURCE OF TRUTH FOR ALL PORTFOLIO CONTENT
 * ─────────────────────────────────────────────────────────────
 *  Sources: Lavansh_Resume_6.pdf, public GitHub (lavansh1306),
 *  and Lavansh's own project chats (PRAPTI-AI, SAHAYAK-AI,
 *  Incident Triage Agent). Nothing here is invented.
 *  Lines marked `TODO(verify)` need Lavansh's confirmation.
 *  Set a link to `null` to hide its button.
 */

export type Link = { label: string; href: string };

export const profile = {
  firstName: "Lavansh",
  lastName: "Choubey",
  role: "Full-stack & AI engineer",
  positioning: "I build dependable software for messy, real-world problems.",
  shortBio:
    "CS undergrad at SRM IST. AI Engineering Intern at C-DAC. Eight hackathon podiums. Leads a corporate group in SRM’s placement team.",
  education: {
    school: "SRM Institute of Science and Technology",
    campus: "Kattankulathur",
    degree: "B.Tech, Computer Science and Engineering",
    period: "Aug 2024 – May 2028",
    cgpa: "7.37 / 10",
    coursework: [
      "Data Structures",
      "Algorithms Analysis",
      "Internet Technology",
      "Software Methodology",
      "Database Management",
      "Operating Systems",
      "Computer Networks",
      "Artificial Intelligence",
    ],
  },
  email: "lavansh1201a@gmail.com",
  links: {
    github: "https://github.com/lavansh1306",
    // TODO(verify): GitHub README links /in/lavansh-choubey/ — using the URL you supplied.
    linkedin: "https://www.linkedin.com/in/lavansh-choubey-683355314/",
  },
  timezone: "Asia/Kolkata",
} as const;

/* ── About ─────────────────────────────────────────────────── */

export const about = {
  statement:
    "I learn by shipping. Most of what I build starts as something messy — a stack of scanned tender bids, a spreadsheet nobody has cleaned, a wall of production logs — and ends as something people can trust. I care most about the part users never see: checking the AI’s answer, asking when the input is unclear, and refusing to act without a human’s approval.",
  facts: [
    { label: "Studying", value: "B.Tech CSE", note: "SRM IST · Class of 2028" },
    { label: "Right now", value: "AI Engineering Intern", note: "C-DAC Guwahati, Govt. of India" },
    { label: "Off the clock", value: "Lead, Corporate Group", note: "PLACFV’s placement team" },
  ],
} as const;

/* ── Practical outcomes from the work (ordered like the projects) ── */

export const signals = [
  { noise: "Scanned tender bids, English + Hindi", signal: "Scores with page-level evidence", source: "PRAPTI-AI" },
  { noise: "Any spreadsheet, unknown columns", signal: "Numbers checked twice, by code", source: "SAHAYAK-AI" },
  { noise: "Production logs at 3 a.m.", signal: "Top-3 causes, held for approval", source: "Incident Triage Agent" },
  { noise: "Unknown Android APKs", signal: "Security analysis by 8 AI agents", source: "Sephela" },
  { noise: "500+ live Jira issues", signal: "Sprint, Gantt and analytics views", source: "Velocity AI" },
  { noise: "Status from 50+ network devices", signal: "Live faults, updated in ~1s", source: "TANFI-NET" },
  { noise: "Ambient audio", signal: "SOS with live location + evidence", source: "RAKSHA X" },
  { noise: "1,000+ prescription scans", signal: "Validated records, searchable in < 2s", source: "Niramaya Health Tech" },
] as const;

/* ── Technical universe ────────────────────────────────────── */

export type SkillCategory = {
  id: string;
  label: string;
  skills: { name: string; usedIn?: string[] }[];
};

export const skillCategories: SkillCategory[] = [
  {
    id: "lang",
    label: "Languages",
    skills: [
      { name: "Python", usedIn: ["PRAPTI-AI", "SAHAYAK-AI", "Incident Triage", "Sephela", "TANFI-NET", "RAKSHA X"] },
      { name: "TypeScript", usedIn: ["PRAPTI-AI", "Velocity AI", "Pravah.ai", "Stock_Verse", "Peer-Point"] },
      { name: "JavaScript", usedIn: ["SAHAYAK-AI", "RAKSHA X"] },
      { name: "Java", usedIn: ["Peer-Point"] },
      { name: "SQL", usedIn: ["SAHAYAK-AI", "Incident Triage", "Peer-Point"] },
      { name: "C++" },
    ],
  },
  {
    id: "front",
    label: "Frontend",
    skills: [
      { name: "React", usedIn: ["PRAPTI-AI", "SAHAYAK-AI", "Velocity AI", "Stock_Verse", "Peer-Point"] },
      { name: "Next.js", usedIn: ["Sephela", "This site"] },
      { name: "Vite", usedIn: ["SAHAYAK-AI", "Stock_Verse", "Peer-Point"] },
      { name: "Tailwind CSS", usedIn: ["Stock_Verse", "Peer-Point", "This site"] },
      { name: "ECharts", usedIn: ["SAHAYAK-AI", "C-DAC"] },
      { name: "Framer Motion", usedIn: ["PRAPTI-AI", "This site"] },
    ],
  },
  {
    id: "back",
    label: "Backend",
    skills: [
      { name: "FastAPI", usedIn: ["PRAPTI-AI", "SAHAYAK-AI", "Incident Triage", "TANFI-NET", "Stock_Verse"] },
      { name: "Node.js · Express", usedIn: ["Velocity AI"] },
      { name: "Flask", usedIn: ["RAKSHA X", "Stock_Verse"] },
      { name: "Spring Boot", usedIn: ["Peer-Point"] },
      { name: "SQLAlchemy", usedIn: ["PRAPTI-AI", "Incident Triage"] },
      { name: "WebSockets", usedIn: ["TANFI-NET"] },
      { name: "Celery", usedIn: ["Sephela"] },
    ],
  },
  {
    id: "data",
    label: "Data",
    skills: [
      { name: "PostgreSQL · pgvector", usedIn: ["PRAPTI-AI", "Peer-Point"] },
      { name: "MySQL", usedIn: ["Incident Triage"] },
      { name: "Redis", usedIn: ["PRAPTI-AI", "Velocity AI"] },
      { name: "DuckDB", usedIn: ["SAHAYAK-AI"] },
      { name: "pandas · Parquet", usedIn: ["SAHAYAK-AI"] },
      { name: "MongoDB" },
    ],
  },
  {
    id: "ai",
    label: "AI / ML",
    skills: [
      { name: "Multi-agent LLMs", usedIn: ["PRAPTI-AI", "Sephela"] },
      { name: "Ollama · Qwen", usedIn: ["Incident Triage"] },
      { name: "RAG · Chroma", usedIn: ["Incident Triage", "PRAPTI-AI"] },
      { name: "Gemini API", usedIn: ["RAKSHA X", "Stock_Verse"] },
      { name: "YAMNet · Vosk", usedIn: ["RAKSHA X"] },
      { name: "OCR", usedIn: ["PRAPTI-AI", "Niramaya"] },
      { name: "JSON Schema checks", usedIn: ["Pravah.ai"] },
    ],
  },
  {
    id: "ops",
    label: "Cloud & DevOps",
    skills: [
      { name: "Docker", usedIn: ["PRAPTI-AI", "Incident Triage", "TANFI-NET"] },
      { name: "Kubernetes", usedIn: ["Sephela"] },
      { name: "CI/CD", usedIn: ["Sephela"] },
      { name: "Vercel", usedIn: ["Pravah.ai", "Stock_Verse"] },
      { name: "Oracle Cloud", usedIn: ["OCI certifications"] },
    ],
  },
  {
    id: "tools",
    label: "Tools & APIs",
    skills: [
      { name: "Git & GitHub" },
      { name: "Chrome DevTools", usedIn: ["Niramaya"] },
      { name: "Slack API", usedIn: ["Pravah.ai"] },
      { name: "Jira & Linear APIs", usedIn: ["Velocity AI"] },
      { name: "OAuth 2.0", usedIn: ["Velocity AI"] },
      { name: "Twilio", usedIn: ["RAKSHA X"] },
    ],
  },
];

/* ── Projects ──────────────────────────────────────────────── */

export type ProjectVisual =
  | "tender"
  | "pipeline"
  | "triage"
  | "agents"
  | "gantt"
  | "network"
  | "waveform"
  | "thread"
  | "candles"
  | "qa";

export type Project = {
  id: string;
  name: string;
  kind: string;
  tagline: string;
  problem: string; // TODO(verify): problem framings are drafts based on what each project does.
  built: string[];
  decision: string;
  stack: string[];
  repo: string | null;
  live: string | null;
  accent: string;
  tone: "dark" | "light";
  visual: ProjectVisual;
  /** Featured projects get full horizontal-scroll panels; the rest go in the "More work" list. */
  featured: boolean;
  /** Why it ranks where it does (shown in the "More work" list and used for ordering). */
  rankNote: string;
  context?: string;
};

/**
 * Ranked by: technical depth · originality · usefulness · how well it presents.
 * 1–6 are featured; 7–10 are in the "More work" list.
 */
export const projects: Project[] = [
  {
    id: "prapti",
    name: "PRAPTI-AI",
    kind: "AI platform for government procurement",
    tagline: "AI proposes. Code verifies. People decide.",
    problem:
      "Government tenders mean hundreds of pages to write, read and score by hand, and rule breaks or collusion between bidders are easy to miss.",
    built: [
      "A full tender lifecycle in 7 stages, from indent to award, run by a team of 11 AI agents: coordinator, tender writer, rules reviewer, bid reader, 3 jurors, price analyst, award writer and an assistant.",
      "36 compliance checks from GFR, CVC, MSE and Make in India orders, each with its legal reference, plus flags for identical rates, shared directors, abnormally low bids and bid rotation.",
      "Reads scanned bids with English and Hindi OCR; FastAPI, PostgreSQL with vector search, Redis workers and a hardened Docker setup.",
    ],
    decision:
      "AI suggestions stay in “pencil” with the page they came from; only an officer’s “ink” moves a tender forward. Code rejects any quote that isn’t really in the bid, nobody can approve their own work, and the audit log is tamper-proof.",
    stack: ["FastAPI", "PostgreSQL · pgvector", "Redis", "React", "TypeScript", "Multi-agent LLMs", "OCR", "Docker"],
    repo: null, // TODO(verify): add repo link or keep private
    live: null,
    accent: "#D4A359",
    tone: "dark",
    visual: "tender",
    featured: true,
    rankNote: "Biggest system: 9 modules, 11 agents, legal rule engine, full lifecycle tested end to end.",
  },
  {
    id: "sahayak",
    name: "SAHAYAK-AI",
    kind: "AI data analyst for MIS reporting",
    context: "Built during my C-DAC internship",
    tagline: "Drop in any spreadsheet, ask in English or Hinglish, get numbers checked twice.",
    problem: "Teams spend hours building MIS reports by hand from messy files, and mistakes slip into the numbers.",
    built: [
      "A 7-stage data pipeline — ingest, detect, clean, validate, load, catalogue, ready — that works out what each column means, asks when it’s unsure and quarantines bad files.",
      "Questions in plain English or Hinglish, answered with charts, tables and the exact source rows used.",
      "Auto-built dashboards, insights, alerts, MIS reports (PDF and Word), infographics and PowerPoint decks; it can also audit a hand-made Excel report cell by cell.",
    ],
    decision:
      "Numbers always come from code, never the LLM: pandas computes, an independent DuckDB query re-checks (“Verified 2 of 2”), and any AI sentence with a wrong number is dropped.",
    stack: ["React", "Vite", "ECharts", "FastAPI", "pandas", "DuckDB", "Parquet", "LLM"],
    repo: null, // TODO(verify): C-DAC work — confirm it can be shown publicly
    live: null,
    accent: "#B85D43",
    tone: "light",
    visual: "pipeline",
    featured: true,
    rankNote: "Real government-lab use case, a careful verification design, and many output formats.",
  },
  {
    id: "triage",
    name: "Incident Triage Agent",
    kind: "Responsible-AI DevOps agent",
    tagline: "Reads the logs, finds the likely cause, proposes a fix — and does nothing until a human approves.",
    problem:
      "When production breaks, on-call engineers dig through logs under pressure, and an automated fix that’s wrong can make things worse.",
    built: [
      "A local agent that reads application logs, retrieves approved runbooks and proposes the top 3 root causes and a fix, with Qwen running locally through Ollama.",
      "Role-based approvals: viewers can’t approve, a SEV1 rollback needs a lead, and nothing runs without an approval.",
      "Safety rails: no restart during migrations, no rollback without a known-good version, automatic revert when a health check fails, and a hash-chained audit log.",
    ],
    decision:
      "Safety over autonomy. On 60 synthetic incidents, 0 of 60 unapproved runs got through and all 5 decoy incidents were escalated instead of “fixed”. Written up as a research paper draft.",
    stack: ["Python", "FastAPI", "Qwen · Ollama", "TF-IDF · Chroma", "MySQL", "SQLAlchemy", "Docker"],
    repo: null, // TODO(verify)
    live: null,
    accent: "#D4A359",
    tone: "dark",
    visual: "triage",
    featured: true,
    rankNote: "Human-in-the-loop safety, a measured evaluation and a paper draft.",
  },
  {
    id: "sephela",
    name: "Sephela",
    kind: "AI-powered APK security platform",
    tagline: "Eight AI agents take an Android app apart, one dashboard puts it back together.",
    problem: "Checking whether an Android app is safe means running many separate analyses and reading them side by side.",
    built: [
      "Built the Next.js dashboard on top of 10 Python microservices, where 8 AI agents analyse Android apps.",
      "Shipped through pull requests and CI: linting, type checks, 1,400+ tests and an 80% coverage gate on every change.",
    ],
    decision: "Nothing merges without passing the gate — tests, types and coverage are checked on every change.",
    stack: ["Next.js", "Python", "Celery", "Kubernetes", "CI/CD"],
    repo: null, // TODO(verify)
    live: null,
    accent: "#B85D43",
    tone: "light",
    visual: "agents",
    featured: true,
    rankNote: "Large microservice system with strict CI; my part was the dashboard.",
  },
  {
    id: "velocity",
    name: "Velocity AI",
    kind: "Engineering operations SaaS",
    tagline: "Sprint, Gantt and analytics views over hundreds of live Jira issues.",
    problem: "Engineering work is spread across Jira and Linear, and the views a team needs are slow to load and scattered.",
    built: [
      "Built a full-stack web app: React + TypeScript UI with sprint, Gantt and analytics views over 500+ live Jira issues.",
      "Integrated Jira and Linear through OAuth 2.0.",
    ],
    decision: "Redis caching in front of the APIs — load time down 35%, API latency under 250ms.",
    stack: ["React", "TypeScript", "Node.js", "Express", "Redis", "OAuth 2.0"],
    repo: null, // TODO(verify)
    live: null,
    accent: "#D4A359",
    tone: "dark",
    visual: "gantt",
    featured: true,
    rankNote: "Real integrations and measured speed gains.",
  },
  {
    id: "tanfi",
    name: "TANFI-NET",
    kind: "Real-time network fault detection",
    tagline: "A live wall of 50+ devices that tells you which one is failing — in about a second.",
    problem: "When teams troubleshoot network faults by hand, finding the failing device is slow.",
    built: [
      "Built a live web dashboard fed over WebSockets, updating status for 50+ network devices in ~1s.",
      "Automated fault analysis on the live data, cutting manual troubleshooting by ~40%.",
    ],
    decision: "Status is pushed over WebSockets from an asyncio FastAPI service, so the wall stays live without page reloads.",
    stack: ["FastAPI", "asyncio", "WebSockets", "Docker"],
    repo: null, // TODO(verify)
    live: null,
    accent: "#B85D43",
    tone: "light",
    visual: "network",
    featured: true,
    rankNote: "Real-time system with a measured impact.",
  },
  {
    id: "raksha",
    name: "RAKSHA X",
    kind: "Personal safety ecosystem",
    tagline: "Listens for gunshots, breaking glass and panic words — then calls for help on its own.",
    problem: "In an emergency, a person may not be able to reach their phone and ask for help.",
    built: [
      "Real-time audio threat detection: YAMNet spots dangerous sounds, Vosk listens for panic keywords.",
      "Smart SOS over Twilio WhatsApp with live location, a custom message and an audio evidence clip.",
      "A Gemini-powered support assistant and an HTML5 Canvas street-safety game.",
    ],
    decision: "Two detectors run side by side; the SOS fires only once threat probability passes a threshold.",
    stack: ["Flask", "TensorFlow", "YAMNet", "Vosk", "Librosa", "Twilio", "Gemini"],
    repo: "https://github.com/lavansh1306/RAKSHA_X",
    live: null,
    accent: "#D4A359",
    tone: "light",
    visual: "waveform",
    featured: false,
    rankNote: "Most original idea; smaller codebase.",
  },
  {
    id: "pravah",
    name: "Pravah.ai",
    kind: "AI engineering handoff platform",
    tagline: "Turns long Slack threads into tasks, owners, blockers and deadlines.",
    problem: "Decisions, owners and deadlines get buried in long Slack threads.",
    built: [
      "Built a TypeScript service that turns Slack threads into structured tasks, owners, blockers and deadlines.",
      "Handled failures safely: schema checks, a fallback when the AI API errors or times out, and health checks.",
    ],
    decision: "Every AI output is checked against a JSON Schema, and there is a fallback path when the AI call fails.",
    stack: ["TypeScript", "Slack API", "LLM APIs", "JSON Schema", "Vercel"],
    repo: null, // TODO(verify)
    live: null,
    accent: "#B85D43",
    tone: "dark",
    visual: "thread",
    featured: false,
    rankNote: "Useful and well-guarded, but a focused single service.",
  },
  {
    id: "stockverse",
    name: "Stock_Verse",
    kind: "Gamified stock-market learning",
    tagline: "Live market data, trading games and an AI assistant for first-time investors.",
    problem: "The stock market feels intimidating to young investors who have never traded.",
    built: [
      "Dashboard with live market graphs, candlestick charts and a news ticker.",
      "Trading simulator, a ten-year bet game, quizzes, XP levels and a leaderboard.",
      "Gemini-powered investment assistant with real-time stock data.",
    ],
    decision: "Split backend: FastAPI serves market data, Flask runs the Gemini chatbot; frontend on Vercel, backend on Render.",
    stack: ["React", "TypeScript", "Vite", "Tailwind", "FastAPI", "Flask", "Gemini"],
    repo: "https://github.com/lavansh1306/Stock_Verse",
    live: "https://stock-verse-nine.vercel.app",
    accent: "#D4A359",
    tone: "light",
    visual: "candles",
    featured: false,
    rankNote: "Polished and live, but a learning app rather than a hard systems problem.",
  },
  {
    id: "peerpoint",
    name: "Peer-Point",
    kind: "Collaborative doubt-solving platform",
    tagline: "Students post doubts, answer each other, and build a searchable knowledge base.",
    problem: "Doubts get answered once in a group chat and then lost.",
    built: [
      "Questions with rich text, threaded replies and subject categories (CSE, ECE, Math, AI/ML…).",
      "JWT auth with user profiles and role-based access for users and admins.",
    ],
    decision: "Spring Boot REST API with Spring Security + JWT; PostgreSQL in production, H2 in development.",
    stack: ["React", "TypeScript", "Java 17", "Spring Boot", "PostgreSQL", "JWT"],
    repo: "https://github.com/lavansh1306/Peer--Point",
    live: null,
    accent: "#B85D43",
    tone: "dark",
    visual: "qa",
    featured: false,
    rankNote: "Solid full-stack CRUD with auth; the most standard of the set.",
  },
];

/* ── Experience & leadership ───────────────────────────────── */

export type Chapter = {
  org: string;
  role: string;
  period: string;
  current?: boolean;
  context: string;
  points: string[];
  kind: "work" | "leadership" | "education";
  /** Optional role progression, oldest first. */
  progression?: { role: string; note?: string; current?: boolean }[];
};

export const chapters: Chapter[] = [
  {
    org: "C-DAC Guwahati",
    role: "AI Engineering Intern",
    period: "Oct 2026 – Feb 2027",
    current: true,
    context: "Centre for Development of Advanced Computing, Govt. of India · R&D lab",
    points: [
      // TODO(verify): written in past tense on the resume while the internship is ongoing.
      "Built the React frontend (Vite, interactive ECharts dashboards) and FastAPI backend of an AI analytics web app.",
      "Handled errors beyond the happy path: the app asks when input is unclear, holds back bad files and rolls back.",
      "Wrote handover documentation, kept 42/42 automated tests passing, and presented a live demo to the team.",
    ],
    kind: "work",
  },
  {
    org: "PLACFV’s — SRM Student Placement Team",
    role: "Lead, Corporate Group",
    period: "Present",
    current: true,
    context: "Student-run placement team at SRM IST",
    progression: [
      { role: "Volunteer" },
      { role: "Associate Head, Corporate Relations", note: "from Jan 2025" },
      { role: "Lead, Corporate Group", note: "now", current: true },
    ],
    points: [
      "Started as a volunteer and grew into leading one of the team’s corporate groups.",
      "Ran 50+ placement drives end-to-end by leading 20+ volunteers and managing recruiter communication.",
      // TODO(verify): add dates for each step and named events.
    ],
    kind: "leadership",
  },
  {
    org: "Niramaya Health Tech",
    role: "Software Engineering Intern",
    period: "Mar 2025 – Oct 2025",
    context: "Health-tech startup",
    points: [
      "Cut landing-page load time by ~30% by profiling and optimizing frontend rendering and assets.",
      "Built an OCR ingestion pipeline for 1,000+ prescription scans, with validation that catches low-quality input.",
      "Built a natural-language search over prescription history with sub-2s response time.",
    ],
    kind: "work",
  },
  {
    org: "SRM Institute of Science and Technology",
    role: "B.Tech, Computer Science and Engineering",
    period: "Aug 2024 – May 2028",
    current: true,
    context: "Kattankulathur · CGPA 7.37 / 10",
    points: ["Coursework: DSA, Algorithms, DBMS, Operating Systems, Computer Networks, Artificial Intelligence."],
    kind: "education",
  },
];

export const leadershipStats = [
  { value: 50, suffix: "+", label: "placement drives run end-to-end" },
  { value: 20, suffix: "+", label: "volunteers led" },
] as const;

/* ── Achievements ──────────────────────────────────────────── */

export const podium = { count: 8, prize: "₹25K+" } as const;

export type Result = { result: "Winner" | "1st Runner-Up" | "2nd Runner-Up" | "Finalist"; event: string; note?: string };

export const results: Result[] = [
  { result: "Winner", event: "GeoNova Hackathon" },
  { result: "Winner", event: "INN-ING Ideathon" },
  { result: "Winner", event: "Vision Hack" },
  { result: "1st Runner-Up", event: "Producting101" },
  { result: "1st Runner-Up", event: "HackPick" },
  { result: "1st Runner-Up", event: "Ennovate Ideathon" },
  { result: "1st Runner-Up", event: "CHEMFLUX Ideathon" },
  { result: "2nd Runner-Up", event: "Gender-Inclusive Future Hackathon" },
  { result: "Finalist", event: "FinShield Hackathon", note: "IIT Hyderabad × Bank of India" },
];

export const certifications = [
  { issuer: "Oracle Cloud Infrastructure", year: "2025", name: "Certified Generative AI Professional" },
  { issuer: "Oracle Cloud Infrastructure", year: "2025", name: "AI Foundations Associate" },
] as const;

/* ── Beyond the screen: how I work ─────────────────────────── */

export const principles = [
  { title: "Ship it, then harden it", body: "I’d rather put something real in front of people and make it sturdy than polish a tutorial. Hackathons taught me that." },
  { title: "Never trust the AI blindly", body: "Code re-checks every number and quote an AI gives me, and anything risky waits for a human to approve it." },
  { title: "Write it down", body: "Handover docs, clear pull requests, a README anyone can follow, and a live demo — so the next person can pick it up." },
  { title: "Grow into the room", body: "I joined the placement team as a volunteer. Now I lead one of its corporate groups." },
] as const;

export const nav = [
  { id: "about", label: "About" },
  { id: "stack", label: "Stack" },
  { id: "work", label: "Work" },
  { id: "experience", label: "Experience" },
  { id: "podium", label: "Podium" },
  { id: "contact", label: "Contact" },
] as const;

/* ── The story: chapters, subtitles, places ─────────────────── */

export type ShapeId = "storm" | "cube" | "tunnel" | "stars" | "rail" | "map" | "medal" | "horizon" | "sun";

export type StoryChapter = {
  id: string;
  num: string;
  title: string;
  /** shape the signal takes in this chapter's scene */
  shape: ShapeId;
  /** background colour of the scene (night → dawn) */
  sky: string;
  /** first-person subtitles that play during the scene */
  lines: string[];
};

export const story: StoryChapter[] = [
  { id: "prologue", num: "00", title: "Overview", shape: "cube", sky: "#0b1220", lines: [] },
  {
    id: "person",
    num: "01",
    title: "Profile",
    shape: "tunnel",
    sky: "#101211",
    lines: ["I’m Lavansh, a CS student at SRM.", "I learn by shipping things people can actually use."],
  },
  {
    id: "roots",
    num: "02",
    title: "Roots",
    shape: "map",
    sky: "#14120f",
    lines: ["Every career starts somewhere.", "Mine started in Gurugram."],
  },
  {
    id: "toolkit",
    num: "03",
    title: "Technical focus",
    shape: "stars",
    sky: "#0f1215",
    lines: ["Every tool here is one I’ve shipped with.", "No percentage bars. Just where I used it."],
  },
  {
    id: "builds",
    num: "04",
    title: "Selected work",
    shape: "rail",
    sky: "#121312",
    lines: ["Ten projects, ranked by how hard they were to get right.", "The best ones verify before they automate."],
  },
  {
    id: "road",
    num: "05",
    title: "Experience",
    shape: "map",
    sky: "#11151a",
    lines: ["I did not learn to build in isolation.", "I looked for rooms where the work was happening."],
  },
  {
    id: "arena",
    num: "06",
    title: "Achievements",
    shape: "medal",
    sky: "#161212",
    lines: ["Then came the hackathons.", "Eight podium finishes. Three wins."],
  },
  {
    id: "beyond",
    num: "07",
    title: "Working principles",
    shape: "horizon",
    sky: "#2a211d",
    lines: ["Four habits I keep on every project."],
  },
  { id: "signal", num: "08", title: "Contact", shape: "sun", sky: "#eef3f8", lines: ["Let’s build something useful."] },
];

export type Photo = { src: string; alt: string; caption: string; w: number; h: number };

export const photos = {
  portrait: { src: "photos/portrait.webp", alt: "Portrait of Lavansh Choubey in a navy blazer", caption: "Lavansh Choubey", w: 1220, h: 1289 },
  stream: { src: "photos/stream.webp", alt: "Lavansh sitting on a rock by a forest stream", caption: "Offline", w: 1050, h: 1400 },
  sunset: { src: "photos/sunset.webp", alt: "Lavansh sitting on a mountain top at sunrise", caption: "Dawn", w: 1050, h: 1400 },
} satisfies Record<string, Photo>;

/** Where the sun sits inside sunset.webp (fractions of width / height) */
export const sunsetSun = { x: 0.4262, y: 0.4385 };

/* ── The journey: real places, in the order the signal visits them ── */

export type City = { id: string; name: string; lat: number; lon: number; ncr?: boolean };

export const cities: City[] = [
  { id: "gurugram", name: "Gurugram", lat: 28.46, lon: 77.03, ncr: true },
  { id: "chennai", name: "Chennai", lat: 12.82, lon: 80.04 },
  { id: "noida", name: "Noida", lat: 28.57, lon: 77.33, ncr: true },
  { id: "delhi", name: "Delhi", lat: 28.545, lon: 77.19, ncr: true },
  { id: "guwahati", name: "Guwahati", lat: 26.14, lon: 91.74 },
  { id: "hyderabad", name: "Hyderabad", lat: 17.59, lon: 78.12 },
];

/** Centre of the zoomed-in Delhi NCR view */
export const ncrCenter = { lat: 28.52, lon: 77.18 };

export type Stop = {
  city: string;
  chapter: "roots" | "road";
  /** "ncr" zooms the map into Delhi NCR, "india" shows the whole country */
  view: "ncr" | "india";
  kicker: string;
  title: string;
  note: string;
  photos: Photo[];
};

const ph = (file: string, alt: string, caption: string, w: number, h: number): Photo => ({ src: `photos/${file}.webp`, alt, caption, w, h });

export const journey: Stop[] = [
  {
    city: "gurugram",
    chapter: "roots",
    view: "ncr",
    kicker: "Roots",
    title: "Gurugram",
    note: "Where I grew up and went to Blue Bells Public School.",
    photos: [
      ph("childhood", "Lavansh as a toddler in sunglasses", "Early days", 697, 1400),
      ph("school", "Lavansh in his Blue Bells Public School uniform", "Blue Bells Public School", 646, 1400),
      ph("teen-paragliding", "Young Lavansh strapped into a paragliding harness", "Growing up", 714, 1400),
      ph("teen-mirror", "Teenage Lavansh taking a mirror selfie", "Teen years", 646, 1400),
    ],
  },
  {
    city: "chennai",
    chapter: "roots",
    view: "india",
    kicker: "Left home",
    title: "SRM IST, Chennai",
    note: "B.Tech CSE. Joined PLACFV’s as a volunteer, and now lead one of its corporate groups.",
    photos: [
      ph("srm-friends", "Lavansh with two friends on the SRM campus", "SRM IST", 963, 1400),
      ph("placfvs-team", "The PLACFV’s placement team group photo", "The PLACFV’s team", 1400, 1050),
      ph("placfvs-tee", "Lavansh in a PLACFV’s team T-shirt", "PLACFV’s", 782, 1400),
    ],
  },
  {
    city: "noida",
    chapter: "road",
    view: "ncr",
    kicker: "Community",
    title: "GDG Cloud Community Days 2025",
    note: "Google Developer Groups Cloud, Noida.",
    photos: [ph("gdg-cloud-noida", "Lavansh at GDG Cloud Community Days 2025 in Noida", "GDG Cloud Community Days · Noida", 1053, 1400)],
  },
  {
    city: "gurugram",
    chapter: "road",
    view: "ncr",
    kicker: "Back home, as a builder",
    title: "Gurugram",
    note: "A GDG Gurugram event at Google, and a visit to the Amazon office.",
    photos: [
      ph("google-gdg", "Lavansh at the Google office for a GDG Gurugram event", "GDG Gurugram · Google", 1050, 1400),
      ph("amazon-gurugram", "Lavansh at the Amazon office in Gurugram", "Amazon · Gurugram", 1053, 1400),
    ],
  },
  {
    city: "delhi",
    chapter: "road",
    view: "ncr",
    kicker: "Campus visit",
    title: "IIT Delhi",
    note: "A visit to IIT Delhi.",
    photos: [ph("iit-delhi", "Lavansh at IIT Delhi", "IIT Delhi", 1056, 1400)],
  },
  {
    city: "hyderabad",
    chapter: "road",
    view: "india",
    kicker: "Hackathon finals",
    title: "IIT Hyderabad",
    note: "FinShield Hackathon finals, IIT Hyderabad × Bank of India.",
    photos: [ph("iith-finshield", "Lavansh and teammates at IIT Hyderabad", "FinShield finals · IIT Hyderabad", 738, 1310)],
  },
  {
    city: "guwahati",
    chapter: "road",
    view: "india",
    kicker: "Oct 2026 – now",
    title: "C-DAC Guwahati",
    note: "AI Engineering Intern at a Government of India R&D lab.",
    photos: [],
  },
];
