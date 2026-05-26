# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## About

**Aaswad Caterers** — a homely, tasty, healthy, pure-veg catering business. Tagline: *Homely. Tasty. Healthy. Pure Veg.*

This is a MERN stack web app for internal catering order management. There is **one user: the admin (the caterer)**. The customer-facing UI exists but is a lower priority — all active development targets the admin experience.

### Business Context

| | |
|---|---|
| **Users** | Single admin (the caterer). No multi-user or role-based access needed for now. |
| **Scale** | ~350 customers in DB. Order volume varies — daily/monthly cadence. Not a high-throughput system; reliability and clarity matter more than raw performance. |
| **Order types** | Single orders, multi-date orders (recurring), event orders (large events with sub-orders) |
| **Brand personality** | Warm, homely, trustworthy. Premium but approachable — not corporate. Gold + dark palette reflects this. |
| **Pure veg** | The business is strictly pure vegetarian. UI copy, item categories, and any food-related labels must reflect this. |

### Design North Star

The admin UI should feel like a **well-crafted internal tool built for a single power user** — fast to navigate, information-dense but not cluttered, with the warmth of the gold-dark brand. Every screen the caterer uses daily (orders list, order detail, customers) should be optimized for speed and clarity over decoration.

The frontend uses **MUI (Material UI) v9** for all UI components. Email notifications are sent via Nodemailer at key order lifecycle events.

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
| `Item` | Menu items (name, price, category, ingredients, image) — `category` is `Array` type, not String |
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

Shared shell for all admin pages: `Header` + collapsible sidebar + `<Outlet />`. Sidebar state: `collapsed` (desktop, 240 ↔ 64px) + `mobileOpen` (temporary Drawer). **The hamburger toggle button lives inside `NavigationBar` itself** (via `onToggle` prop) — not in the AppBar. The AppBar only shows a hamburger on mobile to open the temporary drawer.

### NavigationBar (`client/src/components/NavigationBar.js`)

Props:
- **`onToggle`** — shows a `MenuIcon`/`MenuOpenIcon` button in the sidebar header that expands/collapses the sidebar. Pass from both `MainLayout` (desktop) and `Menu`.
- **`onClose`** — shows a `ChevronLeft` button; used for mobile temporary drawers. If both props are provided, `onToggle` takes priority and `onClose` is ignored.
- **`collapsed`** — controls icon-only (64px) vs full (240px) mode.

The sidebar always uses `#100f0b` background in both light and dark themes — it is the only component exempt from theme switching.

### Menu (`client/src/components/Menu.js`)

Standalone page (not wrapped in `<Header />` or `MainLayout`). Has its own full-page layout: persistent sidebar + content column, identical pattern to MainLayout.

Key layout points:
- `/menu` route in `App.js` renders `<Menu />` alone — no `<Header />` wrapper
- Persistent sidebar on desktop (240 ↔ 64px), temporary Drawer on mobile — same as MainLayout
- Sidebar toggle is inside `NavigationBar` via `onToggle` prop; no hamburger in the top bar
- Top bar contains: "Menu" title · search field · item count chip · [spacer] · Contact (phone icon) · UserOptions avatar
- Cart bar: `position: fixed; bottom: 0; left: sidebarW; right: 0` — **`left` tracks sidebar width** with a CSS transition so it never overlaps the nav. On mobile `left: 0`.
- Content column has `pb: '80px'` to prevent cards hiding behind the fixed cart bar
- Item cards: CSS Grid (2 col xs → 3 sm → 4 md → 5 lg → 6 xl), gold border + checkmark overlay when selected

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

## Theme System

The app supports **dark** and **light** themes switchable from `/settings`. Preference is stored in `localStorage` under the key `aaswad-theme`.

### Architecture

