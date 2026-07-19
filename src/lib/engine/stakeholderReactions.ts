export type Reaction = {
  icon: string;
  group: string;
  text: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  severity: number;
};

const templates: Record<string, { threshold: number; text: string; sentiment: 'positive' | 'negative' }[]> = {
  workers: [
    { threshold: 5, text: 'Người lao động hân hoan đón nhận chính sách mới', sentiment: 'positive' },
    { threshold: 2, text: 'Thu nhập và đời sống người lao động được cải thiện', sentiment: 'positive' },
    { threshold: -3, text: 'Người lao động bắt đầu lo ngại về thu nhập và việc làm', sentiment: 'negative' },
    { threshold: -5, text: 'Công đoàn kêu gọi biểu tình phản đối chính sách', sentiment: 'negative' },
  ],
  businesses: [
    { threshold: 5, text: 'Doanh nghiệp trong và ngoài nước đẩy mạnh đầu tư mở rộng sản xuất', sentiment: 'positive' },
    { threshold: 2, text: 'Môi trường kinh doanh khởi sắc, niềm tin doanh nghiệp tăng', sentiment: 'positive' },
    { threshold: -3, text: 'Doanh nghiệp thận trọng cắt giảm sản xuất và tinh gọn bộ máy', sentiment: 'negative' },
    { threshold: -5, text: 'Doanh nghiệp đe dọa chuyển vốn đầu tư sang nước khác', sentiment: 'negative' },
  ],
  state: [
    { threshold: 4, text: 'Ngân sách quốc gia được củng cố vững chắc', sentiment: 'positive' },
    { threshold: 2, text: 'Thu ngân sách nhà nước cải thiện đáng kể', sentiment: 'positive' },
    { threshold: -3, text: 'Áp lực chi tiêu công gia tăng, cần tái cơ cấu ngân sách', sentiment: 'negative' },
    { threshold: -6, text: 'Nhà nước đối mặt với thâm hụt ngân sách nghiêm trọng', sentiment: 'negative' },
  ],
};

const icons: Record<string, string> = { workers: '👷', businesses: '🏢', state: '🏛️' };
const groupLabels: Record<string, string> = { workers: 'Người lao động', businesses: 'Doanh nghiệp', state: 'Nhà nước' };

export function getReactions(impact: Record<string, number>): Reaction[] {
  const reactions: Reaction[] = [];

  for (const [group, value] of Object.entries(impact)) {
    if (value === 0 || !templates[group]) continue;

    const groupTemplates = templates[group];
    let matched: { threshold: number; text: string; sentiment: 'positive' | 'negative' } | null = null;

    for (const t of groupTemplates) {
      if (t.sentiment === 'positive' && value >= t.threshold) {
        if (!matched || t.threshold > matched.threshold) matched = t;
      } else if (t.sentiment === 'negative' && value <= t.threshold) {
        if (!matched || t.threshold < matched.threshold) matched = t;
      }
    }

    if (matched) {
      const absVal = Math.abs(value);
      const severity = absVal >= 6 ? 3 : absVal >= 4 ? 2 : 1;
      reactions.push({
        icon: icons[group] || '',
        group: groupLabels[group] || group,
        text: matched.text,
        sentiment: matched.sentiment,
        severity,
      });
    }
  }

  return reactions;
}

export function getEventReactionHeadline(eventTitle: string, choiceLabel: string): string {
  const templates = [
    `Quyết định "${choiceLabel}" đã làm thay đổi cục diện nền kinh tế`,
    `Sau quyết định về "${eventTitle}", những chuyển biến bắt đầu xuất hiện`,
    `Nền kinh tế phản ứng trước quyết định về "${eventTitle}"`,
    `Các tác động từ quyết định "${choiceLabel}" bắt đầu lan tỏa`,
    `Hệ quả của quyết định về ${eventTitle.toLowerCase()} đã hiện rõ`,
    `Bức tranh kinh tế thay đổi sau quyết định về ${eventTitle.toLowerCase()}`,
  ];
  return templates[Math.floor(Math.random() * templates.length)];
}

export function getEventIcon(eventTitle: string): string {
  const keywords: [string, string][] = [
    ['giá', '📊'], ['hàng hóa', '📦'], ['thị trường', '🏪'],
    ['lao động', '👷'], ['lương', '💰'], ['việc làm', '💼'],
    ['cạnh tranh', '⚔️'], ['độc quyền', '🏰'], ['mua lại', '🤝'],
    ['lợi ích', '⚖️'], ['thuế', '🧾'], ['ngân sách', '🏛️'],
    ['công nghiệp', '🏭'], ['robot', '🤖'], ['công nghệ', '💻'],
    ['hội nhập', '🌐'], ['fdi', '🌍'], ['môi trường', '🌿'],
    ['năng suất', '📈'], ['sản xuất', '🏗️'], ['chuyển đổi số', '📱'],
    ['giáo dục', '📚'], ['đào tạo', '🎓'], ['hạ tầng', '🏗️'],
    ['tự động', '⚙️'], ['sốt đất', '🏠'], ['dầu', '🛢️'],
    ['bóng đá', '🏆'], ['meme', '😂'], ['cáp', '🐟'],
    ['ai', '🤖'], ['khủng hoảng', '⚠️'], ['nợ', '💳'],
  ];
  const lower = eventTitle.toLowerCase();
  for (const [kw, icon] of keywords) {
    if (lower.includes(kw)) return icon;
  }
  return '📊';
}
