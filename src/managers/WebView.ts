import { BrowserWindow, WebContents, WebContentsView } from "electron";
import { IPCWebViewMaping } from "../ipc/Maps";
import { IPCWebViewConstructorOptions } from "../ipc/utils/WebView";
import { UtilBrowser } from "../utils/Browser";

/**
 * 网络视图管理
 */
export default class WebViewManager extends Map<string, WebContentsView> {
    protected declare  static instance: WebViewManager;
    public static obtainInstance(): WebViewManager {
        return (this.instance ??= new this());
    }
    protected constructor() {
        super();
    }

    /**
     * 获取
     * @returns
     */
    public async obtain(
        options?: IPCWebViewConstructorOptions,
    ): Promise<IData> {
        const key: string = crypto.randomUUID(),
            view: WebContentsView = new WebContentsView(options);
        this.delete(options?.viewID);
        this.set(key, view);
        this.emit(key, IPCWebViewMaping.obtain);
        this.emit(key, IPCWebViewMaping.obtainAll);
        return {
            id: key,
            view,
        };
    }
    /**
     * 发送
     * @param key
     * @param channel
     */
    public emit(key: string, channel: string): void {
        for (const browser of BrowserWindow.getAllWindows()) {
            UtilBrowser.send(browser.webContents, channel, key, this.size);
        }
    }

    public get(key?: string): WebContentsView | undefined {
        const view: WebContentsView | undefined | null = key
            ? super.get(key)
            : void 0;
        return view ?? void 0;
    }

    public delete(key?: string): boolean {
        if (!key || !this.has(key)) return true;
        const webContents: WebContents | undefined = this.get(key)?.webContents;
        webContents && UtilBrowser.close(webContents);
        this.emit(key, IPCWebViewMaping.delete);
        this.emit(key, IPCWebViewMaping.obtainAll);
        return super.delete(key);
    }
}

interface IData {
    /**
     * id
     */
    id: string;
    /**
     * 视图
     */
    view: WebContentsView;
}

export { IData as ManagerWebViewData };
