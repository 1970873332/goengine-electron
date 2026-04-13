import {
    IpcMainInvokeEvent,
    Rectangle,
    Session,
    View,
    WebContents,
    WebContentsView,
    WebContentsViewConstructorOptions,
} from "electron";
import WebViewManager, { ManagerWebViewData } from "@electron/managers/WebView";
import { UtilBrowser, UtilBrowserConstructorConfig, UtilBrowserConstructorOptions } from "@electron/utils/Browser";
import { UtilConfig } from "@electron/utils/Config";
import { UtilSession } from "@electron/utils/Session";
import { UtilWebContents } from "@electron/utils/WebContents";
import { UtilWebView } from "@electron/utils/WebView";
import { UtilWindow } from "@electron/utils/Window";
import BaseUtils from "../Index";
import { IPCWebViewMaping } from "../Maps";
import { IPCWindow } from "./Window";

/**
 * 网络视图工具
 */
export class WebViewUtils extends BaseUtils {
    public config: Record<
        string,
        (event: IpcMainInvokeEvent, ...args: any[]) => any
    > = {
            [IPCWebViewMaping.obtain]: WebViewUtils.obtain,
            [IPCWebViewMaping.obtainID]: WebViewUtils.obtainID,
            [IPCWebViewMaping.obtainAll]: WebViewUtils.obtainAll,
            [IPCWebViewMaping.clearCache]: WebViewUtils.clearCache,
            [IPCWebViewMaping.clearStorage]: WebViewUtils.clearStorage,
            [IPCWebViewMaping.goto]: WebViewUtils.goto,
            [IPCWebViewMaping.send]: WebViewUtils.send,
            [IPCWebViewMaping.stop]: WebViewUtils.stop,
            [IPCWebViewMaping.close]: WebViewUtils.close,
            [IPCWebViewMaping.agent]: WebViewUtils.agent,
            [IPCWebViewMaping.delete]: WebViewUtils.delete,
            [IPCWebViewMaping.reload]: WebViewUtils.reload,
            [IPCWebViewMaping.attach]: WebViewUtils.attach,
            [IPCWebViewMaping.detach]: WebViewUtils.detach,
            [IPCWebViewMaping.capture]: WebViewUtils.capture,
            [IPCWebViewMaping.readyState]: WebViewUtils.readyState,
            [IPCWebViewMaping.openDevTools]: WebViewUtils.openDevTools,
            [IPCWebViewMaping.verifyAttached]: WebViewUtils.verifyAttached,
            [IPCWebViewMaping.executeJavaScript]: WebViewUtils.executeJavaScript,
            [IPCWebViewMaping.specifyBounds]: WebViewUtils.specifyBounds,
            [IPCWebViewMaping.specifyVisible]: WebViewUtils.specifyVisible,
            [IPCWebViewMaping.specifyBackgroundColor]:
                WebViewUtils.specifyBackgroundColor,
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
            await UtilConfig.configureWebViewOptions(config),
            preview: WebContentsView | undefined =
                WebViewManager.obtainInstance().get(options.viewID),
            { id, view }: ManagerWebViewData =
                !config?.close &&
                    UtilWebContents.effective(preview?.webContents)
                    ? { id: options.viewID!, view: preview! }
                    : await WebViewManager.obtainInstance().obtain(options);
        // 指定是否可见
        WebViewUtils.specifyVisible(event, id, options.visible);
        // 应用浏览器状态
        await UtilBrowser.applyState(view.webContents, { ...options, path });
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
            UtilSession.obtainWebViewSession(id);
        sessiontarget && (await UtilSession.clearCache(sessiontarget));
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
            UtilSession.obtainWebViewSession(id);
        sessiontarget && (await UtilSession.clearStorage(sessiontarget));
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
            UtilWebContents.obtainWebViewContents(id);
        if (webContents) return await UtilBrowser.capture(webContents, rect);
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
            UtilWebContents.obtainWebViewContents(id);
        webContents && (await UtilBrowser.executeJavaScript(webContents, js));
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
            UtilWebContents.obtainWebViewContents(id);
        if (webContents) return await UtilBrowser.readyState(webContents);
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
            UtilWebContents.obtainWebViewContents(id);
        webContents && UtilBrowser.openDevTools(webContents);
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
            UtilWebContents.obtainWebViewContents(id);
        webContents && UtilBrowser.closeDevTools(webContents);
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
        winID && WebViewUtils.detach(event, id, winID);
        WebViewManager.obtainInstance().delete(id);
    }
    /**
     * 暂停
     * @param event
     * @param id
     */
    public static stop(event: IpcMainInvokeEvent | null, id: string): void {
        const webContents: WebContents | undefined =
            UtilWebContents.obtainWebViewContents(id);
        webContents && UtilBrowser.stop(webContents);
    }
    /**
     * 刷新
     * @param event
     * @param id
     */
    public static reload(event: IpcMainInvokeEvent | null, id: string): void {
        const webContents: WebContents | undefined =
            UtilWebContents.obtainWebViewContents(id);
        webContents && UtilBrowser.reload(webContents);
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
            UtilWebContents.obtainWebViewContents(id);
        webContents && UtilBrowser.goto(webContents, url);
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
            UtilWebContents.obtainWebViewContents(id);
        webContents && UtilBrowser.send(webContents, message, ...args);
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
        webview && UtilWebView.specifyVisible(webview, !!visible);
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
        webview && UtilWebView.setBounds(webview, bound);
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
        webview && UtilWebView.setBackgroundColor(webview, color);
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
            view: View | undefined = UtilWindow.obtain(winID)?.contentView;
        WebViewUtils.specifyVisible(event, id, true);
        webview && view && UtilBrowser.attach(webview, view);
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
            view: View | undefined = UtilWindow.obtain(winID)?.contentView;
        WebViewUtils.specifyVisible(event, id, false);
        webview && view && UtilBrowser.detach(webview, view);
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
        winID && WebViewUtils.detach(event, id, winID);
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
        const win: IPCWindow | undefined = UtilWindow.obtain(winID),
            webview: WebContentsView | undefined =
                WebViewManager.obtainInstance().get(id);
        win && UtilWindow.agentWebView(win, webview);
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
        const win: IPCWindow | undefined = UtilWindow.obtain(winID),
            webview: WebContentsView | undefined =
                WebViewManager.obtainInstance().get(id);
        return !!win && UtilWindow.verifyAttached(win, webview);
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
    extends WebContentsViewConstructorOptions, UtilBrowserConstructorOptions {
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
type TConstructorConfig = IConstructorOptions & UtilBrowserConstructorConfig;

export {
    TConstructorConfig as IPCWebViewConstructorConfig,
    IConstructorOptions as IPCWebViewConstructorOptions
};

