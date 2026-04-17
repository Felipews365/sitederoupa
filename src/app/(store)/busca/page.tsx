import { redirect } from 'next/navigation'

interface SearchPageProps {
  searchParams: Promise<{ q?: string }>
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams
  if (!params.q) redirect('/produtos')
  redirect(`/produtos?q=${encodeURIComponent(params.q)}`)
}
