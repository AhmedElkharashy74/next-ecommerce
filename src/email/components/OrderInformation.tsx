import { formatCurrency } from "@/lib/formatters"
import {
  Button,
  Column,
  Img,
  Row,
  Section,
  Text,
} from "@react-email/components"

type OrderInformationProps = {
  order: { 
    id: string
    createdAt: Date
    pricePaidInCents: number
    status: string
    trackingNumber?: string
    shippingAddress: string
  }
  product: { 
    imagePath: string
    name: string
    description: string
  }
}

const dateFormatter = new Intl.DateTimeFormat("en", { dateStyle: "medium" })

export function OrderInformation({
  order,
  product,
}: OrderInformationProps) {
  return (
    <>
      <Section>
        <Row>
          <Column>
            <Text className="mb-0 text-gray-500 whitespace-nowrap text-nowrap mr-4">
              Order ID
            </Text>
            <Text className="mt-0 mr-4">{order.id}</Text>
          </Column>
          <Column>
            <Text className="mb-0 text-gray-500 whitespace-nowrap text-nowrap mr-4">
              Purchased On
            </Text>
            <Text className="mt-0 mr-4">
              {dateFormatter.format(order.createdAt)}
            </Text>
          </Column>
          <Column>
            <Text className="mb-0 text-gray-500 whitespace-nowrap text-nowrap mr-4">
              Price Paid
            </Text>
            <Text className="mt-0 mr-4">
              {formatCurrency(order.pricePaidInCents / 100)}
            </Text>
          </Column>
        </Row>
      </Section>
      <Section className="border border-solid border-gray-500 rounded-lg p-4 md:p-6 my-4">
        <Img
          width="100%"
          alt={product.name}
          src={`${process.env.NEXT_PUBLIC_SERVER_URL}${product.imagePath}`}
        />
        <Row className="mt-8">
          <Column className="align-bottom">
            <Text className="text-lg font-bold m-0 mr-4">{product.name}</Text>
          </Column>
        </Row>
        <Row>
          <Column>
            <Text className="text-gray-500 mb-0">{product.description}</Text>
          </Column>
        </Row>
        <Row className="mt-4">
          <Column>
            <Text className="font-bold mb-2">Shipping Information</Text>
            <Text className="mb-1">Status: {order.status}</Text>
            {order.trackingNumber && (
              <Text className="mb-1">Tracking Number: {order.trackingNumber}</Text>
            )}
            <Text className="mb-1">Shipping Address: {order.shippingAddress}</Text>
          </Column>
        </Row>
      </Section>
    </>
  )
}
