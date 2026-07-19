import { GameStats, Policies, Difficulty } from '@/types/game';

export const MAX_STAT = 100;
export const MIN_STAT = 0;

export const DEFAULT_POLICIES: Policies = {
  taxRate: 50,
  minWage: 50,
  eduInvestment: 40,
  infraInvestment: 40,
  fdiPolicy: 50,
  envProtection: 50,
};

export const DIFFICULTY_CONFIG: Record<Difficulty, {
  startingStats: GameStats;
  yearRange: [number, number];
  positiveBias: number;
  crisisRate: number;
  effectMultiplier: number;
}> = {
  easy: {
    startingStats: { production: 55, employment: 55, socialWelfare: 50, marketStability: 60, nationalCapacity: 45, environment: 65, budget: 55 },
    yearRange: [8, 12],
    positiveBias: 0.7,
    crisisRate: 0.15,
    effectMultiplier: 1.15,
  },
  normal: {
    startingStats: { production: 50, employment: 50, socialWelfare: 45, marketStability: 55, nationalCapacity: 40, environment: 60, budget: 50 },
    yearRange: [7, 10],
    positiveBias: 0.5,
    crisisRate: 0.3,
    effectMultiplier: 1.0,
  },
  hard: {
    startingStats: { production: 40, employment: 40, socialWelfare: 35, marketStability: 45, nationalCapacity: 30, environment: 55, budget: 40 },
    yearRange: [6, 8],
    positiveBias: 0.3,
    crisisRate: 0.5,
    effectMultiplier: 0.85,
  },
};

export const CHAPTERS = [
  { id: 1, name: 'Hàng hóa, thị trường và lao động', years: [1, 2], cloTags: ['CLO2'] },
  { id: 2, name: 'Cạnh tranh và độc quyền', years: [3, 4], cloTags: ['CLO3'] },
  { id: 3, name: 'Quan hệ lợi ích kinh tế', years: [5, 6], cloTags: ['CLO4', 'CLO7'] },
  { id: 4, name: 'Công nghiệp hóa và hiện đại hóa', years: [7, 8], cloTags: ['CLO5'] },
  { id: 5, name: 'Hội nhập và phát triển bền vững', years: [9, 10], cloTags: ['CLO5', 'CLO7', 'CLO8'] },
];

export const CLO_LABELS: Record<string, string> = {
  CLO1: 'Lịch sử hình thành, đối tượng, phương pháp và chức năng của KTCT Mác-Lênin',
  CLO2: 'Hàng hóa, tiền tệ, thị trường, quy luật giá trị, giá trị thặng dư',
  CLO3: 'Cạnh tranh, độc quyền, độc quyền nhà nước và vai trò lịch sử của CNTB',
  CLO4: 'Kinh tế thị trường định hướng XHCN và các quan hệ lợi ích kinh tế ở Việt Nam',
  CLO5: 'Công nghiệp hóa, hiện đại hóa và hội nhập kinh tế quốc tế của Việt Nam',
  CLO6: 'Phẩm chất, lập trường, trách nhiệm và giá trị khoa học của lý luận',
  CLO7: 'Phân tích quan hệ lợi ích, trách nhiệm xã hội, thích ứng với KHCN',
  CLO8: 'Kiến thức cốt lõi trong bối cảnh Việt Nam và thế giới; vai trò công dân',
  CLO9: 'Lập luận, viết, thuyết trình, làm việc nhóm, sáng tạo và sử dụng AI có trách nhiệm',
};

export const STAT_LABELS: Record<string, string> = {
  production: 'Năng lực sản xuất',
  employment: 'Việc làm',
  socialWelfare: 'Tiến bộ xã hội',
  marketStability: 'Ổn định thị trường',
  nationalCapacity: 'Năng lực tự chủ',
  environment: 'Môi trường',
  budget: 'Ngân sách',
};

