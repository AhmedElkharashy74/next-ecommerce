// 'use client'
import { ProductCard, ProductCardSkeleton } from "@/components/ProductCard"
import { SearchBar } from "@/components/SearchBar"
import db from "@/db/db"
import { cache } from "@/lib/cache"
import { Suspense } from "react"
type Product = {
  id: string
  name: string
  priceInCents: number
  imagePath: string
  description: string
  sku: string
  stockQuantity: number
  isAvailableForPurchase: boolean
  createdAt: Date
  updatedAt: Date
}

const getProducts = cache((search?: string) => {
  return db.product.findMany({
    where: {
      isAvailableForPurchase: true,
      OR: search
        ? [
            { name: { contains: search } },
            { description: { contains: search } },
          ]
        : undefined,
    },
    orderBy: { name: "asc" },
  })
}, ["/products", "getProducts"])

export default function ProductsPage({
  searchParams,
}: {
  searchParams: { search?: string }
}) {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Products</h1>
        <SearchBar />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Suspense
          fallback={
            <>
              <ProductCardSkeleton />
              <ProductCardSkeleton />
              <ProductCardSkeleton />
              <ProductCardSkeleton />
              <ProductCardSkeleton />
              <ProductCardSkeleton />
            </>
          }
        >
          <ProductsSuspense search={searchParams.search} />
        </Suspense>
      </div>
    </div>
  )
}

async function ProductsSuspense({ search }: { search?: string }) {
  const products : Product[] = await getProducts(search)

  if (products.length === 0) {
    return (
      <div className="col-span-full text-center py-10">
        <h2 className="text-xl font-semibold text-muted-foreground">
          No products found
        </h2>
      </div>
    )
  }

  return products.map((product : Product) => <ProductCard key={product.id} {...product} />)
}
