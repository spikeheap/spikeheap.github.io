import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';

const POSTS_DIR = path.resolve(__dirname, '..', '..', 'src', '_posts');
const IMAGES_DIR = path.resolve(__dirname, '..', '..', 'src', 'images');

export interface Post {
  filename: string;
  date: string;
  slug: string;
  url: string;
  title: string;
  tags: string[];
}

// Jekyll only publishes posts whose filename matches `YYYY-MM-DD-`. Four
// underscore-prefixed files in src/_posts are intentionally unpublished by the
// current site and are skipped here.
const FILENAME_RE = /^(\d{4}-\d{2}-\d{2})-(.+)\.(?:md|markdown)$/;
const FRONTMATTER_DATE_RE = /^date:\s*(\d{4}-\d{2}-\d{2})/m;

let cache: Post[] | undefined;

export function loadPosts(): Post[] {
  if (cache) return cache;
  const files = fs.readdirSync(POSTS_DIR);
  const posts: Post[] = [];
  for (const file of files) {
    const m = file.match(FILENAME_RE);
    if (!m) continue;
    const [, filenameDate, slug] = m;
    const raw = fs.readFileSync(path.join(POSTS_DIR, file), 'utf8');
    const { data, content } = matter(raw);
    // The permalink date comes from frontmatter `date:` when present —
    // several posts override the filename date.
    const frontmatterDate = (content.match(FRONTMATTER_DATE_RE) ?? raw.match(FRONTMATTER_DATE_RE))?.[1];
    const date = frontmatterDate ?? filenameDate;
    posts.push({
      filename: file,
      date,
      slug,
      // Production canonical is no-trailing-slash for posts. The .html form
      // also serves and is what /sitemap.xml declares.
      url: `/posts/${date}-${slug}`,
      title: String(data.title ?? '').trim(),
      tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
    });
  }
  posts.sort((a, b) => a.date.localeCompare(b.date));
  cache = posts;
  return posts;
}

export function loadImageFilenames(): string[] {
  return fs.readdirSync(IMAGES_DIR).filter(f => !f.startsWith('.'));
}
