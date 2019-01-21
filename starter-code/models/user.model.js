const mongoose = require('mongoose');
const EMAIL_REGEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const bcrypt = require('bcrypt');
const WORK_FACTOR = 10;

const schema = new mongoose.Schema({
  username:{
    type: String,
    required: [true, 'Username is required'],
    unique: true,
    lowercase: true,
    trim: true
  },
  password:{
    type: String,
    required: true,
    minlength: [8, 'Needs at least 8 characters']
  }
}, { timestamps: true });

schema.pre('save', function(next) {
  const user = this;

  if (user.isModified('password')) {
    bcrypt.genSalt(WORK_FACTOR)
      .then(salt => {
        return bcrypt.hash(user.password, salt)
          .then(hash => {
            user.password = hash;
            next();
          });
      })
      .catch(error => next(error));
  } else {
    next();
  }
});

schema.methods.checkPassword = function(password) {
  return bcrypt.compare(password, this.password);
}

const User = mongoose.model( 'User', schema);
module.exports = User;