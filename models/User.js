const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrpt = require('bcrypt');
const saltRounds = 10;

const userSchema = mongoose.Schema({
    name: {
        type: String,
        maxLength: 50,
    },
    email: {
        type: String,
        trim: true,
        unique: 1,
    },
    password: {
        type: String,
        minLength: 5,
    },
    lastname: {
        type: String,
        maxLength: 50,
    },
    role: {
        type: Number,
        default: 0,
    },
    image: String,
    token: {
        type: String,
    },
    tokenExpiration: {
        type: Number,
    }
});


userSchema.pre('save', function( next ){
    const user = this;

    if(user.isModified('password')){
        bcrpt.genSalt(saltRounds, function(err, salt){
            if (err) return next(err);
            bcrpt.hash(user.password, salt, function(err, hash){
                if(err) return next(err);
                user.password = hash;
                next();
            })
        })
    } else {
        next()
    }
})


userSchema.methods.comparePassword = function(plainPassword, callback) {
    bcrpt.compare(plainPassword, this.password, function(err, isMatch) {
        if(err) return callback(err);
        callback(null, isMatch);
    })
}

userSchema.methods.generateToken = function (cb) {
    var user = this;
    // console.log('user._id', user._id)

    // jsonwebtoken을 이용해서 token을 생성하기 
    var token = jwt.sign(user._id.toHexString(), 'secretToken')
    // user._id + 'secretToken' = token 
    // -> 
    // 'secretToken' -> user._id

    user.token = token
    user.save(function (err, user) {
        if (err) return cb(err);
        cb(null, user)
    })
}

userSchema.statics.findByToken = function(token, callback) {
    var user = this;

    jwt.verify(token, 'secretToken', function(err, decoded) {
        user.findOne({ "_id" : decoded, "token" : token }, function(err, user) {
            if(err) return callback(err);
            callback(null, user);
        })
    })
    
}

const User = mongoose.model('User', userSchema);

module.exports = { User };

