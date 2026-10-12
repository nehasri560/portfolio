/**
 * Single source of truth for every word on the site.
 * Everything here is taken from public/Nehasri_Resume.pdf.
 * Three résumé typos were corrected with the owner's OK:
 * "Powe BI" → "Power BI", "Parul niversity" → "Parul University", "an contribute" → "and contribute".
 * The PDF has no embedded hyperlinks, so there is no GitHub / repo / certificate URL.
 * Later updates from the owner (not in the PDF): new email address, "Git Bash" instead of "Bash",
 * and the current role at VSP AI & Robotics (Sep 2026 – Present).
 * The "News Brief Desk" project comes from its public GitHub repo and README.
 */

export type Profile = {
  name: string;
  firstName: string;
  initials: string;
  role: string;
  roleLines: string[];
  email: string;
  phone: string;
  phoneHref: string;
  location: string;
  resumeSummary: string;
  github?: string;
  linkedin?: string;
  linkedinLabel?: string;
  resume: string;
  resumeFileName: string;
};

export const PROFILE: Profile = {
  name: "Chandra Nehasri",
  firstName: "Nehasri",
  initials: "CN",
  role: "Machine Learning · Data Analytics · Artificial Intelligence",
  roleLines: ["Machine Learning.", "Data Analytics.", "Artificial", "Intelligence."],
  email: "chandranehachowdary@gmail.com",
  phone: "+91 9182633188",
  phoneHref: "tel:+919182633188",
  location: "Hyderabad, Telangana, India",
  resumeSummary:
    "CSE graduate specialized in Artificial Intelligence, with a strong foundation in Machine Learning, Data Analytics and Software Development. Proficient in Python, SQL, Excel, Flask and MySQL with hands-on experience in AI projects involving data preprocessing, data annotation, object detection, image segmentation and Chatbot development. Eager to apply my technical skills and contribute to organization and grow professionally.",
  linkedin: "https://www.linkedin.com/in/chandra-neha-chowdary",
  linkedinLabel: "linkedin.com/in/chandra-neha-chowdary",
  resume: "/Nehasri_Resume.pdf",
  resumeFileName: "Chandra_Nehasri_Resume.pdf",
};

export type NavItem = { id: string; label: string };

export const NAV: NavItem[] = [
  { id: "about", label: "About" },
  { id: "skills", label: "Skills" },
  { id: "work", label: "Work" },
  { id: "experience", label: "Experience" },
  { id: "contact", label: "Contact" },
];

/** Section tags, numbered in page order. */
export const SECTIONS = {
  about: { index: "01", label: "About" },
  skills: { index: "02", label: "Skills" },
  work: { index: "03", label: "Selected work" },
  certifications: { index: "04", label: "Certifications" },
  experience: { index: "05", label: "Education & experience" },
  contact: { index: "06", label: "Contact" },
} as const;

export type Skill = {
  /** key into TechLogo's BRAND / CONCEPT maps */
  id: string;
  name: string;
  symbol: string;
};

export type SkillGroup = { family: string; skills: Skill[] };

/**
 * The four groups under "Technical Skills", plus one group for the tools that only
 * appear in the project / internship "Tech Stack" lines.
 */
export const SKILL_GROUPS: SkillGroup[] = [
  {
    family: "Programming",
    skills: [
      { id: "python", name: "Python", symbol: "Py" },
      { id: "sql", name: "SQL", symbol: "Sq" },
      { id: "gitbash", name: "Git Bash", symbol: "Gb" },
      { id: "html", name: "HTML", symbol: "Ht" },
      { id: "css", name: "CSS", symbol: "Cs" },
      { id: "javascript", name: "JavaScript", symbol: "Js" },
    ],
  },
  {
    family: "AI & ML",
    skills: [
      { id: "ml", name: "Machine Learning", symbol: "Ml" },
      { id: "scikitlearn", name: "Scikit-learn", symbol: "Sk" },
      { id: "pandas", name: "Pandas", symbol: "Pd" },
      { id: "numpy", name: "NumPy", symbol: "Np" },
      { id: "cv", name: "Computer Vision", symbol: "Cv" },
      { id: "segmentation", name: "Image Segmentation", symbol: "Is" },
      { id: "nlp", name: "Natural Language Processing", symbol: "Nl" },
      { id: "annotation", name: "Data Annotation Tools", symbol: "Dn" },
    ],
  },
  {
    family: "Data & Analytics",
    skills: [
      { id: "analysis", name: "Data Analysis", symbol: "Da" },
      { id: "excel", name: "MS Excel", symbol: "Ex" },
      { id: "powerbi", name: "Power BI", symbol: "Bi" },
    ],
  },
  {
    family: "Web & Database",
    skills: [
      { id: "flask", name: "Flask", symbol: "Fl" },
      { id: "mysql", name: "MySQL", symbol: "My" },
    ],
  },
  {
    family: "Core",
    skills: [
      { id: "analytical", name: "Analytical Thinking", symbol: "At" },
      { id: "problem", name: "Problem Solving", symbol: "Ps" },
      { id: "team", name: "Team Collaboration", symbol: "Tc" },
    ],
  },
];

export type Project = {
  id: string;
  index: string;
  title: string;
  kicker: string;
  date: string;
  description: string;
  features: string[];
  /** display names; `techIds` maps them to skills / logos */
  tech: string[];
  techIds: string[];
  github?: string;
  demo?: string;
};

