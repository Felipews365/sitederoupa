'use client'

import { useState, useEffect, useRef } from 'react'
import { Plus, Pencil, Trash2, ImagePlay, ArrowUp, ArrowDown, Eye, EyeOff, Upload, X, Loader2, Image as ImageIcon, ArrowRight, Sparkles, Smartphone } from 'lucide-react'
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
  image_url_2: null,
  image_url_3: null,
  banner_height: 360,
  template: 'gradient',
  image_position: 'right',
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
  const previewHeight = Math.max(Math.round((form.banner_height ?? 360) * 0.44), 120)
  const template = form.template ?? 'gradient'
  const photoLeft = form.image_position === 'left'

  const Hl = ({ t }: { t: string }) => (
    <span style={{ background: 'linear-gradient(90deg,#FFD600,#fff,#9DC4FF)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{t}</span>
  )
  const CTA = ({ bg, small }: { bg?: string; small?: boolean }) => (
    <div className="inline-flex items-center gap-1 text-white font-bold rounded-full w-fit" style={{ background: bg ?? '#FF6B00', fontSize: small ? '7px' : 'clamp(7px,0.9vw,10px)', padding: small ? '2px 6px' : undefined }}>
      {form.cta_label || 'Ver coleção'}<ArrowRight style={{ width: '0.65em', height: '0.65em' }} />
    </div>
  )

  return (
    <div className="sticky top-6">
      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
        Prévia em tempo real
      </p>

      <div
        className="relative rounded-2xl overflow-hidden w-full"
        style={{ height: previewHeight, background: template === 'gradient' ? gradient : template === 'fashion' ? '#f5f0ec' : '#fff' }}
      >
        {(() => {
          if (template === 'diagonal') {
            const shapeClipRight = 'polygon(22% 0, 100% 0, 100% 100%, 0 100%)'
            const shapeClipLeft  = 'polygon(0 0, 78% 0, 100% 100%, 0 100%)'
            const photoClipLeft  = 'polygon(0 0, 100% 0, 82% 100%, 0 100%)'
            const photoClipRight = 'polygon(18% 0, 100% 0, 100% 100%, 0 100%)'
            return (
              <>
                {form.image_url && (
                  <div className={`absolute inset-y-0 ${photoLeft ? 'left-0' : 'right-0'} w-[54%]`}
                    style={{ clipPath: photoLeft ? photoClipLeft : photoClipRight }}>
                    <Image src={form.image_url} alt="preview" fill className="object-cover object-center" sizes="40vw" />
                  </div>
                )}
                {photoLeft ? (
                  <div className="absolute inset-y-0 right-0 w-[60%] z-10" style={{ background: gradient, clipPath: shapeClipRight }} />
                ) : (
                  <div className="absolute inset-y-0 left-0 w-[60%] z-10" style={{ background: gradient, clipPath: shapeClipLeft }} />
                )}
                <div className={`absolute inset-y-0 ${photoLeft ? 'right-0' : 'left-0'} w-[52%] flex flex-col justify-center px-4 z-20`}>
                  {form.badge_text && <div className="inline-flex items-center gap-1 bg-white/20 text-white text-[0.5rem] font-bold px-2 py-0.5 rounded-full mb-1.5 uppercase tracking-wider w-fit"><Sparkles className="w-2 h-2" />{form.badge_text}</div>}
                  <div className="font-bold text-white leading-tight mb-1" style={{ fontSize: 'clamp(13px,2.2vw,20px)' }}>
                    {form.title || <span className="opacity-40">Título</span>}
                    {form.title_highlight && <><br /><Hl t={form.title_highlight} /></>}
                  </div>
                  {form.subtitle && <p className="text-white/75 mb-1.5 line-clamp-2" style={{ fontSize: 'clamp(8px,1vw,11px)' }}>{form.subtitle}</p>}
                  <CTA bg={form.cta_bg_color ?? '#FF6B00'} />
                </div>
              </>
            )
          }

          if (template === 'fashion') {
            const shapeClipRight = 'polygon(18% 0, 100% 0, 100% 100%, 0 100%)'
            const shapeClipLeft  = 'polygon(0 0, 82% 0, 100% 100%, 0 100%)'
            const badgeLeft  = form.image_url ? (photoLeft ? '40%' : undefined) : '18%'
            const badgeRight = form.image_url ? (!photoLeft ? '40%' : undefined) : '18%'
            return (
              <>
                {photoLeft ? (
                  <div className="absolute inset-y-0 right-0 w-[68%]" style={{ background: gradient, clipPath: shapeClipRight }} />
                ) : (
                  <div className="absolute inset-y-0 left-0 w-[68%]" style={{ background: gradient, clipPath: shapeClipLeft }} />
                )}
                {form.image_url && (
                  <div className={`absolute inset-y-0 ${photoLeft ? 'left-0' : 'right-0'} w-[46%]`}>
                    <Image src={form.image_url} alt="preview" fill className="object-cover object-center" sizes="40vw" />
                  </div>
                )}
                {form.badge_text && (
                  <div className="absolute z-20" style={{ left: badgeLeft, right: badgeRight, top: '50%', transform: `translate(${badgeLeft ? '-50%' : '50%'},-50%)` }}>
                    <div className="w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center text-center p-1" style={{ border: `2px solid ${form.bg_from}40` }}>
                      <span className="text-[0.4rem] font-black uppercase leading-tight" style={{ color: form.bg_from }}>{form.badge_text}</span>
                    </div>
                  </div>
                )}
                <div className={`absolute inset-y-0 ${photoLeft ? 'right-0' : 'left-0'} w-[56%] flex flex-col justify-center px-4 z-10`}>
                  {form.title && <p className="text-white/65 font-semibold uppercase tracking-widest mb-1" style={{ fontSize: 'clamp(7px,1vw,10px)' }}>{form.title}</p>}
                  <div className="font-black text-white leading-none mb-2" style={{ fontSize: 'clamp(20px,4vw,36px)' }}>
                    <Hl t={form.title_highlight || form.title || 'DESTAQUE'} />
                  </div>
                  {form.subtitle && <p className="text-white/75 line-clamp-2 mb-2" style={{ fontSize: 'clamp(8px,1vw,11px)' }}>{form.subtitle}</p>}
                  <CTA bg={form.cta_bg_color ?? '#FF6B00'} />
                </div>
              </>
            )
          }

          if (template === 'magazine') {
            const panelClipRight = 'polygon(14% 0, 100% 0, 100% 100%, 0 100%)'
            const photoClipRight = 'polygon(17% 0, 100% 0, 100% 100%, 3% 100%)'
            const panelClipLeft  = 'polygon(0 0, 86% 0, 100% 100%, 0 100%)'
            const photoClipLeft  = 'polygon(0 0, 83% 0, 97% 100%, 0 100%)'
            return (
              <>
                {photoLeft ? (
                  <div className="absolute inset-y-0 left-0 w-[60%]" style={{ background: gradient, clipPath: panelClipLeft }} />
                ) : (
                  <div className="absolute inset-y-0 right-0 w-[60%]" style={{ background: gradient, clipPath: panelClipRight }} />
                )}
                {form.image_url && (
                  <div className={`absolute inset-y-0 ${photoLeft ? 'left-0' : 'right-0'} w-[57%] z-10`}
                    style={{ clipPath: photoLeft ? photoClipLeft : photoClipRight }}>
                    <Image src={form.image_url} alt="preview" fill className="object-cover object-center" sizes="40vw" />
                  </div>
                )}
                <div className={`absolute inset-y-0 ${photoLeft ? 'right-0' : 'left-0'} w-[50%] flex flex-col justify-center px-4 z-20`}>
                  {form.badge_text && <p className="font-bold uppercase tracking-widest mb-1" style={{ color: form.bg_from, fontSize: 'clamp(7px,1vw,10px)' }}>{form.badge_text}</p>}
                  <div className="font-black leading-none mb-1" style={{ color: form.bg_from, fontSize: 'clamp(16px,3vw,28px)' }}>{form.title || <span className="opacity-30">Título</span>}</div>
                  {form.title_highlight && <div className="font-bold leading-tight mb-1.5" style={{ color: form.bg_to, fontSize: 'clamp(12px,2vw,20px)' }}>{form.title_highlight}</div>}
                  {form.subtitle && <p className="text-gray-500 line-clamp-2 mb-2" style={{ fontSize: 'clamp(8px,1vw,11px)' }}>{form.subtitle}</p>}
                  <CTA bg={form.cta_bg_color ?? form.bg_from} />
                </div>
              </>
            )
          }

          if (template === 'spring') {
            return (
              <>
                <div className={`absolute inset-y-0 ${!photoLeft ? 'left-0' : 'right-0'} w-[55%]`}
                  style={{ background: gradient, clipPath: !photoLeft ? 'polygon(0 0, 78% 0, 100% 100%, 0 100%)' : 'polygon(22% 0, 100% 0, 100% 100%, 0 100%)' }} />
                {form.image_url && (
                  <div className={`absolute inset-y-0 ${!photoLeft ? 'left-0' : 'right-0'} w-[50%]`}
                    style={{ clipPath: !photoLeft ? 'polygon(0 0, 75% 0, 100% 100%, 0 100%)' : 'polygon(25% 0, 100% 0, 100% 100%, 0 100%)' }}>
                    <Image src={form.image_url} alt="preview" fill className="object-cover object-center" sizes="40vw" />
                  </div>
                )}
                {form.badge_text && (
                  <div className="absolute z-20 pointer-events-none"
                    style={{ [!photoLeft ? 'left' : 'right']: '42%', top: '50%', transform: 'translate(50%, -50%)' }}>
                    <div className="w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center text-center p-1"
                      style={{ border: `2px solid ${form.bg_from}40` }}>
                      <span className="text-[0.38rem] font-black uppercase leading-tight" style={{ color: form.bg_from }}>{form.badge_text}</span>
                    </div>
                  </div>
                )}
                <div className={`absolute inset-y-0 ${!photoLeft ? 'right-0' : 'left-0'} w-[48%] flex flex-col justify-center px-4 z-10`}>
                  {form.title && <p className="font-bold uppercase tracking-widest mb-0.5" style={{ color: form.bg_from, fontSize: 'clamp(6px,0.9vw,9px)' }}>{form.title}</p>}
                  <div className="font-black leading-none mb-1" style={{ fontSize: 'clamp(16px,3vw,28px)', color: '#1a1a2e' }}>
                    <Hl t={form.title_highlight || form.title || 'DESTAQUE'} />
                  </div>
                  {form.subtitle && <p className="text-gray-500 line-clamp-2 mb-2" style={{ fontSize: 'clamp(7px,1vw,10px)' }}>{form.subtitle}</p>}
                  <CTA bg={form.cta_bg_color ?? '#FF6B00'} />
                </div>
              </>
            )
          }

          if (template === 'sale') {
            return (
              <>
                <div className={`absolute inset-y-0 ${!photoLeft ? 'right-0' : 'left-0'} w-[58%]`}
                  style={{ background: gradient, clipPath: !photoLeft ? 'polygon(20% 0, 100% 0, 100% 100%, 0 100%)' : 'polygon(0 0, 80% 0, 100% 100%, 0 100%)' }} />
                {form.image_url && (
                  <div className={`absolute inset-y-0 ${!photoLeft ? 'left-0' : 'right-0'} w-[48%]`}
                    style={{ clipPath: !photoLeft ? 'polygon(0 0, 100% 0, 82% 100%, 0 100%)' : 'polygon(18% 0, 100% 0, 100% 100%, 0 100%)' }}>
                    <Image src={form.image_url} alt="preview" fill className="object-cover object-center" sizes="40vw" />
                  </div>
                )}
                {form.badge_text && (
                  <div className="absolute z-20 pointer-events-none" style={{ left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }}>
                    <div className="w-12 h-12 rounded-full bg-white shadow-lg flex flex-col items-center justify-center text-center p-1"
                      style={{ border: `3px solid ${form.bg_from}50` }}>
                      <span className="text-[0.38rem] font-black uppercase leading-none" style={{ color: form.bg_from }}>DISC.</span>
                      <span className="font-black leading-none" style={{ fontSize: 'clamp(10px,1.5vw,14px)', color: form.bg_from }}>{form.badge_text}</span>
                      <span className="text-[0.32rem] font-semibold uppercase" style={{ color: form.bg_from }}>ALL ITEM</span>
                    </div>
                  </div>
                )}
                <div className={`absolute inset-y-0 ${!photoLeft ? 'right-0' : 'left-0'} w-[50%] flex flex-col justify-center px-4 z-10`}>
                  {form.title && <p className="text-white/70 font-semibold uppercase tracking-widest mb-0.5" style={{ fontSize: 'clamp(6px,0.9vw,9px)' }}>{form.title}</p>}
                  <div className="font-black text-white leading-none mb-1" style={{ fontSize: 'clamp(20px,4vw,36px)' }}>
                    <Hl t={form.title_highlight || form.title || 'SALE'} />
                  </div>
                  {form.subtitle && <p className="text-white/75 line-clamp-2 mb-2" style={{ fontSize: 'clamp(7px,1vw,10px)' }}>{form.subtitle}</p>}
                  <CTA bg={form.cta_bg_color ?? '#FF6B00'} />
                </div>
              </>
            )
          }

          if (template === 'strips') {
            const strips = [
              { url: form.image_url, clip: 'polygon(0 0, 100% 0, 88% 100%, 0 100%)', left: '0%' },
              { url: form.image_url_2, clip: 'polygon(12% 0, 100% 0, 88% 100%, 0 100%)', left: '29%' },
              { url: form.image_url_3, clip: 'polygon(12% 0, 100% 0, 100% 100%, 0 100%)', left: '58%' },
            ]
            return (
              <>
                <div className="absolute inset-y-0 left-0 w-[40%] flex flex-col justify-center px-3 z-10">
                  {form.badge_text && <p className="font-bold uppercase tracking-widest mb-0.5" style={{ color: form.bg_from, fontSize: 'clamp(6px,0.9vw,9px)' }}>{form.badge_text}</p>}
                  <div className="font-black text-gray-900 leading-none mb-0.5" style={{ fontSize: 'clamp(12px,2vw,18px)' }}>{form.title || 'NEW ARRIVAL'}</div>
                  <div className="font-bold italic mb-1.5" style={{ fontSize: 'clamp(14px,2.5vw,22px)', color: form.bg_from }}>{form.title_highlight || 'Sale'}</div>
                  <CTA bg={form.cta_bg_color ?? '#FF6B00'} />
                </div>
                <div className="absolute inset-y-0 right-0 w-[63%]">
                  {strips.map((s, i) => (
                    <div key={i} className="absolute inset-y-0 w-[44%]" style={{ left: s.left, clipPath: s.clip }}>
                      {s.url
                        ? <Image src={s.url} alt="" fill className="object-cover object-center" sizes="20vw" />
                        : <div className="absolute inset-0" style={{ background: gradient, opacity: 0.7 + i * 0.1 }} />}
                    </div>
                  ))}
                </div>
              </>
            )
          }

          if (template === 'duo') {
            return (
              <>
                {form.image_url && (
                  <div className="absolute inset-y-0 left-0 w-[55%]"
                    style={{ clipPath: 'polygon(0 0, 85% 0, 70% 100%, 0 100%)' }}>
                    <Image src={form.image_url} alt="preview" fill className="object-cover object-center" sizes="40vw" />
                  </div>
                )}
                {form.image_url_2 && (
                  <div className="absolute inset-y-0 left-0 w-[55%]"
                    style={{ clipPath: 'polygon(52% 0, 100% 0, 100% 100%, 37% 100%)' }}>
                    <Image src={form.image_url_2} alt="preview 2" fill className="object-cover object-center" sizes="25vw" />
                    <div className="absolute inset-y-0 left-0 w-1 bg-white" />
                  </div>
                )}
                <div className="absolute inset-y-0 right-0 w-[48%] flex flex-col justify-center px-4 z-10">
                  {form.title && <p className="font-bold uppercase tracking-widest mb-0.5" style={{ color: form.bg_from, fontSize: 'clamp(6px,0.9vw,9px)' }}>{form.title}</p>}
                  <div className="font-black leading-none mb-0.5" style={{ fontSize: 'clamp(12px,2vw,18px)', color: '#1a1a2e' }}>
                    <Hl t={form.title_highlight || form.title || 'NEW ARRIVAL'} />
                  </div>
                  <div className="font-bold italic mb-2" style={{ fontSize: 'clamp(14px,2.5vw,22px)', color: form.bg_from }}>{form.title_highlight || 'Sale'}</div>
                  {form.subtitle && <p className="text-gray-500 line-clamp-2 mb-2" style={{ fontSize: 'clamp(7px,1vw,10px)' }}>{form.subtitle}</p>}
                  <CTA bg={form.cta_bg_color ?? '#FF6B00'} />
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-1" style={{ background: form.bg_from }} />
              </>
            )
          }

          // gradiente (padrão)
          return (
            <>
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute inset-0" style={{ background: 'radial-gradient(circle at 75% 40%, rgba(255,255,255,0.07) 0%, transparent 55%)' }} />
                {!form.image_url && <div className="absolute top-4 right-4 w-16 h-16 rounded-full bg-white/5" />}
              </div>
              {form.image_url && (
                <div className={`absolute ${photoLeft ? 'left-0' : 'right-0'} top-0 bottom-0 w-[40%] pointer-events-none`}>
                  <div className={`absolute inset-y-0 ${photoLeft ? 'right-0' : 'left-0'} w-12 z-10`}
                    style={{ background: `linear-gradient(to ${photoLeft ? 'left' : 'right'}, ${fadeColor}, transparent)` }} />
                  <Image src={form.image_url} alt="preview" fill className="object-cover object-top" sizes="40vw" />
                </div>
              )}
              <div className={`relative z-10 h-full flex flex-col justify-end p-5 max-w-[55%] ${photoLeft && form.image_url ? 'ml-auto' : ''}`}>
                {form.badge_text && <div className="inline-flex items-center gap-1 bg-[#FF6B00] text-white text-[0.55rem] font-bold px-2 py-1 rounded-full mb-2 uppercase tracking-wider w-fit"><Sparkles className="w-2 h-2" />{form.badge_text}</div>}
                <div className="font-bold text-white leading-tight mb-1.5" style={{ fontSize: 'clamp(14px,2.5vw,22px)' }}>
                  {form.title || <span className="opacity-40">Título do banner</span>}
                  {form.title_highlight && <><br /><Hl t={form.title_highlight} /></>}
                </div>
                {form.subtitle && <p className="text-white/75 mb-2 line-clamp-2" style={{ fontSize: 'clamp(9px,1.2vw,12px)' }}>{form.subtitle}</p>}
                <CTA bg={form.cta_bg_color ?? '#FF6B00'} />
              </div>
            </>
          )
        })()}
      </div>

      <p className="text-[0.65rem] text-muted-foreground mt-1 text-center">
        O gradiente animado do texto destaque é exibido somente na loja.
      </p>

      {/* ── Prévia Mobile ─────────────────────────────── */}
      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mt-4 mb-2 flex items-center gap-1.5">
        <Smartphone className="w-3 h-3" /> Mobile
      </p>
      <div className="flex justify-center">
        <div
          className="relative rounded-2xl overflow-hidden bg-white"
          style={{ width: 176, height: 290 }}
        >
          {template === 'diagonal' ? (() => {
            const side = photoLeft ? 'right' : 'left'
            const clip = photoLeft
              ? 'polygon(22% 0, 100% 0, 100% 100%, 0 100%)'
              : 'polygon(0 0, 78% 0, 100% 100%, 0 100%)'
            return (
              <>
                {form.image_url ? (
                  <div className="absolute inset-0">
                    <Image src={form.image_url} alt="mobile" fill
                      className={`object-cover ${photoLeft ? 'object-left' : 'object-right'}`} sizes="176px" />
                  </div>
                ) : <div className="absolute inset-0 bg-gray-100" />}
                <div className={`absolute inset-y-0 ${side}-0 w-[62%] z-10`}
                  style={{ background: gradient, clipPath: clip }} />
                <div className={`absolute inset-y-0 ${side}-0 w-[60%] flex flex-col justify-center px-3 z-20`}>
                  {form.badge_text && <div className="text-white/80 text-[0.42rem] font-bold uppercase tracking-wider mb-0.5">{form.badge_text}</div>}
                  <div className="font-bold text-white leading-tight mb-1" style={{ fontSize: '10px' }}>
                    {form.title || <span className="opacity-40">Título</span>}
                    {form.title_highlight && <><br /><Hl t={form.title_highlight} /></>}
                  </div>
                  {form.subtitle && <p className="text-white/75 line-clamp-2 mb-1" style={{ fontSize: '6.5px' }}>{form.subtitle}</p>}
                  <CTA bg={form.cta_bg_color ?? '#FF6B00'} small />
                </div>
              </>
            )
          })() : (
            /* Outros templates: mesmo layout desktop em container portrait */
            <div className="absolute inset-0" style={{ background: template === 'gradient' ? gradient : template === 'fashion' ? '#f5f0ec' : '#fff' }}>
              {(() => {
                if (template === 'gradient') return (
                  <>
                    {form.image_url && (
                      <div className={`absolute ${photoLeft ? 'left-0' : 'right-0'} top-0 bottom-0 w-[45%]`}>
                        <div className={`absolute inset-y-0 ${photoLeft ? 'right-0' : 'left-0'} w-8 z-10`}
                          style={{ background: `linear-gradient(to ${photoLeft ? 'left' : 'right'}, ${fadeColor}, transparent)` }} />
                        <Image src={form.image_url} alt="m" fill className="object-cover object-top" sizes="80px" />
                      </div>
                    )}
                    <div className={`relative z-10 h-full flex flex-col justify-end p-3 max-w-[60%] ${photoLeft && form.image_url ? 'ml-auto' : ''}`}>
                      {form.badge_text && <div className="inline-flex items-center gap-0.5 bg-[#FF6B00] text-white text-[0.4rem] font-bold px-1.5 py-0.5 rounded-full mb-1 uppercase w-fit"><Sparkles className="w-1.5 h-1.5" />{form.badge_text}</div>}
                      <div className="font-bold text-white leading-tight mb-1" style={{ fontSize: '11px' }}>
                        {form.title || <span className="opacity-40">Título</span>}
                        {form.title_highlight && <><br /><Hl t={form.title_highlight} /></>}
                      </div>
                      {form.subtitle && <p className="text-white/75 mb-1 line-clamp-2" style={{ fontSize: '6.5px' }}>{form.subtitle}</p>}
                      <CTA bg={form.cta_bg_color ?? '#FF6B00'} small />
                    </div>
                  </>
                )
                return (
                  <div className="h-full flex items-center justify-center">
                    <p className="text-[0.5rem] text-muted-foreground text-center px-2">Prévia mobile disponível apenas no template Diagonal</p>
                  </div>
                )
              })()}
            </div>
          )}
        </div>
      </div>
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
  const [uploading2, setUploading2] = useState(false)
  const [uploading3, setUploading3] = useState(false)
  const [form, setForm] = useState<BannerFormData>(EMPTY_FORM)
  const fileRef = useRef<HTMLInputElement>(null)
  const fileRef2 = useRef<HTMLInputElement>(null)
  const fileRef3 = useRef<HTMLInputElement>(null)

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
      image_url_2: b.image_url_2 ?? null,
      image_url_3: b.image_url_3 ?? null,
      banner_height: b.banner_height ?? 360,
      cta_bg_color: b.cta_bg_color ?? '#FF6B00',
      template: b.template ?? 'gradient',
      image_position: b.image_position ?? (() => {
        const t = b.template ?? 'gradient'
        return (t === 'gradient' || t === 'magazine') ? 'right' : 'left'
      })(),
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

  const handleImageUpload2 = async (file: File) => {
    if (!file.type.startsWith('image/')) { toast.error('Selecione uma imagem válida'); return }
    setUploading2(true)
    try {
      const res = await fetch('/api/upload', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ fileName: file.name, contentType: file.type }) })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      const uploadRes = await fetch(data.signedUrl, { method: 'PUT', headers: { 'Content-Type': file.type }, body: file })
      if (!uploadRes.ok) throw new Error('Falha no upload')
      setForm((prev) => ({ ...prev, image_url_2: data.publicUrl }))
      toast.success('Imagem 2 enviada!')
    } catch (err) { toast.error('Erro ao enviar imagem 2'); console.error(err) }
    finally { setUploading2(false) }
  }

  const handleImageUpload3 = async (file: File) => {
    if (!file.type.startsWith('image/')) { toast.error('Selecione uma imagem válida'); return }
    setUploading3(true)
    try {
      const res = await fetch('/api/upload', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ fileName: file.name, contentType: file.type }) })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      const uploadRes = await fetch(data.signedUrl, { method: 'PUT', headers: { 'Content-Type': file.type }, body: file })
      if (!uploadRes.ok) throw new Error('Falha no upload')
      setForm((prev) => ({ ...prev, image_url_3: data.publicUrl }))
      toast.success('Imagem 3 enviada!')
    } catch (err) { toast.error('Erro ao enviar imagem 3'); console.error(err) }
    finally { setUploading3(false) }
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
      image_url_2: form.image_url_2 || null,
      image_url_3: form.image_url_3 || null,
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

              {/* Template */}
              <div className="sm:col-span-2">
                <Label>Estilo do banner</Label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-1.5">
                  <button type="button"
                    onClick={() => setForm(p => ({ ...p, template: 'gradient', image_position: p.image_position ?? 'right' }))}
                    className={`border-2 rounded-xl p-3 transition-colors text-left ${form.template === 'gradient' ? 'border-primary bg-primary/5' : 'border-border hover:bg-muted/50'}`}>
                    <div className="h-10 rounded-lg mb-2 bg-gradient-to-r from-[#001C45] to-[#0086FF]" />
                    <span className="text-sm font-semibold">Gradiente</span>
                    <p className="text-xs text-muted-foreground font-normal mt-0.5">Fundo colorido gradiente</p>
                  </button>
                  <button type="button"
                    onClick={() => setForm(p => ({ ...p, template: 'diagonal', image_position: p.image_position ?? 'left' }))}
                    className={`border-2 rounded-xl p-3 transition-colors text-left ${form.template === 'diagonal' ? 'border-primary bg-primary/5' : 'border-border hover:bg-muted/50'}`}>
                    <div className="h-10 rounded-lg mb-2 bg-white relative overflow-hidden border border-border/50">
                      <div className="absolute inset-y-0 left-0 w-[55%] bg-gray-200" style={{ clipPath: 'polygon(0 0, 100% 0, 80% 100%, 0 100%)' }} />
                      <div className="absolute inset-y-0 right-0 w-[55%] bg-gradient-to-br from-[#0064D2] to-[#003F8A]" style={{ clipPath: 'polygon(25% 0, 100% 0, 100% 100%, 0 100%)' }} />
                    </div>
                    <span className="text-sm font-semibold">Diagonal</span>
                    <p className="text-xs text-muted-foreground font-normal mt-0.5">Foto + cor diagonal</p>
                  </button>
                  <button type="button"
                    onClick={() => setForm(p => ({ ...p, template: 'fashion', image_position: p.image_position ?? 'left' }))}
                    className={`border-2 rounded-xl p-3 transition-colors text-left ${form.template === 'fashion' ? 'border-primary bg-primary/5' : 'border-border hover:bg-muted/50'}`}>
                    <div className="h-10 rounded-lg mb-2 relative overflow-hidden border border-border/50" style={{ background: '#f5f0ec' }}>
                      <div className="absolute inset-y-0 left-0 w-[45%] bg-gray-300/60" />
                      <div className="absolute inset-y-0 right-0 w-[65%] bg-gradient-to-br from-[#e05580] to-[#c23060]" style={{ clipPath: 'polygon(20% 0, 100% 0, 100% 100%, 0 100%)' }} />
                      <div className="absolute left-[38%] top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-white shadow-sm" />
                    </div>
                    <span className="text-sm font-semibold">Fashion</span>
                    <p className="text-xs text-muted-foreground font-normal mt-0.5">Foto rect. + badge círculo</p>
                  </button>
                  <button type="button"
                    onClick={() => setForm(p => ({ ...p, template: 'magazine', image_position: p.image_position ?? 'right' }))}
                    className={`border-2 rounded-xl p-3 transition-colors text-left ${form.template === 'magazine' ? 'border-primary bg-primary/5' : 'border-border hover:bg-muted/50'}`}>
                    <div className="h-10 rounded-lg mb-2 bg-white relative overflow-hidden border border-border/50">
                      <div className="absolute inset-y-0 left-0 w-[44%] bg-white" />
                      <div className="absolute left-[7%] top-1/2 -translate-y-1/2 w-10">
                        <div className="h-1.5 rounded bg-[#FF6B00] mb-0.5 w-full" />
                        <div className="h-1 rounded bg-gray-300 w-3/4" />
                      </div>
                      <div className="absolute inset-y-0 right-0 w-[60%] bg-gradient-to-br from-[#FF6B00] to-[#e05010]" style={{ clipPath: 'polygon(16% 0, 100% 0, 100% 100%, 0 100%)' }} />
                    </div>
                    <span className="text-sm font-semibold">Magazine</span>
                    <p className="text-xs text-muted-foreground font-normal mt-0.5">Texto colorido + foto direita</p>
                  </button>
                  {/* Novos templates */}
                  <button type="button"
                    onClick={() => setForm(p => ({ ...p, template: 'spring', image_position: p.image_position ?? 'right' }))}
                    className={`border-2 rounded-xl p-3 transition-colors text-left ${form.template === 'spring' ? 'border-primary bg-primary/5' : 'border-border hover:bg-muted/50'}`}>
                    <div className="h-10 rounded-lg mb-2 bg-white relative overflow-hidden border border-border/50">
                      <div className="absolute inset-y-0 left-0 w-[48%] bg-white" />
                      <div className="absolute inset-y-0 right-0 w-[58%] bg-gradient-to-br from-[#FF6B7A] to-[#c23060]" style={{ clipPath: 'polygon(20% 0, 100% 0, 100% 100%, 0 100%)' }} />
                      <div className="absolute left-[42%] top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-white shadow-md border border-pink-200" />
                    </div>
                    <span className="text-sm font-semibold">Spring</span>
                    <p className="text-xs text-muted-foreground font-normal mt-0.5">Fundo branco + badge giratório</p>
                  </button>
                  <button type="button"
                    onClick={() => setForm(p => ({ ...p, template: 'sale', image_position: p.image_position ?? 'left' }))}
                    className={`border-2 rounded-xl p-3 transition-colors text-left ${form.template === 'sale' ? 'border-primary bg-primary/5' : 'border-border hover:bg-muted/50'}`}>
                    <div className="h-10 rounded-lg mb-2 bg-white relative overflow-hidden border border-border/50">
                      <div className="absolute inset-y-0 left-0 w-[45%] bg-gray-300/70" style={{ clipPath: 'polygon(0 0, 100% 0, 82% 100%, 0 100%)' }} />
                      <div className="absolute inset-y-0 right-0 w-[60%] bg-gradient-to-br from-[#FF6B7A] to-[#c23060]" style={{ clipPath: 'polygon(22% 0, 100% 0, 100% 100%, 0 100%)' }} />
                      <div className="absolute left-[43%] top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-white shadow-md border-2 border-pink-300 flex items-center justify-center">
                        <span className="text-[0.35rem] font-black text-pink-600 leading-none text-center">%<br />OFF</span>
                      </div>
                    </div>
                    <span className="text-sm font-semibold">Sale</span>
                    <p className="text-xs text-muted-foreground font-normal mt-0.5">Foto + badge % OFF pulsante</p>
                  </button>
                  <button type="button"
                    onClick={() => setForm(p => ({ ...p, template: 'strips', image_position: 'right' }))}
                    className={`border-2 rounded-xl p-3 transition-colors text-left ${form.template === 'strips' ? 'border-primary bg-primary/5' : 'border-border hover:bg-muted/50'}`}>
                    <div className="h-10 rounded-lg mb-2 bg-white relative overflow-hidden border border-border/50">
                      <div className="absolute inset-y-0 left-0 w-[38%] bg-white" />
                      <div className="absolute inset-y-0" style={{ left: '38%', width: '24%', background: '#F5A623', clipPath: 'polygon(0 0, 100% 0, 88% 100%, 0 100%)' }} />
                      <div className="absolute inset-y-0" style={{ left: '57%', width: '24%', background: '#e8951a', clipPath: 'polygon(12% 0, 100% 0, 88% 100%, 0 100%)' }} />
                      <div className="absolute inset-y-0" style={{ left: '76%', width: '24%', background: '#d4830e', clipPath: 'polygon(12% 0, 100% 0, 100% 100%, 0 100%)' }} />
                    </div>
                    <span className="text-sm font-semibold">Strips</span>
                    <p className="text-xs text-muted-foreground font-normal mt-0.5">3 faixas diagonais animadas</p>
                  </button>
                  <button type="button"
                    onClick={() => setForm(p => ({ ...p, template: 'duo', image_position: 'left' }))}
                    className={`border-2 rounded-xl p-3 transition-colors text-left ${form.template === 'duo' ? 'border-primary bg-primary/5' : 'border-border hover:bg-muted/50'}`}>
                    <div className="h-10 rounded-lg mb-2 bg-white relative overflow-hidden border border-border/50">
                      <div className="absolute inset-y-0 left-0 w-[35%] bg-gray-300" style={{ clipPath: 'polygon(0 0, 85% 0, 70% 100%, 0 100%)' }} />
                      <div className="absolute inset-y-0 left-0 w-[55%]" style={{ background: '#e05580', clipPath: 'polygon(38% 0, 100% 0, 100% 100%, 23% 100%)' }} />
                      <div className="absolute inset-y-0 right-0 w-[48%] bg-white" />
                    </div>
                    <span className="text-sm font-semibold">Duo</span>
                    <p className="text-xs text-muted-foreground font-normal mt-0.5">2 fotos + texto (cursivo)</p>
                  </button>
                </div>
              </div>

              {/* Posição da foto — oculto para strips e duo (layout fixo) */}
              {!['strips', 'duo'].includes(form.template) && (
                <div className="sm:col-span-2">
                  <Label>Posição da foto</Label>
                  <div className="flex gap-2 mt-1.5">
                    <button type="button"
                      onClick={() => f('image_position', 'left')}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 text-sm font-medium transition-colors ${form.image_position === 'left' ? 'border-primary bg-primary/5 text-primary' : 'border-border text-muted-foreground hover:bg-muted/50'}`}>
                      ← Esquerda
                    </button>
                    <button type="button"
                      onClick={() => f('image_position', 'right')}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 text-sm font-medium transition-colors ${form.image_position === 'right' ? 'border-primary bg-primary/5 text-primary' : 'border-border text-muted-foreground hover:bg-muted/50'}`}>
                      Direita →
                    </button>
                  </div>
                </div>
              )}

              {/* Imagem */}
              <div className="sm:col-span-2">
                <Label>Imagem do produto <span className="text-muted-foreground font-normal">(opcional — aparece à {form.image_position === 'left' ? 'esquerda' : 'direita'} no slide)</span></Label>
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

              {/* Foto 2 — duo e strips */}
              {['duo', 'strips'].includes(form.template) && (
                <div className="sm:col-span-2">
                  <Label>Foto 2 <span className="text-muted-foreground font-normal">(obrigatória para {form.template === 'duo' ? 'Duo' : 'Strips'})</span></Label>
                  <div className="mt-1.5 flex gap-3 items-start">
                    <div className="relative w-24 h-32 rounded-xl overflow-hidden border border-border bg-muted flex-shrink-0 flex items-center justify-center">
                      {form.image_url_2 ? (
                        <>
                          <Image src={form.image_url_2} alt="Preview 2" fill className="object-cover" />
                          <button type="button" onClick={() => f('image_url_2', null)} className="absolute top-1 right-1 bg-black/60 hover:bg-black/80 text-white rounded-full p-0.5 transition-colors"><X className="w-3 h-3" /></button>
                        </>
                      ) : <ImageIcon className="w-7 h-7 text-muted-foreground/40" />}
                    </div>
                    <div className="flex-1 flex flex-col gap-2">
                      <button type="button" onClick={() => fileRef2.current?.click()} disabled={uploading2} className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg text-sm hover:bg-muted transition-colors disabled:opacity-50">
                        {uploading2 ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                        {uploading2 ? 'Enviando...' : 'Upload Foto 2'}
                      </button>
                      <Input value={form.image_url_2 ?? ''} onChange={(e) => f('image_url_2', e.target.value || null)} placeholder="Ou cole a URL da Foto 2" className="text-xs" />
                    </div>
                  </div>
                  <input ref={fileRef2} type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && handleImageUpload2(e.target.files[0])} />
                </div>
              )}

              {/* Foto 3 — strips */}
              {form.template === 'strips' && (
                <div className="sm:col-span-2">
                  <Label>Foto 3 <span className="text-muted-foreground font-normal">(obrigatória para Strips)</span></Label>
                  <div className="mt-1.5 flex gap-3 items-start">
                    <div className="relative w-24 h-32 rounded-xl overflow-hidden border border-border bg-muted flex-shrink-0 flex items-center justify-center">
                      {form.image_url_3 ? (
                        <>
                          <Image src={form.image_url_3} alt="Preview 3" fill className="object-cover" />
                          <button type="button" onClick={() => f('image_url_3', null)} className="absolute top-1 right-1 bg-black/60 hover:bg-black/80 text-white rounded-full p-0.5 transition-colors"><X className="w-3 h-3" /></button>
                        </>
                      ) : <ImageIcon className="w-7 h-7 text-muted-foreground/40" />}
                    </div>
                    <div className="flex-1 flex flex-col gap-2">
                      <button type="button" onClick={() => fileRef3.current?.click()} disabled={uploading3} className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg text-sm hover:bg-muted transition-colors disabled:opacity-50">
                        {uploading3 ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                        {uploading3 ? 'Enviando...' : 'Upload Foto 3'}
                      </button>
                      <Input value={form.image_url_3 ?? ''} onChange={(e) => f('image_url_3', e.target.value || null)} placeholder="Ou cole a URL da Foto 3" className="text-xs" />
                    </div>
                  </div>
                  <input ref={fileRef3} type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && handleImageUpload3(e.target.files[0])} />
                </div>
              )}

              {/* Ativo */}
              {editing && (
                <div className="flex items-center gap-2">
                  <input type="checkbox" id="active" checked={form.active} onChange={(e) => f('active', e.target.checked)} className="w-4 h-4 accent-primary" />
                  <label htmlFor="active" className="text-sm">Ativo</label>
                </div>
              )}

              <div className="sm:col-span-2 flex gap-3">
                <Button type="submit" disabled={loading || uploading || uploading2 || uploading3}>
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
