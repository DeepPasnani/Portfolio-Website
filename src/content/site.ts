export const person = {
  name: "Deep Pasnani",
  role: "Computer Engineering student · quant tooling, applied ML, full-stack systems",
  location: "Vadodara, Gujarat",
  email: "deeppasnani@yahoo.com",
  github: "https://github.com/DeepPasnani",
  githubLabel: "github.com/DeepPasnani",
  linkedin: "https://linkedin.com/in/deep-pasnani-608826290",
  linkedinLabel: "linkedin.com/in/deep-pasnani-608826290",
};

export const stackGroups = [
  {
    label: "Quant / ML",
    items: [
      "Python, NumPy, pandas",
      "PyTorch, scikit-learn",
      "Black-Scholes, Greeks, IV",
      "Power BI, Tableau",
    ],
  },
  {
    label: "Full-Stack",
    items: [
      "TypeScript, React",
      "Node.js, Postgres",
      "REST + auth flows",
      "Tailwind, design systems",
    ],
  },
  {
    label: "Systems",
    items: ["Linux, self-hosting", "Bash, cron, systemd", "Docker, Nginx", "Git, CI pipelines"],
  },
  {
    label: "Data",
    items: ["SQL, data cleaning", "ETL pipelines", "Statistical analysis", "Data visualization"],
  },
];

export type Project = {
  title: string;
  role: string;
  year: string;
  summary: string;
  stack: string;
  repo: string;
  repoLabel: string;
};

export const projectCategories: {
  label: string;
  note: string;
  projects: Project[];
}[] = [
  {
    label: "Quant / ML",
    note: "Numerical models where correctness is the product.",
    projects: [
      {
        title: "Greeks Gym",
        role: "Quant intern, ZeTheta",
        year: "2026",
        summary:
          "Options pricing and Greeks trainer used internally: Black-Scholes/Merton pricing, Newton-Raphson IV solvers, and an interactive 3D volatility surface across strikes and maturities.",
        stack: "Python · React · TypeScript · Black-Scholes",
        repo: "https://github.com/DeepPasnani/Options-Greeks-Gym",
        repoLabel: "github.com/DeepPasnani/Options-Greeks-Gym",
      },
      {
        title: "Stock Volatility Predictor",
        role: "Self-made",
        year: "2025",
        summary:
          "XGBoost volatility forecaster trained on Yahoo Finance data, 15% more accurate than traditional baselines; live Streamlit dashboard with 30-second updates; preprocessing pipeline tuned for 1M+ daily data points and sub-10-minute retraining.",
        stack: "Python · XGBoost · Streamlit · yfinance",
        repo: "https://github.com/DeepPasnani/Stock-Volatility-Prediction-with-XGBoost",
        repoLabel: "github.com/DeepPasnani/Stock-Volatility-Prediction-with-XGBoost",
      },
      {
        title: "F1 Driver-Style & Lap-Time Modelling",
        role: "Self-made",
        year: "2025–2026",
        summary:
          "KMeans clustering over FastF1 telemetry segments drivers into behavioural archetypes; a RandomForestRegressor predicts lap times and correlates clusters with tire/setup data for pit strategy.",
        stack: "Python · FastF1 · KMeans · Random Forest",
        repo: "https://github.com/DeepPasnani/Advanced-F1-Telemetry-Modeling-Driver-Style-Classification",
        repoLabel: "github.com/DeepPasnani/Advanced-F1-Telemetry-Modeling…",
      },
    ],
  },
  {
    label: "Full-Stack",
    note: "Platforms real users depend on.",
    projects: [
      {
        title: "CampusTrack",
        role: "Solo build, SVIT placement cell",
        year: "2025",
        summary:
          "Placement platform for SVIT: student profiles, verified company workflows, live coding challenges via Judge0, real-time leaderboards, role-scoped dashboards for TPO/recruiter/student.",
        stack: "React · Node.js · Express · PostgreSQL · Redis",
        repo: "https://github.com/DeepPasnani/Mock-Placement-App",
        repoLabel: "github.com/DeepPasnani/Mock-Placement-App",
      },
    ],
  },
  {
    label: "Hardware",
    note: "Where code meets the physical world.",
    projects: [
      {
        title: "Line Follower Robot",
        role: "Personal project",
        year: "2024",
        summary:
          "Autonomous line-following robot on an Arduino Uno with an 8-channel IR sensor array and a PID control loop for smooth real-time path correction.",
        stack: "Arduino Uno · C++ · PID Control",
        repo: "https://github.com/DeepPasnani/Line-Follower-Robot",
        repoLabel: "github.com/DeepPasnani/Line-Follower-Robot",
      },
    ],
  },
  {
    label: "Systems",
    note: "The layer beneath the app.",
    projects: [
      {
        title: "Self-Hosted Deployment Stack",
        role: "Personal infra",
        year: "2024–",
        summary:
          "Personal server running services behind Nginx with Let's Encrypt, systemd units, and a small deploy script; backups automated with cron.",
        stack: "Linux · Nginx · systemd · Docker",
        repo: "https://github.com/DeepPasnani",
        repoLabel: "github.com/DeepPasnani",
      },
    ],
  },
];

