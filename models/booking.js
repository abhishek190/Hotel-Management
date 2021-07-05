const express=require("express");
const mongoose =require("mongoose");
var bookingSchema= new mongoose.Schema(
    {
      UserId:String,
      RoomId:String,
      time : { type : Date, default: Date.now }
    }
  )
  module.exports=mongoose.model('Booking',bookingSchema);