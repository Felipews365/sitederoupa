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
│           ├── banners/          # Gerenciamento do carrossel (hero_banners)
│           └── pedidos/
├── components/
│   ├── home/
│   │   ├── HeroBanner.tsx       # Server component — busca slides do banco (hero_banners), fallback hardcoded (banner_height padrão: 500)
│   │   ├── HeroBannerClient.tsx # Client component — carrossel animado (Framer Motion), auto-advance 5s, 3 cards abaixo; altura via clamp(240px, 55vw, banner_height px) + min-h-[420px] no mobile; 8 templates: gradient, diagonal, fashion, magazine, spring, sale, strips, duo; image_position controla lado da foto (left/right) — ignorado em strips e duo (layout fixo); AnimatedGradientText em title_highlight em todos os templates; title_highlight nos templates strips/duo usa font-script (Dancing Script cursiva); Mobile e desktop usam o mesmo layout rico (sem overlay separado) — padding reduzido px-4 sm:px-8 lg:px-14, font-size via clamp() se adapta. Animações exclusivas: spring→badge giratório (rotate 360, 10s), sale→badge pulsante (scale 1→1.08, 2s), strips→faixas com stagger slide-in da direita, duo→fotos com slide-in da esquerda
│   │   ├── CategorySelect.tsx   # Client component — toggle de categorias no mobile (sm:hidden); clique em "Categorias ▾" expande/recolhe cards em scroll horizontal (overflow-x-auto, sem overflow-hidden para não bloquear o scroll); animação fade+slide via Framer Motion (opacity+y, sem height animation); cards com emoji+nome, scroll de ponta a ponta (-mx-4 px-4); inclui "Todos", categorias com show_in_grid=true e "Promoções"
│   │   └── FlashSaleTimer.tsx   # Countdown timer (client)
│   ├── layout/
│   │   ├── Header.tsx           # Server component wrapper — busca categorias ativas do banco e passa para HeaderClient
│   │   ├── HeaderClient.tsx     # Client component — promo bar + header azul + nav categorias dinâmico; mostra até 6 categorias no nav desktop + CategoryDropdown para o restante; mobile: lista todas; logo mobile: "Black"/"Import" empilhados
│   │   ├── CategoryDropdown.tsx # Client component — dropdown animado (Framer Motion) "Ver todas ▾" para categorias além das 6 no nav desktop; grid 2 colunas
│   │   └── Footer.tsx           # Footer azul escuro + logos pagamento
│   ├── products/
│   │   ├── ProductCard.tsx         # Card com hover effects + size row
│   │   ├── ProductDetailClient.tsx # Página de detalhe (client) — galeria, variantes, carrinho; swipe horizontal na imagem principal (mín 40px) via onTouchStart/onTouchEnd + useRef
│   │   ├── FilterSidebar.tsx       # Sidebar de filtros (client) — categoria, gênero, preço, tamanho, cor
│   │   ├── MobileFilterSheet.tsx   # Sheet de filtros no mobile (client)
│   │   └── SortSelect.tsx          # Select de ordenação (client) — necessário por usar onChange; lê/escreve searchParams via useRouter
│   ├── magicui/          # Componentes Magic UI (copy-paste, sem lib externa)
│   │   ├── shimmer-button.tsx
│   │   ├── border-beam.tsx
│   │   ├── animated-gradient-text.tsx
│   │   ├── number-ticker.tsx
│   │   ├── blur-fade.tsx
│   │   └── marquee.tsx
│   ├── shared/
│   └── ui/               # shadcn/ui components
├── actions/
│   ├── admin/
│   │   ├── banners.ts    # CRUD hero_banners (getAllBanners, getActiveBanners, create/update/delete/reorder)
│   │   ├── products.ts
│   │   ├── categories.ts # CRUD categorias + toggleCategoryGrid(id, bool) — alterna show_in_grid
│   │   └── orders.ts
│   └── ...               # Outras server actions (Supabase queries)
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
- `categories` — categorias de produtos (com `slug`, `sort_order`, `active`, `show_in_grid`) — `show_in_grid`: boolean (padrão `true`) controla quais aparecem no grid da homepage (máx 7 + card "Todos" = 8); gerenciado em `/admin/categorias`; o marquee usa todas as categorias ativas independente de `show_in_grid`
- `products` — produtos (com `slug`, `price`, `compare_price`, `featured`)
- `product_images` — imagens dos produtos (`is_primary`, `url`, `alt_text`)
- `product_variants` — variantes (`size`, `color`, `stock`, `sku`)
- `orders` / `order_items` — pedidos
- `carts` / `cart_items` — carrinho persistido
- `addresses` — endereços do usuário
- `hero_banners` — slides do carrossel da homepage (`title`, `title_highlight`, `subtitle`, `badge_text`, `cta_label`, `cta_href`, `cta_bg_color`, `bg_from`, `bg_via`, `bg_to`, `image_url`, `image_url_2`, `image_url_3`, `banner_height`, `template`, `image_position`, `sort_order`, `active`) — RLS: leitura pública, escrita apenas admin. `template`: `gradient` | `diagonal` | `fashion` | `magazine` | `spring` | `sale` | `strips` | `duo`. `image_position`: `left` | `right` | null (null = padrão: gradient/magazine/spring→right, diagonal/fashion/sale→left; ignorado em strips e duo). `image_url_2` e `image_url_3`: usadas pelos templates `duo` (2 fotos) e `strips` (3 fotos)

RLS habilitado em todas as tabelas.

