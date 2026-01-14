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
To ensure instant loading and offline reliability, the app uses a modular static data structure organized by **eras** and **thematic units**.

*   **`staticContent.ts`**: The Content Aggregator. It auto-loads content modules from the `data/eras/` folder (via a Vite glob import) and exports one massive `STATIC_CONTENT` object.
*   **`data/eras/[era]/[unit].ts`**: Modular content files organized by era and learning unit.
    *   *Example*: `data/eras/foundations/egypt_kingdoms.ts` contains content for pyramids, pharaohs, etc.
    *   *Example*: `data/eras/classical/greece_golden_age.ts` covers Athens, Pericles, democracy, etc.
    *   *Philosophy*: Files represent thematic learning units (not civilizations), so content naturally groups by concept rather than geography.

### 3. UI Components
*   **`TimelineSidebar`**: The Navigation Rail. Handles Era grouping, Node selection, and the "Era Briefing" toggle.
*   **`NodeContentDisplay`**: The main view. Renders the "Tactical" UI:
    *   **Field Notes**: High-level summary.
    *   **Trading Cards**: Historical figures with "Dossier" stats (Born, Legacy, etc.).
    *   **Tech Blueprints**: Interactive cards for Inventions (Problem/Solution/Impact).
    *   **DetailOverlay**: The full-screen modal for deep reading.

## How to Add New History

To add content for a new thematic unit:

1.  **Check the Node IDs**: Open `constants.ts` and find the node IDs you want to cover (e.g., `alexander`, `pericles`, `socrates`).
2.  **Choose the Era Folder**: Navigate to `data/eras/[era]/` (e.g., `data/eras/classical/`).
3.  **Create or Edit a Unit File**: Create a new file or edit an existing one (e.g., `greece_golden_age.ts`, `philosophy_revolution.ts`).
4.  **Write Content**:
    ```typescript
    import { NodeContent } from '../../../types';

    export const MY_UNIT_NAME: Record<string, NodeContent> = {
      'alexander': {
        summary: "...",
        people: [ ... ],
        inventions: [ ... ],
        resources: [
          {
            title: "Video Title",
            type: "Video",
            url: "https://www.youtube.com/watch?v=VIDEO_ID?rel=0",  // Note: ?rel=0 required for YouTube URLs
            isCore: true,
            description: "Video description"
          }
        ],
        funFact: "...",
        places: [ ... ]
        // ... see types.ts for schema
      }
    }
    ```
5.  **Done**: Nothing to register—any `Record<nodeId, NodeContent>` exported from a file under `data/eras/` is auto-loaded into `STATIC_CONTENT`.

**Important**: All YouTube video URLs must include `?rel=0` appended to the URL. This limits video suggestions to the current channel, preventing unrelated content from appearing—critical for kid-friendly content.
