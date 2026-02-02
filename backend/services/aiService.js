const { Groq } = require('groq-sdk');
const { HfInference } = require('@huggingface/inference');
const { GoogleGenerativeAI } = require("@google/generative-ai");
const Project = require("../models/Project");
const Skill = require("../models/Skill");

// --- Configuration ---
// Default to 'ollama' in development, 'groq' in production if not specified
const getDefaultProvider = () => {
    if (process.env.AI_PROVIDER) return process.env.AI_PROVIDER;
    if (process.env.NODE_ENV === 'production') return 'groq';
    return 'ollama';
};

const PROVIDER = getDefaultProvider();

// Initialize SDKs
let groq, hf, gemini;

if (PROVIDER === 'groq' && process.env.GROQ_API_KEY) {
    groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
}
if (PROVIDER === 'hf' && process.env.HF_API_TOKEN) {
    hf = new HfInference(process.env.HF_API_TOKEN);
}
if (PROVIDER === 'gemini' && process.env.GEMINI_API_KEY) {
    gemini = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
}

// --- System Prompt Generator (Common for all) ---
const getSystemPrompt = (projects, skills, experience, profile, blogs, certificates) => {
    const projectList = projects.map(p => `- ${p.title}: ${p.description} (Tech: ${p.tags ? p.tags.join(', ') : ''})`).join('\n');
    const skillList = skills.map(s => `- ${s.name} (${s.category})`).join('\n'); // Raw text list is fine, AI can extract.
    const blogList = blogs.map(b => `- ${b.title}: ${b.excerpt} (Slug: ${b.slug})`).join('\n');
    const certList = certificates.map(c => `- ${c.title} (${c.issuer}, ${c.date})`).join('\n');

    // Format Experience (Resume)
    const expList = experience.map(e => {
        const start = new Date(e.startDate).getFullYear();
        const end = e.endDate ? new Date(e.endDate).getFullYear() : 'Present';
        return `- ${e.position} at ${e.company} (${start}-${end}): ${e.description}`;
    }).join('\n');

    // Format Profile (Bio)
    const codingStatsText = profile ?
        `\nCoding Stats:\n- LeetCode: ${profile.leetcodeStats?.solved || 0} solved (${profile.leetcodeStats?.ranking || 'N/A'})\n- HackerRank: ${profile.hackerrankStats?.solved || 0} solved (${profile.hackerrankStats?.badge || 'N/A'})\n- CodeForces: ${profile.codeforcesStats?.solved || 0} solved (${profile.codeforcesStats?.rating || 'N/A'})`
        : '';
    const bio = profile ? `Bio: ${profile.bio}\nTitle: ${profile.title}\nSystem Status: ${profile.systemStatus}${codingStatsText}` : '';

    // Dynamic Contact Info from Profile
    const contactInfo = profile ? `{ "email": "${profile.email || 'contact@example.com'}", "linkedin": "${profile.linkedin || ''}", "github": "${profile.github || ''}" }` : '{ "email": "contact@example.com" }';

    // Dynamic Examples from actual data
    const exampleProjects = projects.slice(0, 2).map(p => `{ "title": "${p.title}", "description": "${p.description}", "tech": "${p.tags ? p.tags.join(', ') : ''}" }`).join(',\n        ');
    const exampleSkills = skills.slice(0, 6).map(s => `"${s.name}"`).join(', ');

    return `
    You are the "Kernel", the intelligent OS assistant for Darshan Patel's portfolio.
    
    IDENTITY:
    - Name: Kernel / Copilot
    - Personality: Professional, slightly technical/cyberpunk, helpful.
    - Role: Assist visitors in navigating the portfolio and answering questions about Darshan.
    - Style: Concise for simple queries, but DETAILED and COMPREHENSIVE when asked to explain, summarize, or tell a story.

    CONTEXT - DARSHAN'S DATA:

    [PROFILE]
    ${bio}
    
    [EXPERIENCE / RESUME]
    ${expList}
    
    [CERTIFICATES]
    ${certList}
    
    [PROJECTS]
    ${projectList}

    [BLOGS]
    ${blogList}

    [SKILLS]
    ${skillList}

    CAPABILITIES:
    - You can answer questions about Darshan's work history, skills, projects, blog posts, certifications, AND LeetCode stats based on the data provided above.
    - You can "control" the OS by returning specific JSON commands.
    
    COMMAND PROTOCOL:
    1. If the user asks to "go to", "open", "show", or "navigate" to a specific section (Projects, Skills, Contact, About, Blog, Certificates), return action: "NAVIGATE" and payload: "/path".
    2. If the user asks to "list projects", "what have you made", "show work", or specific project details, return action: "RENDER_PROJECTS".
       - In this case, 'payload' MUST be a JSON array of the top 3-4 most relevant projects from the [PROJECTS] context above.
       - Each project object in the payload must have: { "title": "...", "description": "...", "tech": "..." }.
    3. If the user asks about "experience", "work history", "resume", "where did you work", return action: "RENDER_EXPERIENCE".
       - In this case, 'payload' MUST be a JSON array of experience entries from the [EXPERIENCE / RESUME] context above.
       - Each object: { "company": "...", "position": "...", "years": "...", "description": "..." }.
       - Use "Present" for current roles (where endDate is null or not specified).
    4. If the user asks for "contact", "email", "socials", "how to reach", return action: "RENDER_CONTACT".
       - Payload: ${contactInfo}
    5. If the user asks about "skills", "technologies", "stack", "what do you know", return action: "RENDER_SKILLS".
       - Payload: JSON array of top 10-15 skill names from the [SKILLS] context above.
    6. If the user asks for "help", "menu", "tour", "start", "about", or "what can you do", return action: "RENDER_TOUR".
       - Payload: [
            { "label": "Projects", "path": "/projects", "icon": "folder" },
            { "label": "Experience", "path": "/experience", "icon": "history" },
            { "label": "Skills", "path": "/skills", "icon": "bolt" },
            { "label": "Contact", "path": "/contact", "icon": "mail" },
            { "label": "About System", "path": "/about", "icon": "info" },
            { "label": "Certificates", "path": "/certificates", "icon": "verified" }
         ]
    7. If the user asks for "certificates", "credentials", "degrees", "certifications", return action: "RENDER_CERTIFICATES".
       - Payload: JSON array of certificates from the [CERTIFICATES] context above. Each: { "title": "...", "issuer": "...", "date": "..." }
    
    OUTPUT FORMAT:
    Return a JSON object ONLY (no markdown formatting around it, no prelude/postscript):
    {
      "text": "Your conversational response here. (If explaining or summarizing, provide the FULL details here, not just an intro).",
      "action": "NAVIGATE" | "RENDER_PROJECTS" | "RENDER_EXPERIENCE" | "RENDER_CONTACT" | "RENDER_SKILLS" | "RENDER_TOUR" | "RENDER_CERTIFICATES" | null,
      "payload": "/path" | [Array] | {Object} | null
    }

    EXAMPLES:
    User: "Show me the projects"
    AI: { 
      "text": "Here are some of Darshan's featured projects.", 
      "action": "RENDER_PROJECTS", 
      "payload": [ 
        ${exampleProjects}
      ] 
    }

    User: "What are his skills?"
    AI: {
      "text": "Darshan is proficient in these technologies.",
      "action": "RENDER_SKILLS",
      "payload": [${exampleSkills}]
    }

    User: "Who is Darshan?"
    AI: { "text": "Darshan is a Full Stack Engineer specializing in React, Node.js, and ServiceNow...", "action": null, "payload": null }
    `;
};

