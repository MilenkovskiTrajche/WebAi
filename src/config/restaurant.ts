// Name and old-town kafana identity supplied by the owner.
// TODO: Fill remaining null contact fields with verified details.
export const restaurant = {
  name: "Trajche Bezisten",
  nameIsPlaceholder: false,
  established: 1992,
  address: null as string | null,
  phone: null as string | null,
  mapsUrl: null as string | null,
  hours: null as string | null,
  domain: null as string | null,
  socialImage: null as string | null,
  currency: { code: "MKD", symbol: "ден." },
  sampleMenu: false,
};
export interface Review {
  author: string;
  rating: number;
  text: string;
  date: string;
  source: string;
  sourceUrl: string;
}
// TODO: Add authentic restaurant Google reviews, with permission and source URLs.
export const reviews: Review[] = [];
