import { useState } from 'react';
import type { Dict } from '@/i18n/cs';
import { EXTERIOR, INTERIOR, PACKAGES, SPECIAL, kc, withSurcharge, type Program } from '@/i18n/prices';
import { SURCHARGE, type BodyType } from '@/config';

type Props = { lang: 'cs' | 'ru'; t: Dict['prices']; from: string };

export default function Pricing({ lang, t, from }: Props) {
  const [body, setBody] = useState<BodyType>('sedan');
  const s = SURCHARGE[body];
  const price = (n: number) => kc(withSurcharge(n, s));

  const Column = ({ title, items }: { title: string; items: Program[] }) => (
    <div className="pr-col">
      <h3 className="pr-col__t">{title}</h3>
      {items.map((p) => (
        <article className="pr-prog" key={p.name.cs}>
          <header>
            <h4>{p.name[lang]}</h4>
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
      <div className="pr-top">
        <p className="pr-lead">{t.lead}</p>
        <div className="chips" role="group">
          {(Object.keys(SURCHARGE) as BodyType[]).map((k) => (
            <button key={k} type="button" className="chip" aria-pressed={body === k} onClick={() => setBody(k)}>
              {t.body[k]}
            </button>
          ))}
        </div>
      </div>

      <div className="pr-cols">
        <Column title={t.exterior} items={EXTERIOR} />
        <Column title={t.interior} items={INTERIOR} />
      </div>

      <h3 className="pr-pk-t">{t.packages}</h3>
      <div className="pr-pk">
        {PACKAGES.map((p) => (
          <article className="pk" key={p.name}>
            <p className="pk__combo">{p.combo[lang]}</p>
            <h4>{p.name}</h4>
            <p className="pk__price">
              <small>{from}</small> <span className="price-num">{price(p.price)}</span>
              <s>
                {t.instead} {price(p.old)}
              </s>
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
            <a className="fbtn fbtn--ghost fbtn--sm fbtn--arrow" href="#objednat">
              <svg className="fbtn__a fbtn__a--in" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
              <span className="fbtn__t">{t.choose}</span>
              <span className="fbtn__c" aria-hidden="true" />
              <svg className="fbtn__a fbtn__a--out" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </a>
          </article>
        ))}
      </div>

      <div className="pr-special">
        <div>
          <h3>{t.special}</h3>
          <p className="muted">{t.specialNote}</p>
        </div>
        <ul>
          {SPECIAL.map((x) => (
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
    </div>
  );
}
