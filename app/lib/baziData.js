// =============================================================================
// baziData.js - ข้อมูลหลักและฟังก์ชันคำนวณดวงจีน (โป๊ยยี่ / BaZi / 八字)
// โดย เอก เหมาซาน
// =============================================================================

// -----------------------------------------------------------------------------
// ข้อมูลกิ่งฟ้า (天干 - Heavenly Stems) มี 10 ตัว
// cn = อักษรจีน, th = คำอ่านไทย, el = ธาตุ (element), c = CSS class สีธาตุ
// ธาตุไม้(wood) → ไฟ(fire) → ดิน(earth) → ทอง(metal) → น้ำ(water)
// -----------------------------------------------------------------------------
export const stems = [
  { cn: '甲', th: 'กะ', el: 'wood', c: 'text-wood' },     // 0: ไม้หยาง
  { cn: '乙', th: 'อิก', el: 'wood', c: 'text-wood' },    // 1: ไม้หยิน
  { cn: '丙', th: 'เปี้ย', el: 'fire', c: 'text-fire' },  // 2: ไฟหยาง
  { cn: '丁', th: 'เต็ง', el: 'fire', c: 'text-fire' },   // 3: ไฟหยิน
  { cn: '戊', th: 'โบ่ว', el: 'earth', c: 'text-earth' }, // 4: ดินหยาง
  { cn: '己', th: 'กี้', el: 'earth', c: 'text-earth' },   // 5: ดินหยิน
  { cn: '庚', th: 'แก', el: 'metal', c: 'text-metal' },   // 6: ทองหยาง
  { cn: '辛', th: 'ซิง', el: 'metal', c: 'text-metal' },  // 7: ทองหยิน
  { cn: '壬', th: 'ยิ่ม', el: 'water', c: 'text-water' }, // 8: น้ำหยาง
  { cn: '癸', th: 'กุ่ย', el: 'water', c: 'text-water' }, // 9: น้ำหยิน
];

// -----------------------------------------------------------------------------
// ข้อมูลก้านดิน (地支 - Earthly Branches) มี 12 ตัว (12 นักษัตร)
// cn = อักษรจีน, th = คำอ่านไทย, el = ธาตุ, c = CSS class, animal = ปีนักษัตรไทย
// -----------------------------------------------------------------------------
export const branches = [
  { cn: '子', th: 'จื่อ', el: 'water', c: 'text-water', animal: 'ชวด' },    // 0: หนู
  { cn: '丑', th: 'ทิ่ว', el: 'earth', c: 'text-earth', animal: 'ฉลู' },    // 1: วัว
  { cn: '寅', th: 'อิ้ง', el: 'wood', c: 'text-wood', animal: 'ขาล' },      // 2: เสือ
  { cn: '卯', th: 'เบ้า', el: 'wood', c: 'text-wood', animal: 'เถาะ' },     // 3: กระต่าย
  { cn: '辰', th: 'ซิ้ง', el: 'earth', c: 'text-earth', animal: 'มะโรง' },  // 4: มังกร
  { cn: '巳', th: 'จี๋', el: 'fire', c: 'text-fire', animal: 'มะเส็ง' },    // 5: งู
  { cn: '午', th: 'โง้ว', el: 'fire', c: 'text-fire', animal: 'มะเมีย' },   // 6: ม้า
  { cn: '未', th: 'บี้', el: 'earth', c: 'text-earth', animal: 'มะแม' },     // 7: แพะ
  { cn: '申', th: 'ซิม', el: 'metal', c: 'text-metal', animal: 'วอก' },     // 8: ลิง
  { cn: '酉', th: 'อิ้ว', el: 'metal', c: 'text-metal', animal: 'ระกา' },   // 9: ไก่
  { cn: '戌', th: 'สุก', el: 'earth', c: 'text-earth', animal: 'จอ' },      // 10: หมา
  { cn: '亥', th: 'ไห', el: 'water', c: 'text-water', animal: 'กุน' },      // 11: หมู
];

// -----------------------------------------------------------------------------
// จุดตัดสุริยคติ (Solar Term Cutoff Dates)
// ใช้กำหนดว่าก่อนวันที่เท่าไหร่ของเดือนนั้นให้นับเป็นเดือนก่อนหน้า
// index 0 ไม่ใช้ (placeholder), index 1-12 = เดือน ม.ค. - ธ.ค.
// เช่น เดือน 2 (ก.พ.) cutoff = 4 หมายถึง ก่อนวันที่ 4 ก.พ. ยังนับเป็นเดือน ม.ค.
// -----------------------------------------------------------------------------
export const solarCutoffs = [0, 6, 4, 6, 5, 6, 6, 7, 8, 8, 8, 8, 7];

