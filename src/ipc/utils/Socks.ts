import { IpcMainInvokeEvent } from "electron";
import {
    SocksClientEstablishedEvent,
    SocksRemoteHost,
} from "socks/typings/common/constants";
import SocksManager from "../../managers/Socks";
import { UtilServer } from "../../utils/Server";
import BaseUtils from "../Index";
import { IPCSocksMaping } from "../Maps";

/**
 * Socks工具
 */
export class SocksUtils extends BaseUtils {
    public config: Record<
        string,
        (event: IpcMainInvokeEvent, ...args: any[]) => any
    > = {
        [IPCSocksMaping.connect]: SocksUtils.connect,
    };

    /**
     * 连接
     */
    public static async connect(
        event: IpcMainInvokeEvent | null,
        proxy: SocksRemoteHost,
    ): Promise<string> {
        const { host, port } = proxy,
            resultPort: number | undefined = await UtilServer.obtainIdlePort(
                port,
                port + 10,
            );
        if (typeof resultPort !== "number") return "";

        const socksEvent: SocksClientEstablishedEvent | undefined =
            await SocksManager.obtainInstance().obtain({
                command: "connect",
                destination: {
                    host,
                    port,
                },
                proxy: {
                    host: "127.0.0.1",
                    port: resultPort,
                    type: 5,
                },
            });
        if (!socksEvent) return "";
        return `${socksEvent.remoteHost?.host}:${socksEvent.remoteHost?.port}`;
        return `socks5://${host}:${resultPort}`;
    }
}
