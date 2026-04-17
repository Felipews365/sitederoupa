'use client'

import { useState } from 'react'
import { Trash2 } from 'lucide-react'
import { deleteProduct } from '@/actions/admin/products'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

export function DeleteProductButton({ id, name }: { id: string; name: string }) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleDelete = async () => {
    if (!confirm(`Excluir "${name}"? Esta ação não pode ser desfeita.`)) return
    setLoading(true)
    const result = await deleteProduct(id)
    if (result.error) {
      toast.error(result.error)
    } else {
      toast.success('Produto excluído')
      router.refresh()
    }
    setLoading(false)
  }

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="p-2 text-muted-foreground hover:text-destructive transition-colors rounded-lg hover:bg-muted disabled:opacity-50"
    >
      <Trash2 className="w-4 h-4" />
    </button>
  )
}
