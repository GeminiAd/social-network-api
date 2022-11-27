const { Thought } = require('../models');

/* Create a thought. */
function createThought(req, res) {

}

/* Get a single thought by its id. */
function getThought(req, res) {
    Thought.findById(req.params.thoughtId)
        .then((thought) => thought ? res.status(200).json(thought) : res.status(400).json({ message: "No thought found with that ID!" }))
        .catch((error) => res.status(500).json(error));
}

/* Get all thoughts */
function getThoughts(req, res) {
    Thought.find({})
        .then(thoughts => res.status(200).json(thoughts))
        .catch(error => res.status(500).json(error));
}

module.exports = { createThought, getThought, getThoughts };