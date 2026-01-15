# AI Agent Onboarding Guide

This guide helps AI agents understand and modify this personal website. The site is built with **Astro** and **Tailwind CSS**, and is deployed to GitHub Pages.

---

## Quick Reference

| Task | File(s) to Edit |
|------|-----------------|
| Change name, bio, social links | `src/data/author.json` |
| Add/edit projects | `src/content/projects/*.md` |
| Add/edit publications | `src/content/publications/*.md` |
| **Convert BibTeX to publications** | Run `pnpm run bib2md file.bib` |
| Change colors/theme | `src/styles/global.css` |
| Edit homepage layout | `src/pages/index.astro` |
| Edit header/navigation | `src/components/Header.astro` |
| Edit footer | `src/components/Footer.astro` |
| Add new pages | Create file in `src/pages/` |

---

## Project Structure

```
├── src/
│   ├── components/        # Reusable UI components
│   │   ├── Header.astro   # Site header and navigation
│   │   ├── Footer.astro   # Site footer
│   │   └── SocialLinks.astro  # Social media icons/links
│   │
│   ├── content/           # Markdown content (projects, publications)
│   │   ├── config.ts      # Content schema definitions
│   │   ├── projects/      # Project markdown files
│   │   └── publications/  # Publication markdown files
│   │
│   ├── data/
│   │   └── author.json    # Personal info (name, bio, links)
│   │
│   ├── layouts/
│   │   └── Base.astro     # Base HTML template for all pages
│   │
│   ├── pages/             # Site pages (each file = a route)
│   │   ├── index.astro    # Homepage (/)
│   │   ├── experience.astro   # Experience page (/experience)
│   │   ├── publications.astro # Publications page (/publications)
│   │   └── projects/      # Projects section
│   │       ├── index.astro    # Projects list (/projects)
│   │       └── [slug].astro   # Individual project pages
│   │
│   └── styles/
│       └── global.css     # Global styles and CSS variables
│
├── public/                # Static assets (images, favicon, etc.)
├── astro.config.mjs       # Astro configuration
└── package.json           # Dependencies and scripts
```

---

## Common Customization Tasks

### 1. Change Personal Information

Edit `src/data/author.json`:

```json
{
  "name": "Your Name",
  "title": "Your Title/Role",
  "bio": "A short bio about yourself...",
  "email": "your@email.com",
  "location": "Your City, Country",
  "social": {
    "github": "https://github.com/yourusername",
    "linkedin": "https://linkedin.com/in/yourusername",
    "twitter": "https://twitter.com/yourusername",
    "googleScholar": "https://scholar.google.com/..."
  }
}
```

### 2. Add a New Project

Create a new `.md` file in `src/content/projects/`:

```markdown
---
title: "Project Title"
description: "A brief description of the project"
date: 2024-01-15
tags: ["tag1", "tag2"]
github: "https://github.com/..."
demo: "https://demo-link.com"
image: "/images/project-image.png"
featured: true
---

Write the full project description here using Markdown.

## Features
- Feature 1
- Feature 2

## Technologies Used
- Tech 1
- Tech 2
```

### 3. Add a New Publication

Create a new `.md` file in `src/content/publications/`:

```markdown
---
title: "Publication Title"
authors: ["Author 1", "Author 2", "Your Name"]
venue: "Conference or Journal Name"
year: 2024
date: 2024-01-15
doi: "10.1000/example"
arxiv: "2401.00000"
pdf: "/papers/paper.pdf"
abstract: "Paper abstract goes here..."
---

Optional additional content about the publication.
```

### 3b. Convert BibTeX to Markdown (Recommended)

If the user provides a BibTeX file (`.bib`) or BibTeX entries, use the built-in converter:

**Option A: User has a `.bib` file**

1. Ask the user to place the `.bib` file in the project folder
2. Run the conversion command:
   ```bash
   pnpm run bib2md path/to/file.bib
   ```
3. This creates markdown files in `src/content/publications/`

**Option B: User provides BibTeX text directly**

1. Create a temporary `.bib` file with the content:
   ```bash
   # Create the file with the BibTeX content
   cat > temp-refs.bib << 'EOF'
   @inproceedings{key2024paper,
     title={Paper Title},
     author={Last, First and Other, Author},
     booktitle={Conference Name},
     year={2024}
   }
   EOF
   ```

2. Run the converter:
   ```bash
   pnpm run bib2md temp-refs.bib
   ```

3. Delete the temporary file:
   ```bash
   rm temp-refs.bib
   ```

**BibTeX fields that are converted:**

| BibTeX Field | Markdown Field |
|--------------|----------------|
| `title` | `title` |
| `author` | `authors` (converted to array) |
| `booktitle` or `journal` | `venue` |
| `year` | `year` and `date` |
| `doi` | `doi` |
| `eprint` or `arxiv` | `arxiv` |
| `url` | `url` |
| `abstract` | Content body |

