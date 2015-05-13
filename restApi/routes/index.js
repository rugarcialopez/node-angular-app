var express = require('express');
var router = express.Router();
var userValidator = require('../validators/userValidator.js');
var mealValidator = require('../validators/mealValidator.js');
var dateValidator = require('../validators/dateValidator.js');
var timeValidator = require('../validators/timeValidator.js');
var userAuthoritationValidator = require('../validators/userAuthoritationValidator.js');
var mealAuthoritationValidator = require('../validators/mealAuthoritationValidator.js');
var auth = require('./auth.js');
var meals = require('./meals.js');
var users = require('./users.js');
var app = express();



router.post('/authenticate', userValidator, auth._existUser, auth.authenticate);
router.post('/signup', userValidator, auth._findUser, auth.signup, auth.authenticate);


router.get('/users/:id', userAuthoritationValidator, users.getUser);
router.patch('/users/:id', userAuthoritationValidator, users.update);

router.get('/meals*', mealAuthoritationValidator, dateValidator, timeValidator, meals.find);
router.get('/meals/:id', userAuthoritationValidator, meals.getMeal);
router.post('/meals', mealAuthoritationValidator, mealValidator, meals.create);
router.patch('/meals/:id', mealAuthoritationValidator, mealValidator, meals.update);
router.delete('/meals/:id', mealAuthoritationValidator, meals.delete);
module.exports = router;
