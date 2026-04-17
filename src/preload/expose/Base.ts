import { IPCAPPMaping, IPCBrowserMaping, IPCFileDialogMaping, IPCFileMaping, IPCSessionMaping, IPCShellMaping, IPCSocksMaping, IPCWebViewMaping, IPCWindowMaping } from "@electron/ipc/Maps";
import { AppUtils } from "@electron/ipc/utils/App";
import { BrowserUtils } from "@electron/ipc/utils/Browser";
import { FileUtils } from "@electron/ipc/utils/File";
import { FileDialogUtils } from "@electron/ipc/utils/FileDialog";
import { SessionUtils } from "@electron/ipc/utils/Session";
import { ShellUtils } from "@electron/ipc/utils/Shell";
import { SocksUtils } from "@electron/ipc/utils/Socks";
import { WebViewUtils } from "@electron/ipc/utils/WebView";
import { WindowUtils } from "@electron/ipc/utils/Window";
import { ipcRenderer, IpcRendererEvent } from "electron";


/**
 * 调用
 * @param name
 * @param Rest
 * @returns
 */
function invoke(name: string, ...Rest: any[]): any {
    return ipcRenderer.invoke(name, ...Rest);
}

/**
 * 预加载
 */
export class BaseExpose {
    protected declare  static instance: BaseExpose;
    public static obtainInstance(): BaseExpose {
        return (this.instance ??= new this());
    }
    protected constructor() { }

    /**
     * common
     * =======================================================================================================================================================
     */
    //#region

    /**
     * 发送消息
     * @param channel
     * @param args
     */
    public postMessage = (channel: string, ...args: any[]) => {
        ipcRenderer.send("message", channel, ...args);
    };
    /**
     * 监听消息
     * @param channel
     * @param callback
     * @returns
     */
    public onMessage = (
        channel: string,
        callback: (...args: any[]) => void,
    ) => {
        const call = ((_: IpcRendererEvent, ...args: any[]) =>
            callback(...args)).bind(null);
        ipcRenderer.on(channel, call);
        return () => ipcRenderer.removeListener(channel, call);
    };

    //#endregion

    /**
     * AppUtils
     * =======================================================================================================================================================
     */
    //#region

    /**
     * 获取路径
     * @returns
     */
    public getPath: TFuncToPromise<typeof AppUtils.getPath> = (
        ...args: any[]
    ) => invoke(IPCAPPMaping.getPath, ...args);
    /**
     * 获取所有路径
     * @returns
     */
    public getAllPath: TFuncToPromise<typeof AppUtils.getAllPath> = (
        ...args: any[]
    ) => invoke(IPCAPPMaping.getAllPath, ...args);
    /**
     * 获取应用路径
     * @returns
     */
    public getAppPath: TFuncToPromise<typeof AppUtils.getAppPath> = (
        ...args: any[]
    ) => invoke(IPCAPPMaping.getAppPath, ...args);

    //#endregion

    /**
     * FileDialogUtils
     * =======================================================================================================================================================
     */
    //#region

    /**
     * 选择文件
     * @returns
     */
    public showOpenFile: TFuncToPromise<typeof FileDialogUtils.showFileOpen> = (
        ...args: any[]
    ) => invoke(IPCFileDialogMaping.openFile, ...args);
    /**
     * 选择文件夹
     * @returns
     */
    public showOpenDir: TFuncToPromise<typeof FileDialogUtils.showFileOpenDir> =
        (...args: any[]) => invoke(IPCFileDialogMaping.openDir, ...args);
    /**
     * 保存文件
     * @returns
     */
    public showSaveFile: TFuncToPromise<typeof FileDialogUtils.showFileSave> = (
        ...args: any[]
    ) => invoke(IPCFileDialogMaping.saveFile, ...args);

    //#endregion

    /**
     * FileUtils
     * =======================================================================================================================================================
     */
    //#region

