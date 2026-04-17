import { notFound } from 'next/navigation'
import { getProductBySlug } from '@/actions/products'
import { ProductDetailClient } from '@/components/products/ProductDetailClient'
import { MOCK_PRODUCTS } from '@/lib/mock-products'

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const product =
    (await getProductBySlug(slug)) ??
    MOCK_PRODUCTS.find((p) => p.slug === slug) ??
    null

  if (!product) notFound()

  return <ProductDetailClient product={product} />
}
