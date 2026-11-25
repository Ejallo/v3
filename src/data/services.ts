// Service pages: one entry per service, one text block per language.
// A third language (uk) is added as a new key next to cs / ru — the routes and the template pick it up.
// Text rules: no prices anywhere here (prices live only in src/i18n/prices.ts).
// [[...]] inside a text renders as a yellow "to fill" marker; use it only where Viktor has to supply a fact.

export type Lang = 'cs' | 'ru';
export const LANGS: Lang[] = ['cs', 'ru'];
export type PriceTab = 'packages' | 'exterior' | 'interior' | 'special';

type Item = { t: string; d: string };
type Option = { name: string; for: string; list: string[]; time: string; lasts?: string };

export type ServiceText = {
  slug: string;
  /** Short name: breadcrumbs, footer, other-services links */
  name: string;
  title: string;
  description: string;
  h1: string;
  lead: string;
  h2: {
    includes: string;
    when?: string;
    options?: string;
    process?: string;
    prices: string;
    ba?: string;
    tools?: string;
    faq?: string;
    other: string;
    form: string;
  };
  includes: Item[];
  when?: Item[];
  optionsLead?: string;
  options?: Option[];
  process?: Item[];
  duration?: string;
  tools?: { text: string; list: string[] };
  faq?: { q: string; a: string }[];
  /** Page text is not written yet: only meta, H1, lead and the work list are shown */
  draft?: boolean;
};

export type Service = {
  id: string;
  /** Index of the matching card in t.services.items (main page tiles, form option, tile photo) */
  tile: number;
  priceTab: PriceTab;
  /** Photos the studio has to supply. Shown as placeholders until real files exist. Written in Russian for the team. */
  needPhotos: { hero: string; ba?: string[] };
} & Record<Lang, ServiceText>;

