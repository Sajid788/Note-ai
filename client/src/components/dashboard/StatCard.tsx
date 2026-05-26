import { LucideIcon } from "lucide-react";

interface StatCardProps {
  label: string;
  value: number;
  icon: LucideIcon;
  accent?: "violet" | "indigo" | "fuchsia";
}

const accents = {
  violet: {
    icon: "bg-violet-500/15 text-violet-400 ring-violet-500/20",
    glow: "from-violet-500/10",
  },
  indigo: {
    icon: "bg-indigo-500/15 text-indigo-400 ring-indigo-500/20",
    glow: "from-indigo-500/10",
  },
  fuchsia: {
    icon: "bg-fuchsia-500/15 text-fuchsia-400 ring-fuchsia-500/20",
    glow: "from-fuchsia-500/10",
  },
};

export function StatCard({
  label,
  value,
  icon: Icon,
  accent = "violet",
}: StatCardProps) {
  const style = accents[accent];

  return (
    <div className="glass-card group relative overflow-hidden rounded-2xl p-6 transition-all duration-300 hover:-translate-y-0.5">
      <div
        className={`pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-gradient-to-br ${style.glow} to-transparent opacity-60 blur-2xl transition-opacity group-hover:opacity-100`}
      />
      <div className="relative flex items-start justify-between">
        <div>
          <p className="text-[13px] font-medium text-zinc-500">{label}</p>
          <p className="mt-3 text-4xl font-bold tracking-tight text-white tabular-nums">
            {value}
          </p>
        </div>
        <div
          className={`flex h-11 w-11 items-center justify-center rounded-xl ring-1 ${style.icon}`}
        >
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}
