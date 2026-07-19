# 🏛️ MarxCity — Xây Dựng Nền Kinh Tế Định Hướng XHCN

**MarxCity** là game mô phỏng kinh tế dựa trên **Kinh tế chính trị Mác-Lênin (MLN122)**. Người chơi vào vai Người điều hành nền kinh tế Việt Nam, đưa ra các quyết định chính sách và quan sát hệ quả qua lăng kính lý luận Mác-Lênin.

> *"Không dạy lý thuyết ngay — cho người chơi ra quyết định, rồi giải thích vì sao theo Mác-Lênin lại xảy ra kết quả đó."*

---

## 📖 Quá trình phát triển

### Giai đoạn 1: Ý tưởng ban đầu

Người dùng đề xuất ý tưởng **MarxCity** — một game mô phỏng nền kinh tế Việt Nam theo trường phái Kinh tế chính trị Mác-Lênin.

**Yêu cầu gốc:**
- Người dùng là người điều hành nền kinh tế
- Website không dạy lý thuyết ngay — cho người chơi ra quyết định
- Sau mỗi quyết định hệ thống giải thích vì sao theo Mác-Lênin lại xảy ra kết quả đó
- Landing page có animation thành phố
- Dashboard gồm: GDP, Inflation, Employment, Education, Industrialization, Modernization, FDI, Technology, Citizen Happiness, Environment, Budget
- 100 event, nhiều chính sách, simulation engine, AI Advisor

**Công nghệ chọn:** NextJS, NodeJS, MongoDB, Redis, SocketIO, ChartJS, Framer Motion, OpenAI/Ollama

---

### Giai đoạn 2: Lên kế hoạch kiến trúc

Kế hoạch tổng thể được vẽ ra với:
- **Frontend:** NextJS 14 (App Router) + Tailwind CSS + Framer Motion + Chart.js
- **Backend:** NextJS API Routes (serverless)
- **Database:** MongoDB Atlas
- **Auth:** NextAuth.js
- **AI:** Ollama local (dev) / OpenAI fallback (prod)
- **Deploy:** Vercel + MongoDB Atlas

---

### Giai đoạn 3: Phản biện và chốt scope (Feedback Loop)

Sau khi có kế hoạch, người dùng đưa ra **14 điểm phản biện** quan trọng:

| # | Phản biện | Thay đổi |
|---|---|---|
| 1 | **CLO mapping sai** — không khớp với CLO thực tế của môn học | Sửa mapping đúng 9 CLO, mỗi event có `cloReferences`, `conceptTags`, `learningObjectives` |
| 2 | **Không nên mô phỏng "toàn bộ nền kinh tế VN"** — rủi ro học thuật | Định nghĩa lại là **công cụ giáo dục**, không phải mô hình dự báo. Thêm disclaimer |
| 3 | **Đơn vị % thực gây hiểu lầm** — con số có vẻ chính xác nhưng không có cơ sở | Đổi sang **thang 0-100** (chỉ số tương đối) |
| 4 | **11 chỉ số quá nhiều** — người chơi mới bị ngợp | Rút xuống **7 chỉ số**: Năng lực sản xuất, Việc làm, Tiến bộ xã hội, Ổn định thị trường, Năng lực tự chủ, Môi trường, Ngân sách |
| 5 | **50 năm quá dài** — 90+ phút/phiên, người dùng bỏ cuộc | Rút xuống **12 lượt** (sau này thành 6-12 năm) |
| 6 | **100 event quá nhiều** — chi phí nội dung lớn | Chốt **18 event MVP** (sau mở rộng lên 50) |
| 7 | **Không nên có chủ đề nhạy cảm** (biểu tình, chiến tranh, tham nhũng) | Ưu tiên case gần với nội dung môn: lao động, tiền lương, tự động hóa, FDI... |
| 8 | **AI không nên đóng vai "chân lý"** — có thể giải thích sai | AI → **Explanation Engine** (template-based, có kiểm duyệt). Không impersonate nhân vật lịch sử |
| 9 | **Kiến trúc Vercel + Ollama** — API route không gọi được localhost | AI Gateway riêng trên VPS + fallback 3 tầng |
| 10 | **Simulation phải server-authoritative** — tránh gian lận | Engine là pure function, seed-based, chạy trên server |
| 11 | **Database nên tách lịch sử lượt chơi** | GameSave + GameTurn riêng |
| 12 | **Leaderboard thiết kế lại** — không chỉ theo score | Đa chiều: 40% KT + 25% XH + 15% lợi ích + 10% MT + 10% Quiz |
| 13 | **Auth và admin chưa phải ưu tiên MVP** | MVP không auth, không admin |
| 14 | **Game cần mục tiêu rõ ràng hơn "giữ chỉ số cao"** | Cân bằng **3 nhóm lợi ích**: 👷 🏢 🏛️ |

