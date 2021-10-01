const express=require('express');
const path=require('path');
require('./src/db/connection');
const Register=require('./src/model/Register');
const app=express();
const static_path = path.join(__dirname, "/public");
app.set('view engine','hbs');
app.use(express.static(static_path));
app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.get('/',(req,res)=>{
    res.render('home');
});
app.get('/home',(req,res)=>{
    res.render('home');
});
app.get('/about',(req,res)=>{
    res.render('about');
});
app.get('/contactus',(req,res)=>{
    res.render('contactus');
});
app.get('/contest',(req,res)=>{
    res.render('contests');
});
app.get('/login',(req,res)=>{
    console.log('in login ');
    res.render('login.hbs');
});
app.get('/signup',(req,res)=>{
    res.render('signup');
});
app.post('/register', async (req,res)=>{
    try{
        const password=req.body.password;
        const cpassword=req.body.cpassword;
        if(password === cpassword){
            const registerUser=new Register({
                name:req.body.name,
                email:req.body.email,
                password:req.body.password,
                cpassword:req.body.cpassword
            });
            const registered=await registerUser.save();
            res.status(201).render('home');
        }else{
            res.send('password are not matched');
        }
    }catch(err){
        res.status(400).send(err);
    }
});
app.listen(3000,()=>{
    console.log('server is running in http:localhost:3000');
});