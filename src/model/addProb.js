const mongoose=require('mongoose');

const problemDetailSchema=new mongoose.Schema({
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
const ProblemSchema=new mongoose.Schema({
     contestName:{
         type:String,
         require:true
     },
     problems:[problemDetailSchema]
});
ProblemSchema.methods.addProblem=async function(problem_name,problem_statement,input_format,output_format,constraints,sample_input,sample_output,explaination){
    this.problems=this.problems.concat({problem_name,problem_statement,input_format,output_format,constraints,sample_input,sample_output,explaination});
    await this.save();
}
const addProb=new mongoose.model('Problem',ProblemSchema);
module.exports=addProb;