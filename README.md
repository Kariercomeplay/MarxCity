# 🏛️ MarxCity — Xây Dựng Nền Kinh Tế Định Hướng XHCN

**MarxCity** là game mô phỏng kinh tế dựa trên **Kinh tế chính trị Mác-Lênin (MLN122)**. Người chơi vào vai Người điều hành nền kinh tế Việt Nam, đưa ra các quyết định chính sách và quan sát hệ quả qua lăng kính lý luận Mác-Lênin.

> Không dạy lý thuyết ngay — cho người chơi ra quyết định, rồi giải thích vì sao theo Mác-Lênin lại xảy ra kết quả đó.

---

## 🎯 Mục tiêu

- Giúp sinh viên hiểu **Kinh tế chính trị Mác-Lênin** qua trải nghiệm thực tế
- Mô phỏng các **quan hệ kinh tế** và **sự đánh đổi (trade-off)** trong chính sách
- Gắn lý thuyết với **9 CLO** (Chuẩn đầu ra) của môn học
- Tạo hứng thú học tập qua **gameplay**, **bất ngờ** và **kể chuyện**

---

## 🎮 Gameplay

### Luồng cơ bản

```
Landing → Chọn độ khó → Giới thiệu
  → Dashboard (7 chỉ số kinh tế)
    → Sự kiện xuất hiện → 3 lựa chọn (không preview số)
      → Consequence Screen (4 phase animation)
        → Dashboard review + Policy Panel
          → Quiz kiến thức (xen kẽ)
            → "Sang năm mới" → next event
              → Kết thúc → Báo cáo + Danh hiệu
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

### 6 chính sách (position-based effects)

- 💰 Thuế TNDN — 🎓 Đầu tư giáo dục — 🏗️ Đầu tư hạ tầng
- 💵 Lương tối thiểu — 🌐 Thu hút FDI — 🌿 Bảo vệ môi trường

### 3 nhóm lợi ích (stakeholder balance)

👷 Người lao động · 🏢 Doanh nghiệp · 🏛️ Nhà nước

### 5 cấp độ trạng thái

🔴 Khủng hoảng (≤15) → 🟠 Bất ổn (≤30) → 🟡 Yếu (≤50) → 🟢 Phát triển (≤70) → 💚 Thịnh vượng (>70)

---

## 📊 Nội dung học thuật

### 50 sự kiện kinh tế

| Loại | Số lượng | Mô tả |
|---|---|---|
| 📖 Story | 25 | Cốt truyện chính, 5 sự kiện/giai đoạn |
| 🎲 Random | 12 | Sự kiện ngẫu nhiên xuyên suốt |
| 🔗 Chain | 5 | Mở khóa khi chọn đúng ở event trước |
| 🎉 Surprise | 6 | Bất ngờ: phát hiện mỏ dầu, sốt đất, meme... |
| 🏁 Ending | 2 | Kết thúc game theo điều kiện |

### 24 câu hỏi quiz

Phủ đều 5 giai đoạn, 3 mức độ: dễ · trung bình · khó

### 166 lời giải thích MLN

Mỗi lựa chọn + mỗi câu quiz đều có giải thích theo Kinh tế chính trị Mác-Lênin.

### 13 kết thúc

| Loại | Số lượng | Ví dụ |
|---|---|---|
| ✅ Thành công | 5 | Đại công cáo thành, Cường quốc công nghiệp, Rồng Châu Á |
| ⚖️ Trung bình | 3 | Ổn định là trên hết, Thực dụng, Chờ thời cơ |
| ❌ Thất bại | 5 | Khủng hoảng kinh tế, Sụp đổ môi trường, Nợ nần |

### Gắn CLO

| CLO | Tính năng |
|---|---|
| CLO2 | Event giá cả, năng suất, thời gian lao động |
| CLO3 | Event cạnh tranh, độc quyền, tập trung tư bản |
| CLO4 | Event KTTT định hướng XHCN, quan hệ lợi ích |
| CLO5 | Event CNH-HĐH, hội nhập, FDI, chuyển giao CN |
| CLO6, CLO7, CLO8 | Xuyên suốt qua giải thích và phân tích |
| CLO9 | Quiz, lập luận, báo cáo |

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

## 🚀 Bắt đầu

### Yêu cầu

- Node.js ≥ 18
- MongoDB Atlas URI (hoặc MongoDB local)

### Cài đặt

```bash
git clone https://github.com/Kariercomeplay/MarxCity.git
cd MarxCity
npm install
```

### Cấu hình

Tạo file `.env.local`:

```env
MONGODB_URI=mongodb+srv://<user>:<pass>@cluster0.xxxxx.mongodb.net/marxcity?retryWrites=true&w=majority
NEXTAUTH_SECRET=<your-secret-key>
NEXTAUTH_URL=http://localhost:3000
```

### Chạy

```bash
npm run dev
```

Mở [http://localhost:3000](http://localhost:3000).

### Build

```bash
npm run build
npm start
```

---

## 📁 Cấu trúc thư mục

```
marxcity/
├── src/
│   ├── app/                    # Pages + API routes
│   │   ├── game/               # Game dashboard + intro
│   │   ├── report/             # Báo cáo cuối game
│   │   ├── auth/               # Login / Signup
│   │   ├── admin/              # Admin dashboard
│   │   ├── leaderboard/        # Bảng xếp hạng
│   │   └── api/                # API routes (init, turn, load, quiz...)
│   ├── components/
│   │   ├── game/               # Game components
│   │   ├── landing/            # Landing page components
│   │   ├── report/             # Report components
│   │   └── ui/                 # UI primitives (Button, Slider, Modal...)
│   ├── lib/
│   │   ├── engine/             # Simulation engine + effects + calculator
│   │   ├── models/             # MongoDB models
│   │   └── utils/              # Utilities (RNG)
│   ├── data/                   # Game content (50 events, 24 quiz, 166 explanations)
│   ├── store/                  # Zustand state
│   └── types/                  # TypeScript types
├── public/                     # Static assets
└── package.json
```

---

## 🧪 API Routes

| Route | Method | Chức năng |
|---|---|---|
| `/api/game/init` | POST | Khởi tạo game mới |
| `/api/game/turn` | POST | Xử lý 1 năm chơi |
| `/api/game/load` | GET | Load game từ DB |
| `/api/game/save` | POST | Lưu game |
| `/api/game/quiz` | POST | Lưu kết quả quiz |
| `/api/auth/signup` | POST | Đăng ký |
| `/api/auth/[...nextauth]` | \* | NextAuth |
| `/api/leaderboard` | GET | Bảng xếp hạng |

---

## 📋 Routes (17 pages)

```
/                           Landing page
/game                       Game dashboard
/game/intro                 Màn hình giới thiệu
/report/[saveId]            Báo cáo cuối game
/auth/login                 Đăng nhập
/auth/signup                Đăng ký
/leaderboard                Bảng xếp hạng
/admin                      Admin dashboard
```

---

## 👥 Nhóm phát triển

Dự án được phát triển như một sản phẩm môn học Kinh tế chính trị Mác-Lênin (MLN122).

---

## 📄 Giấy phép

Dự án phục vụ mục đích giáo dục.
