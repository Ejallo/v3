// Price list from Viktor (2026-11-24). Prices in CZK for sedan / coupe; SUV and XXL surcharges apply on top.
type L = { cs: string; ru: string };
export type Program = { name: L; price: number; includes?: L; list: L[] };
export type Pack = { name: string; combo: L; price: number; old: number; exterior: L; interior: L; ideal: L };

export const EXTERIOR: Program[] = [
  {
    name: { cs: 'Program I · Standard', ru: 'Программа I · Standard' },
    price: 1000,
    list: [
      { cs: 'Dvoufázové šetrné ruční mytí', ru: 'Двухфазная бережная ручная мойка' },
      { cs: 'Čištění disků', ru: 'Чистка дисков' },
      { cs: 'Impregnace a oživení pneumatik', ru: 'Пропитка и чернение резины' },
      { cs: 'Detailní čištění mezidveřních prostor', ru: 'Детальная чистка дверных проёмов' },
      { cs: 'Čištění skel zvenku i zevnitř', ru: 'Мойка стёкол внутри и снаружи' },
      { cs: 'Sušení vzduchem a prémiovým ručníkem', ru: 'Сушка воздухом и премиум-полотенцем' },
    ],
  },
  {
    name: { cs: 'Program II · Optimum', ru: 'Программа II · Optimum' },
    price: 1600,
    includes: { cs: 'Vše z Programu I', ru: 'Всё из Программы I' },
    list: [
      { cs: 'Rychlý křemičitý sealant (Quick Wax)', ru: 'Быстрый кварцевый силант (Quick Wax)' },
      { cs: 'Ochrana a oživení vnějších plastů', ru: 'Защита и восстановление внешнего пластика' },
      { cs: 'Odstranění hmyzu a organických nečistot', ru: 'Удаление насекомых и органики' },
    ],
  },
  {
    name: { cs: 'Program III · Detailingový komplet', ru: 'Программа III · Детейлинг-комплекс' },
    price: 2400,
    includes: { cs: 'Vše z Programů I a II', ru: 'Всё из Программ I и II' },
    list: [
      { cs: 'Kompletní chemická dekontaminace laku', ru: 'Полная химическая деконтаминация ЛКП' },
      { cs: 'Leštění chromových prvků', ru: 'Полировка хромированных элементов' },
      { cs: 'Ošetření a impregnace těsnění a gumových částí', ru: 'Обработка и пропитка уплотнителей и резины' },
    ],
  },
];

export const INTERIOR: Program[] = [
  {
    name: { cs: 'Program I · Udržovací čištění', ru: 'Программа I · Поддерживающая уборка' },
    price: 900,
    list: [
      { cs: 'Suché čištění interiéru a kufru', ru: 'Сухая уборка салона и багажника' },
      { cs: 'Šetrné vysávání koberců', ru: 'Бережный пылесос ковров' },
      { cs: 'Čištění skel zevnitř', ru: 'Чистка стёкол изнутри' },
      { cs: 'Čištění a ošetření plastů', ru: 'Чистка и уход за пластиком' },
      { cs: 'Lehké vlhké čištění povrchů', ru: 'Лёгкая влажная уборка поверхностей' },
      { cs: 'Ozonace a provonění interiéru', ru: 'Озонация и ароматизация салона' },
    ],
  },
  {
    name: { cs: 'Program II · Intenziv', ru: 'Программа II · Интенсив' },
    price: 2500,
    includes: { cs: 'Vše z Programu I', ru: 'Всё из Программы I' },
    list: [
      { cs: 'Detailní čištění ovládacích prvků štětcem', ru: 'Чистка кнопок и мелких деталей кистью' },
      { cs: 'Tepování koberečků', ru: 'Химчистка ковриков' },
      { cs: 'Tepování sedadel', ru: 'Химчистка сидений' },
      { cs: 'Dezinfekce výdechů ventilace', ru: 'Дезинфекция воздуховодов' },
      { cs: 'Čištění a kondicionování kůže', ru: 'Чистка и кондиционирование кожи' },
    ],
  },
  {
    name: { cs: 'Program III · Kompletní detailing interiéru', ru: 'Программа III · Полный детейлинг салона' },
    price: 3000,
    includes: { cs: 'Vše z Programů I a II', ru: 'Всё из Программ I и II' },
    list: [
      { cs: 'Hloubkové tepování podlahy extraktorem', ru: 'Глубокая химчистка пола экстрактором' },
      { cs: 'Třífázová péče o kůži: čištění, výživa, impregnace', ru: 'Трёхфазный уход за кожей: очистка, питание, пропитка' },
      { cs: 'Dezinfekce a čištění parou', ru: 'Дезинфекция и чистка паром' },
      { cs: 'Konzervace plastů s UV ochranou', ru: 'Консервация пластика с UV-защитой' },
    ],
  },
];

