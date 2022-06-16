const User = require("mongoose").model(process.env.USER_MODEL);
const { fail } = require("assert");
const bcrypt =  require("bcrypt");
const jwt = require("jsonwebtoken");
const util = require("util");

const _noOfRounds = parseInt(process.env.BCRYPT_NO_OF_ROUNDS, process.env.RADIX);

const register = function (req, res) {
    if(req.body && req.body.name && req.body.email && req.body.password && req.body.username){
        
        const response = {status: 204, message:{}};

        const userDataWithOutPassword = {
            name :req.body.name,
            email:req.body.email,
            username:req.body.username,
        }
        
        bcrypt.genSalt(_noOfRounds)
            .then((saltValue) => _hashPassword(saltValue, req.body.password))
            .then((hashedPassword) => __createUser(hashedPassword, userDataWithOutPassword, response))
            .then((user) => _fileResponse(201,user, response, "User add failed."))
            .catch((error) => _fileResponse(500,error, response, "User add failed."))
            .finally(()=>_sendResponse(res, response));

    }
}

const login = function (req, res) {

    if (req.body && req.body.username && req.body.password) {
        const response = {status: 204, message: {}}

        User.findOne({ username: req.body.username })
            .exec()
            .then((user) => _checkAccount(user))
            .then((user) => _checkPassword(user, req.body.password))
            .then((result) => _createToken(result))
            .then((token)=>_fileResponse(201, {success: true, _token:token}, response, "Unauthorised"))
            .catch((err) => _fileResponse(500, err, response, "Unauthorised"))
            .finally(() => _sendResponse(res, response));
    }
}

_hashPassword = function(saltValue, password){
    return bcrypt.hash(password,saltValue);
}

__createUser = function(hashedPassword, userDataWithOutPassword, response){
    const userDataWithHashedPassword = {...userDataWithOutPassword, password:hashedPassword};
    return User.create(userDataWithHashedPassword);
}

_checkAccount = function (user) {
    return new Promise((resolve, reject)=>{
        if (!user) {
            reject();
        }else{
            resolve(user);
        }
    });
}

_checkPassword = async function(user, password){
    return bcrypt.compare(password, user.password)
        .then(matched =>{
            if(!matched){
                return {matched:false}                
            }else{
                return {matched:true, name:user.name}
            }            
        })
        .catch(err =>{
            return {matched:false};
        });
}

_createToken = function(result){
    if(result.matched){
        const jwtSignAsync = util.promisify(jwt.sign, {context: jwt});
        return jwtSignAsync({name:result.name}, process.env.JWT_UNIQUEKEY, {expiresIn: 3600});
    }else{
        return new Promise((resolve, reject) => reject());
    }
}

_fileResponse = function(status, data, response, message){
    if(status == 201){
        if(data){
            response.status = 201;
            response.message = data;
        }else{
            response.status = 204;
            response.message = {message:message};
        }
    }else if(status == 500){
        response.status = 500;
        response.message = {message:message};
    }
}

_sendResponse = function(res, response){
    res.status(response.status).json(response.message);
}

module.exports = {
    register,
    login
}