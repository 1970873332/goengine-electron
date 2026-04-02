import { SocksClient, SocksClientOptions } from "socks";
import { SocksClientEstablishedEvent } from "socks/typings/common/constants";
import { UtilError } from "../utils/Error";

/**
 * socks管理
 */
export default class SocksManager extends Map<
    string,
    SocksClientEstablishedEvent | null
> {
    declare protected static instance: SocksManager;
    public static obtainInstance(): SocksManager {
        return (this.instance ??= new this());
    }
    protected constructor() {
        super();
    }

    /**
     * 获取
     * @param options
     * @returns
     */
    public async obtain(
        options: SocksClientOptions,
    ): Promise<SocksClientEstablishedEvent | undefined> {
        const { host, port } = options.proxy;
        try {
            const socks: SocksClientEstablishedEvent =
                this.get(`${host}:${port}`) ??
                (await SocksClient.createConnection(options));
            this.set(`${host}:${port}`, socks);
            return socks;
        } catch (error: unknown) {
            UtilError.submit(error, `获取socks失败: ${host}:${port}`);
        }
    }

    public get(key: string): SocksClientEstablishedEvent | undefined {
        const socks: SocksClientEstablishedEvent | undefined | null = key
            ? super.get(key)
            : void 0;
        return socks ?? void 0;
    }
}
