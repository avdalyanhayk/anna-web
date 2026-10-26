import { cn } from './cn';

type Variant = 'light' | 'deep' | 'dark';

const variants: Record<Variant, string> = {
  light: 'bg-paper text-ink',
  deep: 'bg-paper-deep text-ink',
  dark: 'on-dark bg-night text-paper',
};

/** Page section with the 1200px content column and the 8px vertical rhythm. */
export function Section({
  variant = 'light',
  className,
  innerClassName,
  children,
  ...rest
}: {
  variant?: Variant;
  className?: string;
  innerClassName?: string;
  children: React.ReactNode;
} & Omit<React.HTMLAttributes<HTMLElement>, 'className' | 'children'>) {
  return (
    <section className={cn(variants[variant], 'py-20 md:py-32', className)} {...rest}>
      <div className={cn('mx-auto w-full max-w-[1200px] px-4 sm:px-6 md:px-10', innerClassName)}>{children}</div>
    </section>
  );
}
