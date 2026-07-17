# Handoff Format

## เมื่อไรควรอ่าน

ผู้ใช้ขอไฟล์ handoff, summary for teammate, migration status, task handoff

## หลักการ

- Self-contained — เข้าใจได้แม้ไม่ได้เปิด diff เดิม
- ถ้าเป็น checklist หรือ migration status ให้ sync เอกสารที่เกี่ยวข้องหลังตรวจหรือแก้เสร็จ
- ใส่ fenced code block พร้อม language เสมอ เช่น `js`, `ts`, `vue`, `bash`
- ถ้าเป็น snippet จากไฟล์จริง ให้ใส่ context บน/ล่างประมาณ 3 บรรทัดเพื่อให้เข้าใจตำแหน่งและผลกระทบ

## Output Format

```md
# Handoff: <Task Name>

## Context

ที่มาและวัตถุประสงค์ของงาน

## Files Changed

- `src/...` — อธิบายการเปลี่ยนแปลง

## Important Decisions

ทำไมถึงเลือก approach นี้

## Validation

วิธีตรวจสอบว่าใช้งานได้จริง

## Next Step

งานที่ต้องทำต่อ หรือ pending items
```
