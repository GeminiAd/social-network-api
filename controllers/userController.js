const { User, Thought } = require('../models');

/* 
 *  Adds a new friend to the list of friends belonging to the user with the given id. 
 *  The naive solution here would be to do one findAndUpdate call for the user, then a findAndUpdate call for the friend,
 *  but if the friendId is wrong we end up saving that wrong friendId.
 *  Instead, we'll take the following steps to add a friend relationship:
 *      1. First, find a user with the id of userId and find a user with the id of friendId.
 *      2. If we don't have information for both users, send back an informative message with a status code of 400.
 *      3. If we do have information for both users:
 *          a. If the ID of the friend we are trying to add is already in the friends array, return an informative message.
 *          b. If not, push the friend's id into the user's friends array.
 *          c. Push the user's id into the friend's friends array.
 *          d. Update the user and friend's information in the database.
 *          e. Send back the updated user information along with a 200 status code.
 */
function addFriend(req, res) {
    /* 1. First, find a user with the id of userId and find a user with the id of friendId. */
    Promise.all([User.findById(req.params.userId), User.findById(req.params.friendId)])
        .then(async ([user, friend]) => {
            /* 2. If we don't have information for both users, send back an informative message with a status code of 400. */
            if (!user) {
                res.status(404).json({ message: "No user found with that ID!" });
            } else if (!friend) {
                res.status(404).json({ message: "No friend found with that ID!" });
            } else {
                /* 3. If we do have information for both users: */
                /* 3. a. If the ID of the friend we are trying to add is already in the friends array, return an informative message. */
                if (user.friends.includes(req.params.friendId)) {
                    res.status(400).json({ message: "That friend relationship already exists!" });
                } else {
                    /* 3. a. Push the friend's id into the user's friends array. */
                    user.friends.push(friend._id);

                    /* 3. b. Push the user's id into the friend's friends array. */
                    friend.friends.push(user._id);

                    /* 3. c. Update the user and friend's information in the database. */
                    await user.save();
                    await friend.save();

                    /* 3. d. Send back the updated user information along with a 200 status code. */
                    res.status(200).json(user);
                }
            }
        })
        .catch((error) => res.status(500).json(error));
}

/* Create a new user. */
function createUser(req, res) {
    User.create(req.body)
        .then((user) => res.status(200).json(user))
        .catch((error) => res.status(500).json(error));
}

/* Delete a user and their associated thoughts. */
function deleteUser(req, res) {
    User.findOneAndDelete({
        _id: req.params.userId
    })
        .then(async user => {
            if (!user) {
                res.status(404).json({ message: "No user found with that ID!" });
            } else {
                /* Remove the user's associated thoughts. */
                await Thought.deleteMany({
                    _id: user.thoughts
                });

                /* Remove the user's associated reactions. */
                await Thought.updateMany(
                    { 'reactions.username': user.username },
                    { $pull: { reactions: { username: user.username } } }
                );

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
    User.findOne({ _id: req.params.userId }).populate(['thoughts', 'friends'])
        .then((user) => {
            user ? res.status(200).json(user) : res.status(404).json({ message: "No user found with that ID!" })
        })
        .catch((error) => res.status(500).json(error));
}

/* 
 *  Removes a friend relationship.
 *  In order to remove a friend relationship I must do the following:
 *      1. Get the user and friend information from the database.
 *      2. If either the user or the friend (or both) are null, send back an informative message.
 *      3. If both the user and the friend are valid ids:
 *          a. If the id of the friend we are trying to remove isn't in the friends list of the user, send back an informative message.
 *          b. Otherwise, remove the friend id from the user's friends list
 *          c. Remove the user id from the friend's friend list.
 *          d. Save those updated values.
 *          e. Send back the updated user information.
 */
function removeFriend(req, res) {
    /* 1. Get the user and friend information from the database. */
    Promise.all([User.findById(req.params.userId), User.findById(req.params.friendId)])
        .then(async ([user, friend]) => {
            /* 2. If either the user or the friend (or both) are null, send back an informative message. */
            if (!user) {
                res.status(404).json({ message: "No user found with that ID!" });
            } else if (!friend) {
                res.status(404).json({ message: "No friend found with that ID!" });
            } else {
                /* 3. If both the user and the friend are valid ids: */
                /* 3. a. If the id of the friend we are trying to remove isn't in the friends list of the user, send back an informative message. */
                if (!user.friends.includes(req.params.friendId)) {
                    res.status(400).json({ message: "That friend relationship doesn't exist!" });
                } else {
                    /* 3. b. Otherwise, remove the friend id from the user's friends list */
                    user.friends.pull(friend._id);

                    /* 3. c. Remove the user id from the friend's friend list. */
                    friend.friends.pull(user._id);

                    /* 3. d. Save those updated values. */
                    await user.save();
                    await friend.save();

                    /* 3. e. Send back the updated user information. */
                    res.status(200).json(user);
                }
            }
        })
        .catch((error) => res.status(500).json(error));
}

/* 
 *  Updates a user by their user id and returns the new user data. 
 *
 *  NOTE: I was thinking about what would happen if a user changes their username. If a user changes their username
 *  then every of their thoughts and reactions would have to be updated as well, unless we are expected to let the
 *  front-end take care of that. It makes more sense to me to have the back-end handle that, as that is what a real
 *  Social Network API would do (I would expect Facebook to do something like that), so that's what I will do.
 *
 *  To update a user we must take the following steps:
 *      1. Get the user information from the database so we can get the old username.
 *      2. If no user is found, send an informative message back to the client.
 *      3. Otherwise:
 *          a. If the user's username has been updated, we need to change the username of the user's associated thoughts to the updated username.
 *          b. If the user's username has been updated, we need to change the username of the user's associated reactions to the updated username.
 *          c. Update the user in the database.
 *          d. Send back the updated user information to the client.
 */
function updateUser(req, res) {
    /* 1. 1. Get the user information from the database so we can get the old username. */
    User.findOne(
        {
            _id: req.params.userId
        },
    )
        .then(async (user) => {
            /* 2. If no user is found, send an informative message back to the client. */
            if (!user) {
                res.status(404).json({ message: "No user found with that ID!" })
            } else {
                /* 3. Otherwise: */
                if (req.body.username) {
                    /* 3. a. If the user's username has been updated, we need to change the username of the user's associated thoughts to the updated username. */
                    await Thought.updateMany(
                        {
                            _id: user.thoughts
                        },
                        {
                            username: req.body.username
                        }
                    );

                    /* 3. b. If the user's username has been updated, we need to change the username of the user's associated reactions to the updated username. */
                    const thoughts = await Thought.find(
                        { 'reactions.username': user.username },
                    );

                    thoughts.forEach(async (thought, data, err) => {
                        for (const reaction of thought.reactions) {
                            if (reaction.username === user.username) {
                                reaction.username = req.body.username;
                            }
                        }

                        await thought.save();
                    });

                    /* 3. c. Update the user in the database. */
                    const updatedUser = await User.findByIdAndUpdate(req.params.userId,
                        req.body,
                        {
                            new: true
                        })

                    /* 3. d. Send back the updated user information to the client. */
                    res.status(200).json(updatedUser);
                }
            }

        })
        .catch(error => res.status(500).json(error));
}

module.exports = {
    addFriend, createUser, deleteUser, getUsers, getUser, removeFriend, updateUser
}