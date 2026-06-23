# Edumate Implementation TODO

## Backend
- [x] Fix `updateUser` to use `req.file` from multer for avatar update.


## Frontend
- [x] Fix `frontend/app/dashboard/password/page.tsx` missing `useEffect` import inside `ProtectedRoute`.
- [x] Add Next.js `middleware.ts` to differentiate public vs protected routes and enforce auth using `edumate_session` cookie.
- [ ] Ensure protected pages are redirected server-side (dashboard, /dashboard/*) and public pages (/login, /register, /) remain accessible (verify with manual test).


## Verification
- [x] Run backend + frontend builds/typecheck and confirm no TS/ESLint errors.

- [ ] Manually test:
  - [ ] Login → dashboard access
  - [ ] Direct navigation to /dashboard/profile without cookie → redirect
  - [ ] Profile update with avatar upload
  - [ ] Password update uses same `/api/v1/auth/update` endpoint

