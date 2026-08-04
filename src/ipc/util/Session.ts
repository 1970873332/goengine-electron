import { IpcMainInvokeEvent } from "electron";
import { Stats } from "fs";
import { resolve } from "path";
import BaseIPC from "../Base";
import { IPCSessionMaping } from "../Maps";
import { AppIPC } from "./App";
import { FileIPC } from "./File";

/**
 * 会话IPC
 */
export class SessionIPC extends BaseIPC {
    /**
     * 会话文件夹
     */
    public static readonly pathName: string = "Partitions";

    public config: Record<
        string,
        (event: IpcMainInvokeEvent, ...args: any[]) => any
    > = {
        [IPCSessionMaping.obtainAll]: SessionIPC.obtainAll,
    };

    /**
     * 获取所有会话
     */
    public static async obtainAll(
        event: IpcMainInvokeEvent | null,
    ): Promise<string[]> {
        const sessionPath: string = resolve(
                AppIPC.getPath(null, "sessionData"),
                SessionIPC.pathName,
            ),
            stat: Stats = await FileIPC.stat(null, sessionPath);
        if (!stat.isDirectory()) return [];
        return await FileIPC.readdir(null, sessionPath);
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
            AppIPC.getPath(null, "sessionData"),
            SessionIPC.pathName,
        );
        await FileIPC.rmdir(null, resolve(sessionPath, name));
    }
}
