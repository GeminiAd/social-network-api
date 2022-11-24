const router = require('express').Router();
const { getUsers, getUser } = require('../../controllers/userController');

router.route('/').get(getUsers);
router.route('/:id').get(getUser)

module.exports = router;