import {
  Sun,
  Leaf,
  Utensils,
  CakeSlice,
  Wine,
  Wheat,
  Shell,
  Egg,
  Fish,
  Nut,
  Bean,
  Milk,
  Sprout,
  Flower2,
  type LucideIcon,
} from "lucide-react";
const icons: Record<string, LucideIcon> = {
  sun: Sun,
  leaf: Leaf,
  utensils: Utensils,
  cake: CakeSlice,
  wine: Wine,
  wheat: Wheat,
  shell: Shell,
  egg: Egg,
  fish: Fish,
  nut: Nut,
  bean: Bean,
  milk: Milk,
  seed: Sprout,
  flower: Flower2,
};
export function Icon({ name, size = 18 }: { name: string; size?: number }) {
  const allergenPaths: Record<string, string[]> = {
    peanut: [
      "M8 3c-5 0-7 6-3 9-4 3-2 9 3 9 3 0 4-3 4-3s1 3 4 3c5 0 7-6 3-9 4-3 2-9-3-9-3 0-4 3-4 3S11 3 8 3Z",
      "m7 7 2 2m6-2 2 2M7 15l2 2m6-2 2 2",
    ],
    crustacean: [
      "M18 8c-1-5-9-6-12-1-4 6 0 14 7 13 4 0 6-3 5-6-1-2-4-3-6-1",
      "m6 7 4 2m-6 2 5 1m-4 4 5-1m0 5 2-4m5-8 4-4m-3 5 4-1M14 7h.01",
      "m18 14 4-2-1 5-3 1",
    ],
    sesame: [
      "M6 4C2 8 2 12 5 12S9 8 6 4Z",
      "M16 3c-4 4-4 8-1 8s4-4 1-8Z",
      "M12 13c-4 4-4 8-1 8s4-4 1-8Z",
      "M21 12c-4 4-4 8-1 8s4-4 1-8Z",
    ],
  };
  if (allergenPaths[name])
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        width={size}
        height={size}
        fill="none"
        stroke="currentColor"
        strokeWidth={1.4}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        {allergenPaths[name].map((d, index) => (
          <path d={d} key={index} />
        ))}
      </svg>
    );
  const Component = icons[name] || Leaf;
  return <Component size={size} strokeWidth={1.4} aria-hidden="true" />;
}
