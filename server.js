const express=require('express');
const fs=require('fs');
const homepage=fs.readFileSync('./views/home.html','utf-8');
const app=express();
app.get('/',(req,res)=>{
    //res.header({'content-type':'text/html'});
    res.set({
        'Content-Type': 'text/html',
      });
    res.send(homepage);
});
app.listen(3000,()=>{
    console.log('server is running in http:localhost:3000');
});