/** Most recent first. */
export const PROJECTS: Project[] = [
  {
    id: "news-brief-desk",
    index: "01",
    title: "News Brief Desk",
    kicker: "Newsroom workflow",
    date: "Sep 2026",
    description:
      "Newsroom workflow system for grouping incoming news, editorial review, publishing, post-publication merging, and desk analytics.",
    features: [
      "Groups raw wire, press-office and blog items that describe the same event into one story, using TF-IDF and cosine similarity written in plain Python.",
      "Drafts a short brief with its sources listed and moves it through a reporter and an editor before it is published once.",
      "Reporter, Editor and Desk Head roles, with permissions enforced on the server for every route.",
      "Post-publication merging that keeps both records, plus desk-head analytics on time to publication with CSV export.",
    ],
    tech: ["Python", "Flask", "SQLite", "TF-IDF", "HTML", "CSS"],
    techIds: ["python", "flask", "sqlite", "nlp", "html", "css"],
    github: "https://github.com/nehasri560/news-brief-desk",
    demo: "https://news-brief-desk-0mbn.onrender.com",
  },
  {
    id: "entrepreneur-club",
    index: "02",
    title: "Online Interactive Entrepreneur Club",
    kicker: "Web platform",
    date: "May 2026",
    description:
      "Developed a web-based platform that enables aspiring entrepreneurs to connect, share ideas and collaborate within an online community.",
    features: [
      "Built a responsive web interface using Flask, HTML, CSS, and JavaScript for smooth user interaction.",
      "Designed and managed a MySQL database to store and manage user profiles, posts, and community interactions.",
      "Implemented user authentication, session management, and CRUD operations to support secure and dynamic platform functionality.",
    ],
    tech: ["Python", "Flask", "HTML", "CSS", "JavaScript", "MySQL"],
    techIds: ["python", "flask", "html", "css", "javascript", "mysql"],
  },
  {
    id: "ai-chatbot",
    index: "03",
    title: "AI Chatbot Application",
    kicker: "AI application",
    date: "Feb 2026",
    description:
      "Developed an AI-powered chatbot capable of real-time user interaction using natural language processing techniques.",
    features: [
      "Integrated frontend and backend components to enable dynamic query handling and seamless user interaction.",
      "Applied machine learning concepts to improve the chatbot's response handling and conversational flow.",
      "Designed an interactive interface focused on providing efficient and user-friendly chatbot interactions.",
    ],
    tech: ["Python", "Natural Language Processing", "Machine Learning", "HTML", "CSS", "JavaScript"],
    techIds: ["python", "nlp", "ml", "html", "css", "javascript"],
  },
];

export type Experience = {
  /** "Full-time" | "Internship" — shown on the timeline */
  type: string;
  role: string;
  company: string;
  place?: string;
  start: string;
  end: string;
  year: string;
  points: string[];
  tech: string[];
  techIds: string[];
};

/** Most recent first. */
export const EXPERIENCE: Experience[] = [
  {
    type: "Current role",
    role: "FDE · AI Developer",
    company: "VSP AI & Robotics",
    start: "Sep 2026",
    end: "Present",
    year: "2026",
    points: [],
    tech: [],
    techIds: [],
  },
  {
    type: "Internship",
    role: "Artificial Intelligence Intern",
    company: "Digital Bhem",
    place: "Pune",
    start: "Jan 2026",
    end: "Apr 2026",
    year: "2026",
    points: [
      "Contributed to AI and computer vision projects involving object detection, image segmentation and video annotation, supporting end to end machine learning workflows.",
      "Prepared, cleaned and annotated large-scale datasets, to improve data quality and support efficient model training and performance.",
      "Performed data processing, feature extraction and dataset analysis to prepare high quality data for machine learning applications.",
      "Collaborated with cross-functional teams to understand project requirement and deliver data-driven AI solutions aligned with project Objectives.",
    ],
    tech: ["Python", "Machine Learning", "Computer Vision", "SQL", "Data Annotation Tools"],
    techIds: ["python", "ml", "cv", "sql", "annotation"],
  },
];

export type Education = {
  degree: string;
  field: string;
  school: string;
  place: string;
  start: string;
  end: string;
  score: string;
};

export const EDUCATION: Education[] = [
  {
    degree: "Bachelor of Technology",
    field: "Computer Science and Engineering",
    school: "Parul University",
    place: "Vadodara, Gujarat",
    start: "Aug 2022",
    end: "May 2026",
    score: "CGPA: 8.00",
  },
];

export type Certification = { title: string; issuer: string; href?: string };

export const CERTIFICATIONS: Certification[] = [
  { title: "Microsoft Power BI", issuer: "Simplilearn" },
  { title: "Python Programming", issuer: "Skill India" },
];

/** The résumé lists no ranks, platform stats or honours, so the Achievements section is omitted. */
export const ACHIEVEMENTS: never[] = [];

/* ------------------------------------------------------------------ helpers */

export type SkillWithMeta = Skill & { family: string; number: number; usedIn: string[] };

/** Flat, numbered list of skills plus the projects / roles (from the résumé) that use each one. */
export const SKILLS: SkillWithMeta[] = (() => {
  let n = 0;
  return SKILL_GROUPS.flatMap((g) =>
    g.skills.map((s) => ({
      ...s,
      family: g.family,
      number: ++n,
      usedIn: [
        ...PROJECTS.filter((p) => p.techIds.includes(s.id)).map((p) => p.title),
        ...EXPERIENCE.filter((e) => e.techIds.includes(s.id)).map((e) => `${e.role} · ${e.company}`),
      ],
    })),
  );
})();