const interior: Service = {
  id: 'interior',
  tile: 3,
  priceTab: 'interior',
  needPhotos: {
    hero: 'Салон после химчистки: передние сиденья и пол крупным планом, свет студии, горизонтальное 3:2. Своё фото, не сток.',
    ba: [
      'Сиденье с пятнами до и после химчистки, один ракурс, два отдельных кадра',
      'Коврик или пол багажника до и после, один ракурс',
      'Потолок или кожаное сиденье до и после, один ракурс',
    ],
  },
  cs: {
    slug: 'cisteni-interieru-auta-praha',
    name: 'Čištění interiéru a tepování',
    title: 'Čištění interiéru auta a tepování Praha | REMAUTO',
    description:
      'Tepování sedadel, koberců a stropu, čištění a impregnace kůže, odstranění pachů. Studio na Spojovací 783/41, Praha 9.',
    h1: 'Čištění interiéru auta a tepování v Praze',
    lead:
      'Vytepujeme sedadla, koberce i strop, vyčistíme a ošetříme kůži a zbavíme interiér pachu. Bereme osobní auta, SUV i dodávky. Studio najdete na Spojovací 783/41 v Praze 9, hned u autosalonu Remauto.',
    h2: {
      includes: 'Co zahrnuje čištění interiéru auta',
      when: 'Kdy se tepování auta vyplatí',
      options: 'Tři programy čištění interiéru',
      process: 'Jak probíhá čištění interiéru',
      prices: 'Ceník čištění interiéru',
      ba: 'Čištění interiéru: před a po',
      tools: 'Čím čistíme interiér',
      faq: 'Časté dotazy k čištění interiéru',
      other: 'Další služby studia',
      form: 'Objednat čištění interiéru',
    },
    includes: [
      { t: 'Vysávání a suché čištění', d: 'Vysajeme interiér i kufr, včetně míst pod sedadly a mezi nimi.' },
      { t: 'Tepování sedadel a koberců', d: 'Extraktor vstříkne do látky čisticí roztok a hned ho i se špínou odsaje.' },
      { t: 'Čištění stropu', d: 'Strop čistíme šetrně a s minimem vody, protože čalounění je lepené a nesmí promoknout.' },
      { t: 'Péče o kůži', d: 'Kůži vyčistíme, vyživíme a naimpregnujeme, aby nepraskala a méně se špinila.' },
      { t: 'Plasty a drobné detaily', d: 'Tlačítka, mřížky a spáry čistíme štětcem, plasty ošetříme přípravkem s UV ochranou.' },
      { t: 'Pára a dezinfekce', d: 'Párou čistíme povrchy a dezinfikujeme výdechy ventilace.' },
      { t: 'Odstranění pachů', d: 'Když je zdroj pachu vyčištěný, interiér ozonujeme a provoníme.' },
    ],
    when: [
      { t: 'V autě je cítit pach', d: 'Cigarety, pes, rozlité mléko nebo vlhkost po zimě. Osvěžovač vzduchu pach jen na chvíli překryje.' },
      { t: 'Na sedadlech jsou skvrny', d: 'Káva, jídlo od dětí, make-up nebo špína z pracovního oblečení.' },
      { t: 'Po zimě', d: 'Sůl a voda z bot zůstávají v kobercích a nechávají na nich bílé mapy.' },
      { t: 'Před prodejem auta', d: 'Kupující se při prohlídce dívá hlavně dovnitř. Čistý interiér na něj udělá lepší dojem.' },
      { t: 'Po koupi ojetého auta', d: 'Po předchozím majiteli zůstává v sedadlech a kobercích špína i pach. Interiér je dobré vyčistit hned po koupi.' },
    ],
    optionsLead:
      'Program volíme podle toho, jak moc je interiér zašpiněný. Když si nejste jistí, pošlete pár fotek a poradíme, co stačí.',
    options: [
      {
        name: 'Program I · Udržovací čištění',
        for: 'Pravidelná údržba, když je interiér jen zaprášený.',
        list: ['Vysávání interiéru a kufru', 'Čištění plastů a skel zevnitř', 'Ozonace a provonění'],
        time: '[[doba – doplní Viktor]]',
      },
      {
        name: 'Program II · Intenziv',
        for: 'Sezónní čištění, skvrny na sedadlech a kobercích.',
        list: ['Vše z Programu I', 'Tepování sedadel a koberečků', 'Detaily štětcem, dezinfekce výdechů', 'Čištění a kondicionování kůže'],
        time: '[[doba – doplní Viktor]]',
      },
      {
        name: 'Program III · Kompletní detailing interiéru',
        for: 'Silné pachy, auto po koupi nebo před prodejem.',
        list: ['Vše z Programů I a II', 'Hloubkové tepování podlahy', 'Třífázová péče o kůži', 'Pára a UV ochrana plastů'],
        time: '[[doba – doplní Viktor]]',
      },
    ],
    process: [
      { t: 'Poptávka a fotky', d: 'Napíšete nebo zavoláte a pošlete pár fotek interiéru. Navrhneme program a termín.' },
      { t: 'Prohlídka a cena', d: 'Při převzetí projdeme interiér spolu s vámi. Ukážeme místa, kde skvrna nemusí zmizet úplně, a potvrdíme cenu.' },
      { t: 'Vysávání a příprava', d: 'Vyndáme koberečky, vysajeme interiér a kufr, předčistíme skvrny.' },
      { t: 'Tepování a péče', d: 'Tepujeme látky, čistíme párou, ošetříme kůži a plasty. Během práce vám posíláme fotky.' },
      { t: 'Sušení a předání', d: 'Interiér necháme proschnout, výsledek zkontrolujeme a auto vám předáme.' },
    ],
    duration: 'Orientační doba podle programu: [[doplní Viktor]]',
    tools: {
      text: 'Na interiér používáme profesionální chemii a vybavení studia. Látky tepujeme extraktorem, povrchy čistíme párou, pachy odstraňujeme ozonem.',
      list: ['Koch-Chemie', 'Extraktor', 'Parní čistič', 'Ozonátor'],
    },
    faq: [
      {
        q: 'Jak dlouho trvá čištění interiéru?',
        a: 'Udržovací čištění trvá několik hodin. Tepování a kompletní detailing interiéru trvají déle, protože látky musí proschnout. Přesný čas řekneme při objednání podle stavu auta.',
      },
      {
        q: 'Budou sedadla po tepování mokrá?',
        a: 'Extraktor odsaje většinu vody hned při čištění. Látky jsou pak ještě chvíli vlhké, proto auto předáváme až po proschnutí.',
      },
      {
        q: 'Zmizí všechny skvrny?',
        a: 'Většina skvrn od jídla, kávy a běžné špíny zmizí. Staré skvrny od inkoustu nebo barvy a vybledlá místa nemusí jít odstranit úplně. Taková místa vám ukážeme už při prohlídce, ještě před začátkem práce.',
      },
      {
        q: 'Odstraníte pach cigaret nebo psa?',
        a: 'Pach drží hlavně v sedadlech, koberci a stropu. Nejdřív je vyčistíme, potom interiér ozonujeme. U silného pachu po letech kouření řekneme předem, jaký výsledek čekat.',
      },
      {
        q: 'Musím auto před čištěním vyklidit?',
        a: 'Stačí vzít osobní věci a dětské autosedačky. Koberečky vyndáme a kufr vysajeme sami.',
      },
      {
        q: 'Můžete auto vyzvednout a přivézt zpátky?',
        a: 'Ano, vůz můžeme vyzvednout a po čištění přivézt zpět. Podrobnosti domluvíme při objednání.',
      },
    ],
  },
  ru: {
    slug: 'himchistka-avto-praga',
    name: 'Химчистка салона',
    title: 'Химчистка авто в Праге — салон, сиденья, потолок | REMAUTO',
    description:
      'Химчистка салона: сиденья, ковры, потолок, чистка и пропитка кожи, удаление запахов. Студия на Spojovací 783/41, Praha 9.',
    h1: 'Химчистка авто в Праге',
    lead:
      'Делаем химчистку салона авто: сиденья, ковры, потолок, кожа и пластик, убираем запахи. Берём легковые, SUV и минивэны. Студия на Spojovací 783/41 в Праге 9, рядом с автосалоном Remauto.',
    h2: {
      includes: 'Что входит в химчистку салона',
      when: 'Когда нужна химчистка авто',
      options: 'Три программы химчистки',
      process: 'Как проходит химчистка',
      prices: 'Цены на химчистку салона',
      ba: 'Химчистка салона: до и после',
      tools: 'Чем чистим салон',
      faq: 'Вопросы о химчистке авто',
      other: 'Другие услуги студии',
      form: 'Записаться на химчистку',
    },
    includes: [
      { t: 'Пылесос и сухая уборка', d: 'Пылесосим салон и багажник, в том числе под сиденьями и между ними.' },
      { t: 'Химчистка сидений и ковров', d: 'Экстрактор подаёт моющий раствор в ткань и сразу вытягивает его вместе с грязью.' },
      { t: 'Чистка потолка', d: 'Потолок чистим аккуратно и почти без воды: обшивка там на клею, мочить её нельзя.' },
      { t: 'Уход за кожей', d: 'Кожу очищаем, питаем и пропитываем, чтобы она не трескалась и меньше пачкалась.' },
      { t: 'Пластик и мелкие детали', d: 'Кнопки, решётки и щели чистим кистью, пластик обрабатываем составом с UV-защитой.' },
      { t: 'Пар и дезинфекция', d: 'Паром чистим поверхности и дезинфицируем воздуховоды.' },
      { t: 'Удаление запахов', d: 'Когда источник запаха вычищен, делаем озонацию и ароматизацию салона.' },
    ],
    when: [
      { t: 'В машине неприятный запах', d: 'Сигареты, собака, пролитое молоко или сырость после зимы. Ароматизатор перебивает запах ненадолго.' },
      { t: 'Пятна на сиденьях', d: 'Кофе, еда от детей, косметика или грязь с рабочей одежды.' },
      { t: 'После зимы', d: 'Соль и вода с обуви остаются в коврах и выступают белыми разводами.' },
      { t: 'Перед продажей', d: 'Покупатель на осмотре первым делом смотрит в салон. Чистый салон производит другое впечатление.' },
      { t: 'После покупки б/у авто', d: 'После прошлого хозяина в сиденьях и коврах остаются грязь и запах. Салон лучше почистить сразу после покупки.' },
    ],
    optionsLead:
      'Программу выбираем по тому, насколько загрязнён салон. Если не уверены, пришлите пару фото, подскажем, чего хватит.',
    options: [
      {
        name: 'Программа I · Поддерживающая уборка',
        for: 'Регулярный уход, когда салон просто пыльный.',
        list: ['Пылесос салона и багажника', 'Чистка пластика и стёкол изнутри', 'Озонация и ароматизация'],
        time: '[[время – уточнит Виктор]]',
      },
      {
        name: 'Программа II · Интенсив',
        for: 'Сезонная чистка, пятна на сиденьях и ковриках.',
        list: ['Всё из Программы I', 'Химчистка сидений и ковриков', 'Детали кистью, дезинфекция воздуховодов', 'Чистка и кондиционирование кожи'],
        time: '[[время – уточнит Виктор]]',
      },
      {
        name: 'Программа III · Полный детейлинг салона',
        for: 'Сильные запахи, авто после покупки или перед продажей.',
        list: ['Всё из Программ I и II', 'Глубокая химчистка пола', 'Трёхфазный уход за кожей', 'Пар и UV-защита пластика'],
        time: '[[время – уточнит Виктор]]',
      },
    ],
    process: [
      { t: 'Заявка и фото', d: 'Пишете или звоните, присылаете пару фото салона. Предлагаем программу и время.' },
      { t: 'Осмотр и цена', d: 'При приёмке вместе проходим по салону. Показываем пятна, которые могут не уйти полностью, и подтверждаем цену.' },
      { t: 'Пылесос и подготовка', d: 'Достаём коврики, пылесосим салон и багажник, обрабатываем пятна.' },
      { t: 'Химчистка и уход', d: 'Чистим ткань экстрактором, поверхности паром, обрабатываем кожу и пластик. По ходу работы присылаем фото.' },
      { t: 'Сушка и выдача', d: 'Даём салону просохнуть, проверяем результат и отдаём машину.' },
    ],
    duration: 'Ориентир по времени для каждой программы: [[уточнит Виктор]]',
    tools: {
      text: 'Для салона используем профессиональную химию и оборудование студии. Ткань чистим экстрактором, поверхности паром, запахи убираем озоном.',
      list: ['Koch-Chemie', 'Экстрактор', 'Парогенератор', 'Озонатор'],
    },
    faq: [
      {
        q: 'Сколько длится химчистка салона?',
        a: 'Поддерживающая уборка занимает несколько часов. Химчистка и полный детейлинг салона дольше, потому что ткани нужно просохнуть. Точное время скажем при записи по состоянию машины.',
      },
      {
        q: 'Сиденья после химчистки будут мокрые?',
        a: 'Экстрактор сразу вытягивает большую часть воды. Ткань какое-то время остаётся влажной, поэтому машину отдаём, когда салон просохнет.',
      },
      {
        q: 'Все пятна уйдут?',
        a: 'Большинство пятен от еды, кофе и обычной грязи уходят. Старые пятна от ручки или краски и выцветшие места могут не уйти полностью. Такие места покажем ещё на осмотре, до начала работы.',
      },
      {
        q: 'Уберёте запах сигарет или собаки?',
        a: 'Запах держится в сиденьях, коврах и потолке. Сначала чистим их, потом делаем озонацию. Если в машине курили годами, заранее скажем, какого результата ждать.',
      },
      {
        q: 'Нужно ли освобождать салон?',
        a: 'Заберите личные вещи и детские кресла. Коврики достанем и багажник пропылесосим сами.',
      },
      {
        q: 'Можете забрать и привезти машину?',
        a: 'Да, можем забрать авто и привезти обратно после химчистки. Детали обсудим при записи.',
      },
    ],
  },
};

