import { forwardRef, type TextareaHTMLAttributes } from 'react'
import { cn } from '../../lib/cn'

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className, ...props }, ref) => (
    <textarea
      ref={ref}
      className={cn(
        'w-full rounded-lg border border-[hsl(220_14%_22%)] bg-[hsl(220_16%_10%)] px-4 py-3',
        'text-[hsl(220_15%_92%)] placeholder:text-[hsl(220_10%_45%)]',
        'focus:outline-none focus:ring-2 focus:ring-[hsl(195_80%_52%)]/50 focus:border-[hsl(195_60%_40%)]',
        'resize-y min-h-[120px] leading-relaxed transition-colors duration-150',
        className
      )}
      {...props}
    />
  )
)

Textarea.displayName = 'Textarea'
