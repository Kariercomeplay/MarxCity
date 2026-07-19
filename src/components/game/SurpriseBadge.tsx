'use client';

interface SurpriseBadgeProps {
  type: string;
}

const icons: Record<string, string> = {
  surp_phat_hien_mo_dau: '🛢️',
  surp_sot_dat: '🏠',
  surp_bong_da_vo_dich: '🏆',
  surp_meme_bo_truong: '😂',
  surp_ca_can_cap: '🐟',
  surp_ai_bao_cao: '🤖',
};

const labels: Record<string, string> = {
  surp_phat_hien_mo_dau: 'SỰ KIỆN BẤT NGỜ',
  surp_sot_dat: 'SỰ KIỆN BẤT NGỜ',
  surp_bong_da_vo_dich: 'TIN VUI BẤT NGỜ',
  surp_ca_can_cap: 'TÌNH HUỐNG DỞ KHÓC DỞ CƯỜI',
  surp_meme_bo_truong: 'LAN TRUYỀN MẠNG XÃ HỘI',
  surp_ai_bao_cao: 'BẤT NGỜ CÔNG NGHỆ',
};

export default function SurpriseBadge({ type }: SurpriseBadgeProps) {
  const icon = icons[type] || '🎉';
  const label = labels[type] || 'BẤT NGỜ';
  return (
    <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full text-sm font-bold shadow-lg animate-pulse">
      <span className="text-lg">{icon}</span>
      <span>{label}</span>
    </div>
  );
}
