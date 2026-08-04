import WebViewManager, {
    ManagerWebViewData,
} from "@goengine/electron/src/manager/WebView";
import {
    BrowserUtils,
    BrowserUtilsConstructorConfig,
    BrowserUtilsConstructorOptions,
} from "@goengine/electron/src/util/Browser";
import { ConfigUtils } from "@goengine/electron/src/util/Config";
import { SessionUtils } from "@goengine/electron/src/util/Session";
import { WebContentsUtils } from "@goengine/electron/src/util/WebContents";
import { WebViewUtils } from "@goengine/electron/src/util/WebView";
import { WindowUtils } from "@goengine/electron/src/util/Window";
import {
    IpcMainInvokeEvent,
    Rectangle,
    Session,
    View,
    WebContents,
    WebContentsView,
    WebContentsViewConstructorOptions,
} from "electron";
import BaseIPC from "../Base";
import { WebViewIPCMaping } from "../Maps";
import { WindowIPCWindow } from "./Window";

/**
 * 网络视图IPC
 */
export class WebViewIPC extends BaseIPC {
    public config: Record<
        string,
        (event: IpcMainInvokeEvent, ...args: any[]) => any
    > = {
        [WebViewIPCMaping.obtain]: WebViewIPC.obtain,
        [WebViewIPCMaping.obtainID]: WebViewIPC.obtainID,
        [WebViewIPCMaping.obtainAll]: WebViewIPC.obtainAll,
        [WebViewIPCMaping.clearCache]: WebViewIPC.clearCache,
        [WebViewIPCMaping.clearStorage]: WebViewIPC.clearStorage,
        [WebViewIPCMaping.goto]: WebViewIPC.goto,
        [WebViewIPCMaping.send]: WebViewIPC.send,
        [WebViewIPCMaping.stop]: WebViewIPC.stop,
        [WebViewIPCMaping.close]: WebViewIPC.close,
        [WebViewIPCMaping.agent]: WebViewIPC.agent,
        [WebViewIPCMaping.delete]: WebViewIPC.delete,
        [WebViewIPCMaping.reload]: WebViewIPC.reload,
        [WebViewIPCMaping.attach]: WebViewIPC.attach,
        [WebViewIPCMaping.detach]: WebViewIPC.detach,
        [WebViewIPCMaping.capture]: WebViewIPC.capture,
        [WebViewIPCMaping.readyState]: WebViewIPC.readyState,
        [WebViewIPCMaping.openDevTools]: WebViewIPC.openDevTools,
        [WebViewIPCMaping.verifyAttached]: WebViewIPC.verifyAttached,
        [WebViewIPCMaping.executeJavaScript]: WebViewIPC.executeJavaScript,
        [WebViewIPCMaping.specifyBounds]: WebViewIPC.specifyBounds,
        [WebViewIPCMaping.specifyVisible]: WebViewIPC.specifyVisible,
        [WebViewIPCMaping.specifyBackgroundColor]:
            WebViewIPC.specifyBackgroundColor,
    };

