import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Tailwind,
} from "@react-email/components"
import { OrderInformation } from "./components/OrderInformation"

type PurchaseReceiptEmailProps = {
  product: {
    name: string
    imagePath: string
    description: string
  }
  order: { 
    id: string
    createdAt: Date
    pricePaidInCents: number
    status: string
    trackingNumber?: string
    shippingAddress: string
  }
}

PurchaseReceiptEmail.PreviewProps = {
  product: {
    name: "Product name",
    description: "Some description",
    imagePath:
      "/products/5aba7442-e4a5-4d2e-bfa7-5bd358cdad64-02 - What Is Next.js.jpg",
  },
  order: {
    id: crypto.randomUUID(),
    createdAt: new Date(),
    pricePaidInCents: 10000,
    status: "PENDING",
    shippingAddress: "123 Main St, City, State, 12345, Country",
  },
} satisfies PurchaseReceiptEmailProps

export default function PurchaseReceiptEmail({
  product,
  order,
}: PurchaseReceiptEmailProps) {
  return (
    <Html>
      <Preview>Order Confirmation for {product.name}</Preview>
      <Tailwind>
        <Head />
        <Body className="font-sans bg-white">
          <Container className="max-w-xl">
            <Heading>Purchase Receipt</Heading>
            <OrderInformation
              order={order}
              product={product}
            />
          </Container>
        </Body>
      </Tailwind>
    </Html>
  )
}
