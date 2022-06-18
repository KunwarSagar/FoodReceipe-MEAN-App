const User = require("mongoose").model(process.env.USER_MODEL);
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const util = require("util");

const _noOfRounds = parseInt(process.env.BCRYPT_NO_OF_ROUNDS, process.env.RADIX);

/**
 * Register user
 * @param {*} req 
 * @param {*} res 
 */
const register = function (req, res) {
    if (req.body && req.body.name && req.body.email && req.body.password && req.body.username) {

        const response = { status: process.env.DEFAULT_CODE, message: {} };

        const userDataWithOutPassword = {
            name: req.body.name,
            email: req.body.email,
            username: req.body.username,
        }

        bcrypt.genSalt(_noOfRounds)
            .then((saltValue) => _hashPassword(saltValue, req.body.password))
            .then((hashedPassword) => __createUser(hashedPassword, userDataWithOutPassword, response))
            .then((user) => _fileResponse(process.env.ADD_SUCCESS_CODE, user, response, process.env.USER_ADD_FAILED))
            .catch((error) => _fileResponse(process.env.ERROR_CODE, error, response, process.env.USER_ADD_FAILED))
            .finally(() => _sendResponse(res, response));

    }
}

/**
 * Login User
 * @param {*} req 
 * @param {*} res 
 */
const login = function (req, res) {

    if (req.body && req.body.username && req.body.password) {
        const response = { status: process.env.DEFAULT_CODE, message: {} }

        User.findOne({ username: req.body.username })
            .exec()
            .then((user) => _checkAccount(user))
            .then((user) => _checkPassword(user, req.body.password))
            .then((result) => _createToken(result))
            .then((token) => _fileResponse(process.env.GET_SUCCESS_CODE, { success: true, _token: token }, response, process.env.UNAUTHORISED))
            .catch((err) => _fileResponse(process.env.ERROR_CODE, err, response, process.env.UNAUTHORISED))
            .finally(() => _sendResponse(res, response));
    }
}

/**
 * hash password with bcrypt
 */
_hashPassword = function (saltValue, password) {
    return bcrypt.hash(password, saltValue);
}

/**
 * create user 
 */
__createUser = function (hashedPassword, userDataWithOutPassword, response) {
    const userDataWithHashedPassword = { ...userDataWithOutPassword, password: hashedPassword };
    return User.create(userDataWithHashedPassword);
}

/**
 * check if account exists
 */
_checkAccount = function (user) {
    return new Promise((resolve, reject) => {
        if (!user) {
            reject();
        } else {
            resolve(user);
        }
    });
}

/**
 * check if passwords match
 */
_checkPassword = async function (user, password) {
    return bcrypt.compare(password, user.password)
        .then(matched => {
            if (!matched) {
                return { matched: false }
            } else {
                return { matched: true, name: user.name }
            }
        })
        .catch(err => {
            return { matched: false };
        });
}

/**
 * create jwt token
 */
_createToken = function (result) {
    if (result.matched) {
        const jwtSignAsync = util.promisify(jwt.sign, { context: jwt });
        return jwtSignAsync({ name: result.name }, process.env.JWT_UNIQUEKEY, { expiresIn: parseInt(process.env.JWT_EXPIRE_TIME, process.env.RADIX) });
    } else {
        return new Promise((resolve, reject) => reject());
    }
}

/**
 * set response for all callbacks
 */
_fileResponse = function (status, data, response, message) {
    if (status == process.env.ERROR_CODE) {
        response.status = process.env.ERROR_CODE;
        response.message = { message: message };
    } else {
        if (data) {
            response.status = status;
            response.message = data;
        } else {
            response.status = process.env.IS_NOT_VALID_CODE;
            response.message = { message: message };
        }
    }
}

/**
 * send response of all the methods
 */
_sendResponse = function (res, response) {
    res.status(parseInt(response.status, process.env.RADIX)).json(response.message);
}

module.exports = {
    register,
    login
}