'use client'

import { useState, useEffect, useRef } from 'react'
import { Plus, Pencil, Trash2, ImagePlay, ArrowUp, ArrowDown, Eye, EyeOff, Upload, X, Loader2, Image as ImageIcon, ArrowRight, Sparkles } from 'lucide-react'
import Image from 'next/image'
import {
  getAllBanners,
  createBanner,
  updateBanner,
  deleteBanner,
  reorderBanners,
  type HeroBanner,
  type BannerFormData,
} from '@/actions/admin/banners'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

const EMPTY_FORM: BannerFormData = {
  title: '',
  title_highlight: '',
  subtitle: '',
  badge_text: '',
  cta_label: 'Ver coleção',
  cta_href: '/produtos',
  cta_bg_color: '#FF6B00',
  bg_from: '#001C45',
  bg_via: '#0064D2',
  bg_to: '#0086FF',
  image_url: null,
  banner_height: 360,
  sort_order: 0,
  active: true,
}

const HEIGHT_PRESETS = [
  { label: 'Compacto', value: 260 },
  { label: 'Médio', value: 360 },
  { label: 'Alto', value: 460 },
  { label: 'Extra', value: 520 },
]

// ---------- Prévia do banner ----------
function BannerPreview({ form }: { form: BannerFormData }) {
  const gradient = form.bg_via
    ? `linear-gradient(135deg, ${form.bg_from}, ${form.bg_via}, ${form.bg_to})`
    : `linear-gradient(135deg, ${form.bg_from}, ${form.bg_to})`

  const fadeColor = form.bg_via ?? form.bg_from

  return (
    <div className="sticky top-6">
      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
        Prévia em tempo real
      </p>

      {/* Banner simulado — escala a altura proporcionalmente */}
      <div
        className="relative rounded-2xl overflow-hidden w-full"
        style={{ background: gradient, height: Math.round((form.banner_height ?? 360) * 0.44), minHeight: 120 }}
      >
        {/* Decorações de fundo */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0" style={{ background: 'radial-gradient(circle at 75% 40%, rgba(255,255,255,0.07) 0%, transparent 55%)' }} />
          <div className="absolute inset-0" style={{ background: 'radial-gradient(circle at 15% 85%, rgba(245,166,35,0.08) 0%, transparent 40%)' }} />
          {!form.image_url && (
            <>
              <div className="absolute top-4 right-4 w-16 h-16 rounded-full bg-white/5" />
              <div className="absolute top-8 right-8 w-10 h-10 rounded-full bg-yellow-400/10" />
            </>
          )}
        </div>

        {/* Imagem do produto */}
        {form.image_url && (
          <div className="absolute right-0 top-0 bottom-0 w-[40%] pointer-events-none">
            <div
              className="absolute inset-y-0 left-0 w-12 z-10"
              style={{ background: `linear-gradient(to right, ${fadeColor}, transparent)` }}
            />
            <Image
              src={form.image_url}
              alt="preview"
              fill
              className="object-cover object-top"
              sizes="40vw"
            />
          </div>
        )}

        {/* Conteúdo */}
        <div className="relative z-10 h-full flex flex-col justify-end p-5 max-w-[55%]">
          {/* Badge */}
          {form.badge_text && (
            <div className="inline-flex items-center gap-1 bg-[#FF6B00] text-white text-[0.55rem] font-bold px-2 py-1 rounded-full mb-2 uppercase tracking-wider w-fit">
              <Sparkles className="w-2 h-2" />
              {form.badge_text}
            </div>
          )}

          {/* Título */}
          <div className="font-bold text-white leading-tight mb-1.5" style={{ fontSize: 'clamp(14px, 2.5vw, 22px)' }}>
            {form.title || <span className="opacity-40">Título do banner</span>}
            {form.title_highlight && (
              <>
                {' '}
                <br />
                <span
                  className="font-bold"
                  style={{
                    background: 'linear-gradient(90deg, #FFD600, #fff, #9DC4FF)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  {form.title_highlight}
                </span>
              </>
            )}
          </div>

          {/* Subtítulo */}
          {form.subtitle && (
            <p className="text-white/75 mb-2 line-clamp-2" style={{ fontSize: 'clamp(9px, 1.2vw, 12px)' }}>
              {form.subtitle}
            </p>
          )}

          {/* Botão CTA simulado */}
          <div
            className="inline-flex items-center gap-1 text-white font-bold rounded-full px-3 py-1.5 w-fit"
            style={{ background: form.cta_bg_color ?? '#FF6B00', fontSize: 'clamp(8px, 1vw, 11px)' }}
          >
            {form.cta_label || 'Ver coleção'}
            <ArrowRight style={{ width: '0.65em', height: '0.65em' }} />
          </div>
        </div>
      </div>

      {/* Nota */}
      <p className="text-[0.65rem] text-muted-foreground mt-1.5 text-center">
        O gradiente animado do texto destaque é exibido somente na loja.
      </p>
    </div>
  )
}

// ---------- Página principal ----------
export default function AdminBannersPage() {
  const [banners, setBanners] = useState<HeroBanner[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<HeroBanner | null>(null)
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [form, setForm] = useState<BannerFormData>(EMPTY_FORM)
  const fileRef = useRef<HTMLInputElement>(null)

  const refresh = () => getAllBanners().then(setBanners)
  useEffect(() => { refresh() }, [])

  const openNew = () => {
    setEditing(null)
    setForm({ ...EMPTY_FORM, sort_order: banners.length })
    setShowForm(true)
  }

  const openEdit = (b: HeroBanner) => {
    setEditing(b)
    setForm({
      title: b.title,
      title_highlight: b.title_highlight,
      subtitle: b.subtitle ?? '',
      badge_text: b.badge_text ?? '',
      cta_label: b.cta_label,
      cta_href: b.cta_href,
      bg_from: b.bg_from,
      bg_via: b.bg_via ?? '',
      bg_to: b.bg_to,
      image_url: b.image_url ?? null,
      banner_height: b.banner_height ?? 360,
      cta_bg_color: b.cta_bg_color ?? '#FF6B00',
      sort_order: b.sort_order,
      active: b.active,
    })
    setShowForm(true)
  }

  const handleImageUpload = async (file: File) => {
    if (!file.type.startsWith('image/')) { toast.error('Selecione uma imagem válida'); return }
    setUploading(true)
    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fileName: file.name, contentType: file.type }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      const uploadRes = await fetch(data.signedUrl, {
        method: 'PUT',
        headers: { 'Content-Type': file.type },
        body: file,
      })
      if (!uploadRes.ok) throw new Error('Falha no upload')
      setForm((prev) => ({ ...prev, image_url: data.publicUrl }))
      toast.success('Imagem enviada!')
    } catch (err) {
      toast.error('Erro ao enviar imagem')
      console.error(err)
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.title) { toast.error('Título obrigatório'); return }
    setLoading(true)

    const payload: BannerFormData = {
      ...form,
      bg_via: form.bg_via || null,
      subtitle: form.subtitle || null,
      badge_text: form.badge_text || null,
      image_url: form.image_url || null,
    }

    const result = editing
      ? await updateBanner(editing.id, payload)
      : await createBanner(payload)

    if (result.error) {
      toast.error(result.error)
    } else {
      toast.success(editing ? 'Banner atualizado!' : 'Banner criado!')
      setShowForm(false)
      setEditing(null)
      refresh()
    }
    setLoading(false)
  }

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Excluir banner "${title}"?`)) return
    const result = await deleteBanner(id)
    if (result.error) toast.error(result.error)
    else { toast.success('Banner excluído'); refresh() }
  }

  const handleToggleActive = async (b: HeroBanner) => {
    const result = await updateBanner(b.id, { active: !b.active })
    if (result.error) toast.error(result.error)
    else refresh()
  }

  const handleMove = async (index: number, dir: -1 | 1) => {
    const swap = index + dir
    if (swap < 0 || swap >= banners.length) return
    const updated = [...banners]
    ;[updated[index], updated[swap]] = [updated[swap], updated[index]]
    const reordered = updated.map((b, i) => ({ id: b.id, sort_order: i }))
    setBanners(updated.map((b, i) => ({ ...b, sort_order: i })))
    await reorderBanners(reordered)
  }

  const f = (k: keyof BannerFormData, v: string | boolean | number | null) =>
    setForm((prev) => ({ ...prev, [k]: v }))

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl font-bold">Banners do Carrossel</h1>
          <p className="text-sm text-muted-foreground mt-1">Gerencie os slides exibidos no topo da página inicial.</p>
        </div>
        <Button onClick={openNew} size="sm">
          <Plus className="w-4 h-4 mr-1" /> Novo banner
        </Button>
      </div>

      {/* Formulário + Prévia */}
      {showForm && (
        <div className="bg-white rounded-xl border border-border p-6 mb-6">
          <h2 className="font-semibold mb-5">{editing ? 'Editar Banner' : 'Novo Banner'}</h2>

          {/* Layout: campos à esquerda, prévia à direita */}
          <div className="grid grid-cols-1 xl:grid-cols-[1fr_380px] gap-8">

            {/* Campos do formulário */}
            <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">

              <div>
                <Label>Título <span className="text-muted-foreground font-normal">(primeira linha)</span></Label>
                <Input value={form.title} onChange={(e) => f('title', e.target.value)} placeholder='Ex: "Vista-se com"' className="mt-1.5" required />
              </div>

              <div>
                <Label>Destaque <span className="text-muted-foreground font-normal">(segunda linha — animado)</span></Label>
                <Input value={form.title_highlight} onChange={(e) => f('title_highlight', e.target.value)} placeholder='Ex: "Muito Estilo"' className="mt-1.5" />
              </div>

              <div className="sm:col-span-2">
                <Label>Subtítulo</Label>
                <Input value={form.subtitle ?? ''} onChange={(e) => f('subtitle', e.target.value)} placeholder="Descrição exibida abaixo do título" className="mt-1.5" />
              </div>

              <div>
                <Label>Texto do badge</Label>
                <Input value={form.badge_text ?? ''} onChange={(e) => f('badge_text', e.target.value)} placeholder='Ex: "Nova Coleção 2026"' className="mt-1.5" />
              </div>

              <div>
                <Label>Ordem</Label>
                <Input type="number" min={0} value={form.sort_order} onChange={(e) => f('sort_order', Number(e.target.value))} className="mt-1.5" />
              </div>

              <div>
                <Label>Texto do botão</Label>
                <Input value={form.cta_label} onChange={(e) => f('cta_label', e.target.value)} placeholder="Ver coleção" className="mt-1.5" />
              </div>
              <div>
                <Label>Link do botão</Label>
                <Input value={form.cta_href} onChange={(e) => f('cta_href', e.target.value)} placeholder="/produtos" className="mt-1.5" />
              </div>

              {/* Gradiente */}
              <div className="sm:col-span-2">
                <Label>Gradiente de fundo</Label>
                <div className="flex items-center gap-3 mt-1.5">
                  <div className="flex items-center gap-1.5">
                    <input type="color" value={form.bg_from} onChange={(e) => f('bg_from', e.target.value)} className="w-9 h-9 rounded cursor-pointer border border-border p-0.5" />
                    <span className="text-xs text-muted-foreground">De</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <input type="color" value={form.bg_via || '#0064D2'} onChange={(e) => f('bg_via', e.target.value)} className="w-9 h-9 rounded cursor-pointer border border-border p-0.5" />
                    <span className="text-xs text-muted-foreground">Via</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <input type="color" value={form.bg_to} onChange={(e) => f('bg_to', e.target.value)} className="w-9 h-9 rounded cursor-pointer border border-border p-0.5" />
                    <span className="text-xs text-muted-foreground">Até</span>
                  </div>
                  <div
                    className="flex-1 h-9 rounded-lg"
                    style={{ background: `linear-gradient(to right, ${form.bg_from}, ${form.bg_via || form.bg_from}, ${form.bg_to})` }}
                  />
                </div>
              </div>

              {/* Altura do banner */}
              <div className="sm:col-span-2">
                <Label>
                  Altura do banner
                  <span className="text-muted-foreground font-normal ml-1">({form.banner_height}px)</span>
                </Label>
                <div className="mt-2 flex items-center gap-3">
                  <input
                    type="range"
                    min={220}
                    max={560}
                    step={20}
                    value={form.banner_height}
                    onChange={(e) => f('banner_height', Number(e.target.value))}
                    className="flex-1 accent-primary h-2 rounded-full cursor-pointer"
                  />
                </div>
                <div className="flex gap-2 mt-2">
                  {HEIGHT_PRESETS.map((p) => (
                    <button
                      key={p.value}
                      type="button"
                      onClick={() => f('banner_height', p.value)}
                      className={`text-xs px-3 py-1 rounded-full border transition-colors ${form.banner_height === p.value ? 'bg-primary text-white border-primary' : 'border-border hover:bg-muted'}`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Cor do botão */}
              <div className="sm:col-span-2">
                <Label>Cor do botão</Label>
                <div className="mt-1.5 flex items-center gap-3">
                  <input
                    type="color"
                    value={form.cta_bg_color}
                    onChange={(e) => f('cta_bg_color', e.target.value)}
                    className="w-10 h-10 rounded-lg cursor-pointer border border-border p-0.5 flex-shrink-0"
                  />
                  <div
                    className="flex items-center gap-1.5 px-4 py-2 rounded-full text-white text-sm font-bold select-none"
                    style={{ background: form.cta_bg_color }}
                  >
                    {form.cta_label || 'Ver coleção'}
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                  <button
                    type="button"
                    onClick={() => f('cta_bg_color', '#FF6B00')}
                    className="text-xs text-muted-foreground hover:text-foreground underline"
                  >
                    Resetar
                  </button>
                </div>
              </div>

              {/* Imagem */}
              <div className="sm:col-span-2">
                <Label>Imagem do produto <span className="text-muted-foreground font-normal">(opcional — aparece à direita no slide)</span></Label>
                <div className="mt-1.5 flex gap-3 items-start">
                  <div className="relative w-24 h-32 rounded-xl overflow-hidden border border-border bg-muted flex-shrink-0 flex items-center justify-center">
                    {form.image_url ? (
                      <>
                        <Image src={form.image_url} alt="Preview" fill className="object-cover" />
                        <button type="button" onClick={() => f('image_url', null)} className="absolute top-1 right-1 bg-black/60 hover:bg-black/80 text-white rounded-full p-0.5 transition-colors" title="Remover imagem">
                          <X className="w-3 h-3" />
                        </button>
                      </>
                    ) : (
                      <ImageIcon className="w-7 h-7 text-muted-foreground/40" />
                    )}
                  </div>
                  <div className="flex-1 flex flex-col gap-2">
                    <button type="button" onClick={() => fileRef.current?.click()} disabled={uploading} className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg text-sm hover:bg-muted transition-colors disabled:opacity-50">
                      {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                      {uploading ? 'Enviando...' : 'Fazer upload de imagem'}
                    </button>
                    <Input value={form.image_url ?? ''} onChange={(e) => f('image_url', e.target.value || null)} placeholder="Ou cole a URL da imagem aqui" className="text-xs" />
                    <p className="text-xs text-muted-foreground">JPG, PNG, WEBP · Recomendado: proporção 3/4 (retrato)</p>
                  </div>
                </div>
                <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0])} />
              </div>

              {/* Ativo */}
              {editing && (
                <div className="flex items-center gap-2">
                  <input type="checkbox" id="active" checked={form.active} onChange={(e) => f('active', e.target.checked)} className="w-4 h-4 accent-primary" />
                  <label htmlFor="active" className="text-sm">Ativo</label>
                </div>
              )}

              <div className="sm:col-span-2 flex gap-3">
                <Button type="submit" disabled={loading || uploading}>
                  {loading ? 'Salvando...' : editing ? 'Salvar alterações' : 'Criar banner'}
                </Button>
                <Button type="button" variant="outline" onClick={() => { setShowForm(false); setEditing(null) }}>
                  Cancelar
                </Button>
              </div>
            </form>

            {/* Prévia ao vivo */}
            <BannerPreview form={form} />
          </div>
        </div>
      )}

      {/* Lista */}
      {banners.length === 0 ? (
        <div className="bg-white rounded-xl border border-border text-center py-16">
          <ImagePlay className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
          <p className="font-medium">Nenhum banner cadastrado</p>
          <p className="text-sm text-muted-foreground mt-1">Crie o primeiro banner do carrossel.</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-border overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-muted-foreground">
              <tr>
                <th className="text-left px-4 py-3 font-medium">Prévia</th>
                <th className="text-left px-4 py-3 font-medium">Título</th>
                <th className="text-left px-4 py-3 font-medium hidden md:table-cell">Link</th>
                <th className="text-center px-4 py-3 font-medium">Ordem</th>
                <th className="text-center px-4 py-3 font-medium">Status</th>
                <th className="text-right px-4 py-3 font-medium">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {banners.map((b, i) => (
                <tr key={b.id} className="hover:bg-muted/20 transition-colors">
                  <td className="px-4 py-3">
                    <div
                      className="relative w-14 h-9 rounded-lg flex-shrink-0 overflow-hidden"
                      style={{ background: `linear-gradient(to right, ${b.bg_from}, ${b.bg_via ?? b.bg_from}, ${b.bg_to})` }}
                    >
                      {b.image_url && <Image src={b.image_url} alt="" fill className="object-cover opacity-60" />}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-medium leading-snug">{b.title}</p>
                    {b.title_highlight && <p className="text-xs text-muted-foreground">{b.title_highlight}</p>}
                    {b.badge_text && (
                      <span className="text-[0.6rem] bg-primary/10 text-primary font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wide">
                        {b.badge_text}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground font-mono text-xs hidden md:table-cell">{b.cta_href}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center gap-1">
                      <button onClick={() => handleMove(i, -1)} disabled={i === 0} className="p-1 text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed">
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <span className="w-5 text-center text-muted-foreground">{b.sort_order}</span>
                      <button onClick={() => handleMove(i, 1)} disabled={i === banners.length - 1} className="p-1 text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed">
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button onClick={() => handleToggleActive(b)} title={b.active ? 'Desativar' : 'Ativar'}>
                      <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full transition-colors ${b.active ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-muted text-muted-foreground hover:bg-muted/80'}`}>
                        {b.active ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                        {b.active ? 'Ativo' : 'Inativo'}
                      </span>
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => openEdit(b)} className="p-2 text-muted-foreground hover:text-primary transition-colors rounded-lg hover:bg-muted">
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(b.id, b.title)} className="p-2 text-muted-foreground hover:text-destructive transition-colors rounded-lg hover:bg-muted">
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
