# Learn runtime coexistence

ASH-54 adds a stable `/learn/:lessonId` entry point at the application root. Vite's history fallback makes direct navigation and refresh work in development and production hosting. The route resolves lessons by canonical ID and renders the isolated `src/learn` runtime; all other paths continue through the unchanged legacy authentication and tactical timeline runtime.

Anonymous Learn use persists a versioned, lesson-scoped preview document in local storage. The `LearnProgressGateway` boundary mirrors the ASH-53 application contracts and is the temporary seam for an authenticated Supabase adapter. Explicit completion is the only completion path. The production adapter must persist attempts first and invoke `complete_lesson_and_acquire_card`; it must never reproduce eligibility rules in the browser.

This coexistence strategy is intentionally reversible. Legacy content, progress, authentication, and entry points remain present until the Uruk slice is verified with authenticated infrastructure.
