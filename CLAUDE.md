# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## About

Aaswad Caterers — a MERN stack web app for catering order management. Customers can request food orders; admins manage items, customers, orders, multi-date orders, and event orders. Email notifications are sent via Nodemailer at key order lifecycle events. The frontend uses **MUI (Material UI) v9** for all UI components.

## Commands

```bash
# Run both backend (port 5001) and frontend (port 3000) concurrently
npm run dev

# Run backend only
npm start          # node server.js
nodemon server.js  # with auto-restart

# Run frontend only (Vite dev server)
npm run client     # cd client && npm start

# Build frontend for production
npm run build      # cd client && npm run build

# Run frontend tests
cd client && npm test
```

There is no backend test suite. The frontend uses Vite + React.

## Architecture

### Unusual Layout

Backend code is split between the project root and — counter-intuitively — `client/src/`. Files under `client/src/` that serve the **backend** (not the React app):

| Path | Purpose |
|---|---|
| `client/src/config/routes.js` | All Express route definitions |
| `client/src/config/database.js` | Mongoose connection |
| `client/src/config/main.js` | Backend constants (MongoDB URL, Nodemailer creds) — read from `.env` |
| `client/src/config/main.client.js` | Frontend-only constants (`appVersion`) |
| `client/src/controllers/` | CRUD controllers (items, orders, customers, eventOrders, etc.) |
| `client/src/middlewares/authentication.js` | JWT middleware (`x-auth` header) |
| `models/` | Mongoose schemas (root-level) |
| `server.js` | Express entry point (loads `.env` via dotenv at startup) |

### Request Lifecycle

```
React component
  → RTK Query hook (store/services/) or axios (apis/)
  → Vite dev proxy → Express (port 5001)
  → router (client/src/config/routes.js)
  → controller (client/src/controllers/)
  → Mongoose model (models/)
```

### Vite Proxy (development)

Configured in `client/vite.config.mjs`. These path prefixes are proxied to `http://localhost:5001`:

```
/api, /customers, /items, /orders, /myOrders,
/multiOrders, /eventOrders, /ingredients,
/register, /login, /logout, /account,
/contactus, /sendEmail
```

**Important:** All proxied routes use a `bypass` function — requests with `Accept: text/html` (browser navigation / page refresh) are served by Vite's SPA fallback instead of being forwarded to Express. This prevents `Cannot GET /orders` on refresh. Only API calls (non-HTML `Accept` header) are proxied.

`/request` was intentionally never added to the proxy list — browser navigation to `/request` is always handled by Vite. The order creation POST endpoint is `POST /api/orders`.

### Authentication

- JWT tokens generated/verified via instance/static methods on `models/User.js`
- Middleware in `client/src/middlewares/authentication.js` checks the `x-auth` request header
- Frontend stores the token in `localStorage` under the key `'token'`
- RTK Query attaches it automatically via `prepareHeaders` in each API service

### Frontend API Layer

Two patterns coexist:
1. **RTK Query** (`client/src/store/services/`) — preferred for CRUD, handles caching/invalidation automatically
2. **axios wrappers** (`client/src/apis/`) — used for resources not yet migrated to RTK

### Config Constants

`client/src/config/main.js` exports backend constants read from `.env`. `client/src/config/main.client.js` exports `appVersion` for the React frontend.

### Key Models

| Model | Purpose |
|---|---|
| `User` | Auth with bcrypt passwords and JWT |
| `Item` | Menu items (name, price, category, ingredients, image) |
| `Customer` | Customer records (phoneNumber and address stored as arrays of `{label: value}` objects) |
| `Order` | Single customer order — has `items[]`, `customer{}`, `transport{medium,rate}`, `misc[]`, `AdvanceAmount`, `status` |
| `MultiOrder` | Orders spanning multiple dates |
| `EventOrders` | Event-based orders that aggregate multiple sub-orders |
| `Query` | Customer contact/query submissions |
| `Ingredient` | Standalone ingredient records |
| `BlogPost` | Blog posts |

### Email Notifications

`POST /sendEmail/:type` routes handle transactional emails via Nodemailer. Types: `orderPlaced`, `orderApproved`, `orderCompleted`, `orderRejected`, `bill`, `forgotPassword`, etc. Email calls are still direct axios (not RTK) since they are fire-and-forget side effects.

### Frontend Routing

React Router v6 in `client/src/App.js`. Two route groups:

**Admin routes** — wrapped in `<Route element={<MainLayout />}>` (persistent sidebar + header):
`/dashboard`, `/items/*`, `/orders`, `/multiOrders`, `/customers/*`, `/ingredients`, `/eventOrders/*`, `/queries`, `/contacts`, `/profit-loss`, `/settings`, `/profile`, `/aboutus`, `/deals`, `/Cart`, `/Calender`, `/bulk-orders`

