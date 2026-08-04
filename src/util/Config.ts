import { BrowserViewConstructorOptions, session } from "electron";
import EngineConfig from "@/engine.config.json";
import { resolve } from "path";
import {
    BrowserIPCConstructorConfig,
    BrowserIPCConstructorOptions,
} from "../ipc/util/Browser";
import {
    WebViewIPCConstructorConfig,
    WebViewIPCConstructorOptions,
} from "../ipc/util/WebView";
import {
    WindowIPCConstructorConfig,
    WindowIPCConstructorOptions,
} from "../ipc/util/Window";

const {
    title,
    electron: {
        out: { preload },
    },
} = EngineConfig;
/**
 * 配置工具类
 */
export abstract class ConfigUtils {
    /**
     * 配置基础窗口选项
     * @param config
     */
    public static async configureBaseWindowOptions(
        config?: WindowIPCConstructorConfig,
    ): Promise<WindowIPCConstructorOptions> {
        const // 尺寸映射
            sizeMap: Record<
                Required<WindowIPCConstructorOptions>["size"],
                [number, number]
            > = {
                small: [384, 216],
                middle: [768, 432],
                large: [1152, 648],
                xlarge: [1536, 864],
            },
            // 默认配置
            defaultConfig: WindowIPCConstructorConfig = {
                title,
                show: true,
                size: "middle",
            },
            // 合并配置
            mergeConfig: WindowIPCConstructorConfig = {
                ...defaultConfig,
                ...config,
            },
            // 最终选项
            finalOptions: WindowIPCConstructorOptions = {
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
        config?: BrowserIPCConstructorConfig,
    ): Promise<BrowserIPCConstructorOptions> {
        const // 基础窗口选项
            baseWindowOptions: WindowIPCConstructorOptions =
                await this.configureBaseWindowOptions(config),
            // 网络视图选项
            webViewOptions: WebViewIPCConstructorOptions =
                await this.configureWebViewOptions(config),
            // 默认配置
            defaultConfig: BrowserIPCConstructorConfig = {},
            // 合并配置
            mergeConfig: BrowserIPCConstructorConfig = {
                ...defaultConfig,
                ...baseWindowOptions,
                ...webViewOptions,
            },
            // 最终选项
            finalOptions: BrowserIPCConstructorOptions = {
                ...mergeConfig,
            };
        return finalOptions;
    }
    /**
     * 配置网络视图选项
     * @param config
     */
    public static async configureWebViewOptions(
        config?: WebViewIPCConstructorConfig,
    ): Promise<WebViewIPCConstructorOptions> {
        const // 默认配置
            defaultConfig: WebViewIPCConstructorConfig = {
                cache: true,
                persistent: true,
                partition: "default",
            },
            // 合并配置
            mergeConfig: WebViewIPCConstructorConfig = {
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
            finalOptions: WebViewIPCConstructorOptions = {
                ...mergeConfig,
                webPreferences: {
                    ...webPreferencesOptions,
                    ...config?.webPreferences,
                },
            };
        return finalOptions;
    }
}
