import db from "@/db/db"
import { NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"
import { Resend } from "resend"
import PurchaseReceiptEmail from "@/email/PurchaseReceipt"
// import { hashPassword } from "@/lib/isValidPassword"
import { randomUUID } from "crypto"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  // apiVersion: "2024-08-01",
})
const resend = new Resend(process.env.RESEND_API_KEY as string)

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text()
    const signature = req.headers.get("stripe-signature") as string

    let event: Stripe.Event

    try {
      event = stripe.webhooks.constructEvent(
        rawBody,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET as string
      )
    } catch (err) {
      console.error("❌ Signature verification failed:", err)
      return new NextResponse("Invalid signature", { status: 400 })
    }

    console.log("✅ Stripe Event Type:", event.type)

    if (event.type === "charge.succeeded") {
      const charge = event.data.object as Stripe.Charge

      console.log("📦 charge.metadata:", charge.metadata)
      console.log("📧 charge.billing_details:", charge.billing_details)

      const productId = charge.metadata?.productId
      const email = charge.billing_details?.email
      const pricePaidInCents = charge.amount
      const shippingAddress = charge.shipping?.address

      if (!productId || !email) {
        console.error("❌ Missing required metadata or email")
        return new NextResponse("Missing required metadata", { status: 400 })
      }

      const formattedAddress =
        [
          shippingAddress?.line1,
          shippingAddress?.line2,
          shippingAddress?.city,
          shippingAddress?.state,
          shippingAddress?.postal_code,
          shippingAddress?.country,
        ]
          .filter(Boolean)
          .join(", ") || "No shipping address provided"

      const result = await db.$transaction(async (tx) => {
        const product = await tx.product.findUnique({
          where: { id: productId },
          select: {
            id: true,
            name: true,
            description: true,
            imagePath: true,
            stockQuantity: true,
          },
        })

        if (!product) throw new Error("Product not found")
        if (product.stockQuantity <= 0) throw new Error("Product out of stock")

        const userFields = {
          email,
          orders: {
            create: {
              productId,
              pricePaidInCents,
              status: "PENDING",
              shippingAddress: formattedAddress,
            },
          },
        }

        const { orders: [order] } = await tx.user.upsert({
          where: { email },
          create: userFields,
          update: {
            orders: {
              create: {
                productId,
                pricePaidInCents,
                status: "PENDING",
                shippingAddress: formattedAddress,
              },
            },
          },
          select: {
            orders: {
              orderBy: { createdAt: "desc" },
              take: 1,
              select: {
                id: true,
                createdAt: true,
                pricePaidInCents: true,
                status: true,
                shippingAddress: true,
              },
            },
          },
        })

        await tx.product.update({
          where: { id: productId },
          data: { stockQuantity: { decrement: 1 } },
        })

        const updatedProduct = await tx.product.findUnique({
          where: { id: productId },
          select: {
            id: true,
            name: true,
            description: true,
            imagePath: true,
            stockQuantity: true,
          },
        })

        if (updatedProduct?.stockQuantity === 0) {
          await tx.product.update({
            where: { id: productId },
            data: { isAvailableForPurchase: false },
          })
        }

        return { order, product }
      })

      try {
        await resend.emails.send({
          from: `Support <${process.env.SENDER_EMAIL}>`,
          to: email,
          subject: "Order Confirmation",
          react: <PurchaseReceiptEmail order={result.order} product={result.product} />,
        })
        console.log("📧 Email sent successfully to", email)
      } catch (emailError) {
        console.error("❌ Email sending failed:", emailError)
      }
    }

    return new NextResponse(null, { status: 200 })
  } catch (error) {
    console.error("🔥 Webhook Handler Error:", error)
    return new NextResponse(
      `Webhook Error: ${error instanceof Error ? error.stack : JSON.stringify(error)}`,
      { status: 500 }
    )
  }
}
