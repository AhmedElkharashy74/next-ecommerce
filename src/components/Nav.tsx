"use client"

import { cn } from "@/lib/utils"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { ComponentProps, ReactNode } from "react"
import { ShoppingCart, Package, Home, User } from "lucide-react"
import { Button } from "./ui/button"
import LoginButton from "./login-btn"

type NavProps = {
  children: ReactNode
  actions?: ReactNode
}

export function Nav({ children, actions }: NavProps) {
  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center space-x-2">
            <Package className="h-6 w-6 text-primary" />
            <span className="font-bold text-primary">Store</span>
          </Link>
          <div className="hidden md:flex items-center gap-4">
            {children}
          </div>
        </div>
        {actions && (
          <div className="flex items-center gap-4">
            {actions}
          </div>
        )}
      </div>
    </nav>
  )
}

export function NavLink(props: Omit<ComponentProps<typeof Link>, "className">) {
  const pathname = usePathname()
  const isActive = pathname === props.href

  const icons = {
    "/": Home,
    "/products": Package,
    "/orders": User,
  }

  const Icon = icons[props.href as keyof typeof icons]

  return (
    <Link
      {...props}
      className={cn(
        "flex items-center gap-2 text-sm font-medium transition-colors",
        isActive 
          ? "text-primary" 
          : "text-muted-foreground hover:text-primary hover:bg-accent/50 px-3 py-2 rounded-md"
      )}
    >
      {Icon && <Icon className="h-4 w-4" />}
      {props.children}
    </Link>
  )
}
