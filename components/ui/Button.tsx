import Link from 'next/link';
import { cn } from './cn';

type Variant = 'primary' | 'ghost';

const base =
  'group inline-flex min-h-12 items-center justify-center gap-3 px-7 text-[0.8125rem] font-medium uppercase tracking-[0.18em] transition-[background-color,color,border-color,box-shadow] duration-300 ease-(--ease-out-soft)';

const variants: Record<Variant, string> = {
  primary: 'bg-ink text-paper hover:bg-accent hover:shadow-[0_12px_32px_-16px_rgba(30,58,95,0.6)]',
  ghost: 'border border-current/30 text-current hover:border-current',
};

type CommonProps = { variant?: Variant; className?: string; children: React.ReactNode };

export function Button({
  href,
  variant = 'primary',
  className,
  children,
  ...rest
}: CommonProps &
  (
    | ({ href: string } & Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'href' | 'className' | 'children'>)
    | ({ href?: undefined } & Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'className' | 'children'>)
  )) {
  const classes = cn(base, variants[variant], className);
  if (href !== undefined) {
    const anchorProps = rest as React.AnchorHTMLAttributes<HTMLAnchorElement>;
    const external = /^(https?:|mailto:|tel:)/.test(href) || href.endsWith('.pdf');
    return external ? (
      <a href={href} className={classes} {...anchorProps}>
        {children}
      </a>
    ) : (
      <Link href={href} className={classes} {...anchorProps}>
        {children}
      </Link>
    );
  }
  return (
    <button className={classes} {...(rest as React.ButtonHTMLAttributes<HTMLButtonElement>)}>
      {children}
    </button>
  );
}
