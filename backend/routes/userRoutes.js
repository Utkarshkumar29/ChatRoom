const express = require('express');
const { authUser, registerUser, searchUser } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleWare');

const router = express.Router();

router.route('/').post(registerUser).get(protect,searchUser)
router.route('/login').post(authUser)


module.exports = router;