| File | Role |
|---|---|
| `client/src/theme.js` | Exports `darkTheme`, `lightTheme` (both via `createTheme`), and `createAppTheme` helpers. Shared typography + component overrides extracted into `sharedComponents`. Date picker overrides generated per-mode via `pickerOverrides(mode)`. |
| `client/src/context/ThemeContext.js` | `AppThemeProvider` — reads `localStorage`, provides `{ themeMode, toggleTheme, setThemeMode }` via `useAppTheme()` hook. Wraps MUI `ThemeProvider` + `CssBaseline` internally. |
| `client/src/index.js` | Wraps the app in `<AppThemeProvider>` instead of a static `<ThemeProvider>`. |
| `client/src/components/SettingsPage.js` | Exposes a `ToggleButtonGroup` (Dark / Light) that calls `setThemeMode`. |

### Dark theme design (current)

- **Sidebar**: `#100f0b` always-dark — brand constant, never changes with theme
- **Content bg**: `#0f0e0b`
- **Cards / bars**: `#1a1800`
- **Borders**: `rgba(201,162,39,0.18)`
- **Text**: `rgba(255,255,255,0.78)` primary, `rgba(255,255,255,0.4)` muted

### Light theme design

- **Sidebar**: `#100f0b` (stays dark — intentional, looks great with gold)
- **Top bar**: `#ffffff` with gold border
- **Content bg**: `#FDFAF4` (warm ivory)
- **Cards**: `#ffffff`
- **Borders**: `rgba(201,162,39,0.25)`
- **Text**: `#1a1400` primary, `rgba(0,0,0,0.5)` muted

### Adding theme-awareness to a component

```jsx
import { useAppTheme } from '../context/ThemeContext'

const { themeMode } = useAppTheme()
const isDark = themeMode === 'dark'

const cardBg = isDark ? '#1a1800' : '#ffffff'
```

Never hardcode dark-only colours in components that appear in both themes. The sidebar (`NavigationBar`) is the only component exempt — it stays dark in both modes.

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

### TextField with custom background (theme-aware)

When overriding `bgcolor` on a `TextField` or `MuiOutlinedInput-root`, you **must** also set `color` (text) and `::placeholder` color explicitly. MUI's theme injects its own text color (white in dark mode, near-black in light) which will fight a hardcoded background and make text invisible.

```jsx
sx={{
  '& .MuiOutlinedInput-root': {
    bgcolor: isDark ? 'rgba(255,255,255,0.07)' : '#fff',
    color: TEXT,           // always set explicitly
  },
  '& .MuiOutlinedInput-input::placeholder': { color: TEXT_MED, opacity: 1 },
}}
```

Never hardcode `bgcolor: '#fff'` on an input without pairing it with explicit `color` — it will render invisible text in dark mode.

### Button text color on gold background

MUI `contained` Button computes its text color from the theme, overriding `color` set in `sx`. Always use `!important` when setting text color on gold-background buttons:

```jsx
sx={{ bgcolor: '#C9A227', color: '#1a1400 !important', '&:hover': { color: '#1a1400 !important' } }}
```

### Date / Time Picker

Using `@mui/x-date-pickers` v9 with **`AdapterDateFnsV2`** (not `AdapterDateFns`) — the project has `date-fns` v2.x installed, which uses default exports. `AdapterDateFns` expects v3's named subpath exports and will fail to build.

```jsx
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV2'  // ← V2, not AdapterDateFns

<LocalizationProvider dateAdapter={AdapterDateFns}>
  <DateTimePicker value={date} onChange={setDate} slotProps={{ textField: { size: 'medium' } }} />
</LocalizationProvider>
```

**All picker styling is root-level** — `pickerOverrides(mode)` in `client/src/theme.js` handles dark/light theming, sizing, and brand colors for every picker in the app. Do not add `desktopPaper` or other popup overrides via `slotProps` on individual pickers — put them in `pickerOverrides` instead.

**MUI v9 picker component names** — several internal component names differ from what the docs suggest. Use these exact keys in `styleOverrides`, confirmed against live DOM class names:

| What you're styling | Correct key | Wrong (doesn't land) |
|---|---|---|
| Day cells | `MuiPickerDay` | `MuiPickersDay` |
| Year buttons | `MuiYearCalendar` slot `button` | `MuiPickersYear` |
| Month buttons | `MuiMonthCalendar` slot `button` | `MuiPickersMonth` |
| Popup paper | `MuiPickersPopper` — use `width`, not `minWidth` | `minWidth` is ignored |
| Calendar height | Set `height: 'auto'` + `maxHeight: 'none'` on `MuiDateCalendar` or content gets clipped | |

