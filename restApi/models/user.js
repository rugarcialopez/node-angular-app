var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
  username: {type: String, unique: true, required: true},
  password: {type: String, required: true},
  expectedCalories: {type: Number, require: true}
});

module.exports = mongoose.model('user', userSchema);
