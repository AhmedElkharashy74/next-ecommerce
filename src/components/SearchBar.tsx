'use client'
import { Input } from "./ui/input"
import { Search } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { useCallback, useTransition } from "react"
import { useDebounce } from "@/lib/hooks/useDebounce"

export function SearchBar() {
  const router = useRouter()
  const searchParams : any = useSearchParams()
  const [isPending, startTransition] = useTransition()

  const handleSearch = useCallback(
    (term: string) => {
      const params = new URLSearchParams(searchParams)
      if (term) {
        params.set("search", term)
      } else {
        params.delete("search")
      }

      startTransition(() => {
        router.replace(`/products?${params.toString()}`)
      })
    },
    [router, searchParams]
  )

  const debouncedSearch = useDebounce(handleSearch, 300)

  return (
    <div className="relative w-full max-w-sm">
      <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        placeholder="Search products..."
        className="pl-8"
        onChange={(e) => debouncedSearch(e.target.value)}
        defaultValue={searchParams.get("search") ?? ""}
      />
    </div>
  )
} 