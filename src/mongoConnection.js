
const { MongoClient } = require('mongodb');
const uri = "mongodb+srv://minor:minor%401234@cluster0.9sgci.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const collection = client.db("test").collection("devices");
  // perform actions on the collection object
  if (err) {
    return console.log(err);
  }
  console.log('Database connected');
  client.close();
});

// const mongoose = require('mongoose');
// const uri = 'mongodb+srv://minor:minor@1234@cluster0.9sgci.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';

// mongoose.connect(uri, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true
// })
// .then(() => {
//   console.log('MongoDB Connected…')
// })
// .catch(err => console.log(err))