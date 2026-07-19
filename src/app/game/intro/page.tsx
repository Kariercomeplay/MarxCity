'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '@/components/ui/Button';
import { STAT_LABELS, STAT_COLORS } from '@/lib/engine/constants';

export default function IntroPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);

  const handleStart = () => {
    const gameId = localStorage.getItem('marxcity_gameId');
    if (gameId) router.push('/game');
    else router.push('/');
  };

  const steps = [
    {
      id: 'mission',
      stepLabel: 'Sứ mệnh',
      icon: '🏛️',
      badge: 'GIAO DIỆN ĐIỀU HÀNH KINH TẾ',
      title: 'Chào mừng Nhà Điều Hành Kinh Tế MarxCity!',
      content: (
        <div className="space-y-5">
          <p className="text-zinc-300 leading-relaxed text-sm sm:text-base">
            Bạn vừa được bổ nhiệm vào vị trí <strong className="text-white font-bold underline decoration-red-500/50 decoration-2 underline-offset-4">Người điều hành nền kinh tế</strong>.
            Trong hành trình 10 lượt chơi (tương ứng 5 chương phát triển chiến lược), mọi quyết định của bạn sẽ tạo nên diện mạo tương lai cho thành phố.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="bg-gradient-to-br from-red-950/40 to-orange-950/30 p-4 rounded-xl border border-red-800/50 space-y-2">
              <div className="text-2xl">⚙️</div>
              <h4 className="font-bold text-white text-sm">Chính Sách</h4>
              <p className="text-xs text-zinc-400 leading-normal">
                Tùy chỉnh thuế, lương tối thiểu, đầu tư công & bảo vệ môi trường.
              </p>
            </div>

            <div className="bg-gradient-to-br from-purple-950/40 to-pink-950/30 p-4 rounded-xl border border-purple-800/50 space-y-2">
              <div className="text-2xl">🚨</div>
              <h4 className="font-bold text-white text-sm">Tình Huống</h4>
              <p className="text-xs text-zinc-400 leading-normal">
                Ứng phó biến động giá cả, lạm phát, việc làm & khủng hoảng.
              </p>
            </div>

            <div className="bg-gradient-to-br from-blue-950/40 to-cyan-950/30 p-4 rounded-xl border border-blue-800/50 space-y-2">
              <div className="text-2xl">⚖️</div>
              <h4 className="font-bold text-white text-sm">Cân Bằng</h4>
              <p className="text-xs text-zinc-400 leading-normal">
                Hài hòa lợi ích giữa Người lao động, Doanh nghiệp & Nhà nước.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 flex items-start gap-3">
            <span className="text-xl flex-shrink-0 mt-0.5">💡</span>
            <p className="text-xs sm:text-sm text-red-300 font-medium leading-relaxed">
              <strong>Bản chất của Kinh tế chính trị:</strong> Không có chính sách nào đúng tuyệt đối hay sai tuyệt đối — mỗi quyết định đều mang lại <em>sự đánh đổi (Trade-off)</em> giữa các mục tiêu kinh tế & xã hội.
            </p>
          </div>
        </div>
      ),
    },
    {
      id: 'stats',
      stepLabel: 'Chỉ số',
      icon: '📊',
      badge: 'THƯỚC ĐO SỨC KHỎE NỀN KINH TẾ',
      title: '7 Trụ Cột Duy Trì Sự Thịnh Vượng',
      content: (
        <div className="space-y-4">
          <p className="text-sm text-zinc-300">
            Nền kinh tế được phản ánh qua <strong>7 chỉ số sống còn</strong> (thang 0-100). Đừng để bất kỳ chỉ số nào chạm mốc nguy hiểm!
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {[
              { key: 'production', icon: '🏭', sub: 'Công nghiệp, năng suất, cơ sở hạ tầng' },
              { key: 'employment', icon: '💼', sub: 'Số lượng và chất lượng việc làm' },
              { key: 'socialWelfare', icon: '🤝', sub: 'Thu nhập, giáo dục, an sinh phúc lợi' },
              { key: 'marketStability', icon: '📈', sub: 'Ổn định giá cả, lạm phát & niềm tin' },
              { key: 'nationalCapacity', icon: '🛡️', sub: 'Công nghệ & sức mạnh doanh nghiệp nội' },
              { key: 'environment', icon: '🌿', sub: 'Phát triển xanh & hệ sinh thái bền vững' },
              { key: 'budget', icon: '🏛️', sub: 'Nguồn lực thực thi chính sách quốc gia' },
            ].map(item => (
              <div
                key={item.key}
                className="flex items-start gap-3 p-3 rounded-xl bg-zinc-800/60 border border-zinc-700/60 transition-all hover:border-red-500/40 hover:bg-zinc-800"
              >
                <div
                  className="w-9 h-9 rounded-lg flex items-center justify-center text-lg font-bold flex-shrink-0 shadow-sm"
                  style={{ backgroundColor: `${STAT_COLORS[item.key]}25`, color: STAT_COLORS[item.key] }}
                >
                  {item.icon}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-zinc-100">{STAT_LABELS[item.key]}</span>
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: STAT_COLORS[item.key] }} />
                  </div>
                  <p className="text-xs text-zinc-400 leading-tight mt-0.5">{item.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ),
    },
    {
      id: 'chapters',
      stepLabel: '5 Chương',
      icon: '🧭',
      badge: 'HÀNH TRÌNH 10 LƯỢT CHƠI',
      title: '5 Chặng Đường Phát Triển Chiến Lược',
      content: (
        <div className="space-y-3">
          <p className="text-sm text-zinc-300">
            Nội dung Kinh tế chính trị được lồng ghép tự nhiên qua 5 chương thử thách:
          </p>

          <div className="space-y-2.5">
            {[
              { id: 1, title: 'Hàng hóa, Thị trường & Lao động', desc: 'Vận dụng Quy luật giá trị, nâng cao năng suất & giá trị thặng dư', turns: 'Năm 1 - 2', icon: '📦', color: 'from-blue-950/40 to-indigo-950/20 border-blue-800/40' },
              { id: 2, title: 'Cạnh tranh & Độc quyền', desc: 'Kiểm soát độc quyền, thúc đẩy cạnh tranh lành mạnh & đổi mới sáng tạo', turns: 'Năm 3 - 4', icon: '⚔️', color: 'from-purple-950/40 to-pink-950/20 border-purple-800/40' },
              { id: 3, title: 'Quan hệ Lợi ích Kinh tế', desc: 'Giải quyết xung đột và xây dựng cơ chế chia sẻ lợi ích công bằng', turns: 'Năm 5 - 6', icon: '⚖️', color: 'from-amber-950/40 to-orange-950/20 border-amber-800/40' },
              { id: 4, title: 'Công nghiệp hóa & Hiện đại hóa', desc: 'Bứt phá công nghệ, tự động hóa & chuyển dịch cơ cấu kinh tế', turns: 'Năm 7 - 8', icon: '🏗️', color: 'from-emerald-950/40 to-teal-950/20 border-emerald-800/40' },
              { id: 5, title: 'Hội nhập & Phát triển bền vững', desc: 'Mở cửa kinh tế toàn cầu, bảo đảm tự chủ & tăng trưởng xanh', turns: 'Năm 9 - 10', icon: '🌐', color: 'from-red-950/40 to-rose-950/20 border-red-800/40' },
            ].map(ch => (
              <div
                key={ch.id}
                className={`p-3.5 rounded-xl bg-gradient-to-r ${ch.color} border flex items-center gap-3.5 transition-all hover:scale-[1.01]`}
              >
                <div className="w-10 h-10 rounded-xl bg-zinc-800 shadow-sm flex items-center justify-center text-xl flex-shrink-0 border border-zinc-700">
                  {ch.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="px-2 py-0.5 text-[11px] font-bold rounded-md bg-red-600 text-white">
                      Chương {ch.id}
                    </span>
                    <span className="text-xs font-semibold text-zinc-400">{ch.turns}</span>
                  </div>
                  <h4 className="text-sm font-bold text-white truncate">{ch.title}</h4>
                  <p className="text-xs text-zinc-400 truncate mt-0.5">{ch.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ),
    },
    {
      id: 'stakeholders',
      stepLabel: 'Lợi ích',
      icon: '⚖️',
      badge: 'CÁN CÂN XÃ HỘI',
      title: 'Hài Hòa Lợi Ích 3 Nhóm Lực Lượng',
      content: (
        <div className="space-y-4">
          <p className="text-sm text-zinc-300">
            Quản trị thành công đòi hỏi bạn phải giữ vững niềm tin của <strong>cả 3 nhóm lực lượng</strong>:
          </p>

          <div className="space-y-3">
            <div className="p-4 rounded-xl bg-gradient-to-r from-blue-950/50 to-indigo-950/30 border border-blue-800/50 flex items-start gap-3.5">
              <span className="text-2xl p-2 bg-blue-900/50 rounded-xl flex-shrink-0">👷</span>
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-blue-200">Người Lao Động (Lực Lượng Sản Xuất)</h4>
                <p className="text-xs text-zinc-300 leading-relaxed">
                  Kỳ vọng việc làm ổn định, tiền lương thỏa đáng, điều kiện làm việc an toàn và phúc lợi xã hội phát triển.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-gradient-to-r from-amber-950/50 to-yellow-950/30 border border-amber-800/50 flex items-start gap-3.5">
              <span className="text-2xl p-2 bg-amber-900/50 rounded-xl flex-shrink-0">🏢</span>
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-amber-200">Doanh Nghiệp (Động Lực Tăng Trưởng)</h4>
                <p className="text-xs text-zinc-300 leading-relaxed">
                  Kỳ vọng môi trường kinh doanh minh bạch, chi phí thuế hợp lý, hạ tầng hiện đại và bảo hộ đầu tư.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-gradient-to-r from-red-950/50 to-rose-950/30 border border-red-800/50 flex items-start gap-3.5">
              <span className="text-2xl p-2 bg-red-900/50 rounded-xl flex-shrink-0">🏛️</span>
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-red-200">Nhà Nước & Xã Hội (Định Hướng & Điều Tiết)</h4>
                <p className="text-xs text-zinc-300 leading-relaxed">
                  Kỳ vọng ngân sách vững mạnh, thị trường ổn định, phát triển bền vững và công bằng xã hội.
                </p>
              </div>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-zinc-800 text-center border border-zinc-700 shadow-md">
            <p className="text-xs font-semibold text-red-400 uppercase tracking-wider mb-1">Mục tiêu tối thượng</p>
            <p className="text-xs sm:text-sm text-zinc-200 font-medium">
              "Kinh tế tăng trưởng — Xã hội công bằng — Người dân hạnh phúc"
            </p>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Dynamic Background Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-red-600/15 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[400px] h-[400px] bg-purple-600/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-2xl w-full relative z-10 space-y-6">
        {/* Header Branding */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-bold tracking-widest uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
            MARXCITY SIMULATION
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            Hướng Dẫn Điều Hành Nền Kinh Tế
          </h1>
        </div>

        {/* Progress Navigation Tabs */}
        <div className="grid grid-cols-4 gap-2 bg-zinc-900/90 p-1.5 rounded-2xl border border-zinc-800 backdrop-blur-md">
          {steps.map((s, idx) => {
            const isActive = idx === step;
            const isDone = idx < step;
            return (
              <button
                key={s.id}
                onClick={() => setStep(idx)}
                className={`py-2.5 px-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-300 flex flex-col sm:flex-row items-center justify-center gap-1.5 ${
                  isActive
                    ? 'bg-red-600 text-white shadow-lg shadow-red-600/30 font-bold scale-[1.02]'
                    : isDone
                    ? 'bg-zinc-800/80 text-zinc-300 hover:bg-zinc-800'
                    : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/40'
                }`}
              >
                <span className="text-base">{s.icon}</span>
                <span className="truncate">{s.stepLabel}</span>
              </button>
            );
          })}
        </div>

        {/* Main Content Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25 }}
            className="bg-zinc-900/90 border border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl space-y-6"
          >
            {/* Card Sub-header */}
            <div className="flex items-center justify-between border-b border-zinc-800/80 pb-4">
              <div>
                <span className="text-xs font-bold text-red-400 uppercase tracking-wider">
                  {steps[step].badge}
                </span>
                <h2 className="text-lg sm:text-xl font-bold text-white mt-0.5">
                  {steps[step].title}
                </h2>
              </div>
              <span className="text-xs text-zinc-400 font-semibold px-2.5 py-1 rounded-lg bg-zinc-800 border border-zinc-700/50">
                {step + 1} / {steps.length}
              </span>
            </div>

            {/* Step Body */}
            {steps[step].content}

            {/* Footer Buttons */}
            <div className="flex items-center justify-between pt-4 border-t border-zinc-800/80">
              <Button
                variant="ghost"
                onClick={() => (step > 0 ? setStep(s => s - 1) : router.push('/'))}
                className="text-zinc-400 hover:text-white hover:bg-zinc-800"
              >
                {step === 0 ? '← Quay về Trang Chủ' : '← Quay Lại'}
              </Button>

              {step < steps.length - 1 ? (
                <Button
                  onClick={() => setStep(s => s + 1)}
                  className="bg-red-600 hover:bg-red-700 text-white px-6 py-2.5 rounded-xl shadow-lg shadow-red-600/25 font-bold"
                >
                  Tiếp Theo →
                </Button>
              ) : (
                <Button
                  onClick={handleStart}
                  className="bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white px-7 py-3 rounded-xl shadow-xl shadow-red-600/30 font-bold text-sm sm:text-base"
                >
                  🚀 Bắt Đầu Điều Hành MarxCity
                </Button>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
