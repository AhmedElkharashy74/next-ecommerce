//@ts-ignore
"use server"

import db from "@/db/db"
import OrderHistoryEmail from "@/email/OrderHistory"
import { Resend } from "resend"
import { z } from "zod"
import type { Order } from "@prisma/client"

const emailSchema = z.string().email()
const resend = new Resend(process.env.RESEND_API_KEY as string)


export async function emailOrderHistory(
  prevState: unknown,
  formData: FormData
): Promise<{ message?: string; error?: string }> {
  const result = emailSchema.safeParse(formData.get("email"))

  if (result.success === false) {
    return { error: "Invalid email address" }
  }

  const user = await db.user.findUnique({
    where: { email: result.data },
    select: {
      email: true,
      orders: {
        select: {
          id: true,
          pricePaidInCents: true,
          createdAt: true,
          status: true,
          trackingNumber: true,
          shippingAddress: true,
          product: {
            select: {
              id: true,
              name: true,
              imagePath: true,
              description: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
      },
    },
  })

  if (user == null) {
    return {
      message:
        "Check your email to view your order history.",
    }
  }

  const data = await resend.emails.send({
    from: `Support <${process.env.SENDER_EMAIL}>`,
    to: user.email,
    subject: "Order History",
    react: <OrderHistoryEmail orders={user.orders.map((order) => ({
      id: order.id,
      pricePaidInCents: order.pricePaidInCents,
      createdAt: order.createdAt,
      status: order.status,
      trackingNumber: order.trackingNumber ?? undefined,
      shippingAddress: order.shippingAddress,
      product: order.product, // Ensure product is included
    }))} />,
  })

  if (data.error) {
    return { error: "There was an error sending your email. Please try again." }
  }

  return {
    message:
      "Check your email to view your order history.",
  }
}

export async function userOrderExists(email: string, productId: string) {
  return (
    (await db.order.findFirst({
      where: {
        user: { email },
        productId,
      },
      select: { id: true },
    })) != null
  )
}