---

### Giai đoạn 4: Implement MVP

MVP được xây dựng với scope chốt:

- Landing page + City animation
- Chơi không cần đăng nhập (sessionId)
- 18 event (12 chính + 6 ngẫu nhiên)
- 7 chỉ số thang 0-100
- Policy panel (thuế, lương, đầu tư GD, hạ tầng, FDI, môi trường)
- Simulation engine (server-authoritative, pure function)
- Explanation Engine (template-based, gắn CLO)
- 6 mini quiz
- Báo cáo cuối game + danh hiệu
- Disclaimer học thuật

---

### Giai đoạn 5: Mở rộng và hoàn thiện

Sau MVP, người dùng yêu cầu mở rộng để tăng **tính bất ngờ** và **giá trị chơi lại**:

#### Mở rộng 1: 50 events + Branching + Surprise

| Yêu cầu | Kết quả |
|---|---|
| Game không nên cố định 10 lượt, độ dài là ẩn số | Hệ thống **Năm** (6-12 năm, ẩn) |
| Cần event bất ngờ, vui nhộn | **6 Surprise events**: phát hiện mỏ dầu, sốt đất, meme, cá cắn cáp... |
| Chọn event A có thể dẫn đến event B và C | **5 Chain events** (branching mechanics) |
| Đảm bảo 10 lần chơi khác nhau | 50 events, 24 quiz — xác suất trùng thấp |
| Phải có kết thúc thất bại | **13 endings** (5 success + 3 neutral + 5 failure) |
| Game over sớm nếu crisis | Crisis detection: budget ≤ 5, environment ≤ 5, employment ≤ 5 |

#### Mở rộng 2: Immersive Consequence System

| Vấn đề | Giải pháp |
|---|---|
| Hiển thị số (+production, -environment) → mất bất ngờ | **Ẩn hoàn toàn số preview** trong EventPanel |
| Click choice → chỉ thấy số khô khan | **Consequence Screen 4 phase**: Headline → Stats Animation → Stakeholder Reactions → MLN Explanation |
| Auto-advance → không kịp đọc | **Click-to-advance** từng phase |
| Quiz popup giữa consequence → quá tải | Quiz chờ sau consequence, hiện trên dashboard |
| Phản ứng stakeholder thiếu narrative | `stakeholderReactions.ts` — 10+ template sinh tự động |

#### Mở rộng 3: Policy System Redesign

| Vấn đề | Giải pháp |
|---|---|
| Policy chỉ dùng delta (thay đổi) → kéo lên 100 rồi giữ → effect = 0 | **Position-based**: effect dựa trên giá trị tuyệt đối so với neutral 50 |
| Tuyến tính → 50→60 hiệu quả như 90→100 | **Diminishing returns**: `softDiminish(n)` — bão hòa ở biên |
| Không có trade-off rõ ràng | **Trade-off matrix**: mỗi policy ảnh hưởng nhiều chỉ số, cả + và - |

#### Mở rộng 4: State Indicators + UX

| Vấn đề | Giải pháp |
|---|---|
| Chart 7 chỉ số chung → rối | **Split charts**: Kinh tế (4) + Xã hội (3) |
| Không biết tình trạng đất nước | **5 cấp độ**: 🔴 Khủng hoảng → 🟠 Bất ổn → 🟡 Yếu → 🟢 Phát triển → 💚 Thịnh vượng |
| "Chương 1/2" phá vỡ cảm giác thế giới mở | **Xóa toàn bộ** — thay bằng PeriodTransition theo năm |
| CLO badges hiện ngay → học thuật quá lộ liễu | **Ẩn sau icon 📖** (chỉ hiện khi hover) |
| Report chart Y-axis ±5 padding làm sai lệch | Scale **chính xác** min/max thực tế |
| Quiz không đếm được | Fix filter `quizSelectedIndex !== undefined` |
| Ending thiên "Thực dụng" quá dễ đạt | Nâng threshold: production ≥ **70** (was 55) |

---

### Giai đoạn 6: Hoàn thiện

- Build 0 lỗi TypeScript
- Deploy Vercel + MongoDB Atlas
- Tổng kết: **56 files, ~7000 dòng code**
- README ghi lại toàn bộ quá trình

---

## 🎮 Gameplay

### Luồng cơ bản

