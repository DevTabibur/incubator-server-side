// @ts-nocheck
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const jwt = require('jsonwebtoken');
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

function CheckJWTToken(req, res, next) {
  const hederAuth = req.headers.authorization
  if (!hederAuth) {
      return res.status(401).send({ message: 'unauthorized access.try again' })
  }
  else {
      const token = hederAuth.split(' ')[1]
      // console.log({ token });
      jwt.verify(token, `${process.env.TOKEN}`, (err, decoded) => {

          if (err) {
              console.log(err);
              return res.status(403).send({ message: 'forbidden access' })
          }
          // console.log('decoded', decoded);
          req.decoded = decoded;
          next()
      })
  }
  // console.log(hederAuth, 'inside checkjwt');

}


async function run() {
  try {
    await client.connect();
    const incubatorCollection = client.db("IncubatorApp").collection("data");
    const incubatorBlogCollection = client
      .db("IncubatorApp")
      .collection("blogs");

    // get read all blogs from backend
    app.get("/blogs", async (req, res) => {
      const query = {};
      const cursor = incubatorBlogCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });

    // get read all data from backend
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
    app.put("/delivery/:id", async (req, res) => {
      const id = req.params.id;
      const newQuantity = req.body;

      const deliver = newQuantity.quantity - 1;

      const query = { _id: ObjectId(id) };
      const options = { upsert: true };
      const updateDoc = {
        $set: {
          quantity: deliver,
        },
      };
      const result = await incubatorCollection.updateOne(
        query,
        updateDoc,
        options
      );
      res.send(result);
    });

    //UPDATE Quantity API ==> Increasing by user want
    app.put("/data/:id", async (req, res) => {
      const id = req.params.id;
      const updateProduct = req.body;
      const query = { _id: ObjectId(id) };
      const options = { upsert: true };
      const updateDoc = {
        $set: {
          quantity: updateProduct.newQuantity,
        },
      };

      const result = await incubatorCollection.updateOne(
        query,
        updateDoc,
        options
      );
      res.send(result);
    });

    // get read all new add-item from backend
    app.get("/add-item", async (req, res) => {
      const query = {};
      const cursor = incubatorCollection.find(query);
      const users = await cursor.toArray();
      res.send(users);
    });

    //add new item API
    app.post("/add-item", async (req, res) => {
      const newItem = req.body;
      const result = await incubatorCollection.insertOne(newItem);
      res.send(result);
    });

    


    // delete data from mongodb
    app.delete("/data/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await incubatorCollection.deleteOne(query);
      res.send(result);
    });

    // send data client to backend
    app.post("/data", async (req, res) => {
      const newUser = req.body;
      const result = await incubatorCollection.insertOne(newUser);
      res.send(result);
    });

    //JWT
    app.post('/signin', async (req, res) => {
      const user = req.body;

      const getToken = jwt.sign(user, `${process.env.TOKEN}`, {
          expiresIn: '1d'
      });

      res.send({ getToken });
  })

  // get items by email 
  app.get('/singleItem', CheckJWTToken, async (req, res) => {
      const decodedEmail = req.decoded.email;
      const email = req.query.email;
      if (email === decodedEmail) {
          const query = { email: email }
          const cursor = incubatorCollection.find(query)
          const items = await cursor.toArray()
          res.send(items)
      }
      else {
          return res.status(403).send({ message: 'forbidden access' })
      }
  })

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
