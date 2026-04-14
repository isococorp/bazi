// =============================================================================
// page.js - หน้าหลักโปรแกรมผูกดวงจีน โป๊ยยี่
// Next.js Client Component สำหรับแสดงฟอร์มกรอกข้อมูลและผลลัพธ์ดวงชะตา
// =============================================================================
'use client';

import { useState, useEffect } from 'react';
import { calculateBazi, formatScore, monthNames } from './lib/baziData';
import { calculateDayun } from './lib/dayunData';

export default function Home() {
  // --- State: ข้อมูลฟอร์ม ---
  const [form, setForm] = useState({
    fname: '',       // ชื่อ
    lname: '',       // นามสกุล
    day: '',         // วันเกิด (1-31)
    month: '1',      // เดือนเกิด (1-12)
    yearBE: '',      // ปีเกิด พ.ศ. (2400-2600)
    time: '',        // เวลาเกิด (HH:MM แบบ 24 ชม.)
    gender: 'ชาย',   // เพศ
  });

  // --- State: ผลลัพธ์การคำนวณดวง ---
  const [result, setResult] = useState(null);

  // --- State: ผลลัพธ์วัยจร (大运) ---
  const [dayun, setDayun] = useState(null);

  // --- State: ข้อผิดพลาดจากการ validate ---
  const [errors, setErrors] = useState({});

  // --- ตั้งค่าเวลาปัจจุบันตอนโหลดหน้า (ให้สะดวกในการทดสอบ) ---
  useEffect(() => {
    const now = new Date();
    setForm((prev) => ({
      ...prev,
      day: String(now.getDate()),
      month: String(now.getMonth() + 1),
      yearBE: String(now.getFullYear() + 543),
      time: `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`,
    }));
  }, []);

  // --- จัดการเมื่อผู้ใช้พิมพ์ในฟอร์ม ---
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    // ล้าง error ของช่องนั้นทันทีเมื่อผู้ใช้พิมพ์ใหม่
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  // --- จัดการช่องเวลา: รับเฉพาะตัวเลข แล้วใส่ : อัตโนมัติ ---
  const handleTimeChange = (e) => {
    const digits = e.target.value.replace(/\D/g, '').slice(0, 4);
    const formatted = digits.length > 2 ? digits.slice(0, 2) + ':' + digits.slice(2) : digits;
    setForm({ ...form, time: formatted });
    if (errors.time) {
      setErrors((prev) => ({ ...prev, time: '' }));
    }
  };

  // --- ตรวจสอบรูปแบบเวลา 24 ชม. (00:00 - 23:59) ---
  const validateTime = (timeStr) => {
    if (!timeStr) return 'กรุณากรอกเวลาเกิด';
    const match = timeStr.match(/^(\d{1,2}):(\d{2})$/);
    if (!match) return 'รูปแบบเวลาไม่ถูกต้อง (ใช้ ชม:นาที เช่น 14:30)';
    const hh = parseInt(match[1]);
    const mm = parseInt(match[2]);
    if (hh < 0 || hh > 23) return 'ชั่วโมงต้องอยู่ระหว่าง 00-23';
    if (mm < 0 || mm > 59) return 'นาทีต้องอยู่ระหว่าง 00-59';
    return ''; // ผ่าน = ไม่มี error
  };

  // --- ตรวจสอบข้อมูลทั้งหมดก่อนคำนวณ ---
  const validate = () => {
    const newErrors = {};
    const dayNum = parseInt(form.day);
    const yearNum = parseInt(form.yearBE);

    // ตรวจวันเกิด
    if (!form.day || isNaN(dayNum) || dayNum < 1 || dayNum > 31) {
      newErrors.day = 'วันเกิดต้องอยู่ระหว่าง 1-31';
    }
    // ตรวจปีเกิด พ.ศ.
    if (!form.yearBE || isNaN(yearNum) || yearNum < 2400 || yearNum > 2600) {
      newErrors.yearBE = 'ปี พ.ศ. ต้องอยู่ระหว่าง 2400-2600';
    }
    // ตรวจเวลาเกิด
    const timeError = validateTime(form.time);
    if (timeError) newErrors.time = timeError;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // true = ไม่มี error
  };

  // --- กดปุ่ม "คำนวณดวงชะตา" ---
  const handleCalculate = () => {
    if (!validate()) return;          // ถ้า validate ไม่ผ่าน → หยุด
    const data = calculateBazi(form); // คำนวณดวงจาก baziData.js
    setResult(data);                  // เก็บผลลัพธ์ → แสดงผล
    // คำนวณวัยจร (大运) จาก pillarsIdx + calcDate ที่ได้จาก calculateBazi
    const dayunData = calculateDayun(
      form.gender,
      parseInt(form.yearBE),
      data.pillarsIdx,
      data.calcDate,
    );
    setDayun(dayunData);
  };

  // --- กดปุ่ม "พิมพ์" ---
  const handlePrint = () => {
    window.print();
  };

  // =========================================================================
  // ส่วนแสดงผล (JSX)
  // =========================================================================
  return (
    <div className="container">
      {/* ชื่อโปรแกรม */}
      <h2>โปรแกรมผูกดวงจีน โป๊ยยี่ โดย เอก เหมาซาน</h2>

      {/* ============================================================= */}
      {/* ฟอร์มกรอกข้อมูล (Grid 2 คอลัมน์) */}
      {/* ============================================================= */}
      <div className="grid-form">
        {/* ชื่อ */}
        <div className="form-group">
          <label>ชื่อ:</label>
          <input
            type="text"
            name="fname"
            placeholder="กรอกชื่อ"
            value={form.fname}
            onChange={handleChange}
          />
        </div>
        {/* นามสกุล */}
        <div className="form-group">
          <label>นามสกุล:</label>
          <input
            type="text"
            name="lname"
            placeholder="กรอกนามสกุล"
            value={form.lname}
            onChange={handleChange}
          />
        </div>
        {/* วันเกิด */}
        <div className="form-group">
          <label>วันเกิด:</label>
          <input
            type="number"
            name="day"
            min="1"
            max="31"
            value={form.day}
            onChange={handleChange}
            className={errors.day ? 'input-error' : ''}
          />
          {errors.day && <span className="error-msg">{errors.day}</span>}
        </div>
        {/* เดือนเกิด */}
        <div className="form-group">
          <label>เดือนเกิด:</label>
          <select name="month" value={form.month} onChange={handleChange}>
            <option value="1">มกราคม</option>
            <option value="2">กุมภาพันธ์</option>
            <option value="3">มีนาคม</option>
            <option value="4">เมษายน</option>
            <option value="5">พฤษภาคม</option>
            <option value="6">มิถุนายน</option>
            <option value="7">กรกฎาคม</option>
            <option value="8">สิงหาคม</option>
            <option value="9">กันยายน</option>
            <option value="10">ตุลาคม</option>
            <option value="11">พฤศจิกายน</option>
            <option value="12">ธันวาคม</option>
          </select>
        </div>
        {/* ปีเกิด พ.ศ. */}
        <div className="form-group">
          <label>ปีเกิด (พ.ศ.):</label>
          <input
            type="number"
            name="yearBE"
            value={form.yearBE}
            onChange={handleChange}
            className={errors.yearBE ? 'input-error' : ''}
          />
          {errors.yearBE && <span className="error-msg">{errors.yearBE}</span>}
        </div>
        {/* เวลาเกิด */}
        <div className="form-group">
          <label>เวลาเกิด (24 ชม.):</label>
          <input
            type="text"
            name="time"
            placeholder="เช่น 0830 หรือ 1400"
            maxLength={5}
            value={form.time}
            onChange={handleTimeChange}
            className={errors.time ? 'input-error' : ''}
          />
          {errors.time && <span className="error-msg">{errors.time}</span>}
        </div>
        {/* เพศ (เต็มความกว้าง) */}
        <div className="form-group full-width">
          <label>เพศ:</label>
          <select name="gender" value={form.gender} onChange={handleChange}>
            <option value="ชาย">ชาย</option>
            <option value="หญิง">หญิง</option>
          </select>
        </div>
      </div>

      {/* ============================================================= */}
      {/* ปุ่มคำนวณและพิมพ์ */}
      {/* ============================================================= */}
      <div className="btn-group">
        <button className="btn-calc" onClick={handleCalculate}>
          คำนวณดวงชะตา (บันทึกอัตโนมัติ)
        </button>
        <button className="btn-print" onClick={handlePrint}>
          พิมพ์ (Print / PDF)
        </button>
      </div>

      {/* ============================================================= */}
      {/* ส่วนแสดงผลลัพธ์ (แสดงเมื่อกดคำนวณแล้ว) */}
      {/* ============================================================= */}
      {result && (
        <div className="result-container">

          {/* --- ข้อมูลผู้ใช้ (วันเดือนปีเกิด, เวลา, เพศ, ชื่อ) --- */}
          <div className="user-info">
            วัน/เดือน/ปีเกิด: {result.displayInfo.d_input}{' '}
            {monthNames[result.displayInfo.m_input]} พ.ศ.{' '}
            {result.displayInfo.yearBE} | เวลาเกิด: {result.displayInfo.time} น.
            <br />
            เพศ: {result.displayInfo.gender} | ชื่อ: {result.displayInfo.fname} |
            นามสกุล: {result.displayInfo.lname} | เวลาดูดวง:{' '}
            {result.displayInfo.watchTime} น.
            {/* แสดงข้อความข้ามวัน ถ้าเกิดหลัง 23:00 น. */}
            {result.displayInfo.isCrossedDay && (
              <>
                <br />
                <span style={{ color: '#ff3333', fontSize: '14px' }}>
                  (ปรับฐานดวงข้ามวัน 23.00 น. เป็นวันที่:{' '}
                  {result.displayInfo.crossedDay}{' '}
                  {monthNames[result.displayInfo.crossedMonth]}{' '}
                  {result.displayInfo.crossedYearBE})
                </span>
              </>
            )}
          </div>

          {/* --- ตารางดวง 4 เสา (四柱) --- */}
          {/* แสดงเป็น Grid 4 คอลัมน์: ยาม | วัน | เดือน | ปี */}
          <div className="bazi-grid">

            {/* === แถว header: ยาม | วัน | เดือน | ปี === */}
            <div className="bazi-col-header">ยาม</div>
            <div className="bazi-col-header">วัน</div>
            <div className="bazi-col-header">เดือน</div>
            <div className="bazi-col-header">ปี</div>

            {/* === แถวบน: กิ่งฟ้า (天干 / Heavenly Stems / แถว A) === */}

            {/* เสายาม (時柱) - กิ่งฟ้า */}
            <div className="bazi-cell">
              <span className={`char-cn ${result.P.h.s.c}`}>{result.P.h.s.cn}</span>
              <span className="char-th-score">
                {result.P.h.s.th} ( {formatScore(result.scores.sAh)} )
              </span>
            </div>
            {/* เสาวัน (日柱) - กิ่งฟ้า ← ดิถี/Day Master (สีจาง = ไม่นับคะแนน) */}
            <div className="bazi-cell">
              <span className={`char-cn ${result.P.d.s.c}`}>{result.P.d.s.cn}</span>
              <span className="char-th-score dimmed">
                {result.P.d.s.th} ( {formatScore(result.scores.sAd)} )
              </span>
            </div>
            {/* เสาเดือน (月柱) - กิ่งฟ้า */}
            <div className="bazi-cell">
              <span className={`char-cn ${result.P.m.s.c}`}>{result.P.m.s.cn}</span>
              <span className="char-th-score">
                {result.P.m.s.th} ( {formatScore(result.scores.sAm)} )
              </span>
            </div>
            {/* เสาปี (年柱) - กิ่งฟ้า */}
            <div className="bazi-cell">
              <span className={`char-cn ${result.P.y.s.c}`}>{result.P.y.s.cn}</span>
              <span className="char-th-score">
                {result.P.y.s.th} ( {formatScore(result.scores.sAy)} )
              </span>
            </div>

            {/* === แถวล่าง: ก้านดิน (地支 / Earthly Branches / แถว B) === */}

            {/* เสายาม - ก้านดิน + สัตว์นักษัตร */}
            <div className="bazi-cell">
              <span className={`char-cn ${result.P.h.b.c}`}>{result.P.h.b.cn}</span>
              <span className="char-th-score">
                {result.P.h.b.th} ( {formatScore(result.scores.sBh)} )
              </span>
              <span className="char-animal">{result.P.h.b.animal}</span>
            </div>
            {/* เสาวัน - ก้านดิน */}
            <div className="bazi-cell">
              <span className={`char-cn ${result.P.d.b.c}`}>{result.P.d.b.cn}</span>
              <span className="char-th-score">
                {result.P.d.b.th} ( {formatScore(result.scores.sBd)} )
              </span>
              <span className="char-animal">{result.P.d.b.animal}</span>
            </div>
            {/* เสาเดือน - ก้านดิน */}
            <div className="bazi-cell">
              <span className={`char-cn ${result.P.m.b.c}`}>{result.P.m.b.cn}</span>
              <span className="char-th-score">
                {result.P.m.b.th} ( {formatScore(result.scores.sBm)} )
              </span>
              <span className="char-animal">{result.P.m.b.animal}</span>
            </div>
            {/* เสาปี - ก้านดิน */}
            <div className="bazi-cell">
              <span className={`char-cn ${result.P.y.b.c}`}>{result.P.y.b.cn}</span>
              <span className="char-th-score">
                {result.P.y.b.th} ( {formatScore(result.scores.sBy)} )
              </span>
              <span className="char-animal">{result.P.y.b.animal}</span>
            </div>

            {/* === แถว ถ่อฮวย (桃花 / Peach Blossom) === */}

            {/* label คั่นแถว (span 4 คอลัมน์) */}
            <div className="bazi-section-label">ถ่อฮวย (桃花)</div>

            {/* เสายาม → บริวาร */}
            <div className="bazi-cell-sm">
              <span className="bazi-cell-sm-label">บริวาร</span>
              <span className={`char-cn-sm ${result.peachBlossom.h.c}`}>{result.peachBlossom.h.cn}</span>
              <span className="char-th-score">{result.peachBlossom.h.th}</span>
              <span className="char-animal">{result.peachBlossom.h.animal}</span>
            </div>
            {/* เสาวัน → คู่ครอง */}
            <div className="bazi-cell-sm">
              <span className="bazi-cell-sm-label">คู่ครอง</span>
              <span className={`char-cn-sm ${result.peachBlossom.d.c}`}>{result.peachBlossom.d.cn}</span>
              <span className="char-th-score">{result.peachBlossom.d.th}</span>
              <span className="char-animal">{result.peachBlossom.d.animal}</span>
            </div>
            {/* เสาเดือน → ที่ทำงาน */}
            <div className="bazi-cell-sm">
              <span className="bazi-cell-sm-label">ที่ทำงาน</span>
              <span className={`char-cn-sm ${result.peachBlossom.m.c}`}>{result.peachBlossom.m.cn}</span>
              <span className="char-th-score">{result.peachBlossom.m.th}</span>
              <span className="char-animal">{result.peachBlossom.m.animal}</span>
            </div>
            {/* เสาปี → ผู้ใหญ่ */}
            <div className="bazi-cell-sm">
              <span className="bazi-cell-sm-label">ผู้ใหญ่</span>
              <span className={`char-cn-sm ${result.peachBlossom.y.c}`}>{result.peachBlossom.y.cn}</span>
              <span className="char-th-score">{result.peachBlossom.y.th}</span>
              <span className="char-animal">{result.peachBlossom.y.animal}</span>
            </div>
          </div>

          {/* --- เทียนอิกกุ้ยนั้ง (天乙贵人 / Noble Star) --- */}
          {/* ดูจากกิ่งฟ้าเสาปี → ได้ก้านดิน 2 ตัว */}
          <div className="special-info-box">
            <span className="special-info-title">เทียนอิกกุ้ยนั้ง 天乙贵人<br />(ดูจากกิ่งฟ้าปี: {result.P.y.s.cn} {result.P.y.s.th})</span>
            <div className="special-info-items">
              {result.nobleStar.map((b, i) => (
                <div key={i} className="special-info-item">
                  <span className={`char-cn-sm ${b.c}`}>{b.cn}</span>
                  <span className="char-th-score">{b.th}</span>
                  <span className="special-info-item-sub">{b.animal}</span>
                </div>
              ))}
            </div>
          </div>

          {/* --- ซาฮะ (三合 / San He / สามประสาน) --- */}
          {/* ดูจากก้านดินเสาปี → ได้ก้านดิน 3 ตัว */}
          <div className="special-info-box">
            <span className="special-info-title">ซาฮะ 三合<br />(ดูจากก้านดินปี: {result.P.y.b.cn} {result.P.y.b.th} {result.P.y.b.animal})</span>
            <div className="special-info-items">
              {result.sanHe.map((b, i) => (
                <div key={i} className="special-info-item">
                  <span className={`char-cn-sm ${b.c}`}>{b.cn}</span>
                  <span className="char-th-score">{b.th}</span>
                  <span className="special-info-item-sub">{b.animal}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ============================================================= */}
          {/* วัยจร (大运 / Da Yun) — 10 ช่วง ช่วงละ 10 ปี             */}
          {/* ============================================================= */}
          {dayun && (
            <div className="dayun-wrapper">
              {/* หัวข้อ + ทิศทาง + อายุเริ่มต้น */}
              <div className="dayun-header">
                <span className="dayun-title">วัยจร 大运</span>
                <span className="dayun-subtitle">
                  {dayun.direction} · เริ่มอายุ {dayun.startAge} ปี
                </span>
              </div>

              <div className="dayun-grid">

                {/* === แถว A: กิ่งฟ้าวัยจร (Heavenly Stems) === */}
                {[...dayun.cycles].reverse().map((c, i) => (
                  <div key={`s-${i}`} className="dayun-cell">
                    <span className={`char-cn-sm ${c.stem.c}`}>{c.stem.cn}</span>
                    <span className="char-th-score">{c.stem.th}</span>
                  </div>
                ))}

                {/* === แถว B: ก้านดินวัยจร (Earthly Branches) === */}
                {[...dayun.cycles].reverse().map((c, i) => (
                  <div key={`b-${i}`} className="dayun-cell">
                    <span className={`char-cn-sm ${c.branch.c}`}>{c.branch.cn}</span>
                    <span className="char-th-score">{c.branch.th}</span>
                    <span className="char-animal">{c.branch.animal}</span>
                  </div>
                ))}

                {/* === แถวอายุ/ปี พ.ศ. === */}
                {[...dayun.cycles].reverse().map((c, i) => (
                  <div key={`age-${i}`} className="dayun-cell-age">
                    <span className="dayun-age-range">{c.ageStart}–{c.ageEnd}</span>
                    <span className="dayun-year-range">พ.ศ. {c.yearBEStart}</span>
                  </div>
                ))}

              </div>
            </div>
          )}

          {/* --- สรุปผลรวมคะแนน --- */}
          {/* รวมบน = กิ่งฟ้า (ตัดดิถี), รวมล่าง = ก้านดิน, รวมทั้งหมด */}
          <div className="summary-box">
            <span>
              รวมบน (ตัดดิถี):{' '}
              <strong>{result.scores.sumA}</strong>
            </span>
            <span>
              รวมล่าง: <strong>{result.scores.sumB}</strong>
            </span>
            <span>
              รวมทั้งหมด:{' '}
              <strong className="total-value">{result.scores.sumTotal}</strong>
            </span>
          </div>

          {/* --- โหงวเฮ้ง (五行面相) --- */}
          {/* แสดงรูปใบหน้าตามธาตุของแถว A วัน (dayMaster) */}
          {/* รูปอยู่ใน /public/bazi/ → earth.png, fire.png, metal.png, water.png, wood.png */}
          <div className="face-profile">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={result.face.imageUrl} alt={`โหงวเฮ้ง ${result.face.title}`} />
            <div className="face-info">
              <h3>วิเคราะห์โหงวเฮ้งคน {result.face.title}</h3>
              <p>{result.face.desc}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
