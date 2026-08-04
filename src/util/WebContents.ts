import { BrowserWindow, WebContents } from "electron";
import WebViewManager from "../manager/WebView";

/**
 * 网页内容工具类
 */
export abstract class WebContentsUtils {
    /**
     * 获取浏览器内容
     * @param id
     * @returns
     */
    public static obtainBrowserContents(id: number): WebContents | undefined {
        return BrowserWindow.fromId(id)?.webContents;
    }
    /**
     * 获取网页视图内容
     * @param id
     * @returns
     */
    public static obtainWebViewContents(id: string): WebContents | undefined {
        return WebViewManager.obtainInstance().get(id)?.webContents;
    }
    /**
     * 是否有效
     * @param webContents
     * @returns
     */
    public static effective(webContents?: WebContents): boolean {
        return webContents?.isDestroyed() ? false : !!webContents;
    }
}
