Testing instructions
====================

Quick overview
- Unit tests: use Jest (built into CRA) + React Testing Library.
- E2E: suggested using Playwright (not installed by default).

Setup (Windows)
1. Install project deps (if not already):

```bash
npm install
```

2. Run unit tests:

```bash
# run all tests once
npm test -- --watchAll=false

# run in interactive mode
npm test
```

Notes about the tests added
- Unit tests added under `src/__tests__/` cover:
  - `useBooks` (fetch + filtering)
  - `useLocalStorageState` (init + update)
  - `useKey` (keydown handling)
  - `useMovies` (fetch flow)
  - `StarRating` (click behavior)
  - `App` (smoke test with mocked hooks)

E2E with Playwright (optional)
--------------------------------
1. Install Playwright and browsers:

```bash
npm i -D @playwright/test
npx playwright install
```

2. Run the dev server in one terminal:

```bash
npm start
```

3. Run Playwright tests in another terminal:

```bash
npx playwright test
```

If you want I can add Playwright as a dev dependency and the sample test runner config for you.

Comprehensive E2E with Cypress (complete step-by-step)
-----------------------------------------------------

This project includes a Cypress test at `cypress/e2e/full_flow.cy.js` which runs a full user flow:
- Register a new user via the UI
- Login with the created user
- Open a book details, select borrow duration, borrow the book
- Verify borrowed list, delete the borrowed book
- Logout and verify return to login

Prerequisites (what you must run before Cypress):
- Start the JSON test server (api) on port 9000:

```bash
# starts json-server serving data/books.json at http://localhost:9000
npm run server
```

- Start the React dev server (frontend) in another terminal:

```bash
npm start
```

Install Cypress (one-time):

```bash
npm install
npm install -D cypress
npx cypress install
```

Useful npm scripts (added to package.json):
- `npm run cypress:open` — opens the Cypress UI (interactive)
- `npm run cypress:run` — run Cypress tests in headless mode

Run the Cypress test (recommended order):

1. Start the API server (json-server):

```bash
npm run server
```

2. Start the frontend app:

```bash
npm start
```

3. Open Cypress (interactive) and run tests:

```bash
npm run cypress:open
```

or run headless (CI-friendly):

```bash
npm run cypress:run
```

Notes and troubleshooting
- The Cypress test uses Persian UI labels and simple selectors. If you changed text in the UI, update `cypress/e2e/full_flow.cy.js` accordingly.
- The test creates a user with a unique email using timestamp; json-server will persist this user in `data/books.json` while running. If you want a clean DB between runs, stop the server and restore `data/books.json` from source control or reset the file.
- If `npm run cypress:open` fails because Cypress not installed, run `npm install -D cypress` then `npx cypress open`.
- On first Cypress run you may need to allow downloading of the browsers by approving the prompt or running `npx cypress install`.

Want me to finish setup for you?
- I can: add `playwright` config too, add CI workflow for GitHub Actions, or make Cypress tests more robust using data attributes (recommended). Tell me which.
