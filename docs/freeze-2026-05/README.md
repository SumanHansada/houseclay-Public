# Houseclay AWS Freeze — May 2026

Houseclay operations are paused as of **2026-05-11**. All compute, database, and CDN resources on AWS have been shut down to drop monthly spend to near-zero. Only the Route 53 hosted zone for `houseclay.com` remains active so MX / SPF / DKIM / DMARC records keep routing email (mailer91 + Google Workspace).

> **Status:** Frozen. Local dev still works (see root `SETUP.md`). Production endpoints (`houseclay.com`, `api.houseclay.com`, `zebra.houseclay.com`, `cdn.houseclay.com`) are offline.

## Cost target after freeze

Down from ~₹25,000/month at full ops to **~₹200–250/month** while frozen.

| Item                          | Approx monthly |
| ----------------------------- | -------------- |
| Route 53 hosted zone          | ~₹40 ($0.50)   |
| EBS snapshots backing 4 AMIs  | ~₹150–200 (dominant line item) |
| S3 buckets (emptied)          | < ₹1           |
| **Everything else**           | ₹0             |

Verified by Cost Explorer 7–10 days after freeze (see `FREEZE-RUNBOOK.md` §10).

## Documents in this folder

- [`FREEZE-RUNBOOK.md`](./FREEZE-RUNBOOK.md) — what was shut down, what was kept, and every config value needed to rebuild.
- [`REVIVAL-RUNBOOK.md`](./REVIVAL-RUNBOOK.md) — step-by-step thaw procedure when ops resume.
- [`assets/route53-records-2026-05-11.png`](./assets/route53-records-2026-05-11.png) — Route 53 zone snapshot on freeze day.
- [`assets/rds-configuration-2026-05-11.png`](./assets/rds-configuration-2026-05-11.png), [`assets/rds-connectivity-2026-05-11.png`](./assets/rds-connectivity-2026-05-11.png), [`assets/rds-maintenance-2026-05-11.png`](./assets/rds-maintenance-2026-05-11.png) — RDS Postgres config before deletion (no final snapshot exists).

## Revival contact

Owner: Aryan Riyal — see git log for current maintainer.

## CI/CD note

The three GitHub Actions deploy workflows (`deploy-backend`, `deploy-hc-frontend`, `deploy-zebra-ui`) have been switched from `push: main` to `workflow_dispatch` only. They will **not** auto-fire on merge while frozen. Revival = restore the `push:` trigger blocks.
