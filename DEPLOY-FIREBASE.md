# Deploy Fleet Vaults to Firebase App Hosting

App Hosting runs the app as a real Node server on Cloud Run, so server components,
the `/api/*` route handlers and `src/proxy.ts` all work — unlike plain Firebase
Hosting, which only serves static files.

The Firebase project is **`fleetvaultsgps`** (the same one holding the Realtime
Database the admin panel reads).

> **Version caveat — read this first.** App Hosting's published support matrix
> currently tops out at **Next.js 15.2.x**. This app is on **16.2.10**. Firebase's
> March 2026 post on Next.js deployment adapters points at 16.2 support, and the
> quickstart says "13.5.x+", but 16 is not on the supported-version table yet. The
> build may fail, or `src/proxy.ts` (Next 16's renamed middleware) may not be
> honoured. If it does not work, the fallback is Cloud Run with a Dockerfile —
> App Hosting is built on Cloud Run anyway, and a container pins the Node version
> and runs Next 16 without relying on anyone's adapter.

Repo: `https://github.com/hsc-soft/fleetvaults-web`

---

## What is already in the repo

- **`apphosting.yaml`** — runtime sizing and environment variables. Secrets are
  referenced by name only, never stored here.
- **`firebase.json`** — points local-source deploys at backend `fleetvaults-web`.

Nothing in either file contains a secret, so both are committed.

---

## 1. Sign in and pick the project

The CLI is run through `npx`, so nothing is installed globally.

```bash
npx firebase-tools login          # opens a browser
npx firebase-tools use fleetvaultsgps
```

## 2. Upgrade the project to Blaze

App Hosting needs the **pay-as-you-go (Blaze)** plan — Cloud Build, Cloud Run,
Artifact Registry and Secret Manager all bill through it. Upgrade in the
[Firebase console](https://console.firebase.google.com/project/fleetvaultsgps/usage/details).

`apphosting.yaml` sets `minInstances: 0` (scales to zero when idle, so an idle
site costs nothing but the first request after a quiet spell is slow) and
`maxInstances: 5` (a ceiling so a traffic spike or a crawler cannot run up a
large bill). Raise `minInstances` to 1 if the cold start is annoying — that is
the main thing that turns an idle month into a billed one.

## 3. Create the backend

```bash
npx firebase-tools apphosting:backends:create --project fleetvaultsgps
```

Answer the prompts:

- **Region** — `asia-south1` (Mumbai), closest to the users and to the EC2 box.
- **Backend ID** — `fleetvaults-web`. This must match `backendId` in
  `firebase.json`, or `firebase deploy` will not find it.
- **GitHub connection** — optional. Connecting `hsc-soft/fleetvaults-web` gives
  push-to-deploy; skipping it means deploying from local source each time.

## 4. Load the secrets

Three values from `.env.local` go into Cloud Secret Manager. Each command prompts
for the value — paste it, it is not echoed:

```bash
npx firebase-tools apphosting:secrets:set RESEND_API_KEY
npx firebase-tools apphosting:secrets:set ADMIN_SESSION_SECRET
npx firebase-tools apphosting:secrets:set FIREBASE_DB_SECRET
```

Say **no** when asked to add the reference to `apphosting.yaml` — all three are
already declared there.

Then let the backend read them:

```bash
npx firebase-tools apphosting:secrets:grantaccess \
  RESEND_API_KEY,ADMIN_SESSION_SECRET,FIREBASE_DB_SECRET \
  --backend fleetvaults-web
```

`ADMIN_SESSION_SECRET` must be **the same value as on EC2** while both are live —
it signs the admin cookie, so a different value logs admins out when DNS moves.

## 5. Deploy

```bash
npx firebase-tools deploy --only apphosting
```

The CLI zips the repo (minus `firebase.json`'s `ignore` list), uploads it, runs
`npm run build` in Cloud Build and rolls it out to Cloud Run. First deploy takes
several minutes.

---

## 6. Check it before touching DNS

The backend gets its own URL (`https://fleetvaults-web--fleetvaultsgps.<region>.hosted.app`).
EC2 keeps serving `fleetvaults.com` until DNS is moved, so test on that URL first:

- `/` and `/products/wired-gps-trackers/teltonika-fmb920` — static and dynamic pages
- `/admin` — must redirect to `/admin/login`; this proves `src/proxy.ts` ran. **If
  `/admin` loads without a login, the proxy was not applied — stop and do not move
  DNS.**
- Log in, open `/admin/invoices`, raise an invoice, print it
- `/contact` — submit the form, confirm the mail arrives (Resend secret works)

## 7. Point the domain

Only once the above passes. In the Firebase console → App Hosting → the backend →
**Add custom domain** → `fleetvaults.com`, then set the DNS records it gives you.
Certificates are issued automatically.

Keep the EC2 instance running until DNS has propagated and the site is confirmed
healthy. See `DEPLOY-EC2.md` for what to shut down afterwards.

---

## Redeploying

```bash
npx firebase-tools deploy --only apphosting
```

Or, if GitHub was connected in step 3, push to `main` and App Hosting builds it.

## If the build fails on Next 16

Check the Cloud Build log the CLI links to. If it is a framework-version error
rather than a code error, that is the caveat at the top of this file. The move to
Cloud Run is small: add a Dockerfile with `output: "standalone"`, then
`gcloud run deploy`. Everything else — project, secrets, region, domain — stays.