**Day cell / week label alignment** — both must have the same `width` and `margin: 0` so `justifyContent: center` centers them identically in the 460px calendar column. If margins differ, columns drift.

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

---

## Error Handling

Every component that makes API calls must handle errors so the app never breaks silently.

### RTK Query (preferred)

Destructure `isError` and `error` from every query/mutation hook:

```jsx
const { data, isLoading, isError, error } = useGetOrdersQuery()
const [createOrder, { isLoading: saving, isError: saveFailed, error: saveError }] = useCreateOrderMutation()

if (isError) return <Alert severity="error">{error?.data?.message || 'Failed to load. Please try again.'}</Alert>
```

For mutations, show feedback inline — never `alert()`:

```jsx
const handleSubmit = async () => {
  try {
    await createOrder(payload).unwrap()
    // success path
  } catch (err) {
    console.error('[CreateOrder]', err)
    setErrorMsg(err?.data?.message || 'Something went wrong.')
  }
}
```

### axios calls

Wrap in `try/catch`. Store the error message in local state and render it with MUI `<Alert severity="error">`:

```jsx
const [errorMsg, setErrorMsg] = useState(null)

try {
  const res = await axios.post('/sendEmail/orderPlaced', payload)
} catch (err) {
  console.error('[SendEmail]', err)
  setErrorMsg(err?.response?.data?.message || 'Email failed to send.')
}

// in JSX
{errorMsg && <Alert severity="error" onClose={() => setErrorMsg(null)}>{errorMsg}</Alert>}
```

### Rules

- **Never let an API error throw uncaught** — always `try/catch` or handle `isError`.
- **Never use `alert()`** for error feedback — use MUI `<Alert>` or `<Snackbar>`.
- Show a loading state (`isLoading` / `CircularProgress`) whenever a fetch is in flight.
- Log errors with a `[ComponentName]` prefix for easy filtering: `console.error('[OrderList]', err)`.
- Error messages shown to users must be human-readable; fall back to a generic message if the server sends nothing useful.
- Do **not** add error handling for impossible cases — only handle real failure paths (network errors, 4xx/5xx responses).

---

## Frontend Engineering Standards

Act as a Senior UX/UI Engineer and master of frontend aesthetics building production-grade interfaces for **Aaswad Caterers** — a catering business management app.

**Before writing any frontend code**, output your reasoning in `<design_rationale>` tags covering:
- Design choices (color, spacing, typography) and why they fit the existing gold `#C9A227` + dark aesthetic
- Component structure and MUI v9 API choices
- Responsive strategy (mobile-first: xs → sm → md → lg)
- Any micro-interactions or animations planned

**Then wait for confirmation before writing code.**

### Constraints

1. **Design language**: Bold, intentional aesthetics aligned with the existing dark-gold brand. Do not introduce new color palettes, random gradients, or styles that clash with `#C9A227` gold + `#1a1400` dark. No generic "clean white SaaS" defaults.
2. **Tooling**: Use only what is in `package.json` — MUI v9 + SCSS. Do not introduce styled-components, Tailwind, or any new CSS methodology.
3. **Motion**: Add micro-interactions (CSS keyframe animations or MUI `sx` transitions) that feel tactile — hover states, subtle scale, fade-ins. Keep them smooth and purposeful, not decorative noise.
4. **Accessibility**: Every component must be WAI-ARIA compliant with proper semantic HTML tags. Keyboard-navigable where applicable.
5. **Responsive**: Mobile-first always. Test mentally across xs (360px), sm (600px), md (900px), lg (2560×1440). Tables → cards on mobile per the patterns in this file.
6. **No inline styles** for static values — SCSS classes only. MUI `sx` is fine. Dynamic values (computed from state/props) may stay inline.

---

## Backend Engineering Standards

