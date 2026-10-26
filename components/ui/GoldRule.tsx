import { cn } from './cn';

/**
 * Accent hairline divider. Named for the design-system slot; in the
 * Carnegie White direction it is drawn in accent (`accent`) or warm grey.
 */
export function GoldRule({ tone = 'rule', className }: { tone?: 'rule' | 'accent'; className?: string }) {
  return (
    <hr
      aria-hidden
      className={cn('h-px border-0', tone === 'accent' ? 'w-16 bg-accent' : 'w-full bg-rule', className)}
    />
  );
}
