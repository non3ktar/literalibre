import { Link } from 'react-router-dom'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { PenLine } from 'lucide-react'
import { usePosts } from '../hooks/usePosts'
import { Button } from '../components/ui/Button'

export function DraftsPage() {
  const { posts, loading, error } = usePosts(false)
  const drafts = posts.filter((p) => !p.published)

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-serif text-3xl font-semibold text-balance">Rascunhos</h1>
        <Link to="/write">
          <Button variant="primary" size="sm">
            <PenLine size={16} aria-hidden />
            Novo
          </Button>
        </Link>
      </div>

      {error && (
        <p className="mb-4 rounded-lg border border-[hsl(0_50%_40%)] bg-[hsl(0_40%_15%)] px-4 py-3 text-sm">
          {error}
        </p>
      )}

      {loading ? (
        <div className="space-y-3 animate-pulse">
          {[1, 2].map((i) => (
            <div key={i} className="h-20 rounded-xl bg-[hsl(220_16%_12%)]" />
          ))}
        </div>
      ) : drafts.length === 0 ? (
        <p className="text-[hsl(220_12%_60%)]">Nenhum rascunho salvo.</p>
      ) : (
        <ul className="space-y-3">
          {drafts.map((post) => (
            <li key={post.id}>
              <Link
                to={`/write/${post.id}`}
                className="glass block rounded-xl px-5 py-4 hover:border-[hsl(195_60%_40%_/0.35)] transition-colors duration-150"
              >
                <span className="font-medium text-[hsl(220_15%_92%)]">
                  {post.title || 'Sem título'}
                </span>
                <time className="block mt-1 text-xs tabular-nums text-[hsl(220_10%_45%)]">
                  {format(new Date(post.updatedAt), "d MMM yyyy 'às' HH:mm", { locale: ptBR })}
                </time>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
