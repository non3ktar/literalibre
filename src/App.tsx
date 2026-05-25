import { HashRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Layout } from './components/Layout'
import { HomePage } from './pages/HomePage'
import { PostPage } from './pages/PostPage'
import { EditorPage } from './pages/EditorPage'
import { DraftsPage } from './pages/DraftsPage'
import { SettingsPage } from './pages/SettingsPage'

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="p/:slug" element={<PostPage />} />
          {import.meta.env.DEV && (
            <>
              <Route path="write" element={<EditorPage />} />
              <Route path="write/:id" element={<EditorPage />} />
              <Route path="drafts" element={<DraftsPage />} />
              <Route path="settings" element={<SettingsPage />} />
            </>
          )}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </HashRouter>
  )
}
