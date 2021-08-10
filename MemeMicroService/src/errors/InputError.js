class InputError extends Error {
    constructor(message) {
        message = "Input Error: " + message;
        super(message);

        //DBError name will be used instead of generic Error in stacktraces
        this.name = this.constructor.name

        // capturing the stack trace keeps the reference to your error class
        Error.captureStackTrace(this, this.constructor);

        error.isBadRequest = true;
    }
}
module.exports = InputError;