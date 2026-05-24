import type { Post, BlogSettings, SiteExport, ExportPost } from '../types'

function toExportPost(post: Post): ExportPost {
  const { source, ...rest } = post
  void source
  return rest
}

export function buildSiteExport(settings: BlogSettings, posts: Post[]): SiteExport {
  const published = posts.filter((p) => p.published).map(toExportPost)

  return {
    version: 1,
    exportedAt: Date.now(),
    settings,
    posts: published,
  }
}

export function downloadJson(filename: string, data: unknown): void {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = filename
  anchor.click()
  URL.revokeObjectURL(url)
}

export async function readJsonFile<T>(file: File): Promise<T> {
  const text = await file.text()
  return JSON.parse(text) as T
}
