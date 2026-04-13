import { Rectangle, WebContentsView } from "electron";

/**
 * 网页视图工具
 */
export class UtilWebView {
    /**
     * 指定是否可见
     * @param webview
     * @param visible
     */
    public static specifyVisible(
        webview: WebContentsView,
        visible: boolean,
    ): void {
        webview.setVisible(visible);
    }
    /**
     * 设置边界
     * @param webview
     * @param bound
     * @param normalize
     */
    public static setBounds(
        webview: WebContentsView,
        bound: Rectangle,
        normalize?: boolean,
    ): void {
        webview.setBounds(normalize ? { ...bound, x: 0, y: 0 } : bound);
    }
    /**
     * 设置背景
     * @param webview
     * @param color
     */
    public static setBackgroundColor(
        webview: WebContentsView,
        color: string,
    ): void {
        webview.setBackgroundColor(color);
    }
}
