# 🧾 Problem Definition Document – Basic Fitness App

## A. Target User
Adults aged 25–45 who want to improve their physical health but struggle to stick with fitness goals due to lack of structure, feedback, and motivation.

## B. Core Problem
Users fail to achieve fitness goals because:
- They don’t define goals clearly.
- They don’t track progress consistently.
- They don’t get timely, actionable feedback.

## C. Evidence
- **15 user interviews**: 80% say they “start strong but lose motivation.”
- **Survey of 120**: 65% cite “no clear progress tracking” as a major reason for quitting.
- **App store reviews** of competitors highlight similar complaints.

## D. Current Alternatives
- Paper journals  
- Spreadsheets  
- Generic fitness apps (e.g., MyFitnessPal, Fitbit) that are overwhelming or misaligned with goal-based tracking.

## E. Opportunity
A minimalist app that helps users:
- Define clear fitness goals (SMART format)  
- Track progress easily (daily/weekly check-ins)  
- See visual feedback on progress trends  

---

# ✅ Happy Path – v1 Fitness App

---

## 1. User lands on the site

- Mobile-friendly homepage loads fast.  
- CTA: **“Start Your Fitness Goal”**  
  - No login required OR optional account creation.

---

## 2. User defines a fitness goal

- Simple form using SMART goal structure:
  - **Goal Type**: (Strength / Cardio / Body / Habit)  
  - **Specific Goal**: e.g., “Bench press 100kg for 5 reps”  
  - **Target Date**  
  - **Frequency**: e.g., 3x/week  
- Submits goal → saved to DB (e.g., Supabase/Postgres)

---

## 3. User starts tracking

- Simple daily/weekly check-in UI:
  - Input progress (e.g., weight lifted, distance run)  
  - Add a quick note (optional)  
- Data is auto-saved, timestamped, and stored.

---

## 4. User views progress

- Dashboard shows:
  - Active goals  
  - Completion streak (habit-style)  
  - Simple chart (e.g., Recharts) showing progress over time  

---

## 5. User exports or reviews data

- Optional **CSV export** button (downloads user’s data)  
- Optional: Simple reminder nudge (e.g., “Haven’t updated in 3 days?”)

---

## 6. User completes or updates goal

- On completion date or user decision:
  - Mark goal as complete  
  - Prompt to set a new one  
  - Option to view full goal history  

---


## V1 Constraints: Full Stack, Simple, Vercel-Deployable

### ✅ Deployment
- Deployable via [Vercel](https://vercel.com)  
- Use frameworks that support serverless deployment (e.g., **Next.js**)

### ✅ Architecture
- **Frontend**: React-based UI (via Next.js)  
- **Backend**: Lightweight API routes (no complex microservices)  
- **Database**: Use a managed, easy-to-integrate service

### ✅ User Auth
- Optional in v1  
- If needed: Simple email/password 
- No OAuth, social login, or enterprise SSO  

### ✅ Platform Scope
- No mobile app (yet)  
- Mobile-responsive web app only  
- PWA optional, not required in v1  

### ✅ 3rd Party Dependencies
- Prioritize speed and maintainability  
- Limit to:
  - UI library (e.g., Tailwind)
  - Charting lib (e.g., Chart.js or Recharts)
  - DB/API SDKs  

### ✅ Development Philosophy
- Fast iteration over robustness  
- Continual testing: Browser based Automated user testing with frequent human testing before moving on.
- Prioritize shipping something usable and stable over perfect engineering  