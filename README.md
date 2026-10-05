# AI Interview Platform

A frontend MVP for an AI Voice Interview Platform built with Next.js.

## Tech Stack

* Next.js 14
* TypeScript
* Tailwind CSS
* React Hook Form
* Zod
* SQLite
* Better SQLite3

## Getting Started

### 1. Install dependencies

After cloning the repository, run:

```bash
npm install
```

### 2. Seed the database

The project uses a local SQLite database for development.

Run:

```bash
npm run db:seed
```

This creates the `users` table and adds the test users.

### 3. Start the development server

Run:

```bash
npm run dev
```

Then open:

```text
http://localhost:3000
```

If port 3000 is already in use, Next.js will automatically use another available port.

## Test Accounts

| Role         | Email                                                   | Password    |
| ------------ | ------------------------------------------------------- | ----------- |
| Tenant Admin | [admin@techhire.com](mailto:admin@techhire.com)         | password123 |
| Recruiter    | [recruiter@techhire.com](mailto:recruiter@techhire.com) | password123 |
| Candidate    | [candidate1@gmail.com](mailto:candidate1@gmail.com)     | password123 |

## Current Features

* Login page
* Email and password validation
* SQLite database
* Login API
* Mock authentication cookie
* Login success page
* Invalid credential handling

## Database

The SQLite database is created locally as:

```text
database.sqlite
```

The database file is excluded from Git and must be recreated by running:

```bash
npm run db:seed
```
