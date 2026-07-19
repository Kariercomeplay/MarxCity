'use client';

import { Policies } from '@/types/game';
import Slider from '@/components/ui/Slider';
import Button from '@/components/ui/Button';
import { motion } from 'framer-motion';

interface PolicyPanelProps {
  policies: Policies;
  onChange: (policies: Policies) => void;
  onConfirm: () => void;
  disabled?: boolean;
}

export default function PolicyPanel({ policies, onChange, onConfirm, disabled }: PolicyPanelProps) {
  const handleChange = (key: keyof Policies, value: number) => {
    onChange({ ...policies, [key]: value });
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-white dark:bg-zinc-800/80 rounded-2xl p-4 sm:p-5 shadow-sm border border-zinc-200/80 dark:border-zinc-700/60 space-y-4 backdrop-blur-sm"
    >
      <div className="border-b border-zinc-100 dark:border-zinc-700/60 pb-3">
        <h3 className="text-base font-bold text-zinc-900 dark:text-white flex items-center gap-2">
          <span>🎛️</span> Điều Chỉnh Chính Sách
        </h3>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
          Tùy chỉnh 6 công cụ vĩ mô trước khi kết thúc lượt
        </p>
      </div>

      <div className="space-y-2.5">
        <Slider
          label="Thuế thu nhập doanh nghiệp"
          icon="💰"
          value={policies.taxRate}
          onChange={(v) => handleChange('taxRate', v)}
          disabled={disabled}
        />
        <Slider
          label="Lương tối thiểu"
          icon="💵"
          value={policies.minWage}
          onChange={(v) => handleChange('minWage', v)}
          disabled={disabled}
        />
        <Slider
          label="Đầu tư giáo dục"
          icon="🎓"
          value={policies.eduInvestment}
          onChange={(v) => handleChange('eduInvestment', v)}
          disabled={disabled}
        />
        <Slider
          label="Đầu tư hạ tầng"
          icon="🏗️"
          value={policies.infraInvestment}
          onChange={(v) => handleChange('infraInvestment', v)}
          disabled={disabled}
        />
        <Slider
          label="Thu hút FDI"
          icon="🌐"
          value={policies.fdiPolicy}
          onChange={(v) => handleChange('fdiPolicy', v)}
          disabled={disabled}
        />
        <Slider
          label="Bảo vệ môi trường"
          icon="🌿"
          value={policies.envProtection}
          onChange={(v) => handleChange('envProtection', v)}
          disabled={disabled}
        />
      </div>

      <Button
        onClick={onConfirm}
        disabled={disabled}
        className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-xl shadow-md shadow-red-600/20"
      >
        {disabled ? '⏳ Đang xử lý lượt...' : '🚀 Xác Nhận Chính Sách'}
      </Button>
    </motion.div>
  );
}
