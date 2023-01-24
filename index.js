const express = require('express');
const mongoose = require('mongoose');
mongoose.set('strictQuery', true);
mongoose.connect(
    "mongodb+srv://admin:4yrqCOUacbn7ika3@boilerplate.hsltai3.mongodb.net/?retryWrites=true&w=majority",
    { useNewUrlParser: true, useUnifiedTopology: true}
).then(() => console.log("MongoDB connected..."))
 .catch(err => console.log(err));

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

const app = express();
const port = 5000;

const { User } = require('./models/User');

app.get('/', (req, res) => {res.send('Hello World!')});

app.post('/register', (req, res) => {
    
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

app.listen(port, () => {console.log(`Example app Listenling at http://localhost:${port}`)});