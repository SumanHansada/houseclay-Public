# Houseclay Freeze Record

> Reference doc for what was preserved, what was deleted, and where everything lives. Companion to [`REVIVAL-RUNBOOK.md`](./REVIVAL-RUNBOOK.md).

**Freeze date:** 2026-05-11
**Region:** ap-south-1 (Mumbai)
**AWS account:** `123012554801`
**Reason:** Indefinite hiatus — pivoted resources to Japandi project. Houseclay was experimental phase (~300–400 users), data considered stale.
**Cost target:** ~₹250/month (down from ~₹25,000/month)

---

## 1. Snapshot of what changed

| Resource | Action | Cost impact |
|---|---|---|
| 5x EC2 instances | 4 AMI'd + terminated, 1 fully deleted (image resizer) | ₹0 compute |
| RDS Postgres | Deleted with no final snapshot (data stale, not worth preserving) | ₹0 |
| S3 buckets (2) | Emptied, **kept** (preserves CORS, bucket policies, IAM presigned setup) | ₹0 storage |
| CloudFront distributions | Disabled (not deleted) | ₹0 |
| Route 53 hosted zone | Kept live — preserves DNS for Google Workspace email + future revival | ~₹40/month |
| AMI-backing snapshots (4) | Standard tier (archival was attempted but blocked — AMI registration prevents archiving without deregistering, complexity not worth ~₹110/month savings) | ~₹200/month |
| Elastic IPs | All released | ₹0 |
| WAF Web ACLs | 3 CloudFront-managed ACLs on "Free plan" — cannot be deleted manually, no cost | ₹0 |
| CertBot IAM role (`certbot-r53`) | Kept | ₹0 |

---

## 2. AMIs created — recovery images

These are the revival recipes. **Do not deregister them while frozen.**

| Role | AMI ID | Source instance | Snapshot ID | Size | Date |
|---|---|---|---|---|---|
| hc-frontend | `ami-0634a06e6e84a9465` | `hc-frontend-freeze-2026-05-11` | `snap-0af365a70171af403` | 16 GB gp3 | 2026-05-11 |
| hc-zebra-admin | `ami-0c0219c640e51f092` | `hc-zebra-freeze-2026-05-11` | `snap-084b6dc2725ce59d3` | 16 GB gp3 | 2026-05-11 |
| hc-elasticsearch | `ami-0fdd1d6bb327bcfef` | `hc-frontend-freeze-2026-05-11-elastic-search-EC2` | `snap-07467658dd803d8f1` | 8 GB gp3 | 2026-05-11 |
| hc-backend | `ami-0942cdc756a3a6cea` | `hc-backend-freeze-2026-05-11` | `snap-0ca0a6c396b1152e5` | 8 GB gp3 | 2026-05-11 |

Total snapshot storage: 48 GB allocated, billable size depends on actual used blocks (typically 30–50% of allocated for cleaned instances).

---

## 3. Instance configuration (for revival)

> **Critical — note the architecture difference.** The backend is x86 (t2.micro), everything else is ARM (Graviton t4g). When launching from AMIs on revival, the AMI architecture dictates which instance family you must pick. Picking the wrong family fails immediately with an architecture mismatch error.

| Instance | Type | Architecture | Security Group | Key Pair | Root Volume | Pre-freeze EIP |
|---|---|---|---|---|---|---|
| hc-frontend | t4g.medium | **arm64** | launch-wizard-3 | frontendmum | /dev/xvda 16GB gp3 | _(released)_ |
| hc-zebra-admin | t4g.medium | **arm64** | launch-wizard-7 | zebrabig | /dev/xvda 16GB gp3 | 65.0.57.43 (released) |
| hc-elasticsearch | t4g.medium | **arm64** | launch-wizard-1 | mumbai-elastic | /dev/xvda 8GB gp3 | _(internal only)_ |
| hc-backend | t2.micro | **x86_64** | launch-wizard-4 | backendmum | /dev/xvda 8GB gp3 | 65.1.26.16 (released) |
| hc-s3-image-resizer | t3.small | x86_64 | _(not noted)_ | houseclayfront | **TERMINATED — no AMI** | _(released)_ |

### About the image resizer

Discovery revealed it had been doing nothing for ~5 months — PM2 process list empty, no listening ports, no Docker. App code was at `/opt/image-worker/` but the service hadn't been running. Decision: skip AMI entirely, full terminate. If image processing is needed on revival, decide then whether to rebuild or handle inline in backend.

### Compatible instance families on revival

- **arm64 AMIs (frontend, zebra, elasticsearch):** must launch on Graviton families — t4g, c7g, m7g, c6g, m6g, etc. NOT t3/c5/m5.
- **x86_64 AMI (backend):** must launch on Intel/AMD families — t2, t3, c5, m5, c6i, etc. NOT t4g/c7g.

