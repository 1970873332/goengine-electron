import { BaseWindow, BrowserWindow, WebContentsView } from "electron";
import { BrowserIPCConstructorOptions } from "../ipc/util/Browser";
import {
    WindowIPCConstructorOptions,
    WindowIPCWindow,
} from "../ipc/util/Window";
import WebViewManager from "../manager/WebView";
import { BrowserUtils } from "./Browser";
import { WebViewUtils } from "./WebView";

/**
 * 窗口工具类
 */
export abstract class WindowUtils {
    /**
     * 获取
     * @param id
     * @returns
     */
    public static obtain(id: number): WindowIPCWindow | undefined {
        return BaseWindow.fromId(id) ?? BrowserWindow.fromId(id) ?? void 0;
    }
    /**
     * 应用状态
     * @param win
     * @param options
     */
    public static async applyState(
        win: WindowIPCWindow,
        options: WindowIPCConstructorOptions | BrowserIPCConstructorOptions,
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
        WebViewUtils.specifyVisible(webview, true);
        WebViewUtils.setBounds(webview, win.getBounds(), true);
        BrowserUtils.attach(webview, win.contentView);
        win.on(
            "resize",
            () =>
                this.verifyAttached(win, webview) &&
                WebViewUtils.setBounds(webview, win.getBounds(), true),
        );
        win.on("close", () => {
            this.verifyAttached(win, webview) &&
                BrowserUtils.detach(webview, win.contentView);
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
        zoom: WindowIPCConstructorOptions["zoom"],
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
