var express = require("express");
var Lab = require("../models/admin/lab")
var router = express.Router();
const nodemailer = require('nodemailer');
var PublishLab = require('../models/publish_lab');
var Booking = require('../models/booking');
var feedback = require('../models/feedback');
const passport = require("passport");
var auth1 = require('../config/auth1');
const publish_lab = require("../models/publish_lab");
const isLoggedIn = auth1.isLoggedIn;
router.get('/', (req, res) => {
  res.render('home');
})
router.get('/index', (req, res) => {
  res.render('index');
})
router.get('/team', isLoggedIn, (req, res) => {
  res.render('team');
})
router.get('/resorces', (req, res) => {
  res.render('resorces');
})
router.get('/lab', (req, res) => {
  if (req.user) {
    console.log("user loged in");
    console.log(req.user.local);
    res.render('lab', { isAdmin: req.user.local.admin });
  }
  else {
    res.render('lab', { isAdmin: -1 })
  }

})
router.post('/delete', (req, res) => {
  PublishLab.findByIdAndDelete(req.body.page).exec((err, result) => {
    if (err) throw err;
    console.log("id deleted");
  });
})
router.post('/checkOut',(req,res)=>{
  var roomid=req.body.page;
  var userid=req.user._id;
  PublishLab.findByIdAndUpdate(roomid,{RoomStatus:'Available'}).exec((err, result) => {
    if (err) throw err;
    console.log("Room Available");
  });
  
})
router.get('/update',(req,res)=>{
   res.render('update');
})
router.post('/getValue',(req,res)=>{
  console.log(req.body.page);
  PublishLab.find({_id:req.body.page}).exec(function(err,result){
    if(err)throw err;
    res.send(result).json;
  })
})
router.post('/users/update',(req,res)=>{
  PublishLab.findByIdAndUpdate(req.body.id,{RoomStatus:req.body.RoomStatus,RoomID:req.body.RoomId,RoomLocation:req.body.RoomLocation,RoomCharge:req.body.RoomCharge,
    RoomType:req.body.RoomType}).exec((err, result) => {
    if (err) throw err;
    res.redirect('/admin');
  });
})
router.post('/checkIn',(req,res)=>{
  var roomid=req.body.page;
  var userid=req.user._id;
  PublishLab.findByIdAndUpdate(roomid,{RoomStatus:'Occupied'}).exec((err, result) => {
    if (err) throw err;
    console.log("Room Occupied");
  });
  console.log(roomid);
  console.log(req.user._id);
  const booking=new Booking();
  booking.UserId=userid;
  booking.RoomId=roomid;
  console.log(booking);
  booking.save();
})
router.get('/booking',(req,res)=>{
  var user=req.user._id;

  console.log("welcome to my booking");
  console.log(user);
  Booking.find({UserId:user}).exec(function (err, result) {
    if (err) throw err;
    console.log(result);
    console.log(result[0].UserId);
    var temp=result[0].RoomId;
    PublishLab.find({_id:temp,RoomStatus:'Occupied'}).exec(function(err,result){
      if(err) throw err;
      res.send(result).json;
    })
  })
})


router.get('/data', (req, res) => {
  Lab.find({}, (err, result) => {
    if (err) throw err;
    res.send(result).json;
  })
})
router.post('/filter', (req, res) => {
  Lab.find({ heading: req.body.course }).exec((err, result) => {
    if (err) throw err;
    res.send(result).json;
  })
})
router.get('/contact', (req, res) => {
  res.render('contact');
})
router.get('/userProfile', (req, res) => {
  res.render('profile');
})



