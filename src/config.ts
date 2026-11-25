// Business facts in one place. Empty strings render as yellow "to fill" placeholders.

// false = noindex everywhere (temporary GitHub Pages copy). Set true once the real domain is live.
export const INDEXABLE = false;

export const BUSINESS = {
  name: 'REMAUTO Detailing',
  legalName: 'Remauto s.r.o.',
  ico: '', // IČO
  dic: '', // DIČ
  phone: '+420 774 763 138',
  phoneHref: 'tel:+420774763138',
  whatsapp: 'https://wa.me/420774763138',
  telegram: 'https://t.me/+420774763138',
  email: '',
  street: 'Spojovací 783/41',
  zip: '190 00',
  city: 'Praha 9',
  geo: { lat: 50.0979273, lng: 14.4983396 },
  mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Spojovac%C3%AD%20783%2F41%2C%20190%2000%20Praha%209',
  mapEmbed: 'https://maps.google.com/maps?q=Spojovac%C3%AD%20783%2F41%2C%20190%2000%20Praha%209&z=16&output=embed',
  // Taken from the Google Maps profile "Remauto s.r.o." on 2026-11-24.
  hours: { weekdays: '8:00–17:00', weekend: null as string | null },
};

export const SOCIAL = {
  instagram: '',
  tiktok: '',
  facebook: '',
  // Google Maps profile "Remauto s.r.o." (Spojovací 783/41), opened by its CID.
  googleReviews: 'https://www.google.com/maps?cid=7744165680952593166',
  googleWriteReview: '',
};

// Official profiles, used only in JSON-LD sameAs (footer links still come from SOCIAL).
export const SAME_AS = [
  'https://www.instagram.com/remauto_detailing/',
  'https://www.tiktok.com/@rem_auto',
  'https://www.youtube.com/@Remautocz',
  'https://www.facebook.com/profile.php?id=61553540698047',
];

// Telegram form endpoint (Cloudflare Worker). Empty = the form shows a "not connected yet" note.
export const FORM_ENDPOINT = '';

// Body-type surcharges from the price list.
export const SURCHARGE = { sedan: 0, suv: 0.15, xxl: 0.25 } as const;
export type BodyType = keyof typeof SURCHARGE;
