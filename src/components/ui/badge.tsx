// components/ui/badge.tsx
import { cn } from "@/lib/utils"

export function Badge({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-muted text-muted-foreground",
        className
      )}
    >
      {children}
    </span>
  )
}
