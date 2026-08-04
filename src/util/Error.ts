/**
 * 错误工具类
 */
export abstract class ErrorUtils {
    /**
     * 提交
     * @param error
     * @param message
     */
    public static submit(error: unknown, message?: string): void {
        console.error(error, message);
    }
}
