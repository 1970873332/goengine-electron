import { BaseWindow, BrowserWindow, WebContentsView } from "electron";
import { IPCBrowserConstructorOptions } from "../ipc/utils/Browser";
import { IPCWindow, IPCWindowConstructorOptions } from "../ipc/utils/Window";
import WebViewManager from "../managers/WebView";
import { UtilBrowser } from "./Browser";
import { UtilWebView } from "./WebView";

/**
 * 窗口工具
 */
export class UtilWindow {
    /**
     * 获取
     * @param id
     * @returns
     */
    public static obtain(id: number): IPCWindow | undefined {
        return BaseWindow.fromId(id) ?? BrowserWindow.fromId(id) ?? void 0;
    }
    /**
     * 应用状态
     * @param win
     * @param options
     */
    public static async applyState(
        win: IPCWindow,
        options: IPCWindowConstructorOptions | IPCBrowserConstructorOptions,
    ): Promise<void> {
        // 缩放
        options.zoom && this.adjustZoom(win, options.zoom);
        // 显示/隐藏
        typeof options.show === "boolean" && this.visible(win, options.show);
        // 主机视图
        if (options.hostview) {
            // 代理
            this.agentWebView(
                win,
                WebViewManager.obtainInstance().get(options.hostview),
            );
        }
    }
    /**
     * 代理webview
     * @param win
     * @param view
     */
    public static async agentWebView(
        win: BaseWindow,
        webview?: WebContentsView,
    ): Promise<void> {
        if (!webview) return;
        win.removeAllListeners();
        UtilWebView.specifyVisible(webview, true);
        UtilWebView.setBounds(webview, win.getBounds(), true);
        UtilBrowser.attach(webview, win.contentView);
        win.on(
            "resize",
            () =>
                this.verifyAttached(win, webview) &&
                UtilWebView.setBounds(webview, win.getBounds(), true),
        );
        win.on("close", () => {
            this.verifyAttached(win, webview) &&
                UtilBrowser.detach(webview, win.contentView);
            BrowserWindow.getAllWindows().forEach(({ webContents }) =>
                webContents.send("close", win.id),
            );
        });
    }
    /**
     * 设置是否可见
     * @param win
     * @param visible
     */
    public static visible(win: BaseWindow, visible: boolean): void {
        visible ? win.show() : win.hide();
    }
    /**
     * 调整缩放
     */
    public static adjustZoom(
        win: BaseWindow,
        zoom: IPCWindowConstructorOptions["zoom"],
    ): void {
        switch (zoom) {
            case "maximize":
                win.maximize();
                break;
            case "minimize":
                win.minimize();
                break;
        }
    }
    /**
     * 验证附加
     * @param win
     * @param webview
     */
    public static verifyAttached(
        win: BaseWindow,
        webview?: WebContentsView,
    ): boolean {
        return !!webview && win.contentView.children.includes(webview);
    }
}