export const STAT_DESCRIPTIONS: Record<string, string> = {
  production: 'Công nghiệp, năng suất, cơ sở hạ tầng',
  employment: 'Số lượng và chất lượng việc làm',
  socialWelfare: 'Thu nhập, giáo dục, phúc lợi',
  marketStability: 'Giá cả, cung ứng, niềm tin',
  nationalCapacity: 'Công nghệ và doanh nghiệp trong nước',
  environment: 'Mức độ phát triển bền vững',
  budget: 'Khả năng thực hiện chính sách',
};

export const STAT_COLORS: Record<string, string> = {
  production: '#3b82f6',
  employment: '#10b981',
  socialWelfare: '#f59e0b',
  marketStability: '#8b5cf6',
  nationalCapacity: '#06b6d4',
  environment: '#22c55e',
  budget: '#ef4444',
};

export const ENDINGS = [
  {
    id: 'great_achievement',
    title: 'Đại công cáo thành',
    description: 'Bạn đã xây dựng thành công nền kinh tế hài hòa, phát triển toàn diện.',
    type: 'success' as const,
    narrative: 'Dưới sự điều hành của bạn, đất nước đã vươn mình trở thành một nền kinh tế phát triển toàn diện. Công nghiệp hiện đại, đời sống nhân dân no ấm, môi trường được bảo vệ. Bài học từ kinh tế chính trị Mác-Lênin về phát triển hài hòa các quan hệ lợi ích đã được áp dụng thành công.',
  },
  {
    id: 'industrial_power',
    title: 'Cường quốc công nghiệp',
    description: 'Bạn đã thúc đẩy công nghiệp hóa, đưa đất nước thành một cường quốc sản xuất.',
    type: 'success' as const,
    narrative: 'Những nhà máy hiện đại mọc lên khắp mọi miền. Công nghiệp hỗ trợ phát triển, năng suất lao động tăng vọt. Con đường công nghiệp hóa, hiện đại hóa mà bạn vạch ra đã đưa đất nước thoát khỏi đói nghèo, vươn lên sánh vai với các cường quốc kinh tế.',
  },
  {
    id: 'prosperous_society',
    title: 'Xã hội thịnh vượng',
    description: 'Người dân có việc làm ổn định, phúc lợi xã hội được bảo đảm.',
    type: 'success' as const,
    narrative: 'Người lao động có việc làm với thu nhập xứng đáng. Hệ thống an sinh xã hội bao phủ toàn dân. Bạn đã chứng minh rằng tăng trưởng kinh tế phải đi đôi với tiến bộ công bằng xã hội — một nguyên lý cốt lõi của kinh tế thị trường định hướng XHCN.',
  },
  {
    id: 'sustainable_development',
    title: 'Phát triển bền vững',
    description: 'Tăng trưởng xanh, bảo vệ môi trường, tương lai bền vững.',
    type: 'success' as const,
    narrative: 'Bạn đã chứng minh rằng tăng trưởng kinh tế và bảo vệ môi trường không mâu thuẫn. Các chính sách kinh tế xanh, năng lượng tái tạo và sản xuất sạch đã biến Việt Nam thành hình mẫu phát triển bền vững trong khu vực.',
  },
  {
    id: 'dragon_asia',
    title: 'Rồng Châu Á',
    description: 'Hội nhập sâu rộng, tự chủ vững vàng, vươn tầm quốc tế.',
    type: 'success' as const,
    narrative: 'Việt Nam đã trở thành con rồng kinh tế mới của Châu Á. Hội nhập quốc tế sâu rộng nhưng vẫn giữ vững năng lực tự chủ. Các doanh nghiệp Việt Nam đã vươn ra thế giới, thương hiệu quốc gia được bạn bè quốc tế ngưỡng mộ.',
  },
  {
    id: 'stability_first',
    title: 'Ổn định là trên hết',
    description: 'Dù không bứt phá, bạn đã giữ vững ổn định kinh tế vĩ mô.',
    type: 'neutral' as const,
    narrative: 'Trong bối cảnh nhiều biến động, bạn đã chọn con đường ổn định. Dù tăng trưởng chưa cao, nhưng lạm phát được kiểm soát, thị trường ổn định, lòng tin của người dân và doanh nghiệp được duy trì. Có những lúc, giữ vững ổn định đã là một thành công.',
  },
  {
    id: 'pragmatic',
    title: 'Thực dụng',
    description: 'Bạn ưu tiên hiệu quả kinh tế hơn các mục tiêu khác.',
    type: 'neutral' as const,
    narrative: 'Bạn là người thực dụng, luôn đặt hiệu quả kinh tế lên hàng đầu. Dù một số chỉ số xã hội và môi trường chưa như mong muốn, nhưng nền kinh tế vẫn vận hành ổn định và ngân sách quốc gia được giữ vững.',
  },
  {
    id: 'waiting',
    title: 'Chờ thời cơ',
    description: 'Mọi chỉ số ở mức trung bình, chưa có đột phá.',
    type: 'neutral' as const,
    narrative: 'Nhiệm kỳ của bạn kết thúc với những kết quả ở mức trung bình. Chưa có đột phá lớn nhưng cũng không có khủng hoảng. Có lẽ thời cơ chưa đến — hoặc những quyết định thận trọng của bạn đã giúp đất nước tránh được những rủi ro tiềm ẩn.',
  },
  {
    id: 'economic_crisis',
    title: 'Khủng hoảng kinh tế',
    description: 'Nền kinh tế rơi vào khủng hoảng do chính sách sai lầm.',
    type: 'failure' as const,
    narrative: 'Những chính sách thiếu cân nhắc đã đẩy nền kinh tế vào khủng hoảng. Ngân sách cạn kiệt, thị trường hỗn loạn. Như Mác đã phân tích, khủng hoảng là kết quả của sự mất cân đối nghiêm trọng giữa sản xuất và tiêu dùng, giữa tích lũy và đầu tư.',
  },
  {
    id: 'social_unrest',
    title: 'Bất ổn xã hội',
    description: 'Mâu thuẫn lợi ích giữa các nhóm trong xã hội bùng nổ.',
    type: 'failure' as const,
    narrative: 'Khoảng cách giàu nghèo ngày càng lớn, mâu thuẫn giữa người lao động và doanh nghiệp, giữa các vùng miền trở nên gay gắt. Bạn đã không làm tròn vai trò điều hòa quan hệ lợi ích — một trong những chức năng quan trọng nhất của Nhà nước trong nền kinh tế thị trường định hướng XHCN.',
  },
  {
    id: 'environmental_collapse',
    title: 'Sụp đổ môi trường',
    description: 'Tăng trưởng bằng mọi giá đã hủy hoại môi trường sống.',
    type: 'failure' as const,
    narrative: 'Những khu công nghiệp mọc lên nhưng không đi kèm xử lý ô nhiễm. Nguồn nước, không khí, đất đai bị hủy hoại. Sức khỏe người dân suy giảm. Bạn đã quên rằng tăng trưởng không bền vững cuối cùng sẽ phá hủy chính nền tảng của nó.',
  },
  {
    id: 'debt_trap',
    title: 'Nợ nần chồng chất',
    description: 'Vay nợ quá mức, mất khả năng chi trả.',
    type: 'failure' as const,
    narrative: 'Chính phủ đã vay quá nhiều để bù đắp thâm hụt ngân sách. Các khoản nợ chồng chất, lãi suất tăng cao. Đất nước lâm vào bẫy nợ, phải cắt giảm chi tiêu công và phúc lợi xã hội, đẩy người dân vào khó khăn.',
  },
  {
    id: 'foreign_dependency',
    title: 'Phụ thuộc ngoại bang',
    description: 'Nền kinh tế phụ thuộc quá nhiều vào vốn và công nghệ nước ngoài.',
    type: 'failure' as const,
    narrative: 'Doanh nghiệp nước ngoài chi phối hầu hết các ngành kinh tế then chốt. Công nghệ trong nước lạc hậu, không có năng lực tự chủ. Như Mác đã cảnh báo, tư bản nước ngoài tìm kiếm lợi nhuận, không phải sự phát triển của đất nước bạn.',
  },
];
