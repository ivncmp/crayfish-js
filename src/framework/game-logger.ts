/**
 * LoggerOrigin
 */
export type LoggerOrigin = any;

/**
 * GameLogger
 */
export class GameLogger {

    /**
     * info
     */
    static info(origin: LoggerOrigin | undefined, content: any) {

        GameLogger._log(console.info, origin, content);
    }

    /**
     * error
     */
    static error(origin: LoggerOrigin | undefined, content: any) {

        if (content.stack) {
            GameLogger._log(console.error, origin, content.stack);
        } else {
            GameLogger._log(console.error, origin, content);
        }
    }

    /**
     * debug
     */
    static debug(origin: LoggerOrigin | undefined, content: any) {

        GameLogger._log(console.debug, origin, content);
    }

    /**
     * _log
     */
    static _log(fn: any, origin: LoggerOrigin | undefined, content: any) {

        const contentValue = (typeof content == 'string')
            ? content.trim() : content.toString();
        const constructorName = origin?.constructor?.name || undefined;

        /**
         * included
         */
        function included(contentRestriction: string): boolean {

            if (contentValue.includes(contentRestriction)) {
                return true;
            }

            if (constructorName && constructorName.includes(contentRestriction)) {
                return true;
            }

            return false;
        }

        // log it!

        if (constructorName && constructorName != "Function") {
            fn("[", constructorName, "]", contentValue);
        } else {
            fn(contentValue);
        }
    }
}