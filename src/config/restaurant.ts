// TODO: Replace the working name and every null value with verified business details.
export const restaurant = {
  name: 'Bezisten', nameIsPlaceholder: true, established: 1992,
  address: null as string | null, phone: null as string | null,
  mapsUrl: null as string | null, hours: null as string | null,
  domain: null as string | null, socialImage: null as string | null,
  currency: { code: 'MKD', symbol: 'ден.' },
  sampleMenu: true,
};
export interface Review { author: string; rating: number; text: string; date: string; source: string; sourceUrl: string }
// TODO: Add authentic restaurant Google reviews, with permission and source URLs.
export const reviews: Review[] = [];
