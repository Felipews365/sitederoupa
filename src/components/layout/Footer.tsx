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
    <footer className="bg-[#06141B] text-[#9BA8AB] pt-12 pb-8 px-4 sm:px-6">
      <div className="max-w-[1260px] mx-auto">
        {/* Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-[#253745] rounded-lg flex items-center justify-center">
                <Sparkles className="w-4 h-4" style={{ color: '#FFDA6C' }} />
              </div>
              <span className="font-display text-lg font-bold text-[#CCD0CF]">
                Black<span style={{ color: '#FFDA6C' }}>Import</span>
              </span>
            </Link>
            <p className="text-sm text-[#9BA8AB] max-w-[30ch] leading-relaxed">
              Sua loja de moda online. Roupas com qualidade garantida, entrega rápida e troca grátis.
            </p>
            <div className="flex gap-3 mt-5">
              <a href="#" aria-label="Instagram" className="w-8 h-8 bg-[#253745] hover:bg-[#4A5C6A] rounded-lg flex items-center justify-center transition-colors text-[#9BA8AB] hover:text-[#CCD0CF]">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#" aria-label="Facebook" className="w-8 h-8 bg-[#253745] hover:bg-[#4A5C6A] rounded-lg flex items-center justify-center transition-colors text-[#9BA8AB] hover:text-[#CCD0CF]">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="#" aria-label="WhatsApp" className="w-8 h-8 bg-[#253745] hover:bg-[#4A5C6A] rounded-lg flex items-center justify-center transition-colors text-[#9BA8AB] hover:text-[#CCD0CF]">
                <MessageCircle className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Atendimento */}
          <div>
            <h4 className="font-display text-sm font-bold text-[#CCD0CF] mb-4">Atendimento</h4>
            <ul className="flex flex-col gap-2">
              {footerLinks.atendimento.map((item) => (
                <li key={item.href}>
                  <a href={item.href} className="text-xs text-[#9BA8AB] hover:text-[#CCD0CF] transition-colors">
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Minha Conta */}
          <div>
            <h4 className="font-display text-sm font-bold text-[#CCD0CF] mb-4">Minha Conta</h4>
            <ul className="flex flex-col gap-2">
              {footerLinks.conta.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-xs text-[#9BA8AB] hover:text-[#CCD0CF] transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Informações */}
          <div>
            <h4 className="font-display text-sm font-bold text-[#CCD0CF] mb-4">Informações</h4>
            <ul className="flex flex-col gap-2">
              {footerLinks.info.map((item) => (
                <li key={item.href}>
                  <a href={item.href} className="text-xs text-[#9BA8AB] hover:text-[#CCD0CF] transition-colors">
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-[#253745] pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 flex-wrap">
          <p className="text-xs text-[#4A5C6A]">
            © 2026 MercadoVerde Moda. Todos os direitos reservados.
          </p>
          <div className="flex items-center gap-2 flex-wrap justify-center">
            {paymentMethods.map((method) => (
              <span
                key={method}
                className="bg-[#253745] text-[#9BA8AB] text-[0.6rem] font-bold px-2 py-1 rounded border border-[#4A5C6A] tracking-wider"
              >
                {method}
              </span>
            ))}
          </div>
        </div>
      </div>
      <div className="h-14 sm:hidden" />
    </footer>
  )
}
