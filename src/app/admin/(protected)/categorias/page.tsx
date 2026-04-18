'use client'

import { useState, useEffect } from 'react'
import { Plus, Pencil, Trash2, Tag, LayoutGrid } from 'lucide-react'
import { getAllCategories, createCategory, updateCategory, deleteCategory, toggleCategoryGrid } from '@/actions/admin/categories'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

interface Category {
  id: string
  name: string
  slug: string
  description: string | null
  active: boolean
  sort_order: number
  show_in_grid: boolean
}

export default function AdminCategoriasPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<Category | null>(null)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ name: '', description: '', active: true, sort_order: 0, show_in_grid: true })

  const refresh = () => getAllCategories().then(setCategories as any)

  useEffect(() => { refresh() }, [])

  const gridCount = categories.filter((c) => c.show_in_grid).length

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name) { toast.error('Nome obrigatório'); return }
    setLoading(true)

    const result = editing
      ? await updateCategory(editing.id, { name: form.name, description: form.description, active: form.active, sort_order: form.sort_order, show_in_grid: form.show_in_grid })
      : await createCategory({ name: form.name, description: form.description, sort_order: form.sort_order })

    if (result.error) {
      toast.error(result.error)
    } else {
      toast.success(editing ? 'Categoria atualizada!' : 'Categoria criada!')
      setShowForm(false)
      setEditing(null)
      setForm({ name: '', description: '', active: true, sort_order: 0, show_in_grid: true })
      refresh()
    }
    setLoading(false)
  }

  const handleEdit = (cat: Category) => {
    setEditing(cat)
    setForm({ name: cat.name, description: cat.description ?? '', active: cat.active, sort_order: cat.sort_order, show_in_grid: cat.show_in_grid })
    setShowForm(true)
  }

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Excluir categoria "${name}"?`)) return
    const result = await deleteCategory(id)
    if (result.error) toast.error(result.error)
    else { toast.success('Categoria excluída'); refresh() }
  }

  const handleToggleGrid = async (cat: Category) => {
    if (!cat.show_in_grid && gridCount >= 8) {
      toast.error('Limite de 8 categorias na homepage atingido. Remova uma antes de adicionar.')
      return
    }
    const result = await toggleCategoryGrid(cat.id, !cat.show_in_grid)
    if (result.error) toast.error(result.error)
    else {
      toast.success(cat.show_in_grid ? 'Removida da homepage' : 'Adicionada à homepage')
      refresh()
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl font-bold">Categorias</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            <LayoutGrid className="w-3.5 h-3.5 inline mr-1" />
            <span className={gridCount >= 8 ? 'text-accent font-semibold' : ''}>{gridCount}/8</span> exibidas na homepage
          </p>
        </div>
        <Button onClick={() => { setShowForm(true); setEditing(null); setForm({ name: '', description: '', active: true, sort_order: categories.length, show_in_grid: gridCount < 8 }) }} size="sm">
          <Plus className="w-4 h-4 mr-1" /> Nova categoria
        </Button>
      </div>

      {showForm && (
        <div className="bg-white rounded-xl border border-border p-6 mb-6">
          <h2 className="font-semibold mb-4">{editing ? 'Editar Categoria' : 'Nova Categoria'}</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label>Nome *</Label>
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Ex: Camisetas" className="mt-1.5" required />
            </div>
            <div>
              <Label>Ordem</Label>
              <Input type="number" min={0} value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: Number(e.target.value) })} className="mt-1.5" />
            </div>
            <div className="sm:col-span-2">
              <Label>Descrição</Label>
              <Input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Opcional" className="mt-1.5" />
            </div>
            <div className="flex items-center gap-4">
              {editing && (
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input type="checkbox" checked={form.active} onChange={(e) => setForm({ ...form, active: e.target.checked })} className="w-4 h-4 accent-primary" />
                  Ativa
                </label>
              )}
              <label className={`flex items-center gap-2 text-sm cursor-pointer ${!form.show_in_grid && gridCount >= 8 ? 'opacity-50' : ''}`}>
                <input
                  type="checkbox"
                  checked={form.show_in_grid}
                  onChange={(e) => {
                    if (e.target.checked && gridCount >= 8 && !editing?.show_in_grid) {
                      toast.error('Limite de 8 na homepage atingido')
                      return
                    }
                    setForm({ ...form, show_in_grid: e.target.checked })
                  }}
                  className="w-4 h-4 accent-primary"
                />
                Mostrar na homepage
              </label>
            </div>
            <div className="sm:col-span-2 flex gap-3">
              <Button type="submit" disabled={loading}>
                {loading ? 'Salvando...' : editing ? 'Salvar' : 'Criar'}
              </Button>
              <Button type="button" variant="outline" onClick={() => { setShowForm(false); setEditing(null) }}>Cancelar</Button>
            </div>
          </form>
        </div>
      )}

      {categories.length === 0 ? (
        <div className="bg-white rounded-xl border border-border text-center py-12">
          <Tag className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
          <p className="font-medium">Nenhuma categoria</p>
          <p className="text-sm text-muted-foreground mt-1">As categorias são usadas para organizar os produtos.</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-border overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-muted-foreground">
              <tr>
                <th className="text-left px-4 py-3 font-medium">Nome</th>
                <th className="text-left px-4 py-3 font-medium hidden sm:table-cell">Slug</th>
                <th className="text-center px-4 py-3 font-medium">Ordem</th>
                <th className="text-center px-4 py-3 font-medium">Homepage</th>
                <th className="text-center px-4 py-3 font-medium">Status</th>
                <th className="text-right px-4 py-3 font-medium">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {categories.map((cat) => (
                <tr key={cat.id} className="hover:bg-muted/20 transition-colors">
                  <td className="px-4 py-3 font-medium">{cat.name}</td>
                  <td className="px-4 py-3 text-muted-foreground font-mono text-xs hidden sm:table-cell">{cat.slug}</td>
                  <td className="px-4 py-3 text-center text-muted-foreground">{cat.sort_order}</td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => handleToggleGrid(cat)}
                      title={cat.show_in_grid ? 'Remover da homepage' : 'Adicionar à homepage'}
                      className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full transition-colors ${
                        cat.show_in_grid
                          ? 'bg-primary/10 text-primary hover:bg-primary/20'
                          : 'bg-muted text-muted-foreground hover:bg-muted/80'
                      }`}
                    >
                      <LayoutGrid className="w-3 h-3" />
                      {cat.show_in_grid ? 'Sim' : 'Não'}
                    </button>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={`text-xs font-semibold px-2 py-1 rounded-full ${cat.active ? 'bg-success/10 text-success' : 'bg-muted text-muted-foreground'}`}>
                      {cat.active ? 'Ativa' : 'Inativa'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => handleEdit(cat)} className="p-2 text-muted-foreground hover:text-primary transition-colors rounded-lg hover:bg-muted">
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(cat.id, cat.name)} className="p-2 text-muted-foreground hover:text-destructive transition-colors rounded-lg hover:bg-muted">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
