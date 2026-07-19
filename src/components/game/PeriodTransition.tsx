'use client';

import { motion } from 'framer-motion';
import Button from '@/components/ui/Button';

interface PeriodTransitionProps {
  year: number;
  onContinue: () => void;
}

const PERIOD_TEXTS: Record<number, { icon: string; title: string; subtitle: string }> = {
  1: { icon: '🌱', title: 'Năm thứ nhất', subtitle: 'Nền kinh tế bắt đầu vận hành dưới sự điều hành mới. Những quyết định đầu tiên sẽ định hình cả nhiệm kỳ.' },
  3: { icon: '⚡', title: 'Năm thứ ba — Bước ngoặt', subtitle: 'Những chính sách ban đầu bắt đầu cho thấy tác động. Cạnh tranh và độc quyền dần lộ diện.' },
  5: { icon: '⚖️', title: 'Năm thứ năm — Tái cân bằng', subtitle: 'Các quan hệ lợi ích trở nên phức tạp. Sự hài hòa giữa các nhóm là chìa khóa.' },
  7: { icon: '🏗️', title: 'Năm thứ bảy — Công nghiệp hóa', subtitle: 'Cơ hội hiện đại hóa nền kinh tế. Công nghệ và tự động hóa thay đổi cục diện.' },
  9: { icon: '🌐', title: 'Năm thứ chín — Hội nhập sâu rộng', subtitle: 'Cánh cửa thế giới mở rộng. Hội nhập và tự chủ là bài toán cần cân nhắc.' },
};

export default function PeriodTransition({ year, onContinue }: PeriodTransitionProps) {
  const period = PERIOD_TEXTS[year] || {
    icon: '📅',
    title: `Năm thứ ${year}`,
    subtitle: 'Một giai đoạn mới của nền kinh tế bắt đầu.',
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: 'spring', damping: 20, stiffness: 200, delay: 0.2 }}
        className="bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl max-w-lg w-full p-8 text-center space-y-5"
      >
        <motion.span
          initial={{ rotate: -15, scale: 0 }}
          animate={{ rotate: 0, scale: 1 }}
          transition={{ type: 'spring', damping: 10, stiffness: 100, delay: 0.3 }}
          className="text-6xl block"
        >
          {period.icon}
        </motion.span>

        <div className="space-y-2">
          <h2 className="text-2xl font-black text-zinc-900 dark:text-white">
            {period.title}
          </h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
            {period.subtitle}
          </p>
        </div>

        <div className="pt-2">
          <Button size="lg" onClick={onContinue}>
            Tiếp tục điều hành
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
}
