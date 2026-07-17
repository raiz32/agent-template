import { access, mkdir, stat } from 'node:fs/promises'
// ตรวจว่ามี path จริงไหม
// ใช้ access() เพราะเป็น api มาตรฐานของ node.js
export async function pathExists(path: string): Promise<boolean> {
    try {
        await access(path);
        return true;
    } catch (error) {
        return false;
    }
}
// ตรวจสอบ path เป็น directory หรือไม่
export async function isDirectory(path: string): Promise<boolean> {
    try {
        const pathStat = await stat(path);
        return pathStat.isDirectory();
    } catch (error) {
        return false;
    }
}
// ตรวจสอบ path เป็น file หรือไม่
export async function isFile(path: string): Promise<boolean> {
    try {
        const pathStat = await stat(path);
        return pathStat.isFile();
    } catch (error) {
        return false;
    }
}
// สร้าง directory ถ้าไม่มี
export async function ensureDirectory(path: string): Promise<void> {
    await mkdir(path, { recursive: true });
}
