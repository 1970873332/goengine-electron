import {
    AppIPCMaping,
    BrowserIPCMaping,
    IPCFileDialogMaping,
    IPCFileMaping,
    IPCSessionMaping,
    IPCShellMaping,
    IPCSocksMaping,
    WebViewIPCMaping,
    WindowIPCMaping,
} from "@goengine/electron/src/ipc/Maps";
import { AppIPC } from "@goengine/electron/src/ipc/util/App";
import { BrowserIPC } from "@goengine/electron/src/ipc/util/Browser";
import { FileIPC } from "@goengine/electron/src/ipc/util/File";
import { FileDialogIPC } from "@goengine/electron/src/ipc/util/FileDialog";
import { SessionIPC } from "@goengine/electron/src/ipc/util/Session";
import { ShellIPC } from "@goengine/electron/src/ipc/util/Shell";
import { SocksIPC } from "@goengine/electron/src/ipc/util/Socks";
import { WebViewIPC } from "@goengine/electron/src/ipc/util/WebView";
import { WindowIPC } from "@goengine/electron/src/ipc/util/Window";
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
    declare protected static instance: BaseExpose;
    public static obtainInstance(): BaseExpose {
        return (this.instance ??= new this());
    }
    protected constructor() {}

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
     * AppIPC
     * =======================================================================================================================================================
     */
    //#region

    /**
     * 获取路径
     * @returns
     */
    public getPath: TFuncToPromise<typeof AppIPC.getPath> = (...args: any[]) =>
        invoke(AppIPCMaping.getPath, ...args);
    /**
     * 获取所有路径
     * @returns
     */
    public getAllPath: TFuncToPromise<typeof AppIPC.getAllPath> = (
        ...args: any[]
    ) => invoke(AppIPCMaping.getAllPath, ...args);
    /**
     * 获取应用路径
     * @returns
     */
    public getAppPath: TFuncToPromise<typeof AppIPC.getAppPath> = (
        ...args: any[]
    ) => invoke(AppIPCMaping.getAppPath, ...args);

    //#endregion

    /**
     * FileDialogIPC
     * =======================================================================================================================================================
     */
    //#region

    /**
     * 选择文件
     * @returns
     */
    public showOpenFile: TFuncToPromise<typeof FileDialogIPC.showFileOpen> = (
        ...args: any[]
    ) => invoke(IPCFileDialogMaping.openFile, ...args);
    /**
     * 选择文件夹
     * @returns
     */
    public showOpenDir: TFuncToPromise<typeof FileDialogIPC.showFileOpenDir> = (
        ...args: any[]
    ) => invoke(IPCFileDialogMaping.openDir, ...args);
    /**
     * 保存文件
     * @returns
     */
    public showSaveFile: TFuncToPromise<typeof FileDialogIPC.showFileSave> = (
        ...args: any[]
    ) => invoke(IPCFileDialogMaping.saveFile, ...args);

    //#endregion

    /**
     * FileIPC
     * =======================================================================================================================================================
     */
    //#region

    /**
     * 获取文件夹结构
     * @returns
     */
    public readdir: TFuncToPromise<typeof FileIPC.readdir> = (...args: any[]) =>
        invoke(IPCFileMaping.readdir, ...args);
    /**
     * 是否是文件
     * @returns
     */
    public isFile: TFuncToPromise<typeof FileIPC.isFile> = (...args: any[]) =>
        invoke(IPCFileMaping.isFile, ...args);
    /**
     * 是否是文件夹
     * @returns
     */
    public isDir: TFuncToPromise<typeof FileIPC.isDir> = (...args: any[]) =>
        invoke(IPCFileMaping.isDir, ...args);
    /**
     * 读取文件
     * @returns
     */
    public readFile: TFuncToPromise<typeof FileIPC.readFile> = (
        ...args: any[]
    ) => invoke(IPCFileMaping.readFile, ...args);
    /**
     * 创建文件夹
     * @returns
     */
    public mkdir: TFuncToPromise<typeof FileIPC.mkdir> = (...args: any[]) =>
        invoke(IPCFileMaping.mkdir, ...args);
    /**
     * 拷贝
     * @returns
     */
    public copyFile: TFuncToPromise<typeof FileIPC.copyFile> = (
        ...args: any[]
    ) => invoke(IPCFileMaping.copyFile, ...args);

    //#endregion

    /**
     * WindowIPC
     * =======================================================================================================================================================
     */
    //#region

    /**
     * 验证窗口
     * @param args
     * @returns
     */
    public verifyWindow: TFuncToPromise<typeof WindowIPC.verify> = (
        ...args: any[]
    ) => invoke(WindowIPCMaping.verify, ...args);
    /**
     * 打开基础窗口
     * @returns
     */
    public openBaseWindow: TFuncToPromise<typeof WindowIPC.openBaseWindow> = (
        ...args: any[]
    ) => invoke(WindowIPCMaping.openBase, ...args);
    /**
     * 打开浏览器窗口
     * @returns
     */
    public openBrowserWindow: TFuncToPromise<
        typeof WindowIPC.openBrowserWindow
    > = (...args: any[]) => invoke(WindowIPCMaping.openBrowser, ...args);
    /**
     * 关闭窗口
     * @returns
     */
    public closeWindow: TFuncToPromise<typeof WindowIPC.close> = (
        ...args: any[]
    ) => invoke(WindowIPCMaping.close, ...args);
    /**
     * 应用窗口状态
     * @returns
     */
    public applyWindowState: TFuncToPromise<typeof WindowIPC.applyWindowState> =
        (...args: any[]) => invoke(WindowIPCMaping.applyState, ...args);
    /**
     * 获取屏幕尺寸
     * @returns
     */
    public obtainScreenSize: TFuncToPromise<typeof WindowIPC.obtainScreenSize> =
        (...args: any[]) => invoke(WindowIPCMaping.obtainScreenSize, ...args);

    //#endregion

    /**
     * BrowserIPC
     * =======================================================================================================================================================
     */

    //#region

    /**
     * 清除缓存
     * @returns
     */
    public clearCache: TFuncToPromise<typeof BrowserIPC.clearCache> = (
        ...args: any[]
    ) => invoke(BrowserIPCMaping.clearCache, ...args);
    /**
     * 清除存储
     * @returns
     */
    public clearStorage: TFuncToPromise<typeof BrowserIPC.clearStorage> = (
        ...args: any[]
    ) => invoke(BrowserIPCMaping.clearStorage, ...args);
    /**
     * 截图
     * @returns
     */
    public capture: TFuncToPromise<typeof BrowserIPC.capture> = (
        ...args: any[]
    ) => invoke(BrowserIPCMaping.capture, ...args);
    /**
     * 打开开发者工具
     * @returns
     */
    public openDevTools: TFuncToPromise<typeof BrowserIPC.openDevTools> = (
        ...args: any[]
    ) => invoke(BrowserIPCMaping.openDevTools, ...args);
    /**
     * 执行js
     * @returns
     */
    public executeJavaScript: TFuncToPromise<
        typeof BrowserIPC.executeJavaScript
    > = (...args: any[]) => invoke(BrowserIPCMaping.executeJavaScript, ...args);
    /**
     * 获取焦点目标
     * @returns
     */
    public obtainFocusedTarget: TFuncToPromise<
        typeof BrowserIPC.obtainFocusedTarget
    > = (...args: any[]) =>
        invoke(BrowserIPCMaping.obtainFocusedTarget, ...args);

    //#endregion

    /**
     * WebViewIPC
     * =======================================================================================================================================================
     */
    //#region

    /**
     * 获取网络视图
     * @returns
     */
    public obtainWebView: TFuncToPromise<typeof WebViewIPC.obtain> = (
        ...args: any[]
    ) => invoke(WebViewIPCMaping.obtain, ...args);
    /**
     * 附加网络视图
     * @returns
     */
    public attachWebView: TFuncToPromise<typeof WebViewIPC.attach> = (
        ...args: any[]
    ) => invoke(WebViewIPCMaping.attach, ...args);
    /**
     * 分离网络视图
     * @returns
     */
    public detachWebView: TFuncToPromise<typeof WebViewIPC.detach> = (
        ...args: any[]
    ) => invoke(WebViewIPCMaping.detach, ...args);
    /**
     * 指定网络视图是否可见
     * @returns
     */
    public specifyWebViewVisible: TFuncToPromise<
        typeof WebViewIPC.specifyVisible
    > = (...args: any[]) => invoke(WebViewIPCMaping.specifyVisible, ...args);
    /**
     * 指定网络视图边界
     * @returns
     */
    public specifyWebViewBounds: TFuncToPromise<
        typeof WebViewIPC.specifyBounds
    > = (...args: any[]) => invoke(WebViewIPCMaping.specifyBounds, ...args);
    /**
     * 指定网络视图背景
     * @returns
     */
    public specifyWebViewBackgroundColor: TFuncToPromise<
        typeof WebViewIPC.specifyBackgroundColor
    > = (...args: any[]) =>
        invoke(WebViewIPCMaping.specifyBackgroundColor, ...args);
    /**
     * 清除网络视图缓存
     * @returns
     */
    public clearWebViewCache: TFuncToPromise<typeof WebViewIPC.clearCache> = (
        ...args: any[]
    ) => invoke(WebViewIPCMaping.clearCache, ...args);
    /**
     * 清除网络视图存储
     * @returns
     */
    public clearWebViewStorage: TFuncToPromise<typeof WebViewIPC.clearStorage> =
        (...args: any[]) => invoke(WebViewIPCMaping.clearStorage, ...args);
    /**
     * 网络视图截图
     * @returns
     */
    public captureWebView: TFuncToPromise<typeof WebViewIPC.capture> = (
        ...args: any[]
    ) => invoke(WebViewIPCMaping.capture, ...args);
    /**
     * 打开网络视图开发者工具
     * @returns
     */
    public openWebViewDevTools: TFuncToPromise<typeof WebViewIPC.openDevTools> =
        (...args: any[]) => invoke(WebViewIPCMaping.openDevTools, ...args);
    /**
     * 执行网络视图js
     * @returns
     */
    public executeWebViewJavaScript: TFuncToPromise<
        typeof WebViewIPC.executeJavaScript
    > = (...args: any[]) => invoke(WebViewIPCMaping.executeJavaScript, ...args);
    /**
     * 关闭网络视图
     * @returns
     */
    public closeWebView: TFuncToPromise<typeof WebViewIPC.close> = (
        ...args: any[]
    ) => invoke(WebViewIPCMaping.close, ...args);
    /**
     * 删除网络视图
     * @returns
     */
    public deleteWebView: TFuncToPromise<typeof WebViewIPC.delete> = (
        ...args: any[]
    ) => invoke(WebViewIPCMaping.delete, ...args);
    /**
     * 重新加载
     * @returns
     */
    public reloadWebView: TFuncToPromise<typeof WebViewIPC.reload> = (
        ...args: any[]
    ) => invoke(WebViewIPCMaping.reload, ...args);
    /**
     * 跳转
     * @param args
     * @returns
     */
    public gotoWebView: TFuncToPromise<typeof WebViewIPC.goto> = (
        ...args: any[]
    ) => invoke(WebViewIPCMaping.goto, ...args);
    /**
     * 发送网络视图
     * @returns
     */
    public sendWebView: TFuncToPromise<typeof WebViewIPC.send> = (
        ...args: any[]
    ) => invoke(WebViewIPCMaping.send, ...args);
    /**
     * 获取网络视图状态
     * @returns
     */
    public getWebViewReadyState: TFuncToPromise<typeof WebViewIPC.readyState> =
        (...args: any[]) => invoke(WebViewIPCMaping.readyState, ...args);
    /**
     * 获取所有网络视图
     * @returns
     */
    public obtainWebViewAll: TFuncToPromise<typeof WebViewIPC.obtainAll> = (
        ...args: any[]
    ) => invoke(WebViewIPCMaping.obtainAll, ...args);
    /**
     * 停止视图
     * @returns
     */
    public stopWebView: TFuncToPromise<typeof WebViewIPC.stop> = (
        ...args: any[]
    ) => invoke(WebViewIPCMaping.stop, ...args);
    /**
     * 代理视图
     * @param args
     * @returns
     */
    public agentWebView: TFuncToPromise<typeof WebViewIPC.agent> = (
        ...args: any[]
    ) => invoke(WebViewIPCMaping.agent, ...args);
    /**
     * 验证是否代理
     * @param args
     * @returns
     */
    public verifyWebViewAttached: TFuncToPromise<
        typeof WebViewIPC.verifyAttached
    > = (...args: any[]) => invoke(WebViewIPCMaping.verifyAttached, ...args);
    /**
     * 获取网络视图ID
     * @param args
     * @returns
     */
    public obtainWebViewID: TFuncToPromise<typeof WebViewIPC.obtainID> = (
        ...args: any[]
    ) => invoke(WebViewIPCMaping.obtainID, ...args);

    //#endregion

    /**
     * SessionIPC
     * =======================================================================================================================================================
     */

    //#region

    /**
     * 获取所有会话
     * @returns
     */
    public obtainSessionAll: TFuncToPromise<typeof SessionIPC.obtainAll> = (
        ...args: any[]
    ) => invoke(IPCSessionMaping.obtainAll, ...args);

    //#endregion

    /**
     * SocksIPC
     * =======================================================================================================================================================
     */

    //#region

    /**
     * 连接
     * @returns
     */
    public connectSocks: TFuncToPromise<typeof SocksIPC.connect> = (
        ...args: any[]
    ) => invoke(IPCSocksMaping.connect, ...args);

    //#endregion

    /**
     * ShellIPC
     * =======================================================================================================================================================
     */

    //#region

    /**
     * 显示文件
     * @returns
     */
    public showFolder: TFuncToPromise<typeof ShellIPC.showFolder> = (
        ...args: any[]
    ) => invoke(IPCShellMaping.showFolder, ...args);
    /**
     * 打开路径
     * @returns
     */
    public openPath: TFuncToPromise<typeof ShellIPC.openPath> = (
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
