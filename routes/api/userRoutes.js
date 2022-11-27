const router = require('express').Router();
const { addFriend, createUser, deleteUser, getUsers, getUser, removeFriend, updateUser } = require('../../controllers/userController');

router.route('/').get(getUsers).post(createUser);
router.route('/:userId').get(getUser).put(updateUser).delete(deleteUser);
router.route('/:userId/friends/:friendId').post(addFriend).delete(removeFriend);

module.exports = router;