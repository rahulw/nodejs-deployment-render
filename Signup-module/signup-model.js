const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, validate: { validator: function (v) { return /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i.test(v) }, message: props => `${props.value} is not a valid email address!` } },
    role: { type: String, required:true, enum: ['admin', 'superadmin']},
    password: {type: String, required: true, validate: {validator: function (password) {return /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&_*-]).{8,}$/.test(password)}, message: props => `${props.value} is not a valid password!` }}
});

userSchema.path('username').validate(async (username) => {
    const usernameCount = await mongoose.models.user.countDocuments({ username });
    return !usernameCount;
}, 'Username already exists');

userSchema.path('email').validate(async (email) => {
    const emailCount = await mongoose.models.user.countDocuments({ email });
    return !emailCount;
  }, 'Email already exists');

module.exports = mongoose.model('user', userSchema);