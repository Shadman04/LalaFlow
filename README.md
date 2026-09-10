# ⚡ LalaFlow — Multilingual AI Operations Co-Pilot

> **Turn Chaos Into Clear Action.**

LalaFlow is an AI-assisted operations workspace for growing businesses that manage work across disconnected tools (WhatsApp, Email, Spreadsheets, verbal requests). Unlike generic task managers that merely show what tasks exist, **LalaFlow helps users understand what they should do next, why it matters, and what is at risk.**

---

## 🚀 Key Features

- **⚡ Command Center**: Real-time statistics, dynamic WORKFLOW HEALTH calculation %, NEEDS ATTENTION alerts, recent activity log, and LALA NEXT BEST ACTION card.
- **📥 Chaos Inbox**: Rule-based NLP parser that parses raw text from WhatsApp/Emails into structured action cards and converts them directly to your team's Flow Board.
- **🔄 Flow Board**: Full Kanban board with status columns (`Captured`, `In Progress`, `Review`, `Completed`), real-time search, multi-attribute filter toolbar, and task CRUD modal.
- **🎯 My Focus ("What Should I Do Now?")**: Intelligent task prioritization engine with rationale explanations ("WHY THIS TASK?"), Snooze capability, Focus Queue, and Silent Risk Detector.
- **👥 Team Workload Balancer**: Manager & Admin view tracking employee capacity, active task progress, and AI re-assignment recommendations.
- **🤖 LALA AI Assistant**: Global floating co-pilot with Web Speech API voice input/output, daily briefing modal, conversational task creation state machine, and multilingual locale support (English `en-IN`, Hindi/Hinglish `hi-IN`, Bengali `bn-IN`).

---

## 🛠️ Tech Stack & Architecture

- **Frontend**: React 18 + Vite + Tailwind CSS + Lucide React
- **Backend API**: Vercel Serverless Functions (`/api/tasks`, `/api/chaos`, `/api/assistant`, `/api/team`, `/api/activity`)
- **Database & Auth**: Supabase PostgreSQL (`supabase/schema.sql`) with dual-mode (Live Supabase or out-of-the-box local demo state preseeded with demo accounts)
- **Deployment**: Vercel ready (`vercel.json` SPA rewrites configured)

---

## 📦 Installation & Local Development

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Run local development server**:
   ```bash
   npm run dev
   ```

3. **Build for production**:
   ```bash
   npm run build
   ```

---

## 🔐 Environment Variables Configuration

Copy `.env.example` to `.env`:

```env
# Frontend Client Access
VITE_SUPABASE_URL=https://your-supabase-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here

# Serverless Functions Access Only (Never expose to client)
SUPABASE_URL=https://your-supabase-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

*Note: If environment variables are omitted, LalaFlow automatically runs with its pre-loaded local persistent demo database (featuring Rahim, Sarah, and Shadman).*

---

## 🗄️ Supabase Database Setup

1. Create a new project at [Supabase](https://supabase.com).
2. Navigate to the SQL Editor and execute the script inside `supabase/schema.sql`.
3. Copy your project URL and ANON key into `.env`.

---

## ☁️ Vercel Deployment

1. Push your repository to GitHub.
2. Import the project in [Vercel](https://vercel.com).
3. Configure environment variables (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`).
4. Click **Deploy**. Vercel will automatically host the Vite SPA and deploy `/api` serverless endpoints.
