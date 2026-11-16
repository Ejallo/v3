import { useState } from "react"

import { ChartScreen } from "@/components/Cases"
import { DICT, SiteFooter, SiteHeader, homeOf, wrap, type Lang } from "@/components/SiteChrome"

const casesOf = (lang: Lang) => `${homeOf(lang)}cases/`

export function CasesPage({ lang }: { lang: Lang }) {
  const t = DICT[lang]
  const p = t.casesPage
  const home = homeOf(lang)
  const channels = [...new Set(p.items.map((c) => c.channel))]
  const [filter, setFilter] = useState<string | null>(null)
  const count = (ch: string | null) =>
    ch ? p.items.filter((c) => c.channel === ch).length : p.items.length

  return (
    <>
      <SiteHeader lang={lang} home={home} langHrefs={{ ru: casesOf("ru"), de: casesOf("de") }} />

      <main id="main" className="cp relative">
        <div className={wrap}>
          <div className="cp-hero">
            <p className="cp-crumb">
              <a href={home}>{p.home}</a> / {p.h1}
            </p>
            <h1 className="cp-h1">{p.h1}</h1>
            <p className="cp-lead">{p.lead}</p>
            <div className="cp-filters" role="group" aria-label={p.filtersLabel}>
              {[null, ...channels].map((ch) => (
                <button
                  key={ch ?? "all"}
                  type="button"
                  aria-pressed={filter === ch}
                  onClick={() => setFilter(ch)}
                >
                  {ch ?? p.all}
                  <span>{count(ch)}</span>
                </button>
              ))}
            </div>
          </div>

          {p.items.map((c, k) =>
            filter && c.channel !== filter ? null : (
              <article key={c.figure} className="cp-case">
                <div className="cp-top">
                  <div className="cp-left">
                    <div className="cp-head">
                      <span className="cp-num">{String(k + 1).padStart(2, "0")}</span>
                      <span className="cases-chip">{c.channel}</span>
                      <span className="cases-who">{c.client}</span>
                      <span className="cp-when">· {c.when}</span>
                    </div>
                    <p className={c.small ? "cases-fig cases-fig-small" : "cases-fig"}>{c.figure}</p>
                    <h2 className="cases-metric">{c.metric}</h2>
                    <div className="cp-stats">
                      {c.stats.map((s) => (
                        <div key={s.l}>
                          <b>{s.v}</b>
                          <span>{s.l}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <ChartScreen chart={c.chart} />
                </div>
                <div className="cp-story">
                  <div>
                    <h3>{p.was}</h3>
                    <p>{c.was}</p>
                  </div>
                  <div>
                    <h3>{p.did}</h3>
                    <ol>
                      {c.did.map((d) => (
                        <li key={d}>{d}</li>
                      ))}
                    </ol>
                  </div>
                </div>
              </article>
            ),
          )}

          <div className="cp-cta">
            <h2>{p.cta.h2}</h2>
            <div className="cp-buttons">
              <a className="cp-primary" href={`${home}?form=order#contact`}>
                {p.cta.order}
              </a>
              <a className="cp-outline" href={`${home}?form=free#contact`}>
                {p.cta.free}
              </a>
            </div>
          </div>
          <p className="cases-note">{p.note}</p>
        </div>
      </main>

      <SiteFooter lang={lang} />
    </>
  )
}
