import * as React from 'react'
import { cn } from '@/lib/utils'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline'
}

export function Button({ className, variant = 'default', ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center font-medium transition-colors focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50',
        variant === 'default' && 'bg-zinc-900 text-white hover:bg-zinc-800',
        variant === 'outline' && 'border border-zinc-200 bg-white text-zinc-900 hover:bg-zinc-50',
        className
      )}
      {...props}
    />
  )
}
