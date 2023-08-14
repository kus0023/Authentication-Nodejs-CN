const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
    },

    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        unique: true,
    },

    password: {
        type: String,
        required: true,
    }
}, {timestamps: true});

userSchema.pre('save', function (next, doc){
    console.log(doc);
    next(true)
});

const User = mongoose.model('User', userSchema);

module.exports = User;