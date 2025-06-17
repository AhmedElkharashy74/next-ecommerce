// components/OrderCard.tsx

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Image from "next/image"
import { Badge } from "./ui/badge"

type OrderCardProps = {
  product: {
    name: string
    imagePath: string
  }
  pricePaidInCents: number
  status: string
  trackingNumber?: string | null
  shippingAddress: string
  createdAt: string
}

export function OrderCard({
  product,
  pricePaidInCents,
  status,
  trackingNumber,
  shippingAddress,
  createdAt ,
}: OrderCardProps) {
    const statusColors = {
        PENDING: "bg-yellow-200 text-yellow-800",
        PROCESSING: "bg-blue-200 text-blue-800",
        SHIPPED: "bg-purple-200 text-purple-800",
        DELIVERED: "bg-green-200 text-green-800",
      } as const;
      
      const statusColor =
        statusColors[status.toUpperCase() as keyof typeof statusColors] ||
        "bg-gray-200 text-gray-800";
  return (
    <Card className="rounded-2xl shadow border">
      <CardHeader>
        <CardTitle className="text-lg">{product.name}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <Image
          src={product.imagePath}
          alt={product.name}
          width={400}
          height={300}
          className="rounded-md object-cover w-full h-48"
        />

        <Badge className={statusColor + " rounded-md"}>
          {status}
        </Badge>

        <div className="text-sm">
          <span className="font-semibold">Paid:</span> ${(pricePaidInCents / 100).toFixed(2)}
        </div>

        {trackingNumber && (
          <div className="text-sm">
            <span className="font-semibold">Tracking #:</span> {trackingNumber}
          </div>
        )}

        <div className="text-sm">
          <span className="font-semibold">Shipping to:</span> {shippingAddress}
        </div>

        <div className="text-xs text-muted-foreground">
          Ordered on: {new Date(createdAt).toLocaleDateString()}
        </div>
      </CardContent>
    </Card>
  )
}
