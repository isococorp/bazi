// =============================================================================
// dayunData.js - คำนวณวัยจร (大运 / Da Yun / Major Luck Cycles)
// วัยจร = ถนนชีวิต แบ่งเป็น 10 ช่วง ช่วงละ 10 ปี รวม 100 ปี
// โดย เอก เหมาซาน
// =============================================================================

import { stems, branches, solarCutoffs } from './baziData';

// -----------------------------------------------------------------------------
// หาจำนวนวัน (ห่าง) จากวันเกิดถึง Solar Term ที่ใกล้ที่สุด
// isForward = true  → นับไปข้างหน้า (หา Solar Term ถัดไป)
// isForward = false → นับย้อนหลัง (หา Solar Term ก่อนหน้า)
// -----------------------------------------------------------------------------
function getDaysToSolarTerm(birthDate, isForward) {
  const d  = birthDate.getDate();
  const m  = birthDate.getMonth() + 1; // 1-based
  const y  = birthDate.getFullYear();

  let targetDate;

  if (isForward) {
    // --- หา Solar Term ถัดไป ---
    if (d < solarCutoffs[m]) {
      // ยังไม่ถึง cutoff ของเดือนนี้ → cutoff เดือนนี้คือ "ถัดไป"
      targetDate = new Date(y, m - 1, solarCutoffs[m]);
    } else {
      // ผ่าน cutoff เดือนนี้แล้ว → ไปเดือนหน้า
      const nm = m === 12 ? 1 : m + 1;
      const ny = m === 12 ? y + 1 : y;
      targetDate = new Date(ny, nm - 1, solarCutoffs[nm]);
    }
    return Math.max(0, Math.round((targetDate - birthDate) / 86400000));

  } else {
    // --- หา Solar Term ก่อนหน้า ---
    if (d >= solarCutoffs[m]) {
      // ผ่าน cutoff เดือนนี้แล้ว → cutoff เดือนนี้คือ "ก่อนหน้า"
      targetDate = new Date(y, m - 1, solarCutoffs[m]);
    } else {
      // ยังไม่ถึง cutoff เดือนนี้ → ไปเดือนก่อน
      const pm = m === 1 ? 12 : m - 1;
      const py = m === 1 ? y - 1 : y;
      targetDate = new Date(py, pm - 1, solarCutoffs[pm]);
    }
    return Math.max(0, Math.round((birthDate - targetDate) / 86400000));
  }
}

// =============================================================================
// calculateDayun — ฟังก์ชันหลักคำนวณวัยจร
// -----------------------------------------------------------------------------
// @param gender     - 'ชาย' หรือ 'หญิง'
// @param yearBE     - ปีเกิด พ.ศ. (number)
// @param pillarsIdx - { mS, mB, yS } index กิ่งฟ้า/ก้านดินเสาเดือนและเสาปี
// @param calcDate   - { y, m, d } วันเกิดที่ปรับข้ามวันแล้ว (ค.ศ.)
// @returns {{ cycles, startAge, isForward, direction }}
// =============================================================================
export function calculateDayun(gender, yearBE, pillarsIdx, calcDate) {
  const { mS, mB, yS } = pillarsIdx;
  const { y, m, d } = calcDate;

  // --- ทิศทางวัยจร (顺行 / 逆行) ---
  // กิ่งฟ้าปี Yang (甲丙戊庚壬 = index คู่ 0,2,4,6,8) + ชาย = ก้าวหน้า (顺)
  // กิ่งฟ้าปี Yang + หญิง = ถอยหลัง (逆)
  // กิ่งฟ้าปี Yin (乙丁己辛癸 = index คี่ 1,3,5,7,9) + ชาย = ถอยหลัง (逆)
  // กิ่งฟ้าปี Yin + หญิง = ก้าวหน้า (顺)
  const yearStemIsYang = yS % 2 === 0;
  const isMale = gender === 'ชาย';
  const isForward = (yearStemIsYang && isMale) || (!yearStemIsYang && !isMale);

  // --- วันเกิดสำหรับคำนวณ Solar Term ---
  const birthDate = new Date(y, m - 1, d);

  // --- อายุเริ่มต้น (3 วัน = 1 ปี, ปัดเศษ) ---
  const days = getDaysToSolarTerm(birthDate, isForward);
  const startAge = Math.round(days / 3);

  // --- สร้าง 10 ช่วงวัยจร ---
  // ช่วงแรก: กิ่งฟ้า/ก้านดินถัดจากเสาเดือน (หรือก่อนหน้า ถ้า logicถอยหลัง)
  const cycles = [];
  for (let i = 1; i <= 10; i++) {
    // index กิ่งฟ้า (mod 10) และก้านดิน (mod 12)
    const sIdx = isForward
      ? (mS + i) % 10
      : ((mS - i) % 10 + 10) % 10;
    const bIdx = isForward
      ? (mB + i) % 12
      : ((mB - i) % 12 + 12) % 12;

    const ageStart   = startAge + (i - 1) * 10;
    const ageEnd     = ageStart + 9;
    const yearBEStart = yearBE + ageStart;
    const yearBEEnd   = yearBE + ageEnd;

    cycles.push({
      stem:        stems[sIdx],     // กิ่งฟ้าวัยจร (แถว A)
      branch:      branches[bIdx],  // ก้านดินวัยจร (แถว B)
      ageStart,                     // อายุเริ่มช่วง
      ageEnd,                       // อายุสิ้นสุดช่วง
      yearBEStart,                  // ปี พ.ศ. เริ่มต้น
      yearBEEnd,                    // ปี พ.ศ. สิ้นสุด
    });
  }

  return {
    cycles,
    startAge,
    isForward,
    direction: isForward ? '顺行 (ก้าวหน้า)' : '逆行 (ถอยหลัง)',
  };
}
