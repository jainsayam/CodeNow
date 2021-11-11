const express = require('express');
const path = require('path');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const child_process=require('child_process');
require('./src/db/connection');
const Register = require('./src/model/register');
const contestDetails = require('./src/model/contestInfo');
// const contestExtraInfo = require('./src/model/contestExtraInfo');
const submission = require('./src/model/submission');
const app = express();
const addProblem = require('./src/model/addProb');
const cookieParser = require('cookie-parser');
const auth = require('./src/middleware/auth');
const static_path = path.join(__dirname, "/public");
app.set('view engine', 'hbs');
app.use(express.static(static_path));
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.get('/', (req, res) => {
    res.render('home');
});
app.get('/home', (req, res) => {
    res.render('home');
});
app.get('/about', (req, res) => {
    res.render('about');
});
app.get('/contactus', (req, res) => {
    res.render('contactus');
});
app.get('/contests', async (req, res) => {
    try {
        const contestname = await contestDetails.find();
        res.render('contests', {
            contestnames: contestname
        });
    } catch (error) {
        res.render('contests');
    }
});
app.get('/contests/editcontest/:contestname', async (req, res) => {
    try {
        console.log(req.params);
        const problem = await addProblem.find({ contestName: req.params.contestname });

        res.render('edit_problem', {
            pro: problem
        });
    }
    catch (err) {
        console.log('hello');
        console.log(err);
    }
});
app.get('/contests/editcontest/editproblem/:probname', async (req, res) => {
    try {
        const prob = await addProblem.findOne({ problemName: req.params.probname });
        console.log(prob);
        res.render('editchallenge', {
            contestName:prob.contestName,
            problem_name: prob.problemName,
            problem_statement: prob.problem_statement,
            input_format: prob.input_format,
            output_format: prob.output_format,
            constraints: prob.constraints,
            sample_input: prob.sample_input,
            sample_output: prob.sample_output,
            explanation: prob.explanation
        });
    }
    catch (err) {
        console.log(err);
    }
});
app.get('/contests/:contestname/:problemname',async (req, res) => {
    console.log(req.params);
    try {
        const problems= await addProblem.find({
            problemName:req.params.problemname
        });
        console.log(problems[0]);
        res.render('ide',{
            problem_name:problems[0].problemName,
            problem_statement:problems[0].problem_statement,
            input_format:problems[0].input_format,
            output_format:problems[0].output_format,
            constraints:problems[0].constraints,
            sample_input:problems[0].sample_input,
            sample_output:problems[0].sample_output,
            explanation:problems[0].explanation
        });
    
    } catch (error) {
        console.log(error);
    }

});
app.get('/contests/:contestname',async (req, res) => {
    
    try {
        const problems= await addProblem.find({
            problem: req.params.contestname
        });
        res.render('problem_shown',{
            problem:problems
        });
    
    } catch (error) {
        console.log(error);
    }
    
});