> **Atenção:** a função `handle_new_user()` (trigger `on_auth_user_created`) deve ter `SET search_path = public` e usar `public.profiles` explicitamente — sem isso o GoTrue não encontra a tabela ao criar usuários (erro `relation "profiles" does not exist`). Já corrigido no banco.

## Deploy

| Serviço | URL |
|---|---|
| Produção (Vercel) | `https://sitederoupa.vercel.app` |
| Repositório (GitHub) | `https://github.com/Felipews365/sitederoupa` |

> Vercel conectado ao branch `main` — push para `main` faz deploy automático.

## Credenciais de desenvolvimento

| Acesso | Valor |
|---|---|
| Admin URL (dev) | `http://localhost:3000/admin/login` |
| Admin URL (prod) | `https://sitederoupa.vercel.app/admin/login` |
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
5. Supabase Auth → URL Configuration já configurado:
   - Site URL: `https://sitederoupa.vercel.app`
   - Redirect URLs: `https://sitederoupa.vercel.app/**` e `http://localhost:3000/**`

> **Nota:** `next/image` aceita hostnames: `*.supabase.co`, `lh3.googleusercontent.com`, `picsum.photos` (configurado em `next.config.ts`)

## Convenções

- **Server Components por padrão** — só adicionar `'use client'` quando necessário (eventos, hooks, framer-motion). Para páginas com interatividade, fazer o fetch no Server Component e passar os dados como props para um Client Component separado (ex: `page.tsx` → `ProductDetailClient.tsx`)
- **Fallback mock**: quando o banco não retorna dados (`active: true`, `featured: true`), a homepage e a página de detalhe caem para `MOCK_PRODUCTS` em `src/lib/mock-products.ts`. Toda nova página que exibe produtos deve seguir o mesmo padrão
- **Imagens de produto**: aspect-ratio `3/4`, `object-cover`, sempre com `alt`
- **Preços**: sempre em centavos no banco → exibir com `PriceDisplay` de `@/components/shared/PriceDisplay`
- **Rotas de categoria**: `/categorias/[slug]` — slugs: `camisetas`, `calcas`, `vestidos`, `moletons`, `shorts`, `jaquetas`, `acessorios`
- **Grid de categorias na homepage**: mostra card "🛍️ Todos" (→ `/produtos`) + até 7 categorias com `show_in_grid = true` ordenadas por `sort_order`. Total máx = 8 cards. Gerencie em `/admin/categorias` — toggle por linha na tabela, contador X/8 no cabeçalho
- **Marquee de categorias na homepage**: usa todas as categorias ativas (ignora `show_in_grid`), cada item é um `Link` clicável — "Todos" no início, "Promoções" no fim
- **Nav do Header**: dinâmico, busca categorias ativas do banco. Desktop: "✨ Novidades" + primeiras 6 categorias + "Ver todas ▾" (se >6) + "🔥 Promoções". Mobile: lista todas sem limite
- **Rota de promoções**: `/produtos?promocao=true` — filtra produtos com `compare_price IS NOT NULL` via parâmetro `onSale` em `getProducts`. O nav link "🔥 Promoções" no Header aponta para essa URL. Não usar `ordenar=price_asc` para esse fim
- **Admin route group**: páginas protegidas do admin ficam em `src/app/admin/(protected)/` — o `layout.tsx` desse grupo verifica `role=admin`. A página de login em `src/app/admin/login/` fica fora do grupo para evitar loop de redirect
- **Magic UI**: componentes ficam em `src/components/magicui/` — são copy-paste, sem instalar pacote `magicui`. Depende de `framer-motion`. `ShimmerButton` aceita prop `hoverBackground` para cor de hover diferente do estado normal
- **Carrossel hero**: slides gerenciados via `/admin/banners`. Altura = `clamp(240px, 55vw, max_banner_height px)` + `min-h-[420px] sm:min-h-0`. Cor do botão via `cta_bg_color` (hover +28% claro). 8 templates: **gradient**, **diagonal**, **fashion**, **magazine**, **spring** (fundo branco + forma diagonal + badge giratório), **sale** (foto diagonal + fundo colorido + badge pulsante "% OFF"), **strips** (texto + 3 faixas diagonais animadas, requer `image_url`+`image_url_2`+`image_url_3`), **duo** (2 fotos diagonais + texto cursivo, requer `image_url`+`image_url_2`). `image_position` (left/right) troca o lado da foto — não se aplica a strips e duo. `title_highlight` usa `AnimatedGradientText`; nos templates strips e duo também renderiza em `font-script` (Dancing Script cursiva). **Mobile e desktop** usam o mesmo layout rico — sem overlay separado; padding dos containers de texto: `px-4 sm:px-8 lg:px-14`; font-size via `clamp()` se adapta automaticamente
- **Categorias na homepage (mobile)**: seção de categorias exibe `CategorySelect` (toggle accordion) no mobile e o grid de cards no desktop (`hidden sm:grid`). O `<h2>` "Categorias" é `hidden sm:flex` — no mobile o próprio botão do CategorySelect serve de título. Ambos recebem as mesmas categorias do servidor em `page.tsx`. **Importante:** não usar `overflow-hidden` no container de animação do CategorySelect — isso bloqueia o scroll horizontal interno
- **Fontes**: `font-display` → Lexend, `font-sans` → Inter, `font-script` → Dancing Script 700 (cursiva, usada nos templates strips/duo via classe CSS `.font-script`) — todas carregadas via Google Fonts em `globals.css`
- **Border radius**: usar `rounded-xl` (1rem) e `rounded-2xl` (1.5rem) para cards, `rounded-full` para botões CTA e pills
