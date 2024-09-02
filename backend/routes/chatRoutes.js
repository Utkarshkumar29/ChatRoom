const express=require('express');
const { protect } = require('../middleware/authMiddleWare');
const { accessChat, fetchChats, createGroupChat, renameGroupChat, addToGroup, removeFromGroup } = require('../controllers/chatcontroller');
const router=express.Router()

router.route('/').post(protect,accessChat)
router.route('/').get(protect,fetchChats)
router.route('/group').post(protect,createGroupChat)
router.route('/group').put(protect,renameGroupChat)
router.route('/groupadd').put(protect,addToGroup)
router.route('/groupremove').put(protect,removeFromGroup)

module.exports = router;