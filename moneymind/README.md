# MoneyMind Analyzer
### AI-Based Personal Spending Behavior Intelligence System

> Understand Your Spending. Shape Your Future.

---

## Tech Stack

- **Backend**: Node.js + Express
- **Frontend**: React + Vite
- **Database**: Neon PostgreSQL (serverless)
- **PDF**: PDFKit
- **AI**: OpenAI GPT-4o-mini (optional — falls back to smart defaults)
- **Auth**: JWT + bcryptjs
- **Default Currency**: PKR (Pakistani Rupee)

---

## Neon PostgreSQL Setup

1. Go to [neon.tech](https://neon.tech) and create a free account
2. Create a new project — name it `moneymind`
3. From your project dashboard, copy the **Connection String**
   - It looks like: `postgresql://user:password@ep-xxxx.us-east-2.aws.neon.tech/neondb?sslmode=require`
4. Open the **SQL Editor** in the Neon dashboard
5. Paste and run the entire contents of `database/schema.sql`
6. Paste your connection string into `backend/.env` as `DATABASE_URL`

---

## Backend Setup

```bash
cd backend
cp .env.example .env
# Edit .env and fill in your values:
#   DATABASE_URL  — your Neon PostgreSQL connection string
#   JWT_SECRET    — any random 32+ character string
#   OPENAI_API_KEY — optional, for live AI insights
npm install
npm run dev
```

The API will start at `http://localhost:5000`

---

## Frontend Setup

```bash
cd frontend
cp .env.example .env
# Edit .env:
#   VITE_API_URL=http://localhost:5000/api
npm install
npm run dev
```

The app will open at `http://localhost:5173`

---

## Environment Variables

### backend/.env
```
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
DATABASE_URL=postgresql://...@...neon.tech/neondb?sslmode=require
JWT_SECRET=your-secret-min-32-chars
JWT_EXPIRES_IN=7d
OPENAI_API_KEY=sk-...   # Optional
DEFAULT_CURRENCY=PKR
```

### frontend/.env
```
VITE_API_URL=http://localhost:5000/api
```

---

## Supported Currencies

| Code | Name | Symbol |
|------|------|--------|
| **PKR** | Pakistani Rupee | **Rs.** (Default) |
| USD | US Dollar | $ |
| EUR | Euro | € |
| GBP | British Pound | £ |
| AED | UAE Dirham | AED |
| SAR | Saudi Riyal | SAR |
| INR | Indian Rupee | ₹ |

---

## API Endpoints

```
POST   /api/auth/register        Register
POST   /api/auth/login           Login
GET    /api/auth/me              Profile
PATCH  /api/auth/currency        Update currency

POST   /api/expenses             Add transaction
GET    /api/expenses             List transactions
GET    /api/expenses/:id         Get transaction
PUT    /api/expenses/:id         Update transaction
DELETE /api/expenses/:id         Delete transaction
GET    /api/expenses/categories  Get categories

GET    /api/analytics/summary    Monthly summary
GET    /api/analytics/by-category   Category breakdown
GET    /api/analytics/trend      6-month trend
GET    /api/analytics/anomalies  Unusual transactions

GET    /api/behavior/report      Get/generate behavior report
GET    /api/behavior/history     Score history

GET    /api/predictions/eom      End-of-month projection
GET    /api/predictions/categories  Category risk

GET    /api/reports/monthly      Download monthly PDF
GET    /api/reports/statement    Download statement PDF
GET    /api/reports/behavior     Download behavior PDF
GET    /api/reports/export/csv   Export CSV

GET    /api/alerts               Get alerts
PATCH  /api/alerts/:id/read      Mark read
DELETE /api/alerts/:id           Dismiss
```

---

## Project Structure

```
moneymind-analyzer/
├── backend/
│   ├── app.js
│   ├── server.js
│   ├── config/db.js             ← Neon PostgreSQL pool
│   ├── controllers/             ← Route handlers
│   ├── middleware/              ← Auth, rate limit, errors
│   ├── routes/                  ← Express routers
│   └── services/
│       ├── behaviorEngine.js    ← AI behavior scoring
│       ├── predictionService.js ← Forecast engine
│       ├── alertService.js      ← Smart alerts
│       ├── pdfService.js        ← PDF generation (PKR)
│       └── openaiService.js     ← GPT-4o-mini insights
├── frontend/
│   └── src/
│       ├── context/AuthContext.jsx  ← Currency + auth state
│       ├── pages/
│       │   ├── LandingPage.jsx      ← Public landing page
│       │   ├── LoginPage.jsx
│       │   ├── RegisterPage.jsx     ← Currency selector
│       │   ├── Dashboard.jsx
│       │   ├── Transactions.jsx
│       │   ├── Analytics.jsx
│       │   ├── BehaviorAI.jsx
│       │   ├── Predictions.jsx
│       │   ├── Alerts.jsx
│       │   ├── Reports.jsx
│       │   └── Settings.jsx         ← Currency settings
│       └── components/layout/
│           └── DashboardLayout.jsx  ← Sidebar with currency switcher
└── database/
    └── schema.sql               ← Run in Neon SQL Editor
```

---

## Deployment on Render

### Backend
1. Create Web Service → connect GitHub repo
2. Root directory: `backend`
3. Build: `npm install`
4. Start: `node server.js`
5. Add env vars (DATABASE_URL from Neon, JWT_SECRET, FRONTEND_URL)

### Frontend
1. Create Static Site → same repo
2. Root directory: `frontend`
3. Build: `npm install && npm run build`
4. Publish: `dist`
5. Add: `VITE_API_URL=https://your-backend.onrender.com/api`

---

*MoneyMind Analyzer — Built for Pakistan's financial future*
