const { User, Thought } = require('../models');

/* Create a reaction stored in a single thought's reactions array field */
function createReaction(req, res) {
    Thought.findByIdAndUpdate(req.params.thoughtId, { $push: { reactions: req.body } }, { new: true })
        .then((thought) => thought ? res.status(200).json(thought) : res.status(404).json({ message: "No thought found with that ID!" }))
        .catch((error) => res.status(500).json(error));
}

/* Create a thought. */
/*
 *  When a thought is created we must:
 *      1. Find a user that matches the userId provided in the request body.
 *      2. If no user is found, return an informative message to the client.
 *      3. If the username of the user found doesn't match the user with that userId, return an informative message.
 *      4. Otherwise, if the user information is valid:
 *          a. Create a new thought entry in the database.
 *          b. Add the thought to the list of thoughts of the user.
 *          c. Save the updated user.
 *          d. Return the newly created thought data.
 */
function createThought(req, res) {
    /* 1. Find a user that matches the userId provided in the request body. */
    User.findById(req.body.userId)
        .then(async (user) => {
            if (!user) {
                /* 2. If no user is found, return an informative message to the client. */
                res.status(404).json({ message: "No user found with that ID!" });
            } else if (req.body.username !== user.username) {
                /* 3. If the username of the user found doesn't match the user with that userId, return an informative message. */
                res.status(400).json({ message: "The username doesn't match the user with the provided ID!" });
            } else {
                /* 4. Otherwise, if the user information is valid: */
                /* 4. a. Create a new thought entry in the database. */
                try {
                    const thought = await Thought.create(
                        {
                            thoughtText: req.body.thoughtText,
                            username: req.body.username
                        }
                    );

                    /* 4. b. Add the thought to the list of thoughts of the user. */
                    user.thoughts.push(thought._id);

                    /* 4. c. Save the updated user. */
                    await user.save();

                    /* 4. d. Return the newly created thought data. */
                    res.status(200).json(thought);
                } catch (error) {
                    res.status(500).json(error);
                }
            }
        })
        .catch((error) => res.status(500).json(error));
}

/* 
 *  Delete a reaction by its id. 
 *  
 *  NOTE: I'm querying the database for information about the thought twice because I didn't know how to make
 *  a database query to update a reaction and have it return information about both the newly updated thought and
 *  how many documents were modified in the same result. Thus, I have one call to see if the thoughtId is correct,
 *  and then another to see if the reactionId is correct and return the updated thought information.
 */
function deleteReaction(req, res) {
    Thought.findById(req.params.thoughtId)
        .then(async (thought) => {
            if (!thought) {
                res.status(404).json({ message: "No thought found with that ID!" });
            } else {
                Thought.findOneAndUpdate(
                    { _id: req.params.thoughtId, 'reactions.reactionId': req.params.reactionId },
                    { $pull: { reactions: { reactionId: req.params.reactionId } } },
                    { new: true }
                )
                    .then((thought) => thought ? res.status(200).json(thought) : res.status(404).json({ message: "No reaction found with that ID!" }))
                    .catch((error) => res.status(500).json(error));
            }
        })
        .catch((error) => res.status(500).json(error));
}

/* Delete a thought by its id. */
/* 
 *  When a thought is deleted we must:
 *      1. Delete the thought in the database.
 *      2. If no thought was found, return an informative message to the client.
 *      3. Otherwise:
 *          a. Get the user who created the thought.
 *          b. Remove the thought from the user's list of thoughts.
 *          c. Save the updated user information.
 *          d. Return an informative message to the client.
 */
function deleteThought(req, res) {
    /* 1. Delete the thought in the database. */
    Thought.findByIdAndDelete(req.params.thoughtId)
        .then(async (thought) => {
            /* 2. If no thought was found, return an informative message to the client. */
            if (!thought) {
                res.status(404).json({ message: "No thought found with that ID!" });
            } else {
                /* 3. Otherwise: */
                /* 3. a. Get the user who created the thought. */
                const user = await User.updateOne(
                    { username: thought.username },
                    { $pull: { thoughts: thought._id } }
                );

                res.status(200).json({ message: "Thought and associated reactions deleted!" });
            }
        })
        .catch((error) => res.status(500).json(error));
}

/* Get a single thought by its id. */
function getThought(req, res) {
    Thought.findById(req.params.thoughtId)
        .then((thought) => thought ? res.status(200).json(thought) : res.status(404).json({ message: "No thought found with that ID!" }))
        .catch((error) => res.status(500).json(error));
}

/* Get all thoughts */
function getThoughts(req, res) {
    Thought.find({})
        .then(thoughts => res.status(200).json(thoughts))
        .catch(error => res.status(500).json(error));
}

/* 
 *  Update a thought by its id.
 *
 *  NOTE: Since I'm handling updating the thought and reaction usernames in the update user route,
 *  I'm only going to allow the thoughtText to be updated in the update thought route.
 */
function updateThought(req, res) {
    Thought.findByIdAndUpdate(req.params.thoughtId, req.body, { new: true })
        .then((thought) => thought ? res.status(200).json(thought) : res.status(404).json({ message: "No thought found with that ID!" }))
        .catch((error) => res.status(500).json(error))
}

module.exports = { createReaction, createThought, deleteReaction, deleteThought, getThought, getThoughts, updateThought };