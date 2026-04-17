import { ipcMain, IpcMainInvokeEvent } from "electron";

/**
 * 基础工具
 */
export default abstract class BaseUtils {
    /**
     * 配置
     */
    public declare  config: Record<
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
