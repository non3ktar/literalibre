export interface Post {
  id: string
  slug: string
  title: string
  content: string
  excerpt?: string
  published: boolean
  createdAt: number
  updatedAt: number
  tags: string[]
  source: 'static' | 'local'
}

export interface BlogSettings {
  title: string
  subtitle: string
  author: string
  bio: string
  language: string
  postsPerPage: number
}

export const DEFAULT_SETTINGS: BlogSettings = {
  title: 'LiteraLibre',
  subtitle: 'Um blog minimalista, sem distrações.',
  author: 'Você',
  bio: 'Escreva, publique e compartilhe suas ideias.',
  language: 'pt-BR',
  postsPerPage: 10,
}

export type ExportPost = Omit<Post, 'source'>

export interface SiteExport {
  version: 1
  exportedAt: number
  settings: BlogSettings
  posts: ExportPost[]
}
