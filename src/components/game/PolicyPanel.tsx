'use client';

import { Policies } from '@/types/game';
import Slider from '@/components/ui/Slider';
import { motion } from 'framer-motion';
import { POLICY_EFFECT_DESCRIPTIONS } from '@/lib/engine/effects';

interface PolicyPanelProps {
  policies: Policies;
  onChange: (policies: Policies) => void;
  disabled?: boolean;
}

export default function PolicyPanel({ policies, onChange, disabled }: PolicyPanelProps) {
  const handleChange = (key: keyof Policies, value: number) => {
    onChange({ ...policies, [key]: value });
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-white dark:bg-zinc-800/80 rounded-2xl p-4 sm:p-5 shadow-sm border border-zinc-200/80 dark:border-zinc-700/60 space-y-3 backdrop-blur-sm"
    >
      <div className="border-b border-zinc-100 dark:border-zinc-700/60 pb-2.5">
        <h3 className="text-base font-bold text-zinc-900 dark:text-white flex items-center gap-2">
          <span>🎛️</span> Điều Chỉnh Chính Sách
        </h3>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
          Các thay đổi có hiệu lực từ năm sau. Di chuột vào ⓘ để xem tác động.
        </p>
      </div>

      <div className="space-y-2">
        {(Object.keys(POLICY_EFFECT_DESCRIPTIONS) as (keyof Policies)[]).map(key => {
          const info = POLICY_EFFECT_DESCRIPTIONS[key];
          return (
            <div key={key} className="relative group">
              <Slider
                label={info.label}
                icon={info.icon}
                value={policies[key]}
                onChange={(v) => handleChange(key, v)}
                disabled={disabled}
              />
              <div className="absolute -top-1 right-0 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="bg-zinc-900 text-white text-[10px] rounded-lg px-2.5 py-1.5 shadow-lg max-w-[220px]">
                  {info.effects}
                  {policies[key] >= 85 && <div className="text-yellow-300 mt-0.5">⚠️ Mức cao — rủi ro mất cân đối</div>}
                  {policies[key] <= 15 && <div className="text-red-300 mt-0.5">⚠️ Mức thấp — có thể gây bất ổn</div>}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="text-[10px] text-zinc-400 dark:text-zinc-500 italic pt-1 border-t border-zinc-100 dark:border-zinc-700/60">
        Chính sách có hiệu lực ngay — mỗi quyết định kéo theo hệ quả. Cân bằng là chìa khóa.
      </div>
    </motion.div>
  );
}