```
Landing → Chọn độ khó (Dễ/Thường/Khó)
  → Giới thiệu nhiệm vụ (4 slide)
    → Năm 1-? (ẩn, 6-12 năm):
      → [15%] Surprise Event (bất ngờ, vui nhộn)
      → Main Event (tình huống kinh tế, 3 lựa chọn, không preview)
        → Consequence Screen:
          Phase 1: Headline + icon động
          Phase 2: 7 stat bars animate (cũ → mới)
          Phase 3: Stakeholder reactions (👷 🏢 🏛️)
          Phase 4: MLN explanation (CLO ẩn sau icon)
      → Dashboard review (stats đã cập nhật)
      → [xen kẽ] Quiz kiến thức
      → "Sang năm mới" (chủ động)
      → Period Transition ở các mốc năm 1,3,5,7,9
    → [Trigger ending] → 13 endings
      → Báo cáo cuối game
```

### 7 chỉ số kinh tế (thang 0-100)

| Chỉ số | Ý nghĩa |
|---|---|
| 🏭 Năng lực sản xuất | Công nghiệp, năng suất, cơ sở hạ tầng |
| 💼 Việc làm | Số lượng và chất lượng việc làm |
| 🤝 Tiến bộ xã hội | Thu nhập, giáo dục, phúc lợi |
| 📈 Ổn định thị trường | Giá cả, cung ứng, niềm tin |
| 🛡️ Năng lực tự chủ | Công nghệ và doanh nghiệp trong nước |
| 🌿 Môi trường | Mức độ phát triển bền vững |
| 🏛️ Ngân sách | Khả năng thực hiện chính sách |

### 6 chính sách (position-based + diminishing returns)

💰 Thuế TNDN · 💵 Lương tối thiểu · 🎓 Đầu tư giáo dục · 🏗️ Đầu tư hạ tầng · 🌐 Thu hút FDI · 🌿 Bảo vệ môi trường

### 3 nhóm lợi ích

👷 Người lao động · 🏢 Doanh nghiệp · 🏛️ Nhà nước

### 5 cấp độ trạng thái

🔴 Khủng hoảng (≤15) → 🟠 Bất ổn (≤30) → 🟡 Yếu (≤50) → 🟢 Phát triển (≤70) → 💚 Thịnh vượng (>70)

### Độ khó

| Yếu tố | Dễ | Thường | Khó |
|---|---|---|---|
| Stats khởi đầu | ~55 | ~50 | ~40 |
| Crisis rate | 15% | 30% | 50% |
| Effect multiplier | 1.15x | 1.0x | 0.85x |
| Độ dài | 8-12 năm | 7-10 năm | 6-8 năm |

---

## 📊 Nội dung học thuật

### 50 sự kiện kinh tế

| Loại | SL | Mô tả | Ví dụ |
|---|---|---|---|
| 📖 Story | 25 | Cốt truyện chính, 5/giai đoạn | Giá hàng hóa, sáp nhập, FDI, tự động hóa |
| 🎲 Random | 12 | Xuất hiện ngẫu nhiên | Thiên tai, khủng hoảng tài chính, đứt gãy chuỗi cung ứng |
| 🔗 Chain | 5 | Mở khóa từ lựa chọn trước | Tranh chấp lao động, DN nước ngoài thâu tóm |
| 🎉 Surprise | 6 | Bất ngờ, xác suất thấp | Mỏ dầu, sốt đất, meme Bộ trưởng, cá cắn cáp |
| 🏁 Ending | 2 | Kết thúc game | Hội nghị tổng kết, Giải cứu nền kinh tế |

### 24 câu hỏi quiz

Chia đều 5 giai đoạn (5-5-5-5-4), 3 mức độ (8 easy + 8 medium + 8 hard).

### 166 lời giải thích MLN

Mỗi lựa chọn + mỗi câu quiz đều có giải thích theo Kinh tế chính trị Mác-Lênin, gắn CLO.

### 13 endings

| Loại | SL | Danh hiệu |
|---|---|---|
| ✅ Thành công | 5 | Đại công cáo thành, Cường quốc công nghiệp, Xã hội thịnh vượng, Phát triển bền vững, Rồng Châu Á |
| ⚖️ Trung bình | 3 | Ổn định là trên hết, Thực dụng, Chờ thời cơ |
| ❌ Thất bại | 5 | Khủng hoảng kinh tế, Bất ổn xã hội, Sụp đổ môi trường, Nợ nần, Phụ thuộc ngoại bang |

### Gắn CLO

