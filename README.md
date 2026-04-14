# คู่มือการติดตั้ง Bazi Next.js บน Docker (สำหรับมือใหม่)

## สารบัญ

1. Docker คืออะไร?
2. ติดตั้ง Docker
3. โครงสร้างโปรเจกต์
4. วิธีรันบน Docker
5. คำสั่งที่ใช้บ่อย
6. แก้ปัญหาที่พบบ่อย

---

## 1. Docker คืออะไร?

ให้นึกภาพว่า Docker เหมือน "กล่องสำเร็จรูป" ที่บรรจุทุกอย่างที่แอปต้องการไว้ข้างใน
ไม่ว่าจะเอาไปรันบนคอมพิวเตอร์เครื่องไหน ก็ทำงานได้เหมือนกันทุกประการ
ไม่ต้องกังวลเรื่องติดตั้ง Node.js, ตั้งค่า environment หรือปัญหา "ในเครื่องผมมันรันได้"

**คำศัพท์สำคัญ:**

- **Image** = พิมพ์เขียวของแอป (สร้างจาก Dockerfile)
- **Container** = ตัวแอปที่รันจริง (สร้างจาก Image)
- **Dockerfile** = ไฟล์คำสั่งสร้าง Image
- **docker-compose.yml** = ไฟล์ตั้งค่าให้รัน Container ได้ง่ายขึ้น

---

## 2. ติดตั้ง Docker

### Windows

1. เข้าไปที่ https://www.docker.com/products/docker-desktop/
2. กดปุ่ม "Download for Windows"
3. เปิดไฟล์ที่โหลดมา แล้วทำตามขั้นตอน (กด Next ไปเรื่อยๆ)
4. รีสตาร์ทคอมพิวเตอร์
5. เปิด Docker Desktop (ไอคอนปลาวาฬสีฟ้า)
6. รอจนสถานะขึ้น "Docker Desktop is running" (แถบสีเขียว)

**หมายเหตุ Windows:** ถ้าระบบถาม WSL2 ให้กด "Install" ตามที่แนะนำ
WSL2 คือระบบ Linux ย่อยใน Windows ที่ Docker ต้องใช้

### macOS

1. เข้าไปที่ https://www.docker.com/products/docker-desktop/
2. กดปุ่ม "Download for Mac" (เลือก Apple Chip หรือ Intel ตามเครื่อง)
3. เปิดไฟล์ .dmg แล้วลาก Docker ไปใส่ Applications
4. เปิด Docker จาก Applications
5. รอจนไอคอนปลาวาฬบน Menu Bar หยุดเคลื่อนไหว

### Linux (Ubuntu/Debian)

เปิด Terminal แล้วพิมพ์ทีละบรรทัด:

```bash
# อัพเดตระบบ
sudo apt update

# ติดตั้ง Docker
sudo apt install -y docker.io docker-compose

# เพิ่มสิทธิ์ให้ user ปัจจุบัน (ไม่ต้องพิมพ์ sudo ทุกครั้ง)
sudo usermod -aG docker $USER

# ล็อกเอาท์แล้วล็อกอินใหม่ หรือรันคำสั่งนี้
newgrp docker
```

### ตรวจสอบว่าติดตั้งสำเร็จ

เปิด Terminal (หรือ Command Prompt/PowerShell บน Windows) แล้วพิมพ์:

```bash
docker --version
```

ถ้าขึ้นเลขเวอร์ชัน เช่น `Docker version 27.x.x` แปลว่าสำเร็จแล้ว

---

## 3. โครงสร้างโปรเจกต์

```
bazi-nextjs/
├── app/
│   ├── lib/
│   │   └── baziData.js      ← ข้อมูลและลอจิกคำนวณดวง
│   ├── globals.css           ← สไตล์ CSS ทั้งหมด
│   ├── layout.js             ← โครงหน้าเว็บหลัก
│   └── page.js               ← หน้าหลัก (ฟอร์ม + ผลลัพธ์)
├── public/                    ← ไฟล์ static (รูปภาพ, favicon)
├── .dockerignore              ← ไฟล์ที่ Docker ไม่ต้องสนใจ
├── Dockerfile                 ← คำสั่งสร้าง Docker Image
├── docker-compose.yml         ← ตั้งค่ารัน Container
├── next.config.js             ← ตั้งค่า Next.js
└── package.json               ← รายการ dependencies
```

**สิ่งที่เปลี่ยนจาก HTML เดิม:**

- แยก JavaScript ออกมาเป็นไฟล์ `baziData.js` (ง่ายต่อการแก้ไข/ทดสอบ)
- ใช้ React State แทนการจัดการ DOM ตรง (ไม่ต้อง getElementById)
- ใช้ Next.js App Router (โครงสร้างโฟลเดอร์ app/)
- รองรับ Server-Side Rendering (SEO ดีขึ้น)
- พร้อม deploy ด้วย Docker

