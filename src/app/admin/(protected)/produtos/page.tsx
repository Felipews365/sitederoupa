import Link from 'next/link'
import Image from 'next/image'
import { Plus, Pencil, Eye, EyeOff, ShoppingBag } from 'lucide-react'
import { getAllProducts, toggleProductActive } from '@/actions/admin/products'
import { formatCurrency } from '@/lib/utils'
import { DeleteProductButton } from '@/components/admin/DeleteProductButton'
import { ToggleActiveButton } from '@/components/admin/ToggleActiveButton'

export const metadata = { title: 'Produtos — Admin' }

export default async function AdminProdutosPage() {
  const products = await getAllProducts()

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl font-bold">Produtos</h1>
          <p className="text-muted-foreground text-sm mt-0.5">{products.length} produtos cadastrados</p>
        </div>
        <Link href="/admin/produtos/novo" className="btn-primary text-sm flex items-center gap-2">
          <Plus className="w-4 h-4" /> Novo Produto
        </Link>
      </div>

      {products.length === 0 ? (
        <div className="bg-white rounded-xl border border-border text-center py-16">
          <ShoppingBag className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
          <p className="font-medium">Nenhum produto cadastrado</p>
          <p className="text-sm text-muted-foreground mt-1">Clique em &quot;Novo Produto&quot; para começar.</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-border overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-muted-foreground">
              <tr>
                <th className="text-left px-4 py-3 font-medium">Produto</th>
                <th className="text-left px-4 py-3 font-medium hidden md:table-cell">Categoria</th>
                <th className="text-right px-4 py-3 font-medium">Preço</th>
                <th className="text-center px-4 py-3 font-medium hidden sm:table-cell">Estoque</th>
                <th className="text-center px-4 py-3 font-medium">Status</th>
                <th className="text-right px-4 py-3 font-medium">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {products.map((product: any) => {
                const primaryImage = product.product_images?.find((i: any) => i.is_primary) ?? product.product_images?.[0]
                const totalStock = product.product_variants?.reduce((s: number, v: any) => s + v.stock, 0) ?? 0

                return (
                  <tr key={product.id} className="hover:bg-muted/20 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                          {primaryImage ? (
                            <Image src={primaryImage.url} alt={product.name} fill className="object-cover" />
                          ) : (
                            <div className="flex items-center justify-center h-full">
                              <ShoppingBag className="w-4 h-4 text-muted-foreground" />
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{product.name}</p>
                          {product.sku && <p className="text-xs text-muted-foreground">SKU: {product.sku}</p>}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground hidden md:table-cell">
                      {product.categories?.name ?? '—'}
                    </td>
                    <td className="px-4 py-3 text-right font-semibold text-accent">
                      {formatCurrency(product.price)}
                    </td>
                    <td className="px-4 py-3 text-center hidden sm:table-cell">
                      <span className={`font-medium ${totalStock === 0 ? 'text-destructive' : totalStock <= 5 ? 'text-yellow-600' : 'text-success'}`}>
                        {totalStock}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <ToggleActiveButton id={product.id} active={product.active} />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <Link
                          href={`/admin/produtos/${product.id}/editar`}
                          className="p-2 text-muted-foreground hover:text-primary transition-colors rounded-lg hover:bg-muted"
                        >
                          <Pencil className="w-4 h-4" />
                        </Link>
                        <DeleteProductButton id={product.id} name={product.name} />
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
