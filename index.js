const express = require('express')
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId
const cors = require('cors')

const app = express();
const port = 5000;

//Midleware
app.use(cors());
app.use(express.json());


//user: mydbuser1
//password: 00w20hMIWLUw9fGF


const uri = "mongodb+srv://mydbuser1:00w20hMIWLUw9fGF@cluster0.pgkyz.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


async function run() {
  try {
    await client.connect();

    const database = client.db("foodMasters");
    const userCollection = database.collection("users");

    // GET API
    app.get('/users', async(req, res)=> {
        const cursor = userCollection.find({});
        const users = await cursor.toArray();
        res.send(users)
    })

    app.get('/users/:id', async(req, res)=> {
        const id = req.params.id;
        const query = {_id: ObjectId(id)}
        const user = await userCollection.findOne(query)
        console.log('load user with id',id)
        res.send(user)
    })

    //POST API 
    app.post('/users', async(req, res)=>{
        const newUser = req.body
        const result = await userCollection.insertOne(newUser)
        console.log('added new user', result)
        res.json(result)
    })

    //UPDATE API
    app.put('/users/:id', async(req, res)=> {
      const id = req.params.id;
      const updatedUser = req.body;
      const filter = {_id: ObjectId(id)};
      const options = { upsert: true };
      const updateDoc = {
        $set: {
          name: updatedUser.name,
          email: updatedUser.email
        },
      };
      const result = await userCollection.updateOne(filter, updateDoc, options)
      res.json(result)
    })
    //DELETE API
    app.delete('/users/:id', async(req, res)=> {
        const id = req.params.id;
        const query = {_id: ObjectId(id) }
        const result = await userCollection.deleteOne(query)
        console.log('deleting user with id', result);
        res.json(result)

    })
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res)=> {
    res.send('Sending my second curd')
})

// app.get('/users', (req, res)=> {
//     console.log('hitting the users')
//     res.send('All users will come here')
// })

app.listen(port, ()=> {
    console.log('listnign the port')
})
