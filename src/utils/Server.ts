import { check } from "tcp-port-used";

/**
 * 服务工具
 */
export class UtilServer {
    /**
     * 获取空闲端口
     * @param start
     * @param max
     * @returns
     */
    public static async obtainIdlePort(
        port: number,
        endPort: number,
    ): Promise<number> {
        if (port > endPort) return 0;
        const idle: boolean = await check(port);
        if (!idle) return port;
        return await this.obtainIdlePort(port + 1, endPort);
    }
}
