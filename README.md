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
portfolio/
├── frontend/               # React application
│   ├── src/
│   │   ├── components/    # Reusable components (CopilotWidget, etc.)
│   │   ├── pages/         # Route pages (Desktop, Projects, About, etc.)
│   │   ├── stores/        # Zustand state management
│   │   └── services/      # API integration
│   └── public/            # Static assets
├── backend/               # Node.js server
│   ├── models/           # MongoDB schemas
│   ├── routes/           # API endpoints
│   ├── controllers/      # Business logic
│   ├── services/         # AI and email services
│   └── seed.js           # Database seeding script
└── docs/                 # Documentation
```

## 🛠️ Setup & Installation

### Prerequisites
- Node.js v20+ 
- MongoDB (local or Atlas)
- Gmail account (for contact form)
- Google Gemini API key (for AI features)

### Installation Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/DARSHAN2224/Portfolio.git
   cd Portfolio
   ```

2. **Install dependencies**
   ```bash
   # Install root dependencies
   npm install

   # Install frontend dependencies
   cd frontend
   npm install

   # Install backend dependencies
   cd ../backend
   npm install
   ```

3. **Configure environment variables**
   
   Create `.env` file in `backend/` directory:
   ```env
   # MongoDB
   MONGO_URI=your_mongodb_connection_string

   # Email (Gmail SMTP)
   EMAIL_USER=your_gmail@gmail.com
   EMAIL_PASS=your_app_specific_password

   # Google Gemini AI
   GEMINI_API_KEY=your_gemini_api_key

   # Server
   PORT=5000
   NODE_ENV=development

   # Admin (for first-time setup)
   ADMIN_EMAIL=admin@example.com
   ADMIN_PASSWORD=secure_password
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
