# AI connector (ChatGPT / Claude)

`https://drfiraszoghieb.com/api/mcp` is an MCP server. Once ChatGPT or Claude is connected, it can read, add, edit and delete all website content. Every change is recorded and can be undone.

## Turn it on (once)

1. Apply the database migration to the production database:
   ```bash
   npx prisma migrate deploy
   ```
   This creates `McpClient`, `McpAuthCode`, `McpToken` and `McpAuditLog`. `npm run build` does not run migrations.
2. In Vercel → Project → Settings → Environment Variables (Production), set `MCP_ENABLED=true`, then redeploy.
   - Optional: `MCP_PUBLIC_URL` if the site is not served from `NEXT_PUBLIC_SITE_URL` / `https://drfiraszoghieb.com`.
   - Optional: `MCP_ALLOWED_REDIRECT_HOSTS` (comma-separated) for clients other than ChatGPT and Claude.
3. Open **Dashboard → AI connections** to check the status and copy the URL.

## Connect

- **ChatGPT**: Settings → Apps & Connectors → Advanced settings → turn on Developer mode → Create. Paste `https://drfiraszoghieb.com/api/mcp` and choose authentication **OAuth**.
- **Claude**: Settings → Connectors → Add custom connector → paste the URL.

You'll be sent to the dashboard. Sign in with the dashboard password, then click **Allow**.

## Tools

| Tool | What it does |
|---|---|
| `get_site_overview` | Editing rules, every content type and its fields, record counts, settings groups |
| `list_content` / `get_content` | List, search or read posts, services, prices, before & after cases, gallery images, menu items and media folders |
| `create_content` | Add a record. **It goes live immediately** unless `published: false` (menu items: `enabled: false`) |
| `update_content` | Change some fields of a record |
| `set_published` | Publish or hide a record |
| `delete_content` | Delete a record. `confirm` must equal its slug, title or name |
| `reorder_content` | Set the display order |
| `get_settings` / `update_settings` | Page text (hero, about, footer, section headings), contact details, FAQs, page SEO, Google reviews, Instagram |
| `list_media` / `list_media_folders` / `get_media_usage` | Browse the media library |
| `upload_media_from_url` | Copy a public https image into Vercel Blob and the media library |
| `update_media` / `delete_media` | Rename or move a file, or delete it (refused while the file is still used) |
| `list_revisions` / `restore_revision` | Change history, with undo and redo |
| `audit_content_seo` | Meta title and description gaps, duplicate titles, missing FAQs, links or reviews |

## Safety

- OAuth 2.1 with PKCE. Tokens are stored only as hashes. Access tokens last 1 hour; refresh tokens last 30 days and are replaced each time they are used.
- **Changing `ADMIN_SECRET` disconnects every assistant.** You can also disconnect one under AI connections.
- SMTP (mail) settings can't be read or written. Settings keys are allowlisted.
- HTML with scripts, iframes, inline event handlers or `javascript:` links is rejected.
- Image downloads are https only, private and internal network addresses are blocked on every redirect, and files are limited to 10 MB.
- Each change saves a before/after snapshot in `McpAuditLog`. **Dashboard → AI connections → Undo** reverts it. A deleted media file can't be restored, because its file is removed from storage.
- Set `MCP_ENABLED` to anything other than `true` to switch the connector off: every endpoint then returns 404.

## Not covered

- Contact form messages are emailed and never stored, so there is nothing to read.
- Blog redirects are code (`src/lib/blogRedirects.js`) and need a deploy to change.
- The Invisalign page (`src/app/(site)/services/invisalign-dubai`) is hard-coded.
