# Workflow

ก่อนเริ่มแก้ไขโค้ดหรือเพิ่ม Feature ให้ดำเนินการตามลำดับดังนี้

## 1. Plan

- วิเคราะห์ Requirement และทำความเข้าใจปัญหาก่อนเริ่มลงมือ
- ระบุไฟล์หรือ Module ที่เกี่ยวข้อง
- อธิบายแนวทางการแก้ไขแบบสั้น ๆ
- ให้สร้าง Mermaid Flowchart โดยใช้ `flowchart TD` เป็นค่าเริ่มต้น หรือ `flowchart LR` หากอ่านลำดับซ้ายไปขวาง่ายกว่า

---

## 2. Todo List

- สร้างรายการงานที่ต้องดำเนินการทั้งหมดก่อนเริ่มแก้ไข
- แบ่งงานเป็นขั้นตอนที่ชัดเจน
- อัปเดตสถานะของแต่ละรายการเมื่อดำเนินการเสร็จ
- หากพบงานใหม่ระหว่างดำเนินการ ให้เพิ่มเข้า Todo List ก่อนลงมือทำ

---

## 3. Execute

- ดำเนินการตามแผนและลำดับของ Todo List
- ใช้ Pattern, Component, Utility หรือ Function เดิมของโปรเจกต์ก่อนสร้างใหม่
- แก้ไขเฉพาะส่วนที่จำเป็น (Minimal Change)
- ตรวจสอบผลกระทบต่อส่วนอื่นของระบบทุกครั้ง
- หากข้อมูลไม่เพียงพอหรือมีความกำกวม ให้สอบถามก่อนดำเนินการต่อ

---

## 4. Summary

เมื่อดำเนินการเสร็จ ให้สรุปผลการทำงานประกอบด้วย

- สิ่งที่แก้ไข
- ไฟล์ที่มีการเปลี่ยนแปลง
- เหตุผลหรือแนวทางที่เลือกใช้
- ผลกระทบที่พบ (ถ้ามี)
- สิ่งที่ควรดำเนินการต่อ หรือข้อเสนอแนะเพิ่มเติม (ถ้ามี)

# 1.Coding Standards

## JavaScript

- ใช้ Optional Chaining (`?.`) เมื่อต้องเข้าถึง Object หรือ Property ที่อาจเป็น `null` หรือ `undefined`

## Naming Convention

- Variable: `camelCase`
- Component/Class: `PascalCase`
- Convention อื่น (composable, function prefix, constant file) ดูที่ `ai-doc/project/README.md`

## Comment

- ใช้ // สำหรับ Comment
- หลีกเลี่ยง Comment ที่อธิบาย Syntax หรือ โค้ดที่เข้าใจได้อยู่แล้ว
- เขียน Comment เฉพาะ Business Logic, Workaround หรือข้อจำกัดระบบ, Legacy , Function Summary (ที่มี Logic ซับซ้อน), Section Comment บน template

## Testing

- หากโปรเจกต์มี UI: ทุก interactive element ที่ใช้ตรวจผลลัพธ์การทดสอบควรมี stable test locator ตาม convention ที่ระบุไว้ใน `ai-doc/project/README.md`
- Tool และรูปแบบ locator (เช่น `data-testid`, รูปแบบ `<feature>-<element>-<type>`) ดูที่ `ai-doc/project/README.md`

---

# 2. Folder & Module Structure

- จัดกลุ่มโค้ดตาม feature/domain: โค้ดที่ใช้เฉพาะ feature ให้อยู่กับ feature นั้น
- โค้ดที่ใช้ร่วมหลาย feature ให้แยกไว้ใน shared layer (เช่น utils, shared composables/services)
- โครงสร้าง folder จริงของโปรเจกต์นี้ ดูที่ `ai-doc/project/README.md`

---

# 3. Command Safety

- แก้ไขเฉพาะ Scope งาน หลีกเลี่ยงการ Refactor ที่ไม่เกี่ยวข้อง
- หากจำเป็นต้องเปลี่ยน Architecture, Pattern หรือ Business Logic ให้ขอคำยืนยันก่อน
- ห้าม run script ใน `package.json` เองให้เสนอคำสั่งให้ผู้ใช้รันเท่านั้น ยกเว้น `build:check`
- ตรวจ build ด้วย `build:check` เท่านั้น:
  - `BUILD PASS` = ผ่าน ไม่ต้องอ่านไฟล์เพิ่ม
  - `BUILD FAIL` = อ่าน `build-error.txt` เฉพาะตอน fail

# 4. Project References

| Document | Description |
|----------|-------------|
| [ai-doc/preferences/user-preferences.md](ai-doc/preferences/user-preferences.md) | Preference และ mindset การทำงานร่วมกับผู้ใช้ |
| [ai-doc/preferences/review.md](ai-doc/preferences/review.md) | Format สำหรับงาน review และ merge readiness |
| [ai-doc/preferences/handoff.md](ai-doc/preferences/handoff.md) | Template สำหรับเอกสาร handoff |
| [ai-doc/preferences/debug.md](ai-doc/preferences/debug.md) | Checklist และ workflow สำหรับ debug |
| [ai-doc/preferences/testing.md](ai-doc/preferences/testing.md) | Playwright testing strategy |
| [ai-doc/handbook/README.md](ai-doc/handbook/README.md) | Technical knowledge verified from this project's source code |
| [ai-doc/project/README.md](ai-doc/project/README.md) | Tech stack, naming/folder/testing convention, patterns index เฉพาะโปรเจกต์นี้ |
