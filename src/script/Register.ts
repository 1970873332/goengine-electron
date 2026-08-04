import { app, BrowserWindow, ipcMain, IpcMainEvent, Menu } from "electron";
import BaseIPC from "../ipc/Base";
import { WindowIPC } from "../ipc/util/Window";
import WebViewManager from "../manager/WebView";
import { BrowserUtils } from "../util/Browser";
import { WindowUtils } from "../util/Window";

export default class Register {
    /**
     * 初始化
     * @param ipcs
     */
    public static initial(ipcs: Array<new () => BaseIPC>): void {
        Menu.setApplicationMenu(null);
        ipcs.forEach((ipc) => new ipc().initial());
    }

    /**
     * 注册
     * @param url
     */
    public static async register(url: string): Promise<number> {
        await app.whenReady();
        return await WindowIPC.openBrowserWindow(null, url, {
            size: "large",
            partition: "",
            preload: true,
            trustCertificate: true,
            webPreferences: {
                devTools: !app.isPackaged,
            },
        });
    }

    /**
     * 添加事件
     * @param path
     */
    public static addEvent(path: string, id: number): void {
        ipcMain.on("message", (event: IpcMainEvent | null, ...args: any[]) => {
            const [channel, ...data] = args;
            if (event) {
                if (channel === "close-window") {
                    const window = BrowserWindow.fromWebContents(event.sender);
                    return window?.close();
                }
                if (channel === "minimize-window") {
                    const window = BrowserWindow.fromWebContents(event.sender);
                    return window?.minimize();
                }
                if (channel === "maximize-window") {
                    const window = BrowserWindow.fromWebContents(event.sender);
                    return window?.maximize();
                }
                if (channel === "unmaximize-window") {
                    const window = BrowserWindow.fromWebContents(event.sender);
                    return window?.unmaximize();
                }
            }
            BrowserWindow.getAllWindows().forEach((win) =>
                win.webContents.send(channel, ...data),
            );
        });
        app.on("window-all-closed", () => {
            if (process.platform !== "darwin") app.quit();
        });
        app.on("activate", () => {
            if (BrowserWindow.getAllWindows().length === 0) this.register(path);
        });
        app.once("before-quit", (event) => {
            event.preventDefault();
            // 清理网页视图
            const webviewManager: WebViewManager =
                WebViewManager.obtainInstance();
            Array.from(webviewManager.keys()).forEach((key) =>
                webviewManager.delete(key),
            );
            // 清理窗口
            BrowserWindow.getAllWindows().forEach((win) => {
                BrowserUtils.close(win.webContents);
                win.destroy();
            });
            // 退出应用
            app.exit(0);
        });
        // 主界面关闭时，退出应用
        WindowUtils.obtain(id)?.once("closed", () => app.quit());
    }
}
