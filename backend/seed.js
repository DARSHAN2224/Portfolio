const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Project = require('./models/Project');
const Skill = require('./models/Skill');
const Profile = require('./models/Profile');
const BlogPost = require('./models/BlogPost');
const SystemConfig = require('./models/SystemConfig');
const ChatSession = require('./models/ChatSession');
const SocialLink = require('./models/SocialLink');

dotenv.config();

const projects = [
    {
        title: "Voice Converter",
        description: "Real-time AI voice conversion tool enabling seamless speech-to-speech transformation with low latency.",
        domain: "AI-ML",
        tags: ["Python", "PyTorch", "Audio Processing"],
        links: { github: "https://github.com/darshan/voice-converter" },
        metrics: { uptime: "99.9%", scale: "Local Inference", latency: "<200ms", availability: "GitHub" }
    },
    {
        title: "Drone Delivery System",
        description: "Autonomous drone fleet management system for last-mile delivery logistics simulation.",
        domain: "Simulation",
        tags: ["ROS", "Gazebo", "Python", "PX4"],
        links: { github: "https://github.com/darshan/drone-delivery" },
        metrics: { uptime: "Simulation", scale: "Multi-Agent", latency: "Real-time", availability: "Research" }
    },
    {
        title: "Mental Health AI",
        description: "AI-powered chatbot assistant for mental health screenings and support resource allocation.",
        domain: "Full-Stack",
        tags: ["React", "Node.js", "NLP"],
        links: { github: "https://github.com/darshan/mental-health-ai" },
        metrics: { uptime: "99.5%", scale: "100+ Users", latency: "<100ms", availability: "Web" }
    }
];

const skills = [
    // Frontend
    { name: "React", category: "frontend", version: "v18.2.0", stability: "STABLE", load: 98, icon: "code_blocks" },
    { name: "Next.js", category: "frontend", version: "v14.1.0", stability: "OPTIMAL", load: 92, icon: "layers" },
    { name: "Tailwind", category: "frontend", version: "v3.4.1", stability: "STABLE", load: 95, icon: "palette" },
    { name: "Three.js", category: "frontend", version: "r160", stability: "EXPERIMENTAL", load: 78, icon: "view_in_ar" },

    // Backend
    { name: "Node.js", category: "backend", version: "v20.10.0", stability: "HIGH_LOAD", load: 88, icon: "dns" },
    { name: "Python", category: "backend", version: "v3.12.1", stability: "STABLE", load: 90, icon: "terminal" },
    { name: "PostgreSQL", category: "backend", version: "v16.1", stability: "SECURE", load: 82, icon: "database" },

    // DevOps
    { name: "Docker", category: "devops", version: "v25.0.1", stability: "CONTAINERIZED", load: 85, icon: "deployed_code" },
    { name: "AWS", category: "devops", version: "Cloud", stability: "ONLINE", load: 75, icon: "cloud" },
    { name: "Git", category: "devops", version: "v2.43.0", stability: "VERSIONED", load: 99, icon: "commit" },

    // ServiceNow
    { name: "ServiceNow", category: "servicenow", version: "Washington", stability: "ENTERPRISE", load: 90, icon: "dns" },
    { name: "ITSM", category: "servicenow", version: "Standard", stability: "STABLE", load: 85, icon: "support_agent" },
    { name: "Flow Designer", category: "servicenow", version: "Latest", stability: "OPTIMAL", load: 80, icon: "schema" }
];

