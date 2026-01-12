# Chronos Learning Terminal

## Mission Profile
Chronos is a gamified, "tactical" educational timeline designed for homeschool students (approx. ages 10-14). It moves away from dry textbook lists, presenting history instead as a **"Mission Log"** of eras and events (nodes) to be decrypted and explored.

The UI mimics a high-tech "archive" or "time machine" interface using dark mode, neon accents, and grid layouts to appeal to the "gaming" aesthetic while delivering rigorous historical depth.

## System Architecture

### 1. Core Logic
*   **`App.tsx`**: Main controller. Handles the "Split View" logic (Sidebar vs. Content) and mobile responsiveness.
*   **`constants.ts`**: **The Backbone**. Defines the 10 distinct Eras and the master list of Timeline Nodes (Stubs). This is the "Skeleton" of history.
*   **`types.ts`**: TypeScript interfaces ensuring data consistency (People, Inventions, Place Lore, Resources).

### 2. Data Strategy (Static & Offline)
To ensure instant loading and offline reliability, the app uses a modular static data structure.
*   **`staticContent.ts`**: The Central Registry. It imports data shards from the `data/` folder and exports one massive `STATIC_CONTENT` object.
*   **`data/[era]/[region].ts`**: Modular content files.
    *   *Example*: `data/foundations/egypt.ts` contains the deep dives for Pyramids, Narmer, etc.
    *   *Status*: Currently, only `prelude` and `foundations` folders are populated.

### 3. UI Components
*   **`TimelineSidebar`**: The Navigation Rail. Handles Era grouping, Node selection, and the "Era Briefing" toggle.
*   **`NodeContentDisplay`**: The main view. Renders the "Tactical" UI:
    *   **Field Notes**: High-level summary.
    *   **Trading Cards**: Historical figures with "Dossier" stats (Born, Legacy, etc.).
    *   **Tech Blueprints**: Interactive cards for Inventions (Problem/Solution/Impact).
    *   **DetailOverlay**: The full-screen modal for deep reading.

## How to Add New History

To add content for a new Era (e.g., Classical Antiquity):

1.  **Check the ID**: Open `constants.ts` and find the node ID (e.g., `alexander`).
2.  **Create Data File**: Create `src/data/classical/greece.ts`.
3.  **Write Content**:
    ```typescript
    export const CLASSICAL_GREECE = {
      'alexander': {
        summary: "...",
        people: [ ... ],
        inventions: [ ... ],
        // ... see types.ts for schema
      }
    }
    ```
4.  **Register**: Import and spread this object into `src/staticContent.ts`.
