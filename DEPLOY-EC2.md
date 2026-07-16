# Deploy Fleet Vaults to AWS EC2

The site is a Next.js server app (it has the `/api/contact` route), so it runs with
`next start` behind nginx, kept alive by PM2. This guide takes you from a blank EC2
instance to a live HTTPS site.

Target OS in this guide: **Ubuntu 24.04 LTS**. Node **22**. App listens on **port 3000**;
nginx serves **80/443** in front of it.

---

## 1. Launch the EC2 instance

In the AWS console → EC2 → Launch instance:

- **AMI:** Ubuntu Server 24.04 LTS
- **Type:** `t3.small` (2 GB RAM). `t3.micro` (1 GB) can run out of memory during
  `next build` — if you must use it, add swap (see the note at the bottom).
- **Key pair:** create/download one so you can SSH in.
- **Security group** — allow inbound:
  - SSH (22) — from your IP
  - HTTP (80) — from anywhere
  - HTTPS (443) — from anywhere
- **Elastic IP:** allocate one and associate it with the instance, so the public IP
  doesn't change on reboot. You'll point DNS at this IP.

SSH in:

```bash
ssh -i your-key.pem ubuntu@YOUR_ELASTIC_IP
```

---

## 2. Install Node, git, nginx

```bash
sudo apt update && sudo apt -y upgrade
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt install -y nodejs git nginx
sudo npm install -g pm2
node -v && npm -v      # expect Node v22.x
```

---

## 3. Get the code

```bash
cd /var/www 2>/dev/null || (sudo mkdir -p /var/www && cd /var/www)
sudo chown -R $USER:$USER /var/www
cd /var/www
git clone https://github.com/hsc-soft/fleetvaults-web.git
cd fleetvaults-web
```

---

## 4. Set environment variables

`.env.local` is gitignored (the Resend key is never in the repo), so create it on the
server:

```bash
cat > .env.local <<'EOF'
RESEND_API_KEY=re_your_real_key_here
CONTACT_TO=info@fleetvaults.com
CONTACT_FROM=Fleet Vaults <noreply@fleetvaults.com>
EOF
chmod 600 .env.local
```

---

## 5. Install, build, run

```bash
npm ci
npm run build
pm2 start npm --name fleetvaults -- start      # runs `next start` on port 3000
pm2 save
pm2 startup            # run the command it prints, so PM2 restarts on reboot
```

Check it's up locally:

```bash
curl -I http://localhost:3000        # expect HTTP/1.1 200 OK
```

---

## 6. nginx reverse proxy

A ready config lives in the repo at `deploy/nginx-fleetvaults.conf`.

```bash
sudo cp deploy/nginx-fleetvaults.conf /etc/nginx/sites-available/fleetvaults
sudo ln -s /etc/nginx/sites-available/fleetvaults /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t && sudo systemctl reload nginx
```

Now `http://YOUR_ELASTIC_IP` should serve the site.

---

## 7. Point the domain

In your DNS host (GoDaddy — same place the Resend records live), add an **A record**:

- `fleetvaults.com`  →  `YOUR_ELASTIC_IP`
- `www`              →  `YOUR_ELASTIC_IP`

(If the apex is already used by GoDaddy forwarding, remove that first.)
Wait for DNS to propagate (a few minutes to a couple of hours).

---

## 8. HTTPS (free, auto-renewing)

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d fleetvaults.com -d www.fleetvaults.com
```

Certbot edits the nginx config to add the 443 block and sets up auto-renewal.
Site is now live on **https://fleetvaults.com**.

---

## Redeploying after code changes

```bash
cd /var/www/fleetvaults-web
git pull
npm ci
npm run build
pm2 restart fleetvaults
```

## Useful commands

```bash
pm2 logs fleetvaults      # app logs (contact-form errors show here)
pm2 status                # process state
sudo tail -f /var/log/nginx/error.log
```

## Note: t3.micro (1 GB RAM) build OOM

If `npm run build` gets killed, add swap before building:

```bash
sudo fallocate -l 2G /swapfile && sudo chmod 600 /swapfile
sudo mkswap /swapfile && sudo swapon /swapfile
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
```
