const mongoose = require('mongoose');

// Define User Schema
const UserSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        trim: true,
        match: /^[A-Za-z]+$/,
        minlength: 2,
        maxlength: 30,
    },
    lastName: {
        type: String,
        required: true,
        trim: true,
        match: /^[A-Za-z]+$/,
        minlength: 2,
        maxlength: 30,
    },
    middleInitial: {
        type: String,
        required: false,
        trim: true,
        match: /^[A-Za-z]+$/,
        minlength: 1,
        maxlength: 3,
    },
    email: {
        type: String,
        required: true,
        trim: true,
        match: /^[\w.-]+@smu\.edu\.ph$/,
        unique: true,
        minlength: 10,
        maxlength: 50,
    },
    age: {
        type: Number,
        required: true,
        trim: true,
        min: 1,
        max: 500,
    },
    gender: {
        type: String,
        enum: ['male','female','rather not say'],
        required: true,
    },

});

const User = mongoose.model('User', UserSchema);

module.exports = User;