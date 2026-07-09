# TODO - Passport PDF generation fix (Admin approved but user can't click / failed)

- [ ] Step 1: Improve error handling UI: show exact PDF generation/upload failure reason on-screen.
- [ ] Step 2: Fix photo handling: when polling returns `data.photoUrl` (Google Drive/public URL), convert it to base64/dataURL before passing into `generateChallengePassportPdfBase64`.
- [ ] Step 3: Guard `passport.png` background load: if missing/unloadable, show explicit message.
- [ ] Step 4: Re-test flow end-to-end: upload tasks -> admin approve -> user sees and can open Passport PDF.

