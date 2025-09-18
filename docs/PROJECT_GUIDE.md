# 📘 Project Guide: C of Q Exam Study App

## 1. Project Overview
We’re building a **web-based study platform** for the Certificate of Qualification (C of Q) electrical exam.

- **Frontend:** Next.js 14 (TypeScript + React, App Router, Tailwind, shadcn/ui)  
- **Backend:** FastAPI (Python, async), modular with Clean Architecture  
- **Database:** SQLite (dev) → Postgres + pgvector (production)  
- **Hosting:** Local first → deploy to Render/Heroku/Fly.io/Netlify/Vercel later  
- **IDE:** Visual Studio Code  

---

## 2. Architecture

### High-level flow
1. User enters a prompt (practice, explain, or flashcard).  
2. Frontend sends request → Backend `/api/...`.  
3. Backend routes → Service → (Repo + LLM provider).  
4. Response returned with **answer + optional citations/explanations**.  
5. History persisted in DB for progress tracking.

---

## 3. Project Folder Structure

### Frontend (`cqo-web`)
```
/cqo-web
  /app
    practice/
      page.tsx           # Server Component
      PracticeClient.tsx # Client Component
      usePractice.ts     # View-model hook
      service.ts         # API client
    explain/
    flashcards/
  /components            # Reusable UI components
  /lib                   # Utils, zod schemas
  package.json
  .env.local
```

### Backend (`cqo-api`)
```
/cqo-api
  app/
    main.py
    core/
      config.py
      di.py
      errors.py
    domains/
      study/
        routers.py
        schemas.py
        service.py
        repo.py
        rag.py
        models.py
    infra/
      db.py
      vector/pgvector.py
      llm/openai.py
  alembic/               # DB migrations
  pyproject.toml
  .env
```

---

## 4. Design Pattern Choices

### Frontend
- **Feature-first structure**
- **MVVM-like layering**:
  - UI Components (view)  
  - Hooks (view-model/state)  
  - Service/API client (model/data)  

### Backend
- **Clean Architecture (Ports & Adapters)**:
  - **Routers** → FastAPI routes  
  - **Services** → domain logic  
  - **Repositories** → DB persistence  
  - **Providers/Adapters** → external APIs (LLM, embeddings)

---

## 5. Tools & Extensions

### VS Code extensions
- **Frontend:** ESLint, Prettier, Tailwind CSS IntelliSense  
- **Backend:** Python, Pylance, REST Client  
- **Extras:** GitLens, Docker (optional)

### Python (backend)
```bash
pip install fastapi uvicorn[standard] pydantic[dotenv] sqlalchemy alembic psycopg2-binary httpx
```

### Node.js (frontend)
```bash
npx create-next-app@latest cqo-web --typescript --tailwind --eslint
npm install zod @tanstack/react-query react-hook-form @hookform/resolvers
npm install shadcn-ui --save-dev
```

---

## 6. Workflow

### Local development
1. Start backend:
   ```bash
   uvicorn app.main:app --reload
   ```
   Runs at `http://127.0.0.1:8000`

2. Start frontend:
   ```bash
   npm run dev
   ```
   Runs at `http://localhost:3000`

3. Both terminals can be run in VS Code split view.

---

## 7. Example Code Skeletons

### Backend — FastAPI router
```py
# app/domains/study/routers.py
from fastapi import APIRouter, Depends
from .schemas import PracticeRequest, PracticeAnswer
from .service import StudyService

router = APIRouter(prefix="/practice")

@router.post("/", response_model=PracticeAnswer)
async def practice(req: PracticeRequest, svc: StudyService = Depends()):
    return await svc.practice(req)
```

### Backend — Service
```py
# app/domains/study/service.py
from .repo import StudyRepo
from .rag import StudyAI
from .schemas import PracticeRequest, PracticeAnswer

class StudyService:
    def __init__(self, repo: StudyRepo, ai: StudyAI):
        self.repo = repo
        self.ai = ai

    async def practice(self, req: PracticeRequest) -> PracticeAnswer:
        ctx = await self.repo.retrieve_context(req.topic, k=4)
        ai_out = await self.ai.answer(req.prompt, context=ctx)
        await self.repo.save_attempt(req.user_id, req.prompt, ai_out.answer)
        return PracticeAnswer(answer=ai_out.answer)
```

### Frontend — Client component
```tsx
"use client";
import { useState } from "react";
import { submitPractice } from "./service";

export default function PracticeClient() {
  const [q, setQ] = useState("");
  const [a, setA] = useState<string | null>(null);

  const handleSubmit = async () => {
    const res = await submitPractice(q);
    setA(res.answer);
  };

  return (
    <div className="p-6 space-y-4">
      <textarea
        value={q}
        onChange={e => setQ(e.target.value)}
        placeholder="Enter a practice question..."
        className="w-full border rounded p-3"
      />
      <button onClick={handleSubmit} className="px-4 py-2 bg-blue-500 text-white rounded">
        Submit
      </button>
      {a && <pre className="bg-gray-100 p-3 rounded">{a}</pre>}
    </div>
  );
}
```

---

## 8. Testing

- **Backend:** `pytest` for service + repo tests  
- **Frontend:** Vitest for hooks/services; Playwright for end-to-end flows  
- **Mock LLM provider:** Replace real API with a stub during tests  

---

## 9. Roadmap (Phase 1 MVP → Phase 2 Enhancements)

### Phase 1 — MVP (2–3 weeks)
- [ ] Scaffold FastAPI + Next.js projects  
- [ ] Add `/practice` endpoint with stubbed response  
- [ ] Build practice page UI → hook to backend  
- [ ] Store question/answer history in SQLite  
- [ ] Deploy MVP (Vercel for frontend, Render/Fly.io for backend)

### Phase 2 — Enhancements
- [ ] Add flashcards + spaced repetition  
- [ ] Add retrieval (pgvector) with C of Q study material  
- [ ] Add user auth (NextAuth/Auth0)  
- [ ] Add analytics (progress dashboard, streaks)  
- [ ] Add iOS SwiftUI client (optional, internship prep)

---

## 10. Best Practices
- Use **.env files** for API keys and DB URLs (never commit secrets).  
- Keep routers thin, services fat.  
- Validate everything with **zod (frontend)** and **Pydantic (backend)**.  
- Always write migrations (Alembic) even for SQLite.  
- Commit early and often; push to GitHub for collaboration.  

---
