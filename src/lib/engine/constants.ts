import { GameStats, Policies } from '@/types/game';

export const TOTAL_TURNS = 10;

export const MAX_STAT = 100;
export const MIN_STAT = 0;

export const STARTING_STATS: GameStats = {
  production: 50,
  employment: 50,
  socialWelfare: 45,
  marketStability: 55,
  nationalCapacity: 40,
  environment: 60,
  budget: 50,
};

export const DEFAULT_POLICIES: Policies = {
  taxRate: 50,
  minWage: 50,
  eduInvestment: 40,
  infraInvestment: 40,
  fdiPolicy: 50,
  envProtection: 50,
};

export const CHAPTERS = [
  { id: 1, name: 'Hàng hóa, thị trường và lao động', turns: [1, 2], cloTags: ['CLO2'] },
  { id: 2, name: 'Cạnh tranh và độc quyền', turns: [3, 4], cloTags: ['CLO3'] },
  { id: 3, name: 'Quan hệ lợi ích kinh tế', turns: [5, 6], cloTags: ['CLO4', 'CLO7'] },
  { id: 4, name: 'Công nghiệp hóa và hiện đại hóa', turns: [7, 8], cloTags: ['CLO5'] },
  { id: 5, name: 'Hội nhập và phát triển bền vững', turns: [9, 10], cloTags: ['CLO5', 'CLO7', 'CLO8'] },
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
