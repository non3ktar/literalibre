import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { ArrowLeft } from 'lucide-react'
import { getPostBySlug } from '../db'
import type { Post } from '../types'
import { MarkdownContent } from '../components/MarkdownContent'

export function PostPage() {
  const { slug } = useParams<{ slug: string }>()
  const [post, setPost] = useState<Post | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!slug) return

    async function load() {
      try {
        setLoading(true)
        setError(null)
        const data = await getPostBySlug(slug!)
        if (!data || !data.published) {
          setPost(null)
        } else {
          setPost(data)
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro ao carregar post')
      } finally {
        setLoading(false)
      }
    }

    void load()
  }, [slug])

  if (loading) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 animate-pulse space-y-4">
        <div className="h-4 w-24 rounded bg-[hsl(220_16%_14%)]" />
        <div className="h-12 w-full rounded bg-[hsl(220_16%_14%)]" />
        <div className="h-64 rounded bg-[hsl(220_16%_12%)]" />
      </div>
    )
  }

  if (error || !post) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 text-center space-y-4">
        <p className="text-[hsl(220_12%_65%)]">
          {error ?? 'Post não encontrado.'}
        </p>
        <Link to="/" className="text-[hsl(195_70%_65%)] hover:underline inline-flex items-center gap-2">
          <ArrowLeft size={16} /> Voltar ao blog
        </Link>
      </div>
    )
  }

  const date = format(new Date(post.createdAt), "d 'de' MMMM yyyy", { locale: ptBR })

  return (
    <article className="mx-auto max-w-2xl px-4 py-12 sm:px-6 sm:py-16">
      <Link
        to="/"
        className="mb-8 inline-flex items-center gap-2 text-sm text-[hsl(220_10%_50%)] hover:text-[hsl(195_70%_65%)] transition-colors duration-150"
      >
        <ArrowLeft size={16} aria-hidden />
        Voltar
      </Link>

      <header className="mb-10 space-y-4">
        <time className="text-sm tabular-nums text-[hsl(220_10%_50%)]">{date}</time>
        <h1 className="font-serif text-4xl sm:text-5xl font-semibold text-balance text-[hsl(220_15%_98%)]">
          {post.title}
        </h1>
        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-[hsl(195_60%_52%_/0.12)] px-2.5 py-0.5 text-xs text-[hsl(195_70%_70%)]"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </header>

      <MarkdownContent content={post.content} className="text-lg" />
    </article>
  )
}
