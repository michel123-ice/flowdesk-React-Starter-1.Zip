# FlowDesk

A responsive project and client management dashboard built with React, TypeScript, Vite, and Tailwind CSS.

## Run locally

1. Install [Node.js](https://nodejs.org/) if it is not already installed.
2. Extract this ZIP file.
3. Open the extracted `flowdesk` folder in VS Code.
4. Open the VS Code terminal and run:

   ```bash
   npm install
   npm run dev
   ```

5. Open the local URL printed in the terminal (usually `http://localhost:5173`).

## Included in this first version

- Overview dashboard with project and task summaries
- Create projects and track progress
- Projects list with search and status filtering
- Task list with working completion toggles
- Client directory
- Browser `localStorage` persistence
- Responsive desktop and mobile layout

## Important

This is a front-end portfolio milestone. The starter workspace contains clearly identified sample data. Changes are saved only in the current browser on the current device. Authentication, shared team access, a live database, and Supabase integration are not included yet.

## Build for deployment

```bash
npm run build
```

The production files are generated in `dist/`. You can push the project to GitHub and import that repository into Vercel. Vercel detects Vite automatically; use `npm run build` as the build command and `dist` as the output directory.
