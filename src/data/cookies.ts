// Cookies and storage the site can set, shown on the cookie page. Keep in sync with TRACKING
// in config.ts and the categories in src/lib/consent.ts.

type Cat = 'necessary' | 'media' | 'analytics' | 'marketing';
interface Row {
  name: string;
  provider: string;
  cat: Cat;
  purpose: { cs: string; ru: string };
  expiry: { cs: string; ru: string };
}

export const COOKIES: Row[] = [
  {
    name: 'rm-consent',
    provider: 'REMAUTO (localStorage)',
    cat: 'necessary',
    purpose: { cs: 'Pamatuje si vaši volbu cookies.', ru: 'Запоминает ваш выбор по cookie.' },
    expiry: { cs: '12 měsíců', ru: '12 месяцев' },
  },
  {
    name: 'NID, AEC, SOCS',
    provider: 'Google',
    cat: 'media',
    purpose: {
      cs: 'Nastavuje Google při načtení mapy Google Maps.',
      ru: 'Ставит Google при загрузке карты Google Maps.',
    },
    expiry: { cs: 'až 13 měsíců', ru: 'до 13 месяцев' },
  },
  {
    name: '_ga',
    provider: 'Google Analytics',
    cat: 'analytics',
    purpose: { cs: 'Rozlišuje návštěvníky pro statistiky.', ru: 'Различает посетителей для статистики.' },
    expiry: { cs: '2 roky', ru: '2 года' },
  },
  {
    name: '_ga_*',
    provider: 'Google Analytics',
    cat: 'analytics',
    purpose: { cs: 'Ukládá stav návštěvy.', ru: 'Хранит состояние визита.' },
    expiry: { cs: '2 roky', ru: '2 года' },
  },
  {
    name: '_gcl_au',
    provider: 'Google Ads',
    cat: 'marketing',
    purpose: { cs: 'Měří poptávky z reklam Google.', ru: 'Учитывает заявки с рекламы Google.' },
    expiry: { cs: '3 měsíce', ru: '3 месяца' },
  },
  {
    name: '_fbp',
    provider: 'Meta (Facebook, Instagram)',
    cat: 'marketing',
    purpose: {
      cs: 'Měří reklamy a ukazuje je lidem, kteří web navštívili.',
      ru: 'Учитывает рекламу и показывает её тем, кто был на сайте.',
    },
    expiry: { cs: '3 měsíce', ru: '3 месяца' },
  },
];
