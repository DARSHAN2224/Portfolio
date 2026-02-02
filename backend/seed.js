const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Project = require('./models/Project');
const Skill = require('./models/Skill');
const Profile = require('./models/Profile');
const BlogPost = require('./models/BlogPost');
const SystemConfig = require('./models/SystemConfig');
const ChatSession = require('./models/ChatSession');
const SocialLink = require('./models/SocialLink');
const Experience = require('./models/Experience');
const Certificate = require('./models/Certificate');

dotenv.config();

// Projects from Resume
const projects = [
    {
        title: "Multi-Role Food Ordering System",
        description: "Designed and implemented a 3-role system (Admin/Seller/User) with role-based access control. Created analytics dashboards to provide data-driven insights into order trends and system usage.",
        domain: "Full-Stack",
        tags: ["Node.js", "Express", "MongoDB", "React.js", "RBAC"],
        links: {
            github: "https://github.com/DARSHAN2224/food-ordering-system",
            demo: "https://food-ordering-demo.com"
        },
        metrics: {
            uptime: "99.5%",
            scale: "Multi-Role System",
            latency: "<150ms",
            availability: "Production"
        },
        imageUrl: "/api/placeholder/800/450" // Placeholder - replace with actual image
    },
    {
        title: "Voice Converter – Real-Time AI Translation System",
        description: "Developed a real-time speech transcription and translation system with low-latency audio streaming using WebSockets. Optimized PCM audio processing using AudioWorklet and adaptive silence detection (30% bandwidth improvement). Integrated offline AI models (WhisperAI, ArgosTranslate, PiperTTS) supporting 8+ languages.",
        domain: "AI-ML",
        tags: ["Next.js", "React", "FastAPI", "Python", "WebSocket", "WhisperAI", "NLP"],
        links: {
            github: "https://github.com/DARSHAN2224/voice-converter",
            demo: "https://voice-converter-demo.com"
        },
        metrics: {
            uptime: "99.9%",
            scale: "8+ Languages",
            latency: "<200ms",
            availability: "Web App"
        },
        imageUrl: "/api/placeholder/800/450" // Placeholder - replace with actual image
    },
    {
        title: "HealthCare – AI-Powered Mental Health Platform",
        description: "Built a full-stack mental health platform featuring AI chatbot, emotion analysis, and personalized wellness support. Integrated NLP and Transformer-based models for emotion detection and context-aware conversations. Implemented JWT-based authentication and REST APIs for secure, role-based access.",
        domain: "Full-Stack",
        tags: ["Node.js", "React", "Python", "Flask", "MongoDB", "NLP", "Transformers", "JWT"],
        links: {
            github: "https://github.com/DARSHAN2224/healthcare-ai",
            demo: "https://healthcare-ai-demo.com"
        },
        metrics: {
            uptime: "99.7%",
            scale: "AI-Powered",
            latency: "<100ms",
            availability: "Production"
        },
        imageUrl: "/api/placeholder/800/450" // Placeholder - replace with actual image
    }
];