// Pages below are placeholders until their texts are written (stage 2): meta, H1 and work list only.
const wash: Service = {
  id: 'wash',
  tile: 0,
  priceTab: 'exterior',
  needPhotos: { hero: 'Ручная мойка в студии: машина в пене или мойщик с рукавицей, горизонтальное 3:2.' },
  cs: {
    slug: 'rucni-myti-auta-praha',
    name: 'Ruční mytí auta',
    title: 'Ruční mytí auta Praha – detailingové mytí | REMAUTO',
    description:
      'Vícefázové ruční mytí, dekontaminace laku, čištění disků a vosk. Detailingové studio na Spojovací 783/41, Praha 9.',
    h1: 'Ruční mytí auta v Praze',
    lead: 'Vícefázové ruční mytí, dekontaminace laku, čištění disků a vosk. Detailingové studio na Spojovací 783/41, Praha 9.',
    h2: {
      includes: 'Co zahrnuje ruční mytí auta',
      prices: 'Ceník ručního mytí',
      other: 'Další služby studia',
      form: 'Objednat ruční mytí',
    },
    includes: [
      { t: 'Vícefázové ruční mytí', d: '' },
      { t: 'Dekontaminace: asfalt, polétavá rez', d: '' },
      { t: 'Čištění disků a koncovek výfuku', d: '' },
      { t: 'Tvrdý vosk nebo hydropolymer', d: '' },
    ],
    draft: true,
  },
  ru: {
    slug: 'ruchnaya-mojka-avto-praga',
    name: 'Ручная мойка',
    title: 'Ручная мойка авто в Праге — детейлинг-мойка | REMAUTO',
    description:
      'Многофазная ручная мойка, чистка лака от битума, диски и воск. Детейлинг-студия на Spojovací 783/41, Praha 9.',
    h1: 'Ручная мойка авто в Праге',
    lead: 'Многофазная ручная мойка, чистка лака от битума, диски и воск. Детейлинг-студия на Spojovací 783/41, Praha 9.',
    h2: {
      includes: 'Что входит в ручную мойку авто',
      prices: 'Цены на ручную мойку',
      other: 'Другие услуги студии',
      form: 'Записаться на мойку',
    },
    includes: [
      { t: 'Многофазная ручная мойка', d: '' },
      { t: 'Деконтаминация: битум, металлические вкрапления', d: '' },
      { t: 'Чистка дисков и выхлопа', d: '' },
      { t: 'Твёрдый воск или гидрополимер', d: '' },
    ],
    draft: true,
  },
};

