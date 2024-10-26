const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const jwtAuthenticate = require('../middlewares/jwtAuthenticate');


router.post('/signup', userController.signUpUser);  
router.post('/verify',userController.verifyUser);        
router.post('/login', userController.signInUser);           
router.get('/users', userController.getAllUsers);          
router.get('/profile', userController.getUserProfile); 
router.post('/logout', jwtAuthenticate, userController.logoutUser);  


module.exports = router;