// -----------------------------------------------------------------------------
// ข้อมูลโหงวเฮ้ง (五行面相) ตามธาตุของดิถี (Day Master / แถว A วัน)
// title = ชื่อธาตุแสดงผล, desc = คำอธิบายลักษณะใบหน้า
// imgPrompt = prompt สำหรับ AI (เก็บไว้อ้างอิง ไม่ได้ใช้แล้ว)
// *** ปัจจุบันใช้รูปจากโฟลเดอร์ /bazi/ แทน AI generate ***
// -----------------------------------------------------------------------------
export const faceProfiles = {
  wood: {
    title: 'ธาตุไม้ (กะ/อิก)',
    desc: 'โครงหน้ามักจะยาวเรียว หน้าผากกว้างและสูง จมูกโด่งเป็นสันตรง คิ้วดกดำ รูปร่างโปร่ง แขนขายาว บ่งบอกถึงความเจริญงอกงามและความเมตตา ดั่งต้นไม้ที่พุ่งทะยานสู่ฟ้า',
    imgPrompt:
      'portrait of a beautiful asian person with long slender face high forehead straight nose representing wood element chinese face reading highly detailed',
  },
  fire: {
    title: 'ธาตุไฟ (เปี้ย/เต็ง)',
    desc: 'โครงหน้าค่อนข้างแหลม หรือรูปไข่คางเรียวแหลม โหนกแก้มชัดเจน ดวงตาเป็นประกายสุกใส ผิวพรรณมักจะอมชมพูหรือแดงระเรื่อ บ่งบอกถึงความกระตือรือร้น ร้อนแรง และความฉลาดเฉียบแหลม',
    imgPrompt:
      'portrait of an asian person with pointed chin sharp distinct cheekbones sparkling eyes reddish glow fire element chinese face reading highly detailed',
  },
  earth: {
    title: 'ธาตุดิน (โบ่ว/กี้)',
    desc: 'โครงหน้ามักจะหนา สี่เหลี่ยม หรือกลมแป้น กรามกว้าง ริมฝีปากอิ่มหนา รูปร่างมักจะดูบึกบึน แข็งแรง ผิวออกเหลืองนวล บ่งบอกถึงความหนักแน่น มั่นคง น่าเชื่อถือ และความอดทนสูง',
    imgPrompt:
      'portrait of a strong asian person with square heavy face strong jaw thick lips earth element chinese face reading highly detailed',
  },
  metal: {
    title: 'ธาตุทอง (แก/ซิง)',
    desc: 'โครงหน้ามักจะรูปไข่ หรือวงรีที่สมมาตร ผิวพรรณขาวกระจ่างใส หน้าตาสะอาดสะอ้าน เครื่องหน้าคมชัดกระดูกสวยงาม บ่งบอกถึงความเด็ดขาด ยุติธรรม สง่างาม และมีศักดิ์ศรี',
    imgPrompt:
      'portrait of an elegant asian person with oval symmetrical face fair skin sharp attractive features metal element chinese face reading highly detailed',
  },
  water: {
    title: 'ธาตุน้ำ (ยิ่ม/กุ่ย)',
    desc: 'โครงหน้ามักจะกลม หรืออวบอิ่ม แก้มยุ้ย ดวงตากลมโตและดูลึกซึ้ง ผมเส้นเล็กดกดำ รูปร่างมักจะมีน้ำมีนวล คล่องแคล่ว บ่งบอกถึงความยืดหยุ่น ไหวพริบดี และความลึกซึ้งทางอารมณ์',
    imgPrompt:
      'portrait of a gentle asian person with round chubby face large deep eyes dark hair water element chinese face reading highly detailed',
  },
};

// -----------------------------------------------------------------------------
// คำนวณคะแนนตามกฎธาตุ (五行生剋 - Wu Xing Sheng Ke)
// dayMasterElement = ธาตุดิถี (แถว A วัน), targetElement = ธาตุเป้าหมาย
// คะแนน: +2 = ให้กำลัง, +1 = ธาตุเดียวกัน, -1 = ถูกขโมย, -2 = ถูกข่ม/ข่มเขา
// -----------------------------------------------------------------------------
export function getScore(dayMasterElement, targetElement) {
  const rules = {
    fire: { earth: -2, metal: -2, water: -2, wood: 2, fire: 1 },
    earth: { earth: 1, metal: -2, water: -2, wood: -1, fire: 2 },
    metal: { earth: 2, metal: 1, water: -2, wood: -2, fire: -1 },
    water: { earth: -2, metal: 2, water: 1, wood: -2, fire: -1 },
    wood: { earth: -2, metal: -2, water: 2, wood: 1, fire: -2 },
  };
  return rules[dayMasterElement][targetElement];
}

