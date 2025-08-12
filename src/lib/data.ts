// Portfolio Content Data

export const personalInfo = {
  name: "DARSHAN P",
  title: "Backend Developer | Full-Stack Engineer | AI Chatbot Innovator",
  resumeUrl: "/DARSHAN_P_Resume.pdf",
  email: "pdarshan2224@gmail.com",
  socialLinks: {
    linkedin: "https://www.linkedin.com/in/pdarshan2224/",
    github: "https://github.com/DARSHAN2224",
  },
};

export const navLinks = [
  { name: "Projects", hash: "#projects" },
  { name: "Skills", hash: "#skills" },
  { name: "Contact", hash: "#contact" },
];

export interface Experience {
  id: string;
  year: string;
  title: string;
  subtitle: string;
  description: string;
  createdAt: string;
}

export const heroData = {
  titles: [
    "Backend Developer",
    "Full-Stack Engineer", 
    "AI Chatbot Innovator",
  ],
  summary: [
    "Backend Engineer with proven success in building and deploying secure, scalable web applications for 500+ users using Node.js, Express, and MongoDB.",
    "Published AI researcher (Scopus Indexed) with hands-on experience developing intelligent chatbots and systems using Python, Gemini API, and NLP.",
    "Competitive problem-solver with 300+ DSA challenges completed and top-3 finishes in multiple full-stack and IoT hackathons.",
  ],
};

export const experienceData: Experience[] = [
  {
    id: "1",
    year: "2024",
    title: "Published AI Research",
    subtitle: "Scopus Indexed Conference Paper",
    description: "Authored and published research on AI Chatbot implementation in educational institutions.",
    createdAt: "2024-01-20",
  },
  {
    id: "2",
    year: "2023",
    title: "Hackathon Champion",
    subtitle: "1st Prize - Full Stack Development",
    description: "Won first place in inter-college hackathon with telemedicine platform.",
    createdAt: "2023-11-15",
  },
  {
    id: "3",
    year: "2022",
    title: "Competitive Programming",
    subtitle: "5⭐ HackerRank, 300+ DSA Problems",
    description: "Achieved 5-star rating in C++ & Python on HackerRank.",
    createdAt: "2023-10-01",
  },
];

export interface Project {
  id: string;
  title: string;
  impactStatement: string;
  tags: string[];
  images: string[];
  demoUrl?: string | null;
  githubUrl: string;
  showDemoButton?: boolean;
  showGithubButton?: boolean;
  createdAt: string;
}

export const projectsData: Project[] = [
  {
    id: "1",
    title: "Telemedicine Web Platform",
    impactStatement: "Won 1st prize at an inter-college hackathon by developing this secure healthcare platform.",
    tags: ["React", "Node.js", "MongoDB", "Express", "WebRTC", "JWT"],
    images: [
      "/images/projects/telemedicine-1.jpg",
      "/images/projects/telemedicine-2.jpg",
      "/images/projects/telemedicine-3.jpg"
    ],
    demoUrl: null,
    githubUrl: "https://github.com/DARSHAN2224/telemedicine-platform",
    createdAt: "2024-01-15",
  },
  {
    id: "2",
    title: "AI Chatbot for Educational Institutions",
    impactStatement: "Reduced manual support load by 60% by deploying this NLP-powered chatbot.",
    tags: ["Botpress", "JavaScript", "NLP"],
    images: [
      "/images/projects/chatbot-1.jpg",
      "/images/projects/chatbot-2.jpg",
      "/images/projects/chatbot-3.jpg"
    ],
    demoUrl: "https://edu-chatbot-demo.com",
    githubUrl: "https://github.com/DARSHAN2224/edu-chatbot",
    createdAt: "2024-02-20",
  },
  {
    id: "3",
    title: "RFID Based E-Vehicle Starter System",
    impactStatement: "Secured 3rd place in a 40-team hardware hackathon by engineering this RFID security system.",
    tags: ["Arduino", "Node.js", "Serial Comm", "HTML/CSS"],
    images: [
      "/images/projects/rfid-1.jpg",
      "/images/projects/rfid-2.jpg",
      "/images/projects/rfid-3.jpg"
    ],
    demoUrl: null,
    githubUrl: "https://github.com/DARSHAN2224/rfid-vehicle-system",
    createdAt: "2023-12-10",
  },
  {
    id: "4",
    title: "Mental Health AI Assistant",
    impactStatement: "Increased user session time by 25% and positive feedback by 40% during user testing.",
    tags: ["Python", "Gemini API", "Flask", "Pandas"],
    images: [
      "/images/projects/mental-health-1.jpg",
      "/images/projects/mental-health-2.jpg",
      "/images/projects/mental-health-3.jpg"
    ],
    demoUrl: null,
    githubUrl: "https://github.com/DARSHAN2224/mental-health-ai",
    createdAt: "2024-03-05",
  },
  {
    id: "5",
    title: "Multi-Role Food Ordering System",
    impactStatement: "Engineered a scalable MVC platform supporting Admin, Seller, and User roles for 1000+ orders.",
    tags: ["Node.js", "Express", "MongoDB", "EJS", "Docker", "Mocha & Chai"],
    images: [
      "/images/projects/food-ordering-1.jpg",
      "/images/projects/food-ordering-2.jpg",
      "/images/projects/food-ordering-3.jpg"
    ],
    demoUrl: "https://food-ordering-demo.com",
    githubUrl: "https://github.com/DARSHAN2224/food-ordering-system",
    createdAt: "2024-01-30",
  },
];

export const skillsData = {
  "Languages": ["JavaScript", "Python", "C++"],
  "Backend": ["Node.js", "Express.js", "RESTful APIs", "JWT"],
  "Frontend": ["React.js", "Next.js", "HTML", "CSS", "Tailwind CSS"],
  "Databases": ["MongoDB", "MySQL"],
  "AI/ML": ["NLP", "Pandas", "Gemini API"],
  "Tools": ["Git", "Docker", "Postman"],
  "Concepts": ["WebRTC", "MVC Architecture", "Testing (Mocha & Chai)"]
};

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  createdAt: string;
}

export const achievementsData: Achievement[] = [
  {
    id: "1",
    title: "Published Research",
    description: "AI Chatbot paper published in the Scopus Indexed ICKECS 2025 conference.",
    icon: "📄",
    createdAt: "2024-01-20",
  },
  {
    id: "2",
    title: "Hackathon Champion",
    description: "1st Prize in a Full-Stack Hackathon & 3rd Prize in a 40-team IoT Hackathon.",
    icon: "🏆",
    createdAt: "2023-11-15",
  },
  {
    id: "3",
    title: "Competitive Programming",
    description: "5⭐ in C++ & Python on HackerRank. Solved 300+ DSA problems on LeetCode & GfG.",
    icon: "💻",
    createdAt: "2023-10-01",
  },
  {
    id: "4",
    title: "Innovation Finalist",
    description: "Recognized as a finalist in the Srishti 2024 Innovation Expo.",
    icon: "🚀",
    createdAt: "2024-02-10",
  },
];