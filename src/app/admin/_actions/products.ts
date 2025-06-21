"use server"

import db from "@/db/db"
import { z } from "zod"
import { notFound, redirect } from "next/navigation"
import { revalidatePath } from "next/cache"
import cloudinary from "@/lib/cloudinary"
import { tmpdir } from "os"
import { writeFile } from "fs/promises"
import path from "path"

const imageSchema = z.instanceof(File, { message: "Required" }).refine(
  file => file.size === 0 || file.type.startsWith("image/")
)

const addSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  priceInCents: z.coerce.number().int().min(1),
  sku: z.string().min(1),
  stockQuantity: z.coerce.number().int().min(0),
  image: imageSchema.refine(file => file.size > 0, "Required"),
})

export async function addProduct(prevState: unknown, formData: FormData) {
  const result = addSchema.safeParse(Object.fromEntries(formData.entries()))
  if (!result.success) return (result as z.SafeParseError<typeof addSchema>).error.formErrors.fieldErrors

  const data = result.data
  const localPath = path.join(tmpdir(), crypto.randomUUID() + data.image.name)
  await writeFile(localPath, new Uint8Array(await data.image.arrayBuffer()))

  const uploadResult = await cloudinary.uploader.upload(localPath, {
    folder: "products",
  })

  await db.product.create({
    data: {
      isAvailableForPurchase: false,
      name: data.name,
      description: data.description,
      priceInCents: data.priceInCents,
      sku: data.sku,
      stockQuantity: data.stockQuantity,
      imagePath: uploadResult.secure_url,
    },
  })

  revalidatePath("/")
  revalidatePath("/products")
  redirect("/admin/products")
}

const editSchema = addSchema.extend({
  file: z.instanceof(File, { message: "Required" }).optional(),
  image: imageSchema.optional(),
})

export async function updateProduct(
  id: string,
  prevState: unknown,
  formData: FormData
) {
  const result = editSchema.safeParse(Object.fromEntries(formData.entries()))
  if (!result.success) {
    const error = result as z.SafeParseError<typeof editSchema>;
    return error.error.formErrors.fieldErrors;
  }

  const data = result.data
  const product = await db.product.findUnique({ where: { id } })
  if (!product) return notFound()

  let imagePath = product.imagePath
  if (data.image && data.image.size > 0) {
    const localPath = path.join(tmpdir(), crypto.randomUUID() + data.image.name)
    await writeFile(localPath, new Uint8Array(await data.image.arrayBuffer()))

    const uploadResult = await cloudinary.uploader.upload(localPath, {
      folder: "products",
    })

    imagePath = uploadResult.secure_url
  }

  await db.product.update({
    where: { id },
    data: {
      name: data.name,
      description: data.description,
      priceInCents: data.priceInCents,
      imagePath,
    },
  })

  revalidatePath("/")
  revalidatePath("/products")
  redirect("/admin/products")
}

export async function toggleProductAvailability(
  id: string,
  isAvailableForPurchase: boolean
) {
  await db.product.update({ where: { id }, data: { isAvailableForPurchase } })
  revalidatePath("/")
  revalidatePath("/products")
}

export async function deleteProduct(id: string) {
  const product = await db.product.delete({ where: { id } })
  if (!product) return notFound()
  revalidatePath("/")
  revalidatePath("/products")
}
