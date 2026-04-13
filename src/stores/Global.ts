import { userData } from "package.json";
import { app } from "electron";
import { join, resolve } from "path";

const {
    web: { build },
} = userData;

export default class Global {
    /**
     * web路径
     */
    public static webURL: string = join(build, "index.html");
    /**
     * 入口地址
     */
    public static uri: string = app.isPackaged
        ? resolve(app.getAppPath(), this.webURL)
        : `${process.env.USE_AGREEMENT}://${process.env.USE_HOST}:${process.env.USE_PORT}`;
}
