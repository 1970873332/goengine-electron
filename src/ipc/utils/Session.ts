import { IpcMainInvokeEvent } from "electron";
import { Stats } from "fs";
import { resolve } from "path";
import BaseUtils from "../Index";
import { IPCSessionMaping } from "../Maps";
import { AppUtils } from "./App";
import { FileUtils } from "./File";

/**
 * 会话工具
 */
export class SessionUtils extends BaseUtils {
    /**
     * 会话文件夹
     */
    public static readonly pathName: string = "Partitions";

    public config: Record<
        string,
        (event: IpcMainInvokeEvent, ...args: any[]) => any
    > = {
        [IPCSessionMaping.obtainAll]: SessionUtils.obtainAll,
    };

    /**
     * 获取所有会话
     */
    public static async obtainAll(
        event: IpcMainInvokeEvent | null,
    ): Promise<string[]> {
        const sessionPath: string = resolve(
                AppUtils.getPath(null, "sessionData"),
                SessionUtils.pathName,
            ),
            stat: Stats = await FileUtils.stat(null, sessionPath);
        if (!stat.isDirectory()) return [];
        return await FileUtils.readdir(null, sessionPath);
    }
    /**
     * 删除会话
     * @param event
     * @param name
     */
    public static async deleteSession(
        event: IpcMainInvokeEvent | null,
        name: string,
    ): Promise<void> {
        const sessionPath: string = resolve(
            AppUtils.getPath(null, "sessionData"),
            SessionUtils.pathName,
        );
        await FileUtils.rmdir(null, resolve(sessionPath, name));
    }
}
