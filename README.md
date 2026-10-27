# Risklume — Landing page

A lightweight, responsive, editorial landing page for a security-assessment product. No framework or third-party runtime dependencies are needed.

## Run locally

- Open `index.html` in a browser, or
- Run `python3 -m http.server 8080` from this directory and visit `http://localhost:8080`.

## What's implemented

- Fully responsive desktop/mobile layout
- Accessible mobile navigation and example-finding tabs
- Interactive sample evidence / impact / fix panel and copyable sample fix guidance
- Reduced-motion-aware scroll reveals and subtle entry transitions
- Launch/policy dialogs that clearly communicate the current demo status
- SEO metadata, self-hosted SVG favicon, semantic HTML

## Important: landing-page-only stage

The buttons intentionally display a transparent **coming-soon** dialog. There is **no active GitHub authentication, repository scanning, payment collection, or storage of user code**. The findings are **clearly marked illustrative examples**. Replace the `launch-trigger` flow only once a secure, tested scan backend is available.

Production privacy/terms policies, actual authorization behavior and scan coverage must be validated before a public launch.

## Files

- `index.html` — structure and copy
- `styles.css` — design system, layout, animations, responsive refinements
- `script.js` — accessible interactions, sample panel, reduced-motion behavior
- `assets/favicon.svg` — minimal project favicon