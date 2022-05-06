// @ts-nocheck
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

const express = require("express");
const cors = require("cors");
require("dotenv").config();
const port = process.env.PORT || 5000;

const app = express();

// middleware
app.use(cors());
app.use(express.json());

// mongodb atlas connect

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.hc4xz.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    await client.connect();
    const incubatorCollection = client.db("IncubatorApp").collection("data");

    // get all data from backend
    app.get("/data", async (req, res) => {
      const query = {};
      const cursor = incubatorCollection.find(query);
      const users = await cursor.toArray();
      res.send(users);
    });

    // Find _id using this API
    app.get("/data/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await incubatorCollection.findOne(query);
      res.send(result);
    });

    //UPDATE Quantity API ==> decreasing by one
    app.put('/data/:id', async (req, res) => {
      const id = req.params.id
      const newQuantity = req.body;
      const deliver = newQuantity.quantity - 1;
      const query = { _id: ObjectId(id) }
      const options = { upsert: true };
      const updateDoc = {
          $set: {
              quantity: deliver
          }
      }
      const result = await incubatorCollection.updateOne(query, updateDoc, options)
      res.send(result);
  })

  // add item
  app.post('/addItem', async (req, res) => {

    const newItem = req.body;

    const result = await collection.insertOne(newItem);
    res.send(result)
})


    // // send data client to backend
    // app.post("/add-item", async (req, res) => {
    //   const newUser = req.body;
    //   console.log("adding new user", newUser);
    //   const result = await incubatorCollection.insertOne(newUser);
    //   res.send(result);
    // });

    // // delete data from mongodb

    // app.delete('/add-item/:id', async (req, res)=>{
    //     const id = req.params.id;
    //     const query = {_id:ObjectId(id)};
    //     const result = await incubatorCollection.deleteOne(query);
    //     res.send(result)
    // })
  } finally {
    //   await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("HELLO WORLD!");
});

// port
app.listen(port, () => {
  console.log(`server is running on ${port}`);
});