Act as a Principal Backend Architect designing secure, scalable APIs for a Node.js + Express + MongoDB (Mongoose) stack.

**Before building or refactoring any API, database query, or business logic**, output analysis in `<system_architecture>` tags covering:
1. **Three architectural approaches** for the task — compare tradeoffs in latency, complexity, and maintainability
2. **Three most likely failure points** (e.g., race conditions, N+1 queries, memory leaks) and how the chosen design mitigates them

**Then wait for confirmation before writing code.**

### Constraints

- **Error handling**: Every async function, API route, and Mongoose query must have structured `try/catch` with descriptive `console.error('[ControllerName]', err)` logging
- **Security**: Rate-limiting on sensitive routes, strict input validation/sanitization, proper JWT auth scope checks via `authentication.js` middleware
- **MongoDB/Mongoose**: Use proper indexing, avoid unbounded queries (always paginate list endpoints), use `.lean()` for read-only queries, avoid N+1 by using `.populate()` selectively
- **Performance**: No synchronous blocking operations. Avoid loading entire collections into memory
- **Testability**: Write modular controller functions that are easy to unit test in isolation. Include comments marking edge cases that would need test stubs
- **No raw string interpolation** in queries — Mongoose schema typing handles injection prevention; never bypass it with `$where` or `eval`

---

## TODO List (priority order)

### 1. Layout & Font Family
- [x] Font family set: **Cormorant Garamond** (h1–h4, headings) + **DM Sans** (body, UI, buttons)
- [x] Google Fonts import added to `client/src/index.css`
- [x] `theme.js` typography updated — Cormorant on h1–h4 variants, DM Sans as base `fontFamily`
- [ ] Audit all components for layout breakage: overflow, misaligned flex/grid, wrong spacing at xs/sm/md/lg
- [ ] Fix any `px`-based font sizes — convert to `rem` anchored to the 22px base in `index.css`
- [ ] Verify layout on mobile (xs), tablet (sm/md), and 2560×1440 (lg)

### 1a. /menu Page — Light Mode Color Scheme Fix
- [x] Category tab text hardcoded — fixed to theme-aware chips
- [x] "No items found" text — fixed to theme-aware
- [x] Item cards — shadow + stronger borders in light mode added
- [x] Entire Menu.js audited for dark-only colors — all fixed
- [x] Item card name font size increased (0.82–0.9rem)
- [x] Item card category: hide "all", display as chip badge
- [x] Left nav Drawer paper bg fixed to `#100f0b` (dark sidebar in light mode)
- [x] /request page background updated to `#E8DCC8` parchment

### 1b. /menu Page — Hamburger & Layout Fixes
- [x] Hamburger icon repositioned — sticky top bar, left-aligned with search row
- [x] Sidebar toggle does not overlap item grid or cart bar — cart bar left tracks sidebarW

### 1c. /request Page — Input Field Sizes
- [x] Font sizes bumped to 1rem for inputs, 0.95rem for labels
- [ ] Personal Details + Event Details fields: increase height (use medium size, not small)
- [x] Event Date & Time picker popup: styled via root-level pickerOverrides in theme.js — 750px wide, 60px day cells, gold brand

### 1d. /request Page — CustomerModal Phone Number Style
- [x] Phone numbers now use card-style Box matching address cards (not Chip pills)

### 1e. /request Page — Tooltip Redesign
- [x] HDToolTip and ServiceToolTip rewritten with MUI InfoOutlinedIcon + branded Tooltip

### 1f. CartModel (Review Your Selections Modal) — Overhaul
- [x] Modal maxWidth='xl', minHeight: 70vh — very large
- [x] All font sizes increased throughout modal
- [x] Removed +/- quantity buttons per item
- [x] Bulk qty input moved into Qty column heading
- [x] Price and qty input sizes increased

### 2. Light & Dark Theme — Root-level Audit & Fix
- [ ] Audit every component for hardcoded dark-only hex colors (replace with `isDark ? ... : ...` or MUI `palette` tokens)
- [ ] Verify `CssBaseline` + body background switches correctly on theme toggle
- [ ] Ensure MUI `palette.text.primary / secondary` and `palette.background.default / paper` are used instead of raw hex where possible
- [ ] Check scrollbar, input, and select styling in both themes
- [ ] Test toggle at `/settings` end-to-end — no flash, no stuck colors

