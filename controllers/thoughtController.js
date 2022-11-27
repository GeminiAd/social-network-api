const { Thought } = require('../models');

/* Get all thoughts */
function getThoughts(req, res) {
    Thought.find({})
        .then(thoughts => res.status(200).json(thoughts))
        .catch(error => res.status(500).json(error));
}

module.exports = { getThoughts };