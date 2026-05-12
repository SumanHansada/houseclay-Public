# Houseclay Revival Playbook

> Step-by-step guide to bring Houseclay back online from the frozen state documented in [`FREEZE-RUNBOOK.md`](./FREEZE-RUNBOOK.md). Read that doc first for context on what currently exists.

**Expected total time:** ~1 working day end-to-end (most steps are parallelizable, SSL cert renewal is the longest serial dependency).

---

## 0. Before you start

Gather these from `FREEZE-RUNBOOK.md`:

- All 4 AMI IDs (§2)
- Architecture for each instance (3 are ARM, 1 is x86 — §3)
- Security group names (or whichever ones you'll use)
- Key pair names
- RDS config values (§4) and reference screenshots in `assets/`
- Route 53 record list (the records are still live but you'll need to update A records — §6)

Also check:

- [ ] AWS account billing is current, no holds
- [ ] GitHub Actions secrets still valid (`AWS_ACCESS_KEY`, `AWS_SECRET_KEY`, `DATABASE_*`, etc.)
- [ ] Domain `houseclay.com` still active on GoDaddy (hasn't expired during freeze)
- [ ] Whoever's reviving has IAM permissions for EC2, RDS, S3, Route 53, CloudFront

---

## 1. Launch EC2 instances from AMIs

For each AMI in turn. Architecture mismatch is the #1 mistake here — double-check before clicking Launch.

### 1A. Frontend (arm64)

1. EC2 → AMIs → select `ami-0634a06e6e84a9465` → **Launch instance from AMI**
2. Instance type: **t4g.medium** (must be Graviton family for arm64)
3. Key pair: `frontendmum`
4. Security group: select existing `launch-wizard-3` (verify ports 80, 443, 22 are open)
5. IAM instance profile: attach `certbot-r53` role
6. Storage: 16 GB gp3 (matches snapshot, increase later if needed)
7. Launch
8. Wait for "running" + 2/2 status checks (~3 min)

### 1B. Zebra admin (arm64)

1. EC2 → AMIs → `ami-0c0219c640e51f092` → Launch instance from AMI
2. Instance type: **t4g.medium**
3. Key pair: `zebrabig`
4. Security group: `launch-wizard-7` (ports 80, 443, 22)
5. IAM role: `certbot-r53`
6. Storage: 16 GB gp3
7. Launch

### 1C. Elasticsearch (arm64)

1. EC2 → AMIs → `ami-0fdd1d6bb327bcfef` → Launch
2. Instance type: **t4g.medium**
3. Key pair: `mumbai-elastic`
4. Security group: `launch-wizard-1` (ensure ingress allows only backend SG, no public 9200)
5. IAM role: optional (only needed if it accesses S3 directly)
6. Storage: 8 GB gp3
7. Launch

### 1D. Backend (x86_64 — different family!)

1. EC2 → AMIs → `ami-0942cdc756a3a6cea` → Launch
2. Instance type: **t2.micro** OR **t3.micro** (must be Intel/AMD family — NOT t4g)
3. Key pair: `backendmum`
4. Security group: `launch-wizard-4` (ports 8080, 22)
5. IAM role: `certbot-r53`
6. Storage: 8 GB gp3
7. Launch

> Consider upgrading backend to t3.small or t3.medium on revival if performance was constrained before. If you want to migrate to ARM (cheaper), see `FREEZE-RUNBOOK.md` §3 "Revival-time upgrade option" — that path skips the AMI and rebuilds from CI/CD on a fresh Graviton instance.

### Image resizer — decision point

There's no AMI for this. Options:
1. **Skip it** — most likely, since it was dead for 5 months before freeze
2. **Rebuild** — clone the GitHub repo, launch fresh EC2, redeploy via PM2

If unsure, skip it. If image processing breaks anywhere on revival, revisit.

---

## 2. Allocate new EIPs and update Route 53

The old EIPs (65.1.26.16 for backend, 65.0.57.43 for zebra) were released and have been reassigned to other AWS customers by now. New EIPs must be allocated.

### 2A. Allocate

For backend and zebra (frontend may or may not have had an EIP — check freeze record):

1. EC2 → **Elastic IPs** → Allocate Elastic IP address → ap-south-1
2. Allocate one per instance that needs a public IP
3. Associate each EIP to its respective new instance

Note the new IPs.

### 2B. Update Route 53

1. Route 53 → Hosted zones → `houseclay.com`
2. Update these A records to the new EIPs:
   - `api.houseclay.com` → new backend EIP
   - `zebra.houseclay.com` → new zebra EIP
   - (anything else that pointed to released EIPs)
3. **Do not touch** MX, TXT (DMARC/SPF/DKIM), or CNAME records — those preserve email and CloudFront aliases.
4. TTL is typically 300s, so propagation is fast.

---

## 3. Recreate RDS Postgres

> Full config in `FREEZE-RUNBOOK.md` §4. Reference screenshots: [`assets/rds-configuration-2026-05-11.png`](./assets/rds-configuration-2026-05-11.png), [`assets/rds-connectivity-2026-05-11.png`](./assets/rds-connectivity-2026-05-11.png), [`assets/rds-maintenance-2026-05-11.png`](./assets/rds-maintenance-2026-05-11.png).
>
> No final snapshot exists. Schema must be recreated from app migrations, not restored.

1. RDS → Databases → **Create database**
2. **Standard create** → Engine: PostgreSQL → version: **17.4** (or whatever current minor; the pre-freeze instance had auto-minor-upgrade enabled, so anything ≥17.4 works)
3. Templates: Production
4. Settings:
   - DB instance identifier: `houseclay`
   - Master username: `postgres` (matches `DATABASE_USERNAME` in GitHub Secrets)
   - Master password: matches `DATABASE_PASSWORD` in GitHub Secrets (or generate new and update secret)
5. Instance configuration: `db.m7g.large` (ARM, 2 vCPU, 8 GB RAM) — downsize to `db.t4g.micro`/`db.t4g.small` for cost if low load is expected initially
6. Storage: gp2 (or gp3 — gp3 is newer and cheaper), 20 GiB, encryption enabled (KMS: `aws/rds`)
7. Connectivity:
   - VPC: same as EC2 instances (default VPC in ap-south-1)
   - Public access: **No**
   - VPC security group: recreate / reuse `sg-0a9d3050a5fe112e` style — allow port 5432 from backend SG only
   - Availability Zone: `ap-south-1c` (same as before, for proximity to backend)
   - Port: 5432
8. Database authentication: Password authentication (IAM auth disabled, matching original)
9. Additional configuration:
   - Initial database name: whatever backend `DATABASE_URL` expects (likely `houseclay` or `postgres`)
   - Parameter group: `default.postgres17`
   - Option group: `default:postgres-17`
   - Backup retention: 1 day
   - Backup window: 16:01–16:31 UTC
   - Multi-AZ: No
   - Auto minor version upgrade: Enabled
   - Deletion protection: **Enable this time** (was disabled before — minor improvement)
10. Create database (takes 5–15 min to provision)

### 3A. Run schema migrations

Once RDS is available:

1. From local or CI, run the backend's migration tool:
   ```
   cd hc-backend/backend
   ./mvnw flyway:migrate    # or equivalent
   ```
2. Update `DATABASE_URL` in GitHub Secrets to point to new RDS endpoint
3. Verify connection from backend EC2: SSH in and `psql $DATABASE_URL` or `nc -vz <endpoint> 5432`

---

## 4. Verify S3 buckets

Buckets should still exist with their original CORS, IAM, and bucket policies intact.

1. S3 → confirm both buckets present and empty
2. Permissions tab → CORS configuration → verify expected rules still there
3. Permissions tab → Bucket policy → verify
4. IAM → policies → verify the presigned-URL policy used by backend still exists, still attached to the right role/user

If anything is missing, recreate from the bucket-policy / CORS exports referenced in the freeze record.

---

## 5. Re-enable CloudFront

1. CloudFront → Distributions → for each distribution → **Enable**
2. Wait for status: **Deployed** (~15–20 min per distribution)
3. While waiting, verify the distribution still points to the correct S3 origin and behavior settings haven't changed
4. ACM certs in us-east-1 should still be valid (ACM auto-renews if validation CNAMEs in Route 53 remain — which they do)

---

## 6. Renew SSL certs on EC2 instances

If freeze was longer than ~60 days, Let's Encrypt certs are likely expired. The certbot dns-route53 plugin handles renewal automatically since the IAM role is still attached.

On each instance (frontend, zebra, backend) that serves HTTPS:

```bash
ssh ec2-user@<new-ip>
sudo certbot certificates                    # check expiry
sudo certbot renew --force-renewal           # if expired
sudo systemctl reload nginx                  # if certs renewed
```

If certbot fails:
- Verify the IAM role `certbot-r53` is attached to the instance
- Verify the role has Route 53 `ChangeResourceRecordSets` permission
- Check `/etc/letsencrypt/cli.ini` is intact

---

## 7. Trigger CI/CD deploys

The AMIs preserved the system setup but app artifacts were intentionally removed during freeze (deployed via CI/CD on each push, never on disk for long). The three deploy workflows under `.github/workflows/` were switched to `workflow_dispatch` only during freeze — before triggering, restore the original `push: main` trigger blocks (commented out in each file).

### 7A. Backend

1. GitHub → `hc-backend` workflow → manual trigger, or push a no-op commit to `main`
2. Workflow:
   - Builds JAR with Maven
   - SCPs to `ec2-user@<new backend EIP>:/home/ec2-user/backend/app.jar`
   - Kills any process on 8080 and starts new one via `nohup java -jar`
3. **Important:** update GitHub Secret `EC2_HOST` to the new backend EIP before triggering
4. Verify: `curl http://<backend-ip>:8080/health` or whatever the health endpoint is

### 7B. Frontend

1. Trigger frontend deploy workflow
2. Rsync deploys source to `/var/www/houseclay/`
3. Build runs in-place on the EC2
4. PM2 restarts the app
5. Verify nginx is proxying correctly: `curl -I https://houseclay.com`

### 7C. Zebra admin

Same pattern as frontend.

---

## 8. Smoke test

End-to-end checks before considering the revival done:

- [ ] `https://houseclay.com` loads with valid SSL
- [ ] `https://www.houseclay.com` redirects to apex
- [ ] `https://cdn.houseclay.com/<known-asset>` returns the asset (CloudFront)
- [ ] `https://api.houseclay.com/health` returns 200
- [ ] `https://zebra.houseclay.com` loads admin login
- [ ] User registration / login flow works (tests backend → RDS)
- [ ] Property listing page loads images (tests S3 + CloudFront + presigned URLs)
- [ ] Search works (tests Elasticsearch)
- [ ] Send a test transactional email (tests mailer91 DNS)
- [ ] Receive an email at a `houseclay.com` address (tests Google Workspace MX)

---

## 9. Post-revival cleanup

- [ ] Update `FREEZE-RUNBOOK.md` to mark the freeze as ended with date
- [ ] Document new EIPs, new RDS endpoint, new AMI sources if any drift
- [ ] Delete the freeze AMIs **only after** confirming everything works for 7+ days — they're insurance during the transition
- [ ] Re-enable any CloudWatch alarms that were disabled
- [ ] Reset billing alarm threshold to normal operating levels
- [ ] Remove the freeze banner from root `SETUP.md`

---

## 10. Things that can go wrong (and how to handle)

| Symptom | Likely cause | Fix |
|---|---|---|
| AMI launch fails with "architecture mismatch" | Picked wrong instance family for AMI's arch | Use t4g for arm64 AMIs, t2/t3 for x86 AMI (backend) |
| Can't SSH into new instance | Security group missing port 22 ingress for your IP, or wrong key pair | Update SG; verify key pair name matches |
| SSL cert renewal fails | IAM role not attached, or Route 53 permissions revoked | Reattach `certbot-r53` role; check role policy |
| Backend can't connect to RDS | New RDS endpoint not in GitHub Secrets, or SG doesn't allow backend SG → RDS port 5432 | Update `DATABASE_URL` secret; fix SG rules |
| CloudFront returns 403 / NoSuchBucket | Origin S3 bucket name changed, or bucket policy missing | Verify S3 origin in CloudFront behavior; restore bucket policy |
| Email stops working | MX/SPF/DKIM record accidentally modified | Restore from Route 53 screenshot in freeze record |
| Elasticsearch unreachable | SG ingress not allowing backend SG | Add backend SG as source on ES SG port 9200 |

---

## 11. If revival is no longer wanted

If circumstances change and Houseclay should be permanently shut down instead of revived:

1. EC2 → AMIs → deregister all 4 AMIs
2. EC2 → Snapshots → delete the 4 snapshots (frees ~₹200/month)
3. S3 → delete the 2 buckets entirely (after confirming they're still empty)
4. Route 53 → delete all record sets except NS/SOA, then delete the hosted zone (saves ~₹40/month)
5. On GoDaddy: change nameservers back to GoDaddy default, decide whether to renew or let `houseclay.com` expire
6. CloudFront → delete the disabled distributions
7. ACM (us-east-1) → delete the certs
8. Verify with Resource Groups → Tag Editor → All regions that nothing remains

This brings AWS spend to ₹0 permanently.
