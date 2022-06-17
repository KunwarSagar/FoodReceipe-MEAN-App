const jwt = require("jsonwebtoken");
const util = require("util");

const authenticate = function(req, res, next){
    const response = {status:403, message:{message:"No token provided."}};

    const headerExists = req.headers.authorization;

    if(headerExists){
        const token = req.headers.authorization.split(" ")[1];
        const jwtVerifyAsync = util.promisify(jwt.verify, {context: jwt});
        jwtVerifyAsync(token, process.env.JWT_UNIQUEKEY)
            .then(()=>{
                next();
            })
            .catch((err)=>{
                res.status(401).json({message:"Unauthorised"});
            });
        
    }else{
        return res.status(response.status).json(response.message);
    }

}

module.exports = {
    authenticate
};