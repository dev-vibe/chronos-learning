# Chronos image connector (MCP)

A small remote MCP server that lets the Claude app (web, desktop, mobile) call the OpenAI Images API. Claude calls a tool; this server calls OpenAI with **your** API key and returns a preview plus a full-resolution link. It generates with the OpenAI image model, not with any ChatGPT conversation. API usage is billed to your OpenAI API account, separately from a ChatGPT subscription.

## Tools

| Tool | Purpose |
| --- | --- |
| `generate_image` | Prompt → image. `tier`: `reference` (highest fidelity) or `draft` (faster). Size, quality, transparent background. |
| `edit_image` | Prompt + reference images (stored ids and/or https URLs, optional mask) → image. |
| `create_upload_link` | Short-lived page where you drop reference images. Needed because images attached in a Claude chat are **not** passed to MCP tools. |
| `list_images` / `view_image` | Find ids of generated, edited and uploaded images; re-show a preview. |

Every image is stored with a JSON sidecar (prompt, model, size, reference ids/URLs, timestamp) for provenance.

## Model names

`IMAGE_MODEL_REFERENCE` defaults to `gpt-image-2.5-sunburst` and `IMAGE_MODEL_DRAFT` to `gpt-image-2.5-flare`. These names came from a ChatGPT conversation and have not been verified against the live API from this repo. If OpenAI returns "model not found", check your account's model list and set the two variables. No code change is needed.

## Run locally

```bash
cd tools/image-mcp
npm install
cp .env.example .env    # fill in OPENAI_API_KEY, CONNECTOR_SECRET, PUBLIC_BASE_URL
set -a; . ./.env; set +a
npm start
npm test                # end-to-end tests against a fake OpenAI server
```

## Deploy

Claude's cloud must reach the server, so it needs a public HTTPS URL, and images are written to disk, so it needs a persistent volume. That rules out Vercel/serverless (the main Chronos site's host). Any container host with a volume works (Fly.io, Railway, Render, a VPS). With the included `Dockerfile`:

1. Create the app with a volume mounted at `/data`.
2. Set secrets `OPENAI_API_KEY`, `CONNECTOR_SECRET`, `PUBLIC_BASE_URL` (the app's `https://` origin).
3. Deploy. `GET /healthz` should return `ok`.

Generate a secret with `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`.

## Add it to Claude

Claude → Customize → Connectors → **Add custom connector**, and enter:

```
https://<your-host>/mcp/<CONNECTOR_SECRET>
```

Leave OAuth fields empty. Because the secret is part of the URL, anyone with the URL can spend your OpenAI credit: don't share it, and rotate `CONNECTOR_SECRET` (then re-add the connector) if it leaks. Set a monthly spend limit on the OpenAI project key.

Then ask Claude, for example: "Use the Chronos image connector to draft a Bronze Age harbor at 1536x1024." To match an approved image, say "I want to use a reference": Claude will call `create_upload_link`, you drop the file, and Claude calls `edit_image` with the resulting id.

## Chronos art rules

The connector adds nothing to prompts. Follow `docs/design/design-system.md` and the media policy in `docs/content/lesson-creation-runbook.md`: no baked-in titles, paragraphs or UI in generated art, and record tool/model/date for provenance (the sidecar JSON has it).

## Security notes

- Reference URLs must be `https` and are refused if they resolve to private addresses or redirect.
- Uploads accept only PNG/JPEG/WebP up to 20 MB, via unguessable 15-minute links.
- Image URLs contain 128-bit random ids; treat them as unlisted, not private.
