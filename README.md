# ICpEP Booth Games 2026

Interactive booth games built with Next.js for the ICpEP event.

## Requirements

- Node.js 20 or later
- npm 10 or later

## Getting Started

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

## Supabase Setup (Leaderboard)

The leaderboard now uses Supabase tables instead of `public/leaderboard.json`.

1. Copy `.env.example` to `.env.local`.
2. Set these values:

```bash
NEXT_PUBLIC_SUPABASE_URL=...
SUPABASE_SERVICE_ROLE_KEY=...
```

3. In Supabase SQL Editor, run:

- `supabase/leaderboard-schema.sql`

This creates separate tables for:

- Memory Heist
- Tech Tac Toe
- Ethernet Challenge
- Overall leaderboard

Create a production build:

```bash
npm run build
```

## Project Scope

This project currently includes:

- Tech Tac Toe
- LED Memory
- RJ45 Game

## Contributor Guidelines

All contributions must follow these rules:

1. Open an issue before starting implementation so the change is tracked and discussed.
2. When implementing changes, use conventional commits and include the issue number in the commit message.
3. Follow this commit format: `<type>/#<issue-number>(<scope>): <summary>`.
4. Example: `feat/#137(component): add animated game card transitions`.
5. Every pull request must use `dev` as the base branch unless a maintainer explicitly instructs otherwise.
6. Every pull request must be attached to its corresponding issue. Include the issue number in the pull request description and link it clearly.
7. Every pull request requires an interviewer before it can be reviewed or merged.
8. Keep pull requests focused on a single change or feature whenever possible.
9. Confirm the project builds and the affected behavior works before requesting review.

## Pull Request Checklist

Before opening a pull request, make sure that:

- The related issue exists.
- Commits follow the required conventional commit format with the issue number.
- The pull request base branch is set to `dev`.
- The pull request description references the related issue.
- An interviewer has been assigned or requested.
- The change has been tested locally.
- The scope of the pull request is limited to the intended update.
