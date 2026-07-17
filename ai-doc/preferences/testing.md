# Testing Guide — Playwright

## เมื่อไรควรอ่าน

เขียนหรือแก้ไข Playwright test, เพิ่ม `data-testid`, หรือ feature มีการเปลี่ยน UI ที่กระทบ test

## Rules

- ห้าม run playwright เอง — เสนอคำสั่งให้ผู้ใช้รันเท่านั้น
- ไม่ยิง API จริง — ใช้ mock/fixture แทนเสมอ

## Checklist ก่อนเขียน Test

- [ ] Component มี `data-testid` ครบในส่วนที่ต้อง test แล้ว
- [ ] ถ้ายังไม่มี ให้เพิ่ม `data-testid` ใน component ก่อน แล้วค่อยเขียน test

## Locator Convention

- ใช้ `data-testid` เป็น locator หลักเสมอ ห้ามใช้ CSS class หรือ element tag
- รูปแบบ: `<feature>-<element>-<type>`
- ตัวอย่าง: `login-submit-button`, `user-email-input`, `product-list-table`

## Test Naming Convention

- รูปแบบชื่อ test: `<FEATURE>-<NN>` (ตัวพิมพ์ใหญ่ย่อชื่อ feature + เลข test case เริ่มที่ 01)
- ใส่ comment อธิบายสิ่งที่ทดสอบไว้บรรทัดบนเสมอ — ช่วยให้หาเคสได้ทันทีเมื่อเกิด error

```ts
// ทดสอบการ login ด้วย username และ password ที่ถูกต้อง
test('LOGIN-01', async ({ page }) => { ... });

// ทดสอบการแสดง error เมื่อรหัสผ่านผิด
test('LOGIN-02', async ({ page }) => { ... });
```

## Test File Structure

```
tests/
  fixtures/
    <feature>.ts        ← mock data สำหรับ feature นั้น
  <feature>/
    <feature>.spec.ts   ← test cases
```

ตัวอย่าง fixture:

```ts
// fixtures/user.ts
export const mockUser = { id: 1, name: 'Test User' };
```

ตัวอย่าง test:

```ts
import { mockUser } from '../fixtures/user';

// ทดสอบการแสดงชื่อ user หลังโหลดข้อมูล
test('USER-01', async ({ page }) => {
  await page.route('**/api/users/1', (route) =>
    route.fulfill({ json: mockUser })
  );
  await page.goto('/user/1');
  await expect(page.getByTestId('user-name-text')).toContainText('Test User');
});
```

## Mock Strategy

- ใช้ Playwright route interception (`page.route(...)`) แทนการยิง API จริง
- กำหนด fixture data แยกไฟล์ต่างหาก อย่า hardcode ใน test file

## เมื่อ Feature เปลี่ยน / Redesign

- [ ] อัปเดต `data-testid` ใน component ก่อน
- [ ] เช็คว่า locator เดิมยังใช้ได้หรือเปล่า ก่อนเขียน test ใหม่
- [ ] อัปเดต fixture ถ้า API response เปลี่ยน
- [ ] อัปเดต test ให้ตรงกับ behavior ใหม่
