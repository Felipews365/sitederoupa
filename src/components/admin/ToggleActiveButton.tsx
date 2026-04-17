'use client'

import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { toggleProductActive } from '@/actions/admin/products'
import { useRouter } from 'next/navigation'

export function ToggleActiveButton({ id, active }: { id: string; active: boolean }) {
  const [isActive, setIsActive] = useState(active)
  const router = useRouter()

  const handleToggle = async () => {
    const newValue = !isActive
    setIsActive(newValue)
    await toggleProductActive(id, newValue)
    router.refresh()
  }

  return (
    <button
      onClick={handleToggle}
      title={isActive ? 'Desativar produto' : 'Ativar produto'}
      className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium transition-colors ${
        isActive
          ? 'bg-success/10 text-success hover:bg-success/20'
          : 'bg-muted text-muted-foreground hover:bg-muted/80'
      }`}
    >
      {isActive ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
      {isActive ? 'Ativo' : 'Inativo'}
    </button>
  )
}
