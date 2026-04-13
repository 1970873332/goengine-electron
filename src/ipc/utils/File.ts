import { UtilError } from "@electron/utils/Error";
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
import BaseUtils from "../Index";
import { IPCFileMaping } from "../Maps";

/**
 * 文件工具
 */
export class FileUtils extends BaseUtils {
    public config: Record<
        string,
        (event: IpcMainInvokeEvent, ...args: any[]) => any
    > = {
            [IPCFileMaping.isDir]: FileUtils.isDir,
            [IPCFileMaping.mkdir]: FileUtils.mkdir,
            [IPCFileMaping.rmdir]: FileUtils.rmdir,
            [IPCFileMaping.readdir]: FileUtils.readdir,
            [IPCFileMaping.isFile]: FileUtils.isFile,
            [IPCFileMaping.unlink]: FileUtils.unlink,
            [IPCFileMaping.readFile]: FileUtils.readFile,
            [IPCFileMaping.copyFile]: FileUtils.copyFile,
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
            throw UtilError.submit(error, `获取文件信息失败: ${path}`);
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
            throw UtilError.submit(error, `获取目录失败: ${path}`);
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
            throw UtilError.submit(error, `读取文件失败: ${path}`);
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
            if (!(await FileUtils.isDir(event, path))) {
                const dirName: string | undefined = await mkdir(path, {
                    recursive: true,
                });
                if (typeof dirName === "string") return dirName;
                else throw new Error(dirName);
            }
            return path;
        } catch (error: unknown) {
            throw UtilError.submit(error, `创建目录失败: ${path}`);
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
            const stats = await FileUtils.stat(event, from);

            if (stats.isDirectory()) {
                const dirName: string | undefined = from.split("\\").pop(),
                    targetDir: string = `${to}\\${dirName}`;

                await FileUtils.mkdir(event, targetDir);

                const files = await FileUtils.readdir(event, from);
                for (const file of files) {
                    const sourcePath: string = `${from}\\${file}`,
                        targetPath: string = `${targetDir}\\${file}`,
                        isFile: boolean = await FileUtils.isFile(
                            event,
                            sourcePath,
                        );

                    await FileUtils.copyFile(
                        event,
                        sourcePath,
                        isFile ? targetPath : targetDir,
                    );
                }
            } else if (stats.isFile()) await copyFile(from, to);
        } catch (error: unknown) {
            throw UtilError.submit(error, `拷贝文件失败: ${from} -> ${to}`);
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
            if (await FileUtils.isDir(event, path)) {
                await rm(path, { recursive: true, force: true });
            }
        } catch (error: unknown) {
            throw UtilError.submit(error, `删除目录失败: ${path}`);
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
            if (await FileUtils.isFile(event, path)) {
                await unlink(path);
            }
        } catch (error: unknown) {
            throw UtilError.submit(error, `删除文件失败: ${path}`);
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
            throw UtilError.submit(error, `写入文件失败: ${path}`);
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
            const result = await FileUtils.stat(event, path);
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
            const result = await FileUtils.stat(event, path);
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
            await FileUtils.stat(event, path);
            return true;
        } catch {
            return false;
        }
    }
}
