import { IpcMainInvokeEvent, shell } from "electron";
import BaseIPC from "../Base";
import { IPCShellMaping } from "../Maps";

/**
 * Shell IPC
 */
export class ShellIPC extends BaseIPC {
    public config: Record<
        string,
        (event: IpcMainInvokeEvent, ...args: any[]) => any
    > = {
        [IPCShellMaping.openPath]: ShellIPC.openPath,
        [IPCShellMaping.showFolder]: ShellIPC.showFolder,
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
