import {
    BrowserFingerprintWithHeaders,
    FingerprintGenerator,
    FingerprintGeneratorOptions,
} from "fingerprint-generator";
import { FingerprintInjector } from "fingerprint-injector";

/**
 * 指纹管理
 */
export default abstract class FingerprintManager {
    /**
     * 移动预设
     */
    public static readonly mobile: Partial<FingerprintGeneratorOptions> = {
        devices: ["mobile"],
        browsers: ["chrome", "safari"],
        operatingSystems: ["android", "ios"],
        locales: ["en-US"],
        screen: {
            minWidth: 360,
            maxWidth: 414,
            minHeight: 640,
            maxHeight: 896,
        },
    };
    /**
     * macos预设
     */
    public static readonly macSafari: Partial<FingerprintGeneratorOptions> = {
        devices: ["desktop"],
        browsers: ["safari"],
        operatingSystems: ["macos"],
        locales: ["en-US"],
        screen: {
            minWidth: 1440,
            maxWidth: 2560,
            minHeight: 900,
            maxHeight: 1600,
        },
    };
    /**
     * windows预设
     */
    public static readonly windowsChrome: Partial<FingerprintGeneratorOptions> =
        {
            devices: ["desktop"],
            browsers: ["chrome"],
            operatingSystems: ["windows"],
            locales: ["en-US"],
            screen: {
                minWidth: 1440,
                maxWidth: 2560,
                minHeight: 900,
                maxHeight: 1600,
            },
        };

    /**
     * 指纹生成
     */
    public static readonly fingerprintGenerator: FingerprintGenerator =
        new FingerprintGenerator();
    /**
     * 指纹注入
     */
    public static readonly fingerprintInjector: FingerprintInjector =
        new FingerprintInjector();

    /**
     * 获取
     * @param options
     * @returns
     */
    public static obtain(
        options?: Partial<FingerprintGeneratorOptions>,
    ): BrowserFingerprintWithHeaders {
        return this.fingerprintGenerator.getFingerprint(options);
    }
    /**
     * 获取
     * @param headers
     * @returns
     */
    public static obtainInjectorScript(
        headers: BrowserFingerprintWithHeaders,
    ): string {
        return this.fingerprintInjector.getInjectableScript(headers);
    }
}
