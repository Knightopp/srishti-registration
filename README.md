# SRISHTI 2.7 — Dedicated Registration & Passes Portal

Standalone, load-isolated registration and pass verification portal for **SRISHTI 2.7 Techno-Cultural Fest** at St. Thomas College.

## Architecture

This project is separated from the main marketing website (`srishtiiiiiii`) to ensure:
- **Load & Traffic Isolation**: Zero downtime for registrations during high concurrent traffic spikes.
- **Deep Linking**: Accepts `?event=<event_id>` from the main website cards to auto-select events.
- **Instant QR Passes**: Cryptographically validated E-passes with custom center logo QR codes.
- **Pass Verification**: Accessible at `?pass=<pass_id>` for coordinators at entry gates.

## Development

```bash
npm install
npm run dev
# Starts server at http://localhost:5174
```

## Production Build

```bash
npm run build
# Outputs optimized static bundle in /dist
```