// --- Provider Implementations ---
// 1. OLLAMA (Local)
const generateOllama = async (messages) => {
    try {
        const response = await fetch(`${process.env.OLLAMA_BASE_URL || 'http://localhost:11434'}/api/chat`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                model: 'llama3', // User stipulated Llama
                messages: messages,
                stream: false,
                format: 'json' // Force JSON if supported, otherwise rely on prompting
            })
        });

        if (!response.ok) throw new Error(`Ollama API Error: ${response.statusText}`);
        const data = await response.json();
        return data.message.content;
    } catch (error) {
        console.error("Ollama Error:", error);
        throw new Error("Failed to connect to Local Neural Node (Ollama). Ensure 'llama3' is running.");
    }
};

// 2. GROQ (Production Fast)
const generateGroq = async (messages) => {
    if (!groq) throw new Error("Groq API Key missing");
    const completion = await groq.chat.completions.create({
        messages: messages,
        model: "llama3-70b-8192",
        response_format: { type: "json_object" }
    });
    return completion.choices[0]?.message?.content || "{}";
};

// 3. HUGGING FACE (Inference)
const generateHF = async (messages) => {
    if (!hf) throw new Error("Hugging Face Token missing");
    // Flatten messages for text-generation extraction if needed, but HF supports chat
    const result = await hf.chatCompletion({
        model: "meta-llama/Meta-Llama-3-8B-Instruct",
        messages: messages,
        max_tokens: 500
    });
    return result.choices[0].message.content;
};

