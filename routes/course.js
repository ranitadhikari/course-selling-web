const {Router} = require("express");
const { userMiddleware } = require("../middleware/user");
const { purchaseModel, courseModel } = require("../db");
const courseRouter = Router();

courseRouter.post('/purchase',userMiddleware,async function(req,res){
    const userId = req.userId;
    const courseId= req.body.courseId;
    //should check the user actually paid or purchased the course
    await purchaseModel.create({
        userId,
        courseId
    })
    res.json({
        msg:"course purchased sucessfully"
    })
})
courseRouter.get('/preview',async function(req,res){
    const courses = await courseModel.find({});
    res.json({
        courses
    })
})

module.exports = {
    courseRouter:courseRouter
}