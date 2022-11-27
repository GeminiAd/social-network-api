const { User, Thought } = require('../models');

/* Create a new user. */
function createUser(req, res) {
    User.create(req.body)
        .then((user) => res.status(200).json(user))
        .catch((error) => res.status(500).json(error));
}

/* Delete a user and their associated thoughts. */
function deleteUser(req, res) {
    User.findOneAndDelete({
        _id: req.params.id
    })
        .then(async user => {
            if (!user) {
                res.status(400).json({ message: "No user found with that ID!" });
            } else {
                await Thought.deleteMany({
                    _id: user.thoughts
                });

                res.status(200).json({ message: "User and associated thoughts deleted!" });
            }
        })
        .catch(error => res.status(500).json(error));
}

/* Get all users. */
function getUsers(req, res) {
    User.find()
        .then((users) => res.status(200).json(users))
        .catch((error) => res.status(500).json(error));
}

/* Get user and populated friend and thought data by user id. */
function getUser(req, res) {
    User.findOne({ _id: req.params.id }).populate(['thoughts', 'friends'])
        .then((user) => {
            user ? res.status(200).json(user) : res.status(404).json({ message: "No user found with that ID!" })
        })
        .catch((error) => res.status(500).json(error));
}

/* Updates a user by their user id and returns the new user data. */
function updateUser(req, res) {
    User.findOneAndUpdate(
        {
            _id: req.params.id
        },
        req.body,
        {
            new: true
        }
    )
        .then(user => user ? res.status(200).json(user) : res.status(400).json({ message: "No user found with that ID!" }))
        .catch(error => res.status(500).json(error));
}

module.exports = {
    createUser, deleteUser, getUsers, getUser, updateUser
}