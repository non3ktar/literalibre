import { Link } from 'react-router-dom'
import { useSettings } from '../hooks/useSettings'
import { usePosts } from '../hooks/usePosts'
import { PostCard } from '../components/PostCard'

export function HomePage() {
  const { settings, loading: settingsLoading } = useSettings()
  const { posts, loading, error } = usePosts(true)

  if (settingsLoading || loading) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <div className="space-y-4 animate-pulse">
          <div className="h-10 w-2/3 rounded-lg bg-[hsl(220_16%_14%)]" />
          <div className="h-5 w-full rounded bg-[hsl(220_16%_12%)]" />
          <div className="h-32 rounded-2xl bg-[hsl(220_16%_12%)]" />
          <div className="h-32 rounded-2xl bg-[hsl(220_16%_12%)]" />
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
      <header className="mb-12 space-y-4 text-center">
        <h1 className="font-serif text-4xl sm:text-5xl font-semibold text-balance text-[hsl(220_15%_98%)]">
          {settings.title}
        </h1>
        {settings.subtitle && (
          <p className="text-pretty text-lg text-[hsl(220_12%_60%)] max-w-xl mx-auto">
            {settings.subtitle}
          </p>
        )}
        {settings.author && (
          <p className="text-sm text-[hsl(220_10%_50%)]">
            por <span className="text-[hsl(220_15%_80%)]">{settings.author}</span>
          </p>
        )}
      </header>

      {error && (
        <p className="mb-6 rounded-lg border border-[hsl(0_50%_40%)] bg-[hsl(0_40%_15%)] px-4 py-3 text-sm text-[hsl(0_70%_80%)]">
          {error}
        </p>
      )}

      {posts.length === 0 ? (
        <div className="glass rounded-2xl p-10 text-center space-y-4">
          <p className="text-[hsl(220_12%_65%)]">Nenhum post publicado ainda.</p>
          <Link
            to="/write"
            className="inline-block text-[hsl(195_70%_65%)] hover:underline"
          >
            Escreva seu primeiro post →
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  )
}
