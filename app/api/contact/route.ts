import { Resend } from 'resend';

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const LIMITS = { name: 120, email: 200, subject: 200, message: 5000 } as const;

type Payload = { name: string; email: string; subject: string; message: string; website?: string };

function parse(body: unknown): { data: Payload } | { error: string } {
  if (!body || typeof body !== 'object') return { error: 'Invalid request body.' };
  const raw = body as Record<string, unknown>;
  const data: Partial<Payload> = {};
  for (const key of ['name', 'email', 'subject', 'message'] as const) {
    const value = raw[key];
    if (typeof value !== 'string' || !value.trim()) return { error: `Missing field: ${key}.` };
    if (value.length > LIMITS[key]) return { error: `Field too long: ${key}.` };
    data[key] = value.trim();
  }
  if (!EMAIL.test(data.email!)) return { error: 'Invalid email address.' };
  if (data.message!.length < 10) return { error: 'Message is too short.' };
  return { data: { ...(data as Payload), website: typeof raw.website === 'string' ? raw.website : '' } };
}

const escapeHtml = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: 'Invalid JSON.' }, { status: 400 });
  }

  // Honeypot filled in: pretend everything worked and drop the message.
  if (body && typeof body === 'object' && typeof (body as Record<string, unknown>).website === 'string' && (body as Record<string, string>).website.trim()) {
    return Response.json({ ok: true });
  }

  const parsed = parse(body);
  if ('error' in parsed) return Response.json({ error: parsed.error }, { status: 400 });
  const { name, email, subject, message } = parsed.data;

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO;
  const from = process.env.CONTACT_FROM;
  if (!apiKey || !to || !from) {
    console.warn('[contact] RESEND_API_KEY, CONTACT_TO or CONTACT_FROM is not set; message not sent.');
    return Response.json({ error: 'The contact form is not configured yet.' }, { status: 500 });
  }

  const resend = new Resend(apiKey);
  const { error } = await resend.emails.send({
    from,
    to: to.split(',').map((s) => s.trim()),
    replyTo: email,
    subject: `Website message from ${name}: ${subject}`,
    text: `${message}\n\n— ${name} <${email}>`,
    html: `<p style="white-space:pre-wrap">${escapeHtml(message)}</p><p>— ${escapeHtml(name)} &lt;${escapeHtml(email)}&gt;</p>`,
  });

  if (error) {
    console.error('[contact] Resend error:', error);
    return Response.json({ error: 'The message could not be sent.' }, { status: 502 });
  }
  return Response.json({ ok: true });
}
