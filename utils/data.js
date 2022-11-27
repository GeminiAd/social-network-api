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
        username: "amiko"
    },
    {
        thoughtText: "This API sucks",
        username: "ChairmanMiao"
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