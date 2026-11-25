import { useState, type SyntheticEvent } from 'react';
import type { Dict } from '@/i18n/cs';
import { FORM_ENDPOINT } from '@/config';

type Props = { t: Dict['contact']['form']; services: string[]; lang: string; preset?: string };
type State = 'idle' | 'sending' | 'ok' | 'error' | 'offline';

export default function ContactForm({ t, services, lang, preset = '' }: Props) {
  const [state, setState] = useState<State>('idle');

  async function submit(e: SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    if (data.hp_rx) return; // honeypot
    if (!FORM_ENDPOINT) {
      setState('offline');
      return;
    }
    setState('sending');
    try {
      const res = await fetch(FORM_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, lang, page: location.href }),
      });
      if (!res.ok) throw new Error(String(res.status));
      setState('ok');
      form.reset();
    } catch {
      setState('error');
    }
  }

  return (
    <form className="cf" onSubmit={submit} method="post" noValidate={false}>
      <label className="cf__f">
        <span>{t.name}</span>
        <input name="name" required autoComplete="name" />
      </label>
      <label className="cf__f">
        <span>{t.contact}</span>
        <input name="contact" required autoComplete="tel" inputMode="tel" placeholder="+420" />
      </label>
      <label className="cf__f">
        <span>{t.car}</span>
        <input name="car" placeholder={t.carPh} />
      </label>
      <label className="cf__f">
        <span>{t.service}</span>
        <select name="service" defaultValue={preset}>
          <option value="" disabled>
            {t.servicePh}
          </option>
          {services.map((s) => (
            <option key={s}>{s}</option>
          ))}
          <option>{t.serviceOther}</option>
        </select>
      </label>
      <label className="cf__f cf__f--full">
        <span>{t.message}</span>
        <textarea name="message" rows={4} placeholder={t.messagePh} />
      </label>
      <input className="cf__hp" name="hp_rx" tabIndex={-1} autoComplete="off" aria-hidden="true" />
      <label className="cf__gdpr">
        <input type="checkbox" name="gdpr" required />
        <span>{t.gdpr}</span>
      </label>
      <div className="cf__foot">
        <button className="fbtn fbtn--primary" type="submit" disabled={state === 'sending'}>
          <span className="fbtn__c" aria-hidden="true" />
          <span className="fbtn__in">
            <span className="fbtn__t">{state === 'sending' ? t.sending : t.submit}</span>
          </span>
        </button>
        <p className="cf__msg" role="status" aria-live="polite">
          {state === 'ok' && t.ok}
          {state === 'error' && t.error}
          {state === 'offline' && <span className="todo">{t.notConnected}</span>}
        </p>
      </div>
    </form>
  );
}
