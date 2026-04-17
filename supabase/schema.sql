-- ============================================================
-- LOJA ROUPAS - Schema completo do Supabase
-- Execute este arquivo no SQL Editor do Supabase
-- ============================================================

-- Extensões necessárias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- HELPER: atualiza campo updated_at automaticamente
-- ============================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================================
-- PROFILES (estende auth.users do Supabase)
-- ============================================================
CREATE TABLE profiles (
  id            UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name     TEXT,
  phone         TEXT,
  cpf           TEXT UNIQUE,
  avatar_url    TEXT,
  role          TEXT NOT NULL DEFAULT 'customer'
                CHECK (role IN ('customer', 'admin')),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Auto-cria profile quando usuário se cadastra
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ============================================================
-- CATEGORIES
-- ============================================================
CREATE TABLE categories (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name        TEXT NOT NULL,
  slug        TEXT NOT NULL UNIQUE,
  description TEXT,
  image_url   TEXT,
  parent_id   UUID REFERENCES categories(id) ON DELETE SET NULL,
  sort_order  INT NOT NULL DEFAULT 0,
  active      BOOLEAN NOT NULL DEFAULT TRUE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER categories_updated_at
  BEFORE UPDATE ON categories
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================
-- PRODUCTS
-- ============================================================
CREATE TABLE products (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category_id   UUID REFERENCES categories(id) ON DELETE SET NULL,
  name          TEXT NOT NULL,
  slug          TEXT NOT NULL UNIQUE,
  description   TEXT,
  price         NUMERIC(10,2) NOT NULL CHECK (price >= 0),
  compare_price NUMERIC(10,2),
  sku           TEXT UNIQUE,
  brand         TEXT,
  material      TEXT,
  gender        TEXT CHECK (gender IN ('masculino','feminino','unissex','infantil')),
  active        BOOLEAN NOT NULL DEFAULT TRUE,
  featured      BOOLEAN NOT NULL DEFAULT FALSE,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_active    ON products(active);
CREATE INDEX idx_products_featured  ON products(featured);
CREATE INDEX idx_products_slug      ON products(slug);

-- Busca full-text em português
ALTER TABLE products ADD COLUMN fts tsvector
  GENERATED ALWAYS AS (
    to_tsvector('portuguese',
      coalesce(name,'') || ' ' ||
      coalesce(description,'') || ' ' ||
      coalesce(brand,'')
    )
  ) STORED;

CREATE INDEX idx_products_fts ON products USING GIN(fts);

CREATE TRIGGER products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================
-- PRODUCT IMAGES
-- ============================================================
CREATE TABLE product_images (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id  UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  url         TEXT NOT NULL,
  alt_text    TEXT,
  sort_order  INT NOT NULL DEFAULT 0,
  is_primary  BOOLEAN NOT NULL DEFAULT FALSE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_product_images_product ON product_images(product_id);

-- ============================================================
-- PRODUCT VARIANTS (tamanho × cor × estoque)
-- ============================================================
CREATE TABLE product_variants (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id  UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  size        TEXT,         -- PP, P, M, G, GG, XG ou numérico
  color       TEXT,         -- "Preto", "Branco"
  color_hex   TEXT,         -- "#000000"
  stock       INT NOT NULL DEFAULT 0 CHECK (stock >= 0),
  sku         TEXT UNIQUE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(product_id, size, color)
);

CREATE INDEX idx_variants_product ON product_variants(product_id);

CREATE TRIGGER variants_updated_at
  BEFORE UPDATE ON product_variants
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================
-- ADDRESSES
-- ============================================================
CREATE TABLE addresses (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id      UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  label        TEXT,                    -- "Casa", "Trabalho"
  recipient    TEXT NOT NULL,
  street       TEXT NOT NULL,
  number       TEXT NOT NULL,
  complement   TEXT,
  neighborhood TEXT NOT NULL,
  city         TEXT NOT NULL,
  state        CHAR(2) NOT NULL,
  zip_code     TEXT NOT NULL,
  is_default   BOOLEAN NOT NULL DEFAULT FALSE,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_addresses_user ON addresses(user_id);

CREATE TRIGGER addresses_updated_at
  BEFORE UPDATE ON addresses
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================
-- ORDERS
-- ============================================================
CREATE TABLE orders (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id          UUID NOT NULL REFERENCES auth.users(id),
  status           TEXT NOT NULL DEFAULT 'pending'
                   CHECK (status IN (
                     'pending',
                     'payment_confirmed',
                     'preparing',
                     'shipped',
                     'out_for_delivery',
                     'delivered',
                     'cancelled',
                     'refunded'
                   )),
  shipping_address JSONB NOT NULL,
  payment_method   TEXT NOT NULL DEFAULT 'pix'
                   CHECK (payment_method IN ('pix','credit_card','boleto')),
  payment_status   TEXT NOT NULL DEFAULT 'pending'
                   CHECK (payment_status IN ('pending','paid','failed','refunded')),
  subtotal         NUMERIC(10,2) NOT NULL,
  shipping_cost    NUMERIC(10,2) NOT NULL DEFAULT 0,
  discount         NUMERIC(10,2) NOT NULL DEFAULT 0,
  total            NUMERIC(10,2) NOT NULL,
  tracking_code    TEXT,
  notes            TEXT,
  pix_key          TEXT,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_orders_user   ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);

CREATE TRIGGER orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================
-- ORDER ITEMS
-- ============================================================
CREATE TABLE order_items (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id      UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id    UUID REFERENCES products(id) ON DELETE SET NULL,
  variant_id    UUID REFERENCES product_variants(id) ON DELETE SET NULL,
  -- Snapshot dos dados do produto na hora da compra
  product_name  TEXT NOT NULL,
  product_image TEXT,
  size          TEXT,
  color         TEXT,
  quantity      INT NOT NULL CHECK (quantity > 0),
  unit_price    NUMERIC(10,2) NOT NULL,
  total_price   NUMERIC(10,2) NOT NULL,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_order_items_order ON order_items(order_id);

-- ============================================================
-- CARTS (para usuários logados)
-- ============================================================
CREATE TABLE carts (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id    UUID UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE cart_items (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  cart_id    UUID NOT NULL REFERENCES carts(id) ON DELETE CASCADE,
  variant_id UUID NOT NULL REFERENCES product_variants(id) ON DELETE CASCADE,
  quantity   INT NOT NULL DEFAULT 1 CHECK (quantity > 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(cart_id, variant_id)
);

CREATE INDEX idx_cart_items_cart ON cart_items(cart_id);

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================

ALTER TABLE profiles         ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories       ENABLE ROW LEVEL SECURITY;
ALTER TABLE products         ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_images   ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE addresses        ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders           ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items      ENABLE ROW LEVEL SECURITY;
ALTER TABLE carts            ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items       ENABLE ROW LEVEL SECURITY;

-- Helper: verifica se usuário atual é admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- PROFILES
CREATE POLICY "Usuário lê próprio perfil"
  ON profiles FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Usuário atualiza próprio perfil"
  ON profiles FOR UPDATE USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

CREATE POLICY "Admin lê todos os perfis"
  ON profiles FOR SELECT USING (is_admin());

-- CATEGORIES
CREATE POLICY "Qualquer um lê categorias ativas"
  ON categories FOR SELECT USING (active = TRUE OR is_admin());

CREATE POLICY "Admin gerencia categorias"
  ON categories FOR ALL USING (is_admin()) WITH CHECK (is_admin());

-- PRODUCTS
CREATE POLICY "Qualquer um lê produtos ativos"
  ON products FOR SELECT USING (active = TRUE OR is_admin());

CREATE POLICY "Admin gerencia produtos"
  ON products FOR ALL USING (is_admin()) WITH CHECK (is_admin());

-- PRODUCT IMAGES
CREATE POLICY "Qualquer um lê imagens de produtos ativos"
  ON product_images FOR SELECT USING (
    EXISTS (SELECT 1 FROM products WHERE id = product_images.product_id AND (active = TRUE OR is_admin()))
  );

CREATE POLICY "Admin gerencia imagens"
  ON product_images FOR ALL USING (is_admin()) WITH CHECK (is_admin());

-- PRODUCT VARIANTS
CREATE POLICY "Qualquer um lê variantes de produtos ativos"
  ON product_variants FOR SELECT USING (
    EXISTS (SELECT 1 FROM products WHERE id = product_variants.product_id AND (active = TRUE OR is_admin()))
  );

CREATE POLICY "Admin gerencia variantes"
  ON product_variants FOR ALL USING (is_admin()) WITH CHECK (is_admin());

-- ADDRESSES
CREATE POLICY "Usuário gerencia próprios endereços"
  ON addresses FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admin lê todos os endereços"
  ON addresses FOR SELECT USING (is_admin());

-- ORDERS
CREATE POLICY "Usuário lê próprios pedidos"
  ON orders FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Usuário cria próprios pedidos"
  ON orders FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admin gerencia todos os pedidos"
  ON orders FOR ALL USING (is_admin()) WITH CHECK (is_admin());

-- ORDER ITEMS
CREATE POLICY "Usuário lê itens dos próprios pedidos"
  ON order_items FOR SELECT USING (
    EXISTS (SELECT 1 FROM orders WHERE id = order_items.order_id AND user_id = auth.uid())
  );

CREATE POLICY "Usuário cria itens em próprios pedidos"
  ON order_items FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM orders WHERE id = order_items.order_id AND user_id = auth.uid())
  );

CREATE POLICY "Admin gerencia todos os itens"
  ON order_items FOR ALL USING (is_admin()) WITH CHECK (is_admin());

-- CARTS
CREATE POLICY "Usuário gerencia próprio carrinho"
  ON carts FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuário gerencia itens do próprio carrinho"
  ON cart_items FOR ALL USING (
    EXISTS (SELECT 1 FROM carts WHERE id = cart_items.cart_id AND user_id = auth.uid())
  ) WITH CHECK (
    EXISTS (SELECT 1 FROM carts WHERE id = cart_items.cart_id AND user_id = auth.uid())
  );

-- ============================================================
-- RPC: decrementa estoque (chamado no checkout)
-- ============================================================
CREATE OR REPLACE FUNCTION decrement_stock(variant_id UUID, amount INT)
RETURNS VOID AS $$
  UPDATE product_variants
  SET stock = stock - amount
  WHERE id = variant_id AND stock >= amount;
$$ LANGUAGE sql SECURITY DEFINER;

-- ============================================================
-- STORAGE BUCKETS
-- (Execute separadamente ou configure no Dashboard do Supabase)
-- ============================================================

-- Bucket produto-imagens (público)
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', TRUE)
ON CONFLICT (id) DO NOTHING;

-- Bucket avatares (público)
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', TRUE)
ON CONFLICT (id) DO NOTHING;

-- Policies do storage
CREATE POLICY "Imagens de produtos são públicas"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'product-images');

CREATE POLICY "Admin faz upload de imagens de produtos"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'product-images' AND is_admin());

CREATE POLICY "Admin deleta imagens de produtos"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'product-images' AND is_admin());

CREATE POLICY "Usuário faz upload do próprio avatar"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'avatars' AND
    auth.uid()::TEXT = (storage.foldername(name))[1]
  );

CREATE POLICY "Avatares são públicos"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'avatars');

-- ============================================================
-- SEED: Categorias iniciais
-- ============================================================
INSERT INTO categories (name, slug, sort_order) VALUES
  ('Camisetas', 'camisetas', 1),
  ('Calças', 'calcas', 2),
  ('Vestidos', 'vestidos', 3),
  ('Moletons', 'moletons', 4),
  ('Shorts', 'shorts', 5),
  ('Jaquetas', 'jaquetas', 6),
  ('Acessórios', 'acessorios', 7)
ON CONFLICT (slug) DO NOTHING;

-- ============================================================
-- Para tornar um usuário admin após cadastro:
-- UPDATE profiles SET role = 'admin'
-- WHERE id = (SELECT id FROM auth.users WHERE email = 'seu@email.com');
-- ============================================================
