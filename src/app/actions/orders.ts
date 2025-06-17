"use server"

import db from "@/db/db"

export async function userOrderExists(email: string, productId: string) {
  return (
    (await db.order.findFirst({
      where: { user: { email }, productId },
      select: { id: true },
    })) != null
  )
}

export async function removeFromStock(productId: string, quantity: number) {
  const product = await db.product.findUnique({
    where: { id: productId },
    select: { stockQuantity: true },
  })

  if (!product || product.stockQuantity < quantity) {
    throw new Error("Insufficient stock")
  }

  return db.product.update({
    where: { id: productId },
    data: { stockQuantity: product.stockQuantity - quantity },
  })
}