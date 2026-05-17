import fs from "fs";
import path from "path";
import matter from "gray-matter";

const contentDir = path.join(process.cwd(), "content");

export type ProjectStatus = "completed" | "active" | "in-progress";

export interface ProjectFrontmatter {
  title: string;
  slug: string;
  description: string;
  tags: string[];
  date: string;
  github?: string;
  pubdev?: string;
  status: ProjectStatus;
  featured: boolean;
  cover?: string;
}

export interface BlogFrontmatter {
  title: string;
  slug: string;
  description: string;
  date: string;
  tags: string[];
  cover?: string;
}

export interface AboutFrontmatter {
  name: string;
  nickname: string;
  role: string;
  company: string;
  location: string;
  available: boolean;
  github: string;
  facebook: string;
  email: string;
}

export interface ContentFile<T> {
  frontmatter: T;
  content: string;
}

function normalizeDate(value: unknown): string {
  if (value instanceof Date) return value.toISOString().slice(0, 10);
  return String(value);
}

function readMarkdown(filePath: string): { data: Record<string, unknown>; content: string } {
  const raw = fs.readFileSync(filePath, "utf8");
  const parsed = matter(raw);
  return { data: parsed.data, content: parsed.content };
}

export function getProjects(): ContentFile<ProjectFrontmatter>[] {
  const dir = path.join(contentDir, "projects");
  const files = fs.readdirSync(dir).filter((f) => f.endsWith(".md"));
  return files
    .map((file) => {
      const { data, content } = readMarkdown(path.join(dir, file));
      const frontmatter: ProjectFrontmatter = {
        title: String(data.title),
        slug: String(data.slug),
        description: String(data.description),
        tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
        date: normalizeDate(data.date),
        github: data.github ? String(data.github) : undefined,
        pubdev: data.pubdev ? String(data.pubdev) : undefined,
        status: (data.status as ProjectStatus) ?? "completed",
        featured: Boolean(data.featured),
        cover: data.cover ? String(data.cover) : undefined,
      };
      return { frontmatter, content };
    })
    .sort(
      (a, b) =>
        new Date(b.frontmatter.date).getTime() -
        new Date(a.frontmatter.date).getTime(),
    );
}

export function getProject(slug: string): ContentFile<ProjectFrontmatter> {
  const file = path.join(contentDir, "projects", `${slug}.md`);
  const { data, content } = readMarkdown(file);
  const frontmatter: ProjectFrontmatter = {
    title: String(data.title),
    slug: String(data.slug),
    description: String(data.description),
    tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
    date: normalizeDate(data.date),
    github: data.github ? String(data.github) : undefined,
    pubdev: data.pubdev ? String(data.pubdev) : undefined,
    status: (data.status as ProjectStatus) ?? "completed",
    featured: Boolean(data.featured),
    cover: data.cover ? String(data.cover) : undefined,
  };
  return { frontmatter, content };
}

export function getBlogPosts(): ContentFile<BlogFrontmatter>[] {
  const dir = path.join(contentDir, "blog");
  const files = fs.readdirSync(dir).filter((f) => f.endsWith(".md"));
  return files
    .map((file) => {
      const { data, content } = readMarkdown(path.join(dir, file));
      const frontmatter: BlogFrontmatter = {
        title: String(data.title),
        slug: String(data.slug),
        description: String(data.description),
        date: normalizeDate(data.date),
        tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
        cover: data.cover ? String(data.cover) : undefined,
      };
      return { frontmatter, content };
    })
    .sort(
      (a, b) =>
        new Date(b.frontmatter.date).getTime() -
        new Date(a.frontmatter.date).getTime(),
    );
}

export function getBlogPost(slug: string): ContentFile<BlogFrontmatter> {
  const file = path.join(contentDir, "blog", `${slug}.md`);
  const { data, content } = readMarkdown(file);
  const frontmatter: BlogFrontmatter = {
    title: String(data.title),
    slug: String(data.slug),
    description: String(data.description),
    date: normalizeDate(data.date),
    tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
    cover: data.cover ? String(data.cover) : undefined,
  };
  return { frontmatter, content };
}

export function getAbout(): ContentFile<AboutFrontmatter> {
  const file = path.join(contentDir, "about.md");
  const { data, content } = readMarkdown(file);
  const frontmatter: AboutFrontmatter = {
    name: String(data.name),
    nickname: String(data.nickname),
    role: String(data.role),
    company: String(data.company),
    location: String(data.location),
    available: Boolean(data.available),
    github: String(data.github),
    facebook: String(data.facebook),
    email: String(data.email),
  };
  return { frontmatter, content };
}

export interface TocHeading {
  id: string;
  text: string;
  level: number;
}

export function extractHeadings(content: string): TocHeading[] {
  const headings: TocHeading[] = [];
  const headingRegex = /^(#{2,3})\s+(.+)$/gm;
  let match;

  while ((match = headingRegex.exec(content)) !== null) {
    const level = match[1].length;
    const text = match[2].trim();
    const id = text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
    headings.push({ id, text, level });
  }

  return headings;
}
