import {
    app,
    Input,
    NativeImage,
    OpenDevToolsOptions,
    ProxyConfig,
    Rectangle,
    View,
    WebContents,
    webContents as WebContentsClass,
    WebContentsView,
} from "electron";
import { WebViewIPCConstructorOptions } from "../ipc/util/WebView";
import Global from "../store/Global";
import { SessionUtils, SessionUtilsConfig } from "./Session";
import { WebContentsUtils } from "./WebContents";

/**
 * 浏览器工具类
 */
export abstract class BrowserUtils {
    /**
     * 应用状态
     * @param webContents
     * @param options
     */
    public static async applyState(
        webContents: WebContents,
        options: WebViewIPCConstructorOptions & {
            path: string;
            listener?: () => void;
        },
    ): Promise<void> {
        if (!WebContentsUtils.effective(webContents)) return;
        // 清理事件
        webContents.removeAllListeners();
        // 清除存储
        options.clearStorage &&
            (await SessionUtils.clearStorage(webContents.session));
        // 清除缓存
        options.clearCache &&
            (await SessionUtils.clearCache(webContents.session));
        // 设置代理
        options.proxy &&
            (await SessionUtils.setProxy(webContents.session, options.proxy));
        // 设置证书验证
        options.trustCertificate &&
            SessionUtils.setCertificateVerifyProc(
                webContents.session,
                (_, callback) => callback(0),
            );
        // 执行js
        options.executeJavaScript &&
            webContents.on(
                "did-finish-load",
                this.executeJavaScript.bind(
                    null,
                    webContents,
                    options.executeJavaScript,
                ),
            );
        // 开发者工具
        if (typeof options.webPreferences?.devTools === "boolean") {
            options.webPreferences.devTools
                ? this.openDevTools(webContents)
                : this.closeDevTools(webContents);
        }
        // 输入事件
        !app.isPackaged &&
            webContents.on("before-input-event", (_, input: Input) => {
                if (input.code === "F12" && input.type === "keyDown") {
                    // 切换开发者工具
                    webContents.isDevToolsOpened()
                        ? this.closeDevTools(webContents)
                        : this.openDevTools(webContents);
                }
            });
        try {
            const DID_FAIL_LOAD = "did-fail-load",
                UNRESPONSIVE = "unresponsive",
                // 加载路径
                url: string = options.relative
                    ? new URL(options.path, Global.uri).href
                    : options.path;
            // 加载失败
            webContents.on(
                DID_FAIL_LOAD,
                (
                    _,
                    errorCode: number,
                    errorDescription: string,
                    validatedURL: string,
                    isMainFrame: boolean,
                    frameProcessId: number,
                    frameRoutingId: number,
                ) => {
                    throw {
                        type: DID_FAIL_LOAD,
                        url,
                        errorCode,
                        errorDescription,
                        validatedURL,
                        isMainFrame,
                        frameProcessId,
                        frameRoutingId,
                    };
                },
            );
            // 无响应
            webContents.on(UNRESPONSIVE, () => {
                throw {
                    type: UNRESPONSIVE,
                    url,
                };
            });
            // 加载网页
            webContents.loadURL(url);
        } catch (error: unknown) {
            // 发送错误
            options.channel &&
                this.send(options.webContentsID, options.channel, error);
        }
    }
    /**
     * 截图
     * @param webContents
     * @param rect
     */
    public static async capture(
        webContents: WebContents,
        rect?: Rectangle,
    ): Promise<Buffer> {
        if (!WebContentsUtils.effective(webContents)) return Buffer.alloc(0);
        const img: NativeImage = await webContents.capturePage(rect);
        return img.toPNG();
    }
    /**
     * 执行js
     * @param webContents
     * @param js
     */
    public static async executeJavaScript(
        webContents: WebContents,
        js: string,
    ): Promise<void> {
        if (!WebContentsUtils.effective(webContents)) return;
        await webContents.executeJavaScript(js);
    }
    /**
     * 获取就绪状态
     * @param webContents
     * @returns
     */
    public static async readyState(
        webContents: WebContents,
    ): Promise<DocumentReadyState | string> {
        if (!WebContentsUtils.effective(webContents)) return "";
        if (webContents.isWaitingForResponse()) return "";
        return await webContents.executeJavaScript("document.readyState");
    }
    /**
     * 打开开发者工具
     * @param webContents
     */
    public static openDevTools(
        webContents: WebContents,
        options?: OpenDevToolsOptions,
    ): void {
        if (!WebContentsUtils.effective(webContents)) return;
        if (webContents.isDevToolsOpened()) return;
        webContents.openDevTools(
            options ?? { mode: "detach", activate: false },
        );
    }
    /**
     * 关闭开发者工具
     * @param webContents
     */
    public static closeDevTools(webContents: WebContents): void {
        if (!WebContentsUtils.effective(webContents)) return;
        if (!webContents.isDevToolsOpened()) return;
        webContents.closeDevTools();
    }
    /**
     * 切换开发者工具
     * @param webContents
     * @returns
     */
    public static toggleDevTools(webContents: WebContents): void {
        if (!WebContentsUtils.effective(webContents)) return;
        webContents.toggleDevTools();
    }
    /**
     * 附加
     * @param webContents
     */
    public static attach(webview: WebContentsView, view: View): void {
        if (!WebContentsUtils.effective(webview.webContents)) return;
        view.addChildView(webview);
    }
    /**
     * 分离
     * @param webview
     * @param win
     */
    public static detach(webview: WebContentsView, view: View): void {
        if (!WebContentsUtils.effective(webview.webContents)) return;
        view.removeChildView(webview);
    }
    /**
     * 关闭
     * @param webContents
     * @returns
     */
    public static close(webContents: WebContents): void {
        if (!WebContentsUtils.effective(webContents)) return;
        this.stop(webContents);
        webContents.close();
    }
    /**
     * 停止
     * @param webContents
     */
    public static stop(webContents: WebContents): void {
        if (!WebContentsUtils.effective(webContents)) return;
        webContents.stop();
    }
    /**
     * 刷新
     * @param webContents
     * @returns
     */
    public static reload(webContents: WebContents): void {
        if (!WebContentsUtils.effective(webContents)) return;
        webContents.reload();
    }
    /**
     * 跳转
     * @param webContents
     * @param url
     * @returns
     */
    public static goto(webContents: WebContents, url: string): void {
        if (!WebContentsUtils.effective(webContents)) return;
        webContents.loadURL(url);
    }
    /**
     * 停止绘制
     * @param webContents
     * @returns
     */
    public static stopPainting(webContents: WebContents): void {
        if (!WebContentsUtils.effective(webContents)) return;
        webContents.stopPainting();
    }
    /**
     * 开始绘制
     * @param webContents
     * @returns
     */
    public static startPainting(webContents: WebContents): void {
        if (!WebContentsUtils.effective(webContents)) return;
        webContents.startPainting();
    }
    /**
     * 发送
     * @param webContents
     * @param channel
     * @param args
     */
    public static send(
        webContents: WebContents | number | undefined,
        channel: string,
        ...args: any[]
    ): void {
        if (typeof webContents === "number")
            webContents = WebContentsClass.fromId(webContents);
        if (!WebContentsUtils.effective(webContents)) return;
        webContents?.send(channel, ...args);
    }
}

/**
 * 选项
 */
interface IConstructorOptions {
    /**
     * 是否是相对路径
     * @default false
     */
    relative?: boolean;
    /**
     * 是否需要预加载
     * @default false
     */
    preload?: boolean;
    /**
     * 执行的js代码
     */
    executeJavaScript?: string;
    /**
     * 是否清理存储
     * @default false
     */
    clearStorage?: boolean;
    /**
     * 是否清理缓存
     * @default false
     */
    clearCache?: boolean;
    /**
     * 是否需要代理
     */
    proxy?: ProxyConfig;
    /**
     * 是否信任证书
     */
    trustCertificate?: boolean;
}
/**
 * 浏览器配置
 */
type TConstructorConfig = IConstructorOptions & SessionUtilsConfig;

export {
    TConstructorConfig as BrowserUtilsConstructorConfig,
    IConstructorOptions as BrowserUtilsConstructorOptions,
};
