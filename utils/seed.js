const connection = require('../config/connection');
const { User, Thought } = require('../models');
const { userData, thoughtData } = require('./data');

connection.on('error', (err) => err);

connection.once('open', async () => {
  console.log('connected');

  // Drop existing users and thoughts
  await User.deleteMany({});
  await Thought.deleteMany({});

  const thoughts = await Thought.insertMany(thoughtData);
  //console.log(thoughts[0]);

  const users = await User.insertMany(userData);
  users[0].friends.push(users[1]._id);
  users[0].thoughts.push(thoughts[0]._id, thoughts[3]._id);
  users[1].friends.push(users[0]._id, users[2]._id);
  users[1].thoughts.push(thoughts[2]._id);
  users[2].friends.push(users[1]._id);
  users[2].thoughts.push(thoughts[1]._id);

  // await User.populate(users, { path: 'friends'})
  //console.log(users);
  await users[0].save();
  await users[1].save();
  await users[2].save();

  // const testUser = await User.findOne({username: "GeminiAd"}).populate(['friends', 'thoughts']);
  // console.log(testUser.toObject({virtuals: true}));

  console.info('Seeding complete! 🌱');
  process.exit(0);
});