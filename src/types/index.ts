// รายชื่อ command ที่ CLI รองรับ
export type CommandName = "install" | "update" | "doctor" | "uninstall" | "skill";
// ประเภทของ item ที่ต้อง copy
export type CopyItemType = "file" | "directory";
// Option สำหรับ install command
export interface InstallCommandOptions {
    // path project ปลายทาง
    targetPath: string;
    // บังคับ copy เฉพาะ instruction และ documentation
    templateOnly?: boolean;
    // แปลง skill ทั้งหมดใน skills/ เป็น slash command ของแต่ละ agent ทันทีหลัง install
    skill?: boolean;
}
// Option สำหรับ update command
export interface UpdateCommandOptions {
    // path project ปลายทาง
    targetPath: string;
}
// Option สำหรับ doctor command
export interface DoctorCommandOptions {
    // path project ที่ต้องการตรวจสอบ
    targetPath: string;
}
// Option สำหรับ skill command
export interface SkillCommandOptions {
    // path project ปลายทาง
    targetPath: string;
    // ชื่อ skill เดียวที่ต้องการติดตั้ง (ไม่ระบุ = ติดตั้งทุก skill)
    name?: string;
}
export interface CopyItem {
    // path ต้นทาง
    sourcePath: string;
    // path ปลายทาง
    targetPath: string;
    // ประเภทของ item
    type: CopyItemType;
}
// ผลลัพธ์กลางของ command
export interface CommandResult {
    success: boolean;
    message: string;
}