    /**
     * 获取文件夹结构
     * @returns
     */
    public readdir: TFuncToPromise<typeof FileUtils.readdir> = (
        ...args: any[]
    ) => invoke(IPCFileMaping.readdir, ...args);
    /**
     * 是否是文件
     * @returns
     */
    public isFile: TFuncToPromise<typeof FileUtils.isFile> = (...args: any[]) =>
        invoke(IPCFileMaping.isFile, ...args);
    /**
     * 是否是文件夹
     * @returns
     */
    public isDir: TFuncToPromise<typeof FileUtils.isDir> = (...args: any[]) =>
        invoke(IPCFileMaping.isDir, ...args);
    /**
     * 读取文件
     * @returns
     */
    public readFile: TFuncToPromise<typeof FileUtils.readFile> = (
        ...args: any[]
    ) => invoke(IPCFileMaping.readFile, ...args);
    /**
     * 创建文件夹
     * @returns
     */
    public mkdir: TFuncToPromise<typeof FileUtils.mkdir> = (...args: any[]) =>
        invoke(IPCFileMaping.mkdir, ...args);
    /**
     * 拷贝
     * @returns
     */
    public copyFile: TFuncToPromise<typeof FileUtils.copyFile> = (
        ...args: any[]
    ) => invoke(IPCFileMaping.copyFile, ...args);

    //#endregion

    /**
     * WindowUtils
     * =======================================================================================================================================================
     */
    //#region

    /**
     * 验证窗口
     * @param args
     * @returns
     */
    public verifyWindow: TFuncToPromise<typeof WindowUtils.verify> = (
        ...args: any[]
    ) => invoke(IPCWindowMaping.verify, ...args);
    /**
     * 打开基础窗口
     * @returns
     */
    public openBaseWindow: TFuncToPromise<typeof WindowUtils.openBaseWindow> = (
        ...args: any[]
    ) => invoke(IPCWindowMaping.openBase, ...args);
    /**
     * 打开浏览器窗口
     * @returns
     */
    public openBrowserWindow: TFuncToPromise<
        typeof WindowUtils.openBrowserWindow
    > = (...args: any[]) => invoke(IPCWindowMaping.openBrowser, ...args);
    /**
     * 关闭窗口
     * @returns
     */
    public closeWindow: TFuncToPromise<typeof WindowUtils.close> = (
        ...args: any[]
    ) => invoke(IPCWindowMaping.close, ...args);
    /**
     * 应用窗口状态
     * @returns
     */
    public applyWindowState: TFuncToPromise<
        typeof WindowUtils.applyWindowState
    > = (...args: any[]) => invoke(IPCWindowMaping.applyState, ...args);
    /**
     * 获取屏幕尺寸
     * @returns
     */
    public obtainScreenSize: TFuncToPromise<
        typeof WindowUtils.obtainScreenSize
    > = (...args: any[]) => invoke(IPCWindowMaping.obtainScreenSize, ...args);

    //#endregion

    /**
     * BrowserUtils
     * =======================================================================================================================================================
     */

    //#region

    /**
     * 清除缓存
     * @returns
     */
    public clearCache: TFuncToPromise<typeof BrowserUtils.clearCache> = (
        ...args: any[]
    ) => invoke(IPCBrowserMaping.clearCache, ...args);
    /**
     * 清除存储
     * @returns
     */
    public clearStorage: TFuncToPromise<typeof BrowserUtils.clearStorage> = (
        ...args: any[]
    ) => invoke(IPCBrowserMaping.clearStorage, ...args);
    /**
     * 截图
     * @returns
     */
    public capture: TFuncToPromise<typeof BrowserUtils.capture> = (
        ...args: any[]
    ) => invoke(IPCBrowserMaping.capture, ...args);
    /**
     * 打开开发者工具
     * @returns
     */
    public openDevTools: TFuncToPromise<typeof BrowserUtils.openDevTools> = (
        ...args: any[]
    ) => invoke(IPCBrowserMaping.openDevTools, ...args);
    /**
     * 执行js
     * @returns
     */
    public executeJavaScript: TFuncToPromise<
        typeof BrowserUtils.executeJavaScript
    > = (...args: any[]) => invoke(IPCBrowserMaping.executeJavaScript, ...args);
    /**
     * 获取焦点目标
     * @returns
     */
    public obtainFocusedTarget: TFuncToPromise<
        typeof BrowserUtils.obtainFocusedTarget
    > = (...args: any[]) =>
            invoke(IPCBrowserMaping.obtainFocusedTarget, ...args);

