import Link from 'next/link'
import { Sparkles, Instagram, Facebook, MessageCircle } from 'lucide-react'

const footerLinks = {
  atendimento: [
    { href: '#', label: 'Central de Ajuda' },
    { href: '#', label: 'WhatsApp' },
    { href: '#', label: 'Política de Troca' },
    { href: '#', label: 'Rastrear Pedido' },
    { href: '#', label: 'Reclamações' },
  ],
  conta: [
    { href: '/login', label: 'Entrar / Cadastrar' },
    { href: '/pedidos', label: 'Meus Pedidos' },
    { href: '#', label: 'Lista de Desejos' },
    { href: '/enderecos', label: 'Endereços' },
    { href: '#', label: 'Cupons' },
  ],
  info: [
    { href: '#', label: 'Sobre Nós' },
    { href: '#', label: 'Guia de Tamanhos' },
    { href: '#', label: 'Política de Privacidade' },
    { href: '#', label: 'Termos de Uso' },
    { href: '#', label: 'Blog de Moda' },
  ],
}

const paymentMethods = ['PIX', 'VISA', 'MASTER', 'ELO', 'BOLETO']

export function Footer() {
  return (
    <footer className="bg-primary-dark text-white/80 pt-12 pb-8 px-4 sm:px-6">
      <div className="max-w-[1260px] mx-auto">
        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 mb-10">
          {/* Brand */}
          <div>
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-white/15 rounded-lg flex items-center justify-center">
                <Sparkles className="w-4 h-4" style={{ color: '#FFD600' }} />
              </div>
              <span className="font-display text-lg font-bold text-white">
                Black<span style={{ color: '#FFD600' }}>Import</span>
              </span>
            </Link>
            <p className="text-sm text-white/60 max-w-[30ch] leading-relaxed">
              Sua loja de moda online. Roupas com qualidade garantida, entrega rápida e troca grátis.
            </p>
            <div className="flex gap-3 mt-5">
              <a href="#" aria-label="Instagram" className="w-8 h-8 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center transition-colors text-white/70 hover:text-white">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#" aria-label="Facebook" className="w-8 h-8 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center transition-colors text-white/70 hover:text-white">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="#" aria-label="WhatsApp" className="w-8 h-8 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center transition-colors text-white/70 hover:text-white">
                <MessageCircle className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Atendimento */}
          <div>
            <h4 className="font-display text-sm font-bold text-white mb-4">Atendimento</h4>
            <ul className="flex flex-col gap-2">
              {footerLinks.atendimento.map((item) => (
                <li key={item.href}>
                  <a href={item.href} className="text-xs text-white/60 hover:text-gold-DEFAULT transition-colors" style={{ '--hover-color': '#FFD600' } as React.CSSProperties}>
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Minha Conta */}
          <div>
            <h4 className="font-display text-sm font-bold text-white mb-4">Minha Conta</h4>
            <ul className="flex flex-col gap-2">
              {footerLinks.conta.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-xs text-white/60 hover:text-white transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Informações */}
          <div>
            <h4 className="font-display text-sm font-bold text-white mb-4">Informações</h4>
            <ul className="flex flex-col gap-2">
              {footerLinks.info.map((item) => (
                <li key={item.href}>
                  <a href={item.href} className="text-xs text-white/60 hover:text-white transition-colors">
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 flex-wrap">
          <p className="text-xs text-white/40">
            © 2026 MercadoVerde Moda. Todos os direitos reservados.
            {' · '}
            <Link href="/admin" className="text-white/40 hover:text-white/70 border-b border-dashed border-white/25 hover:border-white/50 pb-px transition-colors">
              Área Admin
            </Link>
          </p>
          <div className="flex items-center gap-2 flex-wrap justify-center">
            {paymentMethods.map((method) => (
              <span
                key={method}
                className="bg-white/10 text-white/70 text-[0.6rem] font-bold px-2 py-1 rounded border border-white/15 tracking-wider"
              >
                {method}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