app.get('/login', (req, res) => {
    res.render('login.hbs');
});
app.get('/signup', (req, res) => {
    res.render('signup');
});
app.post('/register', async (req, res) => {
    try {
        const password = req.body.password;
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const cpassword = req.body.cpassword;
        if (req.body.name === '' || req.body.email === '' || password === '') {
            res.send('Fields should not empty.');
        } else {
            if (password === cpassword) {
                const registerUser = new Register({
                    name: req.body.name,
                    email: req.body.email,
                    password: hashedPassword
                });
                const token = await registerUser.generateAuthToken();
                const registered = await registerUser.save();
                res.render('home');
            } else {
                res.send('password are not matched');
            }
        }

    } catch (err) {
        res.status(400).send(err);
    }
});
app.post('/login', async (req, res) => {
    try {
        const email = req.body.email, password = req.body.password;
        const userDetail = await Register.findOne({ email: email });
        const matched = await bcrypt.compare(req.body.password, userDetail.password);
        if (matched) {
            const token = await userDetail.generateAuthToken();
            res.cookie('jwt', token, {
                expires: new Date(Date.now() + 604800000),
                httpOnly: true
            });
            res.render('landingpage', {
                email: req.body.email
            });
        } else {
            res.send('Invalid credentials');
        }
    } catch (error) {
        res.send(error);
    }
});
app.post('/logout', auth, async (req, res) => {
    req.user.tokens = await req.user.tokens.filter((currToken) => {
        return req.token !== currToken.token;
    });
    await res.clearCookie('jwt');
    await req.user.save();
    res.render('home');
});
app.post('/contest_administration', async (req, res) => {
    try {
        const contest = await contestDetails.find({ email: req.body.email }, { _id: 0, __v: 0 });
        res.render('contest_administration', {
            email: req.body.email,
            contests: contest
        });
    } catch (error) {
        res.render('contest_administration', {
            email: req.body.email
        });
    }

});
app.post('/contestform', (req, res) => {
    res.render('contestform', {
        email: req.body.email
    });
});
app.post('/contestRegistration', async (req, res) => {
    try {
        if (req.body.contestname === '' || req.body.sdate === '' || req.body.stime === '' || req.body.stime === '' || req.body.edate === '' || req.body.etime === '' || req.body.orgname === '') {
            res.send('Fields should not empty');
        }
        else {
            const contestDetail = new contestDetails({
                email: req.body.email,
                contestName: req.body.contestname,
                contestStartDate: req.body.sdate,
                contestEndDate: req.body.edate,
                startingTime: req.body.stime,
                endingTime: req.body.etime,
                organisationName: req.body.orgname
            });
            await contestDetail.save();
            res.render('addchallengespage', {
                contestName: req.body.contestname,
                startTime: req.body.stime,
                endTime: req.body.etime,
                orgname: req.body.orgname,
                startDate: req.body.sdate,
                endDate: req.body.edate
            });
        }
    } catch (err) {
        res.status(400).send(err);
    }
});
app.post('/contestDescription', async (req, res) => {
    try {
        const contestExra = new contestExtraInfo({

            description: req.body.desc,
            prizes: req.body.prizes,
            rules: req.body.rules
        });

        await contestExra.save();
        res.render('preview', {
            sdate: req.body.sdate,
            stime: req.body.stime,
            contestName: req.body.contestName,
            desc: req.body.desc,
            prizes: req.body.prizes,
            rules: req.body.rules
        });
    } catch (error) {
        res.status(404).send('Page not found');
    }
});
app.post('/createchallenge', (req, res) => {
    try {
        res.render('createchallenge', {
            contestName: req.body.contestName
        });
    }
    catch (error) {
        res.status(404).send('Page not found');
    }
});

app.post('/addchallenge', async (req, res) => {
    try {
        if (req.body.contestName === '' || req.body.problem_name === '' || req.body.problem_statement === '' || req.body.input_format === ''
            || req.body.output_format === '' || req.body.constraints === '' || req.body.sample_input === '' ||
            req.body.sample_output === '') {
            res.send('Fields should not empty');
        }
        else {
            try {
                var st=req.body.problem_statement;
                st.replace("\n", "<br/>");
                console.log(st);
                const problemadd = new addProblem({
                    contestName: req.body.contestName,
                    problemName: req.body.problem_name,
                    problem_statement: st,
                    input_format: req.body.input_format,
                    output_format: req.body.output_format,
                    constraints: req.body.constraints,
                    sample_input: req.body.sample_input,
                    sample_output: req.body.sample_output,
                    explanation: req.body.explaination
                });
                console.log(problemadd);
                await problemadd.save();
                console.log(req.body.contestName);
                const problems = await addProblem.find({ contestName: req.body.contestName });
                console.log(problems);
                res.render('addchallengespage', {
                    contestName: req.body.contestName,
                    problems: problems
                });
            }
            catch (err) {
                console.log(err);
                res.render('addchallengespage', {
                    contestName: req.body.contestName,
                    problems: []
                });
            }
        }

    }
    catch (error) {
        console.log(error);
        res.status(404).send(error);
    }
});
app.post('/updateproblem',async (req, res) => {
    try{
        var st=req.body.problem_statement;
        st.replace(/\n/g, "<br/>");
    await addProblem.updateOne({ name: req.body.problemName },
        {
            problemName: req.body.problem_name,
            problem_statement:st ,
            input_format: req.body.input_format,
            output_format: req.body.output_format,
            constraints: req.body.constraints,
            sample_input: req.body.sample_input,
            sample_output: req.body.sample_output,
            explanation: req.body.explaination
        });
        const problem = await addProblem.find({ contestName: req.body.contestName });

        res.render('edit_problem', {
            pro: problem
        });
    }catch(err)
    {
        console.log(err);
    }
});
app.post("/submitCode",(req,res)=>{
    var day   = new Date().getDate();
    var month = new Date().getMonth();
    var year  = new Date().getFullYear();
    var hour  = new Date().getHours();
    var min   = new Date().getMinutes();
    var sec   = new Date().getSeconds();
    var code  = req.body.code;

});
app.listen(3000, () => {
    console.log('server is running in http:localhost:3000');
});