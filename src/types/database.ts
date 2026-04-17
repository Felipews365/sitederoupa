// Este arquivo deve ser gerado automaticamente pelo Supabase CLI:
// npx supabase gen types typescript --project-id SEU_PROJECT_ID > src/types/database.ts
//
// Por enquanto, usamos um tipo genérico temporário.
// Após configurar o Supabase, execute o comando acima para ter tipos completos.

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          full_name: string | null
          phone: string | null
          cpf: string | null
          avatar_url: string | null
          role: 'customer' | 'admin'
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          full_name?: string | null
          phone?: string | null
          cpf?: string | null
          avatar_url?: string | null
          role?: 'customer' | 'admin'
          created_at?: string
          updated_at?: string
        }
        Update: {
          full_name?: string | null
          phone?: string | null
          cpf?: string | null
          avatar_url?: string | null
          role?: 'customer' | 'admin'
          updated_at?: string
        }
      }
      categories: {
        Row: {
          id: string
          name: string
          slug: string
          description: string | null
          image_url: string | null
          parent_id: string | null
          sort_order: number
          active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          description?: string | null
          image_url?: string | null
          parent_id?: string | null
          sort_order?: number
          active?: boolean
        }
        Update: {
          name?: string
          slug?: string
          description?: string | null
          image_url?: string | null
          parent_id?: string | null
          sort_order?: number
          active?: boolean
        }
      }
      products: {
        Row: {
          id: string
          category_id: string | null
          name: string
          slug: string
          description: string | null
          price: number
          compare_price: number | null
          sku: string | null
          brand: string | null
          material: string | null
          gender: 'masculino' | 'feminino' | 'unissex' | 'infantil' | null
          active: boolean
          featured: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          category_id?: string | null
          name: string
          slug: string
          description?: string | null
          price: number
          compare_price?: number | null
          sku?: string | null
          brand?: string | null
          material?: string | null
          gender?: 'masculino' | 'feminino' | 'unissex' | 'infantil' | null
          active?: boolean
          featured?: boolean
        }
        Update: {
          category_id?: string | null
          name?: string
          slug?: string
          description?: string | null
          price?: number
          compare_price?: number | null
          sku?: string | null
          brand?: string | null
          material?: string | null
          gender?: 'masculino' | 'feminino' | 'unissex' | 'infantil' | null
          active?: boolean
          featured?: boolean
        }
      }
      product_images: {
        Row: {
          id: string
          product_id: string
          url: string
          alt_text: string | null
          sort_order: number
          is_primary: boolean
          created_at: string
        }
        Insert: {
          id?: string
          product_id: string
          url: string
          alt_text?: string | null
          sort_order?: number
          is_primary?: boolean
        }
        Update: {
          url?: string
          alt_text?: string | null
          sort_order?: number
          is_primary?: boolean
        }
      }
      product_variants: {
        Row: {
          id: string
          product_id: string
          size: string | null
          color: string | null
          color_hex: string | null
          stock: number
          sku: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          product_id: string
          size?: string | null
          color?: string | null
          color_hex?: string | null
          stock?: number
          sku?: string | null
        }
        Update: {
          size?: string | null
          color?: string | null
          color_hex?: string | null
          stock?: number
          sku?: string | null
        }
      }
      addresses: {
        Row: {
          id: string
          user_id: string
          label: string | null
          recipient: string
          street: string
          number: string
          complement: string | null
          neighborhood: string
          city: string
          state: string
          zip_code: string
          is_default: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          label?: string | null
          recipient: string
          street: string
          number: string
          complement?: string | null
          neighborhood: string
          city: string
          state: string
          zip_code: string
          is_default?: boolean
        }
        Update: {
          label?: string | null
          recipient?: string
          street?: string
          number?: string
          complement?: string | null
          neighborhood?: string
          city?: string
          state?: string
          zip_code?: string
          is_default?: boolean
        }
      }
      orders: {
        Row: {
          id: string
          user_id: string
          status: 'pending' | 'payment_confirmed' | 'preparing' | 'shipped' | 'out_for_delivery' | 'delivered' | 'cancelled' | 'refunded'
          shipping_address: Json
          payment_method: 'pix' | 'credit_card' | 'boleto'
          payment_status: 'pending' | 'paid' | 'failed' | 'refunded'
          subtotal: number
          shipping_cost: number
          discount: number
          total: number
          tracking_code: string | null
          notes: string | null
          pix_key: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          status?: 'pending' | 'payment_confirmed' | 'preparing' | 'shipped' | 'out_for_delivery' | 'delivered' | 'cancelled' | 'refunded'
          shipping_address: Json
          payment_method?: 'pix' | 'credit_card' | 'boleto'
          payment_status?: 'pending' | 'paid' | 'failed' | 'refunded'
          subtotal: number
          shipping_cost?: number
          discount?: number
          total: number
          tracking_code?: string | null
          notes?: string | null
          pix_key?: string | null
        }
        Update: {
          status?: 'pending' | 'payment_confirmed' | 'preparing' | 'shipped' | 'out_for_delivery' | 'delivered' | 'cancelled' | 'refunded'
          payment_status?: 'pending' | 'paid' | 'failed' | 'refunded'
          tracking_code?: string | null
          notes?: string | null
        }
      }
      order_items: {
        Row: {
          id: string
          order_id: string
          product_id: string | null
          variant_id: string | null
          product_name: string
          product_image: string | null
          size: string | null
          color: string | null
          quantity: number
          unit_price: number
          total_price: number
          created_at: string
        }
        Insert: {
          id?: string
          order_id: string
          product_id?: string | null
          variant_id?: string | null
          product_name: string
          product_image?: string | null
          size?: string | null
          color?: string | null
          quantity: number
          unit_price: number
          total_price: number
        }
        Update: never
      }
      carts: {
        Row: {
          id: string
          user_id: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
        }
        Update: never
      }
      cart_items: {
        Row: {
          id: string
          cart_id: string
          variant_id: string
          quantity: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          cart_id: string
          variant_id: string
          quantity?: number
        }
        Update: {
          quantity?: number
        }
      }
    }
    Functions: {
      is_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      decrement_stock: {
        Args: { variant_id: string; amount: number }
        Returns: void
      }
    }
  }
}

// Tipos auxiliares derivados do schema
export type Profile = Database['public']['Tables']['profiles']['Row']
export type Category = Database['public']['Tables']['categories']['Row']
export type Product = Database['public']['Tables']['products']['Row']
export type ProductImage = Database['public']['Tables']['product_images']['Row']
export type ProductVariant = Database['public']['Tables']['product_variants']['Row']
export type Address = Database['public']['Tables']['addresses']['Row']
export type Order = Database['public']['Tables']['orders']['Row']
export type OrderItem = Database['public']['Tables']['order_items']['Row']

// Tipos compostos usados na UI
export type ProductWithDetails = Product & {
  product_images: ProductImage[]
  product_variants: ProductVariant[]
  categories: Pick<Category, 'id' | 'name' | 'slug'> | null
}

export type OrderWithItems = Order & {
  order_items: OrderItem[]
}

export type OrderStatus = Order['status']
export type PaymentMethod = Order['payment_method']
export type UserRole = Profile['role']
