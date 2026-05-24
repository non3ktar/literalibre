import { useMemo } from 'react'
import { renderMarkdown } from '../lib/markdown'
import { cn } from '../lib/cn'

interface MarkdownContentProps {
  content: string
  className?: string
}

export function MarkdownContent({ content, className }: MarkdownContentProps) {
  const html = useMemo(() => renderMarkdown(content), [content])

  return (
    <article
      className={cn('prose-write max-w-none space-y-4', className)}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}
