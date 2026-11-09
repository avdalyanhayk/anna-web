import { cn } from './cn';

const sizes = {
  xl: 'text-[clamp(3rem,9vw,7.5rem)] leading-[0.95] tracking-[-0.015em]',
  lg: 'text-[clamp(2.5rem,6vw,4.75rem)] leading-[1.02] tracking-[-0.01em]',
  md: 'text-[clamp(2rem,3.8vw,3rem)] leading-[1.08]',
  sm: 'text-[1.625rem] leading-[1.2]',
} as const;

/** Sturdy Playfair heading (weight 500–600) — no hairline display cuts. */
export function DisplayHeading({
  as: Tag = 'h2',
  size = 'lg',
  className,
  children,
  id,
}: {
  as?: 'h1' | 'h2' | 'h3' | 'p';
  size?: keyof typeof sizes;
  className?: string;
  children: React.ReactNode;
  id?: string;
}) {
  return (
    <Tag id={id} className={cn('font-display font-semibold text-balance', sizes[size], className)}>
      {children}
    </Tag>
  );
}
