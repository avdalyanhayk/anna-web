import { cn } from './cn';

export function Eyebrow({
  as: Tag = 'p',
  className,
  children,
}: {
  as?: 'p' | 'span' | 'h2' | 'h3';
  className?: string;
  children: React.ReactNode;
}) {
  return <Tag className={cn('eyebrow text-muted', className)}>{children}</Tag>;
}
