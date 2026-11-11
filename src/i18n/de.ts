// German copy. Same keys as ru.ts.
import type { Dict } from "./ru"

export const de: Dict = {
  lang: "de",
  locale: "de-DE",
  meta: {
    title: "Google Ads & SEO Freelancer für KMU | VVdigital",
    description:
      "Google Ads, SEO und Social Ads für kleine und mittlere Unternehmen in Deutschland. Kommunikation schriftlich per Messenger. Erster Schritt: ein kostenloser Mini-Check.",
  },
  skip: "Zum Inhalt",
  menu: "Menü",
  menuDescription: "Abschnitte der Seite",
  navLabel: "Hauptnavigation",
  navMobileLabel: "Mobile Navigation",
  write: "Schreiben",
  nav: [
    { href: "#services", label: "Leistungen" },
    { href: "#results", label: "Ergebnisse" },
    { href: "#prices", label: "Preise" },
    { href: "#steps", label: "Ablauf" },
    { href: "#faq", label: "Fragen" },
  ],
  hero: {
    slogan: ["Erst", "rechnen.", "Dann ausgeben."],
    h1: "Google Ads & SEO Freelancer",
    lead: "Google Ads, SEO und Social Ads für kleine und mittlere Unternehmen. Kommunikation schriftlich per Messenger. Erster Schritt: ein kostenloser Mini-Check – eine Seite mit Befunden zu Ihren Anzeigen oder Ihrer Website.",
    cta: "Kostenlosen Mini-Check anfordern",
    proof: [
      { n: "1.316 %", l: "ROAS eines Onlineshops" },
      { n: "12.600", l: "Conversions einer Klinik" },
      { n: "+69 %", l: "Klicks aus der Suche" },
    ],
  },
  services: {
    h2: "Leistungen: Google Ads, SEO und Social Ads",
    tabsLabel: "Leistungen",
    items: [
      {
        id: "google",
        name: "Google Ads",
        price: "ab 590 € pro Monat",
        lead: "Suche, Performance Max, Shopping und Remarketing in Ihrem eigenen Konto.",
        points: [
          "Kontostruktur, auszuschließende Keywords, Schutz vor Klickbetrug",
          "Branchen mit Einschränkungen: Medizin, Recht, Dokumente",
          "Bericht in Euro: Ausgaben, Anfragen, Kosten pro Anfrage",
        ],
      },
      {
        id: "seo",
        name: "SEO & GEO",
        price: "ab 600 € pro Monat",
        lead: "Keyword-Recherche, Seitenstruktur, Meta-Tags, technisches Audit und Inhalte. Als Projekt oder monatlich.",
        points: [
          "Mehrsprachige Websites mit hreflang",
          "GEO: damit ChatGPT, Gemini und die KI-Übersichten von Google Sie nennen",
          "Der Preis hängt von Websitegröße, Sprachen und Wettbewerb ab",
        ],
      },
      {
        id: "tracking",
        name: "Analyse & Tracking",
        price: "390–790 € einmalig",
        lead: "GA4, Tag Manager, Conversions und die Verknüpfung von GA4 mit Google Ads.",
        points: [
          "Die Anzeigen zählen echte Käufe statt Aufrufe der Danke-Seite",
          "Prüfung, ob die Zahlen in Ads und GA4 übereinstimmen",
        ],
      },
      {
        id: "social",
        name: "Social Ads",
        price: "Preis nach dem Mini-Check",
        lead: "Bezahlte Anzeigen dort, wo Ihre Zielgruppe durch den Feed scrollt.",
        points: [
          "Meta Ads: Facebook und Instagram",
          "TikTok Ads: kurze Videos für Anfragen",
          "Telegram Ads: russischsprachiges Publikum in Deutschland",
        ],
      },
      {
        id: "audit",
        name: "Audit von Konto und Tracking",
        price: "490 €",
        lead: "Vollständige Analyse: wohin das Budget fließt, was falsch gezählt wird und was zuerst zu beheben ist.",
        points: ["Der Betrag wird auf den ersten Betreuungsmonat angerechnet"],
      },
      {
        id: "gstart",
        name: "Google-Start",
        price: "290 €",
        lead: "Ihr Unternehmensprofil bei Google und auf Maps, komplett eingerichtet.",
        points: ["Anlegen, bestätigen, ausfüllen", "Kurze Abstimmung zum Abschluss"],
      },
    ],
  },
  results: {
    h2: "Ergebnisse aus Google Ads und SEO",
    rows: [
      {
        figure: "×13,16",
        metric: "Umsatz je investierter Hrywnja",
        who: "Onlineshop, Ukraine · Google Ads",
        text: "Ausgaben 275.696 ₴, Conversion-Wert 3.628.284 ₴. ROAS 1.316 %.",
      },
      {
        figure: "12.600",
        metric: "Conversions zu durchschnittlich 21,57 zł",
        who: "Klinik mit mehreren Fachrichtungen, Polen · Google Ads",
        text: "Medizin gehört zu den Themen mit den strengsten Google-Richtlinien: Die halbe Arbeit besteht darin, die Prüfung zu bestehen und das Konto nicht zu verlieren. Der Kundenname unterliegt einer Vertraulichkeitsvereinbarung.",
      },
      {
        figure: "+69 %",
        metric: "Klicks aus der Suche im Jahresvergleich",
        who: "technomodule.zp.ua · SEO",
        text: "Durchschnittliche Position von 17,5 auf 7,0, Klicks auf Produktseiten +99 %. Verglichen werden Juli–August 2026 und 2025, weil die Branche saisonal ist.",
      },
      {
        figure: "25 / 26",
        metric: "Käufe in Google Ads und Käufer in GA4",
        who: "Online-Dokumentenservice, Polen · Tracking",
        text: "Oktober 2026. Nach der Einrichtung des Trackings weichen Anzeigen und Analyse um einen Kauf ab, und die Gebote lernen aus echten Verkäufen.",
      },
    ],
    geo: "GEO: Die Klinik aus dem zweiten Beispiel erscheint bereits in Antworten von ChatGPT und in den KI-Übersichten von Google. Datierte Screenshots zeige ich auf Anfrage.",
  },
  money: {
    h2: "Google Ads Beispiel: Onlineshop, ROAS 1.316 %",
    lead: "Onlineshop, Ukraine. Die Breite des Stroms ist maßstabsgetreu: Rechts ist er 13,16-mal so breit wie links.",
    aria: "Maßstabsgetreues Schema: Der schmale Strom der Werbeausgaben wird zu einem Umsatzstrom, der 13,16-mal so breit ist.",
    ratio: "×13,16",
    spent: { label: "In Anzeigen investiert", value: "5.460 €", sub: "275.696 ₴" },
    orders: { label: "Bestellungen", value: "2.526" },
    returned: { label: "Umsatz daraus", value: "71.870 €", sub: "3.628.284 ₴" },
    derived: [
      { label: "Kosten pro Bestellung", value: "≈ 2,16 €" },
      { label: "Durchschnittliche Bestellung", value: "≈ 28,45 €" },
      { label: "Je 1 € Werbung", value: "13,16 € Umsatz" },
    ],
    caption:
      "Eurobeträge umgerechnet aus Hrywnja zum Kurs der Nationalbank der Ukraine vom 12.11.2026: 1 € = 50,48 ₴.",
  },
  prices: {
    h2: "Preise für Google Ads und SEO",
    lead: "Der Preis hängt von Websitegröße, Sprachen und Wettbewerb ab, nicht vom Namen der Branche. Stellen Sie Ihre Aufgabe zusammen und sehen Sie, ab welchem Betrag es losgeht.",
  },
  configurator: {
    hint: "Aufgabe zusammenstellen – der Preis wird sofort berechnet",
    monthlyLegend: "Jeden Monat",
    onceLegend: "Einmalig",
    labels: {
      google: "Google Ads",
      seo: "SEO & GEO",
      social: "Meta · TikTok · Telegram",
      audit: "Audit",
      tracking: "Tracking",
      gstart: "Google-Start",
    },
    budget: "Werbebudget pro Monat",
    budgetNote: "Das zahlen Sie direkt an Google oder Meta, nicht an mich.",
    monthlyFrom: "Betreuung pro Monat, ab",
    onceFrom: "Einmalig, ab",
    noteNothing: "Bitte mindestens eine Leistung auswählen.",
    noteSocial:
      "Meta, TikTok und Telegram: Den Preis nenne ich nach dem Mini-Check, er ist in der Summe nicht enthalten.",
    noteAudit: "490 € für das Audit werden auf den ersten Betreuungsmonat angerechnet.",
    noteTracking: "Tracking: 390–790 €, je nach Zahl der Ereignisse und Systeme.",
    cta: "Kostenlosen Mini-Check anfordern",
    pilot: "Pilot: −⅓ für 3 Monate",
    pilotNote:
      "Für die ersten drei Kunden in Deutschland – im Austausch gegen eine schriftliche Bewertung und das Recht, das Projekt als Referenz zu zeigen.",
  },
  steps: {
    h2: "So läuft die Zusammenarbeit ab",
    items: [
      {
        title: "Mini-Check, 0 €",
        text: "Sie schicken mir Ihre Website. Ich sehe mir Anzeigen oder Suchergebnisse an und sende eine Seite mit Befunden zurück. Danach entscheiden Sie selbst.",
      },
      {
        title: "Audit, 490 €",
        text: "Vollständige Analyse von Konto und Tracking mit einem Plan nach Prioritäten.",
      },
      { title: "Start", text: "Ich richte Kampagnen und Messung in Ihren Konten ein." },
      {
        title: "Betreuung",
        text: "Jeden Monat ein Bericht: Ausgaben, Anfragen, Kosten pro Anfrage.",
      },
    ],
  },
  about: {
    h2: "Über mich",
    paragraphs: [
      "Ich heiße Vladyslav. Angefangen habe ich mit Performance-Kampagnen in Facebook und Google Ads auf eigenes Risiko – dort zahlt man jedes ungenaue Gebot aus eigener Tasche.",
      "Danach kamen TikTok, SEO und Kundenprojekte in der Ukraine und in Polen. Seit 2023 lebe ich in Deutschland, arbeite selbstständig und stelle Rechnungen aus. Ich arbeite remote für Kunden in ganz Deutschland.",
    ],
  },
  faq: {
    h2: "Häufige Fragen",
    items: [
      {
        q: "Wem gehören die Werbekonten?",
        a: "Ihnen. Ich arbeite über einen Zugriff, den Sie jederzeit entziehen können. Kampagnen, Daten und Verlauf bleiben bei Ihnen.",
      },
      {
        q: "Wie läuft die Kommunikation?",
        a: "Schriftlich per Messenger oder E-Mail, auf Deutsch. Telefonate sind auf Russisch oder Ukrainisch möglich.",
      },
      {
        q: "Welches Werbebudget ist nötig?",
        a: "Ab 500 € pro Monat für das Werbekonto selbst. Mit weniger Budget reichen die Daten nicht aus, um Schlüsse zu ziehen.",
      },
      {
        q: "Garantieren Sie Ergebnisse?",
        a: "Nein, und glauben Sie niemandem, der das tut: Auktion und Suchergebnisse kontrolliert niemand. Ich garantiere einen verständlichen Bericht und dass Sie jede Änderung im Konto sehen.",
      },
      {
        q: "Was, wenn der Mini-Check nichts findet?",
        a: "Dann schreibe ich genau das. Dann brauchen Sie weder ein Audit noch mich.",
      },
    ],
  },
  contact: {
    h2: "Kostenloser Mini-Check",
    lead: "Schicken Sie mir Ihre Website – Sie erhalten eine Seite mit Befunden. Unverbindlich, Kontozugänge sind in diesem Schritt nicht nötig.",
    site: "Website",
    topics: "Was soll geprüft werden?",
    reply: "Wohin soll die Antwort gehen?",
    replyPlaceholder: "E-Mail oder Messenger",
    note: "Kommentar, wenn Sie möchten",
    submit: "Kostenlosen Mini-Check anfordern",
    toastTitle: "Entwurf: Das Formular sendet noch nicht",
    toastText: "Der Versand funktioniert, sobald das Postfach eingerichtet ist.",
  },
  footer: {
    left: "VVdigital, Deutschland",
    right: "Impressum und Datenschutz folgen vor dem Start",
  },
}
