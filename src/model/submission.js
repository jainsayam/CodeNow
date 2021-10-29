const mongoose=require('mongoose');

const submissionScheme=new mongoose.Schema({
     email:{
         type:String,
         require:true,
     },
     submittedCode:{
         type:String,
         require:true,
     },
    status:{
        type:Boolean,
        require:true
    },
    timeOfSubmission:{
        type:Date,
        require:true
    }
});
const submission=new mongoose.model('submission',submissionScheme);
module.exports=submission;