const express = require('express');
const { protect } = require('../middleware/authMiddleWare');
const {
  sendMessage,
  allMessage,
  deleteMessage,
  starMessage,
  pinMessage,
  getAllPinnedMessage,
  getStarredMessage
} = require('../controllers/messageController');

const router = express.Router();

// Message routes
router.route('/').post(protect, sendMessage);
router.route('/').put(protect, deleteMessage);

// Starred messages routes
router.route('/star').put(protect, starMessage);
router.route('/star').get(protect, getStarredMessage);

// Pinned messages routes
router.route('/pinnedmessages').put(protect, pinMessage);
router.route('/pinnedmessages/:chatId').get(protect, getAllPinnedMessage);

// All messages route - make sure this is at the end
router.route('/:chatId').get(protect, allMessage);

module.exports = router;
