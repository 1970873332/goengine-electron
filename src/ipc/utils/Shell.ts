import { IpcMainInvokeEvent, shell } from "electron";
import BaseUtils from "../Index";
import { IPCShellMaping } from "../Maps";

/**
 * Shell 工具类
 */
export class ShellUtils extends BaseUtils {
    public config: Record<
        string,
        (event: IpcMainInvokeEvent, ...args: any[]) => any
    > = {
        [IPCShellMaping.openPath]: ShellUtils.openPath,
        [IPCShellMaping.showFolder]: ShellUtils.showFolder,
    };

    /**
     * 显示文件
     * @param event
     * @param path
     */
    public static async showFolder(
        event: IpcMainInvokeEvent | null,
        path: string,
    ): Promise<void> {
        shell.showItemInFolder(path);
    }
    /**
     * 打开路径
     * @param event
     * @param url
     */
    public static async openPath(
        event: IpcMainInvokeEvent | null,
        url: string,
    ): Promise<string> {
        return await shell.openPath(url);
    }
}
