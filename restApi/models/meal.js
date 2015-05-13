var mongoose = require('mongoose');

var mealSchema = new mongoose.Schema({
	date: {type: Date, default:Date.now, required: true},
	time: {type: Date, default:Date.now, required:true},
  name: {type: String, required: true},
  numCalories: {type: Number, required: true},
	userId: mongoose.Schema.Types.ObjectId
});

module.exports = mongoose.model('Meal', mealSchema);
