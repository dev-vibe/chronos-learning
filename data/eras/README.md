# Content Organization

Content is now organized to match the product UX flow:

`Era -> Era intro -> Lesson -> Lesson content sections`

## Structure

```txt
data/
  lessonMetadata.ts            # Lookup for lesson timeline metadata
  lessonFactory.ts             # Helper to build lesson objects from legacy exports
  lessonObjects.ts             # Runtime lesson index
  eras/
    <era>/
      lessons/
        <lessonId>.ts          # One file per lesson (exports LESSON)
      *.ts                     # Legacy thematic source files (still supported)
```

Each lesson file exports a semantic lesson object:

```ts
export const LESSON: LessonFile = {
  metadata: { id, title, year, eraId, region, tags },
  content: { summary, people, inventions, places, resources, funFact, quiz? },
};
```

## Why this layout

- Findability: lesson ID maps directly to a filename.
- UX alignment: authoring structure mirrors timeline navigation.
- Incremental migration: legacy thematic files continue to work while lessons move to per-lesson files.

## Authoring

1. Find lesson file by ID in `data/eras/<era>/lessons/<lessonId>.ts`.
2. Edit the `LESSON` object (or legacy source referenced by wrapper during migration).
3. Content is auto-indexed by `data/lessonObjects.ts`.

No central manual registry is required.
