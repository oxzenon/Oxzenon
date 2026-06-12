import { useState } from 'react';
import { Panel } from './Panel.jsx';
import { AsciiHeader } from '../ui/AsciiHeader.jsx';
import { Glyph } from '../ui/Glyph.jsx';
import { useToast } from '../ui/Toast.jsx';

const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export function ContactPanel() {
  const toast = useToast();
  const [busy, setBusy] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', message: '', 'bot-field': '' });

  const update = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    const { name, email, message } = form;
    if (!name.trim() || !email.trim() || !message.trim()) {
      toast('Please fill in all fields.', 'error');
      return;
    }
    if (!isValidEmail(email)) {
      toast('Please enter a valid email address.', 'error');
      return;
    }
    setBusy(true);
    try {
      const body = new URLSearchParams({
        'form-name': 'contact',
        name, email, message,
        'bot-field': form['bot-field'],
      }).toString();

      const res = await fetch('/', {
        method:  'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body,
      });
      if (!res.ok) throw new Error('netlify ' + res.status);
      toast("Message sent! I'll be in touch soon.", 'success');
      setForm({ name: '', email: '', message: '', 'bot-field': '' });
    } catch (err) {
      console.error('contact submit error:', err);
      toast('Something went wrong. Please try again.', 'error');
    } finally {
      setBusy(false);
    }
  };

  return (
    <Panel id="usr/mail" chrome="mail compose" anchor="contact">
      <div className="grid lg:grid-cols-[1fr_1.1fr] gap-10">
        <div className="space-y-5">
          <AsciiHeader
            tag="contact"
            title={<>Let's build<br />something.</>}
            kicker="echo $MESSAGE | mail oxzenon001@gmail.com"
          />
          <p className="text-muted leading-relaxed">
            I'm open to freelance frontend gigs, collaborations on Web3 learning
            projects, and any opportunity to build and grow. Drop me a message
            and let's talk.
          </p>

          <div className="space-y-2 font-mono text-sm">
            <a
              href="https://github.com/oxzenon"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between rounded-md border border-purple/25 px-3 py-2 hover:border-cyan/60 hover:text-cyan transition"
            >
              <span className="flex items-center gap-2 text-text">
                <Glyph name="fab fa-github" className="text-purple2" /> github
              </span>
              <span className="text-muted">oxzenon</span>
            </a>
            <a
              href="https://x.com/Oxzenon001"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between rounded-md border border-purple/25 px-3 py-2 hover:border-cyan/60 hover:text-cyan transition"
            >
              <span className="flex items-center gap-2 text-text">
                <Glyph name="fab fa-twitter" className="text-purple2" /> twitter
              </span>
              <span className="text-muted">@Oxzenon001</span>
            </a>
          </div>
        </div>

        <form
          onSubmit={onSubmit}
          name="contact"
          method="POST"
          data-netlify="true"
          data-netlify-honeypot="bot-field"
          className="terminal-panel p-5 sm:p-6 space-y-4"
        >
          <input type="hidden" name="form-name" value="contact" />
          <p className="hp-field">
            <label>
              Don't fill this out if you're human:{' '}
              <input
                name="bot-field"
                value={form['bot-field']}
                onChange={update('bot-field')}
              />
            </label>
          </p>

          <Field
            label="name"
            name="name"
            placeholder="Satoshi Nakamoto"
            value={form.name}
            onChange={update('name')}
          />
          <Field
            label="email"
            type="email"
            name="email"
            placeholder="satoshi@bitcoin.org"
            value={form.email}
            onChange={update('email')}
          />
          <Field
            label="message"
            name="message"
            as="textarea"
            placeholder="I'd love to collaborate on..."
            value={form.message}
            onChange={update('message')}
          />

          <button
            type="submit"
            disabled={busy}
            className="term-btn-primary w-full inline-flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {busy
              ? <><Glyph name="fas fa-spinner fa-spin" /> sending…</>
              : <><Glyph name="fas fa-paper-plane" /> ./send</>}
          </button>
        </form>
      </div>
    </Panel>
  );
}

function Field({ label, as = 'input', ...rest }) {
  const baseClass =
    'w-full bg-bg/60 border border-purple/20 rounded-md px-3 py-2 font-mono text-sm text-text placeholder:text-muted/60 focus:outline-none focus:border-cyan/60 transition';
  return (
    <label className="block space-y-1">
      <span className="font-mono text-xs text-purple2">$ {label}:</span>
      {as === 'textarea' ? (
        <textarea rows={5} className={baseClass} {...rest} />
      ) : (
        <input className={baseClass} {...rest} />
      )}
    </label>
  );
}