    //#endregion

    /**
     * WebViewUtils
     * =======================================================================================================================================================
     */
    //#region

    /**
     * 获取网络视图
     * @returns
     */
    public obtainWebView: TFuncToPromise<typeof WebViewUtils.obtain> = (
        ...args: any[]
    ) => invoke(IPCWebViewMaping.obtain, ...args);
    /**
     * 附加网络视图
     * @returns
     */
    public attachWebView: TFuncToPromise<typeof WebViewUtils.attach> = (
        ...args: any[]
    ) => invoke(IPCWebViewMaping.attach, ...args);
    /**
     * 分离网络视图
     * @returns
     */
    public detachWebView: TFuncToPromise<typeof WebViewUtils.detach> = (
        ...args: any[]
    ) => invoke(IPCWebViewMaping.detach, ...args);
    /**
     * 指定网络视图是否可见
     * @returns
     */
    public specifyWebViewVisible: TFuncToPromise<
        typeof WebViewUtils.specifyVisible
    > = (...args: any[]) => invoke(IPCWebViewMaping.specifyVisible, ...args);
    /**
     * 指定网络视图边界
     * @returns
     */
    public specifyWebViewBounds: TFuncToPromise<
        typeof WebViewUtils.specifyBounds
    > = (...args: any[]) => invoke(IPCWebViewMaping.specifyBounds, ...args);
    /**
     * 指定网络视图背景
     * @returns
     */
    public specifyWebViewBackgroundColor: TFuncToPromise<
        typeof WebViewUtils.specifyBackgroundColor
    > = (...args: any[]) =>
            invoke(IPCWebViewMaping.specifyBackgroundColor, ...args);
    /**
     * 清除网络视图缓存
     * @returns
     */
    public clearWebViewCache: TFuncToPromise<typeof WebViewUtils.clearCache> = (
        ...args: any[]
    ) => invoke(IPCWebViewMaping.clearCache, ...args);
    /**
     * 清除网络视图存储
     * @returns
     */
    public clearWebViewStorage: TFuncToPromise<
        typeof WebViewUtils.clearStorage
    > = (...args: any[]) => invoke(IPCWebViewMaping.clearStorage, ...args);
    /**
     * 网络视图截图
     * @returns
     */
    public captureWebView: TFuncToPromise<typeof WebViewUtils.capture> = (
        ...args: any[]
    ) => invoke(IPCWebViewMaping.capture, ...args);
    /**
     * 打开网络视图开发者工具
     * @returns
     */
    public openWebViewDevTools: TFuncToPromise<
        typeof WebViewUtils.openDevTools
    > = (...args: any[]) => invoke(IPCWebViewMaping.openDevTools, ...args);
    /**
     * 执行网络视图js
     * @returns
     */
    public executeWebViewJavaScript: TFuncToPromise<
        typeof WebViewUtils.executeJavaScript
    > = (...args: any[]) => invoke(IPCWebViewMaping.executeJavaScript, ...args);
    /**
     * 关闭网络视图
     * @returns
     */
    public closeWebView: TFuncToPromise<typeof WebViewUtils.close> = (
        ...args: any[]
    ) => invoke(IPCWebViewMaping.close, ...args);
    /**
     * 删除网络视图
     * @returns
     */
    public deleteWebView: TFuncToPromise<typeof WebViewUtils.delete> = (
        ...args: any[]
    ) => invoke(IPCWebViewMaping.delete, ...args);
    /**
     * 重新加载
     * @returns
     */
    public reloadWebView: TFuncToPromise<typeof WebViewUtils.reload> = (
        ...args: any[]
    ) => invoke(IPCWebViewMaping.reload, ...args);
    /**
     * 跳转
     * @param args
     * @returns
     */
    public gotoWebView: TFuncToPromise<typeof WebViewUtils.goto> = (
        ...args: any[]
    ) => invoke(IPCWebViewMaping.goto, ...args);
    /**
     * 发送网络视图
     * @returns
     */
    public sendWebView: TFuncToPromise<typeof WebViewUtils.send> = (
        ...args: any[]
    ) => invoke(IPCWebViewMaping.send, ...args);
    /**
     * 获取网络视图状态
     * @returns
     */
    public getWebViewReadyState: TFuncToPromise<
        typeof WebViewUtils.readyState
    > = (...args: any[]) => invoke(IPCWebViewMaping.readyState, ...args);
    /**
     * 获取所有网络视图
     * @returns
     */
    public obtainWebViewAll: TFuncToPromise<typeof WebViewUtils.obtainAll> = (
        ...args: any[]
    ) => invoke(IPCWebViewMaping.obtainAll, ...args);
    /**
     * 停止视图
     * @returns
     */
    public stopWebView: TFuncToPromise<typeof WebViewUtils.stop> = (
        ...args: any[]
    ) => invoke(IPCWebViewMaping.stop, ...args);
    /**
     * 代理视图
     * @param args
     * @returns
     */
    public agentWebView: TFuncToPromise<typeof WebViewUtils.agent> = (
        ...args: any[]
    ) => invoke(IPCWebViewMaping.agent, ...args);
    /**
     * 验证是否代理
     * @param args
     * @returns
     */
    public verifyWebViewAttached: TFuncToPromise<
        typeof WebViewUtils.verifyAttached
    > = (...args: any[]) => invoke(IPCWebViewMaping.verifyAttached, ...args);
    /**
     * 获取网络视图ID
     * @param args
     * @returns
     */
    public obtainWebViewID: TFuncToPromise<typeof WebViewUtils.obtainID> = (
        ...args: any[]
    ) => invoke(IPCWebViewMaping.obtainID, ...args);

