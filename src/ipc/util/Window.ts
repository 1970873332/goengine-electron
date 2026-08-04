import { BrowserUtils } from "@goengine/electron/src/util/Browser";
import { ConfigUtils } from "@goengine/electron/src/util/Config";
import { WindowUtils } from "@goengine/electron/src/util/Window";
import {
    BaseWindow,
    BaseWindowConstructorOptions,
    BrowserWindow,
    IpcMainInvokeEvent,
    screen,
    Size,
    WebContents,
} from "electron";
import BaseIPC from "../Base";
import { WindowIPCMaping } from "../Maps";
import {
    BrowserIPCConstructorConfig,
    BrowserIPCConstructorOptions,
} from "./Browser";

/**
 * 窗口IPC
 */
export class WindowIPC extends BaseIPC {
    public config: Record<
        string,
        (event: IpcMainInvokeEvent, ...args: any[]) => any
    > = {
        [WindowIPCMaping.close]: WindowIPC.close,
        [WindowIPCMaping.verify]: WindowIPC.verify,
        [WindowIPCMaping.openBase]: WindowIPC.openBaseWindow,
        [WindowIPCMaping.openBrowser]: WindowIPC.openBrowserWindow,
        [WindowIPCMaping.applyState]: WindowIPC.applyWindowState,
        [WindowIPCMaping.obtainScreenSize]: WindowIPC.obtainScreenSize,
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
        return !!WindowUtils.obtain(id);
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
                await ConfigUtils.configureBaseWindowOptions(config),
            win: BaseWindow = new BaseWindow(options);
        // 应用窗口状态
        await WindowUtils.applyState(win, options);
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
        config?: BrowserIPCConstructorConfig,
    ): Promise<number> {
        const options: BrowserIPCConstructorOptions =
                await ConfigUtils.configureBrowserWindowOptions(config),
            win: BrowserWindow = new BrowserWindow(options),
            webContents: WebContents = win.webContents;
        // 应用窗口状态
        await WindowUtils.applyState(win, options);
        // 应用浏览器状态
        await BrowserUtils.applyState(webContents, { ...options, path });
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
        config: TConstructorConfig | BrowserIPCConstructorConfig,
    ): Promise<void> {
        const win: TWindow | undefined = WindowUtils.obtain(id);
        win && (await WindowUtils.applyState(win, config));
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
        const win: TWindow | undefined = WindowUtils.obtain(id);
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
    TConstructorConfig as WindowIPCConstructorConfig,
    IConstructorOptions as WindowIPCConstructorOptions,
    TWindow as WindowIPCWindow,
};
