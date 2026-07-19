'use client';

import { Policies } from '@/types/game';
import Slider from '@/components/ui/Slider';
import { motion } from 'framer-motion';

interface PolicyPanelProps {
  policies: Policies;
  onChange: (policies: Policies) => void;
  disabled?: boolean;
}

const POLICY_INFO: Record<keyof Policies, { icon: string; label: string; hint: string }> = {
  taxRate: { icon: '💰', label: 'Thuế thu nhập doanh nghiệp', hint: 'Tăng → Ngân sách ↑, Sản xuất ↓, DN ↓' },
  minWage: { icon: '💵', label: 'Lương tối thiểu', hint: 'Tăng → Phúc lợi ↑, Việc làm ↓, DN ↓' },
  eduInvestment: { icon: '🎓', label: 'Đầu tư giáo dục', hint: 'Tăng → Tự chủ ↑, Phúc lợi ↑, Ngân sách ↓' },
  infraInvestment: { icon: '🏗️', label: 'Đầu tư hạ tầng', hint: 'Tăng → Sản xuất ↑, Việc làm ↑, Ngân sách ↓' },
  fdiPolicy: { icon: '🌐', label: 'Thu hút FDI', hint: 'Tăng → Sản xuất ↑, Tự chủ ↓, Việc làm ↑' },
  envProtection: { icon: '🌿', label: 'Bảo vệ môi trường', hint: 'Tăng → Môi trường ↑, Sản xuất ↓, Ngân sách ↓' },
};

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
        {(Object.keys(POLICY_INFO) as (keyof Policies)[]).map(key => (
          <div key={key} className="relative group">
            <Slider
              label={POLICY_INFO[key].label}
              icon={POLICY_INFO[key].icon}
              value={policies[key]}
              onChange={(v) => handleChange(key, v)}
              disabled={disabled}
            />
            <div className="absolute -top-1 right-0 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="bg-zinc-900 text-white text-[10px] rounded-lg px-2.5 py-1.5 shadow-lg whitespace-nowrap">
                {POLICY_INFO[key].hint}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="text-[10px] text-zinc-400 dark:text-zinc-500 italic pt-1 border-t border-zinc-100 dark:border-zinc-700/60">
        Mỗi chính sách ảnh hưởng nhiều chỉ số — cân bằng là chìa khóa.
      </div>
    </motion.div>
  );
}
