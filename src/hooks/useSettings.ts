import { useCallback, useEffect, useState } from 'react'
import { getSettings, loadStaticData, saveSettings } from '../db'
import type { BlogSettings } from '../types'
import { DEFAULT_SETTINGS } from '../types'

export function useSettings() {
  const [settings, setSettings] = useState<BlogSettings>(DEFAULT_SETTINGS)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refresh = useCallback(async () => {
    try {
      setError(null)
      const data = await getSettings()
      setSettings(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar configurações')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    async function init() {
      try {
        const { settings: staticSettings } = await loadStaticData()
        if (staticSettings) {
          const current = await getSettings()
          if (current.title === DEFAULT_SETTINGS.title) {
            await saveSettings({ ...DEFAULT_SETTINGS, ...staticSettings })
          }
        }
        await refresh()
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro ao inicializar')
        setLoading(false)
      }
    }
    void init()
  }, [refresh])

  const update = useCallback(
    async (next: BlogSettings) => {
      try {
        setError(null)
        await saveSettings(next)
        setSettings(next)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro ao salvar')
        throw err
      }
    },
    []
  )

  return { settings, loading, error, update, refresh }
}