**Public/customer routes** — standalone with `<Header />`:
`/`, `/menu`, `/request`, `/requestEventOrder`, `/contact`, `/Register`, `/Signin`, `/myOrders/*`, print routes, `/users/add`

### BusinessAnalyzer

`/profit-loss` — frontend-only P&L tool (`client/src/components/businessAnalyzer/`). No backend calls. Uses File System Access API with `<input type="file">` fallback.

---

## Layout Components

### Header (`client/src/components/Header.js`)

MUI `AppBar` with dark `#1a1400` background and gold bottom border. Sticky positioned. Logo left, nav links + "Order Now" button right. Replaced the old anime.js-animated div-based header.

### MainLayout (`client/src/components/MainLayout.js`)

Shared shell for all admin pages: `Header` + collapsible sidebar + `<Outlet />`. Sidebar toggled via React state (`sidebarOpen`), not DOM manipulation.

### NavigationBar (`client/src/components/NavigationBar.js`)

Accepts optional `onClose` prop:
- **With `onClose`** (MainLayout, Menu): renders with `style={{ display: 'block' }}` and X button calls `onClose`
- **Without `onClose`** (legacy DOM usage): falls back to hiding itself via `document.getElementById`

### Menu (`client/src/components/Menu.js`)

Fully redesigned. Key layout points:
- CSS Grid for item cards: 1 col (xs) → 2 (sm) → 3 (md) → 4 (lg)
- Sidebar toggle via local `sidebarOpen` state
- Cart bar: `position: fixed; bottom: 0; left: 0; right: 0` wrapper Box containing `<CartModel />` — do NOT add `className="cart-button"` to the CartModel button, positioning is handled by the wrapper
- Page has `pb: '90px'` to prevent cards hiding behind the fixed cart bar
- Item cards show gold border + checkmark overlay when selected

---

## State Management — Redux Toolkit

The frontend uses **Redux Toolkit (RTK)** for global state. The store lives at `client/src/store/`.

### Store Structure

```
client/src/store/
  index.js                  — configureStore + redux-persist setup
  slices/
    cartSlice.js            — cart state (persisted to localStorage via redux-persist)
  services/
    ordersApi.js            — RTK Query for Orders CRUD
```

### Cart Slice (`store/slices/cartSlice.js`)

The cart is **persisted** via `redux-persist` (key: `'cart'`, storage: localStorage) so it survives page refresh.

| Action | Purpose |
|---|---|
| `addItem(item)` | Add item to cart with qty 1 (no-op if already in cart) |
| `removeItem(id)` | Remove item by `_id` |
| `updateQty({ id, qty })` | Update individual item quantity |
| `updatePrice({ id, price })` | Update individual item price (admin only) |
| `setBulkQty(qty)` | Set ALL items in cart to the same quantity |
| `clearCart()` | Empty cart and clear `editingOrder` |
| `setEditingOrder(order)` | Populate cart + `editingOrder` from existing order for editing (triggers PUT flow in CustomerRequest) |

**Never use inline `.map()` inside `useSelector`** — it creates a new array every render and triggers the "Selector returned different result" warning. Do:
```js
const cartItems = useSelector(state => state.cart.items)
const cartItemIds = cartItems.map(i => i._id)  // derived outside useSelector
```

**Redux state is frozen by Immer.** Never pass Redux objects directly to local `useState` that will be mutated. Always shallow-clone first:
```js
// BAD — editingOrder.misc items are frozen, MiscForm will crash on mutation
setMiscItems(editingOrder.misc)

// GOOD
setMiscItems(editingOrder.misc.map(m => ({ ...m })))
setTransport({ ...editingOrder.transport })
```

### Orders API (`store/services/ordersApi.js`)

RTK Query service. Auth token automatically attached via `prepareHeaders`.

| Hook | Method | Route |
|---|---|---|
| `useGetOrdersQuery()` | GET | `/api/orders` |
| `useGetOrderQuery(id)` | GET | `/api/orders/:id` |
| `useCreateOrderMutation()` | POST | `/api/orders` |
| `useUpdateOrderMutation()` | PUT | `/orders/:id` |
| `useDeleteOrderMutation()` | DELETE | `/orders/:id` |

All mutations invalidate the `'Order'` tag → automatic refetch in any component using `useGetOrdersQuery`.

### Order Edit Flow (order detail / order list → /menu → /request)

Both the Edit button on `/orders/:id` (Show.js) and the Update button on `/orders` (OrderList.js) use the same flow:

```
dispatch(setEditingOrder(order))  // populates cart items + stores full order
navigate('/menu')                  // user can add/remove items

/menu → CartModel "Proceed" → /request

/request (CustomerRequest → CustomerForm)
  → editingOrder detected → form pre-fills all customer fields, transport,
    advanceAmount, misc (all deep-cloned from Redux to allow mutation)
  → on submit → useUpdateOrderMutation (PUT /orders/:id)
  → on success → dispatch clearCart()
```

