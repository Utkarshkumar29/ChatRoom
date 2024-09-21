const express = require('express');
const { authUser, registerUser, searchUser, GoogleAuth } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/').post(registerUser).get(protect,searchUser)
router.route('/google-auth').post(GoogleAuth)
router.route('/login').post(authUser)


module.exports = router;
