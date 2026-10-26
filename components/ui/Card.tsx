import { cn } from './cn';

export function Card({
  as: Tag = 'div',
  className,
  children,
}: {
  as?: 'div' | 'article' | 'li' | 'figure';
  className?: string;
  children: React.ReactNode;
}) {
  return <Tag className={cn('border border-rule bg-paper p-6 md:p-8', className)}>{children}</Tag>;
}
