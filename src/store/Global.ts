import { app } from "electron";
import EngineConfig from "@/engine.config.json";
import { join, resolve } from "path";

const {
    web: { out, index = "index.html" },
} = EngineConfig;

export default class Global {
    /**
     * web路径
     */
    public static webURL: string = join(out, index);
    /**
     * 入口地址
     */
    public static uri: string = app.isPackaged
        ? resolve(app.getAppPath(), this.webURL)
        : `${process.env.ENV_PROTOCOL}://${process.env.ENV_HOST}:${process.env.ENV_PORT}`;
}
