const router = require('express').Router();
const { createUser, deleteUser, getUsers, getUser, updateUser } = require('../../controllers/userController');

router.route('/').get(getUsers).post(createUser);
router.route('/:id').get(getUser).put(updateUser).delete(deleteUser);

module.exports = router;