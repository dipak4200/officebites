# Canteen Management Frontend Structure

This is the recommended, highly-scalable, yet beginner-friendly folder structure for our Angular frontend project. 
It makes it easy for multiple developers to work on different core features simultaneously without causing merge conflicts.

```
src/
└── app/
    ├── core/                # Core functionalities (Singleton Services, Guards, Interceptors)
    │   ├── guards/          # Route guards (e.g., AuthGuard, RoleGuard)
    │   ├── interceptors/    # HTTP interceptors (e.g., AuthInterceptor for adding tokens)
    │   ├── models/          # Global data interfaces / classes
    │   └── services/        # Single-instance services (e.g., AuthService, ApiService)
    │
    ├── shared/              # Reusable UI components used across multiple features
    │   ├── components/      # Common components (e.g., custom Buttons, Modals, Navbar)
    │   ├── directives/      # Reusable directives
    │   └── pipes/           # Reusable pipes (e.g., Currency formatting)
    │
    ├── features/            # Feature modules! (Each dev can take one feature)
    │   ├── admin/           # Admin-specific components and services
    │   ├── auth/            # Login, Registration components
    │   ├── employee/        # Employee dashboard, food ordering
    │   └── vendor/          # Vendor menu management, view orders
    │
    ├── layouts/             # Page shell components
    │   ├── auth-layout/     # Layout for Login/Register (no sidebar)
    │   └── main-layout/     # Main layout with Header, Sidebar, Footer
    │
    ├── assets/              # Images, icons, and global styles
    └── environments/        # Environment configurations (dev vs prod URLs)
```

## Why this structure?

1. **Separation of Concerns:** 
   - Feature Modules (`admin`, `vendor`, `employee`) let different developers work entirely in their own silos without stepping on each other's toes (reducing Git merge conflicts!).
2. **Reusability:** 
   - Anything that is used in more than one place goes in `shared/` (like custom UI elements or formatting pipes).
3. **Singleton Control:** 
   - App-wide state, API calls, and authentication live exclusively in `core/`. This makes bugs much easier to track down.
4. **Beginner Friendly:**
   - Instead of guessing where code goes, you just ask "Is this a feature specific to Admins?" -> `features/admin`. "Is this a neat button everyone can use?" -> `shared/components`.

## Next Steps for developers:
- When starting an angular app, initialize the Angular Workspace here. Avoid overwriting the directories, just copy newly generated `angular.json` and `package.json` into this folder, keeping `src/`.
