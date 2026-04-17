# CLAUDE.md — Loja de Roupas

Projeto de e-commerce de roupas construído com Next.js 16 (App Router), TypeScript, Tailwind CSS e Supabase.

## Comandos essenciais

```bash
npm run dev      # Servidor de desenvolvimento (localhost:3000) — usa --webpack (Turbopack não suporta WASM no win32/x64)
npm run build    # Build de produção (sempre rodar para checar erros TS)
npm run lint     # Lint
```

## Stack

| Camada | Tecnologia |
|---|---|
| Framework | Next.js 16 — App Router |
| Linguagem | TypeScript |
| Estilo | Tailwind CSS v3 |
| Banco de dados | Supabase (PostgreSQL + RLS) |
| Auth | Supabase Auth |
| Storage | Supabase Storage (buckets: `product-images`, `avatars`) |
| Estado carrinho | Zustand |
| Formulários | React Hook Form + Zod |
| Componentes base | shadcn/ui + Radix UI |
| Animações | Framer Motion (via Magic UI) |
| Toasts | Sonner |

## Paleta de cores (tema azul Magalu)

Definida em `tailwind.config.ts`:

| Token | Cor | Uso |
|---|---|---|
| `primary` | `#0064D2` | Header, botões principais, nav |
| `primary-dark` | `#003F8A` | Promo bar, footer, hover states |
| `primary-light` | `#E8F2FF` | Backgrounds suaves, badges |
| `accent` | `#FF6B00` | CTAs, botão de busca, ofertas |
| `gold` | `#FFD600` | Estrelas, badges de destaque, gradientes |
| `sale` | `#E63946` | Badges de desconto, promoções |
| `surface` | `#F2F6FC` | Background geral da página |

## Estrutura de componentes

```
src/
├── app/
│   ├── (store)/          # Rotas públicas da loja
│   │   └── page.tsx      # Homepage (server component)
│   ├── (customer)/       # Rotas autenticadas (conta, pedidos)
│   ├── (auth)/           # Login, cadastro, esqueci senha
│   └── admin/
│       ├── login/            # Página de login (sem auth guard)
│       └── (protected)/      # Route group — layout exige role=admin
│           ├── layout.tsx    # Sidebar + verificação de auth
│           ├── page.tsx      # Dashboard
│           ├── produtos/
│           ├── categorias/
│           └── pedidos/
├── components/
│   ├── home/
│   │   ├── HeroBanner.tsx       # Hero grid (main + side cards)
│   │   └── FlashSaleTimer.tsx   # Countdown timer (client)
│   ├── layout/
│   │   ├── Header.tsx    # Promo bar + header azul + nav categorias
│   │   └── Footer.tsx    # Footer azul escuro + logos pagamento
│   ├── products/
│   │   ├── ProductCard.tsx         # Card com hover effects + size row
│   │   └── ProductDetailClient.tsx # Página de detalhe (client) — galeria, variantes, carrinho
│   ├── magicui/          # Componentes Magic UI (copy-paste, sem lib externa)
│   │   ├── shimmer-button.tsx
│   │   ├── border-beam.tsx
│   │   ├── animated-gradient-text.tsx
│   │   ├── number-ticker.tsx
│   │   ├── blur-fade.tsx
│   │   └── marquee.tsx
│   ├── shared/
│   └── ui/               # shadcn/ui components
├── actions/              # Server actions (Supabase queries)
├── store/
│   └── cartStore.ts      # Zustand — carrinho
├── lib/
│   └── supabase/         # Cliente Supabase (client.ts + server.ts)
└── types/
    └── database.ts       # Tipos gerados do Supabase
```

## Banco de dados (Supabase)

Schema em `supabase/schema.sql`. Tabelas principais:

- `profiles` — dados do usuário (role: `customer` | `admin`)
- `categories` — categorias de produtos (com `slug`)
- `products` — produtos (com `slug`, `price`, `compare_price`, `featured`)
- `product_images` — imagens dos produtos (`is_primary`, `url`, `alt_text`)
- `product_variants` — variantes (`size`, `color`, `stock`, `sku`)
- `orders` / `order_items` — pedidos
- `carts` / `cart_items` — carrinho persistido
- `addresses` — endereços do usuário

RLS habilitado em todas as tabelas.

> **Atenção:** a função `handle_new_user()` (trigger `on_auth_user_created`) deve ter `SET search_path = public` e usar `public.profiles` explicitamente — sem isso o GoTrue não encontra a tabela ao criar usuários (erro `relation "profiles" does not exist`). Já corrigido no banco.

## Credenciais de desenvolvimento

| Acesso | Valor |
|---|---|
| Admin URL | `http://localhost:3000/admin/login` |
| Admin email | `admin@teste.com` |
| Admin senha | `Admin123!` |

> Conta criada no Supabase com `role = 'admin'` na tabela `profiles`.

## Setup inicial (primeira vez)

1. Criar projeto no Supabase (projeto: `sitederoupa`, ref: `urtugpgdjkocgibtpvcc`, região: `sa-east-1`)
2. Rodar `supabase/schema.sql` no SQL Editor (ou via MCP `apply_migration`) — **já executado**
3. `.env.local` já configurado com URL e chaves do projeto
4. Após primeiro cadastro, promover conta para admin:
   ```sql
   UPDATE profiles SET role = 'admin'
   WHERE id = (SELECT id FROM auth.users WHERE email = 'seu@email.com');
   ```

> **Nota:** `next/image` aceita hostnames: `*.supabase.co`, `lh3.googleusercontent.com`, `picsum.photos` (configurado em `next.config.ts`)

## Convenções

- **Server Components por padrão** — só adicionar `'use client'` quando necessário (eventos, hooks, framer-motion). Para páginas com interatividade, fazer o fetch no Server Component e passar os dados como props para um Client Component separado (ex: `page.tsx` → `ProductDetailClient.tsx`)
- **Fallback mock**: quando o banco não retorna dados (`active: true`, `featured: true`), a homepage e a página de detalhe caem para `MOCK_PRODUCTS` em `src/lib/mock-products.ts`. Toda nova página que exibe produtos deve seguir o mesmo padrão
- **Imagens de produto**: aspect-ratio `3/4`, `object-cover`, sempre com `alt`
- **Preços**: sempre em centavos no banco → exibir com `PriceDisplay` de `@/components/shared/PriceDisplay`
- **Rotas de categoria**: `/categorias/[slug]` — slugs: `camisetas`, `calcas`, `vestidos`, `moletons`, `shorts`, `jaquetas`, `acessorios`
- **Admin route group**: páginas protegidas do admin ficam em `src/app/admin/(protected)/` — o `layout.tsx` desse grupo verifica `role=admin`. A página de login em `src/app/admin/login/` fica fora do grupo para evitar loop de redirect
- **Magic UI**: componentes ficam em `src/components/magicui/` — são copy-paste, sem instalar pacote `magicui`. Depende de `framer-motion`
- **Fontes**: `font-display` → Lexend, `font-sans` → Inter (carregadas via Google Fonts em `globals.css`)
- **Border radius**: usar `rounded-xl` (1rem) e `rounded-2xl` (1.5rem) para cards, `rounded-full` para botões CTA e pills
