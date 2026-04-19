'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'

const categoryIcons: Record<string, string> = {
  camisetas: '👕',
  calcas: '👖',
  vestidos: '👗',
  moletons: '🫧',
  shorts: '🩳',
  jaquetas: '🧥',
  acessorios: '👜',
}

interface Category {
  id: string
  name: string
  slug: string
  show_in_grid: boolean | null
}

interface Props {
  categories: Category[]
}

export function CategorySelect({ categories }: Props) {
  const [open, setOpen] = useState(false)
  const gridCats = categories.filter((c) => c.show_in_grid).slice(0, 7)

  const items = [
    { href: '/produtos', label: 'Todos', icon: '🛍️', slug: '_todos' },
    ...gridCats.map((c) => ({ href: `/categorias/${c.slug}`, label: c.name, icon: categoryIcons[c.slug] ?? '🏷️', slug: c.slug })),
    { href: '/produtos?promocao=true', label: 'Promoções', icon: '🔥', slug: '_promo' },
  ]

  return (
    <div className="sm:hidden mb-6">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 text-xl font-semibold text-foreground font-display w-full mb-4"
      >
        <span>Categorias</span>
        <motion.svg
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.25, ease: 'easeInOut' }}
          className="w-4 h-4 text-foreground"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </motion.svg>
        <span className="flex-1 h-px bg-border ml-1" />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
          >
            <div className="flex gap-3 overflow-x-auto -mx-4 px-4 pb-2 scrollbar-hide">
              {items.map((item, i) => (
                <motion.div
                  key={item.slug}
                  initial={{ opacity: 0, scale: 0.85, y: 8 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ delay: i * 0.05, duration: 0.22, ease: 'easeOut' }}
                  className="flex-shrink-0"
                >
                  <Link
                    href={item.href}
                    className="flex flex-col items-center p-3 w-20 bg-white rounded-xl border border-border hover:border-primary hover:bg-primary-light hover:shadow-md active:scale-95 transition-all duration-200 group"
                  >
                    <span className="text-2xl mb-1">{item.icon}</span>
                    <span className="text-xs font-medium text-foreground group-hover:text-primary text-center leading-tight line-clamp-2">
                      {item.label}
                    </span>
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