### Revival-time upgrade option (backend → ARM)

Backend currently x86 because the captured AMI is x86_64. If revival is the right moment to migrate backend to Graviton (cheaper, faster), do **not** launch from `ami-0942cdc756a3a6cea` directly — instead spin up a fresh Amazon Linux 2023 arm64 instance (e.g. `t4g.small`) and redeploy via the existing CI/CD pipeline. The captured AMI is then only useful as a config-reference fallback.

---

## 4. RDS — deleted

Postgres instance was deleted **without a final snapshot**. Data was considered stale (real-estate listings, weeks-old already not useful). On revival, the schema is recreated from app migrations; there is no data to restore.

**Reference screenshots:** [`assets/rds-configuration-2026-05-11.png`](./assets/rds-configuration-2026-05-11.png), [`assets/rds-connectivity-2026-05-11.png`](./assets/rds-connectivity-2026-05-11.png), [`assets/rds-maintenance-2026-05-11.png`](./assets/rds-maintenance-2026-05-11.png) — taken with status `Deleting`.

### Config to recreate on revival

| Field | Value |
|---|---|
| DB identifier | `houseclay` |
| Engine / version | PostgreSQL **17.4** (pending auto-upgrade to 17.9.9 scheduled 2026-06-07 13:25 UTC — moot, instance deleted) |
| Instance class | `db.m7g.large` (ARM / Graviton, 2 vCPU, 8 GB RAM) |
| Storage | General Purpose SSD **gp2**, **20 GiB**, encryption enabled (KMS: `aws/rds`) |
| Multi-AZ | No |
| Region & AZ | `ap-south-1c` (Mumbai) |
| Publicly accessible | No (VPC-internal only) |
| Port | 5432 |
| Master username | `postgres` |
| IAM DB authentication | Disabled |
| Parameter group | `default.postgres17` |
| Option group | `default:postgres-17` |
| Security groups (pre-deletion) | `sg-0a9d3050a5fe112e` (default VPC SG), `sg-0afb50dde2efbe113` (EC2-side inbound) |
| Subnet group | Default Mumbai VPC subnet group |
| ARN | `arn:aws:rds:ap-south-1:123012554801:db:houseclay` |
| Resource ID | `db-PGFZTUEHXZQQLOFHRZKQPTGFQ` |
| License | `postgresql-license` |
| Deletion protection | Disabled |
| Auto minor version upgrade | Enabled |
| Backup retention | 1 day (automated) |
| Backup window | 16:01–16:31 UTC |
| Maintenance window | 2026-05-17 18:55–19:25 IST |
| Created | 2025-12-29 18:08 IST |

**Automated snapshots present at deletion time** (now expired with the 1-day retention — not recoverable):
- `rds:houseclay-2026-05-08-16-15`
- `rds:houseclay-2026-05-09-16-15`
- `rds:houseclay-2026-05-10-16-15`

**Master credentials:** stored in GitHub Secrets (`DATABASE_URL`, `DATABASE_USERNAME`, `DATABASE_PASSWORD`) — same as the backend deploy workflow uses.

---

## 5. S3 buckets — emptied, kept

Both buckets remain in the account, emptied of all objects. Bucket configurations (CORS, bucket policy, IAM policy for presigned URLs) are preserved as part of the bucket itself.

| Bucket | Purpose | State |
|---|---|---|
| _(property images bucket — name TBD)_ | Property listing images | Empty, retained |
| _(website resources bucket — name TBD)_ | Static site assets | Empty, retained |

> Bucket names to be filled in. Check S3 console → Buckets to confirm exact names.

**Why kept empty rather than deleted:** empty buckets cost ₹0 and recreating with same CORS rules + bucket policy + IAM policy is tedious. Empty + kept = same cost, much easier revival.

---

## 6. Route 53 — kept live, untouched

Hosted zone for `houseclay.com` is active and unchanged. **All DNS records preserved** (20 total). Canonical snapshot: [`assets/route53-records-2026-05-11.png`](./assets/route53-records-2026-05-11.png).