### Order Creation Flow (Menu → Cart → Submit)

```
/menu
  → user clicks item → dispatch addItem / removeItem
  → CartModel (fixed bottom bar) shows count
  → "Proceed" in Cart/AdminCart navigates to /request

/request (CustomerRequest → CustomerForm)
  → reads cartItems from useSelector
  → CustomerForm collects: customer details + transport + AdvanceAmount + misc
  → calls props.handleCustomerSubmit({ customer, transport, AdvanceAmount, misc })
  → CustomerRequest builds full order object and calls:
      - useUpdateOrderMutation (PUT) if editingOrder exists
      - useCreateOrderMutation (POST /api/orders) otherwise
  → on success → dispatch clearCart()
```

### Order payload shape

```js
{
  items: cartItems,          // from Redux cart
  customer: { fullName, phoneNumber, email, address, eventName,
               numberOfPeople, eventDate, eventTime,
               homeDelivery, service, customer_id, queries },
  transport: { medium, rate },   // only if homeDelivery; cleared when homeDelivery unchecked
  AdvanceAmount: number,         // optional; removable via × button in Form.js
  misc: [{ particular, rate }],  // optional array
  status: 'approve',
}
```

### `localStorage` Keys (current)

| Key | Purpose |
|---|---|
| `token` | JWT auth token (read by RTK Query `prepareHeaders`) |
| `business` | BusinessAnalyzer working copy |
| `cart` | redux-persist serialized cart state |
| `bulkOrders` | Multi-date order draft (Context API flow) |
| `bulkOrderSetting` | Multi-date order settings (date/mealType/index) |
| `eventId` | Event ID for event order flow |
| `report` | Order reporting selection |

### RTK Migration Plan (remaining resources)

| Resource | File to create | Status |
|---|---|---|
| Orders | `store/services/ordersApi.js` | ✅ Done |
| Items | `store/services/itemsApi.js` | ⬜ Pending |
| Customers | `store/services/customersApi.js` | ⬜ Pending |
| Multi Orders | `store/services/multiOrdersApi.js` | ⬜ Pending |
| Event Orders | `store/services/eventOrdersApi.js` | ⬜ Pending |
| Ingredients | `store/services/ingredientsApi.js` | ⬜ Pending |

Each new API service must be added to `rootReducer` and `middleware` chain in `store/index.js`.

---

## Display & Responsiveness

- **Design philosophy**: **Mobile-first**. Write base styles for mobile (xs), then layer up with `sm`, `md`, `lg` breakpoints. Never design desktop-first and patch mobile after.
- **Target screen**: 2560×1440 @ 60Hz (Linux). Chrome viewport is ~2553×1317 (scrollbar + taskbar offset — normal).
- **Font scaling**: `html { font-size: 22px }` in `client/src/index.css` is the rem anchor for 2560×1440. MUI theme (`client/src/theme.js`) has `htmlFontSize: 22, fontSize: 18` to match. **Both must stay in sync** — if the html font-size changes, update `htmlFontSize` in theme too. Do **not** hardcode `px` font sizes anywhere — always use `rem` so sizes scale with the base. The `/orders/:id` page (Show.js) is the reference for correct font sizing. After changing `index.css`, always fully restart the dev server (CSS base font-size changes do NOT hot-reload).
- **Stylesheet format**: All stylesheets are `.scss` (converted from `.css`). `client/src/index.css` is the only `.css` file and must stay as-is (Vite entry point). Never create new `.css` files — always `.scss`.
- **No inline styles**: Do not use `style={{...}}` on JSX elements for static styles. Put them in the component's `.scss` file as a class. Exception: truly dynamic styles (values computed from state/props/data at runtime) may stay inline. MUI `sx={{...}}` props are always fine — they are not inline styles.
- **Responsive patterns to use**:
  - Layout: `Stack direction={{ xs: 'column', sm: 'row' }}`, `Grid size={{ xs: 12, md: 6 }}`
  - Typography: `sx={{ fontSize: { xs: '0.9rem', md: '1rem' } }}`
  - Spacing: `sx={{ p: { xs: 1, md: 2 } }}`, `sx={{ gap: { xs: 1, md: 2 } }}`
  - Tables: on mobile (xs/sm) render **cards** instead of tables — tables are unreadable on small screens. Switch to MUI `Table` at `md+` using `sx={{ display: { xs: 'none', md: 'block' } }}` on `TableContainer` and a card list with `sx={{ display: { xs: 'flex', md: 'none' } }}`.
  - Buttons: full width on mobile (`fullWidth` or `sx={{ width: { xs: '100%', sm: 'auto' } }}`), auto on desktop.
  - Touch targets: minimum 44×44px on mobile (use `size="large"` for IconButton on mobile).