const blogs = [
    {
        title: "Optimizing React Performance for Low-Spec Devices",
        slug: "react-performance",
        excerpt: "Techniques for reducing bundle size and improving TTI on constrained hardware.",
        readTime: "8 min read",
        content: "# Optimizing React\n\nPerformance is key...",
        tags: ["React", "Performance"]
    },
    {
        title: "Building Autonomous Agents with LLMs",
        slug: "llm-agents",
        excerpt: "A deep dive into constructing ReAct loops and tool use in LangChain.",
        readTime: "12 min read",
        content: "# LLM Agents\n\nAgents are the future...",
        tags: ["AI", "LLM"]
    },
    {
        title: "The Future of WebAssembly in Browser OS",
        slug: "wasm-future",
        excerpt: "How WASM is enabling desktop-class applications to run natively in the browser.",
        readTime: "6 min read",
        content: "# WebAssembly\n\nWASM changes everything...",
        tags: ["WebAssembly", "Future"]
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

        // Clear existing data
        await Project.deleteMany({});
        await Skill.deleteMany({});
        await BlogPost.deleteMany({});
        await Profile.deleteMany({}); // Clear existing Profile data

        // Insert new data
        await Project.insertMany(projects);
        console.log("✅ Projects seeded");

        await Skill.insertMany(skills);
        console.log("✅ Skills seeded");

        // Seed Profile
        const userProfile = new Profile({
            name: "Darshan",
            title: "Full Stack Engineer",
            bio: "A passionate Full Stack Engineer with expertise in modern web technologies and AI/ML.",
            systemDescription: "DARSHAN-OS: A living, extensible operating system representing an engineer's skills and experience.",
            uptime: "99.99%",
            leetcodeStats: {
                solved: 485,
                easy: 150,
                medium: 290,
                hard: 45,
                ranking: "Top 3.5%"
            },
            hackerrankStats: {
                solved: 320,
                badge: "Gold Badge"
            },
            codeforcesStats: {
                solved: 150,
                rating: "Specialist"
            }
        });
        await userProfile.save();
        console.log("✅ Profile Seeded");

        await BlogPost.insertMany(blogs);
        console.log("✅ Blogs seeded");

        // Seed System Config
        await SystemConfig.deleteMany({});
        await SystemConfig.create({
            key: 'user_roles',
            value: ['ServiceNow Developer', 'Full Stack Engineer', 'AI Specialist', 'Creative Developer'],
            description: 'Roles displayed in the typing animation on Desktop'
        });
        console.log("✅ System Config seeded");

        // Seed Dummy Chat Data for Trends
        await ChatSession.deleteMany({});
        const dummyChats = [
            { sessionId: 'seed_1', sender: 'user', text: 'Tell me about your ServiceNow projects' },
            { sessionId: 'seed_1', sender: 'bot', text: 'Sure...' },
            { sessionId: 'seed_2', sender: 'user', text: 'Do you know React and Next.js?' },
            { sessionId: 'seed_3', sender: 'user', text: 'What is your experience with AI and Python?' },
            { sessionId: 'seed_4', sender: 'user', text: 'Show me ServiceNow certifications' },
            { sessionId: 'seed_5', sender: 'user', text: 'I need a Full Stack Developer for my startup' },
            { sessionId: 'seed_6', sender: 'user', text: 'How do you handle backend security?' },
            { sessionId: 'seed_7', sender: 'user', text: 'ServiceNow Flow Designer projects?' }
        ];

        // Transform user messages into session format with aggregated messages
        // Check if ChatSession supports simple creation or if we need to structure it
        // The schema expects: sessionId, messages: [{sender, text, timestamp}]

        await ChatSession.create({
            sessionId: 'seed_demo_session',
            messages: dummyChats.map(c => ({
                sender: c.sender,
                text: c.text,
                timestamp: new Date()
            }))
        });
        console.log("✅ Chat Trends seeded");

        // Seed Experience
        const Experience = require('./models/Experience');
        const Certificate = require('./models/Certificate'); // Import Certificate

        await Experience.deleteMany({});
        await Certificate.deleteMany({}); // Clear Certificates

        const experiences = [
            {
                company: "ServiceNow",
                position: "Senior ServiceNow Developer",
                startDate: new Date("2021-01-01"),
                endDate: null, // Present
                description: "Leading development of custom ITSM applications and integrations. Specialized in Flow Designer and UI Builder.",
                systemLogs: [
                    { achievement: "Optimized workflow efficiency by 40%", outcome: "Success" },
                    { achievement: "Mentored junior developers", outcome: "Ongoing" },
                    { achievement: "Deployed 15+ custom apps", outcome: "Completed" }
                ]
            },
            {
                company: "Infosys",
                position: "Full Stack Engineer",
                startDate: new Date("2019-06-01"),
                endDate: new Date("2020-12-31"),
                description: "Maintained legacy codebases and successfully migrated client sites to modern React frameworks. Collaborated with UX teams to implement responsive designs.",
                systemLogs: [{ achievement: "Migrated 50+ legacy sites", outcome: "Completed" }]
            }
        ];

        const certificates = [
            { title: 'AWS Certified Solutions Architect', issuer: 'Amazon Web Services', date: '2023', id_code: 'AWS-882910', color: 'text-yellow-400', icon: 'cloud' },
            { title: 'Meta Front-End Developer', issuer: 'Meta', date: '2023', id_code: 'META-FE-22', color: 'text-blue-400', icon: 'code' },
            { title: 'Google Data Analytics', issuer: 'Google', date: '2022', id_code: 'GDA-11002', color: 'text-green-400', icon: 'analytics' }
        ];
        await Experience.insertMany(experiences);
        await Certificate.insertMany(certificates);
        console.log('✅ Experience and Certificates Seeded!');

        // Seed Social Links
        await SocialLink.deleteMany({});
        const socialLinks = [
            // Social Platforms
            { name: "GitHub", url: "https://github.com/darshan", icon: "code", status: "ONLINE", color: "text-white", platform: "social", order: 1 },
            { name: "LinkedIn", url: "https://linkedin.com/in/darshan", icon: "work", status: "LINKED", color: "text-blue-400", platform: "social", order: 2 },
            { name: "Twitter", url: "https://twitter.com/darshan", icon: "rss_feed", status: "ACTIVE", color: "text-sky-400", platform: "social", order: 3 },
            { name: "Instagram", url: "https://instagram.com", icon: "photo_camera", status: "OFFLINE", color: "text-pink-500", platform: "social", order: 4 },
            // Coding Platforms
            { name: "LeetCode", url: "https://leetcode.com", rank: "Top 5%", solved: 450, icon: "terminal", color: "text-yellow-500", platform: "coding", order: 1 },
            { name: "HackerRank", url: "https://hackerrank.com", rank: "Gold Badge", solved: 320, icon: "code_blocks", color: "text-green-500", platform: "coding", order: 2 },
            { name: "CodeForces", url: "https://codeforces.com", rank: "Specialist", solved: 150, icon: "bar_chart", color: "text-purple-500", platform: "coding", order: 3 }
        ];
        await SocialLink.insertMany(socialLinks);
        console.log('✅ Social Links Seeded!');

        console.log("🌱 Database seeding completed successfully!");
        process.exit(0);

    } catch (error) {
        console.error("❌ Seeding failed:", error);
        process.exit(1);
    }
};

seedDB();
