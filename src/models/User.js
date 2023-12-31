const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
    },

    secondName: {
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
    },
    emailVerified: {
        type: Boolean,
        required: true,
        default: false
    }
},
    {
        timestamps: true,
        statics: {
            isValid(password, user) {
                const isValid = bcrypt.compareSync(password, user.password);
    
                return isValid;
            }
        },
    });

userSchema.pre('save', async function (next, doc) {

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(this.password, salt);
    this.password = hashedPassword;

    next()
});

const User = mongoose.model('User', userSchema);

module.exports = User;