const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const {
  sendMessage,
  allMessage,
  deleteMessage,
  starMessage,
  pinMessage,
  getAllPinnedMessage,
  getStarredMessage,
  editMessage,
  markAsSeen,
  groupMedia,
  groupDocument
} = require('../controllers/messageController');

const router = express.Router();

// Message routes
router.route('/').post(protect, sendMessage);
router.route('/').put(protect, deleteMessage);
router.route('/edit').put(protect, editMessage);
router.route('/seen').put(protect, markAsSeen);

// Starred messages routes
router.route('/star').put(protect, starMessage);
router.route('/star').get(protect, getStarredMessage);

// Pinned messages routes
router.route('/pinnedmessages').put(protect, pinMessage);
router.route('/pinnedmessages/:chatId').get(protect, getAllPinnedMessage);

// All messages route - make sure this is at the end
router.route('/:chatId').get(protect, allMessage);

router.route('/groupMedia/:chatId').get(protect, groupMedia);
router.route('/groupDocument/:chatId').get(protect, groupDocument);

module.exports = router;
