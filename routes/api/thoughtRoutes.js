const router = require('express').Router();
const { getThoughts } = require('../../controllers/thoughtController');

router.route('/').get(getThoughts);

module.exports = router;