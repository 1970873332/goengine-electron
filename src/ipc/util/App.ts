import { app, IpcMainInvokeEvent } from "electron";
import BaseIPC from "../Base";
import { AppIPCMaping } from "../Maps";

/**
 * 应用IPC
 */
export class AppIPC extends BaseIPC {
    public config: Record<
        string,
        (event: IpcMainInvokeEvent, ...args: any[]) => any
    > = {
        [AppIPCMaping.getPath]: AppIPC.getPath,
        [AppIPCMaping.getAppPath]: AppIPC.getAppPath,
        [AppIPCMaping.getAllPath]: AppIPC.getAllPath,
    };

    /**
     * 获取所有路径
     * @param event
     * @returns
     */
    public static getAllPath(event: IpcMainInvokeEvent | null): TAllPath {
        return {
            appPath: app.getAppPath(),
            home: app.getPath("home"),
            appData: app.getPath("appData"),
            userData: app.getPath("userData"),
            sessionData: app.getPath("sessionData"),
            temp: app.getPath("temp"),
            exe: app.getPath("exe"),
            module: app.getPath("module"),
            desktop: app.getPath("desktop"),
            documents: app.getPath("documents"),
            downloads: app.getPath("downloads"),
            music: app.getPath("music"),
            pictures: app.getPath("pictures"),
            videos: app.getPath("videos"),
            recent: app.getPath("recent"),
            logs: app.getPath("logs"),
            crashDumps: app.getPath("crashDumps"),
        };
    }
    /**
     * 获取应用路径
     * @param event
     * @returns
     */
    public static getAppPath(event: IpcMainInvokeEvent | null): string {
        return app.getAppPath();
    }
    /**
     * 获取路径
     * @param event
     * @param path
     * @returns
     */
    public static getPath(
        event: IpcMainInvokeEvent | null,
        path: TPathName,
    ): string {
        return app.getPath(path);
    }
}

type TAllPath = Record<TPathName, string> & { appPath: string };

type TPathName =
    | "home"
    | "appData"
    | "userData"
    | "sessionData"
    | "temp"
    | "exe"
    | "module"
    | "desktop"
    | "documents"
    | "downloads"
    | "music"
    | "pictures"
    | "videos"
    | "recent"
    | "logs"
    | "crashDumps";

export { TAllPath as AppIPCAllPath, TPathName as AppIPCPathName };
