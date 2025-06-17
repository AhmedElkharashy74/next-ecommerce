import { Button } from "@/components/ui/button"
import db from "@/db/db"
import { formatCurrency } from "@/lib/formatters"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string)

export default async function SuccessPage({
  searchParams,
}: {
  searchParams: { payment_intent: string }
}) {
  const paymentIntent = await stripe.paymentIntents.retrieve(
    searchParams.payment_intent
  )
  if (paymentIntent.metadata.productId == null) return notFound()

  const product = await db.product.findUnique({
    where: { id: paymentIntent.metadata.productId },
    select: {
      id: true,
      name: true,
      description: true,
      imagePath: true,
      priceInCents: true,
    }
  })
  if (product == null) return notFound()

  const isSuccess = paymentIntent.status === "succeeded"

  return (
    <div className="max-w-5xl w-full mx-auto space-y-8">
      <h1 className="text-4xl font-bold">
        {isSuccess ? "Success!" : "Error!"}
      </h1>
      <div className="flex gap-4 items-center">
        <div className="aspect-video flex-shrink-0 w-1/3 relative">
          <Image
            src={product.imagePath}
            fill
            alt={product.name}
            className="object-cover"
          />
        </div>
        <div>
          <div className="text-lg">
            {formatCurrency(product.priceInCents / 100)}
          </div>
          <h1 className="text-2xl font-bold">{product.name}</h1>
          <div className="line-clamp-3 text-muted-foreground">
            {product.description}
          </div>
          <div className="mt-4 space-y-2">
            <p className="text-sm text-muted-foreground">
              {isSuccess 
                ? "Your order has been placed successfully! You will receive an email confirmation with shipping details."
                : "There was an error processing your payment. Please try again."}
            </p>
            {isSuccess ? (
              <Button asChild>
                <Link href="/orders">View Orders</Link>
              </Button>
            ) : (
              <Button asChild>
                <Link href={`/products/${product.id}/purchase`}>Try Again</Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}


