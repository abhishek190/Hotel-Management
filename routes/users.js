var express=require('express');
var router=express.Router();
var passport=require('passport');
var bcrypt=require('bcryptjs');
var auth1=require('../config/auth1');
var auth=require('../config/auth');
const path=require("path");
var isLoggedIn=auth1.isLoggedIn;
const multer=require('multer');
require('dotenv').config()
//Get user model
var User = require('../models/user');


//Image upload
var storage=multer.diskStorage({
  destination:"public/uploads/",
  filename:function(req,file,callback){
      callback(null,file.fieldname + '-' + Date.now() +path.extname(file.originalname));
  }
})

var uploads=multer({
  storage:storage
}).single('image');


//Get Register
router.get('/register',function(req,res){
  if(res.locals.user)
  {
    res.redirect("/");
  }
  else
  {
  res.render('index',{
    title:'Register',
  });
}
});
router.post('/register',function(req,res){
   var name=req.body.name;
   var email=req.body.email;
   var username=req.body.username;
   var password=req.body.password;
   var password2=req.body.password2;
   var admin=req.body.isAdmin;
  if(admin==1 && process.env.SECRET_PASSWORD!=req.body.secretPassword)
  {
   // console.log(name);
   req.flash('danger','admin key mismatch')
    res.redirect('/');
  }
  else
  {
    if(admin!=1)
    {
      admin=0;
    }
   req.checkBody('name','name is required!').notEmpty();
   req.checkBody('email','email is required!').isEmail();
   req.checkBody('username','username is required!').notEmpty();
   req.checkBody('password','minimum length of the password must be 8, Try Again!').isLength({ min: 8 });
   req.checkBody('password2','Passwords do not match!').equals(password);
   var errors=req.validationErrors();
   if(errors)
   {
     res.render('index',{
       errors:errors,
       user:null,
       title:'Register'
     })
   }   
   else if(!req.user)
   {
     User.findOne({'local.username':username},function(err,user){
       if(err)
       {
         console.log(err);
       }
        if(user)
        {
          req.flash('danger',"Username exists choose another")
          res.redirect('/users/login');
        }
        else
        {
          User.findOne({'local.email':email},function(err,user){
            if(err)
            {
              console.log(err);
            }
            if(user)
            {
              req.flash('danger',"email exists choose another")
              res.redirect('/users/login');
            }
            else
            {
              var user=new User();
             // console.log(admin);
                  user.local.name=name;
                  user.local.email=email,
                  user.local.username=username,
                  user.local.password=password,
                  user.local.admin=admin,
                  user.local.image='image-1603183764252.png'
                bcrypt.genSalt(10,function(err,salt){
                  bcrypt.hash(user.local.password,salt,function(err,hash){
                    if(err)
                    console.log(err);
                    user.local.password=hash;
                    user.save(function(err){
                      if(err)
                      console.log(err);
                       else
                       {
                        req.flash('success','You are now registered!')
                         res.redirect('/')
                       }                 
                    })
                  })
                });
            }
          });
        }
     })
   }
  else if ( !req.user.local.email ) {
    // ...presumably they're trying to connect a local account
    // BUT let's check if the email used to connect a local account is being used by another user
    User.findOne({ 'local.username' : username }, function(err, user) {
        if (err)
        {
          console.log(err);
        }
        if (user) 
        {
          req.flash('danger',"Username exists choose another")
          res.redirect('/users/login');
        } 
        else 
        {
          User.findOne({ 'local.email' :email}, function(err, user) {
            if (err)
            {
              console.log(err);
            }
            if (user) 
            {
              req.flash('danger',"Email exists choose another")
              res.redirect('/users/login');
            }
            else
            {
              var user = req.user;
              user.local.name=name;
              user.local.email=email,
              user.local.username=username,
              user.local.password=password,
              user.local.admin=admin,
            bcrypt.genSalt(10,function(err,salt){
              bcrypt.hash(user.local.password,salt,function(err,hash){
                if(err)
                console.log(err);
                user.local.password=hash;
                user.save(function(err){
                  if(err)
                  console.log(err);
                   else
                   {
                     req.flash('success','You are now registered!')
                     res.redirect('/lab')
                   }                 
                })
              })
            });
            }
          });
        }
    });
} else {
    // user is logged in and already has a local account. Ignore signup. (You should log out before trying to create a new account, user!)
    res.redirect('/')
}
  }
});
// GET LOGIN ROUTE
router.get('/login',function(req,res){
  //console.log(req.session.flash.error[0]);
  if(res.locals.user!=null)
  {
    res.redirect('/');
  }
  else
  {
    res.render('index',{
    title:'Log in'
  })
  }
});
router.get('/index',(req,res)=>{
  res.render('index');
})
//POST LOGIN ROUTE
router.post('/login',function(req,res,next){
  console.log('login-try')
  passport.authenticate('local',{
    successRedirect:'/lab',
    failureRedirect:'/users/login',
    failureFlash:true
  })(req,res,next);
});
router.get('/Mybooking',(req,res)=>{
  res.render('mybooking')
})
router.get('/edit',(req,res)=>{
  console.log(req.user._id);
  res.render('edit');
})
router.post('/edit',uploads,(req,res,next)=>{
  if(req.file){
    User.findOne({_id:req.user._id}).exec(function(err,result){
      if(err)throw err;
      if(result){
        console.log(result); 
        result.local.name=req.body.name;
        result.local.username=req.body.username;
        result.local.image=req.file.filename;
        result.save();
        console.log("Updated");
        res.redirect('/lab');
      }
      else{
        console.log("Not found");
        res.redirect('/lab');
      }
    })
  }
  else{
     User.findOne({_id:req.user._id}).exec(function(err,result){
       if(err)throw err;
       if(result){
         console.log(result); 
         result.local.name=req.body.name;
         result.local.username=req.body.username;
         result.save();
         console.log("Updated");
         res.redirect('/lab');
       }
       else{
         console.log("Not found");
         res.redirect('/lab');
       }
     })
  }
    next;
})
router.get('/logout',function(req,res){
  req.logout();
  req.flash('success','You are logged out');
  res.redirect('/');
});
//Exports
module.exports=router;