router.post('/feedback', isLoggedIn, (req, res) => {

  var stars = req.body.star;
  var feedback_text = req.body.feedback_text;
  var email = req.user.local.email;
  var emailMessage = `Hi there,\n\nThank you for your feedback ${email}.\n\n`;
  console.log('request contact');
  console.log(req.body)


  var transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: 'vlabs2021@gmail.com',
      pass: 'HelloLabs@2021'
    }
  });

  var emailOptions = {
    from: 'vlabs2021@gmail.com',
    to: email,
    subject: 'feedback ',
    text: emailMessage
  };

  transporter.sendMail(emailOptions, (err, info) => {
    if (err) {
      console.log(err);
      res.send('contact sent error');
    } else {
      console.log('Message Sent: ' + info.response);
      console.log('Email Message: ' + emailMessage);

      const feedback_data = new feedback();
      feedback_data.email = email;
      feedback_data.stars = stars;
      feedback_data.description = feedback_text;
      console.log(feedback_data);
      feedback_data.save();

      res.redirect('/lab');
    }

  })
})

router.post('/Questions',(req,res)=>{

  
  var Qn_text=req.body.Qn_text;
  var email=req.body.visitor_email;
  var emailMessage = `Hi there ${email},\n\n \Thanks, Your question will be looked onto.\n\nWe will get in touch soon.\n\n`;
  console.log('request contact');
  console.log(req.body)
 

  var transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: 'vlabs2021@gmail.com',
      pass: 'HelloLabs@2021'
    }
  });

  var emailOptions = {
    from: 'vlabs2021@gmail.com',
    to: email,
    subject: 'Question ',
    text: emailMessage
  };

  transporter.sendMail(emailOptions, (err, info) => {
    if (err) {
      console.log(err);
      res.send('contact sent error');
    } else {
      console.log('Message Sent: ' + info.response);
      console.log('Email Message: ' + emailMessage);
      
        const feedback_data = new feedback();
        feedback_data.email=email;
       
        feedback_data.description=Qn_text;
        console.log(feedback_data);
        feedback_data.save();

        res.redirect('/lab');
    }
  
})
})

router.get('/publishLab', (req, res) => {
  PublishLab.find({}).sort({ date: 'asc' }).exec(function (err, result) {
    if (err) throw err;
    res.send(result).json;
  })
})
router.get('/ClientPublishLab', (req, res) => {
  PublishLab.find({RoomStatus:'Available'}).sort({ date: 'asc' }).exec(function (err, result) {
    if (err) throw err;
    res.send(result).json;
  })
})
router.post('/publish_lab', isLoggedIn, (req, res) => {
  console.log(req.body.RoomType);
  console.log(req.body.RoomLocation);
  var RoomType = req.body.RoomType;
  //var email = req.body.email; is the email of the user
  var email = req.user.local.email; //user's/publisher's email
  var RoomLocation = req.body.RoomLocation;
  PublishLab.find({ 'RoomID': email }, function (err) {
    if (err) {
      console.error('error, no entry found');
    }
    const publishers = new PublishLab();
    publishers.RoomID = email;
    publishers.RoomType = req.body.RoomType;
    publishers.RoomLocation = req.body.RoomLocation;
    publishers.RoomCharge=req.body.RoomCharge;
    console.log(publishers);
    publishers.save();

    res.redirect('/lab');
  })
  });
/*
  var emailOptions = {
    from: 'vlabs2021@gmail.com',
    to: email,
    subject: 'Publishing Lab',
    text: emailMessage
  };

  transporter.sendMail(emailOptions, (err, info) => {
    if (err) {
      console.log(err);
      res.send('contact sent error');
    } else {
      console.log('Message Sent: ' + info.response);
      console.log('Email Message: ' + emailMessage);

      PublishLab.find({ 'RoomID': email }, function (err) {
        if (err) {
          console.error('error, no entry found');
        }
        const publishers = new PublishLab();
        publishers.RoomID = email;
        publishers.RoomType = req.body.RoomType;
        publishers.RoomLocation = req.body.RoomLocation;
        console.log(publishers);
        publishers.save();

        res.redirect('/lab');
      })
    }
  });
})*/
module.exports = router;
