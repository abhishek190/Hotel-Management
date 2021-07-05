const express=require("express");
const mongoose =require("mongoose");
const labSchema=new mongoose.Schema({
  heading:{
    type:'String'

  },
  description:"String",
  link:{type:String,default:'/'},
  image:{
    type:String,
    default:"image-1603183764252.png"
  }
});
module.exports=mongoose.model('Lab',labSchema);
module.exports.StoreData=(newData,callback)=>{
    
  newData.save(callback)
}