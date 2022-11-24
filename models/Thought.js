const { Schema, model, mongoose } = require('mongoose');

const reactionSchema = new Schema(
    {
        reactionId: {
            type: mongoose.ObjectId,
            default: new mongoose.Types.ObjectId()
        },
        reactionBody: {
            type: String,
            required: true,
            maxLength: 280
        },
        username: {
            type: String,
            required: true,
        },
        createdAt: {
            type: Date,
            default: new Date(),
            get: (v) => v.toLocaleString()
        }
    }
);

const thoughtSchema = new Schema(
    {
        thoughtText: {
            type: String,
            required: true,
            minLength: 1,
            maxLength: 280
        },
        createdAt: {
            type: Date,
            default: new Date(),
            get: (v) => v.toLocaleString()
        },
        username: {
            type: String,
            required: true
        },
        reactions: [reactionSchema]
    },
    {
        virtuals: {
            reactionCount: {
                get() {
                    return this.reactions.length;
                }
            }
        }
    }
);

const Thought = model('thought', thoughtSchema);

module.exports = Thought;