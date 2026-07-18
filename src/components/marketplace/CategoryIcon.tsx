import {
  Palette,
  Code,
  Megaphone,
  Languages,
  Clapperboard,
  Music,
  Bot,
  Briefcase,
  Lightbulb,
  Database,
  Wallet,
  Camera,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import type { CategoryIcon as CategoryIconName } from "../../data/services";

const ICONS: Record<CategoryIconName, LucideIcon> = {
  palette: Palette,
  code: Code,
  megaphone: Megaphone,
  languages: Languages,
  clapperboard: Clapperboard,
  music: Music,
  bot: Bot,
  briefcase: Briefcase,
  lightbulb: Lightbulb,
  database: Database,
  wallet: Wallet,
  camera: Camera,
  sparkles: Sparkles,
};

export default function CategoryIcon({
  name,
  className,
  strokeWidth,
}: {
  name: CategoryIconName;
  className?: string;
  strokeWidth?: number;
}) {
  const Icon = ICONS[name];
  return <Icon className={className} strokeWidth={strokeWidth} />;
}