const ppf: Service = {
  id: 'ppf',
  tile: 4,
  priceTab: 'special',
  needPhotos: { hero: 'Оклейка PPF или тонировка: плёнка на капоте/фаре либо затонированные стёкла, горизонтальное 3:2.' },
  cs: {
    slug: 'tonovani-autoskel-ppf-praha',
    name: 'Tónování a PPF fólie',
    title: 'Tónování autoskel a PPF fólie Praha | REMAUTO',
    description:
      'Zatmavení skel fólií s atestem a polep rizikových míst ochrannou PPF fólií. Cenu spočítáme podle vozu. Praha 9.',
    h1: 'Tónování autoskel a ochranná PPF fólie v Praze',
    lead: 'Zatmavení skel fólií s atestem a polep rizikových míst ochrannou PPF fólií. Cenu spočítáme podle vozu. Praha 9.',
    h2: {
      includes: 'Co zahrnuje tónování a PPF',
      prices: 'Ceník tónování a PPF',
      other: 'Další služby studia',
      form: 'Objednat tónování nebo PPF',
    },
    includes: [
      { t: 'Certifikované tónování s atestem 8SD', d: '' },
      { t: 'Polep rizikových míst fólií PPF', d: '' },
      { t: 'Ochrana prvků interiéru fólií', d: '' },
    ],
    draft: true,
  },
  ru: {
    slug: 'tonirovka-ppf-praga',
    name: 'Тонировка и PPF',
    title: 'Тонировка авто и плёнка PPF в Праге | REMAUTO',
    description:
      'Тонировка стёкол плёнкой с аттестацией и оклейка зон риска плёнкой PPF. Стоимость считаем под ваше авто. Praha 9.',
    h1: 'Тонировка авто и защитная плёнка PPF в Праге',
    lead: 'Тонировка стёкол плёнкой с аттестацией и оклейка зон риска плёнкой PPF. Стоимость считаем под ваше авто. Praha 9.',
    h2: {
      includes: 'Что входит в тонировку и оклейку PPF',
      prices: 'Цены на тонировку и PPF',
      other: 'Другие услуги студии',
      form: 'Записаться на тонировку или PPF',
    },
    includes: [
      { t: 'Сертифицированная тонировка с аттестацией 8SD', d: '' },
      { t: 'Оклейка зон риска плёнкой PPF', d: '' },
      { t: 'Защита элементов салона плёнкой', d: '' },
    ],
    draft: true,
  },
};