| CLO | Nội dung | Tính năng game |
|---|---|---|
| CLO2 | Hàng hóa, tiền tệ, thị trường, giá trị thặng dư | Event giá cả, năng suất, thời gian lao động (Chương 1) |
| CLO3 | Cạnh tranh, độc quyền, độc quyền nhà nước | Event sáp nhập, bán phá giá, độc quyền số (Chương 2) |
| CLO4 | KTTT định hướng XHCN, quan hệ lợi ích | Event chính sách thuế, lương, phúc lợi (Chương 3) |
| CLO5 | CNH-HĐH, hội nhập quốc tế | Event robot, chuyển đổi số, FDI, Net Zero (Chương 4-5) |
| CLO6 | Phẩm chất, lập trường, giá trị khoa học | Xuyên suốt qua giải thích Phase 4 |
| CLO7 | Quan hệ lợi ích, trách nhiệm xã hội | Stakeholder reactions, balance meters |
| CLO8 | Bối cảnh VN và thế giới | Các tình huống thực tế (EVFTA, Samsung, chuỗi cung ứng) |
| CLO9 | Lập luận, viết, thuyết trình, làm việc nhóm | Quiz + báo cáo cuối game |

---

## 🛠️ Công nghệ

| Layer | Công nghệ |
|---|---|
| Framework | NextJS 16 (App Router) |
| UI | React 19 + Tailwind CSS v4 |
| Animation | Framer Motion 12 |
| Chart | Chart.js 4 + react-chartjs-2 |
| State | Zustand 5 |
| Database | MongoDB Atlas (Mongoose 9) |
| Auth | NextAuth.js v5 (Credentials) |
| Deploy | Vercel (serverless) |

---

## 📁 Cấu trúc thư mục

```
marxcity/
├── src/
│   ├── app/
│   │   ├── game/               # Game dashboard + intro
│   │   ├── report/             # Báo cáo cuối game
│   │   ├── auth/               # Login / Signup
│   │   ├── admin/              # Admin dashboard
│   │   ├── leaderboard/        # Bảng xếp hạng
│   │   └── api/                # 7 API routes
│   ├── components/
│   │   ├── game/               # 13 components (EventPanel, ConsequenceScreen...)
│   │   ├── landing/            # HeroSection, CityAnimation
│   │   ├── report/             # ReportView
│   │   └── ui/                 # Button, Slider, Modal, Badge
│   ├── lib/
│   │   ├── engine/             # 5 files (simulate, effects, calculator...)
│   │   ├── models/             # User, GameSave, GameTurn
│   │   └── utils/              # RNG
│   ├── data/                   # 3 files (50 events, 24 quiz, 166 explanations)
│   ├── store/                  # Zustand
│   └── types/                  # game.ts, api.ts
└── 56 files total
```

---

## 🧪 API Routes

| Route | Method | Chức năng |
|---|---|---|
| `/api/game/init` | POST | Khởi tạo game + difficulty |
| `/api/game/turn` | POST | Xử lý 1 năm (simulate, event, quiz) |
| `/api/game/load` | GET | Load game (kể cả incomplete) |
| `/api/game/save` | POST | Lưu game |
| `/api/game/quiz` | POST | Lưu kết quả quiz |
| `/api/auth/signup` | POST | Đăng ký |
| `/api/auth/[...nextauth]` | \* | NextAuth (credentials) |
| `/api/leaderboard` | GET | Top 50 completed games |

## 📋 Routes (17 pages)

```
/                       Landing + Difficulty selector
/game                   Game dashboard (chính)
/game/intro             Giới thiệu nhiệm vụ (4 slide)
/report/[saveId]        Báo cáo cuối game
/auth/login             Đăng nhập
/auth/signup            Đăng ký
/leaderboard            Bảng xếp hạng
/admin                  Admin (xem events + quiz)
```

---

## 🚀 Bắt đầu

```bash
git clone https://github.com/Kariercomeplay/MarxCity.git
cd MarxCity
npm install
```

Tạo `.env.local`:

```env
MONGODB_URI=mongodb+srv://<user>:<pass>@cluster0.xxxxx.mongodb.net/marxcity?retryWrites=true&w=majority
NEXTAUTH_SECRET=<your-secret>
NEXTAUTH_URL=http://localhost:3000
```

```bash
npm run dev      # Development
npm run build    # Production build
npm start        # Production server
```

---

## 📊 Thống kê

- **50** tình huống kinh tế
- **24** câu hỏi quiz
- **166** lời giải thích MLN
- **13** kết thúc
- **7** chỉ số + **6** chính sách + **3** nhóm lợi ích
- **9/9 CLO** được phủ
- **56 files**, ~**7000 dòng code** TypeScript
- **17 routes**, **0 TypeScript errors**
- Deployed on **Vercel** + **MongoDB Atlas**

---

## 👥 Nhóm phát triển

Dự án sản phẩm môn học **Kinh tế chính trị Mác-Lênin (MLN122)**.

---

## 📄 Giấy phép

Dự án phục vụ mục đích giáo dục.
