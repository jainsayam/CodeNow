const mongoose=require('mongoose');
const loggedIn=new mongoose.Schema({
    _id:{
        type:String,
        require:true
    },
    token:{
        type:String,
        require:true
    }
});
const LoggedInUser=new mongoose.model("Login",loggedIn);
module.exports=LoggedInUser;