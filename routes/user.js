const {Router} = require("express");
const userRouter = Router();
const jwt = require("jsonwebtoken");
const { userModel } = require("../db");
const {JWT_SECRET_USERS} = require("../config")
const bcrypt = require("bcrypt"); // pass -> hash 
const {z} = require('zod');    // for required body format 

userRouter.post('/signup',async function(req,res){
    const requiredBody = z.object({
        email:z.string().min(3).max(50).email(),
        password:z.string().min(3).max(50),
        firstName:z.string().min(3).max(50),
        lastName:z.string().min(3).max(30)
    })

    const parseData = requiredBody.safeParse(req.body);     //checks wether the inputs satisfies the required body we need

    if(!parseData.success){
        return res.status(400).json({
            msg:"wrong format",
            error: parseData.error.issues
        })
        
    }

    const { email, password, firstName, lastName } = req.body;

    // const email = req.body.email;
    // const password = req.body.password;
    // const firstName = req.body.firstName;
    // const lastName = req.body.lastName;

    const hashPassword = await bcrypt.hash(password,5)           //       password -> hash code for safety

    userModel.create({
        email,
        password:hashPassword,
        firstName,
        lastName
    })

    res.json({
        msg:"signed Up"
    })
})
userRouter.post('/signin',async function(req,res){

    const {email,password} = req.body;
    const user = await userModel.findOne({
        email:email
    })
    if(!user){
        res.status(400).json({
            msg:"no username found"
        })
    }

    const matchPass = bcrypt.compare(password,user.password); // pass -> entered by user  user.pass -> hashed pass in database

    if(matchPass){
        const token = jwt.sign({
            id:user._id.toString()
        },JWT_SECRET_USERS);
        res.json({
            token:token
        })
    }else{
        res.status(400).json({
            msg:"wrong pass"
        })
    }

})
userRouter.get('/purchases',function(req,res){
    res.json({
        msg:"hello"
    })
})

module.exports = {
    userRouter:userRouter
}