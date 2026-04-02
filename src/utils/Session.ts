import { ProxyConfig, Request, session, Session } from "electron";
import { UtilWebContents } from "./WebContents";

/**
 * 会话工具
 */
export abstract class UtilSession {
    /**
     * 获取浏览器会话
     * @param winID
     * @returns
     */
    public static obtainBrowserSession(winID?: number): Session | undefined {
        return typeof winID === "number"
            ? (() => {
                  if (winID)
                      return UtilWebContents.obtainBrowserContents(winID)
                          ?.session;
              })()
            : session.defaultSession;
    }
    /**
     * 获取WebView会话
     * @param viewID
     */
    public static obtainWebViewSession(viewID?: string): Session | undefined {
        return typeof viewID === "string"
            ? (() => {
                  if (viewID)
                      return UtilWebContents.obtainWebViewContents(viewID)
                          ?.session;
              })()
            : session.defaultSession;
    }
    /**
     * 清除缓存
     * @param session
     */
    public static async clearCache(session: Session): Promise<void> {
        return new Promise(async (resolve) => {
            await session.clearCache();
            await session.clearAuthCache();
            await session.clearHostResolverCache();
            return resolve();
        });
    }
    /**
     * 清除存储
     * @param session
     */
    public static async clearStorage(session: Session): Promise<void> {
        return session.clearStorageData();
    }
    /**
     * 设置代理
     * @param session
     * @param config
     */
    public static async setProxy(
        session: Session,
        config: ProxyConfig,
    ): Promise<void> {
        return session.setProxy(config);
    }
    /**
     * 设置证书验证
     * @param session
     * @param proc
     */
    public static async setCertificateVerifyProc(
        session: Session,
        proc: (
            request: Request,
            callback: (verificationResult: number) => void,
        ) => void,
    ): Promise<void> {
        session.setCertificateVerifyProc(proc);
    }
}

/**
 * 会话
 */
type TConfig =
    | {
          /**
           * 分区
           * @default default
           */
          partition: string;
          /**
           * 是否缓存
           * @default true
           */
          cache?: boolean;
          /**
           * 是否持久化
           * @default true
           */
          persistent?: boolean;
      }
    | {
          partition?: never;
      };

export { TConfig as UtilSessionConfig };