const polish: Service = {
  id: 'polish',
  tile: 1,
  priceTab: 'special',
  needPhotos: {
    hero: 'Полировка кузова машинкой Rupes под светом студии, видна разница на панели, горизонтальное 3:2.',
    ba: ['Лак с голограммами и «паутинкой» до и после полировки, один ракурс', 'Мутная фара до и после, один ракурс'],
  },
  cs: {
    slug: 'lesteni-auta-renovace-svetlometu-praha',
    name: 'Leštění a renovace světlometů',
    title: 'Leštění auta a renovace světlometů Praha | REMAUTO',
    description:
      'Rozleštění laku, odstranění škrábanců a hologramů, renovace zmatnělých světlometů. Před leštěním měříme tloušťku laku. Praha 9.',
    h1: 'Leštění auta a renovace světlometů v Praze',
    lead: 'Rozleštění laku, odstranění škrábanců a hologramů, renovace zmatnělých světlometů. Před leštěním měříme tloušťku laku. Praha 9.',
    h2: {
      includes: 'Co zahrnuje leštění auta',
      prices: 'Ceník leštění',
      other: 'Další služby studia',
      form: 'Objednat leštění',
    },
    includes: [
      { t: 'Jednokrokové i vícekrokové leštění', d: '' },
      { t: 'Odstranění škrábanců a hologramů', d: '' },
      { t: 'Leštění a ochrana světlometů', d: '' },
    ],
    draft: true,
  },
  ru: {
    slug: 'polirovka-avto-i-far-praga',
    name: 'Полировка кузова и фар',
    title: 'Полировка авто и фар в Праге | REMAUTO',
    description:
      'Убираем царапины, голограммы и «паутинку», возвращаем прозрачность мутным фарам. Перед полировкой замеряем толщину ЛКП. Praha 9.',
    h1: 'Полировка авто и фар в Праге',
    lead: 'Убираем царапины, голограммы и «паутинку», возвращаем прозрачность мутным фарам. Перед полировкой замеряем толщину ЛКП. Praha 9.',
    h2: {
      includes: 'Что входит в полировку авто',
      prices: 'Цены на полировку',
      other: 'Другие услуги студии',
      form: 'Записаться на полировку',
    },
    includes: [
      { t: 'Одношаговая и многоэтапная полировка', d: '' },
      { t: 'Удаление царапин, голограмм и «паутинки»', d: '' },
      { t: 'Полировка и защита оптики', d: '' },
    ],
    draft: true,
  },
};

