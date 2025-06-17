// app/orders/MyOrdersForm.tsx
"use client"

import { emailOrderHistory } from "@/actions/orders"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useFormState, useFormStatus } from "react-dom"

export default function MyOrdersForm() {
  const [data, action] = useFormState(emailOrderHistory, {})

  return (
    <form action={action}>
      <Card>
        <CardHeader>
          <CardTitle>My Orders</CardTitle>
          <CardDescription>
            Enter your email and we’ll email you your order history.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Label htmlFor="email">Email</Label>
          <Input type="email" name="email" id="email" required />
          {data.error && <p className="text-destructive">{data.error}</p>}
        </CardContent>
        <CardFooter>
          {data.message ? <p>{data.message}</p> : <SubmitButton />}
        </CardFooter>
      </Card>
    </form>
  )
}

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? "Sending..." : "Send"}
    </Button>
  )
}
