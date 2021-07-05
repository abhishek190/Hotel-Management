const express=require("express");
const mongoose =require("mongoose");
var publishLabSchema= new mongoose.Schema(
    {
      RoomID: String,
      RoomType: String,
      RoomLocation:String,
      RoomCharge:String,
      RoomStatus:{type:String,default:"Available"},
      time : { type : Date, default: Date.now }
    }
  )
  module.exports=mongoose.model('PublishLab',publishLabSchema);