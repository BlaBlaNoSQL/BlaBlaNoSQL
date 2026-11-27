import { AppError } from "../utils/AppError.js";

/**
 * Last middleware: the only place that formats error responses.
 * @type {import("express").ErrorRequestHandler}
 */
// eslint-disable-next-line no-unused-vars -- Express needs 4 parameters to detect an error handler
export function errorHandler(err, req, res, next) {
    if (err instanceof AppError) {
        return res.status(err.status).json({ error: { code: err.code, message: err.message } });
    }
    // express.json() errors (malformed JSON, body too large) carry a 4xx status and a safe message
    if (err.status >= 400 && err.status < 500) {
        return res.status(err.status).json({ error: { code: "BAD_REQUEST", message: err.message } });
    }
    console.error(err);
    res.status(500).json({ error: { code: "INTERNAL_ERROR", message: "Internal server error" } });
}
