# Learn runtime coexistence

ASH-54 adds a stable `/learn/:lessonId` entry point at the application root. Vite's history fallback makes direct navigation and refresh work in development and production hosting. The route resolves lessons by canonical ID and renders the isolated `src/learn` runtime; all other paths continue through the unchanged legacy authentication and tactical timeline runtime.

Anonymous Learn use persists a versioned, lesson-scoped preview document in local storage. The `LearnProgressGateway` boundary mirrors the ASH-53 application contracts and is the temporary seam for an authenticated Supabase adapter. Explicit completion is the only completion path. The authenticated adapter persists attempts first, then calls `submit_lesson` with the latest answers; a linked parent's pass awards the cards ([ADR 005](decisions/005-parent-review.md)). Guests finish locally and earn no cards.

This coexistence strategy is intentionally reversible. Legacy content, progress, authentication, and entry points remain present until the Uruk slice is verified with authenticated infrastructure.