### 2b. /request Page — Light Mode Fix
- [ ] Audit /request page in light mode — fix all hardcoded dark colors
- [ ] Ensure form fields, labels, backgrounds all switch correctly with theme

### 2c. Event Details — Color Fix
- [ ] Audit Event Details component/page for dark-only hardcoded colors
- [ ] Fix all colors to be theme-aware (dark + light both correct)

### 2d. MUI Date Picker — Fix
- [x] Date picker not rendering/styling correctly — audit and fix in both themes
- [x] Ensure AdapterDateFnsV2 is used (not AdapterDateFns) — date-fns v2.x installed
- [x] Verify picker works on /request page and any other page that uses it

### 2e. Dark Mode — Full Consistency Audit
- [ ] All admin pages must be consistent in dark mode — no mixed backgrounds or leftover light colors
- [ ] Check sidebar, header, cards, tables, dialogs, inputs all match dark palette

### 3. Generate Bills — Fix
- [ ] Discuss current state with user before starting
- [ ] Fix bill print view — correct page margins, font, item table
- [ ] Ensure bill shows transport, misc charges, advance amount, totals correctly
- [ ] Test print / PDF export flow

### 3b. /orders/:id (Show) — Map for Delivery Address
- [ ] Add embedded map (OpenStreetMap iframe — no API key needed) showing delivery address
- [ ] Add "Open in Google Maps" button alongside the map
- [ ] Only show map when homeDelivery is true and address is present
- [ ] Map must be theme-aware (works in both dark and light)

### 3c. /items Page — Complete Redesign
- [ ] Full visual redesign — all functionality (CRUD) already works, just needs redesign
- [ ] Apply gold/dark brand, card grid layout, responsive design

### 3d. /items/:item_id — 500 Error Fix
- [ ] Investigate and fix 500 internal server error on individual item page
- [ ] Check controller, route, and model for this endpoint

### 3e. /items/:item_id — Display Redesign
- [ ] Redesign the item detail page — show all fields clearly
- [ ] Image, name, price, category, ingredients displayed professionally

### 3f. /items/add and /items/edit/:item_id — Redesign
- [ ] Redesign add/edit item forms to match the gold/dark brand
- [ ] Category input has a known bug — to be fixed when working on this

### 4. CRUD Orders Workflow
- [ ] Audit current order list, create, edit, delete — identify broken flows
- [ ] Migrate remaining axios calls to RTK Query (`ordersApi.js` already exists)
- [ ] Add loading states (`CircularProgress`) and error states (`<Alert>`) throughout
- [ ] Make order list responsive (cards on xs/sm, table on md+)
- [ ] Verify full order edit flow: OrderList/Show → setEditingOrder → /menu → /request → PUT

### 5. CRUD Multi-Orders Workflow
- [ ] Audit multi-order list, create, edit, delete — identify broken flows
- [ ] Create `store/services/multiOrdersApi.js` (RTK Query)
- [ ] Register in `store/index.js` (rootReducer + middleware)
- [ ] Replace axios calls with RTK hooks
- [ ] Add loading/error states and responsive layout

### 6. CRUD Event Orders Workflow
- [ ] Audit event order list, create, edit, delete — identify broken flows
- [ ] Create `store/services/eventOrdersApi.js` (RTK Query)
- [ ] Register in `store/index.js`
- [ ] Replace axios calls with RTK hooks
- [ ] Add loading/error states and responsive layout

### 7. CRUD Customers Workflow
- [ ] Audit customer list, add, edit, delete — identify broken flows
- [ ] Create `store/services/customersApi.js` (RTK Query)
- [ ] Register in `store/index.js`
- [ ] Replace axios calls with RTK hooks
- [ ] Add loading/error states and responsive layout
- [ ] Verify CustomerModal search + prefill flows still work after migration