**Example conversion:**

Input BibTeX:
```bibtex
@inproceedings{smith2024emotion,
  title={Emotion Recognition via Graph Networks},
  author={Smith, John and Doe, Jane},
  booktitle={CVPR},
  year={2024},
  doi={10.1109/CVPR.2024.12345}
}
```

Output `smith2024emotion.md`:
```markdown
---
title: "Emotion Recognition via Graph Networks"
authors:
  - "John Smith"
  - "Jane Doe"
venue: "CVPR"
year: 2024
date: 2024-01-01
type: "conference"
doi: "10.1109/CVPR.2024.12345"
---
```

### 4. Change Colors and Theme

Edit CSS variables in `src/styles/global.css`:

```css
:root {
  /* Background colors */
  --bg-primary: #ffffff;
  --bg-secondary: #f5f5f5;
  
  /* Text colors */
  --text-primary: #1a1a1a;
  --text-secondary: #666666;
  
  /* Accent color (links, buttons, highlights) */
  --accent: #3b82f6;
  --accent-hover: #2563eb;
}

/* Dark mode colors */
@media (prefers-color-scheme: dark) {
  :root {
    --bg-primary: #1a1a1a;
    --bg-secondary: #2a2a2a;
    --text-primary: #ffffff;
    --text-secondary: #a0a0a0;
  }
}
```

### 5. Modify the Homepage

Edit `src/pages/index.astro`. The file has two sections:
- **Frontmatter** (between `---`): JavaScript/imports
- **Template**: HTML structure with Astro/Tailwind classes

### 6. Add a New Page

Create a new `.astro` file in `src/pages/`. Example for `/about`:

```astro
---
import Base from '../layouts/Base.astro';
import author from '../data/author.json';
---

<Base title={`About - ${author.name}`}>
  <section class="py-16">
    <h1 class="text-4xl font-bold mb-8">About Me</h1>
    <p>Your content here...</p>
  </section>
</Base>
```

Then add a link to it in `src/components/Header.astro`.

### 7. Change Navigation Links

Edit `src/components/Header.astro` and find the navigation links array or HTML.

### 8. Add Images

1. Place images in the `public/` folder (e.g., `public/images/photo.jpg`)
2. Reference them with absolute paths: `/images/photo.jpg`

---

## Design System

### Tailwind CSS Classes

This site uses Tailwind CSS. Common patterns:

- **Spacing**: `p-4` (padding), `m-4` (margin), `py-8` (vertical padding)
- **Text**: `text-lg`, `text-xl`, `font-bold`, `text-center`
- **Colors**: `text-[var(--text-primary)]`, `bg-[var(--bg-secondary)]`
- **Flexbox**: `flex`, `items-center`, `justify-between`, `gap-4`
- **Grid**: `grid`, `grid-cols-2`, `md:grid-cols-3`
- **Responsive**: `md:` prefix for tablet+, `lg:` for desktop+

### CSS Variables

Use CSS variables for consistent theming:
- `var(--text-primary)` - Main text color
- `var(--text-secondary)` - Muted text color
- `var(--bg-primary)` - Main background
- `var(--bg-secondary)` - Card/section backgrounds
- `var(--accent)` - Links and highlights

---

## Development Commands

Run these in the terminal:

```bash
# Install dependencies (first time only)
pnpm install

# Start development server (preview changes locally)
pnpm dev

# Build for production
pnpm build

# Preview production build
pnpm preview
```

---

## Deployment

This site auto-deploys to GitHub Pages when changes are pushed to the `main` branch.

**To deploy changes:**
1. Make your edits
2. Run these commands:
   ```bash
   git add -A
   git commit -m "Description of changes"
   git push
   ```
3. Wait 1-2 minutes for GitHub Actions to build and deploy
4. Site will be live at `https://USERNAME.github.io`

---

## Content Schema Reference

Check `src/content/config.ts` for the exact fields required/optional for projects and publications.

---

## Troubleshooting

### Build Errors
- Check import paths are correct (use `../../` to go up directories)
- Ensure all required frontmatter fields are present in markdown files
- Run `pnpm build` locally to test before pushing

### Styles Not Applying
- Tailwind classes must be complete strings (not concatenated dynamically)
- Custom colors should use CSS variables defined in `global.css`

### Images Not Showing
- Images in `public/` are referenced with `/` prefix: `/images/photo.jpg`
- Check file extensions match exactly (case-sensitive)

---

## Tips for AI Agents

1. **Always read the relevant file first** before making changes
2. **Test locally** with `pnpm dev` when possible
3. **Use CSS variables** for colors to maintain theme consistency
4. **Follow existing patterns** in the codebase for consistency
5. **Check `src/content/config.ts`** for required markdown frontmatter fields
6. **Commit frequently** with descriptive messages