// Skills from Resume
const skills = [
    // Languages
    { name: "JavaScript", category: "frontend", version: "ES2023", stability: "STABLE", load: 98, icon: "code" },
    { name: "Python", category: "backend", version: "v3.12", stability: "STABLE", load: 95, icon: "terminal" },
    { name: "Java", category: "backend", version: "v17", stability: "STABLE", load: 85, icon: "coffee" },
    { name: "C++", category: "backend", version: "C++17", stability: "OPTIMAL", load: 80, icon: "code_blocks" },

    // Frontend
    { name: "React.js", category: "frontend", version: "v18.2", stability: "STABLE", load: 98, icon: "layers" },
    { name: "HTML", category: "frontend", version: "HTML5", stability: "STABLE", load: 99, icon: "web" },
    { name: "CSS", category: "frontend", version: "CSS3", stability: "STABLE", load: 99, icon: "palette" },
    { name: "EJS", category: "frontend", version: "v3.1", stability: "STABLE", load: 88, icon: "view_module" },

    // Backend & Systems
    { name: "Node.js", category: "backend", version: "v20.10", stability: "HIGH_LOAD", load: 95, icon: "dns" },
    { name: "Express.js", category: "backend", version: "v4.18", stability: "STABLE", load: 94, icon: "api" },
    { name: "REST APIs", category: "backend", version: "Standard", stability: "OPTIMAL", load: 96, icon: "cloud_sync" },
    { name: "Flask", category: "backend", version: "v3.0", stability: "STABLE", load: 90, icon: "science" },

    // Databases
    { name: "MongoDB", category: "backend", version: "v7.0", stability: "SECURE", load: 92, icon: "database" },
    { name: "MySQL", category: "backend", version: "v8.0", stability: "STABLE", load: 88, icon: "storage" },

    // AI & ML
    { name: "NLP", category: "ai", version: "Latest", stability: "EXPERIMENTAL", load: 85, icon: "psychology" },
    { name: "Transformers", category: "ai", version: "v4.36", stability: "OPTIMAL", load: 82, icon: "model_training" },
    { name: "LangChain", category: "ai", version: "v0.1", stability: "EXPERIMENTAL", load: 80, icon: "link" },
    { name: "Pandas", category: "ai", version: "v2.1", stability: "STABLE", load: 90, icon: "table_chart" },
    { name: "NumPy", category: "ai", version: "v1.26", stability: "STABLE", load: 92, icon: "functions" },

    // Tools
    { name: "Git", category: "devops", version: "v2.43", stability: "VERSIONED", load: 99, icon: "commit" },
    { name: "GitHub Copilot", category: "devops", version: "Latest", stability: "AI_ASSIST", load: 95, icon: "smart_toy" },
    { name: "Google Cloud", category: "devops", version: "Cloud", stability: "ONLINE", load: 85, icon: "cloud" },
    { name: "Postman", category: "devops", version: "v10.20", stability: "TESTING", load: 90, icon: "api" },
    { name: "VS Code", category: "devops", version: "v1.85", stability: "OPTIMAL", load: 98, icon: "code" },

    // Core Concepts
    { name: "OOPs", category: "backend", version: "Standard", stability: "FUNDAMENTAL", load: 95, icon: "category" },
    { name: "MVC", category: "backend", version: "Pattern", stability: "ARCHITECTURAL", load: 92, icon: "schema" },
    { name: "Unit Testing", category: "devops", version: "Standard", stability: "QUALITY", load: 88, icon: "bug_report" },
    { name: "Networking", category: "backend", version: "TCP/IP", stability: "CONNECTED", load: 85, icon: "router" }
];

// Experience from Resume
const experiences = [
    {
        company: "Preflex Solutions Pvt. Ltd.",
        position: "Software Intern",
        startDate: new Date("2025-11-01"),
        endDate: null, // Present
        description: "Supported application design and development of full-stack features using React.js, Python, MySQL, and PostgreSQL. Developed and maintained technical and functional documentation for APIs and system components. Assisted in code development, unit testing, and validation to ensure reliable system performance. Worked closely with cross-functional teams while following defined operational processes.",
        systemLogs: [
            { achievement: "Developed full-stack features with React.js and Python", outcome: "Success" },
            { achievement: "Created API and system documentation", outcome: "Completed" },
            { achievement: "Implemented unit testing and validation", outcome: "Ongoing" },
            { achievement: "Collaborated with cross-functional teams", outcome: "Success" }
        ]
    },
    {
        company: "Nagarjuna Tech Solutions",
        position: "Backend Developer Intern",
        startDate: new Date("2025-01-01"),
        endDate: new Date("2025-04-30"),
        description: "Supported delivery of backend technology capability by developing 30+ REST APIs using Node.js and MongoDB. Assisted in understanding business and functional requirements and translating them into backend logic. Created and executed test data and API test scripts using Postman, reducing integration defects by 30%. Participated in Agile sprint cycles, adhering to defined development processes and tools.",
        systemLogs: [
            { achievement: "Developed 30+ REST APIs with Node.js and MongoDB", outcome: "Completed" },
            { achievement: "Reduced integration defects by 30% using Postman", outcome: "Success" },
            { achievement: "Participated in Agile sprint cycles", outcome: "Completed" }
        ]
    }
];

