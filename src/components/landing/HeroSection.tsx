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
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-zinc-900 via-zinc-800 to-zinc-900">
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-10 left-10 w-32 h-32 border-2 border-red-500/30 rounded-full" />
        <div className="absolute bottom-20 right-20 w-48 h-48 border-2 border-yellow-500/20 rounded-full" />
        <div className="absolute top-1/3 right-1/4 w-4 h-4 bg-red-500/40 rounded-full" />
        <div className="absolute bottom-1/3 left-1/4 w-6 h-6 bg-blue-500/30 rounded-full" />
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
          className="mb-6"
        >
          <h1 className="text-6xl sm:text-7xl font-black tracking-tight text-white">
            MARX<span className="text-red-500">CITY</span>
          </h1>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="text-xl text-zinc-300 mb-8 font-light"
        >
          Xây dựng nền kinh tế định hướng xã hội chủ nghĩa
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Button size="lg" onClick={onStart} className="text-lg px-10">
            BẮT ĐẦU
          </Button>
          {hasSession && onContinue && (
            <Button variant="secondary" size="lg" onClick={onContinue} className="text-lg">
              Tiếp tục
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
            { label: 'Tình huống', value: '18' },
            { label: 'CLO', value: '9' },
          ].map((item) => (
            <div key={item.label} className="text-center">
              <div className="text-2xl font-bold text-white">{item.value}</div>
              <div className="text-xs text-zinc-500 mt-1">{item.label}</div>
            </div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.5 }}
          className="mt-6 flex justify-center gap-4 text-xs"
        >
          <a href="/leaderboard" className="text-zinc-400 hover:text-white transition-colors">
            Bảng xếp hạng
          </a>
          <span className="text-zinc-600">·</span>
          <a href="/admin" className="text-zinc-400 hover:text-white transition-colors">
            Admin
          </a>
        </motion.div>
      </motion.div>
    </div>
  );
}
