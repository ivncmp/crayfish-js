import { LoggerOrigin } from "./types";

/**
 * CrayfishLogger
 */
export class CrayfishLogger {

    /**
     * info
     */
    static info(origin: LoggerOrigin | undefined, content: any) {

        CrayfishLogger._log(console.info, origin, content);
    }

    /**
     * error
     */
    static error(origin: LoggerOrigin | undefined, content: any) {

        if (content.stack) {
            CrayfishLogger._log(console.error, origin, content.stack);
        } else {
            CrayfishLogger._log(console.error, origin, content);
        }
    }

    /**
     * warn
     */
    static warn(origin: LoggerOrigin | undefined, content: any) {

        CrayfishLogger._log(console.warn, origin, content);
    }

    /**
     * debug
     */
    static debug(origin: LoggerOrigin | undefined, content: any) {

        CrayfishLogger._log(console.debug, origin, content);
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