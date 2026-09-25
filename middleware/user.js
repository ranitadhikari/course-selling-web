const jwt = require("jsonwebtoken");
const {JWT_SECRET_USERS} = require("../config");


function userMiddleware(req,res,next){

    const token = req.headers.token;
    
    const response = jwt.verify(token,JWT_SECRET_USERS);
    
    if(response){
        req.userId = response.id;
        next();
    }else{
        res.status(403).json({
            msg:"Incorrect creds"
        })
    }
}

module.exports = ({
    userMiddleware
})