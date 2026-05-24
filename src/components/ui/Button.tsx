import { forwardRef, type ButtonHTMLAttributes } from 'react'
import { cn } from '../../lib/cn'

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: 'sm' | 'md' | 'lg'
}

const variants: Record<Variant, string> = {
  primary:
    'bg-[hsl(195_80%_48%)] text-[hsl(220_20%_8%)] hover:bg-[hsl(195_80%_55%)] border-transparent',
  secondary:
    'bg-[hsl(220_16%_16%)] text-[hsl(220_15%_90%)] hover:bg-[hsl(220_16%_20%)] border-[hsl(220_14%_24%)]',
  ghost:
    'bg-transparent text-[hsl(220_12%_75%)] hover:bg-[hsl(220_16%_14%)] border-transparent',
  danger:
    'bg-[hsl(0_60%_45%)] text-white hover:bg-[hsl(0_60%_52%)] border-transparent',
}

const sizes = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-sm',
  lg: 'px-6 py-3 text-base',
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'secondary', size = 'md', disabled, children, ...props }, ref) => (
    <button
      ref={ref}
      disabled={disabled}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-lg border font-medium transition-colors duration-150',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(195_80%_52%)] focus-visible:ring-offset-2 focus-visible:ring-offset-[hsl(220_18%_8%)]',
        'disabled:opacity-50 disabled:pointer-events-none',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
)

Button.displayName = 'Button'