export const PACKAGES: Pack[] = [
  {
    name: 'S · Smart',
    combo: { cs: 'Exteriér I + Interiér I', ru: 'Экстерьер I + Интерьер I' },
    price: 1800,
    old: 2000,
    exterior: { cs: 'Dvoufázové šetrné mytí, ošetření pneu a mezidveřních prostor.', ru: 'Двухфазная бережная мойка, уход за резиной и дверными проёмами.' },
    interior: { cs: 'Suché čištění, vysávání, ošetření plastů a provonění.', ru: 'Сухая уборка, пылесос, уход за пластиком и ароматизация.' },
    ideal: { cs: 'pravidelnou údržbu vozu', ru: 'регулярного ухода за авто' },
  },
  {
    name: 'M · Medium',
    combo: { cs: 'Exteriér II + Interiér II', ru: 'Экстерьер II + Интерьер II' },
    price: 3700,
    old: 4100,
    exterior: { cs: 'Program I + ochrana laku (Quick Wax), oživení vnějších plastů a odstranění hmyzu.', ru: 'Программа I + защита лака (Quick Wax), восстановление внешнего пластика и удаление насекомых.' },
    interior: { cs: 'Program I + tepování sedadel a koberečků, čištění detailů štětcem.', ru: 'Программа I + химчистка сидений и ковриков, чистка деталей кистью.' },
    ideal: { cs: 'důkladné sezónní osvěžení vozu', ru: 'тщательного сезонного обновления авто' },
  },
  {
    name: 'L · Exclusive',
    combo: { cs: 'Exteriér III + Interiér III', ru: 'Экстерьер III + Интерьер III' },
    price: 4600,
    old: 5500,
    exterior: { cs: 'Kompletní dekontaminace laku, tekuté stěrače, leštění chromu a impregnace těsnění.', ru: 'Полная деконтаминация ЛКП, антидождь, полировка хрома и пропитка уплотнителей.' },
    interior: { cs: 'Hloubkové tepování, parní dezinfekce, třífázová péče o kůži, impregnace a UV ochrana.', ru: 'Глубокая химчистка, паровая дезинфекция, 3-фазный уход за кожей, пропитка и UV-защита.' },
    ideal: { cs: 'maximální péči a dlouhodobou ochranu', ru: 'максимального ухода и долгосрочной защиты' },
  },
];

// Not affected by the body-type switch: priced after inspection.
export const SPECIAL = [
  { name: { cs: 'Leštění karoserie', ru: 'Полировка кузова' }, price: 6000 as number | null },
  { name: { cs: 'Keramika na 1 rok', ru: 'Керамика на 1 год' }, price: 4500 as number | null },
  { name: { cs: 'Keramika na 5 let', ru: 'Керамика на 5 лет' }, price: 6000 as number | null },
  { name: { cs: 'Tónování, PPF, lokální opravy', ru: 'Тонировка, PPF, локальный ремонт' }, price: null as number | null },
];

export const CHEMISTRY = ['KOCH-CHEMIE', 'GYEON', 'ZVIZZER', 'SOFT99', 'K2', 'FX PROTECT'];

// 1 000 → "1 000" with a narrow no-break space, Czech style.
export function kc(n: number) {
  return n.toLocaleString('cs-CZ').replace(/\s/g, ' ') + ' Kč';
}

export function withSurcharge(n: number, s: number) {
  return Math.round((n * (1 + s)) / 10) * 10;
}