const ceramic: Service = {
  id: 'ceramic',
  tile: 2,
  priceTab: 'special',
  needPhotos: { hero: 'Нанесение керамики аппликатором на капот или капли воды на керамике, горизонтальное 3:2.' },
  cs: {
    slug: 'keramicka-ochrana-laku-praha',
    name: 'Keramická ochrana laku',
    title: 'Keramická ochrana laku Praha | REMAUTO',
    description:
      'Keramická ochrana karoserie na 1–5 let, ochrana disků a tekuté stěrače. Příprava laku před aplikací v ceně. Studio v Praze 9.',
    h1: 'Keramická ochrana laku v Praze',
    lead: 'Keramická ochrana karoserie na 1–5 let, ochrana disků a tekuté stěrače. Příprava laku před aplikací v ceně. Studio v Praze 9.',
    h2: {
      includes: 'Co zahrnuje keramická ochrana laku',
      prices: 'Ceník keramické ochrany',
      other: 'Další služby studia',
      form: 'Objednat keramickou ochranu',
    },
    includes: [
      { t: 'Keramika na karoserii na 1–5 let', d: '' },
      { t: 'Ochrana disků', d: '' },
      { t: 'Tekuté stěrače na skla', d: '' },
    ],
    draft: true,
  },
  ru: {
    slug: 'keramika-avto-praga',
    name: 'Керамика на авто',
    title: 'Керамика на авто в Праге — керамическое покрытие | REMAUTO',
    description:
      'Керамическое покрытие кузова на 1–5 лет, керамика на диски и антидождь. Подготовка лака входит в услугу. Praha 9.',
    h1: 'Керамика на авто в Праге',
    lead: 'Керамическое покрытие кузова на 1–5 лет, керамика на диски и антидождь. Подготовка лака входит в услугу. Praha 9.',
    h2: {
      includes: 'Что входит в керамику на авто',
      prices: 'Цены на керамику',
      other: 'Другие услуги студии',
      form: 'Записаться на керамику',
    },
    includes: [
      { t: 'Керамика на кузов на 1–5 лет', d: '' },
      { t: 'Защита дисков', d: '' },
      { t: 'Антидождь на стёкла', d: '' },
    ],
    draft: true,
  },
};

