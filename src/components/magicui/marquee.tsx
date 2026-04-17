import { cn } from '@/lib/utils'
import { CSSProperties, ReactNode } from 'react'

interface MarqueeProps {
  className?: string
  reverse?: boolean
  pauseOnHover?: boolean
  children?: ReactNode
  vertical?: boolean
  repeat?: number
  speed?: number
}

export function Marquee({
  className,
  reverse,
  pauseOnHover = false,
  children,
  vertical = false,
  repeat = 4,
  speed = 40,
}: MarqueeProps) {
  return (
    <div
      style={{ '--duration': `${speed}s`, '--gap': '1rem' } as CSSProperties}
      className={cn(
        'group flex overflow-hidden p-2 [gap:var(--gap)]',
        {
          'flex-row': !vertical,
          'flex-col': vertical,
        },
        className,
      )}
    >
      {Array(repeat)
        .fill(0)
        .map((_, i) => (
          <div
            key={i}
            className={cn('flex shrink-0 justify-around [gap:var(--gap)]', {
              'animate-marquee flex-row': !vertical,
              'animate-marquee-vertical flex-col': vertical,
              'group-hover:[animation-play-state:paused]': pauseOnHover,
              '[animation-direction:reverse]': reverse,
            })}
          >
            {children}
          </div>
        ))}
    </div>
  )
}
