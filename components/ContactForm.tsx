'use client';

import { useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowRight, Check } from 'lucide-react';
import type { Dictionary } from '@/lib/i18n';
import { Button } from './ui/Button';
import { cn } from './ui/cn';

type Field = 'name' | 'email' | 'subject' | 'message';
type Values = Record<Field, string>;
type Status = 'idle' | 'sending' | 'success' | 'error';

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const empty: Values = { name: '', email: '', subject: '', message: '' };

export function ContactForm({ t }: { t: Dictionary['contact'] }) {
  const [values, setValues] = useState<Values>(empty);
  const [errors, setErrors] = useState<Partial<Record<Field, string>>>({});
  const [status, setStatus] = useState<Status>('idle');
  const honeypot = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const validate = (v: Values) => {
    const e: Partial<Record<Field, string>> = {};
    if (!v.name.trim()) e.name = t.required;
    if (!v.email.trim()) e.email = t.required;
    else if (!EMAIL.test(v.email.trim())) e.email = t.invalidEmail;
    if (!v.subject.trim()) e.subject = t.required;
    if (!v.message.trim()) e.message = t.required;
    else if (v.message.trim().length < 10) e.message = t.tooShort;
    return e;
  };

  const update = (field: Field) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const next = { ...values, [field]: e.target.value };
    setValues(next);
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: validate(next)[field] }));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const found = validate(values);
    setErrors(found);
    const first = (Object.keys(found) as Field[])[0];
    if (first) {
      formRef.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
      return;
    }
    setStatus('sending');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...values, website: honeypot.current?.value ?? '' }),
      });
      if (!res.ok) throw new Error(String(res.status));
      setStatus('success');
      setValues(empty);
    } catch {
      setStatus('error');
    }
  };

  const field = (name: Field, label: string, opts: { type?: string; multiline?: boolean; autoComplete?: string } = {}) => {
    const id = `contact-${name}`;
    const error = errors[name];
    const common = {
      id,
      name,
      value: values[name],
      onChange: update(name),
      placeholder: ' ',
      autoComplete: opts.autoComplete,
      'aria-invalid': error ? true : undefined,
      'aria-describedby': error ? `${id}-error` : undefined,
      className: cn(
        'peer block w-full resize-none appearance-none rounded-none border-0 border-b bg-transparent pt-7 pb-3 text-base text-ink transition-colors focus:outline-none',
        error ? 'border-red-800' : 'border-ink/25 focus:border-accent',
      ),
    };
    return (
      <div className="relative">
        {opts.multiline ? <textarea rows={5} {...common} /> : <input type={opts.type ?? 'text'} {...common} />}
        <label
          htmlFor={id}
          className="pointer-events-none absolute top-1 left-0 origin-left text-[0.8125rem] font-semibold tracking-[0.12em] text-muted uppercase transition-all duration-300 peer-placeholder-shown:top-7 peer-placeholder-shown:text-base peer-placeholder-shown:tracking-normal peer-placeholder-shown:normal-case peer-focus:top-1 peer-focus:text-[0.8125rem] peer-focus:tracking-[0.12em] peer-focus:text-accent peer-focus:uppercase"
        >
          {label}
        </label>
        {error && (
          <p id={`${id}-error`} className="mt-2 text-sm text-red-800">
            {error}
          </p>
        )}
      </div>
    );
  };

  return (
    <AnimatePresence mode="wait" initial={false}>
      {status === 'success' ? (
        <motion.div
          key="success"
          role="status"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="flex min-h-[28rem] flex-col items-start justify-center"
        >
          <span className="flex size-14 items-center justify-center rounded-full border border-accent text-accent">
            <Check aria-hidden strokeWidth={1.75} />
          </span>
          <p className="mt-8 font-display text-[clamp(1.75rem,3vw,2.5rem)] leading-tight">{t.success}</p>
          <p className="mt-4 text-muted">{t.successHint}</p>
          <button type="button" onClick={() => setStatus('idle')} className="link-draw mt-10 text-sm font-semibold tracking-[0.12em] uppercase">
            {t.sendAnother}
          </button>
        </motion.div>
      ) : (
        <motion.form
          key="form"
          ref={formRef}
          noValidate
          onSubmit={onSubmit}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="space-y-8"
        >
          <div className="grid gap-8 sm:grid-cols-2">
            {field('name', t.name, { autoComplete: 'name' })}
            {field('email', t.email, { type: 'email', autoComplete: 'email' })}
          </div>
          {field('subject', t.subject)}
          {field('message', t.message, { multiline: true })}

          {/* Honeypot: invisible to people, tempting to bots. */}
          <div aria-hidden className="absolute -left-[9999px] h-px w-px overflow-hidden">
            <label htmlFor="contact-website">Website</label>
            <input ref={honeypot} id="contact-website" name="website" type="text" tabIndex={-1} autoComplete="off" />
          </div>

          {status === 'error' && (
            <p role="alert" className="border-l border-red-800 pl-4 text-sm text-red-800">
              {t.error}
            </p>
          )}

          <Button type="submit" disabled={status === 'sending'} className="w-full disabled:opacity-60 sm:w-auto">
            {status === 'sending' ? t.sending : t.send}
            <ArrowRight aria-hidden className="size-4 transition-transform group-hover:translate-x-1" strokeWidth={1.5} />
          </Button>
        </motion.form>
      )}
    </AnimatePresence>
  );
}