- **Never** use fixed pixel widths for layout containers — use `%`, `maxWidth`, or MUI breakpoints.
- **ThemeProvider** is in `client/src/index.js` wrapping the entire app. Any theme changes go in `client/src/theme.js`.

## UI Conventions

### MUI v9 prop rules (avoid React DOM warnings)

**Layout props must go inside `sx`, never as direct props on MUI components:**
```jsx
// WRONG — leaks to DOM, React warns
<Stack alignItems="center" justifyContent="space-between" flexWrap="wrap">
<Typography textAlign="center">

// CORRECT — stays in sx
<Stack sx={{ alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap' }}>
<Typography sx={{ textAlign: 'center' }}>
```

**`InputProps` is removed in MUI v9 — use `slotProps` instead:**
```jsx
// WRONG
<TextField InputProps={{ startAdornment: <SearchIcon /> }} />

// CORRECT
<TextField slotProps={{ input: { startAdornment: <SearchIcon /> } }} />
```

### MUI Version

Using **MUI v9**. Key API differences from older versions:
- `Grid` uses `size={{ xs: 12, md: 6 }}` not `item xs={12} md={6}`
- `Dialog` / `TextField` use `slotProps` not `PaperProps` / `inputProps`:
  ```jsx
  // Dialog
  <Dialog slotProps={{ paper: { sx: { borderRadius: '16px' } } }}>
  // TextField number input
  <TextField slotProps={{ htmlInput: { min: 1, max: 100 } }}>
  ```

### Date / Time Picker

Using `@mui/x-date-pickers` v9 with **`AdapterDateFnsV2`** (not `AdapterDateFns`) — the project has `date-fns` v2.x installed, which uses default exports. `AdapterDateFns` expects v3's named subpath exports and will fail to build.

```jsx
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV2'  // ← V2, not AdapterDateFns

<LocalizationProvider dateAdapter={AdapterDateFns}>
  <DateTimePicker value={date} onChange={setDate} slotProps={{ textField: { size: 'small' } }} />
</LocalizationProvider>
```

To extract HH:MM from a Date object reliably (avoids locale/timezone issues with `String(date).substr(...)`):
```js
const hh = String(d.getHours()).padStart(2, '0')
const mm = String(d.getMinutes()).padStart(2, '0')
const eventTime = `${hh}:${mm}`
```

### Gold color palette

| Use | Value |
|---|---|
| Primary gold | `#C9A227` |
| Hover gold | `#e8c84d` |
| Background tint | `rgba(201,162,39,0.08)` |
| Border tint | `rgba(201,162,39,0.28)` |
| Dark text on gold | `#3d2e00` |
| Muted text | `#7a6010` |

### Form pattern (`customer/Form.js`)

The `/request` page form does **not** use a `<form>` element — it uses a `<div>` with an `onClick` submit button. This avoids nested-form issues because `TransportForm`, `AdvancePaymentForm`, and `MiscForm` each contain their own `<form>` elements.

Each sub-section (transport, advance, misc) renders in two states:
- **Collapsed**: compact summary bar with icon + saved value + Edit button (advance payment also has a `×` remove button)
- **Expanded**: the sub-form component with a `×` close `IconButton` in the top-right corner (absolute positioned) to dismiss without saving

Unchecking **Home Delivery** clears the `transport` state (`{ medium: '', rate: '' }`) so stale transport data is never submitted.

### Order Detail Page (`order/Show.js`)

Three admin features on the order detail page:

1. **Edit Details** (inline) — "Edit Details" button in the nav bar toggles `editMode`. All customer fields + status become MUI TextFields/Select/Checkboxes/DateTimePicker. Save PUTs to `/orders/:id` and syncs all local state including `eventDateNew`. Cancel reverts without saving.

2. **Add to Customer DB** — Button navigates to `/customers/add` with `state.prefill` containing `{ fullName, email, phoneNumber: [{primary: '...'}], address: [{Home: '...'}] }`. `AddCustomerForm` reads `useLocation().state?.prefill` on mount and pre-populates fields.

3. **Delete Order** — Delete button (only for normal orders, not eventOrder type) opens `ConfirmDialog`. On confirm, calls `useDeleteOrderMutation` then navigates to `/orders`.

Transport and advance payment on the order detail page save directly to the backend via `PUT /orders/:id`. All `alert()` debug calls have been removed — use `console.log('[Transport] ...')` / `console.log('[AdvancePayment] ...')` prefixed logs instead. Never read/write `localStorage` for order data — the backend is the single source of truth.

### CustomerModal (`customer/CustomerModal/index.js`)

Two-panel MUI Dialog:
- Left: searchable customer list with avatar initials, highlighted selection
- Right: detail panel showing phone numbers as clickable Chips and addresses as clickable cards
- Confirm button disabled until customer + phone + address all selected