export const certifications = [
  { title: "CS50 Python", issuer: "Harvard", year: "2025" },
  { title: "CS50 SQL", issuer: "Harvard", year: "2025" },
  { title: "Google Data Analytics Professional Certificate", issuer: "Google", year: "2025" },
  { title: "Google AI Essentials", issuer: "Google", year: "2025" },
  { title: "Data Fundamentals", issuer: "IBM", year: "2025" },
  { title: "AI Fundamentals", issuer: "IBM", year: "2025" },
  { title: "Power BI Data Analyst Associate", issuer: "Microsoft", year: "2025" },
  { title: "Data Science for Engineers", issuer: "NPTEL IIT Madras", year: "2025" },
  { title: "Python Programming", issuer: "EC Council", year: "2025" },
  { title: "Data Analytics", issuer: "Cisco", year: "2025" },
  { title: "Introduction to AI", issuer: "Accenture", year: "2025" },
  { title: "Introduction to AI", issuer: "Cisco", year: "2025" },
];

export const virtualLabs = [
  { title: "Data Analytics", issuer: "Quantium", year: "2025" },
  { title: "Data Visualization", issuer: "Tata", year: "2025" },
  { title: "Intro to Data Science", issuer: "Commonwealth Bank", year: "2025" },
  { title: "Power BI", issuer: "PwC", year: "2025" },
  { title: "Excel Certificate", issuer: "JPMorgan Chase", year: "2025" },
  { title: "Excel Skills for Business", issuer: "Goldman Sachs", year: "2025" },
];

export const experience = [
  {
    org: "ZeTheta Algorithms Private Limited",
    title: "Investech Quant Trader Intern",
    period: "Apr 2026 – Jul 2026",
    points: [
      "Built options pricing tools (Black-Scholes, Newton-Raphson IV solver) and 3D volatility surface visualizations for a fintech trading simulator.",
      "Designed an interactive Greeks Gym and Risk Dashboard using React/TypeScript to teach derivatives and market microstructure concepts.",
      "Developed algorithmic backtesting logic for equities/options trading simulations.",
    ],
  },
  {
    org: "SVIT, Vasad — Training & Placement Cell",
    title: "TnP Cell Junior Coordinator",
    period: "Feb 2026 – Present",
    points: [
      "Led campus recruitment campaigns for 100+ students, increasing placement opportunities by 40% and employer engagement by 30%.",
      "Maintained placement databases for data-driven planning, reducing scheduling conflicts by 25%.",
      "Conducted 15+ workshops on resumes, mock interviews, and soft skills, boosting student interview success rates by 20%.",
    ],
  },
];

export const navItems = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/skills", label: "Skills" },
  { to: "/projects", label: "Projects" },
  { to: "/certifications", label: "Certifications" },
  { to: "/experience", label: "Experience" },
  { to: "/resume", label: "Resume" },
  { to: "/contact", label: "Contact" },
] as const;