// Certificates from Resume
const certificates = [
    {
        title: 'ServiceNow Certified System Administrator (CSA)',
        issuer: 'ServiceNow',
        date: '2025',
        id_code: 'CSA-2025',
        color: 'text-green-400',
        icon: 'verified'
    },
    {
        title: 'ServiceNow Certified Application Developer (CAD)',
        issuer: 'ServiceNow',
        date: '2025',
        id_code: 'CAD-2025',
        color: 'text-blue-400',
        icon: 'code'
    },
    {
        title: 'Data Structures & Algorithms',
        issuer: 'GeeksforGeeks',
        date: '2024',
        id_code: 'GFG-DSA-2024',
        color: 'text-yellow-400',
        icon: 'analytics'
    },
    {
        title: 'Python Programming Certification',
        issuer: 'RedHat',
        date: '2024',
        id_code: 'RH-PY-2024',
        color: 'text-red-400',
        icon: 'terminal'
    },
    {
        title: 'Oracle Certified Foundations Associate',
        issuer: 'Oracle',
        date: '2024',
        id_code: 'OCFA-2024',
        color: 'text-orange-400',
        icon: 'database'
    }
];

// Social Links
const socialLinks = [
    // Social Platforms
    {
        name: "GitHub",
        url: "https://github.com/DARSHAN2224/",
        icon: "code",
        status: "ONLINE",
        color: "text-white",
        platform: "social",
        order: 1
    },
    {
        name: "LinkedIn",
        url: "https://www.linkedin.com/in/pdarshan2224/",
        icon: "work",
        status: "LINKED",
        color: "text-blue-400",
        platform: "social",
        order: 2
    },
    {
        name: "Email",
        url: "mailto:pdarshan2224@gmail.com",
        icon: "email",
        status: "ACTIVE",
        color: "text-red-400",
        platform: "social",
        order: 3
    },

    // Coding Platforms
    {
        name: "LeetCode",
        url: "https://leetcode.com/u/darshan2224/",
        rank: "300+ Problems",
        solved: 300,
        icon: "terminal",
        color: "text-yellow-500",
        platform: "coding",
        order: 1
    },
    {
        name: "GeeksforGeeks",
        url: "https://geeksforgeeks.org/user/darshan2224/",
        rank: "Active",
        solved: 150,
        icon: "code_blocks",
        color: "text-green-500",
        platform: "coding",
        order: 2
    }
];

// Blog Posts
const blogs = [
    {
        title: "Building Real-Time AI Translation Systems",
        slug: "real-time-ai-translation",
        excerpt: "Deep dive into building low-latency voice translation systems using WebSockets, WhisperAI, and adaptive audio processing techniques.",
        readTime: "10 min read",
        content: "# Building Real-Time AI Translation Systems\n\nIn this article, I'll share my experience building a real-time voice translation system that achieves sub-200ms latency...",
        tags: ["AI", "WebSocket", "Python", "Real-Time"]
    },
    {
        title: "Optimizing REST API Performance in Node.js",
        slug: "optimizing-rest-api-nodejs",
        excerpt: "Techniques and best practices for building high-performance REST APIs with Node.js and Express, reducing latency by 30%.",
        readTime: "8 min read",
        content: "# Optimizing REST API Performance\n\nPerformance optimization is crucial for modern web applications...",
        tags: ["Node.js", "Performance", "Backend"]
    },
    {
        title: "AI Chatbots for Mental Health: A Research Perspective",
        slug: "ai-chatbots-mental-health",
        excerpt: "Published research on implementing NLP and Transformer models for emotion detection in mental health applications.",
        readTime: "12 min read",
        content: "# AI Chatbots for Mental Health\n\nThis article is based on our Scopus-indexed research paper presented at ICKECS 2025...",
        tags: ["AI", "NLP", "Healthcare", "Research"]
    }
];

