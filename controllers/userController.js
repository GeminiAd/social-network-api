const { User } = require('../models');

/* Get all users. */
function getUsers(req, res) {
    User.find()
        .then((users) => res.status(200).json(users))
        .catch((error) => res.status(500).json(error));
}

/* Get user and populated friend and thought data by user id */
function getUser(req, res) {
    User.findOne({ _id: req.params.id }).populate(['thoughts', 'friends'])
        .then((user) => {
            user ? res.status(200).json(user) : res.status(404).json({ message: "No user found with that ID!" })
        })
        .catch((error) => res.status(500).json(error));
}

module.exports = {
    getUsers, getUser
}