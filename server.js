const express = require('express');
const path = require('path');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('./src/db/connection');
const Register = require('./src/model/register');
const contestDetails = require('./src/model/contestInfo');
const contestExtraInfo = require('./src/model/contestExtraInfo');
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
app.get('/contests', (req, res) => {
    res.render('contests');
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
                res.render('landingpage');
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
            res.render('landingpage');
        } else {
            res.send('Invalid credentials');
        }
    } catch (error) {
        res.send(error);
    }
});
app.post('/logout', auth, async (req, res) => {
    req.user.tokens = req.user.tokens.filter((currToken) => {
        return req.token !== currToken.token;
    });
    res.clearCookie('jwt');
    await req.user.save();
    res.render('home');
});
app.get('/contest_administration', (req, res) => {
    res.render('contest_administration');
});
app.get('/contestform', (req, res) => {
    res.render('contestform');
});
app.post('/contestRegistration', async (req, res) => {
    try {
        if (req.body.contestname === '' || req.body.sdate === '' || req.body.stime === '' || req.body.stime === '' || req.body.edate === '' || req.body.etime === '' || req.body.orgname === '') {
            res.send('Fields should not empty');
        }
        else {
            const contestDetail = new contestDetails({
                contestName: req.body.contestname,
                contestStartDate: req.body.sdate,
                contestEndDate: req.body.edate,
                startingTime: req.body.stime,
                endingTime: req.body.edate,
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
            contestName: req.body.contest_name
        });
    }
    catch (error) {
        res.status(404).send('Page not found');
    }
});

app.post('/addchallenge', async (req, res) => {
    try {
        if (req.body.problem_name === '' || req.body.problem_statement === '' || req.body.input_format === ''
            || req.body.output_format === '' || req.body.constraints === '' || req.body.sample_input === '' ||
            req.body.sample_output === '') {
            res.send('Fields should not empty');
        }
        else {
            try {
                const problemadd = await addProblem.findOne({ contestName: req.body.contestName });
                await problemadd.addProblem(req.body.problem_name, req.body.problem_statement, req.body.input_format, req.body.output_format, req.body.constraints, req.body.sample_input, req.body.sample_output, req.body.explaination);
                await problemadd.save();
            }
            catch (err) {
                const problemadd = await addProblem({
                    contestName: req.body.contestName,
                    problems:{
                        problemName:req.body.problem_name,                
                        problem_statement:req.body.problem_statement,
                        input_format:req.body.input_format,
                        ouput_format:req.body.output_format,
                       constraints:req.body.constraints,                       
                       sample_input:req.body.input_format,
                       sample_output:req.body.sample_output,
                       explanation:req.body.explaination
                }
                });
                await problemadd.addProblem(req.body.problem_name, req.body.problem_statement, req.body.input_format, req.body.output_format, req.body.constraints, req.body.sample_input, req.body.sample_output, req.body.explaination);
                await problemadd.save();
            }
        }

    }
    catch (error) {
        res.status(404).send('Page not found');
    }
})
app.listen(3000, () => {
    console.log('server is running in http:localhost:3000');
});