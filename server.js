const express=require('express');
const path=require('path');
const app=express();
const static_path = path.join(__dirname, "/public");
app.set('view engine','hbs');
app.use(express.static(static_path));
app.get('/',(req,res)=>{
    res.render('home');
});
app.get('/login',(req,res)=>{
    console.log('in login ');
    res.render('login.hbs');
});
app.get('/signup',(req,res)=>{
    res.render('signup');
});
app.listen(3000,()=>{
    console.log('server is running in http:localhost:3000');
});