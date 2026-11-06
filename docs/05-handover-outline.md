# Handover Guide: Accounts and Code Transfer

For: Dr. Shruti Shah and Dhaval
From: Shailesh Shah
Date: 2026-11-06

## 1. What this guide does

It moves the app (Invicta) from Shailesh's accounts to yours. At the end:

- The code is in a **private** GitHub repository that your company owns.
- The app runs on your laptops with mock data.
- The app is live on your own Vercel account, hosted in India.
- Both of you can change the app with Claude Code.

The backend (database, login, photos) is not part of this guide.

**Today:** the code is in a public repository (`github.com/shaileshs/sushruti`) and is live at `invicta-omega.vercel.app`. Both belong to Shailesh.

## 2. Decisions already made

| Topic | Decision | Reason |
|-------|----------|--------|
| Code owner | A new GitHub **organization**. Dhaval and Dr. Shah are both owners. | The company owns the code. Access never depends on one person. |
| Repository | **Private.** A new repository with a clean start (no old history). | The code is your IP. There is little history to keep. |
| Hosting | **Vercel Pro** team, connected to the organization. | See "Why Vercel Pro" below. |
| Hosting region | Mumbai (`bom1`) | Users and developers are in India. |
| Team | Dr. Shah (product manager, builds with Claude Code) and Dhaval (infra engineer). Two Vercel seats. | |
| Domain name | None for now. Use the free `*.vercel.app` name. | Not needed for testing. |
| Costs | Paid by Dr. Shah's business. | |
| Node.js | Current LTS version, written into the repository. | One version for both laptops and Vercel. |

**Why Vercel Pro.** Vercel's free plan (Hobby) does not deploy private repositories that belong to a GitHub organization. It also does not support collaboration on private repositories. A private repository with two people needs a Pro team. Vercel has changed these rules before, so confirm on the plans page when you sign up.

**Why Vercel for now.** Vercel has a Mumbai compute region. The app is a standard Next.js front end, so moving to another host later is cheap. New Vercel projects run in Washington, D.C. by default, so the region must be set on purpose (section 7).

## 3. Accounts to create

Nobody shares a password. Each person turns on two-factor login everywhere.

| # | Account | Who creates it |
|---|---------|----------------|
| 1 | GitHub personal account | Dr. Shah and Dhaval, each |
| 2 | GitHub organization (add the other person as a second owner) | Dhaval |
| 3 | Vercel account, signed in with GitHub | Dr. Shah and Dhaval, each |
| 4 | Vercel Pro team, connected to the GitHub organization | Dhaval (add Dr. Shah) |
| 5 | Anthropic account for Claude Code (own account or a team plan) | Dr. Shah and Dhaval, each |

For each account, record the owner, login email, billing owner, and recovery method. Keep this list in a password manager. Never put it in the repository.

## 4. Tools on each laptop

- Git
- Node.js (current LTS) and npm
- VS Code
- Claude Code (command line or desktop app)
- GitHub CLI (`gh`), optional

## 5. Code transfer (clean start)

Shailesh sends a zip file of the code. This way Shailesh does not need a seat in your organization or access to your repository to save money. Dhaval does the steps below.

1. Dhaval creates an empty **private** repository in the new organization.
2. Shailesh sends the zip. It holds the project files only: no `.git`, `.next`, or `node_modules`.
3. Dhaval unzips it into a fresh folder, then runs `git init` and makes one first commit.
4. Before the first commit, Dhaval adds `.claude/settings.local.json` to `.gitignore` and checks that no secret or data file is in the folder.
5. Dhaval adds the new repository as `origin` and pushes. Dr. Shah clones from it.
6. After the new Vercel deployment works, Shailesh archives or deletes the old public repository and the old Vercel project.

## 6. Run the app on your laptop

```bash
git clone <new-repo-url>
cd <repo>
npm install
npm run dev
```

Open `http://localhost:3000`. Then run `npm run lint` and `npm run build`. Both must pass before you push.

## 7. Deploy on Vercel

1. Dhaval installs the Vercel GitHub app on the organization. Give it access to this one repository only.
2. Import the repository as a new Vercel project. Framework: Next.js. No environment variables are needed today.
3. Set the function region to Mumbai. Add this to `vercel.json` in the repository and push:
   ```json
   { "regions": ["bom1"] }
   ```
4. Deploy. Open the new `*.vercel.app` address and check the pages: patients, remedies, reports, match, analytics, test.
5. Shailesh deletes or pauses the old Vercel project (`invicta-omega`) after the new one works. This is on his own account; he needs no access to yours.

Do not use Vercel's "Transfer Project" feature. A fresh import is simpler and avoids broken Git links.

## 8. How you work together

Work directly on `main`. No branches, no pull requests. Ask Claude Code to do every step, including Git.

**To make a change**, tell Claude Code what you want. For example: "Add a pain score field to the visit form. Then check it, commit, and push."

Claude Code pulls the latest code, makes the change, runs `npm run lint` and `npm run build`, commits, and pushes. Vercel deploys `main` to production in a few minutes. Open the live address and check the result.

**If something breaks**, tell Claude Code: "Revert the last commit and push." Or, in Vercel, promote the previous deployment.

**Rules**
- Every push goes live at once. Check the live site after each change.
- Tell the other person before you start a large change, so you do not edit the same files.
- Never paste keys or real patient data into Claude Code. Use fake data only until the login module ships.
- `CLAUDE.md` and `AGENTS.md` are shared. Tell the other person before you change them.
- Keep `.claude/settings.local.json` in `.gitignore`. `.claude/launch.json` stays in Git on purpose.

## 9. Handover checklist

- [ ] Each person has a GitHub account, a Vercel account, and an Anthropic account, all with two-factor login
- [ ] GitHub organization exists; Dhaval and Dr. Shah are owners
- [ ] Private repository exists in the organization with the clean first commit
- [ ] `.gitignore` covers `.claude/settings.local.json`
- [ ] Node.js LTS version is written into the repository
- [ ] Vercel Pro team builds from the private repository, with functions in `bom1`
- [ ] New live address works with mock data
- [ ] Both people have run the app locally, pushed a change to `main`, and seen it go live
- [ ] Old public repository is archived or deleted; old Vercel project is removed
- [ ] The account list (section 3) is in the password manager

## 10. Before the backend work starts

These items do not block the handover. They matter once patient data enters the app.

- **Database region.** Supabase offers a Mumbai region. Create the project there and keep Vercel functions in `bom1`, next to it.
- **Supabase access in India.** In February 2026, `supabase.co` was blocked on several Indian internet providers (Jio, Airtel, ACT) under a government order. Reports say access was restored, but I could not confirm the current state. Test from Jio and Airtel before choosing Supabase. If the risk remains, put the API behind your own domain or choose another database host.
- **Law.** The DPDP Act and Rules (2025) cover personal data. Commentary says there is no general ban on foreign hosting today, but the government may restrict some transfers, and health data may be named later. I read summaries, not the rule text. Ask a lawyer to review hosting and patient consent before real patient data goes live.
- **Other hosts.** If Vercel stops fitting, AWS Mumbai is the likely next step. Indian providers (for example E2E Networks, DigitalOcean Bangalore) and Cloudflare are options. I did not check their Next.js support or pricing.
