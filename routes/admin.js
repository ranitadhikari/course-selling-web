const { Router } = require("express");
const adminRouter = Router(); 
const {adminModel, courseModel} = require('../db')
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {JWT_SECRET_ADMIN} = require("../config.js");
const {z} = require("zod");
const { adminMiddleware } = require("../middleware/admin.js");
const course = require("./course.js");


adminRouter.post("/signup",async function(req,res){
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

    const hashPassword = await bcrypt.hash(password,5);           //       password -> hash code for safety

    await adminModel.create({
        email,
        password:hashPassword,
        firstName,
        lastName
    })

    res.json({
        msg:"signed Up"
    })
})
adminRouter.post("/signin",async function(req,res){
    const {email,password} = req.body;
    const admin = await adminModel.findOne({
        email:email
    })
    if(!admin){
        return res.status(400).json({
            msg:"no username found"
        })
    }

    const matchPass = await bcrypt.compare(password,admin.password); // pass -> entered by admin  admin.pass -> hashed pass in database

    if(matchPass){
        const token = jwt.sign({
            id:admin._id.toString()
        },JWT_SECRET_ADMIN);
        res.json({
            token:token
        })
    }else{
        res.status(400).json({
            msg:"wrong pass"
        })
    }
})
adminRouter.post("/course",adminMiddleware,async function(req,res){
    const adminId = req.userId;
    const {title,
        description,
        price,
        imgURL} = req.body;

    const course =await courseModel.create({
        title,
        description,
        price,
        imgURL,
        creatorId:adminId
    })
    res.json({
        msg:"course created",
        courseId:course._id
    })
})

adminRouter.put("/course",adminMiddleware,async function(req,res){
    const adminId = req.userId;
    const {title,
        description,
        price,
        imgURL,
        courseId} = req.body;

    const course =await courseModel.updateOne({
        _id:courseId,
        creatorId:adminId
    },{
        title,
        description,
        price,
        imgURL
    })
    if(_id === courseId && creatorId === adminId){
            res.json({
                msg:"course Updated",
                courseId:course._id
            })
    }else{
        res.json({
            msg:"Wrong Creator accessing wrong course"
        })
    }
})

adminRouter.get('/course/bulk',adminMiddleware,async function(req,res){
    const adminId =req.userId;
    const courses = await courseModel.find({
        _id:courseId,
        creatorId:adminId
    })
    res.json({
        msg:"course Updated",
        courses
    })
})

module.exports = {
    adminRouter:adminRouter
}