const jwt=require('jsonwebtoken');
const Register=require('../model/register');

const auth = async (req,res,next) => {
    try {
        const token=req.cookies.jwt;
        const verifyUser=await jwt.verify(token,'ourprojectnameiscodenowwearebuildingaprojetforonlinecoding');
        const user=await Register.findOne({_id:verifyUser._id});
        req.token=token;
        req.user=user;
        next();
    } catch (error) {
        res.status(401).send(error);
    }
}
module.exports=auth;