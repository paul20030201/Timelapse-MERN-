var mongoose = require('../lib/mongooseConnection');

const UserSchema = new mongoose.Schema({
  first_name: {
    type: String,
  },
  last_name: {
    type: String,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
  },
  country: {
    type: String,
  },
  state: {
    type: Number, // 0: normal, 1: paused
    default: 0
  },
  role: {
    type: Number,
    default: 0 // 0: user, 1: admin
  },
  sub: {
    type: String,
  },
  last_login_time: {
    type: Date,
  },
  is_verified: {
    type: Boolean,
    default: false
  },
  is_deleted: {
    type: Boolean,
    default: false
  }
});

const User = mongoose.model('Users', UserSchema);

module.exports = User;