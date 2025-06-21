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

type FormState = {
  error?: string
  message?: string
}

const initialState: FormState = {}

export default function MyOrdersForm() {
  const [state, formAction] = useFormState<FormState, FormData>(
    emailOrderHistory,
    initialState
  )

  return (
    <form action={formAction}>
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
          {state.error && (
            <p className="text-destructive text-sm mt-2">{state.error}</p>
          )}
        </CardContent>
        <CardFooter>
          {state.message ? (
            <p className="text-green-600 text-sm">{state.message}</p>
          ) : (
            <SubmitButton />
          )}
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
