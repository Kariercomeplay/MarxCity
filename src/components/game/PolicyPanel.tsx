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
      className="space-y-5"
    >
      <div>
        <h3 className="text-base font-bold text-zinc-900 dark:text-white">Điều chỉnh chính sách</h3>
        <p className="text-xs text-zinc-500 dark:text-zinc-400">Tùy chỉnh các chính sách trước khi kết thúc lượt</p>
      </div>

      <div className="space-y-4">
        <Slider
          label="Thuế thu nhập doanh nghiệp"
          value={policies.taxRate}
          onChange={(v) => handleChange('taxRate', v)}
          disabled={disabled}
        />
        <Slider
          label="Lương tối thiểu"
          value={policies.minWage}
          onChange={(v) => handleChange('minWage', v)}
          disabled={disabled}
        />
        <Slider
          label="Đầu tư giáo dục"
          value={policies.eduInvestment}
          onChange={(v) => handleChange('eduInvestment', v)}
          disabled={disabled}
        />
        <Slider
          label="Đầu tư hạ tầng"
          value={policies.infraInvestment}
          onChange={(v) => handleChange('infraInvestment', v)}
          disabled={disabled}
        />
        <Slider
          label="Thu hút FDI"
          value={policies.fdiPolicy}
          onChange={(v) => handleChange('fdiPolicy', v)}
          disabled={disabled}
        />
        <Slider
          label="Bảo vệ môi trường"
          value={policies.envProtection}
          onChange={(v) => handleChange('envProtection', v)}
          disabled={disabled}
        />
      </div>

      <Button onClick={onConfirm} disabled={disabled} className="w-full">
        {disabled ? 'Đang xử lý...' : 'Xác nhận chính sách'}
      </Button>
    </motion.div>
  );
}
