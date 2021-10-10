const jwt=require('jsonwebtoken');
const login=require('../model/login');
const cookieParser=require('cookie-parser');

const auth=async function(req,res,next){
    try {
        console.log('hrllo');
        const token=req.cookies.jwt;
        console.log(token);
        if(token==null)
        {
            next();
        }
        else{
             const veriftUser=jwt.verify(token,'ourprojectnameiscodenowwearebuildingaprojetforonlinecoding');
             console.log(veriftUser);
             try{
                const user=await login.findOne({_id:veriftUser._id});
                console.log(user);
             }catch(err){
                 res.render('home');
             }
             
            next();
        }
    } catch (error) {
        res.status(401).send(error);
    }
}
module.exports=auth;