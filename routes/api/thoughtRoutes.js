const router = require('express').Router();
const { createThought, getThought, getThoughts } = require('../../controllers/thoughtController');

router.route('/').get(getThoughts).post(createThought);
router.route('/:thoughtId').get(getThought);

module.exports = router;