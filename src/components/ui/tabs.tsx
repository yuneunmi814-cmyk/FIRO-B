import * as React from 'react'
import { createContext, useContext } from 'react'
import { cn } from '@/lib/utils'

interface TabsCtx { value: string; onValueChange: (v: string) => void }
const TabsContext = createContext<TabsCtx>({ value: '', onValueChange: () => {} })

interface TabsProps {
  value: string
  onValueChange: (v: string) => void
  className?: string
  children: React.ReactNode
}

export function Tabs({ value, onValueChange, className, children }: TabsProps) {
  return (
    <TabsContext.Provider value={{ value, onValueChange }}>
      <div className={cn('', className)}>{children}</div>
    </TabsContext.Provider>
  )
}

export function TabsList({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('inline-flex items-center rounded-xl bg-zinc-100 p-1', className)}
      {...props}
    >
      {children}
    </div>
  )
}

interface TabsTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  value: string
}

export function TabsTrigger({ value, className, children, ...props }: TabsTriggerProps) {
  const { value: active, onValueChange } = useContext(TabsContext)
  const isActive = active === value
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-all focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50',
        isActive
          ? 'bg-white text-zinc-900 shadow-sm rounded-lg'
          : 'text-zinc-500 hover:text-zinc-700',
        className
      )}
      onClick={() => onValueChange(value)}
      type="button"
      {...props}
    >
      {children}
    </button>
  )
}

interface TabsContentProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string
}

export function TabsContent({ value, className, children, ...props }: TabsContentProps) {
  const { value: active } = useContext(TabsContext)
  if (active !== value) return null
  return (
    <div className={cn('mt-0', className)} {...props}>
      {children}
    </div>
  )
}
