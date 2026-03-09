# Content Editing Guide

This site now uses a code-authored content layer in `src/content/`.

## Where to edit

- `src/content/site.ts`: owner info, footer tagline, global social links
- `src/content/navigation.ts`: top navigation labels, colors, and routes
- `src/content/projects.ts`: project cards and projects page header copy
- `src/content/landing.ts`: landing story sections and landing CTA/conclusion copy
- `src/content/about.ts`: about page intro and timeline scenes
- `src/content/blog.ts`: blog list items and blog page intro copy
- `src/content/contact.ts`: contact page copy and social feed cards
- `src/content/visuals.ts`: page-level background effects and visual presets

## Validation flow

Run these before deployment:

```bash
npm run typecheck
npm run build
```

Content validation runs automatically when the app imports `src/content/index.ts`.

## Add a new project

Copy one existing object in `src/content/projects.ts` and update the fields.

```ts
defineProject({
  id: "new-project-id",
  title: "New Project",
  subtitle: "Short descriptor",
  summary: "One sentence for cards and lists.",
  details: "Longer detail paragraph for overlays and deep dives.",
  tags: ["React", "Three.js"],
  accent: "#22c55e",
  palette: { deep: "#052e16", mid: "#16a34a", bright: "#dcfce7", line: "#f0fdf4" },
  media: ["data:image/svg+xml;utf8,..."],
  links: [{ label: "Live", href: "https://example.com" }],
  front: {
    dateLabel: "2026",
    status: "Active",
    frontFamily: "lattice",
    popoutPreset: "nodeConstellation",
    popoutIntensity: 1,
  },
})
```

## Add a new blog post seed

Add an entry in `src/content/blog.ts`.

```ts
defineBlogPost({
  id: "new-post-id",
  slug: "new-post-slug",
  title: "New Post Title",
  tag: "Research",
  summary: "Short summary for the list page.",
  dateLabel: "Mar 2026",
  publishedAt: "2026-03-01",
  status: "published",
})
```

## Add a new timeline scene

Add an entry in `src/content/about.ts`.

```ts
defineTimelineScene({
  id: "new-era",
  year: "2026",
  title: "New Era",
  summary: "What changed in this chapter.",
  foreground: "#38bdf8",
  midground: "#a78bfa",
  background: "#eff6ff",
  detail: {
    kicker: "New Chapter",
    body: "Longer descriptive text.",
    studioNote: "Focus: systems and iteration.",
    assetLabel: "Stage Asset",
    assetGradient: "linear-gradient(...)",
  },
  nowActions: [{ label: "View Projects", path: "/projects" }],
})
```

## Add a social/contact card

Add an item to `contactPageContent.socialPosts` in `src/content/contact.ts`.

```ts
{
  id: "new-social-post",
  platform: "X",
  handle: "@handle",
  publishedLabel: "Today",
  title: "Update title",
  excerpt: "Short excerpt.",
  href: "https://example.com",
  accentClassName: "bg-slate-800",
}
```

## Notes

- Keep IDs unique.
- Internal paths must point to valid routes like `/projects`, `/about`, `/blog`, `/contact`, or `/origin`.
- Prefer editing content files, not page components, when changing copy or structured data.