---

## 4. วิธีรันบน Docker

### ขั้นตอนที่ 1: คัดลอกโปรเจกต์

วางโฟลเดอร์ `bazi-nextjs` ไว้ที่ไหนก็ได้ในคอมพิวเตอร์
เช่น `C:\Users\ชื่อคุณ\Desktop\bazi-nextjs` (Windows)
หรือ `~/Desktop/bazi-nextjs` (Mac/Linux)

### ขั้นตอนที่ 2: เปิด Terminal ไปที่โฟลเดอร์โปรเจกต์

**Windows (PowerShell หรือ Command Prompt):**
```bash
cd C:\Users\ชื่อคุณ\Desktop\bazi-nextjs
```

**macOS / Linux:**
```bash
cd ~/Desktop/bazi-nextjs
```

### ขั้นตอนที่ 3: สร้างและรัน (วิธีง่ายสุด)

พิมพ์คำสั่งเดียว:

```bash
docker compose up --build
```

**สิ่งที่จะเกิดขึ้น:**
1. Docker จะอ่าน Dockerfile
2. ดาวน์โหลด Node.js image (ครั้งแรกใช้เวลาสักครู่)
3. ติดตั้ง dependencies (npm install)
4. Build แอป Next.js
5. เริ่มรันเซิร์ฟเวอร์

**เมื่อเห็นข้อความประมาณนี้ แปลว่าสำเร็จแล้ว:**
```
bazi-poyyee  | ▲ Next.js 14.2.15
bazi-poyyee  | - Local:        http://localhost:3000
bazi-poyyee  |
bazi-poyyee  | ✓ Ready in 1234ms
```

### ขั้นตอนที่ 4: เปิดใช้งาน

เปิดเว็บบราวเซอร์ แล้วพิมพ์:

```
http://localhost:3000
```

จะเห็นหน้าโปรแกรมผูกดวงจีนเหมือนเดิมทุกประการ

### ขั้นตอนที่ 5: หยุดแอป

กด `Ctrl + C` ใน Terminal ที่รันอยู่

หรือถ้าจะรันแบบ background (ไม่ต้องเปิด Terminal ค้างไว้):

```bash
# รันแบบ background
docker compose up --build -d

# หยุดแอป
docker compose down
```

---

## 5. คำสั่งที่ใช้บ่อย

```bash
# ดูว่ามี container ไหนรันอยู่
docker ps

# ดู log ของแอป
docker compose logs

# ดู log แบบ real-time
docker compose logs -f

# รีสตาร์ทแอป (หลังแก้โค้ด)
docker compose up --build -d

# ลบ container และ image เก่า (ทำความสะอาด)
docker compose down --rmi all

# ดูว่า Docker ใช้พื้นที่เท่าไหร่
docker system df
```

---

## 6. แก้ปัญหาที่พบบ่อย

### "port 3000 is already in use"

มีโปรแกรมอื่นใช้ port 3000 อยู่ แก้ไขโดย:

แก้ไขไฟล์ `docker-compose.yml` เปลี่ยน port:
```yaml
ports:
  - "8080:3000"    # เปลี่ยนจาก 3000 เป็น 8080
```
แล้วเปิดเว็บที่ `http://localhost:8080` แทน

### "Docker daemon is not running"

Docker Desktop ยังไม่เปิด ให้เปิด Docker Desktop ก่อน
รอจนสถานะเป็นสีเขียว แล้วลองใหม่

### "no matching manifest for..."

เครื่องคุณอาจเป็น ARM (Mac M1/M2/M3) ให้เพิ่มบรรทัดนี้ใน Dockerfile:
```dockerfile
FROM --platform=linux/amd64 node:18-alpine AS deps
```

### แก้โค้ดแล้วไม่เห็นการเปลี่ยนแปลง

ต้อง build ใหม่:
```bash
docker compose up --build -d
```

### อยากเข้าถึงจากมือถือในวง LAN เดียวกัน

1. หา IP ของคอมพิวเตอร์:
   - Windows: พิมพ์ `ipconfig` ใน Terminal ดู IPv4 Address
   - Mac: ไปที่ System Settings > Network ดู IP Address
2. เปิดเว็บบนมือถือที่ `http://IP-ของคอม:3000`
   เช่น `http://192.168.1.100:3000`

---

## สรุปขั้นตอนทั้งหมด (ฉบับย่อ)

```bash
# 1. ติดตั้ง Docker Desktop

# 2. เปิด Terminal ไปที่โฟลเดอร์โปรเจกต์
cd bazi-nextjs

# 3. รันแอป
docker compose up --build -d

# 4. เปิดเว็บ
# http://localhost:3000

# 5. หยุดแอป
docker compose down
```

แค่ 5 ขั้นตอนก็ใช้งานได้แล้วครับ!
