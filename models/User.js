const { Schema, model, mongoose } = require('mongoose');

const userSchema = new Schema(
    {
        username: {
            type: String,
            unique: true,
            required: true,
            trim: true
        },
        email: {
            type: String,
            required: true,
            unique: true,
            /*
             *  The acceptance criteria doesn't explicitly state to convert the email address to lowercase. The RegEx
             *  I stole from the last homework challenge to validate an email only accepts lowercase letters, though. I don't
             *  feel like changing it, so I'm just changing the email address to lowercase as it makes more sense to me.
             */
            lowercase: true,
            match: /^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/
        },
        thoughts: [
            {
                type: mongoose.ObjectId,
                ref: 'thought'
            }
        ],
        friends: [
            {
                type: mongoose.ObjectId,
                ref: 'user'
            }
        ]
    },
    {
        virtuals: {
            friendCount: {
                get() {
                    return this.friends.length;
                }
            }
        }
    }
);

const User = model('user', userSchema);

module.exports = User;