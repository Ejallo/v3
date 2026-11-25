// Cookie banner, settings dialog and map placeholder texts. Kept apart from cs.ts / ru.ts.

const cs = {
  title: 'Cookies',
  text: 'Pro chod webu ukládáme jen vaši volbu cookies. S vaším souhlasem načteme mapu a recenze z Google a statistiky a reklamní měření (Google Analytics, Google Ads, Meta). Volbu změníte kdykoli v patičce webu.',
  accept: 'Přijmout vše',
  reject: 'Odmítnout vše',
  settings: 'Nastavení',
  save: 'Uložit výběr',
  close: 'Zavřít',
  dialogTitle: 'Nastavení cookies',
  dialogIntro: 'Vyberte, co smíme načítat. Nezbytné úložiště běží vždy, zbytek jen se souhlasem.',
  always: 'Vždy aktivní',
  inactive: 'zatím nepoužíváme',
  cats: {
    necessary: {
      name: 'Nezbytné',
      text: 'Pamatuje si vaši volbu cookies (localStorage „rm-consent“, 12 měsíců).',
    },
    media: {
      name: 'Externí obsah',
      text: 'Mapa Google Maps a recenze z Google. Při načtení Google uvidí vaši IP adresu a může uložit své cookies (např. NID, až 6 měsíců). Poskytovatel: Google Ireland Ltd.',
    },
    analytics: {
      name: 'Analytika',
      text: 'Google Analytics 4: statistiky návštěvnosti, abychom věděli, co na webu funguje. Cookies _ga, _ga_* (až 2 roky). Poskytovatel: Google Ireland Ltd.',
    },
    marketing: {
      name: 'Marketing',
      text: 'Google Ads a Meta Pixel (Facebook, Instagram): měření poptávek z reklam a reklama pro lidi, kteří web navštívili. Cookies _gcl_au, _fbp (až 3 měsíce). Poskytovatelé: Google Ireland Ltd., Meta Platforms Ireland Ltd.',
    },
  },
  mapText: 'Mapa se načte z Google Maps, až povolíte externí obsah.',
  mapOnce: 'Zobrazit mapu',
  footerLink: 'Nastavení cookies',
};

export type ConsentDict = typeof cs;

const ru: ConsentDict = {
  title: 'Cookies',
  text: 'Для работы сайта мы сохраняем только ваш выбор по cookies. С вашего согласия загрузим карту и отзывы из Google, а также статистику и рекламные метки (Google Analytics, Google Ads, Meta). Выбор можно изменить в любой момент внизу сайта.',
  accept: 'Принять все',
  reject: 'Отклонить все',
  settings: 'Настроить',
  save: 'Сохранить выбор',
  close: 'Закрыть',
  dialogTitle: 'Настройки cookies',
  dialogIntro: 'Выберите, что нам можно загружать. Необходимое хранилище работает всегда, остальное — только с согласием.',
  always: 'Всегда включено',
  inactive: 'пока не используем',
  cats: {
    necessary: {
      name: 'Необходимые',
      text: 'Запоминает ваш выбор по cookies (localStorage «rm-consent», 12 месяцев).',
    },
    media: {
      name: 'Внешний контент',
      text: 'Карта Google Maps и отзывы из Google. При загрузке Google получит ваш IP-адрес и может сохранить свои cookies (например, NID, до 6 месяцев). Поставщик: Google Ireland Ltd.',
    },
    analytics: {
      name: 'Аналитика',
      text: 'Google Analytics 4: статистика посещений, чтобы понимать, что на сайте работает. Cookies _ga, _ga_* (до 2 лет). Поставщик: Google Ireland Ltd.',
    },
    marketing: {
      name: 'Маркетинг',
      text: 'Google Ads и Meta Pixel (Facebook, Instagram): учёт заявок с рекламы и реклама для тех, кто был на сайте. Cookies _gcl_au, _fbp (до 3 месяцев). Поставщики: Google Ireland Ltd., Meta Platforms Ireland Ltd.',
    },
  },
  mapText: 'Карта загрузится из Google Maps, когда вы разрешите внешний контент.',
  mapOnce: 'Показать карту',
  footerLink: 'Настройки cookies',
};

export function consentDict(lang: string): ConsentDict {
  return lang === 'ru' ? ru : cs;
}
