import MyOrdersForm from "./MyOrdersForm"
import { getOrdersByEmail } from "../_actions/orders"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/authOptions"
import { OrderCard } from "@/components/OrderCard"
import { Prisma } from "@prisma/client"

type OrderWithProduct = Prisma.OrderGetPayload<{
  include: { product: true }
}>

export default async function MyOrdersPage() {
  const session = await getServerSession(authOptions)
  const email = session?.user?.email
  const orders: OrderWithProduct[] = email ? await getOrdersByEmail(email) : []

  return (
    <div>
      <MyOrdersForm />
      {session && (
        <div className="my-6">
          <h2 className="text-xl font-semibold mb-4">Your Orders</h2>
          {orders.length === 0 ? (
            <p>No orders found.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {orders.map((order) => (
                <OrderCard
                  key={order.id}
                  product={order.product}
                  pricePaidInCents={order.pricePaidInCents}
                  status={order.status}
                  trackingNumber={order.trackingNumber}
                  createdAt={order.createdAt.toISOString()}
                  shippingAddress={order.shippingAddress}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