    //#endregion

    /**
     * SessionUtils
     * =======================================================================================================================================================
     */

    //#region

    /**
     * 获取所有会话
     * @returns
     */
    public obtainSessionAll: TFuncToPromise<typeof SessionUtils.obtainAll> = (
        ...args: any[]
    ) => invoke(IPCSessionMaping.obtainAll, ...args);

    //#endregion

    /**
     * SocksUtils
     * =======================================================================================================================================================
     */

    //#region

    /**
     * 连接
     * @returns
     */
    public connectSocks: TFuncToPromise<typeof SocksUtils.connect> = (
        ...args: any[]
    ) => invoke(IPCSocksMaping.connect, ...args);

    //#endregion

    /**
     * ShellUtils
     * =======================================================================================================================================================
     */

    //#region

    /**
     * 显示文件
     * @returns
     */
    public showFolder: TFuncToPromise<typeof ShellUtils.showFolder> = (
        ...args: any[]
    ) => invoke(IPCShellMaping.showFolder, ...args);
    /**
     * 打开路径
     * @returns
     */
    public openPath: TFuncToPromise<typeof ShellUtils.openPath> = (
        ...args: any[]
    ) => invoke(IPCShellMaping.openPath, ...args);

    //#endregion

    /**
     * =======================================================================================================================================================
     */
}

type TFuncToPromise<T extends (...args: any[]) => any> = (
    ...args: Parameters<T> extends [any, ...infer U] ? U : never
) => ReturnType<T> extends Promise<infer R>
    ? Promise<R>
    : Promise<ReturnType<T>>;
