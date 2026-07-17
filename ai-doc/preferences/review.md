# Review Output Format

## เมื่อไรควรอ่าน

งาน review, recheck, code review, merge readiness check

## ลำดับการตรวจ

Bug → Logic → Side Effects → Maintainability

## หลักการ

- แยก confirmed bug ออกจาก likely risk
- ระบุ file/line ถ้าทำได้
- ไม่ยืนยันเกินหลักฐาน โดยเฉพาะประเด็นที่ยังเป็น static-only risk
- ถ้าถาม merge readiness ต้องจบด้วยสรุปผลชัดเจน

## Output Format

```md
## สรุปผล

พร้อม merge / ยังไม่ควร merge / merge ได้ แต่มีข้อจำกัด

## Critical Issues

- Bug: ...
  - File: `src/...`
  - Impact: ...
  - Suggested fix: ...

## Suggestions / Watchpoints

- ...

## ข้อจำกัด

- Static review only
- ยังไม่ได้ runtime validate
```
