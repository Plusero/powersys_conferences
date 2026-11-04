# Power Systems Conferences
Test change
A static site that showcases conferences from the Notion database **List of Specific Conferences**. Browse dates, locations, submission deadlines, and links to official sites - filtered by year and organization.

Link to the site: [https://plusero.github.io/powersys_conferences/](https://plusero.github.io/powersys_conferences/).

## Linux usage

Install dependencies and start the local development server:

```bash
npm install
npm run dev
```

Open [http://localhost:4321](http://localhost:4321).

Set up local Notion credentials before syncing:

```bash
cp .env.example .env
```

Then edit `.env` with your `NOTION_API_KEY` and `NOTION_DATABASE_ID`. See [Environment setup](#environment-setup) for where to find both values.

Sync conference data from Notion:

```bash
npm run sync
```

Validate the site before committing or pushing synced changes:

```bash
npm run build
npm run check
```

Preview the production build locally:

```bash
npm run preview
```

If `astro` is not recognized, restore the local dependency install from the lockfile:

```bash
npm ci
```

## Windows usage

When using PowerShell on Windows, prefer `npm.cmd` for repo commands. PowerShell may block the `npm.ps1` shim with an execution-policy error.

Install dependencies and start the local development server:

```powershell
npm.cmd install
npm.cmd run dev -- --host 127.0.0.1 --port 55000
```

Open [http://127.0.0.1:55000](http://127.0.0.1:55000).

Set up local Notion credentials before syncing:

```powershell
Copy-Item .env.example .env
```

Then edit `.env` with your `NOTION_API_KEY` and `NOTION_DATABASE_ID`. See [Environment setup](#environment-setup) for where to find both values.

Sync conference data from Notion:

```powershell
npm.cmd run sync
```

Validate the site before committing or pushing synced changes:

```powershell
npm.cmd run build
npm.cmd run check
```

Preview the production build locally:

```powershell
npm.cmd run preview
```

If `astro` is not recognized, restore the local dependency install from the lockfile:

```powershell
npm.cmd ci
```

If PowerShell reports that `npm.ps1` cannot be loaded because running scripts is disabled, either keep using `npm.cmd` or allow local user scripts:

```powershell
Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned
```

If Astro fails with `listen EACCES` on `localhost`, `::1`, or low-numbered dev ports such as `4321`, use IPv4 localhost with a high port:

```powershell
npm.cmd run dev -- --host 127.0.0.1 --port 55000
```

## Environment setup

Copy `.env.example` to `.env` and replace the placeholders before running `npm run sync` or `npm.cmd run sync`.

```env
NOTION_API_KEY=secret_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
NOTION_DATABASE_ID=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

### Notion API key

1. Open [Notion integrations](https://www.notion.so/my-integrations).
2. Create a new integration, or open the existing integration for this project.
3. Copy the **Internal integration secret**.
4. Paste it into `.env` as `NOTION_API_KEY`.

The key should start with `secret_`. Do not commit `.env`; keep real secrets local.

### Notion database URL / ID

1. Open the Notion database named **List of Specific Conferences**.
2. Copy the database URL from the browser address bar.
3. Find the 32-character database ID in the URL, then paste it into `.env` as `NOTION_DATABASE_ID`.

For example, this URL:

```text
https://www.notion.so/xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx?v=...
```

uses this `.env` value:

```env
NOTION_DATABASE_ID=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

Dashed IDs also work:

```env
NOTION_DATABASE_ID=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
```

## Sync from Notion

1. Create a [Notion integration](https://www.notion.so/my-integrations) and copy the API key.
2. **Connect the integration to the database** (required - without this, sync fails with `object_not_found`):
   - https://www.notion.so/my-integrations -> your integration (e.g. **eu-conf**) -> **Content access** -> **Edit access** -> add **List of Specific Conferences**
3. Use the **Internal integration secret** from that same integration as `NOTION_API_KEY` in `.env` (not a key from a different integration).
4. Set `NOTION_DATABASE_ID` from the database URL as described in [Environment setup](#environment-setup).
5. Run the sync command for your platform from the Linux or Windows usage section above. The sync script loads `.env` automatically.

This refreshes `data/conferences.json`, which the site reads at build time.

### Official-source corrections

`data/conference-overrides.json` records corrections checked against official
conference websites, including source URLs, the verification date, and notes
where needed. The sync script applies each entry's `changes` by conference ID
after reading Notion. Partial `dates` and `deadlines` updates preserve the other
values, while an explicit `null` clears a field.

The November 4, 2026 refresh corrects PowerTech 2027's full-paper deadline to
February 28, 2027 and removes its unsupported separate abstract deadline. Its
submission opening is published only as November 2026, so no exact day is stored;
the official ConfTool portal is live. The refresh also updates AI4PowerGrids
2026, PES IM 2027, CIRED 2027, the PES GM 2027 link, CIGRE Bangkok 2027, and the
end dates for PES GM 2028 and CIGRE Paris 2028.

Recheck the linked sources when maintaining these corrections. Remove an
override once the corresponding Notion fields are accurate, or update it when
the organizers announce a change. For an immediate local edit, update the
matching fields in `data/conferences.json` as well as the override.

PowerUp 2026 and 2028 are listed directly in `data/conferences.json`, with
details checked on November 4, 2026 against the [official site](https://power-up.us/)
and [submission page](https://www.power-up.us/submit). The 2026 edition ran
September 9–11 in Boulder, Colorado; its paper deadline was January 30, 2026,
and submissions opened December 1, 2025. The separate poster abstract deadline
is not used as a paper submission cutoff. The 2028 edition is announced for
August in Ann Arbor, Michigan; exact days and submission deadlines remain
unset until announced. These local entries must be retained or added to
Notion before regenerating the data through a Notion sync.

## Build & deploy

Run the build, check, and preview commands for your platform from the Linux or Windows usage section above.

GitHub Pages deployment is configured in `.github/workflows/deploy.yml`. Enable **Pages** in the repo settings (source: GitHub Actions).

If your repo name is not `powersys_conferences`, update `base` in `astro.config.mjs` to match `/your-repo-name/`.

## Troubleshooting

### Git cannot write `.git` in this workspace

If Git commands fail with permission errors such as:

- `Unable to create '.../.git/index.lock': Permission denied`
- `cannot open '.git/FETCH_HEAD': Permission denied`

these usually indicate the workspace path has restricted write access to `.git`.

You can grant your current Windows user full control over `.git` from an elevated PowerShell:

```powershell
$repo = "C:\<your-workspace>\powersys_conferences"
takeown /f "$repo\.git" /r /d Y
icacls "$repo\.git" /grant "$($env:USERNAME):(OI)(CI)F" /T /C
```

If the commands still fail, keep using the automation-safe fallback (sync/build/check in a writable temp clone).

## Data model

Each conference includes:

| Field                           | Source (Notion)                                                             |
| ------------------------------- | --------------------------------------------------------------------------- |
| Title                           | `Name`                                                                      |
| Official website                | `Official website` (falls back to link in `Name` if empty)                  |
| Organization                    | `Org`                                                                       |
| Year                            | `Year`                                                                      |
| Location                        | `Location`                                                                  |
| Conference dates                | `Date`                                                                      |
| Abstract / full-paper deadlines | `abstract ddl`, `full paper submission ddl`                                 |
| Submission portal opens         | `submission opening` (optional; see [Submission status](#submission-status)) |
| Acceptance rate                 | `Acceptance Rate`                                                           |

### Submission status

Each conference card may show a submission badge. Status is computed from **today's date** and the deadline fields above.

The **submission cutoff** is the abstract deadline (`abstract ddl`) if set; otherwise the full-paper deadline (`full paper submission ddl`). A conference must have at least one of these to get any submission badge.

#### Accepting submissions

A conference is labelled **Accepting submissions** when **all** of the following are true:

1. It has a submission cutoff (abstract or full-paper deadline).
2. The cutoff is still in the future (submissions have not closed).
3. **Either** no `submission opening` date is set in Notion, **or** today is on or after that date (the portal is open or assumed open).

The badge reads: `Accepting submissions · Abstract due …` or `Accepting submissions · Full paper due …`.

#### Opening soon

A conference is labelled **Opening soon** when **all** of the following are true:

1. It has a submission cutoff (abstract or full-paper deadline).
2. The cutoff is still in the future (submissions have not closed).
3. A `submission opening` date **is** set in Notion.
4. Today is **strictly before** that opening date (the portal is not open yet).

The badge reads: `Submissions not open yet · Opens …`.

On the `submission opening` date itself, the label switches from **Opening soon** to **Accepting submissions**.

#### Other statuses

| Status | When |
| ------ | ---- |
| Submissions closed | A cutoff exists but is in the past |
| *(no badge)* | No abstract or full-paper deadline is set |

#### Filters and overview

- The overview stat and **Opening soon** filter count only conferences labelled **Opening soon**.
- The **Accepting submissions** stat and filter count only conferences labelled **Accepting submissions** (not Opening soon).

## Tech stack

- [Astro](https://astro.build) - static site generator
- Notion API - optional sync script (`scripts/sync-from-notion.mjs`)
