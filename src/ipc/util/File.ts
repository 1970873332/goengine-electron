import { ErrorUtils } from "@goengine/electron/src/util/Error";
import { IpcMainInvokeEvent } from "electron";
import { Stats } from "fs";
import {
    copyFile,
    mkdir,
    readdir,
    readFile,
    rm,
    stat,
    unlink,
    writeFile,
} from "fs/promises";
import BaseIPC from "../Base";
import { IPCFileMaping } from "../Maps";

/**
 * 文件IPC
 */
export class FileIPC extends BaseIPC {
    public config: Record<
        string,
        (event: IpcMainInvokeEvent, ...args: any[]) => any
    > = {
        [IPCFileMaping.isDir]: FileIPC.isDir,
        [IPCFileMaping.mkdir]: FileIPC.mkdir,
        [IPCFileMaping.rmdir]: FileIPC.rmdir,
        [IPCFileMaping.readdir]: FileIPC.readdir,
        [IPCFileMaping.isFile]: FileIPC.isFile,
        [IPCFileMaping.unlink]: FileIPC.unlink,
        [IPCFileMaping.readFile]: FileIPC.readFile,
        [IPCFileMaping.copyFile]: FileIPC.copyFile,
    };

    /**
     * 获取文件信息
     */
    public static async stat(
        event: IpcMainInvokeEvent | null,
        path: string,
    ): Promise<Stats> {
        try {
            return await stat(path);
        } catch (error: unknown) {
            throw ErrorUtils.submit(error, `获取文件信息失败: ${path}`);
        }
    }
    /**
     * 获取目录结构
     */
    public static async readdir(
        event: IpcMainInvokeEvent | null,
        path: string,
    ): Promise<string[]> {
        try {
            return await readdir(path);
        } catch (error: unknown) {
            throw ErrorUtils.submit(error, `获取目录失败: ${path}`);
        }
    }
    /**
     * 读取文件
     */
    public static async readFile(
        event: IpcMainInvokeEvent | null,
        path: string,
    ): Promise<Buffer> {
        try {
            return await readFile(path);
        } catch (error: unknown) {
            throw ErrorUtils.submit(error, `读取文件失败: ${path}`);
        }
    }
    /**
     * 创建目录
     */
    public static async mkdir(
        event: IpcMainInvokeEvent | null,
        path: string,
    ): Promise<string> {
        try {
            if (!(await FileIPC.isDir(event, path))) {
                const dirName: string | undefined = await mkdir(path, {
                    recursive: true,
                });
                if (typeof dirName === "string") return dirName;
                else throw new Error(dirName);
            }
            return path;
        } catch (error: unknown) {
            throw ErrorUtils.submit(error, `创建目录失败: ${path}`);
        }
    }
    /**
     * 拷贝文件或目录
     */
    public static async copyFile(
        event: IpcMainInvokeEvent | null,
        from: string,
        to: string,
    ): Promise<void> {
        try {
            const stats = await FileIPC.stat(event, from);

            if (stats.isDirectory()) {
                const dirName: string | undefined = from.split("\\").pop(),
                    targetDir: string = `${to}\\${dirName}`;

                await FileIPC.mkdir(event, targetDir);

                const files = await FileIPC.readdir(event, from);
                for (const file of files) {
                    const sourcePath: string = `${from}\\${file}`,
                        targetPath: string = `${targetDir}\\${file}`,
                        isFile: boolean = await FileIPC.isFile(
                            event,
                            sourcePath,
                        );

                    await FileIPC.copyFile(
                        event,
                        sourcePath,
                        isFile ? targetPath : targetDir,
                    );
                }
            } else if (stats.isFile()) await copyFile(from, to);
        } catch (error: unknown) {
            throw ErrorUtils.submit(error, `拷贝文件失败: ${from} -> ${to}`);
        }
    }
    /**
     * 删除目录
     */
    public static async rmdir(
        event: IpcMainInvokeEvent | null,
        path: string,
    ): Promise<void> {
        try {
            if (await FileIPC.isDir(event, path)) {
                await rm(path, { recursive: true, force: true });
            }
        } catch (error: unknown) {
            throw ErrorUtils.submit(error, `删除目录失败: ${path}`);
        }
    }
    /**
     * 删除文件
     */
    public static async unlink(
        event: IpcMainInvokeEvent | null,
        path: string,
    ): Promise<void> {
        try {
            if (await FileIPC.isFile(event, path)) {
                await unlink(path);
            }
        } catch (error: unknown) {
            throw ErrorUtils.submit(error, `删除文件失败: ${path}`);
        }
    }
    /**
     * 写入文件
     */
    public static async writeFile(
        event: IpcMainInvokeEvent | null,
        path: string,
        data: string | Buffer,
    ): Promise<void> {
        try {
            await writeFile(path, data);
        } catch (error: unknown) {
            throw ErrorUtils.submit(error, `写入文件失败: ${path}`);
        }
    }
    /**
     * 是否是文件
     */
    public static async isFile(
        event: IpcMainInvokeEvent | null,
        path: string,
    ): Promise<boolean> {
        try {
            const result = await FileIPC.stat(event, path);
            return result.isFile();
        } catch {
            return false;
        }
    }
    /**
     * 是否是目录
     */
    public static async isDir(
        event: IpcMainInvokeEvent | null,
        path: string,
    ): Promise<boolean> {
        try {
            const result = await FileIPC.stat(event, path);
            return result.isDirectory();
        } catch {
            return false;
        }
    }
    /**
     * 检查文件或目录是否存在
     */
    public static async exists(
        event: IpcMainInvokeEvent | null,
        path: string,
    ): Promise<boolean> {
        try {
            await FileIPC.stat(event, path);
            return true;
        } catch {
            return false;
        }
    }
}
