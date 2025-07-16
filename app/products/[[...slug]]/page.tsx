import React from 'react'

interface Props {
  params: Promise<{
    slug: string[]
  }>
  searchParams: Promise<{
    sortOrder: string
  }>
}

const ProductsPage = async ({ params, searchParams }: Props) => {
  const { slug } = await params;
  const { sortOrder } = await searchParams;
  return (
    <div>ProductsPage {slug} {sortOrder}</div>
  )
}

export default ProductsPage