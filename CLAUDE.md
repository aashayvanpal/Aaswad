# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## About

Aaswad Caterers — a MERN stack web app for catering order management. Customers can request food orders; admins manage items, customers, orders, multi-date orders, and event orders. Email notifications are sent via Nodemailer at key order lifecycle events.

## Commands

```bash
# Run both backend (port 5001) and frontend (port 3000) concurrently
npm run dev

# Run backend only
npm start          # node server.js
nodemon server.js  # with auto-restart

# Run frontend only
npm run client     # cd client && npm start

# Build frontend for production
npm run build      # cd client && npm run build

# Run frontend tests
cd client && npm test
```

There is no backend test suite. The frontend uses `react-scripts test` (Jest + Testing Library).

## Architecture

### Unusual Layout

Backend code is split between the project root and — counter-intuitively — `client/src/`. Files under `client/src/` that serve the **backend** (not the React app):

| Path | Purpose |
|---|---|
| `client/src/config/routes.js` | All Express route definitions |
| `client/src/config/database.js` | Mongoose connection |
| `client/src/config/main.js` | Shared constants (MongoDB URL, app version, email creds) |
| `client/src/controllers/` | CRUD controllers (items, orders, customers, eventOrders, etc.) |
| `client/src/middlewares/authentication.js` | JWT middleware (`x-auth` header) |
| `models/` | Mongoose schemas (root-level) |
| `server.js` | Express entry point |

### Request Lifecycle

```
React component
  → calls API wrapper from client/src/apis/
  → axios (baseURL from client/src/config/axios.js; proxies to localhost:5001 in dev)
  → Express (server.js)
  → router (client/src/config/routes.js)
  → controller (client/src/controllers/)
  → Mongoose model (models/)
```

### Authentication

- JWT tokens generated/verified via instance/static methods on `models/User.js`
- Middleware in `client/src/middlewares/authentication.js` checks the `x-auth` request header
- Frontend stores the token in `localStorage` under the key `'token'` and attaches it to all authenticated requests

### Frontend API Layer

`client/src/apis/` contains one file per resource (e.g., `customers.js`, `eventOrders.js`). Each file exports thin async functions that call the shared axios instance and pass the auth token. Components import from here rather than calling axios directly.

### Config Constants

`client/src/config/main.js` exports `mongodburl`, `axiosURL`, `appVersion`, and Nodemailer credentials. This is the single source of truth for environment-level configuration (currently hardcoded; no `.env` file exists).

### Key Models

| Model | Purpose |
|---|---|
| `User` | Auth with bcrypt passwords and JWT |
| `Item` | Menu items (name, price, category, ingredients, image) |
| `Customer` | Customer records |
| `Order` | Single customer order with items, transport, misc charges |
| `MultiOrder` | Orders spanning multiple dates |
| `EventOrders` | Event-based orders that aggregate multiple sub-orders |

### Email Notifications

`POST /sendEmail/:type` routes handle transactional emails (welcome, orderPlaced, orderApproved, orderCompleted, orderRejected, bill, forgotPassword, etc.) via Nodemailer configured in `main.js`.

### Frontend Routing

React Router v5 (`BrowserRouter` / `Switch` / `Route`) is configured in `client/src/App.js`. Protected routes check `localStorage` for a token and redirect to `/Signin` if absent.
