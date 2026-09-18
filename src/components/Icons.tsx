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
  const Component = icons[name] || Leaf;
  return <Component size={size} strokeWidth={1.4} aria-hidden="true" />;
}
