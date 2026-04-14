# CLAUDE.md - คู่มือโปรเจกต์สำหรับ Claude Code

## ภาพรวมโปรเจกต์
โปรแกรมดวงจีน **โป๊ยยี่สี่เถียว (八字 / BaZi)** โดย **Ek maoshan**
เป็นเว็บแอปคำนวณดวงชะตาจีนจากวันเดือนปีเกิดและเวลาเกิด แสดงผลเป็นเสา 4 ต้น (四柱)
พร้อมคะแนนธาตุและรูปโหงวเฮ้ง (五行面相) ตามธาตุประจำตัว

## Tech Stack
- **Framework:** Next.js 14.2.15 (App Router)
- **ภาษา:** JavaScript (ไม่ใช้ TypeScript)
- **UI Library:** React 18
- **ฟอนต์:** Google Fonts - Kanit (ภาษาไทย)
- **Styling:** CSS ล้วน (globals.css) — ไม่ใช้ Tailwind
- **Deploy:** Docker (multi-stage build, node:18-alpine)

## โครงสร้างไฟล์

```
bazi-nextjs/
├── CLAUDE.md              ← ไฟล์นี้ (คู่มือสำหรับ Claude Code)
├── app/
│   ├── layout.js          ← Root layout (โหลดฟอนต์ Kanit, metadata)
│   ├── page.js            ← หน้าหลัก (ฟอร์ม + แสดงผลดวง + โหงวเฮ้ง)
│   ├── globals.css        ← CSS ทั้งหมด (ธีมดำ, สีธาตุ, print style)
│   └── lib/
│       └── baziData.js    ← ข้อมูลหลัก + ฟังก์ชันคำนวณดวง
├── public/
│   └── bazi/              ← รูปโหงวเฮ้งตามธาตุ (5 ไฟล์)
│       ├── earth.png      ← ธาตุดิน
│       ├── fire.png       ← ธาตุไฟ
│       ├── metal.png      ← ธาตุทอง
│       ├── water.png      ← ธาตุน้ำ
│       └── wood.png       ← ธาตุไม้
├── Dockerfile             ← Docker multi-stage build
├── docker-compose.yml     ← Docker Compose (port 3000)
├── next.config.js         ← Next.js config
└── package.json           ← Dependencies (next, react, react-dom)
```

## ไฟล์สำคัญและหน้าที่

### `app/lib/baziData.js` — หัวใจของโปรแกรม
- `stems[]` — ข้อมูลกิ่งฟ้า 10 ตัว (天干 Heavenly Stems) พร้อมธาตุและ CSS class
- `branches[]` — ข้อมูลก้านดิน 12 ตัว (地支 Earthly Branches) พร้อมสัตว์นักษัตร
- `solarCutoffs[]` — จุดตัดสุริยคติสำหรับคำนวณเดือน
- `faceProfiles{}` — ข้อมูลโหงวเฮ้ง 5 ธาตุ (ชื่อ, คำอธิบายใบหน้า)
- `getScore()` — คำนวณคะแนนความสัมพันธ์ธาตุ (+2/+1/-1/-2)
- `formatScore()` — แปลงคะแนนให้มีเครื่องหมาย +/-
- `calculateBazi()` — ฟังก์ชันหลักคำนวณดวง รับข้อมูลเกิด → ส่งกลับเสา 4 ต้น + คะแนน + โหงวเฮ้ง

### `app/page.js` — หน้า UI หลัก
- ฟอร์มกรอก: ชื่อ, นามสกุล, วัน/เดือน/ปี พ.ศ., เวลา 24 ชม., เพศ
- Validation: ตรวจวัน (1-31), ปี (2400-2600), เวลา (HH:MM)
- แสดงผล: ตาราง 4 เสา (ยาม/วัน/เดือน/ปี), คะแนนรวม, รูปโหงวเฮ้ง

### `app/globals.css` — ธีมและสไตล์
- ธีมพื้นหลังดำ, ข้อความขาว
- สีธาตุ: `.text-wood`(เขียว), `.text-fire`(แดง), `.text-earth`(เหลือง), `.text-metal`(ขาว), `.text-water`(ฟ้า)
- `.face-profile` — แสดงรูปโหงวเฮ้งเต็มความกว้าง (flex-direction: column)
- Print style: ซ่อนฟอร์มและปุ่ม แสดงเฉพาะผลลัพธ์

## แนวคิดหลักของระบบดวงจีน

### เสา 4 ต้น (四柱 Four Pillars)
แต่ละเสามี 2 แถว:
- **แถว A (กิ่งฟ้า / 天干 / Heavenly Stem)** — แถวบน
- **แถว B (ก้านดิน / 地支 / Earthly Branch)** — แถวล่าง

ลำดับเสาในโค้ด: `P.h`(ยาม) → `P.d`(วัน) → `P.m`(เดือน) → `P.y`(ปี)

### ดิถี (Day Master / 日主)
- คือ **กิ่งฟ้าของเสาวัน** = `P.d.s` = **แถว A วัน**
- ธาตุของดิถี (`dayMaster`) ใช้กำหนดทุกอย่าง: คะแนน, โหงวเฮ้ง

### โหงวเฮ้ง (五行面相)
- เลือกรูปจาก `/public/bazi/` ตามธาตุ dayMaster
- wood → wood.png, fire → fire.png, earth → earth.png, metal → metal.png, water → water.png

### ระบบข้ามวัน
- เกิดตั้งแต่ 23:00 น. → นับเป็นวันถัดไป (ตามหลักดวงจีน)

### คะแนนธาตุ
- รวมบน (sumA) = กิ่งฟ้ายาม + กิ่งฟ้าเดือน + กิ่งฟ้าปี (ตัดดิถีออก)
- รวมล่าง (sumB) = ก้านดินทั้ง 4 เสา
- รวมทั้งหมด (sumTotal) = sumA + sumB

## คำสั่งที่ใช้บ่อย

```bash
# Development
npm install          # ติดตั้ง dependencies
npm run dev          # รัน dev server (http://localhost:3000)
npm run build        # Build สำหรับ production
npm start            # รัน production server

# Docker
docker-compose up --build    # Build และรัน container
docker-compose down          # หยุด container
```

## กฎและข้อควรระวัง
- โค้ดทั้งหมดมี **comment ภาษาไทย** ละเอียดทุกส่วน — อ่าน comment ก่อนแก้ไข
- ไม่ใช้ TypeScript — เขียน JavaScript ล้วน
- ไม่ใช้ Tailwind — ใช้ CSS class ใน globals.css
- รูปโหงวเฮ้งอยู่ใน `public/bazi/` — ห้ามลบหรือเปลี่ยนชื่อไฟล์
- ฟอนต์จีนใช้ Kaiti (楷体) — กำหนดใน `.char-cn` class
- ปี พ.ศ. ต้องแปลงเป็น ค.ศ. ก่อนคำนวณ (yearBE - 543)