// -----------------------------------------------------------------------------
// ฟอร์แมตคะแนน - เพิ่มเครื่องหมาย + หน้าคะแนนบวก
// เช่น 2 → "+2", -2 → "-2"
// -----------------------------------------------------------------------------
export function formatScore(score) {
  return score > 0 ? `+${score}` : `${score}`;
}

// -----------------------------------------------------------------------------
// ชื่อเดือนภาษาไทย (index 0 = ว่าง, index 1-12 = ม.ค. - ธ.ค.)
// -----------------------------------------------------------------------------
export const monthNames = [
  '',
  'มกราคม',
  'กุมภาพันธ์',
  'มีนาคม',
  'เมษายน',
  'พฤษภาคม',
  'มิถุนายน',
  'กรกฎาคม',
  'สิงหาคม',
  'กันยายน',
  'ตุลาคม',
  'พฤศจิกายน',
  'ธันวาคม',
];

// =============================================================================
// ฟังก์ชันคำนวณดวงหลัก (calculateBazi)
// รับข้อมูล: วัน, เดือน, ปี พ.ศ., เวลา, เพศ, ชื่อ, นามสกุล
// ส่งกลับ: เสาทั้ง 4 (P), คะแนน (scores), ข้อมูลแสดงผล, โหงวเฮ้ง (face)
// =============================================================================
export function calculateBazi({ day, month, yearBE, time, gender, fname, lname }) {
  // --- แปลงข้อมูล input ---
  const d_input = parseInt(day);        // วันเกิด
  const m_input = parseInt(month);      // เดือนเกิด
  const yearBENum = parseInt(yearBE);   // ปี พ.ศ.
  const h = parseInt(time.split(':')[0]); // ชั่วโมงเกิด (0-23)
  const y_input = yearBENum - 543;      // แปลง พ.ศ. → ค.ศ.

  // --- ระบบข้ามวัน ---
  // ถ้าเกิดตั้งแต่ 23:00 น. ขึ้นไป ให้นับเป็นวันถัดไป (ตามหลักดวงจีน)
  let calcDate = new Date(y_input, m_input - 1, d_input);
  let isCrossedDay = false;
  if (h >= 23) {
    calcDate.setDate(calcDate.getDate() + 1);
    isCrossedDay = true;
  }

  const y = calcDate.getFullYear();   // ปี ค.ศ. หลังปรับข้ามวัน
  const m = calcDate.getMonth() + 1;  // เดือนหลังปรับ
  const d = calcDate.getDate();       // วันหลังปรับ

  // --- คำนวณเสาปี (年柱 - Year Pillar) ---
  // ปีนักษัตรจีนเปลี่ยนวันที่ 28 พ.ย. (ประมาณ)
  let customYear = y;
  if (m === 12 || (m === 11 && d >= 28)) customYear += 1;
  let yS = (customYear - 4) % 10;   // กิ่งฟ้าปี (Stem index 0-9)
  if (yS < 0) yS += 10;
  let yB = (customYear - 4) % 12;   // ก้านดินปี (Branch index 0-11)
  if (yB < 0) yB += 12;

  // --- คำนวณเสาเดือน (月柱 - Month Pillar) ---
  // ปรับปีมาตรฐานสำหรับการคำนวณเดือน (ม.ค.-ต้น ก.พ. นับเป็นปีก่อน)
  let stdYear = y;
  if (m === 1 || (m === 2 && d < 4)) stdYear -= 1;
  let stdYS = (stdYear - 4) % 10;           // กิ่งฟ้าปีมาตรฐาน
  if (stdYS < 0) stdYS += 10;
  let branchIdx = m;                         // เดือนเริ่มต้น
  if (d < solarCutoffs[m]) branchIdx -= 1;   // ถ้าก่อนจุดตัดสุริยคติ → ลดเดือน
  if (branchIdx === 0) branchIdx = 12;       // ม.ค.ก่อน cutoff → เดือน 12
  let mB = branchIdx === 12 ? 0 : branchIdx; // ก้านดินเดือน (Branch index)
  let mS = ((stdYS % 5) * 2 + 2 + ((mB - 2 + 12) % 12)) % 10; // กิ่งฟ้าเดือน (Stem)

  // --- คำนวณเสาวัน (日柱 - Day Pillar) ---
  // ใช้วันอ้างอิง 14 ม.ค. 1973 (ค.ศ.) เป็นจุดเริ่มต้น
  const targetDate = Date.UTC(y, m - 1, d);
  const refDate = Date.UTC(1973, 0, 14);     // วันอ้างอิง
  const diffDays = Math.floor((targetDate - refDate) / 86400000); // จำนวนวันห่าง
  let dS = (6 + (diffDays % 10)) % 10;       // กิ่งฟ้าวัน (Day Stem) ← นี่คือ "แถว A วัน"
  if (dS < 0) dS += 10;
  let dB = (10 + (diffDays % 12)) % 12;      // ก้านดินวัน (Day Branch)
  if (dB < 0) dB += 12;

  // --- คำนวณเสายาม (時柱 - Hour Pillar) ---
  // แบ่งเป็น 12 ยาม (ยามละ 2 ชม.) เริ่มจาก 23:00-01:00 = ยามจื่อ
  let hB = Math.floor((h + 1) / 2) % 12;     // ก้านดินยาม (Hour Branch)
  let hS = ((dS % 5) * 2 + hB) % 10;         // กิ่งฟ้ายาม (Hour Stem)

  // --- รวมเสาทั้ง 4 (四柱 - Four Pillars) ---
  // P = { h: ยาม, d: วัน, m: เดือน, y: ปี }
  // แต่ละเสามี s = กิ่งฟ้า (Stem/แถวบน/แถว A) และ b = ก้านดิน (Branch/แถวล่าง/แถว B)
  const P = {
    h: { s: stems[hS], b: branches[hB] },   // เสายาม (時柱)
    d: { s: stems[dS], b: branches[dB] },   // เสาวัน (日柱) ← ดิถี/Day Master
    m: { s: stems[mS], b: branches[mB] },   // เสาเดือน (月柱)
    y: { s: stems[yS], b: branches[yB] },   // เสาปี (年柱)
  };

  // --- ดิถี (Day Master / 日主) ---
  // ธาตุของกิ่งฟ้าวัน (แถว A วัน) = ธาตุประจำตัวเจ้าชะตา
  const dayMaster = P.d.s.el;

  // --- คำนวณคะแนนธาตุทั้ง 8 ตำแหน่ง ---
  // แถวบน (A = กิ่งฟ้า): ยาม, วัน, เดือน, ปี
  const sAh = getScore(dayMaster, P.h.s.el);  // คะแนน กิ่งฟ้ายาม
  const sAd = getScore(dayMaster, P.d.s.el);  // คะแนน กิ่งฟ้าวัน (ดิถี - ไม่นับรวม)
  const sAm = getScore(dayMaster, P.m.s.el);  // คะแนน กิ่งฟ้าเดือน
  const sAy = getScore(dayMaster, P.y.s.el);  // คะแนน กิ่งฟ้าปี

  // แถวล่าง (B = ก้านดิน): ยาม, วัน, เดือน, ปี
  const sBh = getScore(dayMaster, P.h.b.el);  // คะแนน ก้านดินยาม
  const sBd = getScore(dayMaster, P.d.b.el);  // คะแนน ก้านดินวัน
  const sBm = getScore(dayMaster, P.m.b.el);  // คะแนน ก้านดินเดือน
  const sBy = getScore(dayMaster, P.y.b.el);  // คะแนน ก้านดินปี

  // --- สรุปคะแนน ---
  const sumA = sAh + sAm + sAy;               // รวมแถวบน (ตัดดิถีออก ไม่นับ sAd)
  const sumB = sBh + sBd + sBm + sBy;         // รวมแถวล่าง
  const sumTotal = sumA + sumB;                // รวมทั้งหมด

  // --- ถ่อฮวย (桃花 / Peach Blossom — ดอกท้อ) ---
  // ดูจากก้านดิน (แถว B) ของแต่ละเสา → หาค่าถ่อฮวย
  // กลุ่ม: 寅/午/戌→卯, 亥/卯/未→子, 申/子/辰→酉, 巳/酉/丑→午
  const peachBlossomMap = { 2:3,6:3,10:3, 11:0,3:0,7:0, 8:9,0:9,4:9, 5:6,9:6,1:6 };
  const peachBlossom = {
    h: branches[peachBlossomMap[hB]],  // บริวาร (จากเสาชั่วโมง)
    d: branches[peachBlossomMap[dB]],  // คู่ครอง (จากเสาวัน)
    m: branches[peachBlossomMap[mB]],  // ที่ทำงาน (จากเสาเดือน)
    y: branches[peachBlossomMap[yB]],  // ผู้ใหญ่ (จากเสาปี)
  };

  // --- เทียนอิกกุ้ยนั้ง (天乙贵人 / Noble Star) ---
  // ดูจากกิ่งฟ้าเสาปี (แถว A ปี / yS) → ได้ก้านดิน 2 ตัว
  const nobleStarMap = [[7,1],[0,8],[11,9],[11,9],[1,7],[0,8],[1,7],[2,6],[5,3],[5,3]];
  const nobleStar = nobleStarMap[yS].map(idx => branches[idx]);

  // --- ซาฮะ (三合 / San He / สามประสาน) ---
  // ดูจากก้านดินเสาปี (แถว B ปี / yB) → ได้ก้านดิน 3 ตัว
  const sanHeMap = [[8,0,4],[9,1,5],[10,2,6],[11,3,7],[0,4,8],[1,5,9],[2,6,10],[3,7,11],[4,8,0],[5,9,1],[6,10,2],[7,11,3]];
  const sanHe = sanHeMap[yB].map(idx => branches[idx]);

  // --- เวลาดูดวง (เวลาปัจจุบันตอนกดคำนวณ) ---
  const now = new Date();
  const watchTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

  // --- โหงวเฮ้ง (五行面相) ---
  // เลือกรูปใบหน้าตามธาตุของดิถี (แถว A วัน) จากโฟลเดอร์ /bazi/
  // ชาย: wood.png, fire.png, earth.png, metal.png, water.png
  // หญิง: woodF.png, fireF.png, earthF.png, metalF.png, waterF.png
  const face = faceProfiles[dayMaster];
  const isFemale = gender === 'หญิง';
  const elementImageMap = isFemale
    ? {
        wood: '/bazi/woodF.png',    // ธาตุไม้ (หญิง)
        fire: '/bazi/fireF.png',    // ธาตุไฟ (หญิง)
        earth: '/bazi/earthF.png',  // ธาตุดิน (หญิง)
        metal: '/bazi/metalF.png',  // ธาตุทอง (หญิง)
        water: '/bazi/waterF.png',  // ธาตุน้ำ (หญิง)
      }
    : {
        wood: '/bazi/wood.png',    // ธาตุไม้ (ชาย)
        fire: '/bazi/fire.png',    // ธาตุไฟ (ชาย)
        earth: '/bazi/earth.png',  // ธาตุดิน (ชาย)
        metal: '/bazi/metal.png',  // ธาตุทอง (ชาย)
        water: '/bazi/water.png',  // ธาตุน้ำ (ชาย)
      };
  const imageUrl = elementImageMap[dayMaster] || (isFemale ? '/bazi/earthF.png' : '/bazi/earth.png'); // ค่า default = ธาตุดิน

  // --- ส่งข้อมูลทั้งหมดกลับ ---
  return {
    P,                  // เสาทั้ง 4 (Four Pillars)
    scores: {           // คะแนนธาตุ
      sAh, sAd, sAm, sAy,
      sBh, sBd, sBm, sBy,
      sumA, sumB, sumTotal,
    },
    displayInfo: {      // ข้อมูลแสดงผล
      d_input,
      m_input,
      yearBE: yearBENum,
      time,
      gender,
      fname: fname || '-',
      lname: lname || '-',
      watchTime,
      isCrossedDay,
      crossedDay: isCrossedDay ? d : null,
      crossedMonth: isCrossedDay ? m : null,
      crossedYearBE: isCrossedDay ? y + 543 : null,
    },
    face: {             // ข้อมูลโหงวเฮ้ง (ชื่อ, คำอธิบาย, URL รูป)
      ...face,
      imageUrl,
    },
    dayMaster,          // ธาตุดิถี (wood/fire/earth/metal/water)
    peachBlossom,       // ถ่อฮวย (4 ช่อง: บริวาร/คู่ครอง/ที่ทำงาน/ผู้ใหญ่)
    nobleStar,          // เทียนอิกกุ้ยนั้ง (array 2 ตัว)
    sanHe,              // ซาฮะ (array 3 ตัว)
    pillarsIdx: { hS, hB, dS, dB, mS, mB, yS, yB }, // index กิ่งฟ้า/ก้านดิน (ใช้คำนวณวัยจร)
    calcDate: { y, m, d },  // วันเกิดที่ปรับข้ามวันแล้ว (ค.ศ.) ใช้หา solar term
  };
}
