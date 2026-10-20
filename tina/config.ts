import { defineConfig } from 'tinacms';

// Branch Tina reads/writes. Cloudflare Pages exposes CF_PAGES_BRANCH.
const branch =
  process.env.GITHUB_BRANCH || process.env.CF_PAGES_BRANCH || process.env.HEAD || 'main';

export default defineConfig({
  branch,
  clientId: process.env.NEXT_PUBLIC_TINA_CLIENT_ID || '', // from Tina Cloud project
  token: process.env.TINA_TOKEN || '', // from Tina Cloud (read-only token)

  // The admin SPA is built into dist/admin so the live site serves /admin/.
  build: { outputFolder: 'admin', publicFolder: 'dist' },

  // Uploaded images are committed to assets/images/ (same folder the site uses).
  media: { tina: { mediaRoot: 'assets/images', publicFolder: '' } },

  schema: {
    collections: [
      {
        name: 'highlight',
        label: 'Company Highlights',
        path: 'content/highlights',
        format: 'md',
        ui: {
          filename: {
            // New article => file named after the title (becomes the URL slug).
            slugify: (values: { title?: string }) =>
              (values?.title || 'untitled')
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/(^-|-$)/g, ''),
          },
        },
        fields: [
          { type: 'string', name: 'title', label: 'Title', isTitle: true, required: true },
          {
            type: 'string',
            name: 'category',
            label: 'Category',
            options: ['Events', 'Awards', 'Partnerships', 'Community', 'Milestones', 'News'],
          },
          {
            type: 'datetime',
            name: 'date',
            label: 'Date',
            required: true,
            ui: { dateFormat: 'YYYY-MM-DD' },
          },
          {
            type: 'string',
            name: 'excerpt',
            label: 'Short summary (shown on the card)',
            ui: { component: 'textarea' },
          },
          { type: 'image', name: 'image', label: 'Thumbnail / header image' },
          {
            type: 'boolean',
            name: 'featured',
            label: 'Featured — show as the large top article',
          },
          { type: 'rich-text', name: 'body', label: 'Article body', isBody: true },
        ],
      },
    ],
  },
});
