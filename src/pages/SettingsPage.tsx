import { useRef, useState } from 'react'
import { Download, Upload, Save } from 'lucide-react'
import { useSettings } from '../hooks/useSettings'
import { usePosts } from '../hooks/usePosts'
import { importPosts, saveSettings } from '../db'
import { buildSiteExport, downloadJson, readJsonFile } from '../lib/export'
import type { BlogSettings, SiteExport } from '../types'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { Textarea } from '../components/ui/Textarea'

type SettingsFormProps = {
  settings: BlogSettings
  posts: ReturnType<typeof usePosts>['posts']
  refresh: ReturnType<typeof usePosts>['refresh']
  update: ReturnType<typeof useSettings>['update']
}

function GuiaPublicacao() {
  if (!import.meta.env.DEV) return null

  return (
    <div className="mb-8 rounded-2xl bg-[hsl(195_60%_15%)] p-6 border border-[hsl(195_50%_30%)] shadow-lg">
      <h2 className="text-lg font-semibold text-[hsl(195_70%_75%)] mb-4 flex items-center gap-2">
        <span>🚀</span> Guia de Publicação Rápida
        <span className="ml-auto text-xs px-2 py-1 bg-[hsl(195_60%_30%)] rounded-full text-[hsl(195_80%_85%)]">
          Visível apenas para você (Local)
        </span>
      </h2>
      <ol className="list-decimal list-inside space-y-3 text-sm text-[hsl(195_30%_85%)] leading-relaxed">
        <li>Vá na aba <strong>Escrever</strong>, digite seu post e clique em <strong>Publicar</strong>.</li>
        <li>Aqui nas Configurações (logo abaixo), clique em <strong>Exportar site.json</strong>.</li>
        <li>Substitua o arquivo antigo na pasta do seu projeto em: <code className="bg-[hsl(195_60%_10%)] px-1.5 py-0.5 rounded text-[hsl(195_70%_70%)]">public/data/site.json</code> pelo novo arquivo baixado.</li>
        <li>No terminal, dentro da pasta do projeto, envie pro GitHub e rode: <code className="bg-[hsl(195_60%_10%)] px-1.5 py-0.5 rounded font-bold text-[hsl(150_60%_70%)]">npm run publicar</code></li>
      </ol>
    </div>
  )
}


function SettingsForm({ settings, posts, refresh, update }: SettingsFormProps) {
  const [form, setForm] = useState(settings)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  const handleSave = async () => {
    try {
      setSaving(true)
      setError(null)
      await update(form)
      setSuccess('Configurações salvas!')
      setTimeout(() => setSuccess(null), 3000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao salvar')
    } finally {
      setSaving(false)
    }
  }

  const handleExport = () => {
    const data = buildSiteExport(form, posts)
    downloadJson('flowwrite-site.json', data)
    setSuccess('Arquivo exportado! Coloque em public/data/site.json e faça deploy.')
    setTimeout(() => setSuccess(null), 5000)
  }

  const handleImport = async (file: File) => {
    try {
      setError(null)
      const data = await readJsonFile<SiteExport>(file)
      if (data.settings) {
        await saveSettings(data.settings)
        setForm(data.settings)
      }
      if (data.posts?.length) {
        const imported = data.posts.map((p) => ({
          ...p,
          source: 'local' as const,
          tags: p.tags ?? [],
        }))
        await importPosts(imported, false)
        await refresh()
      }
      setSuccess('Dados importados com sucesso!')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Arquivo inválido')
    }
  }

  return (
    <div className="mx-auto max-w-xl px-4 py-12 sm:px-6">
      <h1 className="font-serif text-3xl font-semibold text-balance mb-8">Configurações</h1>

      <GuiaPublicacao />

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

      <section className="space-y-4 mb-10">
        <h2 className="text-sm font-medium text-[hsl(220_10%_50%)] uppercase tracking-wide">
          Blog
        </h2>
        <div className="space-y-3">
          <label className="block space-y-1.5">
            <span className="text-sm text-[hsl(220_12%_65%)]">Título</span>
            <Input
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
            />
          </label>
          <label className="block space-y-1.5">
            <span className="text-sm text-[hsl(220_12%_65%)]">Subtítulo</span>
            <Input
              value={form.subtitle}
              onChange={(e) => setForm((f) => ({ ...f, subtitle: e.target.value }))}
            />
          </label>
          <label className="block space-y-1.5">
            <span className="text-sm text-[hsl(220_12%_65%)]">Autor</span>
            <Input
              value={form.author}
              onChange={(e) => setForm((f) => ({ ...f, author: e.target.value }))}
            />
          </label>
          <label className="block space-y-1.5">
            <span className="text-sm text-[hsl(220_12%_65%)]">Bio</span>
            <Textarea
              value={form.bio}
              onChange={(e) => setForm((f) => ({ ...f, bio: e.target.value }))}
              rows={3}
            />
          </label>
        </div>
        <Button onClick={() => void handleSave()} disabled={saving}>
          <Save size={16} aria-hidden />
          Salvar configurações
        </Button>
      </section>

      <section className="glass rounded-2xl p-6 space-y-4">
        <h2 className="text-sm font-medium text-[hsl(220_10%_50%)] uppercase tracking-wide">
          Deploy estático
        </h2>
        <p className="text-sm text-pretty text-[hsl(220_12%_60%)] leading-relaxed">
          Exporte seus posts publicados como JSON, substitua{' '}
          <code className="text-[hsl(195_70%_70%)]">public/data/site.json</code>{' '}
          e faça deploy no Netlify ou GitHub Pages. Visitantes verão o blog sem precisar do editor.
        </p>
        <div className="flex flex-wrap gap-3">
          <Button variant="primary" onClick={handleExport}>
            <Download size={16} aria-hidden />
            Exportar site.json
          </Button>
          <Button
            variant="secondary"
            onClick={() => fileRef.current?.click()}
          >
            <Upload size={16} aria-hidden />
            Importar backup
          </Button>
          <input
            ref={fileRef}
            type="file"
            accept=".json"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0]
              if (file) void handleImport(file)
              e.target.value = ''
            }}
          />
        </div>
      </section>
    </div>
  )
}

export function SettingsPage() {
  const { settings, update, loading } = useSettings()
  const { posts, refresh } = usePosts(false)

  if (loading) {
    return (
      <div className="mx-auto max-w-xl px-4 py-16 animate-pulse space-y-4">
        <div className="h-8 w-48 rounded bg-[hsl(220_16%_14%)]" />
        <div className="h-10 rounded bg-[hsl(220_16%_12%)]" />
        <div className="h-10 rounded bg-[hsl(220_16%_12%)]" />
      </div>
    )
  }

  return (
    <SettingsForm
      settings={settings}
      posts={posts}
      refresh={refresh}
      update={update}
    />
  )
}
