const jwt = require("jsonwebtoken");
const util = require("util");

const authenticate = function (req, res, next) {
    const response = { status: process.env.NOT_PROVIDED_CODE, message: { message: process.env.NO_TOKEN } };
    const headerExists = req.headers.authorization;

    if (headerExists) {
        const token = req.headers.authorization.split(" ")[1];
        const jwtVerifyAsync = util.promisify(jwt.verify, { context: jwt });
        jwtVerifyAsync(token, process.env.JWT_UNIQUEKEY)
            .then(() => {
                next();
            })
            .catch((err) => _catchErrorAndSend(res, response));

    } else {
        _sendResponse(res, response)
    }
}

_catchErrorAndSend = function (res, response) {
    response.status = process.env.UNAUTHORISED_CODE;
    response.message = process.env.UNAUTHORISED;
    _sendResponse(res, response)
}

_sendResponse = function (res, response) {
    res.status(parseInt(response.status, process.env.RADIX)).json(response.message);
}

module.exports = {
    authenticate
};