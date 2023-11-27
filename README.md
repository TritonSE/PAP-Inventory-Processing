# PAP-Inventory-Processing

A web app built for nonprofit organization Patriots and Paws to process and analyze veteran service requests (VSRs). Includes a digital VSR for veterans, and an admin portal for staff.

This project is built with MongoDB, Express.js, Node.js, React, TypeScript, Next.js, and Firebase.

## Development Start Guide

### Required Tools

- Git
- Text Editor (VS Code, Notepad, Vim, etc.)
- Prettier VS Code extension to auto-format code (recommended)
- Node.js and NPM
- MongoDB

### Environment Variables

Before running the project, you must configure environment variables for the frontend and backend. Environment variables contain information that may be different between different developers and development vs. production environments, and/or may be sensitive information we don't want to put in our public GitHub repos (e.g. Firebase keys, email account password).

See the `.env.example` files in both the frontend and backend for a list of environment variables and example values. The real values (for sensitive variables, such as Firebase settings) can be found in our project's Google Drive (TSE Drive -> PAP -> Development -> Environment Variables). The `src/util/validateEnv.ts` files in both the frontend and backend list the expected types for each environment variable, and will throw an error if any environment variables are missing or of the wrong format when you run the project.

### Backend

1. First, ensure that MongoDB is running on your machine on the port specified in the `MONGODB_URI` environment variable
2. `cd backend` to go to the backend directory
3. `npm install` to install dependencies
4. `npm run start` to run backend

### Frontend

1. `cd frontend` to go to the frontend directory
2. `npm install` to install dependencies
3. `npm run dev` to run frontend in development mode

### Linters & Formatters

This project has ESLint and Prettier set up to run linting and code formatting, respectively, whenever you run `git commit`. All of the following scripts are available for both the frontend and backend:

- `npm run lint-check` runs lint checks on your code.
- `npm run lint-fix` fixes any automatically fixable lint errors.
- `npm run format` runs code formatting checks and fixes any formatting errors.

### Tests

This project has unit tests for the frontend and backend, using the Jest testing framework. The tests are located in the `__tests__` directories within both the `frontend` and `backend` directories. To run unit tests for either frontend or backend, run `npm run test`.
