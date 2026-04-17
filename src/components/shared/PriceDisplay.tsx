import { formatCurrency, getDiscountPercent } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'

interface PriceDisplayProps {
  price: number
  comparePrice?: number | null
  size?: 'sm' | 'md' | 'lg'
  showBadge?: boolean
}

export function PriceDisplay({
  price,
  comparePrice,
  size = 'md',
  showBadge = true,
}: PriceDisplayProps) {
  const discount = comparePrice ? getDiscountPercent(price, comparePrice) : 0

  const priceClasses = {
    sm: 'text-base font-bold',
    md: 'text-xl font-bold',
    lg: 'text-3xl font-bold',
  }

  const oldPriceClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className={`${priceClasses[size]} text-accent`}>
        {formatCurrency(price)}
      </span>
      {comparePrice && comparePrice > price && (
        <span className={`${oldPriceClasses[size]} text-muted-foreground line-through`}>
          {formatCurrency(comparePrice)}
        </span>
      )}
      {showBadge && discount > 0 && (
        <Badge variant="sale">-{discount}%</Badge>
      )}
    </div>
  )
}
