# 🚀 MindPause — Deployment Guide
## Go from zero to live in 30 minutes. Free.

---

## WHAT YOU NEED
- A laptop (Windows/Mac/Linux)
- A phone number for accounts
- ~30 minutes

---

## STEP 1 — Install Node.js (5 min)

1. Go to **https://nodejs.org**
2. Download the **LTS version** (green button)
3. Install it (just click Next → Next → Install)
4. Open Terminal (Mac) or Command Prompt (Windows)
5. Type: `node --version` → should show v18 or higher ✅

---

## STEP 2 — Get Your Anthropic API Key (5 min)

This powers the AI chat feature.

1. Go to **https://console.anthropic.com**
2. Sign up with your email
3. Click **"API Keys"** in the left menu
4. Click **"Create Key"** → copy the key (starts with `sk-ant-...`)
5. Save it somewhere safe — you'll need it in Step 4

> 💡 Anthropic gives $5 free credits to start. This is a free trial credit, not a permanent free API key. Enough for ~5,000 chat messages.

---

## STEP 3 — Set Up the Project (5 min)

Open Terminal / Command Prompt and run these commands one by one:

```bash
# 1. Go to your Desktop (or wherever you want the project)
cd Desktop

# 2. Create the project folder and enter it
mkdir mindpause && cd mindpause

# 3. Copy all the project files into this folder
# (The files you received: pages/, styles/, package.json, etc.)

# 4. Install dependencies
npm install
```

Wait ~2 minutes for packages to install.

---

## STEP 4 — Add Your API Key (2 min)

1. In the project folder, find the file called `.env.example`
2. Rename it to `.env.local`
3. Open `.env.local` with Notepad / TextEdit
4. Replace `your_api_key_here` with your actual key:

```
ANTHROPIC_API_KEY=sk-ant-xxxxxxxxxxxxxxxx
```

You can also use the alias:

```
FREE_API_KEY=sk-ant-xxxxxxxxxxxxxxxx
```

5. Save the file.

---

## STEP 5 — Test Locally (2 min)

```bash
npm run dev
```

Open your browser and go to: **http://localhost:3000**

You should see MindPause running! Test the mood check-in and chat. ✅

---

## STEP 6 — Deploy to Vercel (Live on Internet) (10 min)

### 6a. Create GitHub Account
1. Go to **https://github.com** → Sign up (free)
2. Click **"New Repository"**
3. Name it: `mindpause`
4. Click **"Create Repository"**

### 6b. Push Your Code to GitHub

In your Terminal (inside the mindpause folder):

```bash
git init
git add .
git commit -m "first commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/mindpause.git
git push -u origin main
```

Replace `YOUR_USERNAME` with your GitHub username.

### 6c. Deploy on Vercel
1. Go to **https://vercel.com** → Sign up with GitHub
2. Click **"Add New Project"**
3. Find your `mindpause` repo → Click **"Import"**
4. Before clicking Deploy → click **"Environment Variables"**
5. Add:
   - **Name:** `ANTHROPIC_API_KEY`
   - **Value:** your key (sk-ant-...)
6. Click **"Deploy"** 🚀

Wait ~2 minutes. Vercel gives you a free URL like:
**`mindpause.vercel.app`**

---

## STEP 7 — Get a Custom Domain (Optional, ₹500–₹1000/year)

1. Buy a domain from **GoDaddy India** or **Hostinger India**
   - Suggested: `mindpause.in` or `mindpause.app`
2. In Vercel → Project Settings → Domains
3. Add your domain and follow DNS instructions

---

## YOUR APP IS LIVE! 🎉

Share this link with people:
- WhatsApp groups
- LinkedIn post
- Reddit communities

---

## WHAT'S INSIDE THE APP

| Feature | Status |
|---|---|
| Mood check-in (5 levels) | ✅ Live |
| Box Breathing exercise | ✅ Live |
| 5-4-3-2-1 Grounding | ✅ Live |
| Brain Dump journal | ✅ Live |
| AI Chat (Claude-powered) | ✅ Live |
| Crisis helpline numbers | ✅ Live |
| Doctor booking | 🔜 Coming soon |
| User accounts / login | 🔜 Phase 2 |
| Premium paywall | 🔜 Phase 2 |

---

## NEXT STEPS AFTER GOING LIVE

### Week 1: Get first 50 users
- Post in these WhatsApp groups: IT professional groups, MBA alumni, startup communities
- Post on LinkedIn: "I built a free mental wellness app for burnt-out Indian professionals. Try it: [link]"
- Post in r/india and r/bangalore on Reddit

### Week 2: Get feedback
- Send a Google Form to users asking: What's missing? What's confusing? What do you love?
- Do 5 voice calls with real users

### Week 3: Approach hospitals & doctors
Prepare a short pitch:
> "We have [X] users seeking mental wellness support. We want to add a verified doctor/therapist directory. Would you like to be listed? It's free to start — you only pay 15% commission per session booked."

Target:
- Nimhans Bangalore
- Local psychiatrists on Practo
- Therapists on Instagram who already post mental health content

---

## COST BREAKDOWN (Monthly)

| Service | Cost |
|---|---|
| Vercel hosting | FREE |
| Anthropic API | ~₹200–500 (for 1000 users) |
| Domain | ₹80/month (if annual) |
| **Total** | **< ₹600/month** |

---

## PROBLEMS? CONTACT

If you get stuck at any step:
- Google the exact error message
- Ask on Stack Overflow
- Or paste the error into Claude and ask for help!

---

Built with ❤️ using Next.js + Claude AI
