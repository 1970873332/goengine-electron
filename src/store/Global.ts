import { app } from "electron";
import EngineConfig from "@/engine.config.json";
import { existsSync } from "fs";
import { basename, join, resolve } from "path";

const {
    web: { out: dir },
    html: {
        webpack: { out: webpackOut = "index.html" },
        vite: htmlVite = "index.html",
        angular: htmlAngular = "index.html",
    },
} = EngineConfig;

/**
 * 解析打包产物里的 Web 入口文件名：
 * 兼容 webpack（html.webpack.out）、vite（html.vite）、angular（html.angular）三种构建产物。
 */
function webEntry(): string {
    const candidates: string[] = Array.from(
        new Set([
            webpackOut,
            htmlVite,
            basename(htmlVite),
            htmlAngular,
            basename(htmlAngular),
        ]),
    );

    if (app.isPackaged) {
        const found: string | undefined = candidates.find((name) =>
            existsSync(join(app.getAppPath(), dir, name)),
        );
        if (found) return join(dir, found);
    }

    return join(dir, webpackOut);
}

export default class Global {
    /**
     * web路径（按实际构建产物匹配，兼容 webpack / vite 入口名）
     */
    public static webURL: string = webEntry();
    /**
     * 入口地址
     */
    public static uri: string = app.isPackaged
        ? resolve(app.getAppPath(), this.webURL)
        : `${process.env.ENV_PROTOCOL}://${process.env.ENV_HOST}:${process.env.ENV_PORT}`;
}
