# Invicta — Demo

Clickable demo for the client. Front end only. No backend, login, or storage. All data is invented and lives in `lib/mock.ts`. Added visits stay in browser memory and vanish on refresh.

```bash
npm install
npm run dev   # http://localhost:3000
```

| Route | Content | Scope |
|-------|---------|-------|
| `/` | Patient list with search | M1 |
| `/patients/[id]` | Trend charts, photo strip, visits, consent | M1 |
| `/patients/[id]/visit/new` | Visit form with range checks | M1 |
| `/remedies` | Remedy search and browse | M2 preview |
| `/endoscopy` | Report reader with confirm step | M3 preview |
| `/match` | Ranked remedies with score breakdown | M4 preview |
| `/analytics` | Prescription and outcome charts | M5 preview |
| `/export` | De-identified CSV download | M6 preview |

The screens use Next.js, Tailwind, and Recharts, as planned in `docs/03-technical-decisions.md`. Base-module screens can carry over to the real app.
