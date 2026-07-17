// รายชื่อ command ที่ CLI รองรับ
export type CommandName = "install" | "update" | "doctor" | "uninstall";
// ประเภทของ item ที่ต้อง copy
export type CopyItemType = "file" | "directory";
// Option สำหรับ install command
export interface InstallCommandOptions {
    // path project ปลายทาง
    targetPath: string;
    // copy เฉพาะ template ที่ไม่ต้องใช้ package.json
    templateOnly?: boolean;
}
// Option สำหรับ update command
export interface UpdateCommandOptions {
    // path project ปลายทาง
    targetPath: string;
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
