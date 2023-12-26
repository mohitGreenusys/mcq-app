const router = require('express').Router();
const userController = require('../controllers/user.controller.js');
const auth = require('../middleware/user.auth.js');

router.post('/register', userController.register);
router.post('/verifyOtp', userController.verifyOtp);
router.post('/login', userController.login);
router.post('/forgotPassword', userController.forgetPassword);
router.post('/resetPassword', userController.resetPassword);
router.get('/getProfile', auth, userController.getProfile);
router.post('/updateProfile', auth, userController.updateProfile);
router.post('/verifyUptatedEmail',auth, userController.verifyEmail);
router.post('/resendOtp', userController.resendOtp);

module.exports = router;