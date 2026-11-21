# DARSHAN-OS Portfolio

> A modern, autonomous portfolio website with an OS-metaphor interface showcasing Software Engineering projects and skills.

[![Live Demo](https://img.shields.io/badge/demo-live-brightgreen)](https://darshan-os.me)
[![GitHub](https://img.shields.io/badge/github-DARSHAN2224-blue)](https://github.com/DARSHAN2224)
[![LinkedIn](https://img.shields.io/badge/linkedin-pdarshan2224-blue)](https://www.linkedin.com/in/pdarshan2224/)

## 👨‍💻 About

**Darshan P** - Software Engineering Undergraduate  
📍 Bengaluru, India  
📧 pdarshan2224@gmail.com  
🔗 [GitHub](https://github.com/DARSHAN2224/) | [LinkedIn](https://www.linkedin.com/in/pdarshan2224/) | [LeetCode](https://leetcode.com/u/darshan2224/)

## 🚀 Tech Stack

### Frontend
- **React.js** - Component-based UI
- **Tailwind CSS v4** - Modern styling with glassmorphism
- **Framer Motion** - Smooth animations
- **Inter Typography** - Clean, professional fonts

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Nodemailer** - Email integration (Gmail SMTP)

### AI Integration
- **Google Gemini AI** - Intelligent chatbot assistant
- **Natural Language Processing** - Context-aware responses

## ✨ Features

### 🖥️ OS-Themed Interface
- **Boot Screen** - Authentic OS startup experience
- **Desktop Environment** - Familiar desktop metaphor with icons and windows
- **Terminal-Style AI Copilot** - Command-line inspired chat interface

### 🎯 Core Sections
- **Projects Showcase** - 3 major full-stack and AI projects
- **Skills Dashboard** - 30+ technical skills with live metrics
- **Experience Timeline** - Professional internship history
- **Certifications** - 5 industry certifications (ServiceNow, Oracle, RedHat, GFG)
- **Contact Form** - Real email integration
- **Admin Panel** - Full CRUD operations for content management

### 🤖 AI Features
- **Voice Control** - Speech recognition for hands-free navigation
- **Intelligent Responses** - Context-aware AI assistant
- **Project Recommendations** - Smart content suggestions
- **Analytics Dashboard** - Chat trends and visitor insights

### 🎨 Design Highlights
- **Glassmorphism Effects** - Modern, translucent UI elements
- **Dark Mode** - Eye-friendly interface
- **Responsive Design** - Works on all devices
- **Smooth Animations** - Framer Motion powered transitions
- **Custom Scrollbars** - Themed scroll experience

## 📂 Project Structure

```
Portfolio/
├── nextapp/                    # Unified Next.js 14 App Router Application
│   ├── app/
│   │   ├── page.jsx            # Desktop OS interface (Darshan-OS 4.0)
│   │   ├── layout.jsx          # Root Layout & metadata
│   │   ├── admin/              # Admin login & passkey verification
│   │   │   └── dashboard/      # Admin content management dashboard
│   │   └── api/                # Production Next.js API Routes
│   │       ├── chat/ask/       # Groq LLM context-aware Copilot endpoint
│   │       ├── contact/        # Email contact handler (Nodemailer)
│   │       ├── projects/       # Projects data endpoint
│   │       ├── skills/         # Skills data endpoint
│   │       ├── experience/     # Experience data endpoint
│   │       ├── profile/        # Profile data endpoint
│   │       └── health/         # System uptime & healthcheck
│   ├── lib/
│   │   ├── db.js               # MongoDB connection manager
│   │   └── models/             # Mongoose schemas (Profile, Project, Skill, Experience, Message)
│   └── public/                 # Static assets, styles.css, script.js
├── render.yaml                 # Render Blueprint deployment configuration
├── vercel.json                 # Vercel deployment configuration
├── .env.example                # Sample environment variables
└── package.json                # Root proxy scripts (npm run dev / build / start)
```

## 🛠️ Setup & Installation

### Prerequisites
- Node.js v18.17+ or v20+
- MongoDB (local or MongoDB Atlas)
- Groq API Key (for context-aware AI Copilot)

### Installation Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/DARSHAN2224/Portfolio.git
   cd Portfolio
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   
   Copy `.env.example` to `.env` (and `nextapp/.env`):
   ```bash
   cp .env.example .env
   ```
   Add your `GROQ_API_KEY`, `MONGODB_URI`, and email credentials.

4. **Run Development Server**
   ```bash
   npm run dev
   ```
   Visit `http://localhost:3000`.

5. **Build & Run Production Server**
   ```bash
   npm run build
   npm start
   ```

4. **Seed the database**
   ```bash
   cd backend
   node seed.js
   ```

5. **Run the application**
   
   **Development Mode:**
   ```bash
   # Terminal 1 - Backend
   cd backend
   node server.js

   # Terminal 2 - Frontend
   cd frontend
   npm run dev
   ```

   **Production Mode:**
   ```bash
   # Build frontend
   cd frontend
   npm run build

   # Serve with backend
   cd ../backend
   NODE_ENV=production node server.js
   ```

6. **Access the application**
   - Frontend: `http://localhost:5173` (dev) or `http://localhost:5000` (prod)
   - Backend API: `http://localhost:5000/api`

## 🔑 Admin Panel

Access the admin panel at `/admin` to manage:
- Profile information
- Projects
- Skills
- Experience
- Certifications
- Blog posts
- Social links
- System configuration

**First-time setup:** Navigate to `/admin` and create your admin account.

## 📊 Featured Projects

1. **Multi-Role Food Ordering System** - Node.js, Express, MongoDB, React.js
2. **Voice Converter** - Real-time AI translation with WebSockets, WhisperAI
3. **HealthCare AI** - Mental health platform with NLP and emotion detection

## 🏆 Achievements

- 🥇 Best Major Project Award - "Aerlogisim" (1st Prize)
- 📝 Published Scopus-indexed research paper (ICKECS 2025)
- 💻 300+ DSA problems solved (LeetCode, GeeksforGeeks)
- 🎓 5 Industry Certifications (ServiceNow CSA/CAD, Oracle, RedHat, GFG)
- 🔴 RedHat Ambassador - NCET

## 📜 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Connect

- **Email:** pdarshan2224@gmail.com
- **GitHub:** [@DARSHAN2224](https://github.com/DARSHAN2224)
- **LinkedIn:** [pdarshan2224](https://www.linkedin.com/in/pdarshan2224/)
- **LeetCode:** [darshan2224](https://leetcode.com/u/darshan2224/)

---

<p align="center">
  <b>Built with ❤️ by Darshan P</b><br>
  <sub>© 2026 DARSHAN-OS. All Rights Reserved.</sub>
</p>
