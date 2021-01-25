const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    password: {
        type: String,
        required:true
    }
}, {
    timestamps: true,
});

const User = mongoose.model('User', userSchema);    //'User can be replaced with anything, that's just a name that we're using to publish the user schema'

module.exports = User;