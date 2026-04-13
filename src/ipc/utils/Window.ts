import { UtilBrowser } from "@electron/utils/Browser";
import { UtilConfig } from "@electron/utils/Config";
import { UtilWindow } from "@electron/utils/Window";
import {
    BaseWindow,
    BaseWindowConstructorOptions,
    BrowserWindow,
    IpcMainInvokeEvent,
    screen,
    Size,
    WebContents,
} from "electron";
import BaseUtils from "../Index";
import { IPCWindowMaping } from "../Maps";
import {
    IPCBrowserConstructorConfig,
    IPCBrowserConstructorOptions,
} from "./Browser";

/**
 * 窗口工具
 */
export class WindowUtils extends BaseUtils {
    public config: Record<
        string,
        (event: IpcMainInvokeEvent, ...args: any[]) => any
    > = {
            [IPCWindowMaping.close]: WindowUtils.close,
            [IPCWindowMaping.verify]: WindowUtils.verify,
            [IPCWindowMaping.openBase]: WindowUtils.openBaseWindow,
            [IPCWindowMaping.openBrowser]: WindowUtils.openBrowserWindow,
            [IPCWindowMaping.applyState]: WindowUtils.applyWindowState,
            [IPCWindowMaping.obtainScreenSize]: WindowUtils.obtainScreenSize,
        };

    /**
     * 验证
     * @param id
     * @returns
     */
    public static verify(
        event: IpcMainInvokeEvent | null,
        id: number,
    ): boolean {
        return !!UtilWindow.obtain(id);
    }
    /**
     * 打开基础窗口
     * @param event
     * @param path
     * @param config
     */
    public static async openBaseWindow(
        event: IpcMainInvokeEvent | null,
        config?: TConstructorConfig,
    ): Promise<number> {
        const options: IConstructorOptions =
            await UtilConfig.configureBaseWindowOptions(config),
            win: BaseWindow = new BaseWindow(options);
        // 应用窗口状态
        await UtilWindow.applyState(win, options);
        return win.id;
    }
    /**
     * 打开浏览器窗口
     * @param event
     * @param path
     * @param options
     */
    public static async openBrowserWindow(
        event: IpcMainInvokeEvent | null,
        path: string,
        config?: IPCBrowserConstructorConfig,
    ): Promise<number> {
        const options: IPCBrowserConstructorOptions =
            await UtilConfig.configureBrowserWindowOptions(config),
            win: BrowserWindow = new BrowserWindow(options),
            webContents: WebContents = win.webContents;
        // 应用窗口状态
        await UtilWindow.applyState(win, options);
        // 应用浏览器状态
        await UtilBrowser.applyState(webContents, { ...options, path });
        return win.id;
    }
    /**
     * 应用状态
     * @param event
     * @param id
     * @param args
     */
    public static async applyWindowState(
        event: IpcMainInvokeEvent | null,
        id: number,
        config: TConstructorConfig | IPCBrowserConstructorConfig,
    ): Promise<void> {
        const win: TWindow | undefined = UtilWindow.obtain(id);
        win && (await UtilWindow.applyState(win, config));
    }
    /**
     * 关闭
     * @param event
     * @param id
     * @param destroy
     */
    public static close(
        event: IpcMainInvokeEvent | null,
        id: number,
        destroy?: boolean,
    ): void {
        const win: TWindow | undefined = UtilWindow.obtain(id);
        win?.close();
        destroy && win?.destroy();
    }
    /**
     * 获取屏幕尺寸
     * @param event
     * @returns
     */
    public static obtainScreenSize(event: IpcMainInvokeEvent | null): Size {
        return screen.getPrimaryDisplay().size;
    }
}

/**
 * 选项
 */
interface IConstructorOptions extends BaseWindowConstructorOptions {
    /**
     * 调整缩放
     */
    zoom?: "maximize" | "minimize";
    /**
     * 窗口尺寸
     * @default middle
     */
    size?: "small" | "middle" | "large" | "xlarge";
    /**
     * 是否显示
     * @default true
     */
    show?: boolean;
    /**
     * 主机视图
     */
    hostview?: string;
}
/**
 * 配置
 */
type TConstructorConfig = IConstructorOptions;
/**
 * 窗口
 */
type TWindow = BaseWindow | BrowserWindow;

export {
    TWindow as IPCWindow,
    TConstructorConfig as IPCWindowConstructorConfig,
    IConstructorOptions as IPCWindowConstructorOptions
};

