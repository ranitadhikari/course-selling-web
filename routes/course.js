const {Router} = require("express");
const courseRouter = Router();

courseRouter.get('/purchase',function(req,res){
    res.json({
        msg:"hello course 1"
    })
})
courseRouter.get('/preview',function(req,res){
    res.json({
        msg:"hello course 2"
    })
})

module.exports = {
    courseRouter:courseRouter
}