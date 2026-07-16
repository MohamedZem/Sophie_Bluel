const express = require('express');
const router = express.Router();
const userCtrl = require('../controllers/users.controller');
const auth = require('../middlewares/auth');

router.post('/login', userCtrl.login);
router.put('/change-password', auth, userCtrl.changePassword);
//router.post('/signup', userCtrl.signup);

module.exports = router;