// 4. GEMINI (Google)
const generateGemini = async (systemPrompt, userMessage) => {
    if (!gemini) throw new Error("Gemini API Key missing");
    const model = gemini.getGenerativeModel({ model: "gemini-1.5-flash" });
    const chat = model.startChat({
        history: [
            { role: "user", parts: [{ text: systemPrompt }] },
            { role: "model", parts: [{ text: JSON.stringify({ text: "System Online.", action: null }) }] }
        ]
    });
    const result = await chat.sendMessage(userMessage);
    return result.response.text();
};

// --- Main Handler ---

const generateResponse = async (userMessage) => {
    try {
        // Fetch Context (RAG Lite)
        const projects = await Project.find({ isVisible: true }).limit(10);
        const skills = await Skill.find({ isVisible: true }).limit(20);

        // Fetch Resume Data
        const Experience = require("../models/Experience");
        const Profile = require("../models/Profile");
        const BlogPost = require("../models/BlogPost"); // Import BlogPost
        const Certificate = require("../models/Certificate"); // Import Certificate

        const experience = await Experience.find({ isVisible: true }).sort({ startDate: -1 });
        const profile = await Profile.findOne();
        const blogs = await BlogPost.find({ isPublished: true }).limit(5); // Fetch Blogs
        const certs = await Certificate.find({ isVisible: true }); // Fetch Certs

        const systemPrompt = getSystemPrompt(projects, skills, experience, profile, blogs, certs);

        let rawResponse;

        // Prepare Messages Array (Standard Format)
        const messages = [
            { role: "system", content: systemPrompt },
            { role: "user", content: userMessage }
        ];

        console.log(`[AI] Generating response using provider: ${PROVIDER}`);

        switch (PROVIDER) {
            case 'groq':
                rawResponse = await generateGroq(messages);
                break;
            case 'hf':
                rawResponse = await generateHF(messages);
                break;
            case 'gemini':
                rawResponse = await generateGemini(systemPrompt, userMessage);
                break;
            case 'ollama':
            default:
                // Ollama expects 'role' as 'system', 'user', 'assistant'
                rawResponse = await generateOllama(messages);
                break;
        }

        if (!rawResponse || typeof rawResponse !== 'string') {
            throw new Error("Empty response from Neural Node.");
        }

        // Clean up markdown code blocks if AI adds them
        const cleanJson = rawResponse.replace(/```json/g, '').replace(/```/g, '').trim();

        try {
            return JSON.parse(cleanJson);
        } catch (e) {
            console.warn("JSON Parse Failed, returning raw text:", rawResponse);
            return {
                text: rawResponse,
                action: null,
                payload: null
            };
        }

    } catch (error) {
        console.error("AI Service Global Error:", error);
        return {
            text: `System Alert: Neural Link Offline. (${error.message})`,
            action: null,
            payload: null
        };
    }
};

module.exports = { generateResponse };
