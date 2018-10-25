
module.exports = async activity => {
    try {
        // implement your connector here
    } catch (error) {
        var m = error.message;    
        if (error.stack) m = m + ': ' + error.stack;

        activity.Response.ErrorCode = 
            (error.response && error.response.statusCode) || 500;

        activity.Response.Data = { ErrorText: m };
    }

    return activity;
};
