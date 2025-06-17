import { formatCurrency } from "@/lib/formatters"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card"
import { Button } from "./ui/button"
import Link from "next/link"
import Image from "next/image"
import { ShoppingCart } from "lucide-react"

type ProductCardProps = {
  id: string
  name: string
  priceInCents: number
  description: string
  imagePath: string
}

export function ProductCard({
  id,
  name,
  priceInCents,
  description,
  imagePath,
}: ProductCardProps) {
  return (
    <Card className="group overflow-hidden flex flex-col hover:shadow-lg transition-shadow duration-300">
      <div className="relative w-full h-48 overflow-hidden">
        <Image
          src={imagePath}
          fill
          alt={name}
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      <CardHeader className="space-y-2">
        <CardTitle className="line-clamp-1">{name}</CardTitle>
        <CardDescription className="text-lg font-semibold text-primary">
          {formatCurrency(priceInCents / 100)}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="line-clamp-3 text-muted-foreground">{description}</p>
      </CardContent>
      <CardFooter>
        <Button asChild size="lg" className="w-full group-hover:bg-primary/90">
          <Link href={`/products/${id}/purchase`} className="flex items-center gap-2">
            <ShoppingCart className="h-4 w-4" />
            <span>purchase</span>
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )
}

export function ProductCardSkeleton() {
  return (
    <Card className="overflow-hidden flex flex-col animate-pulse">
      <div className="w-full h-48 bg-gray-200" />
      <CardHeader className="space-y-2">
        <div className="h-6 w-3/4 bg-gray-200 rounded" />
        <div className="h-5 w-1/3 bg-gray-200 rounded" />
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="h-4 w-full bg-gray-200 rounded" />
        <div className="h-4 w-full bg-gray-200 rounded" />
        <div className="h-4 w-2/3 bg-gray-200 rounded" />
      </CardContent>
      <CardFooter>
        <div className="w-full h-10 bg-gray-200 rounded" />
      </CardFooter>
    </Card>
  )
}
