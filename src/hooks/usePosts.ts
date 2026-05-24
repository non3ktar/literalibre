import { useCallback, useEffect, useState } from 'react'
import {
  getAllPosts,
  getPublishedPosts,
  loadStaticData,
  syncStaticPosts,
} from '../db'
import type { Post } from '../types'

export function usePosts(publishedOnly = false) {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refresh = useCallback(async () => {
    try {
      setError(null)
      const data = publishedOnly ? await getPublishedPosts() : await getAllPosts()
      setPosts(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar posts')
    } finally {
      setLoading(false)
    }
  }, [publishedOnly])

  useEffect(() => {
    let cancelled = false

    async function init() {
      try {
        const { posts: staticPosts } = await loadStaticData()
        if (staticPosts.length > 0) {
          await syncStaticPosts(staticPosts)
        }
        if (!cancelled) await refresh()
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Erro ao inicializar')
          setLoading(false)
        }
      }
    }

    void init()

    return () => {
      cancelled = true
    }
  }, [refresh])

  return { posts, loading, error, refresh }
}
