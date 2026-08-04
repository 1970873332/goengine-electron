import { ipcMain, IpcMainInvokeEvent } from "electron";

/**
 * IPC 基类
 */
export default abstract class BaseIPC {
    /**
     * 配置
     */
    declare public config: Record<
        string,
        (event: IpcMainInvokeEvent, ...args: any[]) => any
    >;

    /**
     * 初始化
     */
    public initial(): void {
        Object.keys(this.config).forEach(
            (key) => this.config[key] && ipcMain.handle(key, this.config[key]),
        );
    }
}
