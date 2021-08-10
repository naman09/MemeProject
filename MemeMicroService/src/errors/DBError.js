class DBError extends Error {
    constructor(message) {
        message = "DB Error: " + String(message);
        super(message);

        //DBError name will be used instead of generic Error in stacktraces
        this.name = this.constructor.name

        // capturing the stack trace keeps the reference to your error class
        Error.captureStackTrace(this, this.constructor);

        if (String(message).search("Validation error") != -1) {
            this.isBadRequest = true;
        }
        this.isOperational = true;
    }
}




module.exports = DBError;