const mongoose = require("mongoose");

const DB =
  "mongodb+srv://Naman21:Nasir123@cluster0.hfnpuvw.mongodb.net/Product?retryWrites=true&w=majority";
  

mongoose.connect(DB,
  {
    useUnifiedTopology:true,
    useNewUrlParser:true
  }).then(()=>console.log("DataBase Connected")).catch((err)=>{
    console.log(err);
})


