/**
 * Expected HTTP error, turned into `{ error: { code, message } }` by errorHandler.
 * @example throw new AppError(404, "TRIP_NOT_FOUND", "Trip not found");
 */
export class AppError extends Error {
    /**
     * @param {number} status HTTP status code (400, 401, 403, 404, 409, 429...)
     * @param {string} code Machine-readable error code
     * @param {string} message Human-readable message, safe to send to the client
     */
    constructor(status, code, message) {
        super(message);
        this.status = status;
        this.code = code;
    }
}
