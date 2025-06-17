"use server"
import db from "@/db/db"

export async function getOrdersByEmail(email: string) {
  if (!email) return []

  const user = await db.user.findUnique({
    where: { email },
    include: {
      orders: {
        orderBy: {
          createdAt: "desc",
        },
        include: {
          product: true,
        },
      },
    },
  })

  return user?.orders || []
}
