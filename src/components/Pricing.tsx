import { useState } from 'react';
import type { Dict } from '@/i18n/cs';
import { EXTERIOR, INTERIOR, PACKAGES, SPECIAL, kc, withSurcharge, type Program } from '@/i18n/prices';
import { SURCHARGE, type BodyType } from '@/config';

type Tab = 'packages' | 'exterior' | 'interior' | 'special';
// `only` (service pages): show just this tab, without the tab switcher; `rows` picks lines of the special list.
type Props = { lang: 'cs' | 'ru'; t: Dict['prices']; from: string; initialTab?: Tab; only?: Tab; rows?: number[] };

function Btn({ children, href = '#objednat', variant = 'ghost' }: { children: string; href?: string; variant?: string }) {
  return (
    <a className={`fbtn fbtn--${variant} fbtn--sm`} href={href}>
      <span className="fbtn__c" aria-hidden="true" />
      <span className="fbtn__in">
        <span className="fbtn__t">{children}</span>
      </span>
    </a>
  );
}

export default function Pricing({ lang, t, from, initialTab = 'packages', only, rows }: Props) {
  const [body, setBody] = useState<BodyType>('sedan');
  const [tab, setTab] = useState<Tab>(only ?? initialTab);
  const s = SURCHARGE[body];
  const price = (n: number) => kc(withSurcharge(n, s));
  const tabs: [Tab, string][] = [
    ['packages', t.packages],
    ['exterior', t.exterior],
    ['interior', t.interior],
    ['special', t.special],
  ];

  const Programs = ({ items }: { items: Program[] }) => (
    <div className="pr-progs">
      {items.map((p) => (
        <article className="pr-prog" key={p.name.cs}>
          <header>
            <h3>{p.name[lang]}</h3>
            <p>
              <small>{from}</small> <span className="price-num">{price(p.price)}</span>
            </p>
          </header>
          {p.includes && <p className="pr-prog__inc">+ {p.includes[lang]}</p>}
          <ul>
            {p.list.map((li) => (
              <li key={li.cs}>{li[lang]}</li>
            ))}
          </ul>
        </article>
      ))}
    </div>
  );

  return (
    <div className="pr">
      <div className="pr-bar">
        {!only && <div className="chips" role="tablist">
          {tabs.map(([k, label]) => (
            <button key={k} type="button" role="tab" className="chip" aria-pressed={tab === k} aria-selected={tab === k} onClick={() => setTab(k)}>
              <span>{label}</span>
            </button>
          ))}
        </div>}
        {tab !== 'special' && (
          <div className="pr-body" role="group">
            {(Object.keys(SURCHARGE) as BodyType[]).map((k) => (
              <button key={k} type="button" aria-pressed={body === k} onClick={() => setBody(k)}>
                {t.body[k]}
              </button>
            ))}
          </div>
        )}
      </div>

      {tab === 'packages' && (
        <div className="pr-pk">
          {PACKAGES.map((p, i) => (
            <article className={`pk${i === 2 ? ' pk--top' : ''}`} key={p.name}>
              <div className="pk__face neon">
              <span className="pk__step" aria-hidden="true">{p.name.charAt(0)}</span>
              <div className="pk__in">
                <p className="pk__combo">{p.combo[lang]}</p>
                <h3>{p.name}</h3>
                <p className="pk__price">
                  <small>{from}</small> <span className="price-num">{price(p.price)}</span>
                </p>
                <p className="pk__save">
                  {t.instead} <s>{price(p.old)}</s> · −{kc(withSurcharge(p.old, s) - withSurcharge(p.price, s))}
                </p>
                <dl>
                  <dt>{t.exterior}</dt>
                  <dd>{p.exterior[lang]}</dd>
                  <dt>{t.interior}</dt>
                  <dd>{p.interior[lang]}</dd>
                </dl>
                <p className="pk__ideal">
                  {t.idealFor}: {p.ideal[lang]}
                </p>
                <Btn variant={i === 2 ? 'light' : 'ghost'}>{t.choose}</Btn>
              </div>
              </div>
            </article>
          ))}
        </div>
      )}
      {tab === 'exterior' && <Programs items={EXTERIOR} />}
      {tab === 'interior' && <Programs items={INTERIOR} />}
      {tab === 'special' && (
        <div className="pr-special">
          <p className="muted">{t.specialNote}</p>
          <ul>
            {SPECIAL.filter((_, i) => !rows || rows.includes(i)).map((x) => (
              <li key={x.name.cs}>
                <span>{x.name[lang]}</span>
                <b>
                  {x.price ? (
                    <>
                      <small>{from}</small> <span className="price-num">{kc(x.price)}</span>
                    </>
                  ) : (
                    t.individual
                  )}
                </b>
              </li>
            ))}
          </ul>
        </div>
      )}
      <p className="pr-lead">{t.lead}</p>
    </div>
  );
}
