import { cn } from './cn';

const sizes = {
  xl: 'text-[clamp(2.75rem,7vw,5.5rem)] leading-[1] tracking-[-0.01em]',
  lg: 'text-[clamp(2.25rem,5vw,3.75rem)] leading-[1.05] tracking-[-0.01em]',
  md: 'text-[clamp(1.75rem,3.2vw,2.5rem)] leading-[1.12]',
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
