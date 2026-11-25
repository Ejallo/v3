// Reviews for the "what clients say" block.
//
// Live mode: the visitor's browser asks Google Places API (New) for the profile's reviews
// (Google allows showing them but not storing copies, so nothing is saved at build time).
// Reviews below MIN_RATING, without text, or by EXCLUDE authors are dropped. With 3+ left the
// block turns into the tilted wall; otherwise the single review from i18n stays.
//
// DEMO is used only when the site is built with DEMO_REVIEWS=1 (local design preview).

export interface Review {
  name: string;
  text: string;
  /** ISO date, shown as "2 weeks ago" in the page language */
  date?: string;
  service?: string;
  rating?: number;
  /** author's Google profile (attribution link) */
  url?: string;
  /** author's Google avatar */
  photo?: string;
}

export const GOOGLE_REVIEWS = {
  // Browser key restricted to the site's domains (HTTP referrers) and to Places API (New).
  apiKey: '',
  // Place ID of the Google profile "Remauto s.r.o." (Spojovací 783/41, Praha 9).
  placeId: '',
  minRating: 4,
  // Owner / staff reviews are not shown as client reviews.
  exclude: ['Виктор Шалик'],
  // Mockup stage: while the site is not indexable (GitHub Pages copy), show DEMO with a yellow
  // "demo" tag so the client sees the filled wall. Switches off by itself once INDEXABLE = true.
  demoWhileMockup: true,
};

export const DEMO = {
  rating: 4.9,
  total: 48,
  items: [
    // real Google reviews of the profile
    { name: 'Aleksandr Volobuev', date: '2026-08-20', text: 'Отдавал на химчистку и полировку. Ну, я думал, пару косяков на коже уже не исправить, но вы творите грязь в хорошем смысле слова) Все чисто, запах в салоне пушка, гидрофоб работает идеально.' },
    { name: 'Vladyslav Veter', date: '2026-08-21', text: 'Доволен всем сервисом, отдельно спасибо за идеальную полировку 🔥' },
    { name: 'Diana Tsekot', date: '2026-11-04', text: 'Дякую за допомогу, перепис зробили за 2 години!' },
    // made-up examples for the mockup
    { name: 'Tereza K.', date: '2026-10-24', service: 'Keramika', text: 'Keramika na novou Octavii, auto vypadá líp než z autosalonu. Voda z kapoty stéká sama, mytí teď trvá pět minut. Komunikace přes WhatsApp, fotky průběžně. Doporučuju.' },
    { name: 'Игорь М.', date: '2026-10-18', service: 'Пакет L', text: 'Брал пакет L перед продажей машины. После полировки и салона перекупы перестали торговаться за «состояние», продал дороже, чем планировал. Окупилось с запасом.' },
    { name: 'Jan Novák', date: '2026-09-30', service: 'Mytí + interiér', text: 'Rychle, pečlivě, za rozumnou cenu. Psí chlupy z kufru zmizely úplně, což se mi doma nikdy nepovedlo.' },
    { name: 'Olena S.', date: '2026-09-21', service: 'Химчистка салона', text: 'Ребёнок разлил какао на светлые сиденья, думала, всё. Забрала машину вечером: ни пятна, ни запаха. Ещё и подсказали, чем дома быстро убирать такое.' },
    { name: 'Martin D.', date: '2026-08-29', service: 'Leštění', text: 'Na černém laku byly hologramy po myčce, teď je to zrcadlo. Před prací změřili lak a ukázali, kde je tenký. Takový přístup se cení.' },
  ] as Review[],
};
