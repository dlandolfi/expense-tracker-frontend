# Expense Tracker — Frontend

A mobile-friendly shared expense tracker for two users. Built with Next.js, TypeScript, Tailwind CSS, and shadcn/ui.

## Tech Stack

- [Next.js](https://nextjs.org/) — React framework
- [TypeScript](https://www.typescriptlang.org/) — Type safety
- [Tailwind CSS](https://tailwindcss.com/) — Styling
- [shadcn/ui](https://ui.shadcn.com/) — UI components
- [React Query](https://tanstack.com/query) — Data fetching and caching
- [Axios](https://axios-http.com/) — HTTP requests

## Getting Started

### Prerequisites

- [Node.js v22+](https://nodejs.org/)
- [expense-tracker-backend](https://github.com/yourusername/expense-tracker-backend) running locally or on a server

### Running Locally

1. Clone the repo

```bash
   git clone <repo-url>
   cd expense-tracker-frontend
```

2. Install dependencies

```bash
   npm install
```

3. Create a `.env.local` file

```
   NEXT_PUBLIC_API_URL=http://localhost:3001
```

4. Start the dev server

```bash
   npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000)

## Deployment

The frontend is deployed on [Vercel](https://vercel.com). Any push to `main` triggers an automatic redeployment.

Set the following environment variable in Vercel:

```
NEXT_PUBLIC_API_URL=https://yourdomain.com/expenses-api
```

## Features

- Add and delete shared expenses
- Filter expenses by month
- Balance summary showing who owes what
- Gruvbox dark mode theme
- Mobile friendly
