const mongoose=require('mongoose');
const ProblemSchema=new mongoose.Schema({
     contestName:{
         type:String,
         require:true
     },
     problemName:{
        type:String,
        require:true,
        unique:true
    },
    problem_statement:{
        type:String,
        require:true
    },
    input_format:{
        type:String,
        require:true
    },
    ouput_format:{
       type:String,
       require:true
   },
   constraints:{
       type:String,
       require:true
   },
   
   sample_input:{
       type:String,
       require:true
   },
   sample_output:{
       type:String,
       require:true
   },
   explanation:{
       type:String,
       require:true
   }
});
const addProb=new mongoose.model('Problem',ProblemSchema);
module.exports=addProb;