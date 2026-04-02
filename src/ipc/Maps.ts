export enum IPCAPPMaping {
    /**
     * 获取路径
     */
    getPath = "app:getPath",
    /**
     * 获取应用路径
     */
    getAppPath = "app:getAppPath",
    /**
     * 获取所有路径
     */
    getAllPath = "app:getAllPath",
}

export enum IPCBrowserMaping {
    /**
     * 截图
     */
    capture = "browser:capture",
    /**
     * 清除缓存
     */
    clearCache = "browser:clearCache",
    /**
     * 清除存储
     */
    clearStorage = "browser:clearStorage",
    /**
     * 打开开发者工具
     */
    openDevTools = "browser:openDevTools",
    /**
     * 关闭开发者工具
     */
    closeDevTools = "browser:closeDevTools",
    /**
     * 执行js
     */
    executeJavaScript = "browser:executeJavaScript",
    /**
     * 获取焦点目标
     */
    obtainFocusedTarget = "browser:obtainFocusedTarget",
}

export enum IPCFileMaping {
    /**
     * 是否是目录
     */
    isDir = "file:isDir",
    /**
     * 创建目录
     */
    mkdir = "file:mkdir",
    /**
     * 删除目录
     */
    rmdir = "file:rmdir",
    /**
     * 读取目录
     */
    readdir = "file:readdir",
    /**
     * 是否是文件
     */
    isFile = "file:isFile",
    /**
     * 删除文件
     */
    unlink = "file:unlink",
    /**
     * 读取文件
     */
    readFile = "file:readFile",
    /**
     * 拷贝文件
     */
    copyFile = "file:copyFile",
}

export enum IPCFileDialogMaping {
    /**
     * 打开目录
     */
    openDir = "filedialog:openDir",
    /**
     * 打开文件
     */
    openFile = "filedialog:openFile",
    /**
     * 保存文件
     */
    saveFile = "filedialog:saveFile",
}

export enum IPCSessionMaping {
    /**
     * 获取所有
     */
    obtainAll = "session:obtainAll",
}

export enum IPCShellMaping {
    /**
     * 打开路径
     */
    openPath = "shell:openPath",
    /**
     * 显示文件夹
     */
    showFolder = "shell:showFolder",
}

export enum IPCSocksMaping {
    /**
     * 连接
     */
    connect = "socks:connect",
}

export enum IPCWebViewMaping {
    /**
     * 获取
     */
    obtain = "webview:obtain",
    /**
     * 获取ID
     */
    obtainID = "webview:obtainID",
    /**
     * 获取所有
     */
    obtainAll = "webview:obtainAll",
    /**
     * 清除缓存
     */
    clearCache = "webview:clearCache",
    /**
     * 清除存储
     */
    clearStorage = "webview:clearStorage",
    /**
     * 跳转
     */
    goto = "webview:goto",
    /**
     * 发送
     */
    send = "webview:send",
    /**
     * 停止
     */
    stop = "webview:stop",
    /**
     * 关闭
     */
    close = "webview:close",
    /**
     * 代理
     */
    agent = "webview:agent",
    /**
     * 删除
     */
    delete = "webview:delete",
    /**
     * 刷新
     */
    reload = "webview:reload",
    /**
     * 附加
     */
    attach = "webview:attach",
    /**
     * 分离
     */
    detach = "webview:detach",
    /**
     * 截图
     */
    capture = "webview:capture",
    /**
     * 状态
     */
    readyState = "webview:readyState",
    /**
     * 打开开发者工具
     */
    openDevTools = "webview:openDevTools",
    /**
     * 验证附加
     */
    verifyAttached = "webview:verifyAttached",
    /**
     * 执行js
     */
    executeJavaScript = "webview:executeJavaScript",
    /**
     * 指定边界
     */
    specifyBounds = "webview:specifyBounds",
    /**
     * 指定是否可见
     */
    specifyVisible = "webview:specifyVisible",
    /**
     * 指定背景
     */
    specifyBackgroundColor = "webview:specifyBackgroundColor",
}

export enum IPCWindowMaping {
    /**
     * 关闭
     */
    close = "window:close",
    /**
     * 验证
     */
    verify = "window:verify",
    /**
     * 打开基础窗口
     */
    openBase = "window:openBase",
    /**
     * 打开浏览器窗口
     */
    openBrowser = "window:openBrowser",
    /**
     * 应用状态
     */
    applyState = "window:applyState",
    /**
     * 获取屏幕尺寸
     */
    obtainScreenSize = "window:obtainScreenSize",
}
