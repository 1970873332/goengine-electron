/**
 * 错误工具
 */
export abstract class UtilError {
    /**
     * 提交
     * @param error
     * @param message
     */
    public static submit(error: unknown, message?: string): void {
        console.error(error, message);
    }
}
