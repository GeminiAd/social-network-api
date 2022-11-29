# Social Network API

<a href="#description">Description</a> •
<a href="#usage">Usage</a> •
<a href="#user-routes">User Routes</a> •
<a href="#thought-routes">Thought Routes</a> •
<a href="#technologies-used">Technologies Used</a> •
<a href="#concepts-demonstrated">Concepts Demonstrated</a> •
<a href="#author">Author</a>

---

[YouTube video demo](https://youtu.be/kSqbNP2xTeA)

---

## Description

This is an API for a non-existent social network. There is no front-end. If there was a front-end though, this would be the back-end API it uses. This social network connects three models: there are users, thoughts, and reactions. Users have friends and can create posts (called thoughts), and can comment on posts (called reactions). Each user has a list of friends and associate thoughts while each thought has a list of associated reactions. This API is just an interface to perform CRUD operations on users, friends, thoughts, and reactions. This API uses [MongoDB](https://www.mongodb.com/home) to store all information about users, thoughts, and reactions, so all IDs are of the [MongoDB ObjectId](https://www.mongodb.com/docs/manual/reference/method/ObjectId/) format. See <a href="#usage">Usage</a> for how to make requests.

## Usage

Since this API isn't deployed, you're going to have to download and run the program yourself to start making requests. You must have [node.js](https://nodejs.org/en/) and the [npm](https://www.npmjs.com/) package manager installed to run this program. To download, clone or fork the repository down to a directory. Navigate to that directory in a terminal window. Type `npm install` to install all package dependencies. Then type `npm run seed` to seed the program. To run the program, type `npm run start`. To make a request, make an http request to root/route. The root directory is going to be http://localhost:3001, and since the route to get all users is /api/users, you would make a GET request to http://localhost:3001/api/users. A full list of each route with each path, http method, and parameters is listed below.

## User Routes

<a href="#get-all-users">Get All Users</a> •
<a href="#get-user-by-id">Get User By Id</a> •
<a href="#create-a-user">Create a User</a> •
<a href="#update-a-user">Update a User</a> •
<a href="#delete-a-user">Delete a User</a> •
<a href="#add-a-friend">Add a Friend</a> •
<a href="#remove-a-friend">Remove a Friend</a>

### Get All Users

Gets information about all users and returns it to the client.

#### Route

GET&emsp;`/api/users`

#### Response

A GET request to `/api/users` should always succeed.

Sample Request Path:  
`http://localhost:3001/api/users/`

Sample Response:

```json
[
  {
    "_id": "6383d5a7996394010dc894ae",
    "username": "GeminiAd",
    "email": "geminiad@yahoo.com",
    "thoughts": [
      "6383d5a7996394010dc894a9",
      "6383d5a7996394010dc894ac",
      "6383edbc5443050da061f8ac"
    ],
    "friends": ["6383d5a7996394010dc894af"],
    "friendCount": 1
  },
  {
    "_id": "6383d5a7996394010dc894af",
    "username": "ChairmanMiao",
    "email": "musicismytherapy@gmail.com",
    "thoughts": ["6383d5a7996394010dc894ab"],
    "friends": ["6383d5a7996394010dc894ae", "6383d5a7996394010dc894b0"],
    "friendCount": 2
  },
  {
    "_id": "6383d5a7996394010dc894b0",
    "username": "amiko",
    "email": "amiko@gmail.com",
    "thoughts": ["6383d5a7996394010dc894aa"],
    "friends": ["6383d5a7996394010dc894af"],
    "friendCount": 1
  }
]
```

### Get User By ID

Gets information about the user with the given ID. Also populates their associated thought and friend data.

#### Routes

GET&emsp;`/api/users/{userId}`

#### Parameters

Path Parameters

`userId`&emsp;&emsp;string&emsp;&emsp;&emsp;&emsp;`required`  
The ID of the user whose information you wish to get. Must be of the [MongoDB ObjectId](https://www.mongodb.com/docs/manual/reference/method/ObjectId/) format.

#### Response

- If the userId isn't a valid MongoDB ObjectId an error is returned.

- If the userId is a valid MongoDB ObjectId but no user exists with that ID a message is returned:

```json
{
  "message": "No user found with that ID!"
}
```

- If a user is found with that userId, the user is returned as JSON data along with their associated friends and thoughts.

Sample Request Path:  
`http://localhost:3001/api/users/6383d5a7996394010dc894ae`

Sample Response:

```json
{
  "_id": "6383d5a7996394010dc894ae",
  "username": "GeminiAd",
  "email": "geminiad@yahoo.com",
  "thoughts": [
    {
      "_id": "6383d5a7996394010dc894a9",
      "thoughtText": "Heres a cool thought....",
      "createdAt": "11/27/2022 at 1:24:55 PM",
      "username": "GeminiAd",
      "reactions": [
        {
          "reactionId": "6383d5a7996394010dc894a4",
          "reactionBody": "Cool thought bro!",
          "username": "ChairmanMiao",
          "createdAt": "11/27/2022 at 1:24:55 PM"
        },
        {
          "reactionId": "6383d5a7996394010dc894a4",
          "reactionBody": "Yay! A thought!",
          "username": "amiko",
          "createdAt": "11/27/2022 at 1:24:55 PM"
        }
      ],
      "reactionCount": 2
    },
    {
      "_id": "6383d5a7996394010dc894ac",
      "thoughtText": "Fire! Fire!",
      "createdAt": "11/27/2022 at 1:24:55 PM",
      "username": "GeminiAd",
      "reactions": [
        {
          "reactionId": "6383d5a7996394010dc894a4",
          "reactionBody": "Settle down, Beavis.",
          "username": "ChairmanMiao",
          "createdAt": "11/27/2022 at 1:24:55 PM"
        }
      ],
      "reactionCount": 1
    }
  ],
  "friends": [
    {
      "_id": "6383d5a7996394010dc894af",
      "username": "ChairmanMiao",
      "email": "musicismytherapy@gmail.com",
      "thoughts": ["6383d5a7996394010dc894ab"],
      "friends": ["6383d5a7996394010dc894ae", "6383d5a7996394010dc894b0"],
      "friendCount": 2
    }
  ],
  "friendCount": 1
}
```

### Create a User

Creates a user.

#### Route

POST&emsp;`/api/users/`

#### Parameters

Request Body Parameters

`username`&emsp;&emsp;string&emsp;&emsp;&emsp;&emsp;`required`  
A string representing the desired username. This is required and the username must be unique - you can't create a user if the username is already taken by some other user.

`email`&emsp;&emsp;string&emsp;&emsp;&emsp;&emsp;`required`  
The email address of the user to create. This must be a e-mail address of the form someName@someDomain.com.

#### Response

- If an invalid request is sent, an error is returned (such as if the email address is invalid).
- If the request was successful, information about the newly created user is returned.

Sample Request Path:  
`http://localhost:3001/api/users/`

Sample request body:

```json
{
  "username": "EmperorZog",
  "email": "emperorzog@gmail.com"
}
```

Sample response:

```json
{
  "username": "EmperorZog",
  "email": "emperorzog@gmail.com",
  "thoughts": [],
  "friends": [],
  "_id": "63854a891a72aae8e0afae0c",
  "friendCount": 0
}
```

### Update a User

Updates a user. If the username is updated, the username field of all of the user's associated thoughts and reactions are updated as well.

#### Route

PUT&emsp;`/api/users/{userId}`

#### Parameters

Path Parameters

`userId`&emsp;&emsp;string&emsp;&emsp;&emsp;&emsp;`required`  
The ID of the user whose information you wish to update. Must be of the [MongoDB ObjectId](https://www.mongodb.com/docs/manual/reference/method/ObjectId/) format.

Request Body Parameters

`username`&emsp;&emsp;string&emsp;&emsp;&emsp;&emsp;`optional`  
A string representing the desired username. This is an optional field, but if included, the new username must be unique - you can't update a username if that username is already taken by some other user.

`email`&emsp;&emsp;string&emsp;&emsp;&emsp;&emsp;`optional`  
The email address of the user to create. This must be a e-mail address of the form someName@someDomain.com.

#### Response

- If the username is already taken or the email address, an error is sent back to the client.
- If there is no user that matches the userId in the path, a message is sent back to the client:

```json
{
  "message": "No user found with that ID!"
}
```

- If the userId is valid, the user is updated in the database along with the user's thoughts and reactions, and the updated user information is sent back to the client.

Sample Request Path:  
`http://localhost:3001/api/users/6383d5a7996394010dc894ae`

Sample Request Body:

```json
{
  "username": "Reverend",
  "email": "reverend@gmail.com"
}
```

Sample Response:

```json
{
  "_id": "6383d5a7996394010dc894ae",
  "username": "Reverend",
  "email": "reverend@gmail.com",
  "thoughts": ["6383d5a7996394010dc894a9", "6383d5a7996394010dc894ac"],
  "friends": ["6383d5a7996394010dc894af"],
  "friendCount": 1
}
```

### Delete a User

Deletes a user. Also deletes all of the user's associated thoughts and reactions and removes any friend relationships that exist between the user being deleted and other users.

#### Routes

DELETE&emsp;`/api/users/{userId}`

#### Parameters

Path Parameters

`userId`&emsp;&emsp;string&emsp;&emsp;&emsp;&emsp;`required`  
The ID of the user whose information you wish to delete. Must be of the [MongoDB ObjectId](https://www.mongodb.com/docs/manual/reference/method/ObjectId/) format.

#### Response

- If userId is not a valid [MongoDB ObjectId](https://www.mongodb.com/docs/manual/reference/method/ObjectId/), an error will be returned.
- If userId is a valid ObjectId but no user exists with that userId, a message is sent back:

```json
{
  "message": "No user found with that ID!"
}
```

- If the userId is valid and matches a user in the database, the user is deleted and a message is sent back.

Sample Request Path:  
`http://localhost:3001/api/users/6383d5a7996394010dc894ae`

Sample Response:

```json
{
  "message": "User and associated thoughts deleted!"
}
```

### Add a Friend

Adds a friend relationship between the user with the ID of userId and the user with the ID of friendId.

#### Route

POST&emsp;`api/users/{userId}/friends/{friendId}`

#### Parameters

Path Parameters

`userId`&emsp;&emsp;string&emsp;&emsp;&emsp;&emsp;`required`  
The ID of the first user you wish to create a friend relationship between. Must be of the [MongoDB ObjectId](https://www.mongodb.com/docs/manual/reference/method/ObjectId/) format.

`friendId`&emsp;&emsp;string&emsp;&emsp;&emsp;&emsp;`required`  
The ID of the second user you wish to create a friend relationship between. Must be of the [MongoDB ObjectId](https://www.mongodb.com/docs/manual/reference/method/ObjectId/) format.

#### Response

- If either the friendId or userId aren't valid ObjectIds, an error is returned.
- If userId doesn't match a user in the database, a message is sent back:

```json
{
  "message": "No user found with that ID!"
}
```

- If friendId doesn't match a user in the database, a message is sent back and nothing is updated:

```json
{
  "message": "No friend found with that ID!"
}
```

- If the friend relationship already exists, a message will be sent back to the client and no friend relationship will be created:

```json
{
  "message": "That friend relationship already exists!"
}
```

- If the request is valid, the updated information of the user matching the given userId is returned:

Sample Request Path:  
`http://localhost:3001/api/users/6385553a048cf42def3194d9/friends/6385553a048cf42def3194db`

Sample Response:

```json
{
  "_id": "6385553a048cf42def3194d9",
  "username": "GeminiAd",
  "email": "geminiad@yahoo.com",
  "thoughts": ["6385553a048cf42def3194d4", "6385553a048cf42def3194d7"],
  "friends": ["6385553a048cf42def3194da", "6385553a048cf42def3194db"],
  "friendCount": 2
}
```

### Remove a Friend

Removes the friend relationship between the user with the ID of userId and the user with the ID of friendId.

#### Route

DELETE&emsp;`api/users/{userId}/friends/{friendId}`

#### Parameters

Path Parameters

`userId`&emsp;&emsp;string&emsp;&emsp;&emsp;&emsp;`required`  
The ID of the first user you wish to remove the friend relationship from. Must be of the [MongoDB ObjectId](https://www.mongodb.com/docs/manual/reference/method/ObjectId/) format.

`friendId`&emsp;&emsp;string&emsp;&emsp;&emsp;&emsp;`required`  
The ID of the second user you wish to remove the friend relationship from. Must be of the [MongoDB ObjectId](https://www.mongodb.com/docs/manual/reference/method/ObjectId/) format.

#### Response

- If either userId or friendId are not valid [MongoDB ObjectIds](https://www.mongodb.com/docs/manual/reference/method/ObjectId/), an error is returned.
- If the database can't find any user with the ID of userId, a message is sent and nothing is updated:

```json
{
  "message": "No user found with that ID!"
}
```

- If the database can't find any user with the ID of friendId, a message is sent back and nothing is updated:

```json
{
  "message": "No friend found with that ID!"
}
```

- If both userId and friendId match users in the database but the friend relationship doesn't exist, a message is sent back stating that and nothing is updated:

```json
{
  "message": "That friend relationship doesn't exist!"
}
```

- If both the userId and friendId match users in the database and that friend relationship exists, the friend relationship is removed, that information is saved to the database, and the updated user information of the user with the id of userId is returned:

Sample Request Path:  
`http://localhost:3001/api/users/6385553a048cf42def3194d9/friends/6385553a048cf42def3194db`

Sample Response:

```json
{
  "_id": "6385553a048cf42def3194d9",
  "username": "GeminiAd",
  "email": "geminiad@yahoo.com",
  "thoughts": ["6385553a048cf42def3194d4", "6385553a048cf42def3194d7"],
  "friends": ["6385553a048cf42def3194da"],
  "friendCount": 1
}
```

## Thought Routes

<a href="#get-all-thoughts">Get All Thoughts</a> •
<a href="#get-thought-by-id">Get Thought By Id</a> •
<a href="#create-a-thought">Create a Thought</a> •
<a href="#update-a-thought">Update a Thought</a> •
<a href="#delete-a-thought">Delete a Thought</a> •
<a href="#create-a-reaction">Create a Reaction</a> •
<a href="#delete-a-reaction">Delete a Reaction</a>

### Get All Thoughts

Gets and returns all thoughts and their reactions.

#### Route

GET&emsp;`/api/thoughts`

#### Response

A GET request to get all thoughts should always succeed, and information about all thoughts is returned.

Sample Request Path:  
`http://localhost:3001/api/thoughts/`

Sample Response:

```json
[
  {
    "_id": "6385553a048cf42def3194d4",
    "thoughtText": "Heres a cool thought....",
    "createdAt": "11/28/2022 at 4:41:29 PM",
    "username": "GeminiAd",
    "reactions": [
      {
        "reactionId": "63855539048cf42def3194cf",
        "reactionBody": "Cool thought bro!",
        "username": "ChairmanMiao",
        "createdAt": "11/28/2022 at 4:41:29 PM"
      },
      {
        "reactionId": "63855539048cf42def3194cf",
        "reactionBody": "Yay! A thought!",
        "username": "amiko",
        "createdAt": "11/28/2022 at 4:41:29 PM"
      }
    ],
    "reactionCount": 2
  },
  {
    "_id": "6385553a048cf42def3194d5",
    "thoughtText": "I like thoughts!",
    "createdAt": "11/28/2022 at 4:41:29 PM",
    "username": "amiko",
    "reactions": [
      {
        "reactionId": "63855539048cf42def3194cf",
        "reactionBody": "Me too!",
        "username": "GeminiAd",
        "createdAt": "11/28/2022 at 4:41:29 PM"
      },
      {
        "reactionId": "63855539048cf42def3194cf",
        "reactionBody": "Yeah!!",
        "username": "ChairmanMiao",
        "createdAt": "11/28/2022 at 4:41:29 PM"
      }
    ],
    "reactionCount": 2
  },
  {
    "_id": "6385553a048cf42def3194d6",
    "thoughtText": "This API sucks",
    "createdAt": "11/28/2022 at 4:41:29 PM",
    "username": "ChairmanMiao",
    "reactions": [
      {
        "reactionId": "63855539048cf42def3194cf",
        "reactionBody": "Hey, you try building a nice-looking server back-end",
        "username": "GeminiAd",
        "createdAt": "11/28/2022 at 4:41:29 PM"
      }
    ],
    "reactionCount": 1
  },
  {
    "_id": "6385553a048cf42def3194d7",
    "thoughtText": "Fire! Fire!",
    "createdAt": "11/28/2022 at 4:41:29 PM",
    "username": "GeminiAd",
    "reactions": [
      {
        "reactionId": "63855539048cf42def3194cf",
        "reactionBody": "Settle down, Beavis.",
        "username": "ChairmanMiao",
        "createdAt": "11/28/2022 at 4:41:29 PM"
      }
    ],
    "reactionCount": 1
  }
]
```

### Get Thought By ID

Get a single thought by its ID.

#### Route

GET&emsp;`/api/thoughts/{thoughtId}`

#### Parameters

Path Parameters

`thoughtId`&emsp;&emsp;string&emsp;&emsp;&emsp;&emsp;`required`  
The ID of the thought you wish to get. Must be of the [MongoDB ObjectId](https://www.mongodb.com/docs/manual/reference/method/ObjectId/) format.

#### Response

- If thoughtId isn't a valid [MongoDB ObjectId](https://www.mongodb.com/docs/manual/reference/method/ObjectId/), an error is returned.
- If thoughtId is a valid ObjectId but no thoughts have that ID, a message is returned and nothing is updated:

```json
{
  "message": "No thought found with that ID!"
}
```

- If thoughtId is a valid ObjectId, the thought and its associated reactions are returned:

Sample Request Path:  
`http://localhost:3001/api/thoughts/`

Sample Response:

```json
{
  "_id": "6385553a048cf42def3194d7",
  "thoughtText": "Fire! Fire!",
  "createdAt": "11/28/2022 at 4:41:29 PM",
  "username": "GeminiAd",
  "reactions": [
    {
      "reactionId": "63855539048cf42def3194cf",
      "reactionBody": "Settle down, Beavis.",
      "username": "ChairmanMiao",
      "createdAt": "11/28/2022 at 4:41:29 PM"
    }
  ],
  "reactionCount": 1
}
```

### Create a Thought

Creates a thought.

#### Route

POST&emsp;`/api/thoughts/`

#### Parameters

Request Body Parameters

`thoughtText`&emsp;&emsp;string&emsp;&emsp;&emsp;&emsp;`required`  
The content of the thought. Must be a minimum of 1 and maximum of 280 characters in length.

`username`&emsp;&emsp;string&emsp;&emsp;&emsp;&emsp;`required`  
The username of the user that created the thought.

`userId`&emsp;&emsp;string&emsp;&emsp;&emsp;&emsp;`required`  
The ID of the user who created the thought. Must be of the [MongoDB ObjectId](https://www.mongodb.com/docs/manual/reference/method/ObjectId/) format.

#### Response

- If userId isn't a valid [MongoDB ObjectId](https://www.mongodb.com/docs/manual/reference/method/ObjectId/), an error is returned.
- If userId is valid but doesn't match any user in the database, a message is returned and nothing is created:

```json
{
  "message": "No user found with that ID!"
}
```

- If userId is valid and matches a user but the username doesn't match the found user's username, a message is returned and nothing is created:

```json
{
  "message": "The username doesn't match the user with the provided ID!"
}
```

- If the userId and username and thoughtText fields are all valid, a new thought is created and information about that thought is returned:

Sample Request Path:  
`http://localhost:3001/api/thoughts/`

Sample Request Body:

```json
{
  "thoughtText": "This is a test thought",
  "username": "GeminiAd",
  "userId": "6385553a048cf42def3194d9"
}
```

Sample Response:

```json
{
  "thoughtText": "This is a test thought",
  "createdAt": "11/28/2022 at 4:41:33 PM",
  "username": "GeminiAd",
  "_id": "6385633f1f9eec713f93c548",
  "reactions": [],
  "reactionCount": 0
}
```

### Update a Thought

Updates a thought by its ID. Since I automatically update the username of a thought and reaction when a user changes their username, I'm not allowing the username to be updated, only the thoughtText.

#### Route

PUT&emsp;`/api/thoughts/{thoughtId}`

#### Parameters

Path Parameters

`thoughtId`&emsp;&emsp;string&emsp;&emsp;&emsp;&emsp;`required`  
The ID of the thought you wish to update. Must be of the [MongoDB ObjectId](https://www.mongodb.com/docs/manual/reference/method/ObjectId/) format.

Request Body Parameters

`thoughtText`&emsp;&emsp;string&emsp;&emsp;&emsp;&emsp;`required`  
The content of the thought to update. Must be a minimum of 1 and maximum of 280 characters in length.

#### Response

- If the thoughtId isn't a valid [MongoDB ObjectId](https://www.mongodb.com/docs/manual/reference/method/ObjectId/), an error is returned.
- If the thoughtId is a valid ObjectId but doesn't match any thoughts in the database, a message is sent back and nothing is updated:

```json
{
  "message": "No thought found with that ID!"
}
```

- If the thoughtId is valid, matches a thought, and thoughtText is at least 1 character and at most 280 characters, the updated thought is returned.

Sample Request Path:  
`http://localhost:3001/api/thoughts/6385633f1f9eec713f93c548`

Sample Request Body:

```json
{
  "thoughtText": "This is a test. This is only a test."
}
```

Sample Response:

```json
{
  "_id": "6385633f1f9eec713f93c548",
  "thoughtText": "This is a test. This is only a test.",
  "createdAt": "11/28/2022 at 4:41:33 PM",
  "username": "GeminiAd",
  "reactions": [],
  "reactionCount": 0
}
```

### Delete a Thought

Delete a thought by its ID.

#### Route

DELETE&emsp;`api/thoughts/{thoughtId}`

#### Parameters

Path Parameters

`thoughtId`&emsp;&emsp;string&emsp;&emsp;&emsp;&emsp;`required`  
The ID of the thought you wish to delete. Must be of the [MongoDB ObjectId](https://www.mongodb.com/docs/manual/reference/method/ObjectId/) format.

#### Response

- If the thoughtId isn't a valid [MongoDB ObjectId](https://www.mongodb.com/docs/manual/reference/method/ObjectId/), an error is sent back.
- If the thoughtId is a valid ObjectId but doesn't match any thoughts, a message stating that is returned to the client and nothing is deleted:

```json
{
  "message": "No thought found with that ID!"
}
```

- If the thoughtId is valid and matches a thought that thought is deleted and removed from any user's thoughts array, and a message is sent back to the client:

Sample Request Path:  
`http://localhost:3001/api/thoughts/6385633f1f9eec713f93c548`

Sample Response:

```json
{
  "message": "Thought and associated reactions deleted!"
}
```

### Create a Reaction

Creates a new reaction to the thought matching the given thoughtId.

#### Route

POST&emsp;`/api/thoughts/{thoughtId}/reactions`

#### Parameters

Path Parameters

`thoughtId`&emsp;&emsp;string&emsp;&emsp;&emsp;&emsp;`required`  
The ID of the thought you wish to create a reaction to. Must be of the [MongoDB ObjectId](https://www.mongodb.com/docs/manual/reference/method/ObjectId/) format.

Request Body Parameters

`reactionBody`&emsp;&emsp;string&emsp;&emsp;&emsp;&emsp;`required`  
The content of the reaction. Has a maximum length of 280 characters.

`username`&emsp;&emsp;string&emsp;&emsp;&emsp;&emsp;`required`  
The username of the user that created this reaction.

#### Response

- If the thoughtId isn't a valid [MongoDB ObjectId](https://www.mongodb.com/docs/manual/reference/method/ObjectId/), an error is returned.
- If the thought is a valid ObjectId but doesn't match any thoughts in the database, a message is returned to the user and nothing is created:

```json
{
  "message": "No thought found with that ID!"
}
```

- If the thoughtId and the reactionBody and username are valid, a new reacion is created for the thought and the updated thought is sent back.

Sample Request Path:  
`http://localhost:3001/api/thoughts/63856a241f9eec713f93c552/reactions`

Sample Request Body:

```json
{
  "reactionBody": "This is another test comment.",
  "username": "GeminiAd"
}
```

Sample Response:

```json
{
  "_id": "63856a241f9eec713f93c552",
  "thoughtText": "This is a test thought",
  "createdAt": "11/28/2022 at 4:41:33 PM",
  "username": "GeminiAd",
  "reactions": [
    {
      "reactionId": "6385553d1f9eec713f93c535",
      "reactionBody": "This is another test comment.",
      "username": "GeminiAd",
      "createdAt": "11/28/2022 at 4:41:33 PM"
    }
  ],
  "reactionCount": 1
}
```

### Delete a Reaction

Delete a reaction by its ID for the thought with the ID of thoughtId.

#### Route

DELETE&emsp;`/api/thoughts/{thoughtId}/reactions/{reactionId}`

#### Parameters

Path Parameters

`thoughtId`&emsp;&emsp;string&emsp;&emsp;&emsp;&emsp;`required`  
The ID of the thought you wish to delete the reaction from. Must be of the [MongoDB ObjectId](https://www.mongodb.com/docs/manual/reference/method/ObjectId/) format.

`reactionId`&emsp;&emsp;string&emsp;&emsp;&emsp;&emsp;`required`  
The ID of the reaction you wish to delete. Must be of the [MongoDB ObjectId](https://www.mongodb.com/docs/manual/reference/method/ObjectId/) format.

#### Response

- If either the thoughtId or the reactionId aren't valid [MongoDB ObjectId](https://www.mongodb.com/docs/manual/reference/method/ObjectId/) an error is returned.
- If the thoughtId is valid but doesn't match any thoughts, a message is sent back and nothing is deleted:

```json
{
  "message": "No thought found with that ID!"
}
```

- If the thoughtId and reactionId are valid but the reactionId doesn't match any reaction in the thought, a message is sent back and nothing is deleted:

```json
{
  "message": "No reaction found with that ID!"
}
```

- Otherwise, if all parameters are valid, the API removes the reaction from the thought's list of reactions and sends back the updated thought to the client.

Sample Request Path:  
`http://localhost:3001/api/thoughts/63856a241f9eec713f93c552/reactions/6385553d1f9eec713f93c535`

Sample Response:

```json
{
  "_id": "63856a241f9eec713f93c552",
  "thoughtText": "This is a test thought",
  "createdAt": "11/28/2022 at 4:41:33 PM",
  "username": "GeminiAd",
  "reactions": [],
  "reactionCount": 0
}
```

## Technologies Used

- Using [mongoose](https://mongoosejs.com/) as an interface for a NoSQL [MongoDB Database](https://www.mongodb.com/home).
- Using [Express.js](https://expressjs.com/) as the controller for server routing.
- Using the [Node.js](https://nodejs.org/en/) JavaScript runtime environment.
- Programming in [JavaScript](https://www.javascript.com/).

## Concepts Demonstrated

- Using a MongoDB as a NoSQL model.
- Using express js as a controller.
- Using the node.js programming environment and general javascript knowledge.

## Author

Adam Ferro

- [Github](https://github.com/GeminiAd)
