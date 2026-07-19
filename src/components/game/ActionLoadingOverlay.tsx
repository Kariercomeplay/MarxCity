'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

interface ActionLoadingOverlayProps {
  isLoading: boolean;
  message?: string;
}

const MESSAGES = [
  '⚙️ Đang tính toán tác động chính sách vĩ mô...',
  '🔨 Đang điều phối nguồn lực & cơ sở hạ tầng...',
  '🚚 Đang lưu thông hàng hóa & cân bằng cung - cầu...',
  '🤝 Đang đánh giá phản ứng người lao động & doanh nghiệp...',
  '🏛️ Cố vấn lý luận đang tổng hợp kiến thức KTCT Mác-Lênin...',
];

export default function ActionLoadingOverlay({ isLoading, message }: ActionLoadingOverlayProps) {
  const [msgIdx, setMsgIdx] = useState(0);

  useEffect(() => {
    if (!isLoading) return;
    const interval = setInterval(() => {
      setMsgIdx((prev) => (prev + 1) % MESSAGES.length);
    }, 1800);
    return () => clearInterval(interval);
  }, [isLoading]);

  if (!isLoading) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 backdrop-blur-md p-4"
      >
        <div className="bg-white dark:bg-zinc-800 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-slate-200 dark:border-zinc-700 text-center space-y-6 relative overflow-hidden">
          
          {/* Top Decorative Ambient Light */}
          <div className="absolute -top-12 -left-12 w-32 h-32 bg-red-500/20 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -bottom-12 -right-12 w-32 h-32 bg-emerald-500/20 rounded-full blur-2xl pointer-events-none" />

          {/* Action Scene: Hammer + Truck + Gears Animations */}
          <div className="relative h-28 bg-slate-900 rounded-2xl p-3 overflow-hidden flex items-center justify-center border border-slate-700/60 shadow-inner">
            
            {/* Background Road Line for Truck */}
            <div className="absolute bottom-3 left-0 right-0 h-1 bg-slate-700/80 border-t border-dashed border-slate-500/50" />

            {/* Truck Moving Animation */}
            <motion.div
              animate={{ x: [-120, 160] }}
              transition={{ repeat: Infinity, duration: 2.8, ease: 'linear' }}
              className="absolute bottom-2 text-2xl z-10 flex items-center"
            >
              🚛
              <motion.span
                animate={{ opacity: [0.3, 0.8, 0.3] }}
                transition={{ repeat: Infinity, duration: 0.4 }}
                className="text-xs -ml-1"
              >
                💨
              </motion.span>
            </motion.div>

            {/* Hammer Pounding Animation (Left side) */}
            <div className="absolute top-2 left-6 flex flex-col items-center">
              <motion.div
                animate={{ rotate: [0, -45, 15, -5, 0], y: [0, -4, 4, 0] }}
                transition={{ repeat: Infinity, duration: 1.2, ease: 'easeInOut' }}
                className="text-3xl origin-bottom-right"
              >
                🔨
              </motion.div>
              <motion.div
                animate={{ scale: [1, 1.3, 0.9, 1] }}
                transition={{ repeat: Infinity, duration: 1.2 }}
                className="text-xs font-bold text-amber-400 mt-1"
              >
                🏗️
              </motion.div>
            </div>

            {/* Synchronized Spinning Gears (Right side) */}
            <div className="absolute top-3 right-6 flex items-center gap-1">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 3, ease: 'linear' }}
                className="text-2xl text-red-500"
              >
                ⚙️
              </motion.div>
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ repeat: Infinity, duration: 2.2, ease: 'linear' }}
                className="text-lg text-emerald-400 -ml-2 -mt-2"
              >
                ⚙️
              </motion.div>
            </div>

            {/* Center Money/Pulse Sparkle */}
            <motion.div
              animate={{ scale: [0.8, 1.2, 0.8], y: [0, -6, 0] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="text-2xl z-20"
            >
              📈
            </motion.div>
          </div>

          {/* Dynamic Message Display */}
          <div className="space-y-2">
            <h3 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white flex items-center justify-center gap-2">
              <span className="inline-block w-2.5 h-2.5 rounded-full bg-red-600 animate-ping" />
              Đang Xử Lý Quyết Định
            </h3>
            
            <AnimatePresence mode="wait">
              <motion.p
                key={msgIdx}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25 }}
                className="text-xs sm:text-sm font-medium text-slate-600 dark:text-zinc-300 min-h-[40px] flex items-center justify-center px-2"
              >
                {message || MESSAGES[msgIdx]}
              </motion.p>
            </AnimatePresence>
          </div>

          {/* Progress Bar Animation */}
          <div className="w-full bg-slate-100 dark:bg-zinc-700/60 rounded-full h-2 overflow-hidden relative">
            <motion.div
              animate={{ x: ['-100%', '100%'] }}
              transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
              className="w-1/2 h-full bg-gradient-to-r from-red-600 via-amber-500 to-emerald-500 rounded-full"
            />
          </div>

          <p className="text-[11px] text-slate-400 dark:text-zinc-500">
            Hệ thống đang mô phỏng phản ứng toàn diện của nền kinh tế...
          </p>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