| Name | Type | Value | Why kept |
|---|---|---|---|
| `houseclay.com` | A (alias) | CloudFront `d56kjwfmivp6km.cloudfront.net` | Apex; CF disabled but record kept for fast revival |
| `houseclay.com` | MX | `1 smtp.google.com` | **Google Workspace mail** |
| `houseclay.com` | NS | `ns-1140.awsdns-14.org`, `ns-146.awsdns-18.com`, `ns-780.awsdns-33.net`, `ns-2021.awsdns-60.co.uk` | Zone delegation |
| `houseclay.com` | SOA | AWS default | Required |
| `_dmarc.houseclay.com` | TXT | `v=DMARC1; p=none;` | Mail auth |
| 6 × SES DKIM CNAMEs (`2jgmjyzp...`, `2qq5usqex...`, `dusvzffhopq...`, `j7dkvutz4...`, `l2ahwmwyz...`, `msikzakksfj...`) | CNAME | `*.dkim.amazonses.com` | Outbound mail signing |
| `api.houseclay.com` | A | `65.1.26.16` | **EIP released — see note** |
| `cdn.houseclay.com` | A (alias) | CloudFront `d37cs8q5maotn3.cloudfront.net` | CDN, CF disabled |
| `_f61c3d81cbedbd...houseclay.com` | CNAME | `_41c34a5b72112480f7fb6e3...acm-validations.aws` | ACM cert validation |
| `mail.houseclay.com` | MX | `5 mx1.mailer91.com`, `10 mx2.mailer91.com` | **Transactional mail (mailer91)** |
| `mail.houseclay.com` | TXT | `v=spf1 include:mailer91.com -all` | SPF |
| `spaceship._domainkey.mail.houseclay.com` | TXT | `v=DKIM1; k=rsa; p=MIGfMA0...` | mailer91 DKIM |
| `mailer91.mail.houseclay.com` | CNAME | `email.mailer91.com` | mailer91 tracking |
| `www.houseclay.com` | CNAME | `houseclay.com` | www → apex |
| `zebra.houseclay.com` | A | `65.0.57.43` | **EIP released — see note** |

**Cost:** ~$0.50/month (~₹40/month)

**On revival:** the A records for `api.houseclay.com` and `zebra.houseclay.com` point to public IPs that AWS has likely reassigned to other customers since EIP release. New EIPs must be allocated and these A records updated before re-enabling endpoints.

**GoDaddy nameservers:** untouched, still pointing to Route 53. No action needed.

---

## 7. CloudFront — disabled, not deleted

Distributions are disabled (returns 403 if hit, but configuration is preserved). Re-enabling takes ~15 minutes propagation.

| Distribution | Domain | State |
|---|---|---|
| Apex distribution | `houseclay.com` | Disabled |
| CDN distribution | `cdn.houseclay.com` | Disabled |

ACM certificates in us-east-1 backing these distributions: **kept** (free, required for SSL on CloudFront).

---

## 8. WAF — clarified

3 Web ACLs exist, all created and managed by CloudFront on the "flat-rate pricing Free plan." These:
- Cannot be deleted manually (CloudFront owns them)
- Have no independent cost (bundled in CloudFront pricing)
- Will go away if/when CloudFront distributions are deleted

No action required. Any "WAF" charge that appeared on the bill before freeze was historical (from when CloudFront had active traffic) and should drop to ₹0 next billing cycle.

---

## 9. IAM — kept

- **`certbot-r53` role** — grants Route 53 TXT-write permission for ACME DNS-01 challenges. Attached to frontend, zebra, and backend EC2s pre-freeze. Kept because role has no cost and is needed for SSL renewal on revival.

---

## 10. What's still costing money (target state)

| Line | ₹/month (est.) |
|---|---|
| Route 53 hosted zone | ~40 |
| EBS snapshots backing 4 AMIs (standard tier) | ~150–200 |
| S3 (empty buckets) | <1 |
| ACM certs | 0 |
| IAM roles, security groups, VPC resources | 0 |
| Disabled CloudFront | 0 |
| WAF (CloudFront-managed free plan) | 0 |
| **Total estimate** | **~₹200–250/month** |

**Verification:** Wait 7–10 days after freeze, then check Cost Explorer → Daily by Service. The mixed billing right now reflects the pre-freeze state for most of the month — actual freeze cost only becomes visible after a full billing cycle of zero usage.

---

## 11. Open items / TBD

- [ ] Confirm exact S3 bucket names (currently placeholder in section 5)
- [ ] Verify CloudFront distribution IDs and add to section 7
- [ ] After 7–10 days, update section 10 with actual measured monthly cost from Cost Explorer
- [ ] Confirm no orphaned ENIs remain after RDS deletion (EC2 → Network Interfaces)

---

## 12. Files referenced

| File | Purpose |
|---|---|
| [`assets/route53-records-2026-05-11.png`](./assets/route53-records-2026-05-11.png) | Route 53 zone state at freeze |
| [`assets/rds-connectivity-2026-05-11.png`](./assets/rds-connectivity-2026-05-11.png) | RDS Connectivity & Security tab |
| [`assets/rds-configuration-2026-05-11.png`](./assets/rds-configuration-2026-05-11.png) | RDS Configuration tab |
| [`assets/rds-maintenance-2026-05-11.png`](./assets/rds-maintenance-2026-05-11.png) | RDS Maintenance & Backups tab |
