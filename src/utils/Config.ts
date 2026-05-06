import { BrowserViewConstructorOptions, session } from "electron";
import EngineConfig from "engine.config.json";
import { resolve } from "path";
import {
    IPCBrowserConstructorConfig,
    IPCBrowserConstructorOptions,
} from "../ipc/utils/Browser";
import {
    IPCWebViewConstructorConfig,
    IPCWebViewConstructorOptions,
} from "../ipc/utils/WebView";
import {
    IPCWindowConstructorConfig,
    IPCWindowConstructorOptions,
} from "../ipc/utils/Window";

const {
    title,
    electron: {
        out: { preload },
    },
} = EngineConfig;
/**
 * 配置工具
 */
export abstract class UtilConfig {
    /**
     * 配置基础窗口选项
     * @param config
     */
    public static async configureBaseWindowOptions(
        config?: IPCWindowConstructorConfig,
    ): Promise<IPCWindowConstructorOptions> {
        const // 尺寸映射
            sizeMap: Record<
                IPCWindowConstructorOptions["size"] & string,
                [number, number]
            > = {
                small: [384, 216],
                middle: [768, 432],
                large: [1152, 648],
                xlarge: [1536, 864],
            },
            // 默认配置
            defaultConfig: IPCWindowConstructorConfig = {
                title,
                show: true,
                size: "middle",
            },
            // 合并配置
            mergeConfig: IPCWindowConstructorConfig = {
                ...defaultConfig,
                ...config,
            },
            // 最终选项
            finalOptions: IPCWindowConstructorOptions = {
                width: sizeMap[mergeConfig.size!][0],
                height: sizeMap[mergeConfig.size!][1],
                ...mergeConfig,
            };
        return finalOptions;
    }
    /**
     * 配置浏览器窗口选项
     * @param config
     */
    public static async configureBrowserWindowOptions(
        config?: IPCBrowserConstructorConfig,
    ): Promise<IPCBrowserConstructorOptions> {
        const // 基础窗口选项
            baseWindowOptions: IPCWindowConstructorOptions =
                await this.configureBaseWindowOptions(config),
            // 网络视图选项
            webViewOptions: IPCWebViewConstructorOptions =
                await this.configureWebViewOptions(config),
            // 默认配置
            defaultConfig: IPCBrowserConstructorConfig = {},
            // 合并配置
            mergeConfig: IPCBrowserConstructorConfig = {
                ...defaultConfig,
                ...baseWindowOptions,
                ...webViewOptions,
            },
            // 最终选项
            finalOptions: IPCBrowserConstructorOptions = {
                ...mergeConfig,
            };
        return finalOptions;
    }
    /**
     * 配置网络视图选项
     * @param config
     */
    public static async configureWebViewOptions(
        config?: IPCWebViewConstructorConfig,
    ): Promise<IPCWebViewConstructorOptions> {
        const // 默认配置
            defaultConfig: IPCWebViewConstructorConfig = {
                cache: true,
                persistent: true,
                partition: "default",
            },
            // 合并配置
            mergeConfig: IPCWebViewConstructorConfig = {
                ...defaultConfig,
                ...config,
                partition: config?.partition ?? defaultConfig.partition,
                trustCertificate: config?.trustCertificate ?? config?.relative,
            },
            // 偏好选项
            webPreferencesOptions: BrowserViewConstructorOptions["webPreferences"] =
            {
                preload: mergeConfig?.preload
                    ? resolve(import.meta.dirname, preload)
                    : void 0,
                session: mergeConfig?.partition
                    ? session.fromPartition(
                        mergeConfig.persistent
                            ? `persist:${mergeConfig.partition}`
                            : mergeConfig.partition,
                        { cache: !!mergeConfig.cache },
                    )
                    : session.defaultSession,
            },
            // 最终选项
            finalOptions: IPCWebViewConstructorOptions = {
                ...mergeConfig,
                webPreferences: {
                    ...webPreferencesOptions,
                    ...config?.webPreferences,
                },
            };
        return finalOptions;
    }
}
