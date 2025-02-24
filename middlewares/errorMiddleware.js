const ErrorResponse = require("../utils/errorResponse"); 

const errorHandler = (err, req, res, next) => {
    let error = { ...err };
    error.message = err.message;

    // Mongoose CastError (eg: invalid ObjectId)
    if (err.name === 'CastError') { 
        const message = 'Resource Not Found';
        error = new ErrorResponse(message, 404);
    }

    // Mongoose Duplicate Key Error
    if (err.code === 11000) {
        const message = 'Duplicate field value entered';
        error = new ErrorResponse(message, 400);  
    }

    // Mongoose ValidationError (eg: required fields missing)
    if (err.name === "ValidationError") {
        const message = Object.values(err.errors).map(val => val.message).join(", ");
        error = new ErrorResponse(message, 400);
    }

    // Send JSON response
    res.status(error.statusCode || 500).json({
        success: false,
        error: error.message || "Server Error",
    });
};

module.exports = errorHandler;