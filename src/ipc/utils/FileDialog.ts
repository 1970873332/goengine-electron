import {
    dialog,
    IpcMainInvokeEvent,
    OpenDialogOptions,
    SaveDialogOptions,
} from "electron";
import BaseUtils from "../Index";
import { IPCFileDialogMaping } from "../Maps";

/**
 *  文件对话框工具
 */
export class FileDialogUtils extends BaseUtils {
    public config: Record<
        string,
        (event: IpcMainInvokeEvent, ...args: any[]) => any
    > = {
        [IPCFileDialogMaping.saveFile]: FileDialogUtils.showFileSave,
        [IPCFileDialogMaping.openFile]: FileDialogUtils.showFileOpen,
        [IPCFileDialogMaping.openDir]: FileDialogUtils.showFileOpenDir,
    };

    /**
     * 选择文件
     * @param event
     * @param options
     * @returns
     */
    public static async showFileOpen(
        event: IpcMainInvokeEvent,
        options?: OpenDialogOptions,
    ): Promise<string[]> {
        const { canceled, filePaths } = await dialog.showOpenDialog(
            options ?? {},
        );
        if (!canceled) return filePaths;
        return [];
    }
    /**
     * 选择文件夹
     * @param event
     * @param options
     * @returns
     */
    public static async showFileOpenDir(
        event: IpcMainInvokeEvent,
        options?: OpenDialogOptions,
    ): Promise<string> {
        const { properties = ["openDirectory"], ...Rest } = options ?? {};
        const [dirResult] = await FileDialogUtils.showFileOpen(event, {
            properties,
            ...Rest,
        });
        return dirResult;
    }
    /**
     * 保存文件
     * @param event
     * @param options
     * @returns
     */
    public static async showFileSave(
        event: IpcMainInvokeEvent,
        options?: SaveDialogOptions,
    ): Promise<string> {
        const { canceled, filePath } = await dialog.showSaveDialog(
            options ?? {},
        );
        if (!canceled) return filePath;
        return "";
    }
}
