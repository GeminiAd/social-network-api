const userData = [
    {
        username: "GeminiAd",
        email: "GeminiAd@yahoo.com"
    },
    {
        username: "ChairmanMiao",
        email: "musicismytherapy@gmail.com"
    },
    {
        username: "amiko",
        email: "amiko@gmail.com"
    }
];

const reactionData = [
    {
        reactionBody: "Cool thought bro!",
        username: "ChairmanMiao"
    },
    {
        reactionBody: "Yay! A thought!",
        username: "amiko"
    }
];

const thoughtData = [
    {
        thoughtText: "Heres a cool thought....",
        username: "GeminiAd",
        reactions: reactionData
    },
    {
        thoughtText: "I like thoughts!",
        username: "amiko",
        reactions: [
            {
                reactionBody: "Me too!",
                username: "GeminiAd"
            },
            {
                reactionBody: "Yeah!!",
                username: "ChairmanMiao"
            }
        ]
    },
    {
        thoughtText: "This API sucks",
        username: "ChairmanMiao",
        reactions: [
            {
                reactionBody: "Hey, you try building a nice-looking server back-end",
                username: "GeminiAd"
            }
        ]
    },
    {
        thoughtText: "Fire! Fire!",
        username: "GeminiAd",
        reactions: [
            {
                reactionBody: "Settle down, Beavis.",
                username: "ChairmanMiao"
            },
        ]
    }
];

module.exports = { userData, thoughtData };