const seedDB = async () => {
    try {
        if (!process.env.MONGO_URI) {
            console.error("❌ MONGO_URI is missing in .env");
            process.exit(1);
        }

        await mongoose.connect(process.env.MONGO_URI);
        console.log("✅ Connected to MongoDB");

        // Clear ALL existing data
        console.log("🗑️  Clearing old data...");
        await Project.deleteMany({});
        await Skill.deleteMany({});
        await BlogPost.deleteMany({});
        await Profile.deleteMany({});
        await Experience.deleteMany({});
        await Certificate.deleteMany({});
        await SocialLink.deleteMany({});
        await SystemConfig.deleteMany({});
        await ChatSession.deleteMany({});
        console.log("✅ Old data cleared");

        // Insert Projects
        await Project.insertMany(projects);
        console.log("✅ Projects seeded (3 projects from resume)");

        // Insert Skills
        await Skill.insertMany(skills);
        console.log("✅ Skills seeded (30+ skills from resume)");

        // Seed Profile
        const userProfile = new Profile({
            name: "Darshan P",
            title: "Software Engineering Undergraduate | Full Stack Developer",
            bio: "Software Engineering undergraduate skilled in building scalable applications using Python, JavaScript, Java, C++, HTML, and CSS. Developed full-stack, AI-powered, and data-driven projects integrating REST APIs, databases, and responsive interfaces. Strong focus on writing clean, maintainable code, optimizing performance, and delivering secure solutions.",
            email: "pdarshan2224@gmail.com",
            phone: "+91-6363757497",
            location: "Bengaluru, India",
            github: "https://github.com/DARSHAN2224/",
            linkedin: "https://www.linkedin.com/in/pdarshan2224/",
            systemDescription: "DARSHAN-OS: A modern, autonomous portfolio system representing a Software Engineer's skills, projects, and achievements. Built with cutting-edge technologies and AI integration.",
            uptime: "99.99%",
            leetcodeStats: {
                solved: 300,
                easy: 120,
                medium: 150,
                hard: 30,
                ranking: "Active Solver"
            },
            hackerrankStats: {
                solved: 0,
                badge: "N/A"
            },
            codeforcesStats: {
                solved: 0,
                rating: "N/A"
            }
        });
        await userProfile.save();
        console.log("✅ Profile seeded (Darshan P)");

        // Insert Experience
        await Experience.insertMany(experiences);
        console.log("✅ Experience seeded (2 internships)");

        // Insert Certificates
        await Certificate.insertMany(certificates);
        console.log("✅ Certificates seeded (5 certifications)");

        // Insert Social Links
        await SocialLink.insertMany(socialLinks);
        console.log("✅ Social Links seeded (GitHub, LinkedIn, LeetCode, Email)");

        // Insert Blog Posts
        await BlogPost.insertMany(blogs);
        console.log("✅ Blogs seeded (3 technical articles)");

        // Seed System Config
        await SystemConfig.create({
            key: 'user_roles',
            value: [
                'Software Engineering Undergraduate',
                'Full Stack Developer',
                'Backend Developer',
                'AI/ML Enthusiast',
                'Problem Solver'
            ],
            description: 'Roles displayed in the typing animation on Desktop'
        });
        console.log("✅ System Config seeded");

        // Seed Dummy Chat Data for Trends
        const dummyChats = [
            { sessionId: 'seed_1', sender: 'user', text: 'Tell me about your projects' },
            { sessionId: 'seed_1', sender: 'bot', text: 'I have built several full-stack and AI projects...' },
            { sessionId: 'seed_2', sender: 'user', text: 'What technologies do you know?' },
            { sessionId: 'seed_3', sender: 'user', text: 'Do you have experience with React and Node.js?' },
            { sessionId: 'seed_4', sender: 'user', text: 'Show me your certifications' },
            { sessionId: 'seed_5', sender: 'user', text: 'What is your LeetCode profile?' },
            { sessionId: 'seed_6', sender: 'user', text: 'Tell me about your internship experience' },
            { sessionId: 'seed_7', sender: 'user', text: 'AI and Machine Learning projects?' }
        ];

        await ChatSession.create({
            sessionId: 'seed_demo_session',
            messages: dummyChats.map(c => ({
                sender: c.sender,
                text: c.text,
                timestamp: new Date()
            }))
        });
        console.log("✅ Chat Trends seeded");

        console.log("\n🌱 ========================================");
        console.log("🎉 Database seeding completed successfully!");
        console.log("========================================");
        console.log("📊 Summary:");
        console.log("   • 3 Projects (Food Ordering, Voice Converter, HealthCare AI)");
        console.log("   • 30+ Skills (JavaScript, Python, React, Node.js, AI/ML, etc.)");
        console.log("   • 2 Work Experiences (Preflex Solutions, Nagarjuna Tech)");
        console.log("   • 5 Certifications (ServiceNow CSA/CAD, Oracle, RedHat, GFG)");
        console.log("   • 5 Social/Coding Links (GitHub, LinkedIn, LeetCode, etc.)");
        console.log("   • 3 Blog Posts");
        console.log("   • 1 Complete Profile (Darshan P)");
        console.log("========================================\n");

        process.exit(0);

    } catch (error) {
        console.error("❌ Seeding failed:", error);
        process.exit(1);
    }
};

seedDB();
