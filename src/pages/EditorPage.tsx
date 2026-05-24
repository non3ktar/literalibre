import { useCallback, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import * as Tabs from '@radix-ui/react-tabs'
import { Eye, Save, Send, Trash2 } from 'lucide-react'
import {
  deletePost,
  getAllPosts,
  getPostById,
  savePost,
} from '../db'
import type { Post } from '../types'
import { uniqueSlug } from '../lib/slug'
import { excerptFromMarkdown } from '../lib/markdown'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { Textarea } from '../components/ui/Textarea'
import { MarkdownContent } from '../components/MarkdownContent'
import * as AlertDialog from '@radix-ui/react-alert-dialog'

function newPost(): Post {
  const now = Date.now()
  return {
    id: crypto.randomUUID(),
    slug: '',
    title: '',
    content: '',
    published: false,
    createdAt: now,
    updatedAt: now,
    tags: [],
    source: 'local',
  }
}

export function EditorPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [post, setPost] = useState<Post>(newPost())
  const [tagsInput, setTagsInput] = useState('')
  const [loading, setLoading] = useState(!!id)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return

    async function load() {
      try {
        const data = await getPostById(id!)
        if (data) {
          setPost(data)
          setTagsInput(data.tags.join(', '))
        } else {
          setError('Post não encontrado')
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro ao carregar')
      } finally {
        setLoading(false)
      }
    }

    void load()
  }, [id])

  const persist = useCallback(
    async (publish: boolean) => {
      if (!post.title.trim()) {
        setError('O título é obrigatório')
        return
      }
      if (!post.content.trim()) {
        setError('O conteúdo é obrigatório')
        return
      }

      try {
        setSaving(true)
        setError(null)
        setSuccess(null)

        const all = await getAllPosts()
        const slugs = all.filter((p) => p.id !== post.id).map((p) => p.slug)
        const slug = post.slug || uniqueSlug(post.title, slugs)
        const tags = tagsInput
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean)

        const updated: Post = {
          ...post,
          slug,
          tags,
          published: publish ? true : post.published,
          excerpt: excerptFromMarkdown(post.content),
          updatedAt: Date.now(),
          source: 'local',
        }

        await savePost(updated)
        setPost(updated)
        setSuccess(publish ? 'Post publicado!' : 'Rascunho salvo!')

        if (publish) {
          navigate(`/p/${updated.slug}`)
        } else if (!id) {
          navigate(`/write/${updated.id}`, { replace: true })
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro ao salvar')
      } finally {
        setSaving(false)
      }
    },
    [post, tagsInput, id, navigate]
  )

  const handleDelete = async () => {
    try {
      await deletePost(post.id)
      navigate('/drafts')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao excluir')
    }
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 animate-pulse space-y-4">
        <div className="h-10 rounded bg-[hsl(220_16%_14%)]" />
        <div className="h-64 rounded bg-[hsl(220_16%_12%)]" />
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-12">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-serif text-2xl font-semibold text-balance">
          {id ? 'Editar post' : 'Novo post'}
        </h1>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => void persist(false)}
            disabled={saving}
          >
            <Save size={16} aria-hidden />
            Salvar rascunho
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => void persist(true)}
            disabled={saving}
          >
            <Send size={16} aria-hidden />
            Publicar
          </Button>
        </div>
      </div>

      {error && (
        <p className="mb-4 rounded-lg border border-[hsl(0_50%_40%)] bg-[hsl(0_40%_15%)] px-4 py-3 text-sm">
          {error}
        </p>
      )}
      {success && (
        <p className="mb-4 rounded-lg border border-[hsl(150_40%_30%)] bg-[hsl(150_30%_12%)] px-4 py-3 text-sm text-[hsl(150_60%_75%)]">
          {success}
        </p>
      )}

      <div className="space-y-4 mb-6">
        <Input
          placeholder="Título do post"
          value={post.title}
          onChange={(e) => setPost((p) => ({ ...p, title: e.target.value }))}
          className="text-xl font-medium border-0 border-b rounded-none px-0 bg-transparent focus:ring-0"
          aria-label="Título"
        />
        <Input
          placeholder="Tags separadas por vírgula (ex: educação, reflexões)"
          value={tagsInput}
          onChange={(e) => setTagsInput(e.target.value)}
          aria-label="Tags"
        />
      </div>

      <Tabs.Root defaultValue="write" className="space-y-4">
        <Tabs.List className="flex gap-1 rounded-lg bg-[hsl(220_16%_12%)] p-1 w-fit">
          <Tabs.Trigger
            value="write"
            className="rounded-md px-4 py-2 text-sm data-[state=active]:bg-[hsl(220_16%_18%)] data-[state=active]:text-[hsl(220_15%_95%)] text-[hsl(220_12%_55%)]"
          >
            Escrever
          </Tabs.Trigger>
          <Tabs.Trigger
            value="preview"
            className="rounded-md px-4 py-2 text-sm inline-flex items-center gap-1.5 data-[state=active]:bg-[hsl(220_16%_18%)] data-[state=active]:text-[hsl(220_15%_95%)] text-[hsl(220_12%_55%)]"
          >
            <Eye size={14} aria-hidden />
            Prévia
          </Tabs.Trigger>
        </Tabs.List>

        <Tabs.Content value="write">
          <Textarea
            placeholder="Escreva em Markdown…"
            value={post.content}
            onChange={(e) => setPost((p) => ({ ...p, content: e.target.value }))}
            className="min-h-[50dvh] font-mono text-base leading-relaxed border-0 rounded-xl glass"
            aria-label="Conteúdo em Markdown"
          />
          <p className="mt-2 text-xs text-[hsl(220_10%_45%)]">
            Suporta **negrito**, *itálico*, # títulos, listas, links e blocos de código.
          </p>
        </Tabs.Content>

        <Tabs.Content value="preview" className="glass rounded-2xl p-6 sm:p-8 min-h-[40dvh]">
          {post.content.trim() ? (
            <MarkdownContent content={post.content} />
          ) : (
            <p className="text-[hsl(220_10%_45%)]">Nada para pré-visualizar ainda.</p>
          )}
        </Tabs.Content>
      </Tabs.Root>

      {id && (
        <div className="mt-10 pt-6 border-t border-[hsl(220_14%_18%)]">
          <AlertDialog.Root>
            <AlertDialog.Trigger asChild>
              <Button variant="danger" size="sm">
                <Trash2 size={16} aria-hidden />
                Excluir post
              </Button>
            </AlertDialog.Trigger>
            <AlertDialog.Portal>
              <AlertDialog.Overlay className="fixed inset-0 z-50 bg-black/60" />
              <AlertDialog.Content className="fixed left-1/2 top-1/2 z-50 w-[90vw] max-w-md -translate-x-1/2 -translate-y-1/2 glass rounded-2xl p-6 shadow-xl">
                <AlertDialog.Title className="text-lg font-semibold mb-2">
                  Excluir este post?
                </AlertDialog.Title>
                <AlertDialog.Description className="text-sm text-[hsl(220_12%_65%)] mb-6">
                  Esta ação é irreversível. O post será removido permanentemente do navegador.
                </AlertDialog.Description>
                <div className="flex justify-end gap-3">
                  <AlertDialog.Cancel asChild>
                    <Button variant="ghost">Cancelar</Button>
                  </AlertDialog.Cancel>
                  <AlertDialog.Action asChild>
                    <Button variant="danger" onClick={() => void handleDelete()}>
                      Excluir
                    </Button>
                  </AlertDialog.Action>
                </div>
              </AlertDialog.Content>
            </AlertDialog.Portal>
          </AlertDialog.Root>
        </div>
      )}
    </div>
  )
}
