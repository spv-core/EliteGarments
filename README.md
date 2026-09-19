
# EliteGarments

Small static website prototype for a textile factory outlet. Includes:

- `index.html` — About page, product catalog (display-only), and admin login.
- `styles.css` — Site styling.
- `app.js` — Client-side logic for product display and a password-protected admin dashboard (orders, revenue, inventory).

Quick start (static server):

1. Open `index.html` directly in a browser (double-click), or run a simple HTTP server:

```bash
python3 -m http.server 8000
# or
python -m http.server 8000
```

Then open http://localhost:8000 in your browser.

Notes:
- The Shop is display-only (customers can view products but not purchase).
- Admin: on first admin login you set a password; it is stored client-side (hashed) in `localStorage`.
- Orders and inventory are persisted to `localStorage` for this prototype.

Next steps I can help with:
- Add server-backed storage (Node/Express or Firebase)
- Add search, filters, or pagination for the catalog
- Add product images and improved inventory management

