'use client';

interface SliderProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
  icon?: string;
  unit?: string;
}

export default function Slider({
  label,
  value,
  onChange,
  min = 0,
  max = 100,
  step = 5,
  disabled = false,
  icon,
  unit = '%',
}: SliderProps) {
  const pct = ((value - min) / (max - min)) * 100;

  return (
    <div className="space-y-1.5 bg-zinc-50 dark:bg-zinc-800/40 p-2.5 rounded-xl border border-zinc-100 dark:border-zinc-700/40 transition-colors hover:bg-zinc-100/80 dark:hover:bg-zinc-800/70">
      <div className="flex items-center justify-between text-xs sm:text-sm">
        <div className="flex items-center gap-2">
          {icon && <span className="text-sm">{icon}</span>}
          <span className="font-semibold text-zinc-800 dark:text-zinc-200">{label}</span>
        </div>
        <span className="font-bold tabular-nums px-2 py-0.5 rounded-md bg-red-500/10 text-red-600 dark:text-red-400 text-xs">
          {value}{unit}
        </span>
      </div>

      <div className="relative flex items-center">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          disabled={disabled}
          className="w-full h-2 rounded-full appearance-none cursor-pointer bg-zinc-200 dark:bg-zinc-700 accent-red-600 disabled:opacity-50"
          style={{
            background: `linear-gradient(to right, #dc2626 ${pct}%, #e4e4e7 ${pct}%)`,
          }}
        />
      </div>
    </div>
  );
}
