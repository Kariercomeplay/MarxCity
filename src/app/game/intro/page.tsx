'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '@/components/ui/Button';
import { STAT_LABELS, STAT_DESCRIPTIONS, STAT_COLORS, CHAPTERS } from '@/lib/engine/constants';

export default function IntroPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);

  const steps = [
    {
      title: 'Nhiệm vụ của bạn',
      content: (
        <div className="space-y-4">
          <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
            Bạn được bổ nhiệm làm <strong className="text-zinc-900 dark:text-white">Người điều hành nền kinh tế</strong>.
            Trong 10 lượt (5 chương), bạn sẽ đưa ra các quyết định về chính sách kinh tế,
            ứng phó với tình huống và cân bằng lợi ích giữa các nhóm trong xã hội.
          </p>
          <div className="bg-red-50 dark:bg-red-900/20 rounded-xl p-4 border border-red-200 dark:border-red-800">
            <p className="text-sm text-red-700 dark:text-red-400 font-medium">
              Mỗi quyết định của bạn đều có sự đánh đổi. Không có lựa chọn nào hoàn toàn đúng hay sai —
              chỉ có những hệ quả kinh tế - xã hội khác nhau.
            </p>
          </div>
        </div>
      ),
    },
    {
      title: '7 Chỉ số kinh tế',
      content: (
        <div className="space-y-3">
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-3">
            Nền kinh tế được đo bằng 7 chỉ số (thang 0-100). Nhiệm vụ của bạn là giữ cân bằng.
          </p>
          {(Object.keys(STAT_LABELS) as Array<keyof typeof STAT_LABELS>).map(key => (
            <div key={key} className="flex items-start gap-3 p-2 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-800/50">
              <div className="w-2.5 h-2.5 rounded-full mt-1.5 flex-shrink-0" style={{ backgroundColor: STAT_COLORS[key] }} />
              <div>
                <span className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">{STAT_LABELS[key]}</span>
                <span className="text-xs text-zinc-400 ml-2">{STAT_DESCRIPTIONS[key]}</span>
              </div>
            </div>
          ))}
        </div>
      ),
    },
    {
      title: '5 Chương học tập',
      content: (
        <div className="space-y-3">
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-3">
            Mỗi chương gắn với một nội dung của Kinh tế chính trị Mác-Lênin:
          </p>
          {CHAPTERS.map(ch => (
            <div key={ch.id} className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-800">
              <div className="flex items-center gap-2 mb-1">
                <span className="px-1.5 py-0.5 text-xs rounded bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 font-bold">
                  {ch.id}
                </span>
                <span className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">{ch.name}</span>
              </div>
              <div className="flex gap-1.5">
                {ch.cloTags.map(clo => (
                  <span key={clo} className="text-xs px-1.5 py-0.5 rounded-full bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400">
                    {clo}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      ),
    },
    {
      title: 'Ba nhóm lợi ích',
      content: (
        <div className="space-y-4">
          <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
            Mọi quyết định đều ảnh hưởng đến <strong className="text-zinc-900 dark:text-white">ba nhóm lợi ích</strong>:
          </p>
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 rounded-xl bg-blue-50 dark:bg-blue-900/20">
              <span className="text-lg">👷</span>
              <div>
                <span className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">Người lao động</span>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">Việc làm, tiền lương, phúc lợi xã hội</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-xl bg-yellow-50 dark:bg-yellow-900/20">
              <span className="text-lg">🏢</span>
              <div>
                <span className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">Doanh nghiệp</span>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">Lợi nhuận, đầu tư, môi trường cạnh tranh</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-xl bg-red-50 dark:bg-red-900/20">
              <span className="text-lg">🏛</span>
              <div>
                <span className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">Nhà nước & Xã hội</span>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">Ngân sách, ổn định, phát triển bền vững</p>
              </div>
            </div>
          </div>
          <div className="bg-zinc-100 dark:bg-zinc-800 rounded-xl p-3 mt-2">
            <p className="text-xs text-zinc-500 dark:text-zinc-400 italic">
              Mục tiêu: cân bằng hài hòa lợi ích giữa ba nhóm.
            </p>
          </div>
        </div>
      ),
    },
  ];

  const handleStart = () => {
    const gameId = localStorage.getItem('marxcity_gameId');
    if (gameId) router.push('/game');
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900 flex items-center justify-center p-4">
      <div className="max-w-lg w-full">
        <div className="mb-6 text-center">
          <span className="text-lg font-black text-red-600">MARXCITY</span>
          <div className="flex justify-center gap-1.5 mt-3">
            {steps.map((_, i) => (
              <button
                key={i}
                onClick={() => setStep(i)}
                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                  i === step ? 'bg-red-600 w-6' : 'bg-zinc-300 dark:bg-zinc-600'
                }`}
              />
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.25 }}
            className="bg-white dark:bg-zinc-800 rounded-2xl shadow-sm border border-zinc-200 dark:border-zinc-700 p-6"
          >
            <h2 className="text-xl font-bold text-zinc-900 dark:text-white mb-4">{steps[step].title}</h2>
            {steps[step].content}
          </motion.div>
        </AnimatePresence>

        <div className="flex justify-between mt-4">
          <Button
            variant="ghost"
            onClick={() => step > 0 ? setStep(s => s - 1) : router.push('/')}
          >
            {step === 0 ? 'Quay lại' : 'Trước'}
          </Button>
          {step < steps.length - 1 ? (
            <Button onClick={() => setStep(s => s + 1)}>Tiếp theo</Button>
          ) : (
            <Button onClick={handleStart}>Bắt đầu điều hành</Button>
          )}
        </div>
      </div>
    </div>
  );
}
