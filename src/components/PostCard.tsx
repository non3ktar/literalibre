import { Link } from 'react-router-dom'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import type { Post } from '../types'
import { excerptFromMarkdown } from '../lib/markdown'
import { cn } from '../lib/cn'

interface PostCardProps {
  post: Post
}

export function PostCard({ post }: PostCardProps) {
  const excerpt = post.excerpt || excerptFromMarkdown(post.content)
  const date = format(new Date(post.createdAt), "d 'de' MMMM yyyy", { locale: ptBR })

  return (
    <article
      className={cn(
        'group glass rounded-2xl p-6 transition-colors duration-150',
        'hover:border-[hsl(195_60%_40%_/0.35)]'
      )}
    >
      <Link to={`/p/${post.slug}`} className="block space-y-3">
        <time className="text-xs font-medium tabular-nums text-[hsl(220_10%_50%)]">
          {date}
        </time>
        <h2 className="font-serif text-2xl font-semibold text-balance text-[hsl(220_15%_96%)] group-hover:text-[hsl(195_70%_75%)] transition-colors duration-150">
          {post.title}
        </h2>
        <p className="text-pretty text-[hsl(220_12%_65%)] leading-relaxed line-clamp-3">
          {excerpt}
        </p>
        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-1">
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
      </Link>
    </article>
  )
}
