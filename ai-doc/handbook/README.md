# Technical Handbook

เก็บความรู้เชิงเทคนิคเฉพาะโปรเจกต์ที่ยืนยันจาก source code จริง เพื่อให้ AI
ตรวจผลกระทบและทำงานต่อได้อย่างปลอดภัย ไม่ใช้เป็นที่เก็บ workflow หรือ
preference ของผู้ใช้

## ขอบเขต

- Vue และ Vuetify patterns ที่ใช้จริงในโปรเจกต์
- Shared component contracts เช่น props, emits, slots และ composables
- ผลกระทบก่อนแก้ component, route หรือ API contract
- Known cases ที่ระบุ source, root cause และ minimal fix ได้

## รูปแบบเอกสาร

ทุกหน้าใหม่ต้องระบุ:

1. ใช้เมื่อไร
2. Source of truth: paths หรือ contracts ที่ตรวจแล้ว
3. แนวทางที่แนะนำ
4. Change-impact checklist
5. Static validation และ user-run validation ที่จำเป็น

## วิธีสร้าง Technical Handbook

เมื่อเริ่มใช้ template นี้กับโปรเจกต์จริง ให้ AI ทำตามลำดับนี้ก่อนเขียนเอกสาร:

1. อ่าน `ai-doc/project/README.md` เพื่อรู้ tech stack, services, constraints
   และ pattern files ที่มีอยู่
2. อ่าน source code ที่เกี่ยวข้องและหา pattern เดิมก่อนเสนอแนวทางใหม่
3. Trace การใช้งานจริงของสิ่งที่จะบันทึก เช่น imports, props, emits, slots,
   composables, routes, API contracts และ component ที่เรียกใช้ร่วมกัน
4. เขียน handbook เฉพาะสิ่งที่ยืนยันจาก source code ได้ และแยก generic advice
   ออกไป ไม่บันทึกเป็นกฎเฉพาะโปรเจกต์
5. เพิ่มลิงก์หน้าใหม่ใน `ai-doc/project/README.md` ส่วน `Patterns Index` เพื่อให้
   ค้นพบได้จาก project map

ควรเพิ่มหน้า handbook เมื่อพบ pattern ที่ใช้ซ้ำ, shared component ที่มี contract
สำคัญ, หรือ case ที่แก้ไขแล้วและมี root cause กับ impact ที่ยืนยันได้

## Template สำหรับหน้าใหม่

```md
# <Topic>

## ใช้เมื่อไร

## Source of Truth

- `src/...` — หน้าที่หรือ contract ที่ตรวจแล้ว

## แนวทางที่แนะนำ

## Change-impact Checklist

- [ ] ตรวจ imports และจุดเรียกใช้
- [ ] ตรวจ props, emits, slots หรือ composables ที่เกี่ยวข้อง
- [ ] ตรวจ route และ API contract หาก component ใช้ข้อมูลภายนอก

## Validation

- Static: ...
- User-run: ...
```

## ความสัมพันธ์กับเอกสารอื่น

- `ai-doc/preferences/` สำหรับวิธีทำงานและรูปแบบ output ที่ผู้ใช้ต้องการ
- `ai-doc/project/` สำหรับ tech stack, ข้อจำกัด และแผนที่ของ repo
