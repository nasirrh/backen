const mongoose = require("mongoose");



const usersSchema = new mongoose.Schema({
  category: {
    type: String,
    required: true,
  },
  product: {
    type: String,
    required: true,
    trim: true,
  },
  dateofsale: {
    type: Date,
    required: true,
    trim: true,
  },
  rgioncode: {
    type: String,
    required: true,
    trim: true,
  },
  storecode: {
    type: String,
    required: true,
    trim: true,
  },
  noofpieces: {
    type: Number,
    required: true,
    trim: true,
  },
  amount: {
    type: Number,
    required: true,
    trim: true,
  },
  tax: {
    type: String,
    required: true,
    trim: true,
  },
  totalamount: {
    type: Number,
    required: true,
    trim: true,
  },
  status: {
    type: String,
    required: true,
  },
  datecreated : Date,
  dateUpdate : Date,
  
});

//model

const users = new mongoose.model("users",usersSchema)

module.exports = users;