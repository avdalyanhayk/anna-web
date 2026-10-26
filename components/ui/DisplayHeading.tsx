import { cn } from './cn';

const sizes = {
  xl: 'text-[clamp(3rem,9vw,7.5rem)] leading-[0.92] tracking-[-0.02em]',
  lg: 'text-[clamp(2.5rem,6vw,4.75rem)] leading-[1] tracking-[-0.015em]',
  md: 'text-[clamp(2rem,4vw,3rem)] leading-[1.08] tracking-[-0.01em]',
  sm: 'text-[1.75rem] leading-[1.15]',
} as const;

export function DisplayHeading({
  as: Tag = 'h2',
  size = 'lg',
  italic = false,
  className,
  children,
  id,
}: {
  as?: 'h1' | 'h2' | 'h3' | 'p';
  size?: keyof typeof sizes;
  italic?: boolean;
  className?: string;
  children: React.ReactNode;
  id?: string;
}) {
  return (
    <Tag id={id} className={cn('font-display font-normal text-balance', sizes[size], italic && 'italic', className)}>
      {children}
    </Tag>
  );
}
