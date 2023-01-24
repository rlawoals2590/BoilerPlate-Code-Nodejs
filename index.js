const express = require('express');
const app = express();
const config = require('./config/key');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const port = 5000;
const {
    User
} = require('./models/User');

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cookieParser());

const mongoose = require('mongoose');
const { auth } = require('./middleware/auth');
mongoose.set('strictQuery', true);
mongoose
    .connect(config.mongoURL,{ 
        useNewUrlParser: true, 
        useUnifiedTopology: true}
).then(() => console.log("MongoDB connected..."))
 .catch(err => console.log(err));


app.get('/', (req, res) => {res.send('Hello World!')});

app.post('/api/users/register', (req, res) => {
    
    const user = new User(req.body);

    user.save((err, userInfo) => {
        if (err) return res.json({
            success: false,
            message: err,
        });
        return res.status(200).json({
            success: true
        });
    });
});

app.post('/api/users/login', (req, res) => {
    User.findOne({ email: req.body.email }, (err, user) => {
        console.log('user', user);

        if (!user){
            return res.json({
                loginSuccess: false,
                message: "제공된 이메일에 해당되는 유저가 없습니다."
            })
        }
        
        user.comparePassword(req.body.password, (err, isMatch) => {
            console.log('isMatch', isMatch);
            if(!isMatch)
            return res.json({ loginSuccess: false, message: "비밀번호가 틀렸습니다."})
            
            if(isMatch === true)
            user.generateToken((err, user) => {
                if (err) return res.status(400).send(err);
                res.cookie("x_auth", user.token).status(200).json({
                    loginSuccess: true,
                    userId: user._id
                })
            })
            // return res.json({ loginSuccess: true, message: "비밀번호가 맟았습니다."})       
        })
    })
})

app.get('/api/users/auth', auth, (req, res) => {
    res.status(200).json({
        _id: req.user._id,
        isAuth: req.user.role === 0 ? false : true,
        isAuth: true,
        email: req.user.email,
        name: req.user.name,
        lastname: req.user.lastname,
        role: req.user.role,
        image: req.user.image 
    })
})

app.listen(port, () => {console.log(`Example app Listenling at http://localhost:${port}`)});