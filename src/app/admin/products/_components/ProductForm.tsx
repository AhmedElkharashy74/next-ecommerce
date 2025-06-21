"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { formatCurrency } from "@/lib/formatters"
import { useState } from "react"
import { addProduct, updateProduct } from "../../_actions/products"
import { useFormState, useFormStatus } from "react-dom"
import Image from "next/image"

// Define the Product type
type Product = {
  id: string
  name: string
  priceInCents: number
  sku: string
  stockQuantity: number
  description: string
  imagePath: string
}

// Define the form error state
type FormState = {
  name?: string
  priceInCents?: string
  sku?: string
  stockQuantity?: string
  description?: string
  image?: string
}

export function ProductForm({ product }: { product?: Product | null }) {
  const [formState, action] = useFormState<FormState>(
    product == null ? addProduct : updateProduct.bind(null, product.id),
    {}
  )
  const [priceInCents, setPriceInCents] = useState<number | undefined>(
    product?.priceInCents
  )

  return (
    <form action={action} className="space-y-8">
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input
          type="text"
          id="name"
          name="name"
          required
          defaultValue={product?.name || ""}
        />
        {formState.name && <div className="text-destructive">{formState.name}</div>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="priceInCents">Price In Cents</Label>
        <Input
          type="number"
          id="priceInCents"
          name="priceInCents"
          required
          value={priceInCents}
          onChange={e => setPriceInCents(Number(e.target.value) || undefined)}
        />
        <div className="text-muted-foreground">
          {formatCurrency((priceInCents || 0) / 100)}
        </div>
        {formState.priceInCents && (
          <div className="text-destructive">{formState.priceInCents}</div>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="sku">SKU</Label>
        <Input
          type="text"
          id="sku"
          name="sku"
          required
          defaultValue={product?.sku || ""}
        />
        {formState.sku && <div className="text-destructive">{formState.sku}</div>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="stockQuantity">Stock Quantity</Label>
        <Input
          type="number"
          id="stockQuantity"
          name="stockQuantity"
          required
          defaultValue={product?.stockQuantity || 0}
        />
        {formState.stockQuantity && (
          <div className="text-destructive">{formState.stockQuantity}</div>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          required
          defaultValue={product?.description}
        />
        {formState.description && (
          <div className="text-destructive">{formState.description}</div>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="image">Image</Label>
        <Input type="file" id="image" name="image" required={product == null} />
        {product != null && (
          <Image
            src={product.imagePath}
            height={400}
            width={400}
            alt="Product Image"
          />
        )}
        {formState.image && <div className="text-destructive">{formState.image}</div>}
      </div>

      <SubmitButton />
    </form>
  )
}

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <Button type="submit" disabled={pending}>
      {pending ? "Saving..." : "Save"}
    </Button>
  )
}
