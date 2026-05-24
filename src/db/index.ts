import Dexie, { type Table } from 'dexie'
import type { Post, BlogSettings } from '../types'
import { DEFAULT_SETTINGS } from '../types'

export class FlowWriteDB extends Dexie {
  posts!: Table<Post, string>
  settings!: Table<BlogSettings & { id: string }, string>

  constructor() {
    super('FlowWriteDB')
    this.version(1).stores({
      posts: 'id, slug, published, updatedAt, createdAt',
      settings: 'id',
    })
  }
}

export const db = new FlowWriteDB()

const SETTINGS_KEY = 'main'

export async function getSettings(): Promise<BlogSettings> {
  const row = await db.settings.get(SETTINGS_KEY)
  return row ? { ...DEFAULT_SETTINGS, ...row } : { ...DEFAULT_SETTINGS }
}

export async function saveSettings(settings: BlogSettings): Promise<void> {
  await db.settings.put({ ...settings, id: SETTINGS_KEY })
}

export async function getAllPosts(): Promise<Post[]> {
  return db.posts.orderBy('updatedAt').reverse().toArray()
}

export async function getPublishedPosts(): Promise<Post[]> {
  const posts = await db.posts.toArray()
  return posts
    .filter((p) => p.published)
    .sort((a, b) => b.createdAt - a.createdAt)
}

export async function getPostBySlug(slug: string): Promise<Post | undefined> {
  return db.posts.where('slug').equals(slug).first()
}

export async function getPostById(id: string): Promise<Post | undefined> {
  return db.posts.get(id)
}

export async function savePost(post: Post): Promise<void> {
  await db.posts.put(post)
}

export async function deletePost(id: string): Promise<void> {
  await db.posts.delete(id)
}

export async function importPosts(posts: Post[], replace = false): Promise<void> {
  if (replace) {
    await db.posts.clear()
  }
  await db.posts.bulkPut(posts)
}

export async function syncStaticPosts(staticPosts: Post[]): Promise<void> {
  for (const post of staticPosts) {
    const existing = await db.posts.get(post.id)
    if (!existing) {
      await db.posts.put({ ...post, source: 'static' })
    }
  }
}

export async function loadStaticData(): Promise<{
  posts: Post[]
  settings?: BlogSettings
}> {
  try {
    const base = import.meta.env.BASE_URL
    const res = await fetch(`${base}data/site.json`)
    if (!res.ok) return { posts: [] }
    const data = await res.json()
    const posts: Post[] = (data.posts ?? []).map((p: Post) => ({
      ...p,
      source: 'static' as const,
      tags: p.tags ?? [],
    }))
    return { posts, settings: data.settings }
  } catch {
    return { posts: [] }
  }
}
