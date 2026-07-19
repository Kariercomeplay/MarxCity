'use client';

import { motion } from 'framer-motion';
import Button from '@/components/ui/Button';

interface HeroSectionProps {
  onStart: () => void;
  hasSession: boolean;
  onContinue?: () => void;
}

export default function HeroSection({ onStart, hasSession, onContinue }: HeroSectionProps) {
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-950 via-zinc-900 to-slate-900 text-white">
      {/* Background Animated Lights */}
      <div className="absolute top-1/4 left-1/3 w-[500px] h-[500px] bg-red-600/20 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/3 w-[450px] h-[450px] bg-amber-500/15 rounded-full blur-[120px] pointer-events-none" />

      {/* Floating Animated Icons Scene */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Animated Hammer */}
        <motion.div
          animate={{ rotate: [0, -35, 10, 0], y: [0, -5, 2, 0] }}
          transition={{ repeat: Infinity, duration: 2.2, ease: 'easeInOut' }}
          className="absolute top-16 left-12 text-4xl opacity-40 hidden sm:block"
        >
          🔨
        </motion.div>

        {/* Animated Spinning Gear */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 10, ease: 'linear' }}
          className="absolute bottom-24 left-20 text-5xl opacity-30 hidden sm:block text-amber-500"
        >
          ⚙️
        </motion.div>

        {/* Animated Driving Truck */}
        <motion.div
          animate={{ x: [-100, 1200] }}
          transition={{ repeat: Infinity, duration: 12, ease: 'linear' }}
          className="absolute bottom-10 left-0 text-3xl opacity-35 hidden md:block"
        >
          🚛
        </motion.div>

        {/* Floating Money Chart */}
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
          className="absolute top-24 right-16 text-4xl opacity-40 hidden sm:block"
        >
          📈
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 text-center px-6 max-w-2xl"
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="mb-4"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-red-500/20 border border-red-500/40 text-red-300 text-xs font-bold tracking-widest uppercase mb-4 shadow-lg">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
            GAME MÔ PHỎNG KINH TẾ CHÍNH TRỊ
          </div>

          <h1 className="text-6xl sm:text-7xl font-black tracking-tight text-white drop-shadow-lg">
            MARX<span className="text-red-500">CITY</span>
          </h1>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="text-lg sm:text-xl text-slate-300 mb-8 font-medium leading-relaxed"
        >
          Xây dựng & Điều hành nền kinh tế thị trường định hướng xã hội chủ nghĩa
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Button
            size="lg"
            onClick={onStart}
            className="text-lg px-10 py-3.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-2xl shadow-xl shadow-red-600/30 transform hover:scale-[1.03] transition-all"
          >
            🚀 BẮT ĐẦU CHƠI
          </Button>
          {hasSession && onContinue && (
            <Button
              variant="secondary"
              size="lg"
              onClick={onContinue}
              className="text-lg px-8 py-3.5 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-2xl border border-slate-700 shadow-lg"
            >
              ⏩ Tiếp tục
            </Button>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.5 }}
          className="mt-12 grid grid-cols-3 gap-6 max-w-md mx-auto"
        >
          {[
            { label: 'Chương', value: '5' },
            { label: 'Tình huống', value: '50' },
            { label: 'CLO', value: '9' },
          ].map((item) => (
            <div key={item.label} className="text-center bg-slate-800/60 p-3 rounded-2xl border border-slate-700/60 shadow-md">
              <div className="text-2xl font-black text-white">{item.value}</div>
              <div className="text-xs text-slate-400 font-semibold mt-0.5">{item.label}</div>
            </div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.5 }}
          className="mt-6 flex justify-center gap-4 text-xs font-semibold"
        >
          <a href="/leaderboard" className="text-slate-400 hover:text-white transition-colors">
            🏆 Bảng xếp hạng
          </a>
          <span className="text-slate-600">·</span>
          <a href="/admin" className="text-slate-400 hover:text-white transition-colors">
            ⚙️ Quản trị Admin
          </a>
        </motion.div>
      </motion.div>
    </div>
  );
}
