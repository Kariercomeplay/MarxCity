'use client';

interface SliderProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
}

export default function Slider({ label, value, onChange, min = 0, max = 100, step = 5, disabled = false }: SliderProps) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-sm">
        <span className="font-medium text-zinc-700 dark:text-zinc-300">{label}</span>
        <span className="text-zinc-500 dark:text-zinc-400">{value}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        disabled={disabled}
        className="w-full h-2 rounded-full appearance-none cursor-pointer bg-zinc-200 dark:bg-zinc-700 accent-red-700"
        style={{
          background: `linear-gradient(to right, #dc2626 ${pct}%, #e4e4e7 ${pct}%)`,
        }}
      />
    </div>
  );
}