const sale: Service = {
  id: 'sale',
  tile: 5,
  priceTab: 'packages',
  needPhotos: {
    hero: 'Готовая к продаже машина в студии или на площадке автосалона, горизонтальное 3:2.',
    ba: ['Скол или повреждённый диск до и после ремонта, один ракурс'],
  },
  cs: {
    slug: 'priprava-auta-k-prodeji-praha',
    name: 'Příprava auta k prodeji',
    title: 'Příprava auta k prodeji Praha | REMAUTO',
    description:
      'Připravíme vůz k prodeji: mytí, leštění, interiér, oprava odštěpků a disků. I ve spolupráci s autosalonem Remauto, Praha 9.',
    h1: 'Příprava auta k prodeji a lokální opravy v Praze',
    lead: 'Připravíme vůz k prodeji: mytí, leštění, interiér, oprava odštěpků a disků. I ve spolupráci s autosalonem Remauto, Praha 9.',
    h2: {
      includes: 'Co zahrnuje příprava auta k prodeji',
      prices: 'Ceník přípravy k prodeji',
      other: 'Další služby studia',
      form: 'Objednat přípravu k prodeji',
    },
    includes: [
      { t: 'Lokální oprava odštěpků laku', d: '' },
      { t: 'Renovace disků', d: '' },
      { t: 'Příprava vozu k prodeji, i ve spolupráci s autosalonem Remauto', d: '' },
    ],
    draft: true,
  },
  ru: {
    slug: 'predprodazhnaya-podgotovka-praga',
    name: 'Предпродажная подготовка',
    title: 'Предпродажная подготовка авто в Праге | REMAUTO',
    description:
      'Готовим авто к продаже: мойка, полировка, химчистка, подкрас сколов и диски. Можно вместе с автосалоном Remauto, Praha 9.',
    h1: 'Предпродажная подготовка авто в Праге',
    lead: 'Готовим авто к продаже: мойка, полировка, химчистка, подкрас сколов и диски. Можно вместе с автосалоном Remauto, Praha 9.',
    h2: {
      includes: 'Что входит в предпродажную подготовку',
      prices: 'Цены на предпродажную подготовку',
      other: 'Другие услуги студии',
      form: 'Записаться на предпродажную подготовку',
    },
    includes: [
      { t: 'Локальный подкрас сколов', d: '' },
      { t: 'Освежение и реставрация дисков', d: '' },
      { t: 'Подготовка авто к продаже, в том числе вместе с автосалоном Remauto', d: '' },
    ],
    draft: true,
  },
};

// Order = order in the footer and in "other services" (by search demand, see the TZ).
export const SERVICES: Service[] = [interior, wash, ppf, polish, ceramic, sale];

/** Site path of a service page without the base, e.g. "ru/himchistka-avto-praga/" */
export function servicePath(s: Service, lang: Lang) {
  return `${lang === 'cs' ? '' : lang + '/'}${s[lang].slug}/`;
}

export function serviceByTile(tile: number) {
  return SERVICES.find((s) => s.tile === tile);
}

/** Splits "text [[todo]] text" into parts for rendering the yellow markers */
export function parts(text: string) {
  return text.split(/(\[\[.+?\]\])/).filter(Boolean).map((p) => (p.startsWith('[[') ? { todo: p.slice(2, -2) } : { text: p }));
}

// Interface strings of the service template (kept here so the shared i18n files stay untouched).
export const UI: Record<Lang, {
  home: string;
  services: string;
  crumbs: string;
  book: string;
  photos: string;
  details: string;
  for: string;
  time: string;
  lasts: string;
  draft: string;
  photoNeeded: string;
  baPair: string;
}> = {
  cs: {
    home: 'Úvod',
    services: 'Služby',
    crumbs: 'Drobečková navigace',
    book: 'Objednat se',
    photos: 'Poslat fotky',
    details: 'Více o službě',
    for: 'Pro koho',
    time: 'Doba',
    lasts: 'Vydrží',
    draft: 'Text stránky se připravuje (etapa 2)',
    photoNeeded: 'Potřebné foto',
    baPair: 'Před / po',
  },
  ru: {
    home: 'Главная',
    services: 'Услуги',
    crumbs: 'Хлебные крошки',
    book: 'Записаться',
    photos: 'Прислать фото',
    details: 'Подробнее',
    for: 'Для чего',
    time: 'Время',
    lasts: 'Держится',
    draft: 'Текст страницы готовится (этап 2)',
    photoNeeded: 'Нужно фото',
    baPair: 'До / после',
  },
};
