import {
    BrowserWindow,
    BrowserWindowConstructorOptions,
    IpcMainInvokeEvent,
    Rectangle,
    Session,
    WebContents,
} from "electron";
import {
    UtilBrowser,
    UtilBrowserConstructorConfig,
    UtilBrowserConstructorOptions,
} from "../../utils/Browser";
import { UtilSession } from "../../utils/Session";
import { UtilWebContents } from "../../utils/WebContents";
import BaseUtils from "../Index";
import { IPCBrowserMaping } from "../Maps";
import {
    IPCWindowConstructorConfig,
    IPCWindowConstructorOptions,
} from "./Window";

/**
 * 浏览器工具
 */
export class BrowserUtils extends BaseUtils {
    public config: Record<
        string,
        (event: IpcMainInvokeEvent, ...args: any[]) => any
    > = {
        [IPCBrowserMaping.capture]: BrowserUtils.capture,
        [IPCBrowserMaping.clearCache]: BrowserUtils.clearCache,
        [IPCBrowserMaping.clearStorage]: BrowserUtils.clearStorage,
        [IPCBrowserMaping.openDevTools]: BrowserUtils.openDevTools,
        [IPCBrowserMaping.closeDevTools]: BrowserUtils.closeDevTools,
        [IPCBrowserMaping.executeJavaScript]: BrowserUtils.executeJavaScript,
        [IPCBrowserMaping.obtainFocusedTarget]:
            BrowserUtils.obtainFocusedTarget,
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
            UtilSession.obtainBrowserSession(id);
        sessionTarget && (await UtilSession.clearCache(sessionTarget));
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
            UtilSession.obtainBrowserSession(id);
        sessionTarget && (await UtilSession.clearStorage(sessionTarget));
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
            UtilWebContents.obtainBrowserContents(id);
        if (webContents) return await UtilBrowser.capture(webContents, rect);
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
            UtilWebContents.obtainBrowserContents(id);
        webContents && (await UtilBrowser.executeJavaScript(webContents, js));
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
            UtilWebContents.obtainBrowserContents(id);
        webContents && UtilBrowser.openDevTools(webContents);
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
            UtilWebContents.obtainBrowserContents(id);
        webContents && UtilBrowser.closeDevTools(webContents);
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
        IPCWindowConstructorOptions,
        UtilBrowserConstructorOptions {}
/**
 * 配置
 */
type TConstructorConfig = IConstructorOptions &
    IPCWindowConstructorConfig &
    UtilBrowserConstructorConfig;

export {
    TConstructorConfig as IPCBrowserConstructorConfig,
    IConstructorOptions as IPCBrowserConstructorOptions,
};
