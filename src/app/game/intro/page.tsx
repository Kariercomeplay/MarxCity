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
          <p className="text-slate-200 leading-relaxed text-sm sm:text-base">
            Bạn vừa được bổ nhiệm vào vị trí <strong className="text-white font-bold underline decoration-red-500 decoration-2 underline-offset-4">Người điều hành nền kinh tế</strong>.
            Mỗi quyết định kinh tế bạn đưa ra sẽ định hình tương lai của đất nước qua nhiều giai đoạn phát triển khác nhau.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
            {/* Card 1: Policy with Gear animation */}
            <motion.div
              whileHover={{ y: -3, scale: 1.02 }}
              className="bg-gradient-to-br from-red-900/60 via-red-950/40 to-slate-900 p-4 rounded-2xl border border-red-500/40 shadow-lg space-y-2.5 relative overflow-hidden"
            >
              <div className="flex items-center justify-between">
                <motion.span
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 8, ease: 'linear' }}
                  className="text-3xl inline-block"
                >
                  ⚙️
                </motion.span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-500/20 text-red-300 border border-red-500/30">QUẢN TRỊ</span>
              </div>
              <h4 className="font-bold text-white text-sm">Chính Sách Vĩ Mô</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Tùy chỉnh thuế doanh nghiệp, lương tối thiểu, đầu tư công & bảo vệ môi trường.
              </p>
            </motion.div>

            {/* Card 2: Situations with Hammer animation */}
            <motion.div
              whileHover={{ y: -3, scale: 1.02 }}
              className="bg-gradient-to-br from-purple-900/60 via-purple-950/40 to-slate-900 p-4 rounded-2xl border border-purple-500/40 shadow-lg space-y-2.5 relative overflow-hidden"
            >
              <div className="flex items-center justify-between">
                <motion.span
                  animate={{ rotate: [0, -30, 15, 0], y: [0, -3, 2, 0] }}
                  transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
                  className="text-3xl inline-block origin-bottom-right"
                >
                  🔨
                </motion.span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">THỬ THÁCH</span>
              </div>
              <h4 className="font-bold text-white text-sm">Tình Huống Cốt Truyện</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Ứng phó biến động giá cả, tích trữ đầu cơ, công nghiệp hóa & khủng hoảng.
              </p>
            </motion.div>

            {/* Card 3: Stakeholders with Truck animation */}
            <motion.div
              whileHover={{ y: -3, scale: 1.02 }}
              className="bg-gradient-to-br from-emerald-900/60 via-emerald-950/40 to-slate-900 p-4 rounded-2xl border border-emerald-500/40 shadow-lg space-y-2.5 relative overflow-hidden"
            >
              <div className="flex items-center justify-between">
                <motion.span
                  animate={{ x: [-5, 8, -5] }}
                  transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
                  className="text-3xl inline-block"
                >
                  🚚
                </motion.span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">LỢI ÍCH</span>
              </div>
              <h4 className="font-bold text-white text-sm">Cán Cân Xã Hội</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Hài hòa lợi ích giữa Người lao động, Doanh nghiệp & Bộ máy Nhà nước.
              </p>
            </motion.div>
          </div>

          <div className="p-4 rounded-2xl bg-gradient-to-r from-red-950/60 via-amber-950/40 to-slate-900 border border-red-500/40 flex items-start gap-3.5 shadow-md">
            <span className="text-2xl flex-shrink-0 mt-0.5">💡</span>
            <p className="text-xs sm:text-sm text-red-200 font-medium leading-relaxed">
              <strong className="text-white">Bản chất Kinh tế chính trị:</strong> Không có chính sách nào đúng tuyệt đối hay sai tuyệt đối — mỗi quyết định đều mang lại <em className="text-amber-300">sự đánh đổi (Trade-off)</em> giữa các mục tiêu kinh tế & xã hội.
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
          <p className="text-sm text-slate-200">
            Nền kinh tế được phản ánh qua <strong className="text-white">7 chỉ số sống còn</strong> (thang 0-100). Đừng để bất kỳ chỉ số nào rơi vào mốc báo động!
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { key: 'production', icon: '🏭', sub: 'Công nghiệp, năng suất, cơ sở hạ tầng' },
              { key: 'employment', icon: '💼', sub: 'Số lượng và chất lượng việc làm' },
              { key: 'socialWelfare', icon: '🤝', sub: 'Thu nhập, giáo dục, an sinh phúc lợi' },
              { key: 'marketStability', icon: '📈', sub: 'Ổn định giá cả, lạm phát & niềm tin' },
              { key: 'nationalCapacity', icon: '🛡️', sub: 'Công nghệ & sức mạnh doanh nghiệp nội' },
              { key: 'environment', icon: '🌿', sub: 'Phát triển xanh & hệ sinh thái bền vững' },
              { key: 'budget', icon: '🏛️', sub: 'Nguồn lực thực thi chính sách quốc gia' },
            ].map(item => (
              <motion.div
                key={item.key}
                whileHover={{ scale: 1.02 }}
                className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700/80 transition-all hover:border-red-500/50 hover:bg-slate-800 shadow-sm"
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-xl font-bold flex-shrink-0 shadow-sm"
                  style={{ backgroundColor: `${STAT_COLORS[item.key]}30`, color: STAT_COLORS[item.key] }}
                >
                  {item.icon}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-white">{STAT_LABELS[item.key]}</span>
                    <span className="w-2.5 h-2.5 rounded-full animate-pulse" style={{ backgroundColor: STAT_COLORS[item.key] }} />
                  </div>
                  <p className="text-xs text-slate-300 leading-tight mt-1">{item.sub}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      ),
    },
    {
      id: 'chapters',
      stepLabel: '5 Giai đoạn',
      icon: '🧭',
      badge: 'HÀNH TRÌNH 10 LƯỢT CHƠI',
      title: '5 Chặng Đường Phát Triển Chiến Lược',
      content: (
        <div className="space-y-4">
          <p className="text-sm text-slate-200">
            Kiến thức Kinh tế chính trị được trải nghiệm qua 5 giai đoạn phát triển:
          </p>

          <div className="space-y-3 relative">
            {/* Animated Transport Vehicle Timeline */}
            {[
              { id: 1, title: 'Hàng hóa, Thị trường & Lao động', desc: 'Vận dụng Quy luật giá trị, nâng cao năng suất & giá trị thặng dư', turns: 'Lượt 1 - 2', icon: '📦', color: 'from-blue-900/60 to-indigo-950/40 border-blue-500/40' },
              { id: 2, title: 'Cạnh tranh & Độc quyền', desc: 'Kiểm soát độc quyền, thúc đẩy cạnh tranh lành mạnh & đổi mới sáng tạo', turns: 'Lượt 3 - 4', icon: '⚔️', color: 'from-purple-900/60 to-pink-950/40 border-purple-500/40' },
              { id: 3, title: 'Quan hệ Lợi ích Kinh tế', desc: 'Giải quyết xung đột và xây dựng cơ chế chia sẻ lợi ích công bằng', turns: 'Lượt 5 - 6', icon: '⚖️', color: 'from-amber-900/60 to-orange-950/40 border-amber-500/40' },
              { id: 4, title: 'Công nghiệp hóa & Hiện đại hóa', desc: 'Bứt phá công nghệ, tự động hóa & chuyển dịch cơ cấu kinh tế', turns: 'Lượt 7 - 8', icon: '🏗️', color: 'from-emerald-900/60 to-teal-950/40 border-emerald-500/40' },
              { id: 5, title: 'Hội nhập & Phát triển bền vững', desc: 'Mở cửa kinh tế toàn cầu, bảo đảm tự chủ & tăng trưởng xanh', turns: 'Lượt 9 - 10', icon: '🌐', color: 'from-red-900/60 to-rose-950/40 border-red-500/40' },
            ].map(ch => (
              <motion.div
                key={ch.id}
                whileHover={{ scale: 1.01, x: 4 }}
                className={`p-3.5 rounded-2xl bg-gradient-to-r ${ch.color} border flex items-center gap-3.5 shadow-md`}
              >
                <div className="w-10 h-10 rounded-xl bg-slate-900 shadow-sm flex items-center justify-center text-xl flex-shrink-0 border border-slate-700">
                  {ch.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="px-2 py-0.5 text-[11px] font-bold rounded-md bg-red-600 text-white shadow-xs">
                      {['Khởi đầu','Phát triển','Bản lề','Bứt phá','Vươn xa'][ch.id - 1] || `Giai đoạn ${ch.id}`}
                    </span>
                    <span className="text-xs font-semibold text-slate-300">{ch.turns}</span>
                  </div>
                  <h4 className="text-sm font-bold text-white truncate">{ch.title}</h4>
                  <p className="text-xs text-slate-300 truncate mt-0.5">{ch.desc}</p>
                </div>
              </motion.div>
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
          <p className="text-sm text-slate-200">
            Quản trị thành công đòi hỏi bạn phải giữ vững niềm tin của <strong className="text-white">cả 3 nhóm lực lượng</strong>:
          </p>

          <div className="space-y-3">
            <motion.div whileHover={{ scale: 1.01 }} className="p-4 rounded-2xl bg-gradient-to-r from-blue-950/80 via-blue-900/40 to-slate-900 border border-blue-500/40 flex items-start gap-3.5 shadow-md">
              <span className="text-2xl p-2 bg-blue-900/60 rounded-xl flex-shrink-0">👷</span>
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-blue-200">Người Lao Động (Lực Lượng Sản Xuất)</h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Kỳ vọng việc làm ổn định, tiền lương thỏa đáng, điều kiện làm việc an toàn và phúc lợi xã hội phát triển.
                </p>
              </div>
            </motion.div>

            <motion.div whileHover={{ scale: 1.01 }} className="p-4 rounded-2xl bg-gradient-to-r from-amber-950/80 via-amber-900/40 to-slate-900 border border-amber-500/40 flex items-start gap-3.5 shadow-md">
              <span className="text-2xl p-2 bg-amber-900/60 rounded-xl flex-shrink-0">🏢</span>
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-amber-200">Doanh Nghiệp (Động Lực Tăng Trưởng)</h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Kỳ vọng môi trường kinh doanh minh bạch, chi phí thuế hợp lý, hạ tầng hiện đại và bảo hộ đầu tư.
                </p>
              </div>
            </motion.div>

            <motion.div whileHover={{ scale: 1.01 }} className="p-4 rounded-2xl bg-gradient-to-r from-red-950/80 via-rose-900/40 to-slate-900 border border-red-500/40 flex items-start gap-3.5 shadow-md">
              <span className="text-2xl p-2 bg-red-900/60 rounded-xl flex-shrink-0">🏛️</span>
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-red-200">Nhà Nước & Xã Hội (Định Hướng & Điều Tiết)</h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Kỳ vọng ngân sách vững mạnh, thị trường ổn định, phát triển bền vững và công bằng xã hội.
                </p>
              </div>
            </motion.div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900 text-center border border-slate-700 shadow-lg relative overflow-hidden">
            <p className="text-xs font-bold text-red-400 uppercase tracking-wider mb-1">Mục tiêu tối thượng</p>
            <p className="text-sm text-white font-bold">
              "Kinh tế tăng trưởng — Xã hội công bằng — Người dân hạnh phúc"
            </p>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-zinc-900 to-slate-900 text-slate-100 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Energetic Background Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-red-600/20 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[500px] h-[500px] bg-emerald-600/15 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-10 left-10 w-[450px] h-[450px] bg-amber-500/15 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-2xl w-full relative z-10 space-y-6">
        {/* Header Branding */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-red-500/20 border border-red-500/40 text-red-300 text-xs font-bold tracking-widest uppercase shadow-md">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
            MARXCITY SIMULATION
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white drop-shadow-md">
            Hướng Dẫn Điều Hành Nền Kinh Tế
          </h1>
        </div>

        {/* Progress Navigation Tabs */}
        <div className="grid grid-cols-4 gap-2 bg-slate-900/90 p-2 rounded-2xl border border-slate-700/80 backdrop-blur-xl shadow-xl">
          {steps.map((s, idx) => {
            const isActive = idx === step;
            const isDone = idx < step;
            return (
              <button
                key={s.id}
                onClick={() => setStep(idx)}
                className={`py-2.5 px-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-300 flex flex-col sm:flex-row items-center justify-center gap-1.5 ${
                  isActive
                    ? 'bg-red-600 text-white shadow-lg shadow-red-600/40 font-bold scale-[1.03]'
                    : isDone
                    ? 'bg-slate-800 text-slate-200 hover:bg-slate-700'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
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
            className="bg-slate-900/95 border border-slate-700/80 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-2xl space-y-6"
          >
            {/* Card Sub-header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <span className="text-xs font-bold text-red-400 uppercase tracking-wider">
                  {steps[step].badge}
                </span>
                <h2 className="text-lg sm:text-xl font-bold text-white mt-0.5">
                  {steps[step].title}
                </h2>
              </div>
              <span className="text-xs text-slate-300 font-bold px-3 py-1 rounded-xl bg-slate-800 border border-slate-700 shadow-inner">
                {step + 1} / {steps.length}
              </span>
            </div>

            {/* Step Body */}
            {steps[step].content}

            {/* Footer Buttons */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-800">
              <Button
                variant="ghost"
                onClick={() => (step > 0 ? setStep(s => s - 1) : router.push('/'))}
                className="text-slate-300 hover:text-white hover:bg-slate-800"
              >
                {step === 0 ? '← Quay về Trang Chủ' : '← Quay Lại'}
              </Button>

              {step < steps.length - 1 ? (
                <Button
                  onClick={() => setStep(s => s + 1)}
                  className="bg-red-600 hover:bg-red-700 text-white px-6 py-2.5 rounded-xl shadow-lg shadow-red-600/30 font-bold"
                >
                  Tiếp Theo →
                </Button>
              ) : (
                <Button
                  onClick={handleStart}
                  className="bg-gradient-to-r from-red-600 via-rose-600 to-red-700 hover:from-red-500 hover:to-rose-500 text-white px-7 py-3 rounded-xl shadow-xl shadow-red-600/40 font-bold text-sm sm:text-base transform hover:scale-[1.02] transition-transform"
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
