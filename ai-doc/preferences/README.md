# Documentation Update Rules

- `ai-doc/preferences/` เก็บ workflow และรูปแบบการทำงานร่วมกับผู้ใช้
- `ai-doc/handbook/` เก็บความรู้เชิงเทคนิคเฉพาะโปรเจกต์ที่ยืนยันจาก source code
- `ai-doc/project/` เก็บ project context, tech stack, และแผนที่ของ repo

## Workflow References

| Document | Use when |
|---|---|
| [review.md](review.md) | Reviewing code or assessing merge readiness |
| [debug.md](debug.md) | Diagnosing an error or unexpected behavior |
| [handoff.md](handoff.md) | Preparing a handoff for a teammate or another AI |
| [testing.md](testing.md) | Writing or changing Playwright tests and `data-testid` |

## Update Rules

- เมื่อพบ Pattern ที่ใช้ซ้ำและยืนยันจากโค้ดจริงแล้ว ให้เสนออัปเดตเอกสารก่อน
- ข้อมูลเฉพาะโปรเจกต์ให้บันทึกใน `ai-doc/project/`
- Workflow หรือสไตล์การทำงานของผู้ใช้ให้บันทึกใน `ai-doc/preferences/`
- ความรู้เชิงเทคนิคที่ยืนยันจาก source code ให้บันทึกใน `ai-doc/handbook/`
- อย่าเพิ่ม rule ลง `AGENTS.md` หากเป็นรายละเอียดที่ใช้ไม่บ่อย ให้เพิ่มเป็น reference แล้วลิงก์จาก `Project References` ส่วนที่ใช้บ่อยให้แนะนำเพื่อให้ผู้ใช้นำไปเพิ่มเอง
