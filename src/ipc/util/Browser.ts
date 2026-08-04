import {
    BrowserUtils,
    BrowserUtilsConstructorConfig,
    BrowserUtilsConstructorOptions,
} from "@goengine/electron/src/util/Browser";
import { SessionUtils } from "@goengine/electron/src/util/Session";
import { WebContentsUtils } from "@goengine/electron/src/util/WebContents";
import {
    BrowserWindow,
    BrowserWindowConstructorOptions,
    IpcMainInvokeEvent,
    Rectangle,
    Session,
    WebContents,
} from "electron";
import BaseIPC from "../Base";
import { BrowserIPCMaping } from "../Maps";
import {
    WindowIPCConstructorConfig,
    WindowIPCConstructorOptions,
} from "./Window";

/**
 * 浏览器IPC
 */
export class BrowserIPC extends BaseIPC {
    public config: Record<
        string,
        (event: IpcMainInvokeEvent, ...args: any[]) => any
    > = {
        [BrowserIPCMaping.capture]: BrowserIPC.capture,
        [BrowserIPCMaping.clearCache]: BrowserIPC.clearCache,
        [BrowserIPCMaping.clearStorage]: BrowserIPC.clearStorage,
        [BrowserIPCMaping.openDevTools]: BrowserIPC.openDevTools,
        [BrowserIPCMaping.closeDevTools]: BrowserIPC.closeDevTools,
        [BrowserIPCMaping.executeJavaScript]: BrowserIPC.executeJavaScript,
        [BrowserIPCMaping.obtainFocusedTarget]: BrowserIPC.obtainFocusedTarget,
    };

    /**
     * 清除缓存
     * @param event
     * @param id
     */
    public static async clearCache(
        event: IpcMainInvokeEvent | null,
        id?: number,
    ): Promise<void> {
        const sessionTarget: Session | undefined =
            SessionUtils.obtainBrowserSession(id);
        sessionTarget && (await SessionUtils.clearCache(sessionTarget));
    }
    /**
     * 清除存储
     * @param event
     * @param id
     */
    public static async clearStorage(
        event: IpcMainInvokeEvent | null,
        id?: number,
    ): Promise<void> {
        const sessionTarget: Session | undefined =
            SessionUtils.obtainBrowserSession(id);
        sessionTarget && (await SessionUtils.clearStorage(sessionTarget));
    }
    /**
     * 截图
     * @param event
     * @param id
     * @param rect
     * @returns
     */
    public static async capture(
        event: IpcMainInvokeEvent | null,
        id: number,
        rect?: Rectangle,
    ): Promise<Buffer> {
        const webContents: WebContents | undefined =
            WebContentsUtils.obtainBrowserContents(id);
        if (webContents) return await BrowserUtils.capture(webContents, rect);
        else return Buffer.alloc(0);
    }
    /**
     * 执行js
     * @param event
     * @param id
     * @param js
     */
    public static async executeJavaScript(
        event: IpcMainInvokeEvent | null,
        id: number,
        js: string,
    ): Promise<void> {
        const webContents: WebContents | undefined =
            WebContentsUtils.obtainBrowserContents(id);
        webContents && (await BrowserUtils.executeJavaScript(webContents, js));
    }
    /**
     * 打开开发者工具
     * @param event
     * @param id
     */
    public static openDevTools(
        event: IpcMainInvokeEvent | null,
        id: number,
    ): void {
        const webContents: WebContents | undefined =
            WebContentsUtils.obtainBrowserContents(id);
        webContents && BrowserUtils.openDevTools(webContents);
    }
    /**
     * 关闭开发者工具
     * @param event
     * @param id
     */
    public static closeDevTools(
        event: IpcMainInvokeEvent | null,
        id: number,
    ): void {
        const webContents: WebContents | undefined =
            WebContentsUtils.obtainBrowserContents(id);
        webContents && BrowserUtils.closeDevTools(webContents);
    }
    /**
     * 获取焦点目标
     * @param event
     * @returns
     */
    public static obtainFocusedTarget(
        event: IpcMainInvokeEvent | null,
    ): number | undefined {
        return BrowserWindow.getFocusedWindow()?.id;
    }
}

/**
 * 选项
 */
interface IConstructorOptions
    extends
        BrowserWindowConstructorOptions,
        WindowIPCConstructorOptions,
        BrowserUtilsConstructorOptions {}
/**
 * 配置
 */
type TConstructorConfig = IConstructorOptions &
    WindowIPCConstructorConfig &
    BrowserUtilsConstructorConfig;

export {
    TConstructorConfig as BrowserIPCConstructorConfig,
    IConstructorOptions as BrowserIPCConstructorOptions,
};
