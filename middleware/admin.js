const jwt = require("jsonwebtoken");
const {JWT_SECRET_ADMIN} = require("../config");
const admin = require("../routes/admin");

function adminMiddleware(req,res,next){

    const token = req.headers.token;
    
    const response = jwt.verify(token,JWT_SECRET_ADMIN);
    
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
    adminMiddleware
})