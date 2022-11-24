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
            get: (v) => `${v.toLocaleDateString()} at ${v.toLocaleTimeString()}`
        }
    },
    {
        _id: false,
        id: false,
        toObject: {
            getters: true
        },
        toJSON: {
            getters: true,
        },
        versionKey: false
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
            get: (v) => `${v.toLocaleDateString()} at ${v.toLocaleTimeString()}`
        },
        username: {
            type: String,
            required: true
        },
        reactions: [reactionSchema]
    },
    {
        id: false,
        toObject: {
            getters: true
        },
        toJSON: {
            getters: true,
            versionKey: false
        },
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