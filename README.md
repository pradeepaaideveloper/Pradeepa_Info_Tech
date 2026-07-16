# Pradeepa Info Tech - Integrated Academy, E-Store & POS System

This is the repository for **Pradeepa Info Tech**, an integrated MSME and GST-registered Computer Training Institute and E-Commerce storefront for stationery, computer accessories, and electronics. 

The system features:
- **Educational Suite**: Student profiles, attendance tracker, fee receipts, digital ID cards, and QR-verified certificates.
- **Retail Suite**: E-store checkout, online payment integration (Razorpay/UPI), cashier Point of Sale (POS) system with barcode scanner capture, and inventory margins tracking.
- **AI recommendation Engine**: Smart course and product recommendations driven by the Gemini SDK.

---

## 🛠️ Project Architecture & Structure

The repository is organized as a decoupled monorepo:

```
/
├── .github/workflows/          # CI/CD Pipeline
│   └── ci-cd.yml               # GitHub Actions quality gating checks
├── backend/                    # Python FastAPI Backend
│   ├── app/                    # Application source code
│   │   ├── models/             # SQLAlchemy ORM Database structures
│   │   ├── schemas/            # Pydantic input/output schemas
│   │   ├── routers/            # Endpoint mappings
│   │   ├── services/           # PDF Generation, Auth, AI Chatbot logic
│   │   ├── config.py           # Configuration manager using pydantic-settings
│   │   ├── database.py         # SQLAlchemy engine and session factories
│   │   └── main.py             # FastAPI entrypoint, middleware configs
│   ├── requirements.txt        # Backend dependencies
│   └── Dockerfile              # Production multi-stage Docker builder
├── frontend/                   # React TypeScript Frontend
│   ├── public/                 # Static public files (PWA icons, translations)
│   │   ├── locales/            # i18n English (en) and Tamil (ta) JSON keys
│   │   ├── manifest.json       # PWA Application specification
│   │   └── sw.js               # Service Worker offline asset cacher
│   ├── src/                    # React source files
│   │   ├── assets/             # Global image assets
│   │   ├── components/         # Reusable modular UI components
│   │   ├── context/            # Auth, Language, and Cart State managers
│   │   ├── services/           # Axios API configuration & endpoints map
│   │   ├── App.tsx             # Main routing and navigation layout
│   │   ├── i18n.ts             # Localization compiler mapping
│   │   ├── index.css           # Tailwind v4 import and custom styles
│   │   └── main.tsx            # App mounter and Service Worker registrar
│   ├── package.json            # Frontend script actions & dependencies
│   ├── tsconfig.json           # TS compiling configurations
│   └── vite.config.ts          # Vite bundler options
├── docker-compose.yml          # Container orchestrator (FastAPI + MySQL)
└── README.md                   # Developer documentation (this file)
```

---

## 🚀 Getting Started

### 🐳 Quick Start with Docker (Recommended)

1. Make sure you have **Docker** and **Docker Compose** installed on your system.
2. Clone the repository and run:
   ```bash
   docker-compose up --build
   ```
3. The backend will be available at [http://localhost:8000](http://localhost:8000). The MySQL database port `3306` will be exposed.

---

### 💻 Local Development Setup

#### 1. Backend Setup (FastAPI)

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Create and activate a Python virtual environment:
   ```bash
   python -m venv venv
   # On Windows:
   venv\Scripts\activate
   # On macOS/Linux:
   source venv/bin/activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Configure variables by copying `.env.example` to `.env` and modifying settings:
   ```bash
   cp .env.example .env
   ```
5. Run the FastAPI development server:
   ```bash
   uvicorn app.main:app --reload
   ```
   *API Swagger Docs will be available at [http://localhost:8000/docs](http://localhost:8000/docs).*

#### 2. Frontend Setup (React + Vite)

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install npm packages:
   ```bash
   npm install
   ```
3. Start the Vite hot-reloading development server:
   ```bash
   npm run dev
   ```
   *Web app will be running at [http://localhost:5173](http://localhost:5173).*

---

## 🔒 Security Audit & Testing

- Every administrative modification (price change, certificate generation, attendance marking) is stored in the `audit_logs` database table.
- All JSON payloads are parsed and verified using strict Pydantic configurations to prevent injection anomalies.
- Passwords are encrypted using high-entropy standard bcrypt hashing.
