var express=require("express");
var router=express.Router();
var Lab=require('../models/admin/lab');
var bodyParser = require('body-parser');
const path=require("path");
const multer=require('multer');
router.get('/labAdmin',(req,res)=>{
    res.render('labAdmin');
})
var storage=multer.diskStorage({
    destination:"public/uploads/",
    filename:function(req,file,callback){
        callback(null,file.fieldname + '-' + Date.now() +path.extname(file.originalname));
    }
  })

var uploads=multer({
    storage:storage
}).single('image');
  
router.post('/labAdmin',uploads,(req,res)=>{
    var heading=req.body.optradio;
    var description=req.body.description;
    var link=req.body.link;
    console.log(req.file.filename);
    var LabData=new Lab();
    LabData.heading=heading;
    LabData.description=description;
    LabData.link=link;
    LabData.image=req.file.filename;
    Lab.StoreData(LabData,(err,LabData)=>{
        if(err)throw err;
        console.log(LabData);
        res.redirect('/lab');
    })

})
router.get('/',(req,res)=>{
    res.render('admin');
})
router.get('/editLabAdmin',(req,res)=>{
    res.render('editLabAdmin');
})
router.post('/editLabAdmin',(req,res)=>{
    console.log(req.body.id);
    Lab.findById(req.body.id).exec((err,result)=>{
        if(err)throw err;
        res.send(result).json;
    })
})
router.post('/courseSubject',(req,res)=>{
    Lab.find({}).select('heading').exec(function (err, result) {
        if (err) throw err;
        res.send(result).json;
      })
})
router.post('/update',uploads,(req,res,next)=>{
    var id=req.body.id;
    if(req.file){
    Lab.findByIdAndUpdate(id,{link:req.body.link,image:req.file.filename,description:req.body.description,heading:req.body.optradio},function(err,result){
        if(err){
            res.send(err);
        }
        else{
            console.log("Updated successfully",result)
            res.redirect('labAdmin');
        }
    });}
    else{
        Lab.findByIdAndUpdate(id,{link:req.body.link,heading:req.body.optradio,description:req.body.description},function(err,result){
            if(err){
                res.send(err);
            }
            else{
                console.log("Updated successfully1",result)
                res.redirect('labAdmin');
            }
        });
    }
   next;
})
module.exports = router;