# Debug Workflow

## เมื่อไรควรอ่าน

พบ bug, พฤติกรรมผิดคาด, test fail, build error

## Checklist ก่อนสรุป Root Cause

- [ ] อ่าน error message ครบ ไม่ตัดตอน
- [ ] เช็ค stack trace — ปัญหาอยู่ที่ไหนจริงๆ
- [ ] ตรวจ input ที่เข้ามา ก่อนสรุปว่า logic ผิด
- [ ] เช็คว่า behavior นี้ตั้งใจไว้หรือเปล่า (architecture decision)
- [ ] ถ้าเป็น build error อ่าน `build-error.txt` ทั้งหมดก่อน

## Output Format

- **Root cause** ที่ระบุได้ชัดเจน
- **Evidence** ที่ใช้สรุป (file/line/log)
- **Suggested fix** (minimal change)
- **ข้อจำกัด** ถ้ายังไม่ confirm 100%
