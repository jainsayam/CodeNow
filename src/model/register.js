const mongoose=require('mongoose');

const usersScheme=new mongoose.Schema({
     name:{
         type:String,
         require:true
     },
     email:{
         type:String,
         require:true,
         unique:true
     },
     password:{
        type:String,
        require:true
     }
});

const Register=new mongoose.model('Register',usersScheme);
module.exports=Register;