    /**
     * 获取
     * @param event
     * @param config
     */
    public static async obtain(
        event: IpcMainInvokeEvent | null,
        path: string,
        config?: TConstructorConfig,
    ): Promise<string> {
        const options: IConstructorOptions =
                await ConfigUtils.configureWebViewOptions(config),
            preview: WebContentsView | undefined =
                WebViewManager.obtainInstance().get(options.viewID),
            { id, view }: ManagerWebViewData =
                !config?.close &&
                WebContentsUtils.effective(preview?.webContents)
                    ? { id: options.viewID!, view: preview! }
                    : await WebViewManager.obtainInstance().obtain(options);
        // 指定是否可见
        WebViewIPC.specifyVisible(event, id, options.visible);
        // 应用浏览器状态
        await BrowserUtils.applyState(view.webContents, { ...options, path });
        return id;
    }
    /**
     * 清除缓存
     * @param event
     * @param id
     */
    public static async clearCache(
        event: IpcMainInvokeEvent | null,
        id: string,
    ): Promise<void> {
        const sessiontarget: Session | undefined =
            SessionUtils.obtainWebViewSession(id);
        sessiontarget && (await SessionUtils.clearCache(sessiontarget));
    }
    /**
     * 清除存储
     * @param event
     * @param id
     */
    public static async clearStorage(
        event: IpcMainInvokeEvent | null,
        id: string,
    ): Promise<void> {
        const sessiontarget: Session | undefined =
            SessionUtils.obtainWebViewSession(id);
        sessiontarget && (await SessionUtils.clearStorage(sessiontarget));
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
        id: string,
        rect?: Rectangle,
    ): Promise<Buffer> {
        const webContents: WebContents | undefined =
            WebContentsUtils.obtainWebViewContents(id);
        if (webContents) return await BrowserUtils.capture(webContents, rect);
        return Buffer.alloc(0);
    }
    /**
     * 执行js
     * @param event
     * @param id
     * @param js
     */
    public static async executeJavaScript(
        event: IpcMainInvokeEvent | null,
        id: string,
        js: string,
    ): Promise<void> {
        const webContents: WebContents | undefined =
            WebContentsUtils.obtainWebViewContents(id);
        webContents && (await BrowserUtils.executeJavaScript(webContents, js));
    }
    /**
     * 获取状态
     * @param event
     * @param id
     * @returns
     */
    public static async readyState(
        event: IpcMainInvokeEvent | null,
        id: string,
    ): Promise<DocumentReadyState | string> {
        const webContents: WebContents | undefined =
            WebContentsUtils.obtainWebViewContents(id);
        if (webContents) return await BrowserUtils.readyState(webContents);
        return "";
    }
    /**
     * 打开开发者工具
     * @param event
     * @param id
     */
    public static openDevTools(
        event: IpcMainInvokeEvent | null,
        id: string,
    ): void {
        const webContents: WebContents | undefined =
            WebContentsUtils.obtainWebViewContents(id);
        webContents && BrowserUtils.openDevTools(webContents);
    }
    /**
     * 关闭开发者工具
     * @param event
     * @param id
     */
    public static closeDevTools(
        event: IpcMainInvokeEvent | null,
        id: string,
    ): void {
        const webContents: WebContents | undefined =
            WebContentsUtils.obtainWebViewContents(id);
        webContents && BrowserUtils.closeDevTools(webContents);
    }
    /**
     * 关闭
     * @param event
     * @param id
     */
    public static close(
        event: IpcMainInvokeEvent | null,
        id: string,
        winID?: number,
    ): void {
        winID && WebViewIPC.detach(event, id, winID);
        WebViewManager.obtainInstance().delete(id);
    }
    /**
     * 暂停
     * @param event
     * @param id
     */
    public static stop(event: IpcMainInvokeEvent | null, id: string): void {
        const webContents: WebContents | undefined =
            WebContentsUtils.obtainWebViewContents(id);
        webContents && BrowserUtils.stop(webContents);
    }
    /**
     * 刷新
     * @param event
     * @param id
     */
    public static reload(event: IpcMainInvokeEvent | null, id: string): void {
        const webContents: WebContents | undefined =
            WebContentsUtils.obtainWebViewContents(id);
        webContents && BrowserUtils.reload(webContents);
    }
    /**
     * 跳转
     * @param event
     * @param id
     * @param url
     */
    public static goto(
        event: IpcMainInvokeEvent | null,
        id: string,
        url: string,
    ): void {
        const webContents: WebContents | undefined =
            WebContentsUtils.obtainWebViewContents(id);
        webContents && BrowserUtils.goto(webContents, url);
    }
    /**
     * 发送消息
     * @param event
     * @param id
     * @param message
     */
    public static send(
        event: IpcMainInvokeEvent | null,
        id: string,
        message: string,
        ...args: any[]
    ): void {
        const webContents: WebContents | undefined =
            WebContentsUtils.obtainWebViewContents(id);
        webContents && BrowserUtils.send(webContents, message, ...args);
    }
    /**
     * 指定是否可见
     * @param event
     * @param id
     * @param visible
     */
    public static specifyVisible(
        event: IpcMainInvokeEvent | null,
        id: string,
        visible?: boolean,
    ): void {
        const webview: WebContentsView | undefined =
            WebViewManager.obtainInstance().get(id);
        webview && WebViewUtils.specifyVisible(webview, !!visible);
    }
    /**
     * 指定边界
     * @param event
     * @param id
     * @param bound
     */
    public static specifyBounds(
        event: IpcMainInvokeEvent | null,
        id: string,
        bound: Rectangle,
    ): void {
        const webview: WebContentsView | undefined =
            WebViewManager.obtainInstance().get(id);
        webview && WebViewUtils.setBounds(webview, bound);
    }
    /**
     * 指定背景
     * @param event
     * @param id
     * @param color
     */
    public static specifyBackgroundColor(
        event: IpcMainInvokeEvent | null,
        id: string,
        color: string,
    ): void {
        const webview: WebContentsView | undefined =
            WebViewManager.obtainInstance().get(id);
        webview && WebViewUtils.setBackgroundColor(webview, color);
    }
    /**
     * 附加
     * @param event
     * @param id
     */
    public static attach(
        event: IpcMainInvokeEvent | null,
        id: string,
        winID: number,
    ): void {
        const webview: WebContentsView | undefined =
                WebViewManager.obtainInstance().get(id),
            view: View | undefined = WindowUtils.obtain(winID)?.contentView;
        WebViewIPC.specifyVisible(event, id, true);
        webview && view && BrowserUtils.attach(webview, view);
    }
    /**
     * 分离
     * @param event
     * @param id
     * @param winID
     */
    public static detach(
        event: IpcMainInvokeEvent | null,
        id: string,
        winID: number,
    ): void {
        const webview: WebContentsView | undefined =
                WebViewManager.obtainInstance().get(id),
            view: View | undefined = WindowUtils.obtain(winID)?.contentView;
        WebViewIPC.specifyVisible(event, id, false);
        webview && view && BrowserUtils.detach(webview, view);
    }
    /**
     * 删除
     * @param event
     * @param id
     * @returns
     */
    public static delete(
        event: IpcMainInvokeEvent | null,
        id: string,
        winID?: number,
    ): boolean {
        winID && WebViewIPC.detach(event, id, winID);
        return WebViewManager.obtainInstance().delete(id);
    }
    /**
     * 获取所有
     * @returns
     */
    public static obtainAll(event: IpcMainInvokeEvent | null): string[] {
        return Array.from(WebViewManager.obtainInstance().keys());
    }
    /**
     * 代理
     * @param event
     * @param id
     */
    public static agent(
        event: IpcMainInvokeEvent | null,
        id: string,
        winID: number,
    ): void {
        const win: WindowIPCWindow | undefined = WindowUtils.obtain(winID),
            webview: WebContentsView | undefined =
                WebViewManager.obtainInstance().get(id);
        win && WindowUtils.agentWebView(win, webview);
    }
    /**
     * 验证附加
     * @param event
     * @param id
     * @param winID
     * @returns
     */
    public static verifyAttached(
        event: IpcMainInvokeEvent | null,
        id: string,
        winID: number,
    ): boolean {
        const win: WindowIPCWindow | undefined = WindowUtils.obtain(winID),
            webview: WebContentsView | undefined =
                WebViewManager.obtainInstance().get(id);
        return !!win && WindowUtils.verifyAttached(win, webview);
    }
    /**
     * 获取自身ID
     * @param event
     */
    public static obtainID(
        event: IpcMainInvokeEvent | null,
    ): number | undefined {
        return event?.sender.id;
    }
}

/**
 * 选项
 */
interface IConstructorOptions
    extends WebContentsViewConstructorOptions, BrowserUtilsConstructorOptions {
    /**
     * 是否可见
     * @default false
     */
    visible?: boolean;
    /**
     * 是否关闭
     */
    close?: boolean;
    /**
     * 视图ID
     */
    viewID?: string;
    /**
     * 通道
     */
    channel?: string;
    /**
     * 网络容器ID
     */
    webContentsID?: number;
}
/**
 * 配置
 */
type TConstructorConfig = IConstructorOptions & BrowserUtilsConstructorConfig;

export {
    TConstructorConfig as WebViewIPCConstructorConfig,
    IConstructorOptions as WebViewIPCConstructorOptions,
};
