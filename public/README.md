# Public Assets Directory

This directory contains static assets that are served at the root path by Vite.

## Image Organization

Place images in the following structure:

```
public/
  images/
    foundations/     # Images for the Foundations era
    inventions/      # Images for inventions/technologies
    places/          # Images for historical places
    classical/       # Images for the Classical era
    dawn_of_civilization/  # Images for dawn of civilization content
```

## Usage in Content Files

When adding images to your content data files, use paths starting with `/`:

```typescript
{
  name: "Bronze Smith",
  imageUrl: "/images/foundations/bronze_smith.jpg"
}
```

**Important**: 
- Paths starting with `/` are automatically served from this `public/` folder
- External URLs (starting with `http://` or `https://`) work as-is
- The image utility (`utils/imageUtils.ts`) handles both local and external URLs automatically

## Examples

- Local image: `/images/foundations/bronze_smith.jpg` → `public/images/foundations/bronze_smith.jpg`
- External URL: `https://example.com/image.jpg` → Used as-is

## File Naming Conventions

- Use lowercase with underscores: `bronze_smith.jpg`
- Be descriptive but concise
- Use appropriate file extensions (`.jpg`, `.png`, `.webp`, etc.)
